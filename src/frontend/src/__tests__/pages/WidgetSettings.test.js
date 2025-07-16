/**
 * WidgetSettings Component Tests
 * Comprehensive tests for the WidgetSettings page component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import WidgetSettings from '../../pages/WidgetSettings';

// Mock React Router
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock our custom components
jest.mock('../../components/PredefinedLogoSelector', () => {
  return function MockPredefinedLogoSelector({ value, onChange, label }) {
    return (
      <div data-testid="predefined-logo-selector">
        <label>{label}</label>
        <button
          onClick={() => onChange({ id: 'affirm', name: 'Affirm', url: '/logos/affirm.svg' })}
          data-testid="select-affirm-logo"
        >
          Select Affirm Logo
        </button>
        {value && <span data-testid="selected-logo">{value.name}</span>}
      </div>
    );
  };
});

jest.mock('../../components/BNPLOptionsToggle', () => {
  return function MockBNPLOptionsToggle({ value, onChange, disabled }) {
    return (
      <div data-testid="bnpl-options-toggle">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
          disabled={disabled}
          data-testid="bnpl-enabled-toggle"
        />
        <label>Enable BNPL Options</label>
      </div>
    );
  };
});

jest.mock('../../components/PlacementSelector', () => {
  return function MockPlacementSelector({ value, onChange, disabled }) {
    return (
      <div data-testid="placement-selector">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          data-testid="placement-select"
        >
          <option value="product_page_top">Product Page Top</option>
          <option value="product_page_bottom">Product Page Bottom</option>
          <option value="cart_page">Cart Page</option>
        </select>
      </div>
    );
  };
});

// Mock Shopify Polaris components
jest.mock('@shopify/polaris', () => ({
  Page: ({ children, title, subtitle, breadcrumbs, primaryAction, secondaryActions }) => (
    <div data-testid="polaris-page">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {breadcrumbs && breadcrumbs.map((crumb, index) => (
        <button key={index} onClick={crumb.onAction} data-testid="breadcrumb">
          {crumb.content}
        </button>
      ))}
      {primaryAction && (
        <button
          onClick={primaryAction.onAction}
          disabled={primaryAction.disabled}
          data-testid="primary-action"
        >
          {primaryAction.loading ? 'Loading...' : primaryAction.content}
        </button>
      )}
      {secondaryActions && secondaryActions.map((action, index) => (
        <button
          key={index}
          onClick={action.onAction}
          disabled={action.disabled}
          data-testid="secondary-action"
        >
          {action.content}
        </button>
      ))}
      {children}
    </div>
  ),
  Layout: ({ children }) => <div data-testid="polaris-layout">{children}</div>,
  Card: ({ children }) => <div data-testid="polaris-card">{children}</div>,
  Text: ({ children, variant, as: Component = 'span' }) => (
    <Component data-testid={`polaris-text-${variant}`}>{children}</Component>
  ),
  Button: ({ children, onClick, disabled, loading }) => (
    <button onClick={onClick} disabled={disabled} data-testid="polaris-button">
      {loading ? 'Loading...' : children}
    </button>
  ),
  TextField: ({ label, value, onChange, placeholder, helpText, multiline }) => (
    <div data-testid="polaris-textfield">
      <label>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid="textfield-input"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid="textfield-input"
        />
      )}
      {helpText && <div data-testid="textfield-help">{helpText}</div>}
    </div>
  ),
  Select: ({ label, value, onChange, options, disabled }) => (
    <div data-testid="polaris-select">
      <label>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        data-testid="select-input"
      >
        {options && options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
  Checkbox: ({ label, checked, onChange, helpText, disabled }) => (
    <div data-testid="polaris-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        data-testid="checkbox-input"
      />
      <label>{label}</label>
      {helpText && <div data-testid="checkbox-help">{helpText}</div>}
    </div>
  ),
  FormLayout: ({ children }) => <div data-testid="polaris-form-layout">{children}</div>,
  Banner: ({ title, status, children }) => (
    <div data-testid="polaris-banner" className={`banner-${status}`}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  ),
  Toast: ({ content, error, onDismiss }) => (
    <div data-testid="polaris-toast" className={error ? 'error' : 'success'}>
      {content}
      <button onClick={onDismiss} data-testid="toast-dismiss">×</button>
    </div>
  ),
  Frame: ({ children }) => <div data-testid="polaris-frame">{children}</div>,
  Spinner: ({ size }) => <div data-testid="polaris-spinner" className={`spinner-${size}`}>Loading...</div>,
  Badge: ({ children, status }) => (
    <span data-testid="polaris-badge" className={`badge-${status}`}>{children}</span>
  ),
  LegacyStack: ({ children, vertical, spacing }) => (
    <div data-testid="polaris-stack" className={vertical ? 'vertical' : 'horizontal'}>
      {children}
    </div>
  ),
  Divider: () => <hr data-testid="polaris-divider" />,
  'Layout.Section': ({ children }) => <div data-testid="layout-section">{children}</div>,
}));

// Mock fetch
global.fetch = jest.fn();

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('WidgetSettings Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API response by default
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        shopDomain: 'test-shop.myshopify.com',
        widgetTitle: 'BADGR Widget',
        isEnabled: true,
        customCSS: '',
        logo: { selectedLogo: null },
        bnplOptions: {
          enabled: false,
          providers: {
            affirm: false,
            klarna: false,
            afterpay: false,
            sezzle: false,
            zip: false,
          },
        },
        placement: 'product_page_bottom',
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    test('should render page structure correctly', async () => {
      renderWithRouter(<WidgetSettings />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Check main page elements
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Widget Settings');
      expect(screen.getByText('Configure your BADGR widget appearance and behavior')).toBeInTheDocument();
      expect(screen.getByTestId('primary-action')).toHaveTextContent('Save Configuration');
      expect(screen.getByTestId('secondary-action')).toHaveTextContent('Reset Changes');
    });

    test('should show loading state initially', () => {
      renderWithRouter(<WidgetSettings />);

      // Should show spinner while loading
      expect(screen.getByTestId('polaris-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading widget configuration...')).toBeInTheDocument();
    });

    test('should render all configuration sections', async () => {
      renderWithRouter(<WidgetSettings />);

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Check all main sections are present
      expect(screen.getByText('Basic Settings')).toBeInTheDocument();
      expect(screen.getByTestId('predefined-logo-selector')).toBeInTheDocument();
      expect(screen.getByTestId('bnpl-options-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('placement-selector')).toBeInTheDocument();
      expect(screen.getByText('Advanced Settings')).toBeInTheDocument();
    });
  });

  describe('Basic Settings', () => {
    test('should handle shop domain input', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      const shopDomainInput = screen.getByDisplayValue('test-shop.myshopify.com');
      expect(shopDomainInput).toBeInTheDocument();

      // Update shop domain
      await user.clear(shopDomainInput);
      await user.type(shopDomainInput, 'new-shop.myshopify.com');
      expect(shopDomainInput).toHaveValue('new-shop.myshopify.com');
    });

    test('should handle widget title input', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      const titleInput = screen.getByDisplayValue('BADGR Widget');
      expect(titleInput).toBeInTheDocument();

      // Update widget title
      await user.clear(titleInput);
      await user.type(titleInput, 'Custom Widget Title');
      expect(titleInput).toHaveValue('Custom Widget Title');
    });

    test('should handle widget enable/disable toggle', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      const enableToggle = screen.getByLabelText('Enable Widget');
      expect(enableToggle).toBeChecked();

      // Disable widget
      await user.click(enableToggle);
      expect(enableToggle).not.toBeChecked();
    });
  });

  describe('Logo Configuration', () => {
    test('should handle logo selection', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Select a logo
      const selectLogoButton = screen.getByTestId('select-affirm-logo');
      await user.click(selectLogoButton);

      // Check logo is selected
      expect(screen.getByTestId('selected-logo')).toHaveTextContent('Affirm');
    });
  });

  describe('BNPL Configuration', () => {
    test('should handle BNPL options toggle', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      const bnplToggle = screen.getByTestId('bnpl-enabled-toggle');
      expect(bnplToggle).not.toBeChecked();

      // Enable BNPL
      await user.click(bnplToggle);
      expect(bnplToggle).toBeChecked();
    });

    test('should disable BNPL when widget is disabled', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Disable widget
      const enableToggle = screen.getByLabelText('Enable Widget');
      await user.click(enableToggle);

      // BNPL should be disabled
      const bnplToggle = screen.getByTestId('bnpl-enabled-toggle');
      expect(bnplToggle).toBeDisabled();
    });
  });

  describe('Placement Configuration', () => {
    test('should handle placement selection', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      const placementSelect = screen.getByTestId('placement-select');
      expect(placementSelect).toHaveValue('product_page_bottom');

      // Change placement
      await user.selectOptions(placementSelect, 'cart_page');
      expect(placementSelect).toHaveValue('cart_page');
    });

    test('should disable placement when widget is disabled', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Disable widget
      const enableToggle = screen.getByLabelText('Enable Widget');
      await user.click(enableToggle);

      // Placement should be disabled
      const placementSelect = screen.getByTestId('placement-select');
      expect(placementSelect).toBeDisabled();
    });
  });

  describe('Advanced Settings', () => {
    test('should handle custom CSS input', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      const cssInputs = screen.getAllByTestId('textfield-input');
      const customCSSInput = cssInputs.find(input => input.tagName === 'TEXTAREA');
      expect(customCSSInput).toBeInTheDocument();

      // Add custom CSS
      await user.type(customCSSInput, '.badgr-widget { color: red; }');
      expect(customCSSInput).toHaveValue('.badgr-widget { color: red; }');
    });

    test('should display configuration summary badges', async () => {
      renderWithRouter(<WidgetSettings />);

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Check summary badges
      expect(screen.getByText('Widget Enabled')).toBeInTheDocument();
      expect(screen.getByText('Logo Not Selected')).toBeInTheDocument();
      expect(screen.getByText('BNPL Disabled')).toBeInTheDocument();
      expect(screen.getByText(/Placement:/)).toBeInTheDocument();
    });
  });

  describe('Save and Reset Functionality', () => {
    test('should save configuration successfully', async () => {
      // Mock successful save response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Make a change to enable save button
      const titleInput = screen.getByDisplayValue('BADGR Widget');
      await user.type(titleInput, ' Modified');

      // Save configuration
      const saveButton = screen.getByTestId('primary-action');
      await user.click(saveButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/widgets/config', expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }));
      });
    });

    test('should handle save error', async () => {
      // Mock error response
      global.fetch.mockResolvedValueOnce({
        ok: false,
      });

      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Make a change and save
      const titleInput = screen.getByDisplayValue('BADGR Widget');
      await user.type(titleInput, ' Modified');

      const saveButton = screen.getByTestId('primary-action');
      await user.click(saveButton);

      // Should show error toast
      await waitFor(() => {
        expect(screen.getByText('Error saving configuration. Please try again.')).toBeInTheDocument();
      });
    });

    test('should reset configuration', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Make a change
      const titleInput = screen.getByDisplayValue('BADGR Widget');
      await user.clear(titleInput);
      await user.type(titleInput, 'Modified Title');

      // Reset changes
      const resetButton = screen.getByTestId('secondary-action');
      await user.click(resetButton);

      // Should reload original configuration
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/widgets/current-config');
      });
    });
  });

  describe('Navigation', () => {
    test('should navigate to dashboard on breadcrumb click', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Click dashboard breadcrumb
      const dashboardBreadcrumb = screen.getByTestId('breadcrumb');
      await user.click(dashboardBreadcrumb);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Unsaved Changes Tracking', () => {
    test('should track unsaved changes', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Initially no unsaved changes warning
      expect(screen.queryByText('You have unsaved changes.')).not.toBeInTheDocument();

      // Make a change
      const titleInput = screen.getByDisplayValue('BADGR Widget');
      await user.type(titleInput, ' Modified');

      // Should show unsaved changes warning
      expect(screen.getByText('You have unsaved changes.')).toBeInTheDocument();
    });

    test('should enable save button when changes are made', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      const saveButton = screen.getByTestId('primary-action');
      
      // Initially disabled (no changes)
      expect(saveButton).toBeDisabled();

      // Make a change
      const titleInput = screen.getByDisplayValue('BADGR Widget');
      await user.type(titleInput, ' Modified');

      // Should enable save button
      expect(saveButton).not.toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    test('should handle configuration loading error', async () => {
      // Mock fetch to reject
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<WidgetSettings />);

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Should show error toast
      expect(screen.getByText('Error loading configuration')).toBeInTheDocument();
    });
  });

  describe('Toast Notifications', () => {
    test('should show and dismiss toast notifications', async () => {
      renderWithRouter(<WidgetSettings />);
      const user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByTestId('polaris-spinner')).not.toBeInTheDocument();
      });

      // Trigger an error to show toast
      global.fetch.mockRejectedValueOnce(new Error('Test error'));
      
      const titleInput = screen.getByDisplayValue('BADGR Widget');
      await user.type(titleInput, ' Test');
      
      const saveButton = screen.getByTestId('primary-action');
      await user.click(saveButton);

      // Should show error toast
      await waitFor(() => {
        expect(screen.getByTestId('polaris-toast')).toBeInTheDocument();
      });

      // Dismiss toast
      const dismissButton = screen.getByTestId('toast-dismiss');
      await user.click(dismissButton);

      expect(screen.queryByTestId('polaris-toast')).not.toBeInTheDocument();
    });
  });
}); 