import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurant = localStorage.getItem('cartRestaurant');
    
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedRestaurant) setRestaurant(JSON.parse(savedRestaurant));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    if (restaurant) {
      localStorage.setItem('cartRestaurant', JSON.stringify(restaurant));
    }
  }, [cartItems, restaurant]);

  const addToCart = (item, restaurantData) => {
    // Check if adding from different restaurant
    if (restaurant && restaurant._id !== restaurantData._id) {
      if (!window.confirm('Items from another restaurant will be removed. Continue?')) {
        return false;
      }
      setCartItems([]);
    }

    setRestaurant(restaurantData);

    const existingItem = cartItems.find(
      cartItem => cartItem._id === item._id &&
      JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
    );

    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem._id === item._id &&
        JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, item]);
    }
    return true;
  };

  const removeFromCart = (itemId, customizations) => {
    setCartItems(cartItems.filter(item => 
      !(item._id === itemId && 
        JSON.stringify(item.customizations) === JSON.stringify(customizations))
    ));

    if (cartItems.length === 1) {
      setRestaurant(null);
    }
  };

  const updateQuantity = (itemId, customizations, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId, customizations);
      return;
    }

    setCartItems(cartItems.map(item =>
      item._id === itemId &&
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartRestaurant');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      if (item.customizations) {
        item.customizations.forEach(custom => {
          itemTotal += custom.price * item.quantity;
        });
      }
      return total + itemTotal;
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      restaurant,
      cartRestaurant: restaurant,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getTotalPrice: getCartTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};