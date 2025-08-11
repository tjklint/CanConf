# Contributing to CanConf 🍁

Thank you for your interest in contributing to CanConf! This project aims to help students and professionals across Canada discover amazing tech conferences and hackathons.

## How to Contribute

### Adding Events 📅

The easiest way to contribute is by adding new events to our directory. Here's how:

1. **Fork the repository**
2. **Edit `src/data/events.json`**
3. **Add your event following this format:**

```json
{
  "name": "Event Name",
  "date": "Month Day-Day, Year",
  "location": "City, Province",
  "website": "https://example.com",
  "province": "ON",
  "type": "conference",
  "tags": ["tag1", "tag2", "tag3"],
  "isStudentFocused": false
}
```

#### Field Guidelines:

- **name**: Full event name
- **date**: Use format like "March 15-16, 2025" or "February 28, 2025"
- **location**: "City, Province" format
- **website**: Official event website
- **province**: Use 2-letter province codes (ON, BC, QC, AB, etc.)
- **type**: Either "conference" or "hackathon"
- **tags**: Array of relevant keywords (programming languages, technologies, themes)
- **isStudentFocused**: true if primarily for students, false otherwise

### Event Criteria ✅

We include events that are:
- **Tech-focused**: Software development, AI, data science, cybersecurity, etc.
- **Canadian**: Held in Canada or with significant Canadian participation
- **Public**: Open for registration (not private/internal events)
- **Educational**: Conferences, hackathons, workshops, meetups

### Province Codes 🗺️

- AB: Alberta
- BC: British Columbia
- MB: Manitoba
- NB: New Brunswick
- NL: Newfoundland and Labrador
- NS: Nova Scotia
- NT: Northwest Territories
- NU: Nunavut
- ON: Ontario
- PE: Prince Edward Island
- QC: Quebec
- SK: Saskatchewan
- YT: Yukon

## Other Ways to Contribute

### Bug Reports 🐛
Found something broken? Please [open an issue](https://github.com/tjklint/CanConf/issues) with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Feature Requests 💡
Have an idea to improve CanConf? [Open an issue](https://github.com/tjklint/CanConf/issues) with:
- Clear description of the feature
- Why it would be useful
- How you envision it working

### Code Improvements 🔧
Want to improve the code? Great! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## Development Setup

```bash
# Clone the repo
git clone https://github.com/tjklint/CanConf.git
cd CanConf

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Pull Request Process

1. **Update events.json** with your new events
2. **Test locally** to ensure everything works
3. **Create a pull request** with:
   - Clear title describing what you're adding
   - List of events added in the description
   - Any relevant links or context

## 🎉 Contributor Recognition

When you open a pull request, our automated system will:
- **Automatically credit you** on the CanConf website
- **Add your GitHub profile** to our contributors section
- **Track your contributions** over time
- **Send you a thank you message** 🙏

Your contributions help make Canadian tech events more discoverable for everyone!

## Questions?

Feel free to [open an issue](https://github.com/tjklint/CanConf/issues) if you have questions about contributing!

---

**Together, let's help the Canadian tech community discover amazing opportunities! 🇨🇦**
