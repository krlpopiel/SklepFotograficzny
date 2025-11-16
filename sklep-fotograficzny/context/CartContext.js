"use client";

import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const itemsFromStorage = localStorage.getItem('cartItems');
    if (itemsFromStorage) {
      setCartItems(JSON.parse(itemsFromStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);


  const addToCart = (product) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item._id === product._id);
      if (itemExists) {
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item._id === productId);
      if (itemExists && itemExists.quantity > 1) {
        return prevItems.map(item =>
          item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevItems.filter(item => item._id !== productId);
      }
    });
  };
  
  const updateItemQuantity = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    
    if (isNaN(quantity) || quantity < 1) {
      setCartItems(prevItems => prevItems.map(item =>
        item._id === productId ? { ...item, quantity: 1 } : item
      ));
      return;
    }
    
    setCartItems(prevItems => prevItems.map(item =>
      item._id === productId ? { ...item, quantity: quantity } : item
    ));
  };
  
  const removeItemCompletely = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.cena);
      const quantity = parseInt(item.quantity, 10);
      
      if (isNaN(price) || isNaN(quantity)) {
        return total;
      }
      
      return total + price * quantity;
    }, 0).toFixed(2);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        getCartTotal,
        updateItemQuantity,    
        removeItemCompletely 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};