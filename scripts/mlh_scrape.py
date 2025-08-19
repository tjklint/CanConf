import argparse
import json
import re
import sys
from pathlib import Path
from typing import Optional, List, Dict
import unicodedata

from playwright.sync_api import sync_playwright

PROVINCE_CODES = {"ON","QC","BC","AB","MB","SK","NS","NB","NL","PE","YT","NT","NU"}
PROVINCE_FULL = {
    "ONTARIO":"ON","QUEBEC":"QC","BRITISH COLUMBIA":"BC","ALBERTA":"AB","MANITOBA":"MB",
    "SASKATCHEWAN":"SK","NOVA SCOTIA":"NS","NEW BRUNSWICK":"NB","NEWFOUNDLAND AND LABRADOR":"NL",
    "PRINCE EDWARD ISLAND":"PE","YUKON":"YT","NORTHWEST TERRITORIES":"NT","NUNAVUT":"NU"
}

def extract_province(location: str) -> Optional[str]:
    if not location:
        return None
    # Strip accents for robust province matching (e.g., Québec -> Quebec)
    def _unaccent(s: str) -> str:
        return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    parts = [p.strip() for p in re.split(r"[,/]", location)]
    for p in reversed(parts):
        up = _unaccent(p).upper()
        if up in PROVINCE_CODES:
            return up
        if up in PROVINCE_FULL:
            return PROVINCE_FULL[up]
    return None

def is_canadian_location(location: str) -> bool:
    if not location: return False
    if "canada" in location.lower(): return True
    if extract_province(location): return True
    return False

def normalize_name(name: str) -> str:
    return re.sub(r"\s+", " ", name).strip().lower()

