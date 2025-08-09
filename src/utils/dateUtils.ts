import type { Event as EventType } from '../types';

// Date parsing utility for events
export const parseEventDate = (dateString: string): Date => {
  // Handle various date formats like "March 15-16, 2025", "February 28, 2025", etc.
  const currentYear = new Date().getFullYear();
  
  // Extract year from the string, default to current year if not found
  const yearMatch = dateString.match(/(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1]) : currentYear;
  
  // Extract month
  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  
  const monthMatch = dateString.toLowerCase().match(
    new RegExp(`(${monthNames.join('|')})`)
  );
  
  if (!monthMatch) {
    // If we can't parse the date, return a date far in the future so it sorts last
    return new Date(year + 100, 0, 1);
  }
  
  const month = monthNames.indexOf(monthMatch[1]);
  
  // Extract day (take the first number after the month)
  const dayMatch = dateString.match(/(\w+)\s+(\d+)/);
  const day = dayMatch ? parseInt(dayMatch[2]) : 1;
  
  return new Date(year, month, day);
};

// Sort events by date (newest first for upcoming, oldest first for past)
export const sortEventsByDate = (events: EventType[], isUpcoming: boolean = true): EventType[] => {
  return [...events].sort((a, b) => {
    const dateA = parseEventDate(a.date);
    const dateB = parseEventDate(b.date);
    
    if (isUpcoming) {
      return dateA.getTime() - dateB.getTime(); // Earliest upcoming first
    } else {
      return dateB.getTime() - dateA.getTime(); // Most recent past first
    }
  });
};

// Check if an event is in the past
export const isEventPast = (dateString: string): boolean => {
  const eventDate = parseEventDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  
  return eventDate < today;
};
