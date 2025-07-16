import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PredefinedLogoSelector from '../../components/PredefinedLogoSelector';

const mockProps = {
  selectedLogo: 'klarna-logo.svg',
  onChange: jest.fn()
};

describe('PredefinedLogoSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('displays the component title', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    expect(screen.getByText(/select bnpl provider logo/i)).toBeInTheDocument();
  });

  it('shows filter buttons for logo categories', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /popular/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /major providers/i })).toBeInTheDocument();
  });

  it('renders all available BNPL provider logos', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    // Check for logo options
    expect(screen.getByText('Klarna')).toBeInTheDocument();
    expect(screen.getByText('Afterpay')).toBeInTheDocument();
    expect(screen.getByText('Affirm')).toBeInTheDocument();
    expect(screen.getByText('Sezzle')).toBeInTheDocument();
    expect(screen.getByText('Zip')).toBeInTheDocument();
    expect(screen.getByText('PayPal Credit')).toBeInTheDocument();
    expect(screen.getByText('Generic BNPL')).toBeInTheDocument();
  });

  it('shows the selected logo with selected state', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    // Find the selected Klarna logo
    const klarnaOption = screen.getByText('Klarna').closest('[data-selected="true"]');
    expect(klarnaOption).toBeInTheDocument();
  });

  it('calls onChange when a different logo is selected', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    // Click on Afterpay logo
    const afterpayOption = screen.getByText('Afterpay');
    fireEvent.click(afterpayOption);
    
    expect(mockProps.onChange).toHaveBeenCalledWith('afterpay-logo.svg');
  });

  it('displays logo previews', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    // Check for image elements (mocked as 'test-file-stub')
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('shows provider descriptions', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    expect(screen.getByText(/4 interest-free payments/i)).toBeInTheDocument();
    expect(screen.getByText(/pay in 30 days/i)).toBeInTheDocument();
    expect(screen.getByText(/3-36 monthly payments/i)).toBeInTheDocument();
  });

  it('displays status badges for providers', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    // Check for badges
    const badges = screen.getAllByTestId('badge');
    expect(badges.length).toBeGreaterThan(0);
    
    // Check for specific badge content
    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('Global')).toBeInTheDocument();
    expect(screen.getByText('US/CA')).toBeInTheDocument();
  });

  it('filters logos by category', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    // Click on "Popular" filter
    const popularButton = screen.getByRole('button', { name: /popular/i });
    fireEvent.click(popularButton);
    
    // Should still show providers but potentially in filtered view
    expect(screen.getByText('Klarna')).toBeInTheDocument();
    expect(screen.getByText('Afterpay')).toBeInTheDocument();
  });

  it('handles "All" filter correctly', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    // Click on "All" filter
    const allButton = screen.getByRole('button', { name: /all/i });
    fireEvent.click(allButton);
    
    // Should show all providers
    expect(screen.getByText('Klarna')).toBeInTheDocument();
    expect(screen.getByText('Generic BNPL')).toBeInTheDocument();
  });

  it('shows current selection indicator', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    // Look for selection indicator on Klarna
    const selectedElement = screen.getByText('Klarna').closest('[data-testid="logo-option"]');
    expect(selectedElement).toHaveAttribute('data-selected', 'true');
  });

  it('displays provider information consistently', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    // Each logo option should have name, description, and badge
    expect(screen.getByText('Klarna')).toBeInTheDocument();
    expect(screen.getByText('Afterpay')).toBeInTheDocument();
    expect(screen.getByText('Affirm')).toBeInTheDocument();
    
    // Check descriptions exist
    const descriptions = screen.getAllByText(/payments|days|monthly/i);
    expect(descriptions.length).toBeGreaterThan(3);
  });

  it('handles no selection state', () => {
    const propsWithNoSelection = {
      selectedLogo: null,
      onChange: jest.fn()
    };
    
    render(<PredefinedLogoSelector {...propsWithNoSelection} />);
    
    // No logo should be marked as selected
    const selectedElements = screen.queryAllByTestId('logo-option[data-selected="true"]');
    expect(selectedElements).toHaveLength(0);
  });

  it('supports keyboard navigation', () => {
    render(<PredefinedLogoSelector {...mockProps} />);
    
    // Logo options should be focusable
    const logoOptions = screen.getAllByText(/klarna|afterpay|affirm/i);
    logoOptions.forEach(option => {
      expect(option.closest('button, [tabindex]')).toBeInTheDocument();
    });
  });
}); 