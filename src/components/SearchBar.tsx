import { useState } from 'react';
import './SearchBar.scss';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search events..." }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-bar__input-container">
        <svg className="search-bar__icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
        <input
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
        />
        {searchQuery && (
          <button
            className="search-bar__clear"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M8.414 7l3.293-3.293a1 1 0 0 0-1.414-1.414L7 5.586 3.707 2.293a1 1 0 0 0-1.414 1.414L5.586 7l-3.293 3.293a1 1 0 1 0 1.414 1.414L7 8.414l3.293 3.293a1 1 0 0 0 1.414-1.414L8.414 7z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
