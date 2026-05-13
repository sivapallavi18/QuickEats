import React, { useContext, useState, useEffect } from 'react';
import { Offcanvas, Button, ListGroup, Badge, ProgressBar, Tabs, Tab, Card } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ show, onHide }) => {
  const { cartItems, restaurant, updateQuantity, removeFromCart, getCartTotal, clearCart, getItemCount, addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [animateItems, setAnimateItems] = useState(false);
  const [deliveryProgress, setDeliveryProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('cart');
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (show) {
      setAnimateItems(true);
      const progress = Math.min((getCartTotal() / 500) * 100, 100);
      setDeliveryProgress(progress);
      
      if (restaurant?.menu) {
        setMenuItems(restaurant.menu);
      } else {
        setMenuItems([
          {
            _id: 'sample1',
            name: 'Margherita Pizza',
            price: 299,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NlTwvdGV4dD48L3N2Zz4=',
            description: 'Fresh tomatoes, mozzarella, basil',
            isVeg: true,
            preparationTime: 15
          },
          {
            _id: 'sample2',
            name: 'Chicken Burger',
            price: 249,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDBFMEQwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+UlDwvdGV4dD48L3N2Zz4=',
            description: 'Grilled chicken, lettuce, tomato',
            isVeg: false,
            preparationTime: 12
          },
          {
            _id: 'sample3',
            name: 'Caesar Salad',
            price: 199,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTFDRjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+llzwvdGV4dD48L3N2Zz4=',
            description: 'Fresh greens, parmesan, croutons',
            isVeg: true,
            preparationTime: 8
          },
          {
            _id: 'sample4',
            name: 'Pasta Alfredo',
            price: 279,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZENzAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NnTwvdGV4dD48L3N2Zz4=',
            description: 'Creamy alfredo sauce with herbs',
            isVeg: true,
            preparationTime: 18
          },
          {
            _id: 'sample5',
            name: 'Grilled Chicken',
            price: 349,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY4QzQyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NlzwvdGV4dD48L3N2Zz4=',
            description: 'Tender grilled chicken breast',
            isVeg: false,
            preparationTime: 20
          },
          {
            _id: 'sample6',
            name: 'Fish Curry',
            price: 329,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjM1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+QnzwvdGV4dD48L3N2Zz4=',
            description: 'Spicy fish curry with coconut',
            isVeg: false,
            preparationTime: 25
          }
        ]);
      }
    }
  }, [show, getCartTotal, restaurant]);

  const handleQuickAdd = (item) => {
    const itemToAdd = { ...item, quantity: 1, customizations: [] };
    addToCart(itemToAdd, restaurant);
  };

  const handleCheckout = () => {
    onHide();
    navigate('/checkout');
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" className="cart-offcanvas">
      <Offcanvas.Header closeButton className="cart-header">
        <Offcanvas.Title className="cart-title">
          <span className="cart-icon">🛒</span>
          <span className="title-text">Your Cart</span>
          {getItemCount() > 0 && (
            <Badge bg="danger" className="ms-2 pulse-animation cart-badge">
              <span className="badge-count">{getItemCount()}</span>
              <span className="badge-sparkle">✨</span>
            </Badge>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="cart-tabs mb-3"
        >
          <Tab eventKey="cart" title={`🛒 Cart (${getItemCount()})`}>
            {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-animation">
              <div className="empty-cart-icon">🍽️</div>
              <div className="empty-cart-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
            <h5 className="empty-title">Your cart is empty</h5>
            <p className="empty-subtitle">Add delicious items to get started!</p>
            <div className="floating-food">
              <span className="food-item">🍕</span>
              <span className="food-item">🍔</span>
              <span className="food-item">🍜</span>
              <span className="food-item">🍰</span>
              <span className="food-item">🥗</span>
            </div>
            <div className="empty-cta">
              <Button className="browse-btn" onClick={onHide}>
                <span className="btn-icon">🔍</span>
                Browse Menu
              </Button>
            </div>
          </div>
        ) : (
          <>
            {restaurant && (
              <div className="restaurant-info">
                <div className="restaurant-badge">
                  <div className="restaurant-avatar">
                    <span className="restaurant-icon">🏪</span>
                    <div className="avatar-glow"></div>
                  </div>
                  <div className="restaurant-details">
                    <h6 className="restaurant-name">{restaurant.name}</h6>
                    <div className="delivery-info">
                      <span className="delivery-time">
                        <span className="time-icon">⏱️</span>
                        {restaurant.deliveryTime}
                      </span>
                      <span className="delivery-status">
                        <span className="status-dot"></span>
                        Open Now
                      </span>
                    </div>
                  </div>
                  <div className="restaurant-rating">
                    <span className="rating-stars">⭐</span>
                    <span className="rating-value">4.5</span>
                  </div>
                </div>
                <div className="delivery-progress">
                  <div className="progress-label">
                    <span>🚚 Free delivery at ₹500</span>
                    <span>₹{Math.max(0, 500 - getCartTotal())} to go</span>
                  </div>
                  <ProgressBar 
                    now={deliveryProgress} 
                    className="custom-progress"
                    variant="success"
                  />
                </div>
              </div>
            )}
            
            <ListGroup variant="flush">
              {cartItems.map((item, index) => (
                <ListGroup.Item 
                  key={index} 
                  className={`cart-item ${animateItems ? 'animate-in' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="cart-item-content">
                    <div className="item-image">
                      <div className="food-emoji">{item.isVeg ? '🌱' : '🍖'}</div>
                      <div className="item-glow"></div>
                    </div>
                    
                    <div className="item-details">
                      <div className="item-header">
                        <h6 className="item-name">{item.name}</h6>
                        <div className="item-badges">
                          {item.isVeg && <span className="veg-badge">VEG</span>}
                          {item.spiceLevel && <span className="spice-badge">🌶️ {item.spiceLevel}</span>}
                        </div>
                      </div>
                      
                      <div className="quantity-section">
                        <div className="quantity-controls">
                          <Button 
                            className="quantity-btn minus-btn"
                            onClick={() => updateQuantity(item._id, item.customizations, item.quantity - 1)}
                          >
                            <span className="btn-symbol">−</span>
                          </Button>
                          <div className="quantity-display">
                            <span className="quantity-number">{item.quantity}</span>
                            <span className="quantity-label">qty</span>
                          </div>
                          <Button 
                            className="quantity-btn plus-btn"
                            onClick={() => updateQuantity(item._id, item.customizations, item.quantity + 1)}
                          >
                            <span className="btn-symbol">+</span>
                          </Button>
                        </div>
                      </div>
                      
                      {item.customizations?.length > 0 && (
                        <div className="customizations">
                          <div className="custom-label">Customizations:</div>
                          {item.customizations.map((custom, i) => (
                            <Badge key={i} className="custom-badge">
                              <span className="custom-icon">✨</span>
                              {custom.option}
                              <span className="custom-price">+₹{custom.price}</span>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="item-actions">
                      <div className="price-section">
                        <div className="item-price">₹{(item.price + (item.customizations?.reduce((sum, c) => sum + c.price, 0) || 0)) * item.quantity}</div>
                        <div className="unit-price">₹{item.price + (item.customizations?.reduce((sum, c) => sum + c.price, 0) || 0)} each</div>
                      </div>
                      <Button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item._id, item.customizations)}
                      >
                        <span className="remove-icon">🗑️</span>
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>

            <div className="cart-summary">
              <div className="summary-header">
                <span className="summary-icon">📊</span>
                <span className="summary-title">Order Summary</span>
              </div>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span className="row-label">
                    <span className="row-icon">🍽️</span>
                    Subtotal ({getItemCount()} items)
                  </span>
                  <span className="row-value">₹{getCartTotal()}</span>
                </div>
                
                <div className="summary-row">
                  <span className="row-label">
                    <span className="row-icon">🚚</span>
                    Delivery Fee
                    {getCartTotal() >= 500 && <span className="free-badge">FREE</span>}
                  </span>
                  <span className={`row-value ${getCartTotal() >= 500 ? 'strikethrough' : ''}`}>
                    ₹{restaurant?.deliveryFee || 40}
                  </span>
                </div>
                
                <div className="summary-row discount-row">
                  <span className="row-label">
                    <span className="row-icon">🎉</span>
                    Platform Fee
                  </span>
                  <span className="row-value">₹5</span>
                </div>
              </div>
              
              <div className="summary-total">
                <span className="total-label">
                  <span className="total-icon">💰</span>
                  Grand Total
                </span>
                <span className="total-value">
                  ₹{getCartTotal() + (getCartTotal() >= 500 ? 0 : (restaurant?.deliveryFee || 40)) + 5}
                </span>
              </div>
              
              <div className="savings-info">
                {getCartTotal() >= 500 && (
                  <div className="savings-badge">
                    <span className="savings-icon">🎉</span>
                    You saved ₹{restaurant?.deliveryFee || 40} on delivery!
                  </div>
                )}
              </div>
            </div>

            <div className="cart-actions">
              <Button className="checkout-btn" onClick={handleCheckout}>
                <span className="btn-icon">🚀</span>
                <span className="btn-text">Proceed to Checkout</span>
                <span className="btn-arrow">→</span>
              </Button>
              
              <div className="secondary-actions">
                <Button className="clear-btn" onClick={clearCart}>
                  <span className="btn-icon">🗑️</span>
                  Clear Cart
                </Button>
                
                <Button className="continue-btn" onClick={onHide}>
                  <span className="btn-icon">🍽️</span>
                  Add More Items
                </Button>
              </div>
              
              <div className="payment-methods">
                <div className="payment-label">We accept:</div>
                <div className="payment-icons">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">📱</span>
                  <span className="payment-icon">💰</span>
                </div>
              </div>
            </div>
            </>
            )}
          </Tab>
          
          <Tab eventKey="menu" title="🍽️ Menu">
            <div className="menu-section">
              <div className="menu-header">
                <h5 className="menu-title">
                  <span className="menu-icon">🍽️</span>
                  {restaurant?.name || 'Restaurant'} Menu
                </h5>
                <p className="menu-subtitle">Add more items to your order</p>
              </div>
              
              <div className="menu-items">
                {menuItems.map((item) => (
                  <Card key={item._id} className="menu-item-card mb-3">
                    <div className="menu-item-content">
                      <div className="menu-item-image">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="item-img"
                          onError={(e) => {
                            const fallbackSvg = `data:image/svg+xml;base64,${btoa(`<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${item.isVeg ? '#51CF66' : '#FF6B6B'}"/><text x="50%" y="50%" font-size="40" fill="white" text-anchor="middle" dy=".3em">${item.isVeg ? '🌱' : '🍖'}</text></svg>`)}`;
                            e.target.src = fallbackSvg;
                          }}
                        />
                        <div className="item-type-badge">
                          {item.isVeg ? '🌱' : '🍖'}
                        </div>
                      </div>
                      
                      <div className="menu-item-details">
                        <div className="item-info">
                          <h6 className="menu-item-name">{item.name}</h6>
                          <p className="menu-item-desc">{item.description}</p>
                          <div className="item-meta">
                            <span className="item-price">₹{item.price}</span>
                            <span className="prep-time">⏱️ {item.preparationTime}min</span>
                          </div>
                        </div>
                        
                        <div className="menu-item-actions">
                          <Button 
                            className="add-to-cart-btn"
                            onClick={() => handleQuickAdd(item)}
                          >
                            <span className="add-icon">+</span>
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Tab>
        </Tabs>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Cart;