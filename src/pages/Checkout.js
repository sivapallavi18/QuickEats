import React, { useContext, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, restaurant, getCartTotal, clearCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const deliveryFee = restaurant?.deliveryFee || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const handleAddressChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!deliveryAddress.street || !deliveryAddress.city) {
      toast.error('Please fill in delivery address');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        restaurant: restaurant._id,
        items: cartItems.map(item => ({
          menuItem: item._id,
          quantity: item.quantity,
          customizations: item.customizations || []
        })),
        deliveryAddress,
        paymentMethod,
        specialInstructions
      };

      const response = await orderAPI.create(orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h3>Your cart is empty</h3>
        <Button variant="danger" onClick={() => navigate('/restaurants')}>
          Browse Restaurants
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">Checkout</h2>
      <Row>
        <Col md={8}>
          {/* Delivery Address */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Delivery Address</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    value={deliveryAddress.street}
                    onChange={handleAddressChange}
                    placeholder="Enter street address"
                    required
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={deliveryAddress.city}
                        onChange={handleAddressChange}
                        placeholder="Enter city"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={deliveryAddress.state}
                        onChange={handleAddressChange}
                        placeholder="Enter state"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>ZIP Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="zipCode"
                    value={deliveryAddress.zipCode}
                    onChange={handleAddressChange}
                    placeholder="Enter ZIP code"
                    required
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          {/* Payment Method */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Payment Method</h5>
              <Form>
                <Form.Check
                  type="radio"
                  label="Credit/Debit Card"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="UPI"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Cash on Delivery"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </Form>
            </Card.Body>
          </Card>

          {/* Special Instructions */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Special Instructions</h5>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add any special instructions for your order..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          {/* Order Summary */}
          <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Body>
              <h5 className="mb-3">Order Summary</h5>
              <div className="mb-3">
                <strong>{restaurant?.name}</strong>
              </div>

              <ListGroup variant="flush" className="mb-3">
                {cartItems.map((item, index) => (
                  <ListGroup.Item key={index} className="px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="fw-bold">{item.name}</div>
                        {item.customizations?.map((custom, i) => (
                          <small key={i} className="text-muted d-block">
                            + {custom.option} (₹{custom.price})
                          </small>
                        ))}
                      </div>
                      <div className="text-end">
                        <div>₹{item.price * item.quantity}</div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <Button 
                            size="sm" 
                            variant="outline-danger"
                            onClick={() => updateQuantity(item._id, item.customizations, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline-danger"
                            onClick={() => updateQuantity(item._id, item.customizations, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-3">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                variant="danger" 
                className="w-100 mt-3"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;