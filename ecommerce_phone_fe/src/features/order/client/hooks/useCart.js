import { useState, useEffect } from "react";

export const useCart = () => {
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || { items: [] };
    setCart(data);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increase = (index) => {
    const newCart = { ...cart };
    newCart.items[index].quantity += 1;
    updateCart(newCart);
  };

  const decrease = (index) => {
    const newCart = { ...cart };
    if (newCart.items[index].quantity > 1) {
      newCart.items[index].quantity -= 1;
      updateCart(newCart);
    }
  };

  const removeItem = (index) => {
    const newCart = { ...cart };
    newCart.items.splice(index, 1);
    updateCart(newCart);
  };

  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { cart, total, increase, decrease, removeItem };
};