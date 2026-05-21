import { parseEventDate, sortEventsByDate, isEventPast } from './dateUtils';
import type { Event } from '../types';

describe('parseEventDate', () => {
  it('should parse date with month name and day', () => {
    const result = parseEventDate('March 15, 2025');
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(2); // March is month 2 (0-indexed)
    expect(result.getDate()).toBe(15);
  });

  it('should parse date range and use first date', () => {
    const result = parseEventDate('March 15-16, 2025');
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(15);
  });

  it('should default to current year if no year specified', () => {
    const currentYear = new Date().getFullYear();
    const result = parseEventDate('March 15');
    expect(result.getFullYear()).toBe(currentYear);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(15);
  });

  it('should return far future date for unparseable input', () => {
    const result = parseEventDate('invalid date');
    const currentYear = new Date().getFullYear();
    expect(result.getFullYear()).toBe(currentYear + 100);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
  });

  it('should handle all month names', () => {
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];

    monthNames.forEach((monthName, index) => {
      const result = parseEventDate(`${monthName} 1, 2025`);
      expect(result.getMonth()).toBe(index);
    });
  });
});

describe('sortEventsByDate', () => {
  const createEvent = (date: string, name: string): Event => ({
    name,
    date,
    location: 'Test Location',
    website: 'https://example.com',
    province: 'ON',
    type: 'conference',
    tags: [],
    isStudentFocused: true,
  });

  it('should sort upcoming events earliest first', () => {
    const events = [
      createEvent('December 1, 2025', 'Event 1'),
      createEvent('March 1, 2025', 'Event 2'),
      createEvent('June 1, 2025', 'Event 3'),
    ];

    const sorted = sortEventsByDate(events, true);
    expect(sorted[0].name).toBe('Event 2'); // March
    expect(sorted[1].name).toBe('Event 3'); // June
    expect(sorted[2].name).toBe('Event 1'); // December
  });

  it('should sort past events most recent first', () => {
    const events = [
      createEvent('January 1, 2020', 'Event 1'),
      createEvent('January 1, 2023', 'Event 2'),
      createEvent('January 1, 2021', 'Event 3'),
    ];

    const sorted = sortEventsByDate(events, false);
    expect(sorted[0].name).toBe('Event 2'); // 2023
    expect(sorted[1].name).toBe('Event 3'); // 2021
    expect(sorted[2].name).toBe('Event 1'); // 2020
  });

  it('should not mutate original array', () => {
    const events = [
      createEvent('December 1, 2025', 'Event 1'),
      createEvent('March 1, 2025', 'Event 2'),
    ];
    const originalFirst = events[0].name;

    sortEventsByDate(events, true);
    expect(events[0].name).toBe(originalFirst);
  });
});

describe('isEventPast', () => {
  it('should return true for past dates', () => {
    expect(isEventPast('January 1, 2020')).toBe(true);
  });

  it('should return false for future dates', () => {
    const futureYear = new Date().getFullYear() + 1;
    expect(isEventPast(`January 1, ${futureYear}`)).toBe(false);
  });

  it('should return false for today', () => {
    const today = new Date();
    const todayString = `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`;
    expect(isEventPast(todayString)).toBe(false);
  });
});
