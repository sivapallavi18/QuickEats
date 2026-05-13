import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './utils/testConnection';
import './utils/cleanupLocation';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';


// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantListPage from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import AddToCart from './pages/AddToCart';
import Delivery from './pages/Delivery';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking';
import Dashboard from './pages/Dashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/restaurants" element={<RestaurantListPage />} />

              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/add-to-cart" element={<AddToCart />} />
              <Route path="/delivery" element={<Delivery />} />
              
              <Route path="/checkout" element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } />
              
              <Route path="/orders" element={
                <PrivateRoute>
                  <OrderHistory />
                </PrivateRoute>
              } />
              
              <Route path="/order/:id" element={
                <PrivateRoute>
                  <OrderTracking />
                </PrivateRoute>
              } />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/delivery-dashboard" element={
                <PrivateRoute>
                  <DeliveryDashboard />
                </PrivateRoute>
              } />
            </Routes>
            <Footer />

            <ToastContainer position="bottom-right" />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;