import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <Row>
          <Col md={4}>
            <h5>QuickEats</h5>
            <p>Your favorite food, delivered fast!</p>
            <p>© 2025 QuickEats. All rights reserved.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/restaurants" className="text-white text-decoration-none">Restaurants</a></li>
              <li><a href="/about" className="text-white text-decoration-none">About Us</a></li>
              <li><a href="/contact" className="text-white text-decoration-none">Contact</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <p>Facebook | Instagram | Twitter</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;