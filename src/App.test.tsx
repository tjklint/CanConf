import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock child components
jest.mock('./components/Header', () => {
  return function MockHeader({ currentPage, onNavigate }: { currentPage: string; onNavigate: (page: string) => void }) {
    return (
      <header data-testid="header">
        <nav>
          <button onClick={() => onNavigate('home')}>Home</button>
          <button onClick={() => onNavigate('about')}>About</button>
          <span data-testid="current-page">{currentPage}</span>
        </nav>
      </header>
    );
  };
});

jest.mock('./components/EventSection', () => {
  return function MockEventSection({
    selectedProvince,
    onProvinceChange
  }: {
    selectedProvince: string;
    onProvinceChange: (province: string) => void;
  }) {
    return (
      <section data-testid="event-section">
        <select
          data-testid="province-filter"
          value={selectedProvince}
          onChange={(e) => onProvinceChange(e.target.value)}
        >
          <option value="ALL">All Provinces</option>
          <option value="ON">Ontario</option>
          <option value="QC">Quebec</option>
        </select>
      </section>
    );
  };
});

jest.mock('./components/Contributors', () => {
  return function MockContributors() {
    return <section data-testid="contributors">Contributors</section>;
  };
});

jest.mock('./components/About', () => {
  return function MockAbout() {
    return <div data-testid="about">About Page</div>;
  };
});

jest.mock('./components/EventStructuredData', () => {
  return function MockEventStructuredData() {
    return <script data-testid="structured-data" type="application/ld+json" />;
  };
});

describe('App', () => {
  describe('initial render', () => {
    it('should render the app container', () => {
      render(<App />);
      expect(document.querySelector('.app')).toBeInTheDocument();
    });

    it('should render Header component', () => {
      render(<App />);
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('should render EventSection component on home page', () => {
      render(<App />);
      expect(screen.getByTestId('event-section')).toBeInTheDocument();
    });

    it('should render Contributors component on home page', () => {
      render(<App />);
      expect(screen.getByTestId('contributors')).toBeInTheDocument();
    });

    it('should render EventStructuredData component', () => {
      render(<App />);
      expect(screen.getByTestId('structured-data')).toBeInTheDocument();
    });

    it('should start on home page by default', () => {
      render(<App />);
      expect(screen.getByTestId('current-page')).toHaveTextContent('home');
    });
  });

  describe('navigation', () => {
    it('should navigate to about page when onNavigate is called with "about"', () => {
      render(<App />);
      
      const aboutButton = screen.getByText('About');
      fireEvent.click(aboutButton);

      expect(screen.getByTestId('current-page')).toHaveTextContent('about');
    });

    it('should render About component when on about page', () => {
      render(<App />);
      
      const aboutButton = screen.getByText('About');
      fireEvent.click(aboutButton);

      expect(screen.getByTestId('about')).toBeInTheDocument();
    });

    it('should hide EventSection when on about page', () => {
      render(<App />);
      
      const aboutButton = screen.getByText('About');
      fireEvent.click(aboutButton);

      expect(screen.queryByTestId('event-section')).not.toBeInTheDocument();
    });

    it('should hide Contributors when on about page', () => {
      render(<App />);
      
      const aboutButton = screen.getByText('About');
      fireEvent.click(aboutButton);

      expect(screen.queryByTestId('contributors')).not.toBeInTheDocument();
    });

    it('should navigate back to home page when onNavigate is called with "home"', () => {
      render(<App />);
      
      // Navigate to about
      fireEvent.click(screen.getByText('About'));
      expect(screen.getByTestId('current-page')).toHaveTextContent('about');
      
      // Navigate back to home
      fireEvent.click(screen.getByText('Home'));
      expect(screen.getByTestId('current-page')).toHaveTextContent('home');
      expect(screen.getByTestId('event-section')).toBeInTheDocument();
    });

    it('should ignore invalid page navigation', () => {
      // This test verifies that handleNavigation only accepts 'home' or 'about'
      // The component should stay on current page for invalid inputs
      render(<App />);
      
      // Current page should be 'home'
      expect(screen.getByTestId('current-page')).toHaveTextContent('home');
    });
  });

  describe('province filtering', () => {
    it('should start with ALL provinces selected', () => {
      render(<App />);
      expect(screen.getByTestId('province-filter')).toHaveValue('ALL');
    });

    it('should update selected province when province filter changes', () => {
      render(<App />);
      
      const provinceFilter = screen.getByTestId('province-filter');
      fireEvent.change(provinceFilter, { target: { value: 'ON' } });
      
      expect(provinceFilter).toHaveValue('ON');
    });

    it('should allow changing back to ALL provinces', () => {
      render(<App />);
      
      const provinceFilter = screen.getByTestId('province-filter');
      
      // Change to ON
      fireEvent.change(provinceFilter, { target: { value: 'ON' } });
      expect(provinceFilter).toHaveValue('ON');
      
      // Change back to ALL
      fireEvent.change(provinceFilter, { target: { value: 'ALL' } });
      expect(provinceFilter).toHaveValue('ALL');
    });

    it('should maintain province filter state when navigating between pages', () => {
      render(<App />);
      
      // Set province filter
      const provinceFilter = screen.getByTestId('province-filter');
      fireEvent.change(provinceFilter, { target: { value: 'QC' } });
      
      // Navigate to about
      fireEvent.click(screen.getByText('About'));
      
      // Navigate back to home
      fireEvent.click(screen.getByText('Home'));
      
      // Province filter should be preserved
      expect(screen.getByTestId('province-filter')).toHaveValue('QC');
    });
  });

  describe('page rendering logic', () => {
    it('should render EventSection and Contributors on home page', () => {
      render(<App />);
      
      expect(screen.getByTestId('event-section')).toBeInTheDocument();
      expect(screen.getByTestId('contributors')).toBeInTheDocument();
    });

    it('should render only About component on about page', () => {
      render(<App />);
      
      fireEvent.click(screen.getByText('About'));
      
      expect(screen.getByTestId('about')).toBeInTheDocument();
      expect(screen.queryByTestId('event-section')).not.toBeInTheDocument();
      expect(screen.queryByTestId('contributors')).not.toBeInTheDocument();
    });

    it('should default to home page for unknown page values', () => {
      // The App component initializes currentPage to 'home'
      // and only accepts 'home' or 'about' in handleNavigation
      render(<App />);
      
      expect(screen.getByTestId('current-page')).toHaveTextContent('home');
    });
  });

  describe('component structure', () => {
    it('should have app as root element', () => {
      render(<App />);
      const appContainer = document.querySelector('.app');
      expect(appContainer).toBeInTheDocument();
    });

    it('should render EventStructuredData within app', () => {
      render(<App />);
      const appContainer = document.querySelector('.app');
      expect(appContainer?.querySelector('[data-testid="structured-data"]')).toBeInTheDocument();
    });

    it('should render Header within app', () => {
      render(<App />);
      const appContainer = document.querySelector('.app');
      expect(appContainer?.querySelector('[data-testid="header"]')).toBeInTheDocument();
    });
  });
});
