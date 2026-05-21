import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders with default placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search events...');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Custom placeholder" />);
    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  it('calls onSearch with input value when user types', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search events...');
    
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('displays the search query in the input field', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search events...');
    
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(input).toHaveValue('test query');
  });

  it('does not show clear button when input is empty', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('shows clear button when input has value', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search events...');
    
    fireEvent.change(input, { target: { value: 'test query' } });
    
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears input and calls onSearch with empty string when clear button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search events...');
    
    fireEvent.change(input, { target: { value: 'test query' } });
    const clearButton = screen.getByLabelText('Clear search');
    
    fireEvent.click(clearButton);
    
    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('calls onSearch with empty string when input is cleared', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Search events...');
    
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.change(input, { target: { value: '' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('renders search icon', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const searchIcon = document.querySelector('.search-bar__icon');
    expect(searchIcon).toBeInTheDocument();
  });
});
