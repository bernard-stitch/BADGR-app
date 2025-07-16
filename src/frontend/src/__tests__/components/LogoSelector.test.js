import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogoSelector from '../../components/LogoSelector';

// Mock URL.createObjectURL since it's not available in test environment
global.URL.createObjectURL = jest.fn(() => 'mock-blob-url');
global.URL.revokeObjectURL = jest.fn();

describe('LogoSelector Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<LogoSelector onChange={mockOnChange} />);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('displays default label', () => {
      render(<LogoSelector onChange={mockOnChange} />);
      expect(screen.getByText('Widget Logo')).toBeInTheDocument();
    });

    it('displays custom label when provided', () => {
      render(<LogoSelector onChange={mockOnChange} label="Custom Logo" />);
      expect(screen.getByText('Custom Logo')).toBeInTheDocument();
    });

    it('shows file upload zone', () => {
      render(<LogoSelector onChange={mockOnChange} />);
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
    });

    it('displays upload instructions', () => {
      render(<LogoSelector onChange={mockOnChange} />);
      expect(screen.getByText(/Accepts JPG, PNG, GIF, and SVG files/)).toBeInTheDocument();
    });

    it('shows size recommendations', () => {
      render(<LogoSelector onChange={mockOnChange} />);
      expect(screen.getByText(/Recommended size: 200x60px/)).toBeInTheDocument();
    });
  });

  describe('File Upload Functionality', () => {
    it('handles valid image file upload', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const dropZone = screen.getByTestId('drop-zone');
      
      // Simulate file drop
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(file, 'mock-blob-url');
      });
    });

    it('displays uploaded file preview', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(screen.getByText('test.png')).toBeInTheDocument();
        expect(screen.getByTestId('thumbnail')).toBeInTheDocument();
      });
    });

    it('shows file size in KB', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      // Create a file with known size (1024 bytes = 1 KB)
      const file = new File(['x'.repeat(1024)], 'test.png', { type: 'image/png' });
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(screen.getByText('1.0 KB')).toBeInTheDocument();
      });
    });

    it('provides remove button for uploaded file', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(screen.getByText('Remove')).toBeInTheDocument();
      });
    });
  });

  describe('File Validation', () => {
    it('rejects non-image files', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/Please select an image file/)).toBeInTheDocument();
        expect(mockOnChange).not.toHaveBeenCalled();
      });
    });

    it('rejects files larger than 5MB', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      // Create a file larger than 5MB
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', { type: 'image/png' });
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [largeFile],
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/File size must be less than 5MB/)).toBeInTheDocument();
        expect(mockOnChange).not.toHaveBeenCalled();
      });
    });

    it('shows error banner for validation failures', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(screen.getByTestId('banner')).toBeInTheDocument();
        expect(screen.getByText('Upload Error')).toBeInTheDocument();
      });
    });

    it('clears previous errors on valid upload', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      const dropZone = screen.getByTestId('drop-zone');
      
      // First, upload invalid file
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [invalidFile],
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/Please select an image file/)).toBeInTheDocument();
      });

      // Then, upload valid file
      const validFile = new File(['test'], 'test.png', { type: 'image/png' });
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [validFile],
        },
      });

      await waitFor(() => {
        expect(screen.queryByText(/Please select an image file/)).not.toBeInTheDocument();
        expect(mockOnChange).toHaveBeenCalledWith(validFile, 'mock-blob-url');
      });
    });
  });

  describe('Remove Functionality', () => {
    it('removes uploaded file when remove button clicked', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const dropZone = screen.getByTestId('drop-zone');
      
      // Upload file
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(screen.getByText('test.png')).toBeInTheDocument();
      });

      // Click remove
      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText('test.png')).not.toBeInTheDocument();
        expect(mockOnChange).toHaveBeenLastCalledWith(null, null);
      });
    });

    it('clears errors when file is removed', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const dropZone = screen.getByTestId('drop-zone');
      
      // Upload file
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(screen.getByText('test.png')).toBeInTheDocument();
      });

      // Remove file
      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
      });
    });
  });

  describe('Existing Value Handling', () => {
    it('displays existing logo when value prop provided', () => {
      render(<LogoSelector onChange={mockOnChange} value="existing-logo-url" />);
      
      expect(screen.getByText('Current logo')).toBeInTheDocument();
      expect(screen.getByTestId('thumbnail')).toBeInTheDocument();
    });

    it('shows remove button for existing logo', () => {
      render(<LogoSelector onChange={mockOnChange} value="existing-logo-url" />);
      
      expect(screen.getByText('Remove')).toBeInTheDocument();
    });

    it('removes existing logo when remove clicked', () => {
      render(<LogoSelector onChange={mockOnChange} value="existing-logo-url" />);
      
      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);
      
      expect(mockOnChange).toHaveBeenCalledWith(null, null);
      expect(screen.queryByText('Current logo')).not.toBeInTheDocument();
    });

    it('replaces existing logo with new upload', async () => {
      render(<LogoSelector onChange={mockOnChange} value="existing-logo-url" />);
      
      const file = new File(['test'], 'new-logo.png', { type: 'image/png' });
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(screen.getByText('new-logo.png')).toBeInTheDocument();
        expect(screen.queryByText('Current logo')).not.toBeInTheDocument();
        expect(mockOnChange).toHaveBeenCalledWith(file, 'mock-blob-url');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty file drop gracefully', () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [],
        },
      });

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('handles missing onChange prop', async () => {
      render(<LogoSelector />);
      
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const dropZone = screen.getByTestId('drop-zone');
      
      expect(() => {
        fireEvent.drop(dropZone, {
          dataTransfer: {
            files: [file],
          },
        });
      }).not.toThrow();
    });

    it('only processes first file when multiple files dropped', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      const file1 = new File(['test1'], 'test1.png', { type: 'image/png' });
      const file2 = new File(['test2'], 'test2.png', { type: 'image/png' });
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file1, file2],
        },
      });

      await waitFor(() => {
        expect(screen.getByText('test1.png')).toBeInTheDocument();
        expect(screen.queryByText('test2.png')).not.toBeInTheDocument();
        expect(mockOnChange).toHaveBeenCalledWith(file1, 'mock-blob-url');
      });
    });
  });

  describe('Accessibility', () => {
    it('provides proper heading structure', () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      expect(screen.getByText('Widget Logo')).toBeInTheDocument();
    });

    it('provides proper alt text for thumbnails', async () => {
      render(<LogoSelector onChange={mockOnChange} />);
      
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const dropZone = screen.getByTestId('drop-zone');
      
      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        const thumbnail = screen.getByTestId('thumbnail');
        expect(thumbnail).toHaveAttribute('alt', 'test.png');
      });
    });

    it('provides alt text for existing logo', () => {
      render(<LogoSelector onChange={mockOnChange} value="existing-logo-url" />);
      
      const thumbnail = screen.getByTestId('thumbnail');
      expect(thumbnail).toHaveAttribute('alt', 'Current logo');
    });
  });
}); 