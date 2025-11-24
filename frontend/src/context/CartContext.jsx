import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastOrderId, setLastOrderId] = useState(() => {
    return localStorage.getItem('lastOrderId') || null;
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (lastOrderId) {
      localStorage.setItem('lastOrderId', lastOrderId);
    } else {
      localStorage.removeItem('lastOrderId');
    }
  }, [lastOrderId]);
    // Reset lastOrderId if cart changes
    useEffect(() => {
      setLastOrderId(null);
    }, [JSON.stringify(cartItems)]);
  const clearCart = () => {
    setCartItems([]);
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        clearCart,
        lastOrderId,
        setLastOrderId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}