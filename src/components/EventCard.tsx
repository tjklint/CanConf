import type { Event } from '../types';
import './EventCard.scss';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="event-card">
      <div className="event-card__header">
        <h3 className="event-card__name">{event.name}</h3>
        {event.isStudentFocused && (
          <span className="event-card__student-badge">Student</span>
        )}
      </div>
      <div className="event-card__details">
        <p className="event-card__date">{event.date}</p>
        <p className="event-card__location">{event.location}</p>
        <a 
          href={event.website}
          target="_blank"
          rel="noopener noreferrer"
          className="event-card__website"
        >
          Visit Website →
        </a>
      </div>
    </div>
  );
};

export default EventCard;
