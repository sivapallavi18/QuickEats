import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Tabs, Tab } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { restaurantAPI, orderAPI, menuAPI } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user.role === 'restaurant') {
        // Get all restaurants and filter by owner on frontend
        const restaurantsRes = await restaurantAPI.getAll();
        const userRestaurants = restaurantsRes.data.data.filter(r => r.owner === user.id);
        setRestaurants(userRestaurants);

        if (userRestaurants.length > 0) {
          const restaurantId = userRestaurants[0]._id;
          const ordersRes = await orderAPI.getRestaurantOrders(restaurantId);
          setOrders(ordersRes.data.data);

          const menuRes = await menuAPI.getByRestaurant(restaurantId);
          setMenuItems(menuRes.data.data);

          calculateStats(ordersRes.data.data);
        }
      } else if (user.role === 'admin') {
        const ordersRes = await orderAPI.getAll();
        setOrders(ordersRes.data.data);
        calculateStats(ordersRes.data.data);

        const restaurantsRes = await restaurantAPI.getAll();
        setRestaurants(restaurantsRes.data.data);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      // Show sample data if API fails
      setStats({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedOrders: 0 });
      setOrders([]);
      setRestaurants([]);
      setMenuItems([]);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = ordersData.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.orderStatus)).length;
    const completedOrders = ordersData.filter(o => o.orderStatus === 'delivered').length;

    setStats({
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders
    });
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
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
      <h2 className="mb-4">Dashboard</h2>

      {/* Stats Overview */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h3 className="text-danger">{stats.totalOrders}</h3>
              <p className="mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h3 className="text-success">₹{stats.totalRevenue.toFixed(2)}</h3>
              <p className="mb-0">Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h3 className="text-warning">{stats.pendingOrders}</h3>
              <p className="mb-0">Pending Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h3 className="text-primary">{stats.completedOrders}</h3>
              <p className="mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card className="shadow-sm">
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="overview" title="Overview">
              <h5 className="mb-3">Recent Orders</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map(order => (
                    <tr key={order._id}>
                      <td className="small">{order._id.substring(0, 8)}...</td>
                      <td>{order.customer?.name}</td>
                      <td>{order.items.length} items</td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <Badge bg={order.orderStatus === 'delivered' ? 'success' : 'warning'}>
                          {order.orderStatus}
                        </Badge>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                          <select
                            className="form-select form-select-sm"
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="picked_up">Picked Up</option>
                            <option value="on_the_way">On the Way</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {user.role === 'restaurant' && (
              <Tab eventKey="menu" title="Menu Items">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Menu Items</h5>
                  <Button variant="danger">Add New Item</Button>
                </div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map(item => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>₹{item.price}</td>
                        <td>
                          <Badge bg={item.isAvailable ? 'success' : 'danger'}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </td>
                        <td>
                          <Button size="sm" variant="outline-primary" className="me-2">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline-danger">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
            )}

            {user.role === 'admin' && (
              <Tab eventKey="restaurants" title="Restaurants">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>All Restaurants</h5>
                </div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Owner</th>
                      <th>Cuisine</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map(restaurant => (
                      <tr key={restaurant._id}>
                        <td>{restaurant.name}</td>
                        <td>{restaurant.owner?.name}</td>
                        <td>{restaurant.cuisine?.join(', ')}</td>
                        <td>⭐ {restaurant.rating?.toFixed(1)}</td>
                        <td>
                          <Badge bg={restaurant.isApproved ? 'success' : 'warning'}>
                            {restaurant.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </td>
                        <td>
                          <Button size="sm" variant="outline-primary">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
            )}
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;