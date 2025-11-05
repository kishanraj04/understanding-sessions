import { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = async (course) => {
    // console.log(course);
    const resp = await axiosInstance.post("/cart",{courseId:course?._id})
    console.log(resp);


    setCart((prevCart) => {
      const existingCourse = prevCart.find((item) => item.name === course.name);

      if (existingCourse) {
        return prevCart.map((item) =>
          item.name === course.name
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...prevCart, { ...course, quantity: 1 }];
    });
  };

  const removeFromCart = (course) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== course.name));
  };

  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
