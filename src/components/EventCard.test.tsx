import { render, screen } from '@testing-library/react';
import EventCard from './EventCard';
import type { Event } from '../types';

describe('EventCard', () => {
  const createMockEvent = (overrides?: Partial<Event>): Event => ({
    name: 'Tech Conference 2026',
    date: 'June 15, 2026',
    location: 'Toronto, ON',
    website: 'https://techconf.ca',
    province: 'ON',
    type: 'conference',
    tags: ['technology', 'networking'],
    isStudentFocused: true,
    isBeginnerFocused: false,
    isProfessional: false,
    applicationDeadline: '2026-06-01',
    ...overrides
  });

  it('renders the event name', () => {
    const event = createMockEvent();
    render(<EventCard event={event} />);

    expect(screen.getByText('Tech Conference 2026')).toBeInTheDocument();
  });

  it('renders the event date', () => {
    const event = createMockEvent();
    render(<EventCard event={event} />);

    expect(screen.getByText('June 15, 2026')).toBeInTheDocument();
  });

  it('renders the event location', () => {
    const event = createMockEvent();
    render(<EventCard event={event} />);

    expect(screen.getByText('Toronto, ON')).toBeInTheDocument();
  });

  it('renders the website link with correct attributes', () => {
    const event = createMockEvent();
    render(<EventCard event={event} />);

    const link = screen.getByText('Visit Website →').closest('a');
    expect(link).toHaveAttribute('href', 'https://techconf.ca');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the Student badge when isStudentFocused is true', () => {
    const event = createMockEvent({ isStudentFocused: true });
    render(<EventCard event={event} />);

    expect(screen.getByText('Student')).toBeInTheDocument();
  });

  it('does not render the Student badge when isStudentFocused is false', () => {
    const event = createMockEvent({ isStudentFocused: false });
    render(<EventCard event={event} />);

    expect(screen.queryByText('Student')).not.toBeInTheDocument();
  });

  it('renders the Beginner badge when isBeginnerFocused is true', () => {
    const event = createMockEvent({ isBeginnerFocused: true });
    render(<EventCard event={event} />);

    expect(screen.getByText('Beginner')).toBeInTheDocument();
  });

  it('does not render the Beginner badge when isBeginnerFocused is false', () => {
    const event = createMockEvent({ isBeginnerFocused: false });
    render(<EventCard event={event} />);

    expect(screen.queryByText('Beginner')).not.toBeInTheDocument();
  });

  it('renders the Professional badge when isProfessional is true', () => {
    const event = createMockEvent({ isProfessional: true });
    render(<EventCard event={event} />);

    expect(screen.getByText('Professional')).toBeInTheDocument();
  });

  it('does not render the Professional badge when isProfessional is false', () => {
    const event = createMockEvent({ isProfessional: false });
    render(<EventCard event={event} />);

    expect(screen.queryByText('Professional')).not.toBeInTheDocument();
  });

  it('renders multiple badges when multiple flags are true', () => {
    const event = createMockEvent({
      isStudentFocused: true,
      isBeginnerFocused: true,
      isProfessional: true
    });
    render(<EventCard event={event} />);

    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
  });

  it('renders ApplicationStatus component with correct props', () => {
    const event = createMockEvent();
    render(<EventCard event={event} />);

    // ApplicationStatus renders "Applications Open" when deadline is in the future
    expect(screen.getByText('Applications Open')).toBeInTheDocument();
  });

  it('renders ApplicationStatus as closed when application deadline is in the past', () => {
    const event = createMockEvent({
      applicationDeadline: '2024-01-01',
      date: 'June 15, 2026'
    });
    render(<EventCard event={event} />);

    expect(screen.getByText('Applications Closed')).toBeInTheDocument();
  });

  it('does not render ApplicationStatus for conference without application deadline', () => {
    const event = createMockEvent({ applicationDeadline: undefined });
    render(<EventCard event={event} />);

    // ApplicationStatus returns null for conferences without application deadline
    expect(screen.queryByText('Applications Status Unknown')).not.toBeInTheDocument();
  });

  it('renders with hackathon type event', () => {
    const event = createMockEvent({
      type: 'hackathon',
      name: 'Hackathon Pro',
      isBeginnerFocused: true
    });
    render(<EventCard event={event} />);

    expect(screen.getByText('Hackathon Pro')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
  });

  it('renders with meetup type event', () => {
    const event = createMockEvent({
      type: 'meetup',
      name: 'Dev Meetup',
      isStudentFocused: false
    });
    render(<EventCard event={event} />);

    expect(screen.getByText('Dev Meetup')).toBeInTheDocument();
  });

  it('has correct CSS class for the card container', () => {
    const event = createMockEvent();
    const { container } = render(<EventCard event={event} />);

    expect(container.querySelector('.event-card')).toBeInTheDocument();
  });

  it('has correct CSS class for the header section', () => {
    const event = createMockEvent();
    const { container } = render(<EventCard event={event} />);

    expect(container.querySelector('.event-card__header')).toBeInTheDocument();
  });

  it('has correct CSS class for the name', () => {
    const event = createMockEvent();
    const { container } = render(<EventCard event={event} />);

    expect(container.querySelector('.event-card__name')).toBeInTheDocument();
  });

  it('has correct CSS class for the badges container', () => {
    const event = createMockEvent({ isStudentFocused: true });
    const { container } = render(<EventCard event={event} />);

    expect(container.querySelector('.event-card__badges')).toBeInTheDocument();
  });

  it('has correct CSS class for badge elements', () => {
    const event = createMockEvent({ isStudentFocused: true });
    const { container } = render(<EventCard event={event} />);

    expect(container.querySelector('.event-card__badge')).toBeInTheDocument();
    expect(container.querySelector('.event-card__badge--student')).toBeInTheDocument();
  });

  it('has correct CSS class for the details section', () => {
    const event = createMockEvent();
    const { container } = render(<EventCard event={event} />);

    expect(container.querySelector('.event-card__details')).toBeInTheDocument();
  });

  it('has correct CSS class for the date', () => {
    const event = createMockEvent();
    const { container } = render(<EventCard event={event} />);

    expect(container.querySelector('.event-card__date')).toBeInTheDocument();
  });

  it('has correct CSS class for the location', () => {
    const event = createMockEvent();
    const { container } = render(<EventCard event={event} />);

    expect(container.querySelector('.event-card__location')).toBeInTheDocument();
  });

  it('has correct CSS class for the website link', () => {
    const event = createMockEvent();
    const { container } = render(<EventCard event={event} />);

    expect(container.querySelector('.event-card__website')).toBeInTheDocument();
  });

  it('has correct CSS class for the footer section', () => {
    const event = createMockEvent();
    const { container } = render(<EventCard event={event} />);

    expect(container.querySelector('.event-card__footer')).toBeInTheDocument();
  });
});
