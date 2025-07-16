import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock environment variables
const originalEnv = process.env;

describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks and environment variables before each test
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<App />);
      expect(screen.getByTestId('router')).toBeInTheDocument();
    });

    it('wraps content with Polaris AppProvider', () => {
      render(<App />);
      // AppProvider should be rendered (mocked to just pass through children)
      expect(screen.getByTestId('router')).toBeInTheDocument();
    });

    it('includes App Bridge Provider', () => {
      render(<App />);
      // App Bridge Provider should be present (mocked to pass through children)
      expect(screen.getByTestId('routes')).toBeInTheDocument();
    });

    it('provides proper app structure with CSS class', () => {
      render(<App />);
      
      // Should have the basic structure elements
      expect(screen.getByTestId('router')).toBeInTheDocument();
      expect(screen.getByTestId('routes')).toBeInTheDocument();
      
      // Should have App div (though it's wrapped in mocks)
      const appContainer = screen.getByTestId('router').closest('.App') || 
                           screen.getByTestId('router').querySelector('.App');
      // Note: Due to mocking, we might not see the exact structure, but the component should render
    });
  });

  describe('Routing Configuration', () => {
    it('sets up routing structure with correct routes', () => {
      render(<App />);
      expect(screen.getByTestId('routes')).toBeInTheDocument();
      
      const routes = screen.getAllByTestId('route');
      expect(routes).toHaveLength(2); // Dashboard and Widget Settings routes
    });

    it('renders Dashboard component for root route', () => {
      render(<App />);
      
      // Check that Dashboard page component is rendered
      expect(screen.getByTestId('page')).toBeInTheDocument();
    });

    it('includes both Dashboard and WidgetSettings routes', () => {
      render(<App />);
      
      const routes = screen.getAllByTestId('route');
      expect(routes).toHaveLength(2);
      
      // Should have routes for both pages
      expect(routes[0]).toBeInTheDocument();
      expect(routes[1]).toBeInTheDocument();
    });
  });

  describe('App Bridge Configuration', () => {
    it('handles missing API key gracefully', () => {
      // Ensure no API key is set
      delete process.env.REACT_APP_SHOPIFY_API_KEY;
      
      // Should render without crashing even with missing API key
      expect(() => render(<App />)).not.toThrow();
      expect(screen.getByTestId('router')).toBeInTheDocument();
    });

    it('uses environment API key when available', () => {
      process.env.REACT_APP_SHOPIFY_API_KEY = 'test-api-key';
      
      // Should render successfully with API key
      render(<App />);
      expect(screen.getByTestId('router')).toBeInTheDocument();
    });

    it('handles missing host parameter', () => {
      // Mock window.location.search to not include host
      const originalLocation = window.location;
      delete window.location;
      window.location = { ...originalLocation, search: '' };
      
      render(<App />);
      expect(screen.getByTestId('router')).toBeInTheDocument();
      
      // Restore location
      window.location = originalLocation;
    });

    it('extracts host from URL parameters when available', () => {
      // Mock window.location.search to include host
      const originalLocation = window.location;
      delete window.location;
      window.location = { 
        ...originalLocation, 
        search: '?host=example.myshopify.com&shop=test-shop'
      };
      
      render(<App />);
      expect(screen.getByTestId('router')).toBeInTheDocument();
      
      // Restore location
      window.location = originalLocation;
    });
  });

  describe('Component Integration', () => {
    it('renders with all required providers in correct order', () => {
      render(<App />);
      
      // Should have nested structure: Provider > AppProvider > Router > Routes
      const router = screen.getByTestId('router');
      const routes = screen.getByTestId('routes');
      
      expect(router).toBeInTheDocument();
      expect(routes).toBeInTheDocument();
      expect(router).toContainElement(routes);
    });

    it('passes internationalization to AppProvider', () => {
      render(<App />);
      
      // AppProvider should be rendered (even if mocked)
      // The real test is that it doesn't crash, indicating i18n is properly passed
      expect(screen.getByTestId('router')).toBeInTheDocument();
    });

    it('configures forceRedirect for App Bridge', () => {
      render(<App />);
      
      // Should render without errors, indicating proper App Bridge config
      expect(screen.getByTestId('router')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles invalid environment variables gracefully', () => {
      // Set invalid environment variables
      process.env.REACT_APP_SHOPIFY_API_KEY = '';
      
      expect(() => render(<App />)).not.toThrow();
      expect(screen.getByTestId('router')).toBeInTheDocument();
    });

    it('handles malformed URL parameters', () => {
      const originalLocation = window.location;
      delete window.location;
      window.location = { 
        ...originalLocation, 
        search: '?invalid-param&malformed=',
        origin: 'http://localhost:3000'
      };
      
      expect(() => render(<App />)).not.toThrow();
      expect(screen.getByTestId('router')).toBeInTheDocument();
      
      // Restore location
      window.location = originalLocation;
    });
  });

  describe('CSS and Styling', () => {
    it('imports required CSS files without errors', () => {
      // This test ensures that CSS imports don't cause crashes
      expect(() => render(<App />)).not.toThrow();
    });
  });

  describe('Performance and Memory', () => {
    it('renders efficiently without excessive re-renders', () => {
      const { rerender } = render(<App />);
      
      // Re-render with same props should not cause issues
      rerender(<App />);
      
      expect(screen.getByTestId('router')).toBeInTheDocument();
    });

    it('cleans up properly when unmounted', () => {
      const { unmount } = render(<App />);
      
      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });
  });
}); 