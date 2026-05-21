import { render, screen, fireEvent } from '@testing-library/react';
import EventSection from './EventSection';
import type { Event } from '../types';

describe('EventSection', () => {
  // Use dates in 2026 (future) for upcoming events and 2024 (past) for past events
  const mockUpcomingEvents: Event[] = [
    {
      name: 'Tech Conference 2026',
      date: 'June 15, 2026',
      location: 'Toronto, ON',
      website: 'https://techconf.ca',
      province: 'ON',
      type: 'conference',
      tags: ['technology', 'networking'],
      isStudentFocused: true,
      isBeginnerFocused: false,
      isProfessional: true,
      applicationDeadline: '2026-06-01'
    },
    {
      name: 'Hackathon Pro',
      date: 'July 20, 2026',
      location: 'Vancouver, BC',
      website: 'https://hackathonpro.ca',
      province: 'BC',
      type: 'hackathon',
      tags: ['coding', 'AI'],
      isStudentFocused: true,
      isBeginnerFocused: true,
      applicationDeadline: '2026-07-10'
    },
    {
      name: 'Dev Meetup',
      date: 'August 5, 2026',
      location: 'Montreal, QC',
      website: 'https://devmeetup.ca',
      province: 'QC',
      type: 'meetup',
      tags: ['javascript', 'react'],
      isStudentFocused: false,
      isBeginnerFocused: true,
      applicationDeadline: '2026-08-01'
    }
  ];

  const mockPastEvents: Event[] = [
    {
      name: 'Past Tech Conference',
      date: 'January 15, 2025',
      location: 'Toronto, ON',
      website: 'https://pasttechconf.ca',
      province: 'ON',
      type: 'conference',
      tags: ['technology'],
      isStudentFocused: true,
      applicationDeadline: '2025-01-01'
    },
    {
      name: 'Past Hackathon',
      date: 'February 20, 2025',
      location: 'Vancouver, BC',
      website: 'https://pasthackathon.ca',
      province: 'BC',
      type: 'hackathon',
      tags: ['coding'],
      isStudentFocused: true,
      applicationDeadline: '2025-02-10'
    }
  ];

  const mockOnProvinceChange = jest.fn();

  const defaultProps = {
    events: mockUpcomingEvents,
    selectedProvince: 'ALL' as const,
    onProvinceChange: mockOnProvinceChange
  };

  beforeEach(() => {
    mockOnProvinceChange.mockClear();
  });

  it('renders the component with tabs', () => {
    render(<EventSection {...defaultProps} />);

    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    expect(screen.getByText('Past Events')).toBeInTheDocument();
  });

  it('renders column headers for Conferences, Hackathons, and Meetups', () => {
    render(<EventSection {...defaultProps} />);

    expect(screen.getByText('Conferences')).toBeInTheDocument();
    expect(screen.getByText('Hackathons')).toBeInTheDocument();
    expect(screen.getByText('Meetups')).toBeInTheDocument();
  });

  it('renders search bars with correct placeholders', () => {
    render(<EventSection {...defaultProps} />);

    expect(screen.getByPlaceholderText('Search conferences... (City, Name, Tags)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search hackathons... (City, Name, Tags)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search meetups... (City, Name, Tags)')).toBeInTheDocument();
  });

  it('renders ProvinceFilter component', () => {
    render(<EventSection {...defaultProps} />);

    expect(screen.getByText('Filter by Province')).toBeInTheDocument();
  });

  it('displays upcoming events in their respective columns', () => {
    render(<EventSection {...defaultProps} />);

    expect(screen.getByText('Tech Conference 2026')).toBeInTheDocument();
    expect(screen.getByText('Hackathon Pro')).toBeInTheDocument();
    expect(screen.getByText('Dev Meetup')).toBeInTheDocument();
  });

  it('switches to past events tab when clicked', () => {
    render(<EventSection {...defaultProps} />);

    const pastTab = screen.getByText('Past Events');
    fireEvent.click(pastTab);

    expect(pastTab).toHaveClass('event-section__tab--active');
  });

  it('switches back to upcoming events tab when clicked', () => {
    render(<EventSection {...defaultProps} />);

    const upcomingTab = screen.getByText('Upcoming Events');
    const pastTab = screen.getByText('Past Events');

    fireEvent.click(pastTab);
    fireEvent.click(upcomingTab);

    expect(upcomingTab).toHaveClass('event-section__tab--active');
    expect(pastTab).not.toHaveClass('event-section__tab--active');
  });

  it('filters conferences by search query', () => {
    render(<EventSection {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search conferences... (City, Name, Tags)');
    fireEvent.change(searchInput, { target: { value: 'Tech' } });

    expect(screen.getByText('Tech Conference 2026')).toBeInTheDocument();
  });

  it('filters hackathons by search query', () => {
    render(<EventSection {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search hackathons... (City, Name, Tags)');
    fireEvent.change(searchInput, { target: { value: 'AI' } });

    expect(screen.getByText('Hackathon Pro')).toBeInTheDocument();
  });

  it('filters meetups by search query', () => {
    render(<EventSection {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search meetups... (City, Name, Tags)');
    fireEvent.change(searchInput, { target: { value: 'react' } });

    expect(screen.getByText('Dev Meetup')).toBeInTheDocument();
  });

  it('shows empty message when search has no results', () => {
    render(<EventSection {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search conferences... (City, Name, Tags)');
    fireEvent.change(searchInput, { target: { value: 'NonExistentEvent' } });

    expect(screen.getByText(/No conferences match your search/)).toBeInTheDocument();
  });

  it('shows "See All" button when there are more than 5 events', () => {
    const manyEvents: Event[] = Array.from({ length: 10 }, (_, i) => ({
      name: `Conference ${i + 1}`,
      date: 'June 1, 2026',
      location: 'Toronto, ON',
      website: 'https://example.com',
      province: 'ON',
      type: 'conference',
      tags: ['tech'],
      isStudentFocused: true
    }));

    render(<EventSection {...defaultProps} events={manyEvents} />);

    expect(screen.getByText(/See All 10 Conferences/)).toBeInTheDocument();
  });

  it('expands to show all events when "See All" is clicked', () => {
    const manyEvents: Event[] = Array.from({ length: 10 }, (_, i) => ({
      name: `Conference ${i + 1}`,
      date: 'June 1, 2026',
      location: 'Toronto, ON',
      website: 'https://example.com',
      province: 'ON',
      type: 'conference',
      tags: ['tech'],
      isStudentFocused: true
    }));

    render(<EventSection {...defaultProps} events={manyEvents} />);

    const seeAllButton = screen.getByText(/See All 10 Conferences/);
    fireEvent.click(seeAllButton);

    expect(screen.getByText('Show Less')).toBeInTheDocument();
  });

  it('collapses back to 5 events when "Show Less" is clicked', () => {
    const manyEvents: Event[] = Array.from({ length: 10 }, (_, i) => ({
      name: `Conference ${i + 1}`,
      date: 'June 1, 2026',
      location: 'Toronto, ON',
      website: 'https://example.com',
      province: 'ON',
      type: 'conference',
      tags: ['tech'],
      isStudentFocused: true
    }));

    render(<EventSection {...defaultProps} events={manyEvents} />);

    const seeAllButton = screen.getByText(/See All 10 Conferences/);
    fireEvent.click(seeAllButton);

    const showLessButton = screen.getByText('Show Less');
    fireEvent.click(showLessButton);

    expect(screen.getByText(/See All 10 Conferences/)).toBeInTheDocument();
  });

  it('renders event cards with correct event data', () => {
    render(<EventSection {...defaultProps} />);

    expect(screen.getByText('Tech Conference 2026')).toBeInTheDocument();
    expect(screen.getByText('June 15, 2026')).toBeInTheDocument();
    expect(screen.getByText('Toronto, ON')).toBeInTheDocument();
  });

  it('renders dividers between columns', () => {
    render(<EventSection {...defaultProps} />);

    const dividers = document.querySelectorAll('.event-section__divider');
    expect(dividers.length).toBe(2);
  });

  it('has correct tab structure with buttons', () => {
    render(<EventSection {...defaultProps} />);

    const tabs = document.querySelectorAll('.event-section__tab');
    expect(tabs.length).toBe(2);
  });

  it('has filters section with ProvinceFilter', () => {
    render(<EventSection {...defaultProps} />);

    const filtersSection = document.querySelector('.event-section__filters');
    expect(filtersSection).toBeInTheDocument();
  });

  it('has content section containing all columns', () => {
    render(<EventSection {...defaultProps} />);

    const contentSection = document.querySelector('.event-section__content');
    expect(contentSection).toBeInTheDocument();
  });

  it('searches by location when location is entered', () => {
    render(<EventSection {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search conferences... (City, Name, Tags)');
    fireEvent.change(searchInput, { target: { value: 'Toronto' } });

    expect(screen.getByText('Tech Conference 2026')).toBeInTheDocument();
  });

  it('searches by tags when tag is entered', () => {
    render(<EventSection {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search hackathons... (City, Name, Tags)');
    fireEvent.change(searchInput, { target: { value: 'coding' } });

    expect(screen.getByText('Hackathon Pro')).toBeInTheDocument();
  });

  it('searches by date when date is entered', () => {
    render(<EventSection {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search meetups... (City, Name, Tags)');
    fireEvent.change(searchInput, { target: { value: 'August' } });

    expect(screen.getByText('Dev Meetup')).toBeInTheDocument();
  });

  it('handles empty events array gracefully', () => {
    render(<EventSection {...defaultProps} events={[]} />);

    expect(screen.getByText(/No upcoming conferences found/)).toBeInTheDocument();
    expect(screen.getByText(/No upcoming hackathons found/)).toBeInTheDocument();
    expect(screen.getByText(/No upcoming meetups found/)).toBeInTheDocument();
  });

  it('displays past events when past tab is selected', () => {
    render(<EventSection {...defaultProps} events={mockPastEvents} />);

    const pastTab = screen.getByText('Past Events');
    fireEvent.click(pastTab);

    expect(screen.getByText('Past Tech Conference')).toBeInTheDocument();
    expect(screen.getByText('Past Hackathon')).toBeInTheDocument();
  });

  it('shows past events empty message when no past events exist', () => {
    render(<EventSection {...defaultProps} />);

    const pastTab = screen.getByText('Past Events');
    fireEvent.click(pastTab);

    expect(screen.getByText(/No past conferences found/)).toBeInTheDocument();
  });

  it('filters past events by search query', () => {
    render(<EventSection {...defaultProps} events={mockPastEvents} />);

    const pastTab = screen.getByText('Past Events');
    fireEvent.click(pastTab);

    const searchInput = screen.getByPlaceholderText('Search conferences... (City, Name, Tags)');
    fireEvent.change(searchInput, { target: { value: 'Past Tech' } });

    expect(screen.getByText('Past Tech Conference')).toBeInTheDocument();
  });
});
