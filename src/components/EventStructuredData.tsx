import type { Event } from '../types';

interface EventStructuredDataProps {
  events: Event[];
}

const EventStructuredData = ({ events }: EventStructuredDataProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Canadian Tech Events",
    "description": "List of tech conferences and hackathons in Canada",
    "numberOfItems": events.length,
    "itemListElement": events.map((event, index) => ({
      "@type": "Event",
      "position": index + 1,
      "name": event.name,
      "description": `${event.type} in ${event.location}`,
      "startDate": event.date,
      "location": {
        "@type": "Place",
        "name": event.location,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": event.location.split(', ')[0],
          "addressRegion": event.province,
          "addressCountry": "CA"
        }
      },
      "url": event.website,
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "organizer": {
        "@type": "Organization",
        "name": event.name,
        "url": event.website
      },
      "keywords": event.tags.join(', '),
      "audience": event.isStudentFocused ? {
        "@type": "Audience",
        "audienceType": "Students"
      } : undefined
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
};

export default EventStructuredData;
