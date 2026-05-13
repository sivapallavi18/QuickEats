import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import './Home.css';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll({ limit: 6 });
      setRestaurants(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };



  const cuisineCategories = [
    { name: 'Pizza', icon: '🍕', color: '#FFE5B4' },
    { name: 'Burger', icon: '🍔', color: '#FFD6D6' },
    { name: 'Sushi', icon: '🍱', color: '#D6E5FF' },
    { name: 'Dessert', icon: '🍰', color: '#FFE0F0' },
    { name: 'Indian', icon: '🍛', color: '#FFECC7' },
    { name: 'Chinese', icon: '🥡', color: '#FFD9D9' }
  ];



  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={12}>
              <h1 className="hero-title">Delicious Food, Delivered Fast</h1>
              <p className="hero-subtitle">
                Order from your favorite restaurants and get it delivered to your doorstep
              </p>

              {/* Enhanced Search */}
              <div className="hero-search">
                <SearchBar placeholder="Search restaurants, cuisines, dishes..." />
              </div>
              
              {/* Quick Suggestions */}
              <div className="quick-suggestions">
                <span className="suggestion-label">Popular:</span>
                {['Pizza', 'Burger', 'Chinese', 'Indian'].map(item => (
                  <Button
                    key={item}
                    variant="outline-light"
                    size="sm"
                    className="suggestion-btn"
                    onClick={() => navigate(`/restaurants?search=${item}`)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* What's on your mind Section */}
      <section className="cuisine-section">
        <Container>
          <h2 className="section-title">What's on your mind?</h2>
          <Row className="cuisine-grid">
            {cuisineCategories.map((cuisine, index) => (
              <Col xs={6} md={4} lg={2} key={index} className="mb-3">
                <Link 
                  to={`/restaurants?cuisine=${cuisine.name}`}
                  className="cuisine-card"
                  style={{ backgroundColor: cuisine.color }}
                >
                  <div className="cuisine-icon">{cuisine.icon}</div>
                  <div className="cuisine-name">{cuisine.name}</div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Restaurants */}
      <section className="restaurants-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">Featured Restaurants</h2>
            <Button 
              as={Link} 
              to="/restaurants" 
              variant="outline-danger"
              className="view-all-btn"
            >
              View All →
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : restaurants.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <h4>No restaurants found nearby</h4>
                <p className="text-muted">Try expanding your search radius or browse all restaurants</p>
                <Button as={Link} to="/restaurants" variant="danger">
                  Browse All Restaurants
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {restaurants.map(restaurant => (
                <Col md={4} key={restaurant._id} className="mb-4">
                  <Card className="restaurant-card">
                    <div className="restaurant-image-wrapper">
                      <Card.Img 
                        variant="top" 
                        src={restaurant.images?.[0] || 'https://via.placeholder.com/400x200?text=Restaurant'} 
                        className="restaurant-image"
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="restaurant-name">{restaurant.name}</Card.Title>

                      <Card.Text className="restaurant-cuisine">
                        {restaurant.cuisine?.join(', ')}
                      </Card.Text>
                      <div className="restaurant-info">
                        <span className="rating">
                          ⭐ {restaurant.rating?.toFixed(1) || '4.0'}
                        </span>
                        <span className="delivery-time">{restaurant.deliveryTime || '30-40 min'}</span>
                      </div>
                      <Button 
                        as={Link} 
                        to={`/restaurant/${restaurant._id}`} 
                        variant="danger" 
                        className="w-100 mt-3 order-btn"
                      >
                        View Menu
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <Container>
          <h2 className="section-title text-center mb-5">How It Works</h2>
          <Row>
            <Col md={3} className="text-center mb-4">
              <div className="work-step">
                <div className="work-icon">📍</div>
                <h4 className="work-title">Select Location</h4>
                <p className="work-description">Enter your delivery address</p>
              </div>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="work-step">
                <div className="work-icon">🗺️</div>
                <h4 className="work-title">Choose Food</h4>
                <p className="work-description">Browse menus and add items</p>
              </div>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="work-step">
                <div className="work-icon">💳</div>
                <h4 className="work-title">Pay Online</h4>
                <p className="work-description">Secure payment options</p>
              </div>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="work-step">
                <div className="work-icon">🚚</div>
                <h4 className="work-title">Fast Delivery</h4>
                <p className="work-description">Food delivered to your door</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <h2 className="section-title text-center mb-5">Why Choose QuickSeat?</h2>
          <Row className="text-center">
            <Col md={4} className="mb-4">
              <div className="stat-box">
                <div className="stat-icon">🏪</div>
                <h2 className="stat-number">500<span className="plus-sign">+</span></h2>
                <p className="stat-label">Partner Restaurants</p>
                <p className="stat-description">Wide variety of cuisines</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="stat-box">
                <div className="stat-icon">📦</div>
                <h2 className="stat-number">10,000<span className="plus-sign">+</span></h2>
                <p className="stat-label">Daily Orders</p>
                <p className="stat-description">Trusted by thousands</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="stat-box">
                <div className="stat-icon">😊</div>
                <h2 className="stat-number">50,000<span className="plus-sign">+</span></h2>
                <p className="stat-label">Happy Customers</p>
                <p className="stat-description">5-star rated service</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;