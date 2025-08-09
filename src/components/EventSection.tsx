import { useState, useMemo, useCallback } from 'react';
import type { Event as EventType } from '../types';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import { sortEventsByDate, isEventPast } from '../utils/dateUtils';
import './EventSection.scss';

interface EventSectionProps {
  events: EventType[];
}

const EventSection = ({ events }: EventSectionProps) => {
  const [conferenceSearch, setConferenceSearch] = useState('');
  const [hackathonSearch, setHackathonSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const filterAndSortEvents = useCallback((events: EventType[], searchQuery: string, eventType: 'conference' | 'hackathon') => {
    // Filter by event type
    const filteredEvents = events.filter(event => event.type === eventType);
    
    // Separate past and upcoming events
    const upcomingEvents = filteredEvents.filter(event => !isEventPast(event.date));
    const pastEvents = filteredEvents.filter(event => isEventPast(event.date));
    
    // Choose the right set based on active tab
    const relevantEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;
    
    // Sort events (upcoming: earliest first, past: most recent first)
    const sortedEvents = sortEventsByDate(relevantEvents, activeTab === 'upcoming');
    
    // Apply search filter
    if (!searchQuery.trim()) return sortedEvents;
    
    const query = searchQuery.toLowerCase();
    return sortedEvents.filter(event => 
      event.name.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.date.toLowerCase().includes(query) ||
      event.tags.some((tag: string) => tag.toLowerCase().includes(query))
    );
  }, [activeTab]);

  const filteredConferences = useMemo(() => 
    filterAndSortEvents(events, conferenceSearch, 'conference'), 
    [events, conferenceSearch, activeTab]
  );

  const filteredHackathons = useMemo(() => 
    filterAndSortEvents(events, hackathonSearch, 'hackathon'), 
    [events, hackathonSearch, activeTab]
  );

  return (
    <div className="event-section">
      {/* Tab Navigation */}
      <div className="event-section__tabs">
        <button
          className={`event-section__tab ${activeTab === 'upcoming' ? 'event-section__tab--active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </button>
        <button
          className={`event-section__tab ${activeTab === 'past' ? 'event-section__tab--active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Events
        </button>
      </div>

      <div className="event-section__content">
        <div className="event-section__column">
          <h2 className="event-section__title">Conferences</h2>
          <SearchBar 
            onSearch={setConferenceSearch}
            placeholder="Search conferences... (City, Name, Tags)"
          />
          <div className="event-section__events">
            {filteredConferences.length > 0 ? (
              filteredConferences.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p className="event-section__empty">
                {conferenceSearch ? `No conferences match your search in ${activeTab} events.` : `No ${activeTab} conferences found for the selected province.`}
              </p>
            )}
          </div>
        </div>
        
        <div className="event-section__divider"></div>
        
        <div className="event-section__column">
          <h2 className="event-section__title">Hackathons</h2>
          <SearchBar 
            onSearch={setHackathonSearch}
            placeholder="Search hackathons... (City, Name, Tags)"
          />
          <div className="event-section__events">
            {filteredHackathons.length > 0 ? (
              filteredHackathons.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p className="event-section__empty">
                {hackathonSearch ? `No hackathons match your search in ${activeTab} events.` : `No ${activeTab} hackathons found for the selected province.`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSection;
