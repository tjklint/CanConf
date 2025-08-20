import type { Event } from '../types';
import ApplicationStatus from './ApplicationStatus';
import './EventCard.scss';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="event-card">
      <div className="event-card__header">
        <h3 className="event-card__name">{event.name}</h3>
        <div className="event-card__badges">
          {event.isStudentFocused && (
            <span className="event-card__badge event-card__badge--student">Student</span>
          )}
          {event.isBeginnerFocused && (
            <span className="event-card__badge event-card__badge--beginner">Beginner</span>
          )}
          {event.isProfessional && (
            <span className="event-card__badge event-card__badge--professional">Professional</span>
          )}
        </div>
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
      <div className="event-card__footer">
        <ApplicationStatus 
          eventName={event.name}
          applicationDeadline={event.applicationDeadline}
          eventType={event.type}
        />
      </div>
    </div>
  );
};

export default EventCard;
