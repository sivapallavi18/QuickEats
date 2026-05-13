import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [radius, setRadius] = useState(5);

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation is not supported by this browser';
      setLocationError(errorMsg);
      setLoading(false);
      console.error('❌ Geolocation not supported');
      return;
    }

    console.log('🔍 Requesting user location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        
        console.log('✅ Location obtained:', userLocation);
        console.log(`📍 Coordinates: ${userLocation.latitude}, ${userLocation.longitude}`);
        
        // Clear any cached location data to ensure fresh results
        localStorage.removeItem('cachedRestaurants');
        
        setLocation(userLocation);
        setLocationError(null);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user. Please enable location services and refresh the page.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your internet connection.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while retrieving location.';
            break;
        }
        
        console.error('❌ Geolocation error:', error.code, errorMessage);
        setLocationError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0 // Don't use cached location
      }
    );
  };

  // Fetch nearby restaurants
  const fetchNearbyRestaurants = async (lat, lng, searchTerm = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const endpoint = searchTerm ? '/restaurants/search-nearby' : '/restaurants/nearby';
      
      const params = {
        lat: lat,
        lng: lng,
        radius: radius
      };
      
      if (searchTerm) {
        params.query = searchTerm;
      }

      console.log(`🔍 Fetching restaurants from: ${baseURL}${endpoint}`, params);
      console.log(`📍 User location: Lat ${lat}, Lng ${lng}, Radius: ${radius}km`);

      const response = await axios.get(`${baseURL}${endpoint}`, { params });
      
      console.log('✅ API Response:', response.data);
      
      if (response.data.success) {
        const restaurantsData = response.data.data || [];
        console.log(`📊 Found ${restaurantsData.length} restaurants`);
        setRestaurants(restaurantsData);
        setError(null);
      } else {
        console.log('⚠️ API returned success=false:', response.data.message);
        setError(response.data.message || 'Failed to fetch restaurants');
        setRestaurants([]);
      }
    } catch (err) {
      console.error('❌ Error fetching restaurants:', err);
      
      let errorMessage = 'Failed to load restaurants';
      
      if (err.response) {
        console.error('Server error response:', err.response.data);
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        console.error('No response received:', err.request);
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else {
        console.error('Request setup error:', err.message);
        errorMessage = err.message || 'An unexpected error occurred';
      }
      
      setError(errorMessage);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (location) {
      fetchNearbyRestaurants(location.latitude, location.longitude, searchQuery);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    if (location) {
      fetchNearbyRestaurants(location.latitude, location.longitude);
    }
  };

  // Effect to get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Effect to fetch restaurants when location changes
  useEffect(() => {
    if (location) {
      fetchNearbyRestaurants(location.latitude, location.longitude);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, radius]);

  // Retry getting location
  const retryLocation = () => {
    getCurrentLocation();
  };

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h2 className="text-center mb-4">
            🍽️ Restaurants Near You
          </h2>
          
          {location && (
            <Alert variant="success" className="text-center">
              📍 Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              <small className="d-block">
                (±{Math.round(location.accuracy)}m accuracy)
              </small>
            </Alert>
          )}
        </Col>
      </Row>

      {/* Search and Filter Section */}
      {location && (
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSearch}>
                  <Row className="align-items-end">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Search Restaurants</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Search restaurants or cuisine..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Search Radius</Form.Label>
                        <Form.Select
                          value={radius}
                          onChange={(e) => setRadius(Number(e.target.value))}
                        >
                          <option value={1}>1 km</option>
                          <option value={2}>2 km</option>
                          <option value={5}>5 km</option>
                          <option value={10}>10 km</option>
                          <option value={15}>15 km</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <div className="d-flex gap-2">
                        <Button type="submit" variant="primary" disabled={loading}>
                          🔍 Search
                        </Button>
                        {searchQuery && (
                          <Button type="button" variant="outline-secondary" onClick={clearSearch}>
                            Clear
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Loading State */}
      {loading && (
        <Row>
          <Col>
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">
                {!location ? 'Getting your location...' : 'Finding nearby restaurants...'}
              </p>
            </div>
          </Col>
        </Row>
      )}

      {/* Location Error */}
      {locationError && (
        <Row>
          <Col>
            <Alert variant="warning" className="text-center">
              <Alert.Heading>📍 Location Access Required</Alert.Heading>
              <p>{locationError}</p>
              <Button variant="warning" onClick={retryLocation}>
                🔄 Try Again
              </Button>
              <hr />
              <small>
                💡 Tip: Make sure location services are enabled in your browser settings
              </small>
            </Alert>
          </Col>
        </Row>
      )}

      {/* API Error */}
      {error && !locationError && (
        <Row>
          <Col>
            <Alert variant="danger" className="text-center">
              <Alert.Heading>⚠️ Unable to Load Restaurants</Alert.Heading>
              <p>{error}</p>
              <Button 
                variant="danger" 
                onClick={() => location && fetchNearbyRestaurants(location.latitude, location.longitude, searchQuery)}
              >
                🔄 Retry
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

      {/* No Restaurants Found */}
      {!loading && !error && !locationError && restaurants.length === 0 && location && (
        <Row>
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <div style={{fontSize: '4rem'}}>🏪</div>
                <Card.Title>No Restaurants Found</Card.Title>
                <Card.Text>
                  {searchQuery 
                    ? `No restaurants matching "${searchQuery}" found within ${radius}km of your location.`
                    : `No restaurants found within ${radius}km of your location.`
                  }
                </Card.Text>
                <Card.Text>
                  <strong>Try:</strong>
                  <ul className="list-unstyled mt-2">
                    <li>• Increasing the search radius</li>
                    <li>• Clearing your search filters</li>
                    <li>• Checking your location accuracy</li>
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Restaurant Cards */}
      {!loading && !error && !locationError && restaurants.length > 0 && (
        <>
          <Row className="mb-3">
            <Col>
              <h4>
                {searchQuery 
                  ? `Found ${restaurants.length} restaurants for "${searchQuery}"`
                  : `${restaurants.length} restaurants within ${radius}km`
                }
              </h4>
            </Col>
          </Row>
          
          <Row>
            {restaurants.map((restaurant) => (
              <Col md={6} lg={4} key={restaurant._id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <div style={{position: 'relative'}}>
                    <Card.Img 
                      variant="top" 
                      src={restaurant.image}
                      style={{height: '200px', objectFit: 'cover'}}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Restaurant';
                      }}
                    />
                    <span 
                      className="badge bg-dark position-absolute" 
                      style={{top: '10px', right: '10px'}}
                    >
                      📍 {restaurant.distanceText}
                    </span>
                  </div>
                  
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{restaurant.name}</Card.Title>
                    
                    <div className="mb-2">
                      {restaurant.cuisine.map((c, index) => (
                        <span key={index} className="badge bg-light text-dark me-1 mb-1">
                          {c}
                        </span>
                      ))}
                    </div>
                    
                    <div className="d-flex justify-content-between mb-2">
                      <span>⭐ {restaurant.rating.toFixed(1)}</span>
                      <span className="text-success">🕐 {restaurant.deliveryTime}</span>
                    </div>
                    
                    <Card.Text className="text-muted small">
                      📍 {restaurant.address.street}, {restaurant.address.city}
                    </Card.Text>
                    
                    <div className="d-flex justify-content-between mb-3 small text-muted">
                      <span>Min: ₹{restaurant.minimumOrder}</span>
                      <span>Delivery: ₹{restaurant.deliveryFee}</span>
                    </div>
                    
                    <div className="mt-auto d-flex gap-2">
                      <Button variant="success" size="sm" className="flex-fill">
                        🛒 Order Now
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        ℹ️
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default RestaurantList;