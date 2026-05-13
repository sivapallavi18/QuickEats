import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantAPI, menuAPI } from '../services/api';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurantDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      console.log('Fetching restaurant details for ID:', id);
      
      const restaurantResponse = await restaurantAPI.getById(id);
      console.log('Restaurant response:', restaurantResponse.data);
      
      const menuResponse = await menuAPI.getByRestaurant(id);
      console.log('Menu response:', menuResponse.data);
      
      setRestaurant(restaurantResponse.data.data || restaurantResponse.data);
      setMenuItems(menuResponse.data.data || menuResponse.data || []);
      
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      toast.error('Failed to load restaurant details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };



  const handleItemClick = (item) => {
    console.log('Adding item to cart:', item.name);
    
    if (!restaurant) {
      toast.error('Restaurant information not loaded');
      return;
    }

    const itemToAdd = {
      ...item,
      quantity: 1,
      customizations: []
    };

    try {
      const success = addToCart(itemToAdd, restaurant);
      if (success) {
        toast.success(`${item.name} added to cart!`);
      } else {
        toast.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding item to cart');
    }
  };

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = categoryFilter === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === categoryFilter);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Restaurant Header */}
      <Card className="mb-4 shadow">
        <Row className="g-0">
          <Col md={4}>
            <Card.Img 
              src={restaurant?.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZENzAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+PqjwvdGV4dD48L3N2Zz4='} 
              style={{ height: '300px', objectFit: 'cover' }}
            />
          </Col>
          <Col md={8}>
            <Card.Body>
              <h2>{restaurant?.name}</h2>
              <p className="text-muted">
                📍 {restaurant?.address?.street}, {restaurant?.address?.city}
              </p>
              <p className="text-muted">{restaurant?.description}</p>
              <div className="mb-2">
                <Badge bg="secondary" className="me-2">{restaurant?.cuisine?.join(', ')}</Badge>
                {restaurant?.isOpen ? (
                  <Badge bg="success">Open Now</Badge>
                ) : (
                  <Badge bg="danger">Closed</Badge>
                )}
              </div>
              <Row className="mt-3">
                <Col md={3}>
                  <div>⭐ {restaurant?.rating?.toFixed(1)}</div>
                  <small className="text-muted">{restaurant?.totalReviews} reviews</small>
                </Col>
                <Col md={3}>
                  <div>🕐 {restaurant?.deliveryTime}</div>
                  <small className="text-muted">Delivery time</small>
                </Col>
                <Col md={3}>
                  <div>₹{restaurant?.minimumOrder}</div>
                  <small className="text-muted">Minimum order</small>
                </Col>
                <Col md={3}>
                  <div>₹{restaurant?.deliveryFee}</div>
                  <small className="text-muted">Delivery fee</small>
                </Col>
              </Row>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Category Filter */}
      <div className="mb-4">
        <div className="d-flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={categoryFilter === category ? 'danger' : 'outline-danger'}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <h3 className="mb-4">Menu ({filteredItems.length} items)</h3>
      {filteredItems.length === 0 ? (
        <div className="text-center py-5">
          <p>No menu items found for this restaurant.</p>
          <Button variant="outline-danger" onClick={() => navigate('/restaurants')}>Back to Restaurants</Button>
        </div>
      ) : (
        <Row>
        {filteredItems.map(item => (
          <Col md={6} key={item._id} className="mb-3">
            <Card className="h-100 shadow-sm hover-card">
              <Row className="g-0">
                <Col xs={4}>
                  <Card.Img 
                    src={item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTFDRjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NvTwvdGV4dD48L3N2Zz4='} 
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                </Col>
                <Col xs={8}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <Card.Title className="h6">{item.name}</Card.Title>
                      {item.isVeg ? (
                        <Badge bg="success">🌱 Veg</Badge>
                      ) : (
                        <Badge bg="danger">🍖 Non-Veg</Badge>
                      )}
                    </div>
                    <Card.Text className="small text-muted">
                      {item.description?.substring(0, 60)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-danger">₹{item.price}</span>
                      <small className="text-muted">🕐 {item.preparationTime} min</small>
                    </div>
                    <Button 
                      variant="danger"
                      size="sm"
                      className="w-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Button clicked for:', item.name);
                        handleItemClick(item);
                      }}
                    >
                      🛍 Add to Cart
                    </Button>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
        </Row>
      )}


    </Container>
  );
};

export default RestaurantDetail;