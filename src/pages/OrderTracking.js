import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import './OrderTracking.css';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();

    // Socket.IO connection for real-time updates
    const socket = io('http://localhost:5000');
    
    socket.emit('join-order', id);
    
    socket.on('order-status-update', (data) => {
      if (data.orderId === id) {
        setOrder(prev => ({ ...prev, orderStatus: data.status }));
        toast.info(`Order status updated: ${data.status}`);
      }
    });

    return () => {
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(id);
      setOrder(response.data.data);
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getOrderProgress = () => {
    const statuses = {
      pending: 0,
      confirmed: 20,
      preparing: 40,
      ready: 60,
      picked_up: 70,
      on_the_way: 85,
      delivered: 100,
      cancelled: 0
    };
    return statuses[order?.orderStatus] || 0;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      ready: '📦',
      picked_up: '🚴',
      on_the_way: '🚗',
      delivered: '🎉',
      cancelled: '❌'
    };
    return icons[status] || '📍';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="my-5">
        <Card className="text-center py-5">
          <Card.Body>
            <h3>Order not found</h3>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-5 order-tracking">
      <div className="tracking-header">
        <h2 className="tracking-title">
          <span className="tracking-icon">📍</span>
          Track Your Order
        </h2>
        <div className="order-id-badge">
          Order #{order._id.slice(-6).toUpperCase()}
        </div>
      </div>

      <Row>
        <Col md={8}>
          {/* Order Status Timeline */}
          <Card className="status-card mb-4">
            <Card.Body>
              <div className="status-header">
                <div className="status-icon-large">{getStatusIcon(order.orderStatus)}</div>
                <h4 className="status-text">{order.orderStatus.replace('_', ' ')}</h4>
                <div className="progress-container">
                  <ProgressBar 
                    now={getOrderProgress()} 
                    className="custom-progress"
                  />
                  <span className="progress-text">{getOrderProgress()}% Complete</span>
                </div>
              </div>

              <div className="delivery-timeline">
                {['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way', 'delivered'].map((status, index) => {
                  const currentIndex = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way', 'delivered'].indexOf(order.orderStatus);
                  const isCompleted = index <= currentIndex;
                  const isActive = index === currentIndex;
                  
                  return (
                    <div 
                      key={status} 
                      className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                    >
                      <div className="step-icon">
                        {getStatusIcon(status)}
                      </div>
                      <div className="step-content">
                        <h6>{status.replace('_', ' ')}</h6>
                        {isActive && <div className="pulse-dot"></div>}
                      </div>
                      {index < 6 && <div className="step-connector"></div>}
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>

          {/* Order Items */}
          <Card className="items-card mb-4">
            <Card.Body>
              <h5 className="section-title">
                <span className="title-icon">🍽️</span>
                Order Items
              </h5>
              <div className="items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <div className="item-header">
                        <span className="quantity-badge">{item.quantity}x</span>
                        <strong className="item-name">{item.name}</strong>
                      </div>
                      {item.customizations?.map((custom, i) => (
                        <div key={i} className="customization">
                          <span className="custom-icon">✨</span>
                          {custom.option}
                        </div>
                      ))}
                    </div>
                    <div className="item-price">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Delivery Address */}
          <Card className="address-card">
            <Card.Body>
              <h5 className="section-title">
                <span className="title-icon">📍</span>
                Delivery Address
              </h5>
              <div className="address-info">
                <div className="address-line">{order.deliveryAddress.street}</div>
                <div className="address-line">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          {/* Order Summary */}
          <Card className="summary-card mb-4">
            <Card.Body>
              <h5 className="section-title">
                <span className="title-icon">📋</span>
                Order Summary
              </h5>
              
              <div className="summary-info">
                <div className="info-item">
                  <span className="info-icon">🏪</span>
                  <div>
                    <strong>Restaurant</strong>
                    <p>{order.restaurant?.name}</p>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-icon">🆔</span>
                  <div>
                    <strong>Order ID</strong>
                    <p className="order-id">{order._id}</p>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-icon">⏰</span>
                  <div>
                    <strong>Order Time</strong>
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {order.estimatedDeliveryTime && (
                  <div className="info-item">
                    <span className="info-icon">🚚</span>
                    <div>
                      <strong>Estimated Delivery</strong>
                      <p className="delivery-time">{new Date(order.estimatedDeliveryTime).toLocaleTimeString()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="price-row">
                  <span>Delivery Fee</span>
                  <span>₹{order.deliveryFee}</span>
                </div>
                <div className="price-row">
                  <span>Tax</span>
                  <span>₹{order.tax}</span>
                </div>
                <div className="total-row">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="payment-status">
                <Badge className={`payment-badge ${order.paymentStatus === 'completed' ? 'completed' : 'pending'}`}>
                  <span className="payment-icon">{order.paymentStatus === 'completed' ? '✅' : '⏳'}</span>
                  Payment: {order.paymentStatus}
                </Badge>
              </div>
            </Card.Body>
          </Card>

          {/* Delivery Person Info */}
          {order.deliveryPerson && (
            <Card className="delivery-partner-card">
              <Card.Body>
                <h5 className="section-title">
                  <span className="title-icon">🚴</span>
                  Delivery Partner
                </h5>
                <div className="partner-info">
                  <div className="partner-avatar">👤</div>
                  <div>
                    <strong className="partner-name">{order.deliveryPerson.name}</strong>
                    <p className="partner-phone">
                      <span className="phone-icon">📞</span>
                      {order.deliveryPerson.phone}
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderTracking;