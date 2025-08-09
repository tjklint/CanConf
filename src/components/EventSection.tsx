import type { Event } from '../types';
import EventCard from './EventCard';
import './EventSection.scss';

interface EventSectionProps {
  events: Event[];
}

const EventSection = ({ events }: EventSectionProps) => {
  const conferences = events.filter(event => event.type === 'conference');
  const hackathons = events.filter(event => event.type === 'hackathon');

  return (
    <div className="event-section">
      <div className="event-section__column">
        <h2 className="event-section__title">Conferences</h2>
        <div className="event-section__events">
          {conferences.length > 0 ? (
            conferences.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p className="event-section__empty">No conferences found for the selected province.</p>
          )}
        </div>
      </div>
      
      <div className="event-section__divider"></div>
      
      <div className="event-section__column">
        <h2 className="event-section__title">Hackathons</h2>
        <div className="event-section__events">
          {hackathons.length > 0 ? (
            hackathons.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p className="event-section__empty">No hackathons found for the selected province.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventSection;
