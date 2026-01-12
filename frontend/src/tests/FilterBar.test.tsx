import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBar from '../components/FilterBar';

describe('FilterBar - Score Filtering Component', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render filter bar with input fields', () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      expect(screen.getByLabelText('Minimum candidate score filter')).toBeInTheDocument();
      expect(screen.getByLabelText('Maximum candidate score filter')).toBeInTheDocument();
    });

    it('should render Apply Filters and Clear Filters buttons', () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      expect(screen.getByLabelText('Apply score filters')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear all filters')).toBeInTheDocument();
    });

    it('should have correct labels for inputs', () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const labels = screen.getAllByText(/Min Score|Max Score/);
      expect(labels.length).toBe(2);
    });
  });

  describe('Input Handling', () => {
    it('should update min score input on change', async () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const minInput = screen.getByLabelText('Minimum candidate score filter') as HTMLInputElement;
      await userEvent.type(minInput, '2.5');

      expect(minInput.value).toBe('2.5');
    });

    it('should update max score input on change', async () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const maxInput = screen.getByLabelText('Maximum candidate score filter') as HTMLInputElement;
      await userEvent.type(maxInput, '4.5');

      expect(maxInput.value).toBe('4.5');
    });

    it('should accept decimal values', async () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const minInput = screen.getByLabelText('Minimum candidate score filter') as HTMLInputElement;
      await userEvent.type(minInput, '3.7');

      expect(minInput.value).toBe('3.7');
    });
  });

  describe('Filter Application', () => {
    it('should call onFilterChange with correct values on Apply button click', async () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const minInput = screen.getByLabelText('Minimum candidate score filter');
      const maxInput = screen.getByLabelText('Maximum candidate score filter');
      const applyButton = screen.getByLabelText('Apply score filters');

      await userEvent.type(minInput, '2.5');
      await userEvent.type(maxInput, '4.5');
      fireEvent.click(applyButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith(2.5, 4.5);
    });

    it('should apply filters on Enter key press', async () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const minInput = screen.getByLabelText('Minimum candidate score filter');
      await userEvent.type(minInput, '3.0{Enter}');

      expect(mockOnFilterChange).toHaveBeenCalledWith(3.0, undefined);
    });

    it('should handle min score only filter', async () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const minInput = screen.getByLabelText('Minimum candidate score filter');
      const applyButton = screen.getByLabelText('Apply score filters');

      await userEvent.type(minInput, '3.0');
      fireEvent.click(applyButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith(3.0, undefined);
    });

    it('should handle max score only filter', async () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const maxInput = screen.getByLabelText('Maximum candidate score filter');
      const applyButton = screen.getByLabelText('Apply score filters');

      await userEvent.type(maxInput, '4.0');
      fireEvent.click(applyButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith(undefined, 4.0);
    });
  });

  describe('Filter Clearing', () => {
    it('should clear filters on Clear button click', async () => {
      render(
        <FilterBar
          minScore={2.5}
          maxScore={4.5}
          onFilterChange={mockOnFilterChange}
          isActive={true}
        />
      );

      const clearButton = screen.getByLabelText('Clear all filters');
      fireEvent.click(clearButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should disable Clear button when no filters are active', () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const clearButton = screen.getByLabelText('Clear all filters');
      expect(clearButton).toBeDisabled();
    });

    it('should enable Clear button when filters are active', () => {
      render(
        <FilterBar
          minScore={2.5}
          onFilterChange={mockOnFilterChange}
          isActive={true}
        />
      );

      const clearButton = screen.getByLabelText('Clear all filters');
      expect(clearButton).not.toBeDisabled();
    });
  });

  describe('Validation', () => {
    it('should show error for min score out of range', async () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const minInput = screen.getByLabelText('Minimum candidate score filter') as HTMLInputElement;
      const applyButton = screen.getByLabelText('Apply score filters');

      await userEvent.clear(minInput);
      await userEvent.type(minInput, '6');
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.getByText('Minimum score must be between 0 and 5')).toBeInTheDocument();
      });
      expect(mockOnFilterChange).not.toHaveBeenCalled();
    });

    it('should show error for max score out of range', async () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const maxInput = screen.getByLabelText('Maximum candidate score filter') as HTMLInputElement;
      const applyButton = screen.getByLabelText('Apply score filters');

      await userEvent.clear(maxInput);
      await userEvent.type(maxInput, '-1');
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.getByText('Maximum score must be between 0 and 5')).toBeInTheDocument();
      });
      expect(mockOnFilterChange).not.toHaveBeenCalled();
    });

    it('should show error when min is greater than max', async () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const minInput = screen.getByLabelText('Minimum candidate score filter') as HTMLInputElement;
      const maxInput = screen.getByLabelText('Maximum candidate score filter') as HTMLInputElement;
      const applyButton = screen.getByLabelText('Apply score filters');

      await userEvent.clear(minInput);
      await userEvent.type(minInput, '4.5');
      await userEvent.clear(maxInput);
      await userEvent.type(maxInput, '2.5');
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.getByText('Minimum score cannot be greater than maximum score')).toBeInTheDocument();
      });
      expect(mockOnFilterChange).not.toHaveBeenCalled();
    });
  });

  describe('Status Display', () => {
    it('should display filter status when filters are active', () => {
      render(
        <FilterBar
          minScore={2.5}
          maxScore={4.5}
          onFilterChange={mockOnFilterChange}
          isActive={true}
        />
      );

      expect(screen.getByText(/Showing candidates with scores/)).toBeInTheDocument();
      expect(screen.getByText(/≥ 2.5/)).toBeInTheDocument();
      expect(screen.getByText(/≤ 4.5/)).toBeInTheDocument();
    });

    it('should not display filter status when filters are inactive', () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      expect(screen.queryByText(/Showing candidates with scores/)).not.toBeInTheDocument();
    });

    it('should display min score only in status', () => {
      render(
        <FilterBar
          minScore={3.0}
          onFilterChange={mockOnFilterChange}
          isActive={true}
        />
      );

      expect(screen.getByText(/Showing candidates with scores/)).toBeInTheDocument();
      expect(screen.getByText(/≥ 3/)).toBeInTheDocument();
    });

    it('should display max score only in status', () => {
      render(
        <FilterBar
          maxScore={4.0}
          onFilterChange={mockOnFilterChange}
          isActive={true}
        />
      );

      expect(screen.getByText(/Showing candidates with scores/)).toBeInTheDocument();
      expect(screen.getByText(/≤ 4/)).toBeInTheDocument();
    });
  });

  describe('Props Update', () => {
    it('should update input values when props change', () => {
      const { rerender } = render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const minInput = screen.getByLabelText('Minimum candidate score filter') as HTMLInputElement;
      expect(minInput.value).toBe('');

      rerender(
        <FilterBar
          minScore={2.5}
          onFilterChange={mockOnFilterChange}
          isActive={true}
        />
      );

      expect(minInput.value).toBe('2.5');
    });

    it('should handle empty props correctly', () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const minInput = screen.getByLabelText('Minimum candidate score filter') as HTMLInputElement;
      const maxInput = screen.getByLabelText('Maximum candidate score filter') as HTMLInputElement;

      expect(minInput.value).toBe('');
      expect(maxInput.value).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for inputs', () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      expect(screen.getByLabelText('Minimum candidate score filter')).toBeInTheDocument();
      expect(screen.getByLabelText('Maximum candidate score filter')).toBeInTheDocument();
    });

    it('should have proper labels for buttons', () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      expect(screen.getByLabelText('Apply score filters')).toBeInTheDocument();
      expect(screen.getByLabelText('Clear all filters')).toBeInTheDocument();
    });

    it('should display error with proper role', async () => {
      render(
        <FilterBar
          onFilterChange={mockOnFilterChange}
          isActive={false}
        />
      );

      const minInput = screen.getByLabelText('Minimum candidate score filter') as HTMLInputElement;
      const applyButton = screen.getByLabelText('Apply score filters');

      // Type a number outside valid range
      await userEvent.clear(minInput);
      await userEvent.type(minInput, '10');
      fireEvent.click(applyButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Minimum score must be between 0 and 5')).toBeInTheDocument();
      });
    });

    it('should display filter status with proper formatting', () => {
      render(
        <FilterBar
          minScore={2.5}
          maxScore={4.5}
          onFilterChange={mockOnFilterChange}
          isActive={true}
        />
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
});
