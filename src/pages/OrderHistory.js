import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      ready: 'success',
      picked_up: 'success',
      on_the_way: 'success',
      delivered: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h4>No orders yet</h4>
            <p className="text-muted">Start ordering from your favorite restaurants</p>
            <Button as={Link} to="/restaurants" variant="danger">
              Browse Restaurants
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {orders.map(order => (
            <Col md={12} key={order._id} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5>{order.restaurant?.name}</h5>
                          <small className="text-muted">
                            Order ID: {order._id}
                          </small>
                        </div>
                        <Badge bg={getStatusColor(order.orderStatus)}>
                          {order.orderStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>

                      <div className="mb-2">
                        <strong>Items:</strong>
                        <ul className="list-unstyled ms-3">
                          {order.items.map((item, index) => (
                            <li key={index}>
                              {item.quantity}x {item.name}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-muted small">
                        Ordered on: {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </Col>

                    <Col md={4} className="text-end">
                      <h4 className="text-danger">₹{order.totalAmount}</h4>
                      <div className="mb-2">
                        <Badge bg={order.paymentStatus === 'completed' ? 'success' : 'warning'}>
                          Payment: {order.paymentStatus}
                        </Badge>
                      </div>
                      <Button 
                        as={Link} 
                        to={`/order/${order._id}`}
                        variant="outline-danger"
                        size="sm"
                      >
                        Track Order
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default OrderHistory;