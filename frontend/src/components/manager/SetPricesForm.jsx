import React, { useState } from "react";

const SetPricesForm = ({ pools, onSubmit }) => {
  const [prices, setPrices] = useState({ pool_id: "", type: "", price: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map selected type to table attributes (general_price or training_price)
    const mappedType = prices.type === "self_training" ? "general_price" : "training_price";
    onSubmit({ ...prices, type: mappedType }); // Pass the mapped type to the parent handler
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>Set Prices</h2>
      {/* Select Pool */}
      <select
        value={prices.pool_id}
        onChange={(e) => setPrices({ ...prices, pool_id: e.target.value })}
        required
      >
        <option value="">Select Pool</option>
        {pools.map((pool) => (
          <option key={pool.pool_id} value={pool.pool_id}>
            {pool.name}
          </option>
        ))}
      </select>

      {/* Select Price Type */}
      <select
        value={prices.type}
        onChange={(e) => setPrices({ ...prices, type: e.target.value })}
        required
      >
        <option value="">Select Type</option>
        <option value="self_training">Self-Training</option>
        <option value="training">Training</option>
      </select>

      {/* Enter Price */}
      <input
        type="number"
        placeholder="Enter Price"
        value={prices.price}
        onChange={(e) => setPrices({ ...prices, price: e.target.value })}
        required
      />

      <button type="submit">Set Price</button>
    </form>
  );
};

export default SetPricesForm;
