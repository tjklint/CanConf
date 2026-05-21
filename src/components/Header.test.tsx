import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    mockOnNavigate.mockClear();
  });

  it('renders the header with logo and navigation', () => {
    render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('CanConf 🍁')).toBeInTheDocument();
    expect(screen.getByText('about')).toBeInTheDocument();
    expect(screen.getByText('contribute')).toBeInTheDocument();
    expect(screen.getByText('on')).toBeInTheDocument();
  });

  it('navigates to home when clicking the logo', () => {
    render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

    fireEvent.click(screen.getByLabelText(/canconf - go to homepage/i));

    expect(mockOnNavigate).toHaveBeenCalledWith('home');
    expect(mockOnNavigate).toHaveBeenCalledTimes(1);
  });

  it('navigates to about page when clicking about link', () => {
    render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

    fireEvent.click(screen.getByText('about'));

    expect(mockOnNavigate).toHaveBeenCalledWith('about');
  });

  it('shows active state for about page when currentPage is about', () => {
    render(<Header currentPage="about" onNavigate={mockOnNavigate} />);

    const aboutLink = screen.getByText('about');
    expect(aboutLink).toHaveClass('header__link--active');
    expect(aboutLink).toHaveAttribute('aria-current', 'page');
  });

  it('does not show active state for about page when currentPage is not about', () => {
    render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

    const aboutLink = screen.getByText('about');
    expect(aboutLink).not.toHaveClass('header__link--active');
    expect(aboutLink).not.toHaveAttribute('aria-current');
  });

  it('renders contribute link with correct attributes', () => {
    render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

    const contributeLink = screen.getByText('contribute').closest('a');
    expect(contributeLink).toHaveAttribute('href', 'https://github.com/tjklint/CanConf/blob/main/.github/CONTRIBUTING.md');
    expect(contributeLink).toHaveAttribute('target', '_blank');
    expect(contributeLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders GitHub link with correct attributes', () => {
    render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

    const githubLink = screen.getByLabelText(/star canconf/i);
    expect(githubLink).toHaveAttribute('href', 'https://github.com/tjklint/CanConf');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders separators between navigation items', () => {
    render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

    const separators = screen.getAllByText('•');
    expect(separators).toHaveLength(2);
    separators.forEach(separator => {
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('renders GitHub icon SVG', () => {
    render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
    expect(document.querySelector('.header__github-icon')).toBeInTheDocument();
  });

  it('has proper aria-labels for accessibility', () => {
    render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

    expect(screen.getByLabelText(/canconf - go to homepage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/about canconf/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contribute events/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/star canconf/i)).toBeInTheDocument();
  });

  it('has proper navigation role and aria-label', () => {
    render(<Header currentPage="home" onNavigate={mockOnNavigate} />);

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });
});
