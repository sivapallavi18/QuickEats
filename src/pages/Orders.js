// ============================================
// pages/Orders.js
// ============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order._id} style={{ padding: '1rem', border: '1px solid #ddd', marginBottom: '1rem' }}>
            <h3>Order #{order.orderNumber}</h3>
            <p>Status: {order.status}</p>
            <p>Total: ₹{order.pricing.total}</p>
            <button onClick={() => navigate(`/order/${order._id}`)}>Track Order</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;