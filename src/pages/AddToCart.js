import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const AddToCart = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { item, restaurant } = location.state || {};
  
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState([]);

  useEffect(() => {
    if (!item || !restaurant) {
      navigate(-1);
    }
  }, [item, restaurant, navigate]);

  const handleCustomizationChange = (customizationName, option) => {
    const existing = customizations.find(c => c.name === customizationName);
    if (existing) {
      setCustomizations(customizations.map(c => 
        c.name === customizationName ? { name: customizationName, option: option.name, price: option.price } : c
      ));
    } else {
      setCustomizations([...customizations, { name: customizationName, option: option.name, price: option.price }]);
    }
  };

  const calculateItemPrice = () => {
    let total = item?.price || 0;
    customizations.forEach(custom => {
      total += custom.price;
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    const itemToAdd = {
      ...item,
      quantity,
      customizations
    };

    const success = addToCart(itemToAdd, restaurant);
    if (success) {
      toast.success('Item added to cart!');
      navigate(-1);
    }
  };

  if (!item || !restaurant) {
    return null;
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">Add to Cart</h4>
            </Card.Header>
            <Card.Body>
              {/* Item Details */}
              <Row className="mb-4">
                <Col md={4}>
                  <img 
                    src={item.image || 'https://via.placeholder.com/300'} 
                    alt={item.name}
                    className="w-100 rounded"
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                </Col>
                <Col md={8}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h3>{item.name}</h3>
                    {item.isVeg ? (
                      <Badge bg="success">🌱 Veg</Badge>
                    ) : (
                      <Badge bg="danger">🍖 Non-Veg</Badge>
                    )}
                  </div>
                  <p className="text-muted">{item.description}</p>
                  <div className="mb-3">
                    <h5 className="text-danger">₹{item.price}</h5>
                    <small className="text-muted">🕐 {item.preparationTime} min</small>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted">From: {restaurant.name}</small>
                  </div>
                </Col>
              </Row>

              {/* Customizations */}
              {item.customizations && item.customizations.length > 0 && (
                <div className="mb-4">
                  <h5>Customizations</h5>
                  {item.customizations.map((custom, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <h6>{custom.name}</h6>
                        {custom.options.map((option, optIndex) => (
                          <Form.Check
                            key={optIndex}
                            type="radio"
                            name={custom.name}
                            label={`${option.name} (+₹${option.price})`}
                            onChange={() => handleCustomizationChange(custom.name, option)}
                            className="mb-2"
                          />
                        ))}
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}

              {/* Quantity Selection */}
              <div className="mb-4">
                <h5>Quantity</h5>
                <div className="d-flex align-items-center gap-3">
                  <Button 
                    variant="outline-danger" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="fw-bold fs-4">{quantity}</span>
                  <Button 
                    variant="outline-danger" 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Selected Customizations */}
              {customizations.length > 0 && (
                <div className="mb-4">
                  <h6>Selected Options:</h6>
                  {customizations.map((custom, index) => (
                    <Badge key={index} bg="secondary" className="me-2 mb-2">
                      {custom.option} (+₹{custom.price})
                    </Badge>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <Card className="bg-light mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <span>Item Total:</span>
                    <span className="fw-bold text-danger fs-5">₹{calculateItemPrice()}</span>
                  </div>
                </Card.Body>
              </Card>

              {/* Action Buttons */}
              <div className="d-flex gap-3">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate(-1)}
                  className="flex-fill"
                >
                  Back to Menu
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => {
                    handleAddToCart();
                    navigate('/delivery');
                  }}
                  className="flex-fill"
                >
                  Proceed to Delivery - ₹{calculateItemPrice()}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddToCart;