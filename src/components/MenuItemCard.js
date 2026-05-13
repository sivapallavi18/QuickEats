import React, { useContext, useState } from 'react';
import { Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const MenuItemCard = ({ item, restaurant }) => {
  const { addToCart } = useContext(CartContext);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState([]);

  const handleQuickAdd = () => {
    const itemToAdd = { ...item, quantity: 1, customizations: [] };
    const success = addToCart(itemToAdd, restaurant);
    if (success) {
      toast.success('Item added to cart!');
    }
  };

  const handleCustomAdd = () => {
    const itemToAdd = { ...item, quantity, customizations };
    const success = addToCart(itemToAdd, restaurant);
    if (success) {
      toast.success('Item added to cart!');
      setShowModal(false);
      setQuantity(1);
      setCustomizations([]);
    }
  };

  const handleCustomizationChange = (customizationName, option) => {
    const existing = customizations.find(c => c.name === customizationName);
    if (existing) {
      setCustomizations(customizations.map(c => 
        c.name === customizationName ? { name: customizationName, option: option.name, price: option.price } : c
      ));
    } else {
      setCustomizations([...customizations, { name: customizationName, option: option.name, price: option.price }]);
    }
  };

  const calculatePrice = () => {
    let total = item.price;
    customizations.forEach(custom => {
      total += custom.price;
    });
    return total * quantity;
  };

  return (
    <>
      <Card className="h-100 shadow-sm">
        <Card.Img 
          variant="top" 
          src={item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NvTwvdGV4dD48L3N2Zz4='} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <Card.Body className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title className="h6">{item.name}</Card.Title>
            {item.isVeg ? (
              <Badge bg="success">🌱</Badge>
            ) : (
              <Badge bg="danger">🍖</Badge>
            )}
          </div>
          <Card.Text className="text-muted small flex-grow-1">
            {item.description}
          </Card.Text>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold text-danger">₹{item.price}</span>
            <small className="text-muted">🕐 {item.preparationTime} min</small>
          </div>
          <div className="d-grid gap-2">
            <Button variant="danger" size="sm" onClick={handleQuickAdd}>
              Add to Cart
            </Button>
            {item.customizations?.length > 0 && (
              <Button variant="outline-danger" size="sm" onClick={() => setShowModal(true)}>
                Customize
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img 
            src={item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDBFMEQwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NvTwvdGV4dD48L3N2Zz4='} 
            alt={item.name}
            className="w-100 mb-3"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
          <p>{item.description}</p>
          
          {item.customizations?.map((custom, index) => (
            <div key={index} className="mb-3">
              <h6>{custom.name}</h6>
              {custom.options.map((option, optIndex) => (
                <Form.Check
                  key={optIndex}
                  type="radio"
                  name={custom.name}
                  label={`${option.name} (+₹${option.price})`}
                  onChange={() => handleCustomizationChange(custom.name, option)}
                />
              ))}
            </div>
          ))}

          <div className="d-flex align-items-center gap-3 mb-3">
            <span>Quantity:</span>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <span className="fw-bold">{quantity}</span>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>

          <div className="fw-bold">Total: ₹{calculatePrice()}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleCustomAdd}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MenuItemCard;