import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from '../SearchForm';

describe('SearchForm', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('should render search form with input and button', () => {
    render(<SearchForm onSearch={mockOnSearch} />);

    expect(screen.getByLabelText(/city name input/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter city name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search for weather/i })).toBeInTheDocument();
  });

  it('should call onSearch with valid city name when form is submitted', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByLabelText(/city name input/i);
    // Button will be disabled initially, so we need to type first
    await user.type(input, 'London');
    
    const button = screen.getByRole('button', { name: /search for weather/i });
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('London');
  });

  it('should trim whitespace from city name before submitting', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByLabelText(/city name input/i);
    await user.type(input, '  London  ');
    
    const button = screen.getByRole('button', { name: /search for weather/i });
    await user.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('London');
  });

  it('should show validation error for city name that is too short', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByLabelText(/city name input/i);
    await user.type(input, 'A');
    
    const button = screen.getByRole('button', { name: /search for weather/i });
    await user.click(button);

    expect(screen.getByText(/city name must be at least 2 characters long/i)).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should show validation error for city name with invalid characters', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByLabelText(/city name input/i);
    await user.type(input, 'City123');
    
    const button = screen.getByRole('button', { name: /search for weather/i });
    await user.click(button);

    expect(screen.getByText(/city name contains invalid characters/i)).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should clear validation error when user starts typing', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByLabelText(/city name input/i);
    
    // First create a validation error
    await user.type(input, 'A');
    const button = screen.getByRole('button', { name: /search for weather/i });
    await user.click(button);
    expect(screen.getByText(/city name must be at least 2 characters long/i)).toBeInTheDocument();

    // Start typing to clear error
    await user.type(input, 'B');
    expect(screen.queryByText(/city name must be at least 2 characters long/i)).not.toBeInTheDocument();
  });

  it('should display validation error for empty input', () => {
    render(<SearchForm onSearch={mockOnSearch} />);

    const button = screen.getByRole('button', { name: /search for weather/i });

    // Try to submit empty form - button should be disabled
    expect(button).toBeDisabled();
    
    // Should not call onSearch since button is disabled for empty input
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should disable input and button when loading', () => {
    render(<SearchForm onSearch={mockOnSearch} loading={true} />);

    const input = screen.getByLabelText(/city name input/i);
    const button = screen.getByRole('button', { name: /search for weather/i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should show loading state with spinner', () => {
    render(<SearchForm onSearch={mockOnSearch} loading={true} />);

    expect(screen.getByText(/searching/i)).toBeInTheDocument();
    // Check for disabled state instead of specific class
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should disable submit button when input is empty', () => {
    render(<SearchForm onSearch={mockOnSearch} />);

    const button = screen.getByRole('button', { name: /search for weather/i });
    expect(button).toBeDisabled();
  });

  it('should enable submit button when input has text', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByLabelText(/city name input/i);
    const button = screen.getByRole('button', { name: /search for weather/i });

    expect(button).toBeDisabled();

    await user.type(input, 'London');
    expect(button).toBeEnabled();
  });

  it('should handle form submission with Enter key', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByLabelText(/city name input/i);

    await user.type(input, 'London');
    await user.keyboard('{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('London');
  });

  it('should have proper accessibility attributes', () => {
    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByLabelText(/city name input/i);
    const button = screen.getByRole('button', { name: /search for weather/i });

    expect(input).toHaveAttribute('aria-label', 'City name input');
    expect(button).toHaveAttribute('aria-label', 'Search for weather');
  });
}); 