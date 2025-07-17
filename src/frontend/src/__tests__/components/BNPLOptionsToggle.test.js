import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BNPLOptionsToggle from '../../components/BNPLOptionsToggle';

const mockProps = {
  value: {
    enabled: true,
    providers: {
      affirm: false,
      klarna: true,
      afterpay: true,
      sezzle: false,
      zip: false,
    }
  },
  onChange: jest.fn()
};

describe('BNPLOptionsToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('displays the main BNPL toggle', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    const mainToggle = screen.getByRole('checkbox', { name: /enable buy now pay later options/i });
    expect(mainToggle).toBeInTheDocument();
    expect(mainToggle).toBeChecked();
  });

  it('calls onChange when main toggle is clicked', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    const mainToggle = screen.getByRole('checkbox', { name: /enable buy now pay later options/i });
    
    fireEvent.click(mainToggle);
    
    expect(mockProps.onChange).toHaveBeenCalledWith({
      enabled: false,
      providers: {
        affirm: false,
        klarna: false,
        afterpay: false,
        sezzle: false,
        zip: false,
      }
    });
  });

  it('displays provider count badge when providers are enabled', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByText('2 enabled')).toBeInTheDocument();
  });

  it('shows warning when no providers are selected', () => {
    const propsWithNoProviders = {
      ...mockProps,
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
    
    render(<BNPLOptionsToggle {...propsWithNoProviders} />);
    expect(screen.getByTestId('banner')).toBeInTheDocument();
    expect(screen.getByText(/select at least one payment provider/i)).toBeInTheDocument();
  });

  it('renders all available BNPL providers', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    // Check for provider names in checkbox labels
    expect(screen.getByRole('checkbox', { name: /affirm/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /klarna/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /afterpay/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /sezzle/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /zip/i })).toBeInTheDocument();
  });

  it('shows enabled providers as checked', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    // Klarna and Afterpay should be checked
    const klarnaCheckbox = screen.getByRole('checkbox', { name: /klarna/i });
    const afterpayCheckbox = screen.getByRole('checkbox', { name: /afterpay/i });
    const affirmCheckbox = screen.getByRole('checkbox', { name: /affirm/i });
    
    expect(klarnaCheckbox).toBeChecked();
    expect(afterpayCheckbox).toBeChecked();
    expect(affirmCheckbox).not.toBeChecked();
  });

  it('calls onChange when a provider is toggled', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    const affirmCheckbox = screen.getByRole('checkbox', { name: /affirm/i });
    fireEvent.click(affirmCheckbox);
    
    expect(mockProps.onChange).toHaveBeenCalledWith({
      enabled: true,
      providers: {
        affirm: true,
        klarna: true,
        afterpay: true,
        sezzle: false,
        zip: false,
      }
    });
  });

  it('handles unchecking a provider', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    const klarnaCheckbox = screen.getByRole('checkbox', { name: /klarna/i });
    fireEvent.click(klarnaCheckbox);
    
    expect(mockProps.onChange).toHaveBeenCalledWith({
      enabled: true,
      providers: {
        affirm: false,
        klarna: false,
        afterpay: true,
        sezzle: false,
        zip: false,
      }
    });
  });

  it('toggles advanced settings visibility', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    // Advanced settings should not be visible initially
    expect(screen.queryByText(/show provider logos/i)).not.toBeInTheDocument();
    
    // Click the advanced settings button
    const advancedButton = screen.getByRole('button', { name: /advanced settings/i });
    fireEvent.click(advancedButton);
    
    // Advanced settings should now be visible
    expect(screen.getByRole('checkbox', { name: /show provider logos/i })).toBeInTheDocument();
  });

  it('handles advanced settings changes', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    // Open advanced settings
    const advancedButton = screen.getByRole('button', { name: /advanced settings/i });
    fireEvent.click(advancedButton);
    
    // Toggle show logos
    const showLogosCheckbox = screen.getByRole('checkbox', { name: /show provider logos/i });
    fireEvent.click(showLogosCheckbox);
    
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('displays tooltip with helpful information', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    // Check if tooltip is present with the correct content
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toHaveAttribute('data-content', 'Display Buy Now Pay Later options in your widget to increase conversion rates');
  });

  it('disables provider selection when BNPL is disabled', () => {
    const propsWithDisabledBNPL = {
      ...mockProps,
      value: {
        enabled: false,
        providers: {
          affirm: false,
          klarna: true,
          afterpay: true,
          sezzle: false,
          zip: false,
        }
      }
    };
    
    render(<BNPLOptionsToggle {...propsWithDisabledBNPL} />);
    
    // Provider checkboxes should not be visible when BNPL is disabled
    expect(screen.queryByRole('checkbox', { name: /klarna/i })).not.toBeInTheDocument();
  });
}); 