import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const CartContext = createContext();

// Create a custom hook for easy usage
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Try to load cart from localStorage so it persists across refreshes
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('nimasa_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('nimasa_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Increase quantity
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Derived state
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      totalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
};