def scrape_events(url: str) -> List[Dict]:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/126.0.0.0 Safari/537.36"
            ),
            locale="en-CA",
            timezone_id="America/Toronto",
        )
        page = ctx.new_page()
        page.set_default_navigation_timeout(60_000)
        page.set_default_timeout(60_000)
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=60_000)
        except Exception:
            # Fallback if the page holds open network connections preventing networkidle
            page.goto(url, wait_until="load", timeout=60_000)

        # Try to accept cookies if a banner exists (best-effort, ignore failures)
        try:
            page.locator('button:has-text("Accept")').first.click(timeout=1500)
        except Exception:
            pass

        # Attempt to click any visible "Load more/Show more" button a few times
        for _ in range(5):
            try:
                btn = page.locator('button:has-text("Load more"), button:has-text("Show more")').first
                if btn.is_visible():
                    btn.click()
                    page.wait_for_timeout(1200)
                else:
                    break
            except Exception:
                break

        # Robust infinite scroll until height stops growing
        last_h = 0
        for _ in range(20):
            h = page.evaluate("document.body.scrollHeight")
            if h <= last_h:
                break
            last_h = h
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(1000)

        # Ensure potential cards are present before scraping
        try:
            page.wait_for_selector('[data-test="event-card"], article, .event, .event-card, .sc-card, .card', timeout=8000)
        except Exception:
            pass

        cards = page.evaluate(
            """
        () => {
          const nodes = Array.from(document.querySelectorAll(
            '[data-test="event-card"], article, .event, .event-card, .sc-card, .card'
          ));
          const pickText = (root, sels) => {
            for (const sel of sels) {
              const el = root.querySelector(sel);
              if (el && el.textContent) return el.textContent.trim();
            }
            return null;
          };
          const absoluteHref = (a) => {
            try { return new URL(a.getAttribute('href'), document.baseURI).href; }
            catch { return null; }
          };
          const items = nodes.map(card => {
            const name = pickText(card, ['[data-test="event-name"]','h3','h2','a[title]','.event-name','.card-title']);
            const date = pickText(card, ['[data-test="event-date"]','time','.event-date','.date']);
            const location = pickText(card, ['[data-test="event-location"]','[class*="location"]','address','.event-location','p']);
            const anchors = Array.from(card.querySelectorAll('a[href]'));
            let website = null;
            for (const a of anchors) {
              const href = absoluteHref(a) || '';
              if (href.startsWith('http') && !href.includes('mlh.io')) { website = href; break; }
            }
            if (!website && anchors.length) website = absoluteHref(anchors[0]);
            return { name, date, location, website };
          }).filter(e => e.name && (e.date || e.when) && e.location);
          // Deduplicate by name
          const seen = new Set();
          const out = [];
          for (const e of items) {
            const key = (e.name || '').trim().toLowerCase();
            if (!key || seen.has(key)) continue;
            seen.add(key);
            out.push(e);
          }
          return out;
        }
            """
        )

        # If DOM scraping fails, try pulling from Next.js data if present
        if not cards or len(cards) == 0:
            try:
                next_data = page.evaluate("""
                () => {
                  const s = document.querySelector('script#__NEXT_DATA__') || document.querySelector('script[id="__NEXT_DATA__"]');
                  if (!s) return null;
                  try { return JSON.parse(s.textContent || '{}'); } catch { return null; }
                }
                """)
                if next_data:
                    # Heuristic: walk the JSON to find objects with name/location/date
                    def _walk(obj):
                        stack = [obj]
                        found = []
                        while stack:
                            cur = stack.pop()
                            if isinstance(cur, list):
                                stack.extend(cur)
                            elif isinstance(cur, dict):
                                if (
                                    isinstance(cur.get('name'), str)
                                    and (cur.get('location') or cur.get('city') or cur.get('country'))
                                    and (cur.get('date') or cur.get('start') or cur.get('startDate') or cur.get('when'))
                                ):
                                    found.append({
                                        'name': cur.get('name'),
                                        'date': cur.get('date') or cur.get('when') or cur.get('start') or cur.get('startDate'),
                                        'location': cur.get('location') or cur.get('city') or cur.get('country'),
                                        'website': cur.get('website') or cur.get('url') or None,
                                    })
                                for v in cur.values():
                                    stack.append(v)
                        # Dedup by name
                        out = []
                        seen = set()
                        for e in found:
                            k = (e.get('name') or '').strip().lower()
                            if not k or k in seen: continue
                            seen.add(k)
                            out.append(e)
                        return out
                    cards = _walk(next_data)
            except Exception:
                pass

        browser.close()
        return cards or []

def build_event_obj(raw: Dict) -> Dict:
    loc = raw.get("location","").strip()
    prov = extract_province(loc)
    return {
        "name": raw.get("name","").strip(),
        "date": raw.get("date","").strip(),
        "location": loc,
        "website": (raw.get("website") or "").strip() or "https://mlh.io/seasons/2026/events",
        "province": prov or "",
        "type": "hackathon",
        "tags": ["hackathon", "student", "mlh", "canada", "programming", "competition"],
        "isStudentFocused": True
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--existing", default="existing.json", help="Path to existing events JSON")
    ap.add_argument("--url", default="https://mlh.io/seasons/2026/events")
    ap.add_argument("--pretty", action="store_true")
    args = ap.parse_args()

    existing_path = Path(args.existing)
    existing_names = set()
    if existing_path.exists():
        try:
            data = json.loads(existing_path.read_text(encoding="utf-8"))
            for e in data.get("events", []):
                n = e.get("name")
                if n: existing_names.add(normalize_name(n))
        except Exception as e:
            print(f"Failed to read existing list: {e}", file=sys.stderr)

    raw_events = scrape_events(args.url)
    canadian = [r for r in raw_events if is_canadian_location(r.get("location",""))]

    result = []
    for r in canadian:
        n = normalize_name(r.get("name",""))
        if n and n not in existing_names:
            result.append(build_event_obj(r))

    out = {"events": result}
    if args.pretty:
        print(json.dumps(out, indent=2, ensure_ascii=False))
    else:
        print(json.dumps(out, separators=(",", ":"), ensure_ascii=False))

if __name__ == "__main__":
    main()
