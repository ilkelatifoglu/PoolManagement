import React, { useState } from "react";
import { toast } from "react-toastify";
import { cartService } from "../../services/cart.service";
import "./addmoneypage.css";

const AddMoneyPage = () => {
  const [amount, setAmount] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= 16) {
      setCardNumber(value);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (cardNumber.length !== 16) {
      toast.error("Card number must be 16 digits.");
      return;
    }

    if (cvv.length !== 3) {
      toast.error("CVV must be 3 digits.");
      return;
    }

    try {
      await cartService.addMoneyToBalance(parseFloat(amount));
      toast.success("Money added to your balance successfully!");
    } catch (error) {
      console.error("Error adding money to balance:", error);
      toast.error("Failed to add money. Please try again.");
    }
  };

  const years = Array.from(
    { length: 10 },
    (_, i) => (new Date().getFullYear() + i).toString()
  );

  return (
    <div className="add-money-container">
      <h1>Add Money to Account</h1>
      <div className="add-money-form">
        <label>
          Card Holder's Name:
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            placeholder="Enter cardholder's name"
          />
        </label>
        <label>
          Card Number:
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1111 2222 3333 4444"
            maxLength="16"
            inputMode="numeric"
          />
        </label>
        <div className="add-money-date-cvv">
          <label>
            Expiration Month:
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
          <label>
            Expiration Year:
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label>
            CVV:
            <input
              type="text"
              value={cvv}
              onChange={handleCvvChange}
              placeholder="123"
              maxLength="3"
              inputMode="numeric"
            />
          </label>
        </div>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to add"
            min="1"
          />
        </label>
        <button className="confirm-button" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default AddMoneyPage;
