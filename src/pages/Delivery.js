import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

const Delivery = () => {
  const { cartItems, cartRestaurant, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.phone) {
      toast.error('Please fill all delivery details');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        restaurant: cartRestaurant._id,
        items: cartItems.map(item => ({
          menuItem: item._id,
          quantity: item.quantity,
          customizations: item.customizations || [],
          price: item.price
        })),
        deliveryAddress,
        paymentMethod,
        totalAmount: getTotalPrice() + (cartRestaurant?.deliveryFee || 0)
      };

      const response = await orderAPI.create(orderData);
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/order/${response.data.data._id}`);
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{minHeight: '100vh'}}>
        <div className="text-center">
          <h2 className="mb-4">Your cart is empty</h2>
          <Button 
            onClick={() => navigate('/restaurants')}
            variant="danger"
            size="lg"
          >
            Browse Restaurants
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-light" style={{minHeight: '100vh', padding: '2rem 0'}}>
      <Container>
        <h1 className="mb-4">Delivery Details</h1>
        
        <Row>
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="h4 mb-3">Order Summary</h2>
                <div>
                  {cartItems.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                      <div>
                        <h3 className="h6 mb-1">{item.name}</h3>
                        <p className="small text-muted mb-0">Qty: {item.quantity}</p>
                      </div>
                      <span className="fw-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Delivery Fee:</span>
                      <span>₹{cartRestaurant?.deliveryFee || 0}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Total:</span>
                      <span>₹{getTotalPrice() + (cartRestaurant?.deliveryFee || 0)}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="h4 mb-3">Delivery Address</h2>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      name="street"
                      placeholder="Street Address"
                      value={deliveryAddress.street}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="city"
                          placeholder="City"
                          value={deliveryAddress.city}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="state"
                          placeholder="State"
                          value={deliveryAddress.state}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="zipCode"
                          placeholder="ZIP Code"
                          value={deliveryAddress.zipCode}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={deliveryAddress.phone}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>

                <h3 className="h5 mt-4 mb-3">Payment Method</h3>
                <Form>
                  <Form.Check
                    type="radio"
                    name="payment"
                    value="cod"
                    label="Cash on Delivery"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    name="payment"
                    value="online"
                    label="Online Payment"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mb-3"
                  />
                </Form>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  variant="danger"
                  size="lg"
                  className="w-100"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Delivery;