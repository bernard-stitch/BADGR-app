import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlacementSelector from '../../components/PlacementSelector';

const mockProps = {
  selectedPlacement: 'below_price',
  onChange: jest.fn()
};

describe('PlacementSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<PlacementSelector {...mockProps} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('displays the component title', () => {
    render(<PlacementSelector {...mockProps} />);
    expect(screen.getByText(/widget placement/i)).toBeInTheDocument();
  });

  it('renders all placement options', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Check for placement option titles
    expect(screen.getByText(/product page top/i)).toBeInTheDocument();
    expect(screen.getByText(/product page bottom/i)).toBeInTheDocument();
    expect(screen.getByText(/near add to cart/i)).toBeInTheDocument();
    expect(screen.getByText(/product tabs/i)).toBeInTheDocument();
    expect(screen.getByText(/sidebar/i)).toBeInTheDocument();
    expect(screen.getByText(/floating widget/i)).toBeInTheDocument();
  });

  it('shows the selected placement as checked', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Find the radio button for "below_price" (Product Page Bottom)
    const selectedRadio = screen.getByRole('radio', { checked: true });
    expect(selectedRadio).toBeInTheDocument();
  });

  it('calls onChange when a different placement is selected', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Click on "near add to cart" option
    const addToCartRadio = screen.getByDisplayValue('below_add_to_cart');
    fireEvent.click(addToCartRadio);
    
    expect(mockProps.onChange).toHaveBeenCalledWith('below_add_to_cart');
  });

  it('displays placement descriptions', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Check for descriptive text
    expect(screen.getByText(/highest visibility/i)).toBeInTheDocument();
    expect(screen.getByText(/balanced approach/i)).toBeInTheDocument();
    expect(screen.getByText(/high converting/i)).toBeInTheDocument();
  });

  it('shows impact assessments for placements', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Check for impact indicators
    expect(screen.getByText(/high impact/i)).toBeInTheDocument();
    expect(screen.getByText(/medium impact/i)).toBeInTheDocument();
  });

  it('displays status badges for placements', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Check for badges
    const badges = screen.getAllByTestId('badge');
    expect(badges.length).toBeGreaterThan(0);
    
    // Check for specific badge content
    expect(screen.getByText('Recommended')).toBeInTheDocument();
    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('High Converting')).toBeInTheDocument();
  });

  it('provides preview functionality', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Look for preview buttons
    const previewButtons = screen.getAllByRole('button', { name: /preview/i });
    expect(previewButtons.length).toBeGreaterThan(0);
  });

  it('opens modal when preview is clicked', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Click on a preview button
    const previewButton = screen.getAllByRole('button', { name: /preview/i })[0];
    fireEvent.click(previewButton);
    
    // Modal should be open
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Open modal
    const previewButton = screen.getAllByRole('button', { name: /preview/i })[0];
    fireEvent.click(previewButton);
    
    // Close modal
    const closeButton = screen.getByTestId('modal-close');
    fireEvent.click(closeButton);
    
    // Modal should be closed
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('displays placement mockups in preview', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Open modal
    const previewButton = screen.getAllByRole('button', { name: /preview/i })[0];
    fireEvent.click(previewButton);
    
    // Should show mockup content
    expect(screen.getByText(/placement preview/i)).toBeInTheDocument();
  });

  it('allows selecting placement from preview modal', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Open modal
    const previewButton = screen.getAllByRole('button', { name: /preview/i })[0];
    fireEvent.click(previewButton);
    
    // Click "Select this placement" button
    const selectButton = screen.getByRole('button', { name: /select this placement/i });
    fireEvent.click(selectButton);
    
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('displays responsive grid layout', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Check that placement options are laid out in a grid
    const placementOptions = screen.getAllByRole('radio');
    expect(placementOptions.length).toBe(6); // 6 placement options
  });

  it('shows color-coded badges correctly', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Check for different badge statuses
    expect(screen.getByText('Recommended')).toBeInTheDocument();
    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('High Converting')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('handles no selection state', () => {
    const propsWithNoSelection = {
      selectedPlacement: null,
      onChange: jest.fn()
    };
    
    render(<PlacementSelector {...propsWithNoSelection} />);
    
    // No radio button should be checked
    const checkedRadios = screen.queryAllByRole('radio', { checked: true });
    expect(checkedRadios).toHaveLength(0);
  });

  it('provides accessibility features', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Radio buttons should have proper labels
    const radios = screen.getAllByRole('radio');
    radios.forEach(radio => {
      expect(radio).toHaveAttribute('aria-label');
    });
  });

  it('shows detailed placement information', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Each placement should have detailed info
    expect(screen.getByText(/product page top/i)).toBeInTheDocument();
    expect(screen.getByText(/product page bottom/i)).toBeInTheDocument();
    expect(screen.getByText(/sidebar/i)).toBeInTheDocument();
    expect(screen.getByText(/floating widget/i)).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(<PlacementSelector {...mockProps} />);
    
    // Radio buttons should be keyboard navigable
    const radios = screen.getAllByRole('radio');
    radios.forEach(radio => {
      expect(radio).toBeVisible();
    });
  });
}); 