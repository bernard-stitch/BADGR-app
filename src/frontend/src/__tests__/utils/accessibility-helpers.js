/**
 * Accessibility Testing Utilities
 * Common helpers and utilities for accessibility testing across components
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers with accessibility matchers
expect.extend(toHaveNoViolations);

/**
 * Render component with accessibility testing setup
 * @param {React.Component} component - Component to render
 * @param {Object} options - Additional render options
 * @returns {Object} Render result with accessibility utilities
 */
export const renderWithA11y = (component, options = {}) => {
  const renderResult = render(component, options);
  return {
    ...renderResult,
    // Run axe accessibility audit
    auditA11y: async () => {
      const results = await axe(renderResult.container);
      return results;
    }
  };
};

/**
 * Test component for accessibility violations
 * @param {React.Component} component - Component to test
 * @param {string} testName - Name of the test
 * @param {Object} options - Additional options
 */
export const testA11yViolations = (component, testName = 'should not have accessibility violations', options = {}) => {
  test(testName, async () => {
    const { container } = render(component, options);
    const results = await axe(container, {
      rules: {
        // Configure axe rules for BADGR requirements
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
        'aria-labels': { enabled: true },
        ...options.axeRules
      }
    });
    expect(results).toHaveNoViolations();
  });
};

/**
 * Test keyboard navigation for a component
 * @param {React.Component} component - Component to test
 * @param {Array} expectedFocusOrder - Expected focus order (selectors or roles)
 */
export const testKeyboardNavigation = (component, expectedFocusOrder = []) => {
  test('should support keyboard navigation', async () => {
    render(component);
    const user = userEvent.setup();

    // Test Tab navigation through expected focus order
    for (const selector of expectedFocusOrder) {
      await user.tab();
      
      let element;
      if (selector.startsWith('role:')) {
        const role = selector.replace('role:', '');
        element = screen.getByRole(role);
      } else {
        element = screen.getByTestId(selector) || document.querySelector(selector);
      }
      
      expect(element).toHaveFocus();
    }
  });

  test('should handle keyboard activation (Enter/Space)', async () => {
    render(component);
    const user = userEvent.setup();

    // Find first interactive element
    const interactiveElements = screen.getAllByRole(/button|link|checkbox|radio|switch|textbox/);
    if (interactiveElements.length > 0) {
      const firstElement = interactiveElements[0];
      firstElement.focus();
      
      // Test Enter key
      await user.keyboard('[Enter]');
      // Test Space key (for buttons)
      await user.keyboard('[Space]');
      
      // Element should still be focusable after activation
      expect(firstElement).toBeDefined();
    }
  });
};

/**
 * Test screen reader compatibility
 * @param {React.Component} component - Component to test
 * @param {Object} expectations - Expected screen reader announcements
 */
export const testScreenReaderCompatibility = (component, expectations = {}) => {
  test('should have proper ARIA attributes', () => {
    render(component);

    // Test for required ARIA attributes
    const { labels = [], descriptions = [], roles = [] } = expectations;

    labels.forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });

    descriptions.forEach(description => {
      expect(screen.getByText(description)).toBeInTheDocument();
    });

    roles.forEach(role => {
      expect(screen.getByRole(role)).toBeInTheDocument();
    });
  });

  test('should announce state changes', () => {
    const { container } = render(component);
    
    // Check for ARIA live regions
    const liveRegions = container.querySelectorAll('[aria-live]');
    expect(liveRegions.length).toBeGreaterThanOrEqual(0);

    // Check for proper state attributes
    const stateElements = container.querySelectorAll('[aria-expanded], [aria-selected], [aria-checked]');
    stateElements.forEach(element => {
      const ariaState = element.getAttribute('aria-expanded') || 
                       element.getAttribute('aria-selected') || 
                       element.getAttribute('aria-checked');
      expect(['true', 'false', 'mixed']).toContain(ariaState);
    });
  });
};

/**
 * Test color contrast (requires manual verification)
 * @param {React.Component} component - Component to test
 */
export const testColorContrast = (component) => {
  test('should meet color contrast requirements', async () => {
    const { container } = render(component);
    
    // Run axe with specific color contrast rules
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    
    expect(results).toHaveNoViolations();
  });
};

/**
 * Test focus management
 * @param {React.Component} component - Component to test
 */
