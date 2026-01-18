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

        # Wait a bit for content to load
        page.wait_for_timeout(3000)

        cards = page.evaluate(
            """
        () => {
          // Strategy: Find all text nodes that contain date patterns, then work backwards
          // to find the event container and extract data
          const items = [];
          const seen = new Set();
          
          // Find all elements with text content
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null
          );
          
          const textNodes = [];
          let node;
          while (node = walker.nextNode()) {
            const text = node.textContent.trim();
            if (/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d{1,2}/i.test(text)) {
              textNodes.push(node);
            }
          }
          
          textNodes.forEach(textNode => {
            // Find the containing element that has event info
            let container = textNode.parentElement;
            for (let i = 0; i < 10 && container; i++) {
              const text = container.textContent || '';
              // Check if this container has both date and location
              const hasDate = /(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d{1,2}/i.test(text);
              const hasLocation = /[A-Z][a-zA-Z\s]+,\s*(Ontario|Quebec|Québec|British Columbia|Alberta|Manitoba|Saskatchewan|Nova Scotia|New Brunswick|Newfoundland|Prince Edward Island|Yukon|Northwest Territories|Nunavut|ON|QC|BC|AB|MB|SK|NS|NB|NL|PE|YT|NT|NU)/i.test(text);
              
              if (hasDate && hasLocation && text.length < 1000) {
                // Extract data from this container
                const cleanText = text.replace(/In-Person|Digital|Person|background|logo/gi, ' ').replace(/\s+/g, ' ').trim();
                
                // Extract name
                let name = null;
                const heading = container.querySelector('h1, h2, h3, h4, h5, h6');
                if (heading) {
                  name = heading.textContent.trim();
                } else {
                  const nameMatch = cleanText.match(/^([A-Za-z0-9\s&\-\.\+]+?)(?=\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d)/i);
                  if (nameMatch) {
                    name = nameMatch[1].trim().replace(/\s+/g, ' ');
                  }
                }
                
                // Extract date
                let date = null;
                const dateMatch = cleanText.match(/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+(\d{1,2})(\s*-\s*(\d{1,2}))?/i);
                if (dateMatch) {
                  const month = dateMatch[1].toUpperCase();
                  const day1 = dateMatch[2];
                  const day2 = dateMatch[4];
                  date = day2 ? month + ' ' + day1 + ' - ' + day2 : month + ' ' + day1;
                }
                
                // Extract location - Canadian only
                let location = null;
                const canadianProvinces = ['Ontario', 'Quebec', 'Québec', 'British Columbia', 'Alberta', 
                  'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 
                  'Newfoundland', 'Prince Edward Island', 'Yukon', 
                  'Northwest Territories', 'Nunavut'];
                const canadianCodes = ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU'];
                
                for (const province of canadianProvinces) {
                  const provinceNorm = province.replace(/é/g, '[ée]');
                  const provinceEscaped = provinceNorm.replace(/\s+/g, '\\\\s+');
                  const pattern = new RegExp('([A-Z][a-zA-Z\\\\s]+),\\\\s*' + provinceEscaped, 'i');
                  const match = cleanText.match(pattern);
                  if (match) {
                    let city = match[1].trim();
                    city = city.replace(/^[A-Z]{2}\s+/, '');
                    if (city && city.length > 1) {
                      location = city + ', ' + (province === 'Québec' ? 'Quebec' : province);
                      break;
                    }
                  }
                }
                
                if (!location) {
                  for (const code of canadianCodes) {
                    const pattern = new RegExp('([A-Z][a-zA-Z\\\\s]+),\\\\s*' + code + '(?:/|\\\\s|$)', 'i');
                    const match = cleanText.match(pattern);
                    if (match) {
                      let city = match[1].trim();
                      city = city.replace(/^[A-Z]{2}\s+/, '');
                      if (city && city.length > 1) {
                        const codeMap = {'ON': 'Ontario', 'QC': 'Quebec', 'BC': 'British Columbia', 
                          'AB': 'Alberta', 'MB': 'Manitoba', 'SK': 'Saskatchewan', 'NS': 'Nova Scotia',
                          'NB': 'New Brunswick', 'NL': 'Newfoundland', 'PE': 'Prince Edward Island',
                          'YT': 'Yukon', 'NT': 'Northwest Territories', 'NU': 'Nunavut'};
                        location = city + ', ' + codeMap[code];
                        break;
                      }
                    }
                  }
                }
                
                // Get website
                let website = null;
                const links = Array.from(container.querySelectorAll('a[href]'));
                for (const link of links) {
                  const href = link.getAttribute('href') || '';
                  try {
                    const fullUrl = new URL(href, window.location.href).href;
                    if (!fullUrl.includes('mlh.io') && !fullUrl.includes('mlh.com') && fullUrl.startsWith('http')) {
                      website = fullUrl;
                      break;
                    } else if (fullUrl.includes('/events/')) {
                      website = fullUrl;
                    }
                  } catch (e) {}
                }
                
                if (name && location && name.length > 2) {
                  const key = name.toLowerCase().trim();
                  if (!seen.has(key)) {
                    seen.add(key);
                    items.push({ name: name.trim(), date: date || '', location: location.trim(), website: website || '' });
                  }
                }
                
                break; // Found event, move to next text node
              }
              container = container.parentElement;
            }
          });
          
          return items;
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
