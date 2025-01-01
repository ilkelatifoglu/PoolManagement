import React, { useEffect, useState } from "react";
import { getCartItems, removeCartItem } from "../../services/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCartItems = async () => {
    try {
      const response = await getCartItems();
      setCartItems(response.data);
    } catch (err) {
      console.error("Error fetching cart items:", err);
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await removeCartItem(cartId);
      alert("Item removed from cart!");
      fetchCartItems();
    } catch (err) {
      console.error("Error removing cart item:", err);
      alert("Failed to remove item.");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div>
      <h3>Your Cart</h3>
      <ul>
        {cartItems.map((item) => (
          <li key={item.cart_id}>
            <p>Type: {item.activity_type}</p>
            <p>Activity ID: {item.activity_id}</p>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => handleRemoveItem(item.cart_id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
