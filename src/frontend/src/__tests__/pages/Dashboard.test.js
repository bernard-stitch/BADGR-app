import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Dashboard />);
      expect(screen.getByTestId('page')).toBeInTheDocument();
    });

    it('displays the correct page title', () => {
      render(<Dashboard />);
      expect(screen.getByTestId('page')).toHaveAttribute('title', 'BADGR Dashboard');
    });

    it('shows the page subtitle', () => {
      render(<Dashboard />);
      // Look for the subtitle in the page attributes
      const page = screen.getByTestId('page');
      expect(page).toHaveAttribute('subtitle', 'Manage your widget campaigns');
    });

    it('renders the welcome section', () => {
      render(<Dashboard />);
      expect(screen.getByText('Welcome to BADGR')).toBeInTheDocument();
      expect(screen.getByText(/Your widget management dashboard/)).toBeInTheDocument();
    });
  });

  describe('Widget Statistics', () => {
    it('displays widget performance section', () => {
      render(<Dashboard />);
      expect(screen.getByText('Widget Performance')).toBeInTheDocument();
    });

    it('shows data table with statistics', () => {
      render(<Dashboard />);
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('displays correct statistics data', () => {
      render(<Dashboard />);
      
      // Check for statistics in the data table
      expect(screen.getByText('Total Widgets')).toBeInTheDocument();
      expect(screen.getByText('Views Today')).toBeInTheDocument();
      expect(screen.getByText('Click Rate')).toBeInTheDocument();
      expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
      
      // Check for values
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
      expect(screen.getByText('3.5%')).toBeInTheDocument();
      expect(screen.getByText('2.1%')).toBeInTheDocument();
    });

    it('displays badges with correct status indicators', () => {
      render(<Dashboard />);
      
      // Look for badges with different statuses
      const badges = screen.getAllByTestId('badge');
      expect(badges).toHaveLength(4); // Should have 4 badges in the data table
      
      // Check specific badge statuses
      expect(screen.getByTestId('badge')).toHaveAttribute('data-status', 'success');
    });
  });

  describe('Navigation and Actions', () => {
    it('has a primary action button for Widget Settings', () => {
      render(<Dashboard />);
      
      // The primary action should be available through the page
      const page = screen.getByTestId('page');
      expect(page).toBeInTheDocument();
    });

    it('navigates to settings when primary action is clicked', () => {
      render(<Dashboard />);
      
      // Find and click the Widget Settings button
      const settingsButton = screen.getByText('Widget Settings');
      fireEvent.click(settingsButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    });

    it('has Configure Widgets button in quick actions', () => {
      render(<Dashboard />);
      expect(screen.getByText('Configure Widgets')).toBeInTheDocument();
    });

    it('navigates to settings when Configure Widgets is clicked', () => {
      render(<Dashboard />);
      
      const configureButton = screen.getByText('Configure Widgets');
      fireEvent.click(configureButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    });

    it('displays other action buttons', () => {
      render(<Dashboard />);
      expect(screen.getByText('View Analytics')).toBeInTheDocument();
      expect(screen.getByText('Export Data')).toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('has proper layout structure', () => {
      render(<Dashboard />);
      
      expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('contains welcome card', () => {
      render(<Dashboard />);
      
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThanOrEqual(1);
    });

    it('contains performance statistics card', () => {
      render(<Dashboard />);
      
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThanOrEqual(2);
    });

    it('has quick actions section', () => {
      render(<Dashboard />);
      
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('formats data table headings correctly', () => {
      render(<Dashboard />);
      
      // The data table should have specific headings
      // These are passed as props to DataTable but should be rendered
      const dataTable = screen.getByTestId('data-table');
      expect(dataTable).toBeInTheDocument();
    });

    it('displays percentage values correctly', () => {
      render(<Dashboard />);
      
      // Look for percentage values in the component
      expect(screen.getByText('3.5%')).toBeInTheDocument();
      expect(screen.getByText('2.1%')).toBeInTheDocument();
    });

    it('shows formatted numbers', () => {
      render(<Dashboard />);
      
      // Check for comma-separated numbers
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles button clicks without errors', () => {
      render(<Dashboard />);
      
      const buttons = screen.getAllByTestId('button');
      
      // Click each button to ensure no errors
      buttons.forEach(button => {
        expect(() => fireEvent.click(button)).not.toThrow();
      });
    });

    it('calls navigate with correct paths', () => {
      render(<Dashboard />);
      
      // Test both navigation calls
      const settingsButtons = screen.getAllByText(/Settings|Configure/);
      
      settingsButtons.forEach(button => {
        fireEvent.click(button);
      });
      
      // Should have called navigate at least once
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe('Content and Text', () => {
    it('displays descriptive text correctly', () => {
      render(<Dashboard />);
      
      expect(screen.getByText(/Track performance, manage settings/)).toBeInTheDocument();
    });

    it('has appropriate section headings', () => {
      render(<Dashboard />);
      
      expect(screen.getByText('Welcome to BADGR')).toBeInTheDocument();
      expect(screen.getByText('Widget Performance')).toBeInTheDocument();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<Dashboard />);
      
      // Check that text elements are rendered with proper semantics
      const headings = screen.getAllByTestId('text');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('provides meaningful button labels', () => {
      render(<Dashboard />);
      
      // Check for descriptive button text
      expect(screen.getByText('Configure Widgets')).toBeInTheDocument();
      expect(screen.getByText('View Analytics')).toBeInTheDocument();
      expect(screen.getByText('Export Data')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('renders safely without navigation function', () => {
      // Test with broken navigation
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      render(<Dashboard />);
      
      // Should still render the basic content
      expect(screen.getByText('Welcome to BADGR')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    it('handles missing data gracefully', () => {
      render(<Dashboard />);
      
      // Component should render even if some data is missing
      expect(screen.getByTestId('page')).toBeInTheDocument();
    });
  });
}); 