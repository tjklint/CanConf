import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApplicationStatus from './ApplicationStatus';

describe('ApplicationStatus', () => {
  const defaultProps = {
    eventName: 'Tech Conference 2026',
    applicationDeadline: '2026-06-01',
    eventType: 'conference' as const
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-15'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('rendering conditions', () => {
    it('does not render for meetup events', () => {
      render(<ApplicationStatus {...defaultProps} eventType="meetup" />);

      expect(screen.queryByText('Applications Status Unknown')).not.toBeInTheDocument();
    });

    it('does not render for conference events without application deadline', () => {
      render(<ApplicationStatus {...defaultProps} applicationDeadline={undefined} />);

      expect(screen.queryByText('Applications Status Unknown')).not.toBeInTheDocument();
    });

    it('renders for conference events with application deadline', () => {
      render(<ApplicationStatus {...defaultProps} />);

      expect(screen.getByText('Applications Open')).toBeInTheDocument();
    });

    it('renders for hackathon events with application deadline', () => {
      render(<ApplicationStatus {...defaultProps} eventType="hackathon" />);

      expect(screen.getByText('Applications Open')).toBeInTheDocument();
    });
  });

  describe('status display', () => {
    it('displays "Applications Open" when deadline is in the future', () => {
      render(<ApplicationStatus {...defaultProps} />);

      expect(screen.getByText('Applications Open')).toBeInTheDocument();
      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('displays "Applications Closed" when deadline is in the past', () => {
      render(<ApplicationStatus {...defaultProps} applicationDeadline="2025-01-01" />);

      expect(screen.getByText('Applications Closed')).toBeInTheDocument();
      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('displays "Applications Closed" when deadline is invalid date string', () => {
      // Invalid date strings create an Invalid Date object which is not > now, so status is 'closed'
      render(<ApplicationStatus {...defaultProps} applicationDeadline="invalid-date" />);

      expect(screen.getByText('Applications Closed')).toBeInTheDocument();
    });

    it('does not render when deadline is empty string', () => {
      // Empty string is falsy, so component returns null
      render(<ApplicationStatus {...defaultProps} applicationDeadline="" />);

      expect(screen.queryByText('Applications Open')).not.toBeInTheDocument();
      expect(screen.queryByText('Applications Closed')).not.toBeInTheDocument();
      expect(screen.queryByText('Applications Status Unknown')).not.toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('has correct CSS class for open status', () => {
      render(<ApplicationStatus {...defaultProps} />);

      expect(screen.getByText('Applications Open').closest('.application-status')).toHaveClass('application-status--open');
    });

    it('has correct CSS class for closed status', () => {
      render(<ApplicationStatus {...defaultProps} applicationDeadline="2025-01-01" />);

      expect(screen.getByText('Applications Closed').closest('.application-status')).toHaveClass('application-status--closed');
    });

    it('has correct CSS class for unknown status', () => {
      // Note: getApplicationStatus returns 'unknown' only for undefined/null deadlines
      // but the component returns null for conferences without deadlines
      // So we test with hackathon type which always renders
      render(<ApplicationStatus {...defaultProps} applicationDeadline={undefined} eventType="hackathon" />);

      expect(screen.getByText('Applications Status Unknown').closest('.application-status')).toHaveClass('application-status--unknown');
    });
  });

  describe('tooltip interactions', () => {
    it('shows tooltip when clicking the status', () => {
      render(<ApplicationStatus {...defaultProps} />);

      const statusElement = screen.getByText('Applications Open').closest('.application-status');
      fireEvent.click(statusElement!);

      expect(screen.getByText('Wrong info?')).toBeInTheDocument();
      expect(screen.getByText('Report Issue')).toBeInTheDocument();
      expect(screen.getByText('or')).toBeInTheDocument();
      expect(screen.getByText('Contribute Fix')).toBeInTheDocument();
    });

    it('hides tooltip when clicking the overlay', () => {
      render(<ApplicationStatus {...defaultProps} />);

      const statusElement = screen.getByText('Applications Open').closest('.application-status');
      fireEvent.click(statusElement!);

      expect(screen.getByText('Wrong info?')).toBeInTheDocument();

      const overlay = document.querySelector('.application-status-overlay');
      fireEvent.click(overlay!);

      expect(screen.queryByText('Wrong info?')).not.toBeInTheDocument();
    });

    it('toggles tooltip when clicking the status multiple times', () => {
      render(<ApplicationStatus {...defaultProps} />);

      const statusElement = screen.getByText('Applications Open').closest('.application-status');

      // First click - show tooltip
      fireEvent.click(statusElement!);
      expect(screen.getByText('Wrong info?')).toBeInTheDocument();

      // Second click - hide tooltip
      fireEvent.click(statusElement!);
      expect(screen.queryByText('Wrong info?')).not.toBeInTheDocument();
    });

    it('shows deadline in tooltip for open status', () => {
      render(<ApplicationStatus {...defaultProps} applicationDeadline="2026-06-01" />);

      const statusElement = screen.getByText('Applications Open').closest('.application-status');
      fireEvent.click(statusElement!);

      expect(screen.getByText('Closes Jun 1, 2026')).toBeInTheDocument();
    });

    it('shows deadline in tooltip for closed status', () => {
      render(<ApplicationStatus {...defaultProps} applicationDeadline="2025-01-01" />);

      const statusElement = screen.getByText('Applications Closed').closest('.application-status');
      fireEvent.click(statusElement!);

      expect(screen.getByText('Closed Jan 1, 2025')).toBeInTheDocument();
    });

    it('does not show deadline in tooltip for unknown status', () => {
      // Use undefined deadline with hackathon type to get unknown status
      render(<ApplicationStatus {...defaultProps} applicationDeadline={undefined} eventType="hackathon" />);

      const statusElement = screen.getByText('Applications Status Unknown').closest('.application-status');
      fireEvent.click(statusElement!);

      expect(screen.queryByText('Closes')).not.toBeInTheDocument();
      expect(screen.queryByText('Closed')).not.toBeInTheDocument();
    });
  });

  describe('report issue functionality', () => {
    it('opens GitHub issue URL when clicking Report Issue button', () => {
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());

      render(<ApplicationStatus {...defaultProps} />);

      const statusElement = screen.getByText('Applications Open').closest('.application-status');
      fireEvent.click(statusElement!);

      const reportButton = screen.getByText('Report Issue');
      fireEvent.click(reportButton);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        expect.stringContaining('github.com/tjklint/CanConf/issues/new'),
        '_blank',
        'noopener,noreferrer'
      );

      windowOpenSpy.mockRestore();
    });

    it('includes event name in GitHub issue URL', async () => {
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());

      render(<ApplicationStatus {...defaultProps} eventName="My Hackathon" />);

      const statusElement = screen.getByText('Applications Open').closest('.application-status');
      fireEvent.click(statusElement!);

      const reportButton = screen.getByText('Report Issue');
      fireEvent.click(reportButton);

      await waitFor(() => {
        expect(windowOpenSpy).toHaveBeenCalledWith(
          expect.stringContaining('My%20Hackathon'),
          expect.anything(),
          expect.anything()
        );
      });

      windowOpenSpy.mockRestore();
    });

    it('includes current status in GitHub issue URL', async () => {
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());

      render(<ApplicationStatus {...defaultProps} applicationDeadline="2026-06-01" />);

      const statusElement = screen.getByText('Applications Open').closest('.application-status');
      fireEvent.click(statusElement!);

      const reportButton = screen.getByText('Report Issue');
      fireEvent.click(reportButton);

      await waitFor(() => {
        expect(windowOpenSpy).toHaveBeenCalledWith(
          expect.stringContaining('Open%20(closes%20Jun%201%2C%202026)'),
          expect.anything(),
          expect.anything()
        );
      });

      windowOpenSpy.mockRestore();
    });

    it('includes closed status in GitHub issue URL', async () => {
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());

      render(<ApplicationStatus {...defaultProps} applicationDeadline="2025-01-01" />);

      const statusElement = screen.getByText('Applications Closed').closest('.application-status');
      fireEvent.click(statusElement!);

      const reportButton = screen.getByText('Report Issue');
      fireEvent.click(reportButton);

      await waitFor(() => {
        expect(windowOpenSpy).toHaveBeenCalledWith(
          expect.stringContaining('Closed%20(closed%20Jan%201%2C%202025)'),
          expect.anything(),
          expect.anything()
        );
      });

      windowOpenSpy.mockRestore();
    });

    it('includes unknown status in GitHub issue URL', async () => {
      // Use undefined deadline with hackathon type to get unknown status
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());

      render(<ApplicationStatus {...defaultProps} applicationDeadline={undefined} eventType="hackathon" />);

      const statusElement = screen.getByText('Applications Status Unknown').closest('.application-status');
      fireEvent.click(statusElement!);

      const reportButton = screen.getByText('Report Issue');
      fireEvent.click(reportButton);

      await waitFor(() => {
        expect(windowOpenSpy).toHaveBeenCalledWith(
          expect.stringContaining('Unknown'),
          expect.anything(),
          expect.anything()
        );
      });

      windowOpenSpy.mockRestore();
    });
  });

  describe('contribute fix link', () => {
    it('renders the contribute fix link with correct attributes', () => {
      render(<ApplicationStatus {...defaultProps} />);

      const statusElement = screen.getByText('Applications Open').closest('.application-status');
      fireEvent.click(statusElement!);

      const contributeLink = screen.getByText('Contribute Fix');
      expect(contributeLink).toHaveAttribute('href', 'https://github.com/tjklint/CanConf/blob/main/.github/CONTRIBUTING.md');
      expect(contributeLink).toHaveAttribute('target', '_blank');
      expect(contributeLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('has correct title on contribute fix link', () => {
      render(<ApplicationStatus {...defaultProps} />);

      const statusElement = screen.getByText('Applications Open').closest('.application-status');
      fireEvent.click(statusElement!);

      const contributeLink = screen.getByText('Contribute Fix');
      expect(contributeLink).toHaveAttribute('title', 'Learn how to contribute corrections');
    });
  });

  describe('accessibility', () => {
    it('has correct title on report button', () => {
      render(<ApplicationStatus {...defaultProps} />);

      const statusElement = screen.getByText('Applications Open').closest('.application-status');
      fireEvent.click(statusElement!);

      const reportButton = screen.getByText('Report Issue');
      expect(reportButton).toHaveAttribute('title', 'Report incorrect application status');
    });
  });

  describe('edge cases', () => {
    it('handles deadline exactly at current time (closed)', () => {
      jest.setSystemTime(new Date('2026-06-01'));
      render(<ApplicationStatus {...defaultProps} applicationDeadline="2026-06-01" />);

      expect(screen.getByText('Applications Closed')).toBeInTheDocument();
    });

    it('handles deadline one millisecond in the future (open)', () => {
      jest.setSystemTime(new Date('2026-05-31T23:59:59.999'));
      render(<ApplicationStatus {...defaultProps} applicationDeadline="2026-06-01" />);

      expect(screen.getByText('Applications Open')).toBeInTheDocument();
    });
  });
});