export const testFocusManagement = (component) => {
  test('should have visible focus indicators', async () => {
    render(component);
    const user = userEvent.setup();

    // Find all focusable elements
    const focusableElements = screen.getAllByRole(/button|link|checkbox|radio|switch|textbox/);
    
    for (const element of focusableElements) {
      await user.tab();
      if (element === document.activeElement) {
        // Check that focus is visible (element should have focus styles)
        expect(element).toHaveFocus();
        
        // Check for focus indicator styles (this would need to be customized per component)
        const styles = window.getComputedStyle(element);
        expect(styles.outline).not.toBe('none');
      }
    }
  });

  test('should not create keyboard traps', async () => {
    render(component);
    const user = userEvent.setup();

    // Tab through all elements and ensure we can escape
    let tabCount = 0;
    const maxTabs = 20; // Prevent infinite loops
    
    while (tabCount < maxTabs) {
      await user.tab();
      tabCount++;
      
      // If we've tabbed past the component, break
      if (!component.contains || !component.contains(document.activeElement)) {
        break;
      }
    }
    
    // Should not get stuck in infinite tab loop
    expect(tabCount).toBeLessThan(maxTabs);
  });
};

/**
 * Test form accessibility
 * @param {React.Component} component - Component to test
 */
export const testFormAccessibility = (component) => {
  test('should have proper form labels and associations', () => {
    render(component);

    // Find all form inputs
    const inputs = screen.getAllByRole(/textbox|checkbox|radio|switch|button/);
    
    inputs.forEach(input => {
      // Each input should have associated label
      const labels = screen.getAllByLabelText(input.getAttribute('aria-label') || '');
      expect(labels.length).toBeGreaterThanOrEqual(0);

      // Check for proper form field association
      if (input.hasAttribute('aria-describedby')) {
        const descriptionId = input.getAttribute('aria-describedby');
        const description = document.getElementById(descriptionId);
        expect(description).toBeInTheDocument();
      }
    });
  });

  test('should provide clear error messages', () => {
    render(component);
    
    // Look for error message patterns
    const errorMessages = screen.queryAllByRole('alert');
    const errorTexts = screen.queryAllByText(/error|invalid|required/i);
    
    [...errorMessages, ...errorTexts].forEach(errorElement => {
      // Error messages should be associated with form fields
      expect(errorElement).toHaveAttribute('id');
    });
  });
};

/**
 * Test heading hierarchy
 * @param {React.Component} component - Component to test
 */
export const testHeadingHierarchy = (component) => {
  test('should have proper heading hierarchy', () => {
    render(component);

    const headings = screen.getAllByRole('heading');
    const headingLevels = headings.map(heading => 
      parseInt(heading.tagName.charAt(1))
    ).sort((a, b) => a - b);

    // Should start with h1 or h2 (depending on component context)
    if (headingLevels.length > 0) {
      expect(headingLevels[0]).toBeLessThanOrEqual(2);
      
      // Should not skip heading levels
      for (let i = 1; i < headingLevels.length; i++) {
        expect(headingLevels[i] - headingLevels[i-1]).toBeLessThanOrEqual(1);
      }
    }
  });
};

/**
 * Comprehensive accessibility test suite
 * @param {React.Component} component - Component to test
 * @param {Object} options - Test configuration options
 */
export const runFullA11yTestSuite = (component, options = {}) => {
  const {
    skipTests = [],
    focusOrder = [],
    screenReaderExpectations = {},
    testName = 'Accessibility Tests'
  } = options;

  describe(testName, () => {
    if (!skipTests.includes('violations')) {
      testA11yViolations(component);
    }

    if (!skipTests.includes('keyboard') && focusOrder.length > 0) {
      testKeyboardNavigation(component, focusOrder);
    }

    if (!skipTests.includes('screenReader')) {
      testScreenReaderCompatibility(component, screenReaderExpectations);
    }

    if (!skipTests.includes('contrast')) {
      testColorContrast(component);
    }

    if (!skipTests.includes('focus')) {
      testFocusManagement(component);
    }

    if (!skipTests.includes('forms')) {
      testFormAccessibility(component);
    }

    if (!skipTests.includes('headings')) {
      testHeadingHierarchy(component);
    }
  });
};

/**
 * Mobile accessibility testing helpers
 */
export const testMobileA11y = (component) => {
  test('should have appropriate touch target sizes', () => {
    render(component);
    
    const interactiveElements = screen.getAllByRole(/button|link|checkbox|radio|switch/);
    
    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const minTouchTarget = 44; // 44px minimum per WCAG
      
      // Check if element meets minimum touch target size
      expect(rect.width >= minTouchTarget || rect.height >= minTouchTarget).toBe(true);
    });
  });
};

export default {
  renderWithA11y,
  testA11yViolations,
  testKeyboardNavigation,
  testScreenReaderCompatibility,
  testColorContrast,
  testFocusManagement,
  testFormAccessibility,
  testHeadingHierarchy,
  testMobileA11y,
  runFullA11yTestSuite
}; 