import React, { useState, useEffect } from "react";
import { cartService } from "../../services/cart.service";
import Button from "../../components/common/Button/Button";
import "./shoppingpage.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShoppingPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [balance, setBalance] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userBalance = await cartService.getBalance();
        const items = await cartService.getCartItems();

        const total = items.reduce((sum, item) => sum + parseFloat(item.Price), 0);

        setBalance(userBalance);
        setTotalPrice(total);
        setRemainingBalance(userBalance - total);
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const handleDelete = async (bookingId, reservationType, price) => {
    const confirmDelete = window.confirm("Do you want to remove this reservation from your cart?");
    if (!confirmDelete) return;
  
    try {
      await cartService.deleteCartItem(bookingId, reservationType);
    
      setCartItems((prevItems) => prevItems.filter((item) => item.BookingID !== bookingId));
  
      setTotalPrice((prevTotal) => prevTotal - parseFloat(price));

      setRemainingBalance((prevBalance) => prevBalance + parseFloat(price));

    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };
  
  const handleConfirm = async () => {
    if (remainingBalance < 0) {
      toast.error("Your balance is not enough!");
      return;
    }
  
    try {
      const total_price = totalPrice; 
  
      for (const item of cartItems) {
        await cartService.confirmPurchase(item.BookingID, item.Reservation, item.Price);
      }
  
      setBalance(remainingBalance); 
  
      toast.success("Your purchase was successful!");

      const userBalance = await cartService.getBalance();
      const items = await cartService.getCartItems();
      const total = items.reduce((sum, item) => sum + parseFloat(item.Price), 0);

      setBalance(userBalance);
      setTotalPrice(total);
      setRemainingBalance(userBalance - total);
      setCartItems(items);
    } catch (error) {
      console.error("Error confirming purchase:", error);
      toast.error("Failed to confirm purchase. Please try again.");
    }
  };
  

  return (
    <div className="shopping-page-container">
      <h1 className="mycart-header">My Cart</h1>
      <table className="shopping-page-table">
        <thead>
          <tr>
            <th>Reservation</th>
            <th>Coach</th>
            <th>Date</th>
            <th>Time</th>
            <th>Pool</th>
            <th>Price</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.BookingID}>
              <td>{item.Reservation}</td>
              <td>{item.Coach}</td>
              <td>{item.Date}</td>
              <td>{item.Time}</td>
              <td>{item.Pool}</td>
              <td>${item.Price}</td>
              <td>
              <button
                className="shopping-page-delete-button"
                onClick={() => handleDelete(item.BookingID, item.Reservation, item.Price)} // Pass price
                >
                ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="shopping-page-total-price">
        <p className="p-balance">Current Balance: ${balance}</p>
        <p className="p-balance">Total Price: ${totalPrice}</p>
        <p className="p-balance">Remaining Balance: ${remainingBalance}</p>
        <div className="right-align-container">
            <Button onClick={handleConfirm}>Confirm</Button>
        </div>
        <div className="shopping-page-links">
          <a href="/add-money" className="shopping-page-link">Add Money to Your Balance</a>
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;
