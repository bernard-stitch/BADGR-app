import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BNPLOptionsToggle from '../../components/BNPLOptionsToggle';

const mockProps = {
  bnplEnabled: true,
  enabledProviders: ['klarna', 'afterpay'],
  showLogos: true,
  showPaymentBreakdown: true,
  applyToAllProducts: true,
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
    const mainToggle = screen.getByRole('checkbox', { name: /enable bnpl options/i });
    expect(mainToggle).toBeInTheDocument();
    expect(mainToggle).toBeChecked();
  });

  it('calls onChange when main toggle is clicked', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    const mainToggle = screen.getByRole('checkbox', { name: /enable bnpl options/i });
    
    fireEvent.click(mainToggle);
    
    expect(mockProps.onChange).toHaveBeenCalledWith({
      bnplEnabled: false,
      enabledProviders: mockProps.enabledProviders,
      showLogos: mockProps.showLogos,
      showPaymentBreakdown: mockProps.showPaymentBreakdown,
      applyToAllProducts: mockProps.applyToAllProducts
    });
  });

  it('displays provider count badge when providers are enabled', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByText('2 providers enabled')).toBeInTheDocument();
  });

  it('shows warning when no providers are selected', () => {
    const propsWithNoProviders = {
      ...mockProps,
      enabledProviders: []
    };
    
    render(<BNPLOptionsToggle {...propsWithNoProviders} />);
    expect(screen.getByTestId('banner')).toBeInTheDocument();
    expect(screen.getByText(/select at least one provider/i)).toBeInTheDocument();
  });

  it('renders all available BNPL providers', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    // Check for provider names
    expect(screen.getByText('Affirm')).toBeInTheDocument();
    expect(screen.getByText('Klarna')).toBeInTheDocument();
    expect(screen.getByText('Afterpay')).toBeInTheDocument();
    expect(screen.getByText('Sezzle')).toBeInTheDocument();
    expect(screen.getByText('Zip')).toBeInTheDocument();
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
      bnplEnabled: mockProps.bnplEnabled,
      enabledProviders: ['klarna', 'afterpay', 'affirm'],
      showLogos: mockProps.showLogos,
      showPaymentBreakdown: mockProps.showPaymentBreakdown,
      applyToAllProducts: mockProps.applyToAllProducts
    });
  });

  it('handles unchecking a provider', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    const klarnaCheckbox = screen.getByRole('checkbox', { name: /klarna/i });
    fireEvent.click(klarnaCheckbox);
    
    expect(mockProps.onChange).toHaveBeenCalledWith({
      bnplEnabled: mockProps.bnplEnabled,
      enabledProviders: ['afterpay'],
      showLogos: mockProps.showLogos,
      showPaymentBreakdown: mockProps.showPaymentBreakdown,
      applyToAllProducts: mockProps.applyToAllProducts
    });
  });

  it('toggles advanced settings visibility', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    // Advanced settings should be hidden initially
    expect(screen.queryByText(/show provider logos/i)).not.toBeInTheDocument();
    
    // Click the advanced settings button
    const advancedButton = screen.getByRole('button', { name: /advanced settings/i });
    fireEvent.click(advancedButton);
    
    // Advanced settings should now be visible
    expect(screen.getByText(/show provider logos/i)).toBeInTheDocument();
  });

  it('handles advanced settings changes', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    // Open advanced settings
    const advancedButton = screen.getByRole('button', { name: /advanced settings/i });
    fireEvent.click(advancedButton);
    
    // Toggle show logos
    const showLogosCheckbox = screen.getByRole('checkbox', { name: /show provider logos/i });
    fireEvent.click(showLogosCheckbox);
    
    expect(mockProps.onChange).toHaveBeenCalledWith({
      bnplEnabled: mockProps.bnplEnabled,
      enabledProviders: mockProps.enabledProviders,
      showLogos: false,
      showPaymentBreakdown: mockProps.showPaymentBreakdown,
      applyToAllProducts: mockProps.applyToAllProducts
    });
  });

  it('displays tooltip with helpful information', () => {
    render(<BNPLOptionsToggle {...mockProps} />);
    
    // Check if tooltip or info icon is present
    expect(screen.getByText(/buy now, pay later options/i)).toBeInTheDocument();
  });

  it('disables provider selection when BNPL is disabled', () => {
    const disabledProps = {
      ...mockProps,
      bnplEnabled: false
    };
    
    render(<BNPLOptionsToggle {...disabledProps} />);
    
    // Provider checkboxes should be disabled
    const klarnaCheckbox = screen.getByRole('checkbox', { name: /klarna/i });
    expect(klarnaCheckbox).toBeDisabled();
  });
}); 