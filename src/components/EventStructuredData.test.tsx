import { render } from '@testing-library/react';
import EventStructuredData from './EventStructuredData';
import type { Event } from '../types';

describe('EventStructuredData', () => {
  const mockEvents: Event[] = [
    {
      name: 'TechConf 2026',
      date: '2026-06-15',
      location: 'Toronto, ON',
      website: 'https://techconf.ca',
      province: 'ON',
      type: 'conference',
      tags: ['technology', 'networking'],
      isStudentFocused: false
    },
    {
      name: 'HackathonTO',
      date: '2026-07-20',
      location: 'Toronto, ON',
      website: 'https://hackathonto.com',
      province: 'ON',
      type: 'hackathon',
      tags: ['hackathon', 'coding'],
      isStudentFocused: true
    }
  ];

  it('renders a script tag with type application/ld+json', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it('generates valid structured data with correct @context and @type', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData['@context']).toBe('https://schema.org');
    expect(structuredData['@type']).toBe('ItemList');
  });

  it('includes correct name and description', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.name).toBe('Canadian Tech Events');
    expect(structuredData.description).toBe('List of tech conferences and hackathons in Canada');
  });

  it('sets numberOfItems to the count of events', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.numberOfItems).toBe(2);
  });

  it('generates itemListElement for each event', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.itemListElement).toHaveLength(2);
    expect(structuredData.itemListElement[0].name).toBe('TechConf 2026');
    expect(structuredData.itemListElement[1].name).toBe('HackathonTO');
  });

  it('sets correct position for each event', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.itemListElement[0].position).toBe(1);
    expect(structuredData.itemListElement[1].position).toBe(2);
  });

  it('includes event description with type and location', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.itemListElement[0].description).toBe('conference in Toronto, ON');
    expect(structuredData.itemListElement[1].description).toBe('hackathon in Toronto, ON');
  });

  it('includes startDate from event date', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.itemListElement[0].startDate).toBe('2026-06-15');
    expect(structuredData.itemListElement[1].startDate).toBe('2026-07-20');
  });

  it('includes location with Place type and address', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    const location = structuredData.itemListElement[0].location;
    expect(location['@type']).toBe('Place');
    expect(location.name).toBe('Toronto, ON');
    expect(location.address['@type']).toBe('PostalAddress');
  });

  it('parses addressLocality from location string', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    const address = structuredData.itemListElement[0].location.address;
    expect(address.addressLocality).toBe('Toronto');
    expect(address.addressRegion).toBe('ON');
    expect(address.addressCountry).toBe('CA');
  });

  it('includes event URL from website', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.itemListElement[0].url).toBe('https://techconf.ca');
    expect(structuredData.itemListElement[1].url).toBe('https://hackathonto.com');
  });

  it('includes eventAttendanceMode as OfflineEventAttendanceMode', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.itemListElement[0].eventAttendanceMode)
      .toBe('https://schema.org/OfflineEventAttendanceMode');
  });

  it('includes eventStatus as EventScheduled', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.itemListElement[0].eventStatus)
      .toBe('https://schema.org/EventScheduled');
  });

  it('includes organizer with name and URL', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    const organizer = structuredData.itemListElement[0].organizer;
    expect(organizer['@type']).toBe('Organization');
    expect(organizer.name).toBe('TechConf 2026');
    expect(organizer.url).toBe('https://techconf.ca');
  });

  it('includes keywords from event tags', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.itemListElement[0].keywords).toBe('technology, networking');
    expect(structuredData.itemListElement[1].keywords).toBe('hackathon, coding');
  });

  it('includes audience for student-focused events', () => {
    const { container } = render(<EventStructuredData events={mockEvents} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    // First event is not student focused
    expect(structuredData.itemListElement[0].audience).toBeUndefined();
    // Second event is student focused
    expect(structuredData.itemListElement[1].audience).toEqual({
      '@type': 'Audience',
      audienceType: 'Students'
    });
  });

  it('handles empty events array', () => {
    const { container } = render(<EventStructuredData events={[]} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.numberOfItems).toBe(0);
    expect(structuredData.itemListElement).toHaveLength(0);
  });

  it('handles single event', () => {
    const singleEvent: Event[] = [{
      name: 'SingleEvent',
      date: '2026-01-01',
      location: 'Vancouver, BC',
      website: 'https://single.ca',
      province: 'BC',
      type: 'meetup',
      tags: ['meetup'],
      isStudentFocused: false
    }];

    const { container } = render(<EventStructuredData events={singleEvent} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(script?.textContent || '{}');

    expect(structuredData.numberOfItems).toBe(1);
    expect(structuredData.itemListElement).toHaveLength(1);
    expect(structuredData.itemListElement[0].name).toBe('SingleEvent');
  });
});
