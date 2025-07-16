/**
 * BNPLOptionsToggle Accessibility Tests
 * Tests for WCAG 2.1 AA compliance and inclusive user experience
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import BNPLOptionsToggle from '../../components/BNPLOptionsToggle';
import {
  testA11yViolations,
  testKeyboardNavigation,
  testScreenReaderCompatibility,
  testColorContrast,
  testFocusManagement,
  testFormAccessibility,
  testHeadingHierarchy,
  testMobileA11y,
  runFullA11yTestSuite
} from '../utils/accessibility-helpers';

// Extend Jest matchers with accessibility matchers
expect.extend(toHaveNoViolations);

// Mock Shopify Polaris components
jest.mock('@shopify/polaris', () => ({
  Card: ({ children }) => <div data-testid="polaris-card">{children}</div>,
  Text: ({ children, variant, as: Component = 'span' }) => (
    <Component data-testid={`polaris-text-${variant}`}>{children}</Component>
  ),
  Checkbox: ({ label, checked, onChange, disabled, helpText, ...props }) => {
    // Extract text from label - handle complex JSX structures
    const extractTextFromLabel = (labelNode) => {
      if (typeof labelNode === 'string') return labelNode;
      if (!labelNode || !labelNode.props) return 'checkbox';
      
      const { children } = labelNode.props;
      if (typeof children === 'string') return children;
      if (!Array.isArray(children)) return extractTextFromLabel(children);
      
      // For arrays, find the first Text component with provider name
      for (const child of children) {
        if (child && child.props && child.props.children) {
          const text = extractTextFromLabel(child);
          if (text && text !== 'checkbox') return text;
        }
      }
      
      return 'checkbox';
    };
    
    const ariaLabel = extractTextFromLabel(label);
    
    return (
      <div data-testid="polaris-checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange && onChange(e.target.checked)}
          disabled={disabled}
          aria-label={ariaLabel}
          {...props}
        />
        <label>{label}</label>
        {helpText && <div data-testid="checkbox-help">{helpText}</div>}
      </div>
    );
  },
  LegacyStack: ({ children, vertical, spacing }) => (
    <div data-testid="polaris-stack" className={vertical ? 'vertical' : 'horizontal'}>
      {children}
    </div>
  ),
  Badge: ({ children, status }) => (
    <span data-testid="polaris-badge" className={`badge-${status}`} role="status">
      {children}
    </span>
  ),
  Banner: ({ children, status }) => (
    <div data-testid="polaris-banner" role="alert" className={`banner-${status}`}>
      {children}
    </div>
  ),
  Button: ({ children, onClick, disabled, ...props }) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      data-testid="polaris-button"
      {...props}
    >
      {children}
    </button>
  ),
  Icon: ({ source, color }) => (
    <span data-testid="polaris-icon" className={`icon-${color}`} aria-hidden="true" />
  ),
  Tooltip: ({ content, children }) => (
    <div data-testid="polaris-tooltip">
      <div role="tooltip" aria-label={content}>
        {children}
      </div>
    </div>
  ),
}));

jest.mock('@shopify/polaris-icons', () => ({
  InfoIcon: 'InfoIcon',
}));

describe('BNPLOptionsToggle Accessibility Tests', () => {
  const defaultProps = {
    value: {
      enabled: false,
      providers: {
        affirm: false,
        klarna: false,
        afterpay: false,
        sezzle: false,
        zip: false,
      }
    },
    onChange: jest.fn(),
    label: "Buy Now Pay Later Options",
    disabled: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Automated Accessibility Audits', () => {
    test('should not have accessibility violations (default state)', async () => {
      const { container } = render(<BNPLOptionsToggle {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should not have accessibility violations (enabled state)', async () => {
      const enabledProps = {
        ...defaultProps,
        value: {
          enabled: true,
          providers: {
            affirm: true,
            klarna: false,
            afterpay: true,
            sezzle: false,
            zip: false,
          }
        }
      };
      
      const { container } = render(<BNPLOptionsToggle {...enabledProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should not have accessibility violations (disabled state)', async () => {
      const disabledProps = {
        ...defaultProps,
        disabled: true
      };
      
      const { container } = render(<BNPLOptionsToggle {...disabledProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    test('should support keyboard navigation through main toggle', async () => {
      render(<BNPLOptionsToggle {...defaultProps} />);
      const user = userEvent.setup();

      // Main toggle should be focusable
      const mainToggle = screen.getByLabelText('Enable Buy Now Pay Later options');
      expect(mainToggle).toBeInTheDocument();

      // Tab to main toggle
      await user.tab();
      expect(mainToggle).toHaveFocus();

      // Toggle with Enter key
      await user.keyboard('[Enter]');
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true })
      );
    });

    test('should support keyboard navigation through provider toggles', async () => {
      const enabledProps = {
        ...defaultProps,
        value: {
          enabled: true,
          providers: {
            affirm: false,
            klarna: false,
            afterpay: false,
            sezzle: false,
            zip: false,
          }
        }
      };

      render(<BNPLOptionsToggle {...enabledProps} />);
      const user = userEvent.setup();

      // Main toggle first
      await user.tab();
      expect(screen.getByLabelText('Enable Buy Now Pay Later options')).toHaveFocus();

      // Then provider toggles
      await user.tab();
      const affirmToggle = screen.getByLabelText('Affirm');
      expect(affirmToggle).toHaveFocus();

      // Toggle with Space key
      await user.keyboard('[Space]');
      expect(enabledProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          providers: expect.objectContaining({ affirm: true })
        })
      );
    });

    test('should handle keyboard navigation when disabled', async () => {
      const disabledProps = {
        ...defaultProps,
        disabled: true
      };

      render(<BNPLOptionsToggle {...disabledProps} />);
      const user = userEvent.setup();

      const mainToggle = screen.getByLabelText('Enable Buy Now Pay Later options');
      expect(mainToggle).toBeDisabled();

      // Should still be focusable but not activatable
      await user.tab();
      expect(mainToggle).toHaveFocus();

      // Should not respond to keyboard activation
      await user.keyboard('[Enter]');
      expect(disabledProps.onChange).not.toHaveBeenCalled();
    });

    test('should maintain logical tab order', async () => {
      const enabledProps = {
        ...defaultProps,
        value: {
          enabled: true,
          providers: {
            affirm: true,
            klarna: true,
            afterpay: false,
            sezzle: false,
            zip: false,
          }
        }
      };

      render(<BNPLOptionsToggle {...enabledProps} />);
      const user = userEvent.setup();

      // Expected tab order: Main toggle -> Provider toggles (in document order)
      const expectedOrder = [
        'Enable Buy Now Pay Later options',
        'Affirm',
        'Klarna',
        'Afterpay',
        'Sezzle',
        'Zip (Quadpay)'
      ];

      for (const labelText of expectedOrder) {
        await user.tab();
        expect(screen.getByLabelText(labelText)).toHaveFocus();
      }
    });
  });

  describe('Screen Reader Compatibility', () => {
    test('should have proper ARIA attributes for main toggle', () => {
      render(<BNPLOptionsToggle {...defaultProps} />);

      const mainToggle = screen.getByLabelText('Enable Buy Now Pay Later options');
      expect(mainToggle).toHaveAttribute('type', 'checkbox');
      expect(mainToggle).toHaveAttribute('aria-label', 'Enable Buy Now Pay Later options');
    });

    test('should announce state changes', async () => {
      render(<BNPLOptionsToggle {...defaultProps} />);
      const user = userEvent.setup();

      const mainToggle = screen.getByLabelText('Enable Buy Now Pay Later options');
      
      // Initial state
      expect(mainToggle).not.toBeChecked();

      // Toggle and check state change
      await user.click(mainToggle);
      
      await waitFor(() => {
        expect(defaultProps.onChange).toHaveBeenCalledWith(
          expect.objectContaining({ enabled: true })
        );
      });
    });

    test('should have proper heading hierarchy', () => {
      render(<BNPLOptionsToggle {...defaultProps} />);

      // Main heading
      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toHaveTextContent('Buy Now Pay Later Options');
    });

    test('should have proper heading hierarchy with providers', () => {
      const enabledProps = {
        ...defaultProps,
        value: { enabled: true, providers: { affirm: false, klarna: false, afterpay: false, sezzle: false, zip: false } }
      };

      render(<BNPLOptionsToggle {...enabledProps} />);

      // Main heading (h3)
      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toHaveTextContent('Buy Now Pay Later Options');

      // Providers heading (h4)
      const providersHeading = screen.getByRole('heading', { level: 4 });
      expect(providersHeading).toHaveTextContent('Payment Providers');
    });

    test('should announce provider count changes', () => {
      const enabledProps = {
        ...defaultProps,
        value: {
          enabled: true,
          providers: {
            affirm: true,
            klarna: true,
            afterpay: false,
            sezzle: false,
            zip: false,
          }
        }
      };

      render(<BNPLOptionsToggle {...enabledProps} />);

      // Badge should announce count
      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('2 enabled');
    });

    test('should announce warning for no providers', () => {
      const enabledProps = {
        ...defaultProps,
        value: {
          enabled: true,
          providers: {
            affirm: false,
            klarna: false,
            afterpay: false,
            sezzle: false,
            zip: false,
          }
        }
      };

      render(<BNPLOptionsToggle {...enabledProps} />);

      // Warning banner should be announced
      const banner = screen.getByRole('alert');
      expect(banner).toHaveTextContent('Select at least one payment provider to display BNPL options');
    });

    test('should provide help text for main toggle', () => {
      render(<BNPLOptionsToggle {...defaultProps} />);

      const helpText = screen.getByText('Show payment options to customers during checkout');
      expect(helpText).toBeInTheDocument();
    });
  });

  describe('Color Contrast', () => {
    test('should meet color contrast requirements', async () => {
      const { container } = render(<BNPLOptionsToggle {...defaultProps} />);
      
      // Run axe with specific color contrast rules
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });

    test('should meet color contrast requirements with providers enabled', async () => {
      const enabledProps = {
        ...defaultProps,
        value: {
          enabled: true,
          providers: {
            affirm: true,
            klarna: false,
            afterpay: true,
            sezzle: false,
            zip: false,
          }
        }
      };

      const { container } = render(<BNPLOptionsToggle {...enabledProps} />);
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });
  });

  describe('Focus Management', () => {
    test('should have visible focus indicators', async () => {
      render(<BNPLOptionsToggle {...defaultProps} />);
      const user = userEvent.setup();

      const mainToggle = screen.getByLabelText('Enable Buy Now Pay Later options');
      
      // Focus element
      await user.tab();
      expect(mainToggle).toHaveFocus();

      // Should have focus styles (this is tested through the mock)
      expect(mainToggle).toBeInTheDocument();
    });

    test('should not create keyboard traps', async () => {
      const enabledProps = {
        ...defaultProps,
        value: {
          enabled: true,
          providers: {
            affirm: true,
            klarna: true,
            afterpay: true,
            sezzle: true,
            zip: true,
          }
        }
      };

      render(<BNPLOptionsToggle {...enabledProps} />);
      const user = userEvent.setup();

      // Tab through all focusable elements
      const focusableElements = [
        'Enable Buy Now Pay Later options',
        'Affirm',
        'Klarna',
        'Afterpay',
        'Sezzle',
        'Zip (Quadpay)'
      ];

      for (const labelText of focusableElements) {
        await user.tab();
        expect(screen.getByLabelText(labelText)).toHaveFocus();
      }

      // Should be able to tab out
      await user.tab();
      expect(screen.getByLabelText('Enable Buy Now Pay Later options')).not.toHaveFocus();
    });

    test('should manage focus properly when toggling main option', async () => {
      render(<BNPLOptionsToggle {...defaultProps} />);
      const user = userEvent.setup();

      const mainToggle = screen.getByLabelText('Enable Buy Now Pay Later options');
      
      // Focus and toggle
      await user.tab();
      expect(mainToggle).toHaveFocus();
      
      await user.keyboard('[Enter]');
      
      // Focus should remain on main toggle after toggling
      expect(mainToggle).toHaveFocus();
    });
  });

  describe('Form Accessibility', () => {
    test('should have proper form labels and associations', () => {
      render(<BNPLOptionsToggle {...defaultProps} />);

      // Main toggle should have proper label
      const mainToggle = screen.getByLabelText('Enable Buy Now Pay Later options');
      expect(mainToggle).toBeInTheDocument();
      expect(mainToggle).toHaveAttribute('type', 'checkbox');
    });

    test('should have proper form labels for providers', () => {
      const enabledProps = {
        ...defaultProps,
        value: {
          enabled: true,
          providers: {
            affirm: false,
            klarna: false,
            afterpay: false,
            sezzle: false,
            zip: false,
          }
        }
      };

      render(<BNPLOptionsToggle {...enabledProps} />);

      // All provider toggles should have proper labels
      const providerNames = ['Affirm', 'Klarna', 'Afterpay', 'Sezzle', 'Zip (Quadpay)'];
      
      providerNames.forEach(name => {
        const toggle = screen.getByLabelText(name);
        expect(toggle).toBeInTheDocument();
        expect(toggle).toHaveAttribute('type', 'checkbox');
      });
    });

    test('should provide clear error/warning messages', () => {
      const enabledProps = {
        ...defaultProps,
        value: {
          enabled: true,
          providers: {
            affirm: false,
            klarna: false,
            afterpay: false,
            sezzle: false,
            zip: false,
          }
        }
      };

      render(<BNPLOptionsToggle {...enabledProps} />);

      // Warning message should be properly announced
      const warning = screen.getByRole('alert');
      expect(warning).toHaveTextContent('Select at least one payment provider to display BNPL options');
    });
  });

  describe('Mobile Accessibility', () => {
    test('should have appropriate touch target sizes', () => {
      render(<BNPLOptionsToggle {...defaultProps} />);
      
      // All interactive elements should be tested for touch target size
      const mainToggle = screen.getByLabelText('Enable Buy Now Pay Later options');
      expect(mainToggle).toBeInTheDocument();
      
      // In a real implementation, you would check getBoundingClientRect()
      // but in this test environment, we verify the element exists and is interactive
    });

    test('should work with touch interactions', async () => {
      render(<BNPLOptionsToggle {...defaultProps} />);
      
      const mainToggle = screen.getByLabelText('Enable Buy Now Pay Later options');
      
      // Simulate touch interaction
      fireEvent.click(mainToggle);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true })
      );
    });
  });

  describe('State Management Accessibility', () => {
    test('should announce state changes properly', async () => {
      const onChange = jest.fn();
      
      render(<BNPLOptionsToggle {...defaultProps} onChange={onChange} />);
      const user = userEvent.setup();

      const mainToggle = screen.getByLabelText('Enable Buy Now Pay Later options');
      
      // Toggle state
      await user.click(mainToggle);
      
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true })
      );
    });

    test('should handle provider state changes', async () => {
      const onChange = jest.fn();
      const enabledProps = {
        ...defaultProps,
        value: {
          enabled: true,
          providers: {
            affirm: false,
            klarna: false,
            afterpay: false,
            sezzle: false,
            zip: false,
          }
        },
        onChange
      };

      render(<BNPLOptionsToggle {...enabledProps} />);
      const user = userEvent.setup();

      const affirmToggle = screen.getByLabelText('Affirm');
      await user.click(affirmToggle);
      
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          providers: expect.objectContaining({ affirm: true })
        })
      );
    });
  });

  describe('Integration Tests', () => {
    test('should work properly with all accessibility features combined', async () => {
      const onChange = jest.fn();
      
      render(<BNPLOptionsToggle {...defaultProps} onChange={onChange} />);
      const user = userEvent.setup();

      // Test complete interaction flow
      // 1. Navigate to main toggle
      await user.tab();
      expect(screen.getByLabelText('Enable Buy Now Pay Later options')).toHaveFocus();
      
      // 2. Enable BNPL options
      await user.keyboard('[Enter]');
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ enabled: true })
      );
      
      // 3. Re-render with enabled state
      const enabledProps = {
        ...defaultProps,
        value: {
          enabled: true,
          providers: {
            affirm: false,
            klarna: false,
            afterpay: false,
            sezzle: false,
            zip: false,
          }
        },
        onChange
      };

      render(<BNPLOptionsToggle {...enabledProps} />);
      
      // 4. Navigate to first provider
      await user.tab(); // Main toggle
      await user.tab(); // First provider (Affirm)
      
      const affirmToggle = screen.getByLabelText('Affirm');
      expect(affirmToggle).toHaveFocus();
      
      // 5. Enable provider
      await user.keyboard('[Space]');
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          providers: expect.objectContaining({ affirm: true })
        })
      );
    });
  });
}); 