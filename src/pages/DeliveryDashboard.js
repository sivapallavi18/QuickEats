import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import './DeliveryDashboard.css';

const DeliveryDashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (user?.role === 'delivery') {
      fetchMyDeliveries();
    }
  }, [user]);

  const fetchMyDeliveries = async () => {
    try {
      // This would be a delivery-specific API endpoint
      const response = await orderAPI.getMyOrders(); // Modify this for delivery
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await orderAPI.updateStatus(selectedOrder._id, newStatus);
      toast.success('Status updated successfully!');
      setShowModal(false);
      fetchMyDeliveries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: 'primary',
      picked_up: 'warning',
      on_the_way: 'info',
      delivered: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const icons = {
      assigned: '📋',
      picked_up: '📦',
      on_the_way: '🚗',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status] || '📍';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </Container>
    );
  }

  return (
    <Container className="delivery-dashboard my-4">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <span className="title-icon">🚴‍♂️</span>
          Delivery Dashboard
        </h2>
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{orders.length}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{orders.filter(o => o.orderStatus === 'delivered').length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{orders.filter(o => ['assigned', 'picked_up', 'on_the_way'].includes(o.orderStatus)).length}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
      </div>

      <Row>
        {orders.length === 0 ? (
          <Col>
            <Card className="empty-state">
              <Card.Body className="text-center py-5">
                <div className="empty-icon">📦</div>
                <h4>No deliveries assigned</h4>
                <p>You'll see your delivery orders here when they're assigned to you.</p>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          orders.map(order => (
            <Col md={6} lg={4} key={order._id} className="mb-4">
              <Card className="delivery-card">
                <Card.Body>
                  <div className="order-header">
                    <div className="order-id">#{order._id.slice(-6).toUpperCase()}</div>
                    <Badge bg={getStatusColor(order.orderStatus)} className="status-badge">
                      {getStatusIcon(order.orderStatus)} {order.orderStatus.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="restaurant-info">
                    <h6 className="restaurant-name">
                      <span className="restaurant-icon">🏪</span>
                      {order.restaurant?.name}
                    </h6>
                  </div>

                  <div className="customer-info">
                    <div className="info-row">
                      <span className="info-icon">👤</span>
                      <span>{order.customer?.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon">📞</span>
                      <span>{order.customer?.phone}</span>
                    </div>
                  </div>

                  <div className="delivery-address">
                    <div className="address-header">
                      <span className="address-icon">📍</span>
                      <strong>Delivery Address</strong>
                    </div>
                    <div className="address-text">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Items: {order.items.length}</span>
                      <span className="total-amount">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewStatus(order.orderStatus);
                        setShowModal(true);
                      }}
                      className="update-btn"
                    >
                      <span className="btn-icon">🔄</span>
                      Update Status
                    </Button>
                    
                    {order.orderStatus === 'assigned' && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus('picked_up');
                          handleStatusUpdate();
                        }}
                        className="pickup-btn"
                      >
                        <span className="btn-icon">📦</span>
                        Pick Up
                      </Button>
                    )}
                    
                    {order.orderStatus === 'picked_up' && (
                      <Button 
                        variant="warning" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus('on_the_way');
                          handleStatusUpdate();
                        }}
                        className="enroute-btn"
                      >
                        <span className="btn-icon">🚗</span>
                        En Route
                      </Button>
                    )}
                    
                    {order.orderStatus === 'on_the_way' && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus('delivered');
                          handleStatusUpdate();
                        }}
                        className="deliver-btn"
                      >
                        <span className="btn-icon">✅</span>
                        Delivered
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} className="status-modal">
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Order Status</Form.Label>
              <Form.Select 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="assigned">📋 Assigned</option>
                <option value="picked_up">📦 Picked Up</option>
                <option value="on_the_way">🚗 On The Way</option>
                <option value="delivered">✅ Delivered</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DeliveryDashboard;