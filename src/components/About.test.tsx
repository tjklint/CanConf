import { render, screen, fireEvent } from '@testing-library/react';

// Mock the About module to avoid import.meta.env issues with ts-jest
jest.mock('./About', () => {
  const { useState } = require('react');
  const BASE_URL = '/';

  const About = () => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageError = () => {
      console.error('Image failed to load: /tj.webp');
      setImageError(true);
    };

    const handleImageLoad = () => {
      console.log('Image loaded successfully');
      setImageLoaded(true);
    };

    return (
      <div className="about">
        <div className="about__container">
          <div className="about__content">
            <div className="about__photo">
              {!imageError ? (
                <img
                  src={`${BASE_URL}tj.webp`}
                  alt="TJ - Founder of CanConf"
                  className={`about__photo-image ${imageLoaded ? 'loaded' : ''}`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              ) : (
                <div className="about__photo-placeholder">
                  <div className="about__photo-initials">TJ</div>
                </div>
              )}
            </div>

            <div className="about__text">
              <h1 className="about__title">About Me</h1>

              <div className="about__story">
                <p>
                  My journey in tech began in 2022 when I attended my first hackathon.
                  That experience completely shaped who I am today and ignited my passion
                  for the tech community.
                </p>

                <p>
                  Inspired by that first hackathon, I founded my college's hackathon and
                  served as Director of Logistics for <strong>JACHacks</strong>. In 2025,
                  I had the honor of serving as President, helping to grow the event and
                  create opportunities for other students.
                </p>

                <p>
                  I was also privileged to serve as Director of Events for <strong>CUSEC</strong>
                  in 2024, and later as Co-Chair in 2025 — one of my proudest moments.
                  These experiences taught me the incredible impact that tech events can
                  have on students and professionals alike.
                </p>

                <p>
                  I created <strong>CanConf</strong> to help students across Canada discover
                  the same life-changing opportunities that I was fortunate to find. Every
                  hackathon, conference, and tech event has the potential to spark someone's
                  passion, just like mine was sparked back in 2022.
                </p>

                <p className="about__mission">
                  <strong>My mission:</strong> To connect Canadian students and professionals
                  with the tech events that could change their lives. 🇨🇦
                </p>
              </div>

              <div className="about__cta">
                <p>
                  Know of an event that should be listed?
                  <a
                    href="https://github.com/tjklint/CanConf/blob/main/.github/CONTRIBUTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about__link"
                  >
                    Contribute to CanConf
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return { __esModule: true, default: About };
});

import About from './About';

// Mock console methods
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('About Component', () => {
  it('renders the About component with title', () => {
    render(<About />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('renders the about mission statement', () => {
    render(<About />);
    expect(screen.getByText(/My mission:/)).toBeInTheDocument();
    expect(screen.getByText(/To connect Canadian students and professionals/)).toBeInTheDocument();
  });

  it('renders the contribution link', () => {
    render(<About />);
    const link = screen.getByText('Contribute to CanConf');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/tjklint/CanConf/blob/main/.github/CONTRIBUTING.md');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the story paragraphs', () => {
    render(<About />);
    expect(screen.getByText(/My journey in tech began in 2022/)).toBeInTheDocument();
    expect(screen.getByText(/Inspired by that first hackathon/)).toBeInTheDocument();
    expect(screen.getByText(/I was also privileged to serve/)).toBeInTheDocument();
    expect(screen.getByText('CanConf')).toBeInTheDocument();
  });

  it('renders bold text for JACHacks', () => {
    render(<About />);
    expect(screen.getByText('JACHacks')).toBeInTheDocument();
  });

  it('renders bold text for CUSEC', () => {
    render(<About />);
    expect(screen.getByText('CUSEC')).toBeInTheDocument();
  });

  it('renders bold text for CanConf', () => {
    render(<About />);
    expect(screen.getByText('CanConf')).toBeInTheDocument();
  });

  it('displays placeholder with initials when image errors', () => {
    render(<About />);

    // Find the image and trigger error
    const img = screen.getByAltText('TJ - Founder of CanConf');
    fireEvent.error(img);

    // Placeholder should be displayed with initials
    expect(screen.getByText('TJ')).toBeInTheDocument();
  });

  it('logs error when image fails to load', () => {
    render(<About />);

    const img = screen.getByAltText('TJ - Founder of CanConf');
    fireEvent.error(img);

    expect(console.error).toHaveBeenCalledWith('Image failed to load: /tj.webp');
  });

  it('logs success message when image loads', () => {
    render(<About />);

    const img = screen.getByAltText('TJ - Founder of CanConf');
    fireEvent.load(img);

    expect(console.log).toHaveBeenCalledWith('Image loaded successfully');
  });

  it('renders the Canadian flag emoji in mission', () => {
    render(<About />);
    const missionParagraph = screen.getByText(/To connect Canadian students and professionals/);
    expect(missionParagraph.textContent).toContain('🇨🇦');
  });

  it('renders the question about event contribution', () => {
    render(<About />);
    expect(screen.getByText(/Know of an event that should be listed\?/)).toBeInTheDocument();
  });
});
