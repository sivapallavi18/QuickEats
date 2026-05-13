import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Cart from './Cart';
import SearchBar from './SearchBar';


const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getItemCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="danger" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
          🍔 QuickEats
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <div className="d-none d-lg-block" style={{ width: '300px' }}>
              <SearchBar placeholder="Search food, restaurants..." />
            </div>
          </Nav>
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/restaurants" className="text-white">
              Restaurants
            </Nav.Link>
            
            {user ? (
              <>
                <Nav.Link as={Link} to="/orders" className="text-white">
                  My Orders
                </Nav.Link>
                
                {(user.role === 'restaurant' || user.role === 'admin') && (
                  <Nav.Link as={Link} to="/dashboard" className="text-white">
                    Dashboard
                  </Nav.Link>
                )}
                
                {user.role === 'delivery' && (
                  <Nav.Link as={Link} to="/delivery-dashboard" className="text-white">
                    🚴♂️ Delivery Dashboard
                  </Nav.Link>
                )}
                
                <Nav.Link 
                  onClick={() => setShowCart(true)} 
                  className="text-white position-relative" 
                  style={{ cursor: 'pointer' }}
                >
                  🛒 Cart
                  {getItemCount() > 0 && (
                    <Badge bg="warning" text="dark" className="position-absolute top-0 start-100 translate-middle">
                      {getItemCount()}
                    </Badge>
                  )}
                </Nav.Link>
                
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                    👤 {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <button className="btn btn-warning">Sign Up</button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Cart show={showCart} onHide={() => setShowCart(false)} />
    </Navbar>
  );
};

export default NavigationBar;