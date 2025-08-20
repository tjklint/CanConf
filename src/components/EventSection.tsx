import { useState, useMemo, useCallback } from 'react';
import type { Event as EventType, Province } from '../types';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import ProvinceFilter from './ProvinceFilter';
import { sortEventsByDate, isEventPast } from '../utils/dateUtils';
import './EventSection.scss';

interface EventSectionProps {
  events: EventType[];
  selectedProvince: Province | 'ALL';
  onProvinceChange: (province: Province | 'ALL') => void;
}

const EventSection = ({ events, selectedProvince, onProvinceChange }: EventSectionProps) => {
  const [conferenceSearch, setConferenceSearch] = useState('');
  const [hackathonSearch, setHackathonSearch] = useState('');
  const [meetupSearch, setMeetupSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showAllConferences, setShowAllConferences] = useState(false);
  const [showAllHackathons, setShowAllHackathons] = useState(false);
  const [showAllMeetups, setShowAllMeetups] = useState(false);

  const filterAndSortEvents = useCallback((events: EventType[], searchQuery: string, eventType: 'conference' | 'hackathon' | 'meetup') => {
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
    [events, conferenceSearch, filterAndSortEvents]
  );

  const filteredHackathons = useMemo(() => 
    filterAndSortEvents(events, hackathonSearch, 'hackathon'), 
    [events, hackathonSearch, filterAndSortEvents]
  );

  const filteredMeetups = useMemo(() => 
    filterAndSortEvents(events, meetupSearch, 'meetup'), 
    [events, meetupSearch, filterAndSortEvents]
  );

  // Limit displayed events to 5 unless "show all" is toggled
  const displayedConferences = showAllConferences ? filteredConferences : filteredConferences.slice(0, 5);
  const displayedHackathons = showAllHackathons ? filteredHackathons : filteredHackathons.slice(0, 5);
  const displayedMeetups = showAllMeetups ? filteredMeetups : filteredMeetups.slice(0, 5);

  const renderEventColumn = (
    title: string,
    displayedEvents: EventType[],
    allEvents: EventType[],
    searchQuery: string,
    onSearch: (query: string) => void,
    placeholder: string,
    showAll: boolean,
    setShowAll: (show: boolean) => void
  ) => (
    <div className="event-section__column">
      <h2 className="event-section__title">{title}</h2>
      <SearchBar 
        onSearch={onSearch}
        placeholder={placeholder}
      />
      <div className="event-section__events">
        {displayedEvents.length > 0 ? (
          <>
            {displayedEvents.map((event, index) => (
              <EventCard key={`${event.name}-${event.date}-${index}`} event={event} />
            ))}
            {allEvents.length > 5 && !showAll && (
              <button 
                className="event-section__see-more"
                onClick={() => setShowAll(true)}
              >
                See All {allEvents.length} {title} ({allEvents.length - 5} more)
              </button>
            )}
            {allEvents.length > 5 && showAll && (
              <button 
                className="event-section__see-less"
                onClick={() => setShowAll(false)}
              >
                Show Less
              </button>
            )}
          </>
        ) : (
          <p className="event-section__empty">
            {searchQuery ? `No ${title.toLowerCase()} match your search in ${activeTab} events.` : `No ${activeTab} ${title.toLowerCase()} found for the selected province.`}
          </p>
        )}
      </div>
    </div>
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

      {/* Province Filter - moved under tabs */}
      <div className="event-section__filters">
        <ProvinceFilter 
          selectedProvince={selectedProvince}
          onProvinceChange={onProvinceChange}
        />
      </div>

      <div className="event-section__content">
        {renderEventColumn(
          'Conferences',
          displayedConferences,
          filteredConferences,
          conferenceSearch,
          setConferenceSearch,
          'Search conferences... (City, Name, Tags)',
          showAllConferences,
          setShowAllConferences
        )}
        
        <div className="event-section__divider"></div>
        
        {renderEventColumn(
          'Hackathons',
          displayedHackathons,
          filteredHackathons,
          hackathonSearch,
          setHackathonSearch,
          'Search hackathons... (City, Name, Tags)',
          showAllHackathons,
          setShowAllHackathons
        )}
      </div>
    </div>
  );
};

export default EventSection;
