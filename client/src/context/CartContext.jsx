import {
  createContext,
  useState,
  useEffect
} from "react";

export const CartContext = createContext();

const getCartKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id ? `cart_${user.id}` : "cart_guest";
  } catch {
    return "cart_guest";
  }
};

const loadCart = () => {
  try {
    const saved = localStorage.getItem(getCartKey());
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(loadCart);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      getCartKey(),
      JSON.stringify(cart)
    );
  }, [cart]);

  // Reload cart when user logs in/out (other tabs)
  useEffect(() => {
    const handleStorage = () => {
      setCart(loadCart());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Reload cart when user changes in same tab
  useEffect(() => {
    setCart(loadCart());
  }, [localStorage.getItem("user")]);

  // ADD TO CART
  const addToCart = (product, selectedSize) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize
      );

      let updatedCart;

      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [
          ...prevCart,
          {
            ...product,
            selectedSize,
            quantity: 1,
            buyLater: false
          }
        ];
      }

      localStorage.setItem(getCartKey(), JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // INCREASE QUANTITY
  const increaseQuantity = (id, size) => {
    setCart((prevCart) => {
      const updated = prevCart.map((item) =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem(getCartKey(), JSON.stringify(updated));
      return updated;
    });
  };

  // DECREASE QUANTITY
  const decreaseQuantity = (id, size) => {
    setCart((prevCart) => {
      const updated = prevCart
        .map((item) =>
          item.id === id && item.selectedSize === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
      localStorage.setItem(getCartKey(), JSON.stringify(updated));
      return updated;
    });
  };

  // REMOVE ITEM
  const removeItem = (id, size) => {
    setCart((prevCart) => {
      const updated = prevCart.filter(
        (item) => !(item.id === id && item.selectedSize === size)
      );
      localStorage.setItem(getCartKey(), JSON.stringify(updated));
      return updated;
    });
  };

  // BUY LATER
  const toggleBuyLater = (id, selectedSize) => {
    setCart((prevCart) => {
      const updated = prevCart.map((item) =>
        item.id === id && item.selectedSize === selectedSize
          ? { ...item, buyLater: !item.buyLater }
          : item
      );
      localStorage.setItem(getCartKey(), JSON.stringify(updated));
      return updated;
    });
  };

  // CLEAR CART (call on logout)
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(getCartKey());
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        toggleBuyLater,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );

};

export default CartProvider;