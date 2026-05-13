import React, { useState, useEffect } from 'react';
import { Form, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import './SearchBar.css';

const SearchBar = ({ placeholder = "Search restaurants, cuisines, dishes..." }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const popularSuggestions = [
    { type: 'cuisine', text: '🍕 Pizza', value: 'pizza' },
    { type: 'cuisine', text: '🍔 Burger', value: 'burger' },
    { type: 'cuisine', text: '🍜 Chinese', value: 'chinese' },
    { type: 'cuisine', text: '🍛 Indian', value: 'indian' },
    { type: 'cuisine', text: '🍝 Italian', value: 'italian' },
    { type: 'dish', text: '🧀 Margherita', value: 'margherita' },
    { type: 'dish', text: '🍗 Butter Chicken', value: 'butter chicken' },
    { type: 'dish', text: '🥗 Salad', value: 'salad' }
  ];

  useEffect(() => {
    if (query.length > 1) {
      fetchSuggestions();
    } else {
      setSuggestions(popularSuggestions);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const searchResults = await restaurantAPI.getAll({ search: query });
      const restaurants = searchResults.data.data || searchResults.data || [];
      const menuItems = [];

      const restaurantSuggestions = restaurants.slice(0, 3).map(r => ({
        type: 'restaurant',
        text: `🏪 ${r.name}`,
        value: r.name,
        id: r._id,
        distance: r.distance ? `${r.distance}km away` : ''
      }));

      const menuSuggestions = menuItems.slice(0, 2).map(item => ({
        type: 'dish',
        text: `🍽️ ${item.name}`,
        value: item.name,
        restaurantId: item.restaurant._id,
        restaurantName: item.restaurant.name
      }));

      const filteredPopular = popularSuggestions.filter(s => 
        s.text.toLowerCase().includes(query.toLowerCase())
      );

      setSuggestions([...restaurantSuggestions, ...menuSuggestions, ...filteredPopular]);
    } catch (error) {
      setSuggestions(popularSuggestions.filter(s => 
        s.text.toLowerCase().includes(query.toLowerCase())
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchValue = query) => {
    if (searchValue.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchValue.trim())}`);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'restaurant' && suggestion.id) {
      navigate(`/restaurant/${suggestion.id}`);
    } else if (suggestion.type === 'dish' && suggestion.restaurantId) {
      navigate(`/restaurant/${suggestion.restaurantId}`);
    } else {
      handleSearch(suggestion.value);
    }
    setShowSuggestions(false);
    setQuery('');
  };

  return (
    <div className="search-container">
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className="search-input"
      />
      
      {showSuggestions && (
        <div className="suggestions-dropdown">
          {loading && (
            <div className="suggestion-item loading">
              <Spinner size="sm" /> Searching...
            </div>
          )}
          
          {!loading && suggestions.length === 0 && query && (
            <div className="suggestion-item no-results">
              No results found for "{query}"
            </div>
          )}
          
          {!loading && suggestions.length > 0 && (
            <ListGroup variant="flush">
              {suggestions.map((suggestion, index) => (
                <ListGroup.Item
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="suggestion-text">{suggestion.text}</span>
                    <div className="d-flex flex-column align-items-end">
                      <span className="suggestion-type">{suggestion.type}</span>
                      {suggestion.distance && (
                        <small className="text-muted">{suggestion.distance}</small>
                      )}
                      {suggestion.restaurantName && (
                        <small className="text-muted">at {suggestion.restaurantName}</small>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          
          {query && (
            <ListGroup.Item
              className="suggestion-item search-all"
              onClick={() => handleSearch()}
            >
              🔍 Search for "{query}"
            </ListGroup.Item>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;