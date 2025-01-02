import React, { useState } from "react";
import ManagerService from "../../services/manager.service";

const ManagePools = ({ pools, onPoolsUpdated, managerId }) => {
  const [newPool, setNewPool] = useState({
    name: "",
    capacity: "",
    general_price: "",
    training_price: "",
  });
  const [message, setMessage] = useState("");

  const handleCreatePool = async (e) => {
    e.preventDefault();
    try {
      // Add the managerId to the newPool data
      const poolData = { ...newPool, manager_id: managerId };
      const response = await ManagerService.createPool(poolData);
      setMessage(response.message || "Pool created successfully!");
      setNewPool({
        name: "",
        capacity: "",
        general_price: "",
        training_price: "",
      });
      onPoolsUpdated(); // Notify parent to refresh pools
    } catch (error) {
      console.error("Failed to create pool:", error);
      setMessage("Failed to create pool.");
    }
  };

  const handleDeletePool = async (poolId) => {
    try {
      const response = await ManagerService.deletePool(poolId);
      setMessage(response.message || "Pool deleted successfully!");
      onPoolsUpdated(); // Notify parent to refresh pools
    } catch (error) {
      console.error("Failed to delete pool:", error);
      setMessage("Failed to delete pool.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Pools</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Create Pool Form */}
      <form onSubmit={handleCreatePool} style={{ marginBottom: "20px" }}>
        <h3>Create New Pool</h3>
        <input
          type="text"
          placeholder="Name"
          value={newPool.name}
          onChange={(e) => setNewPool({ ...newPool, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={newPool.capacity}
          onChange={(e) => setNewPool({ ...newPool, capacity: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="General Price"
          value={newPool.general_price}
          onChange={(e) => setNewPool({ ...newPool, general_price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Training Price"
          value={newPool.training_price}
          onChange={(e) => setNewPool({ ...newPool, training_price: e.target.value })}
          required
        />
        <button type="submit">Create Pool</button>
      </form>

      {/* List of Pools */}
      <h3>Existing Pools</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>General Price</th>
            <th>Training Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pools.length > 0 ? (
            pools.map((pool) => (
              <tr key={pool.pool_id}>
                <td>{pool.name}</td>
                <td>{pool.capacity}</td>
                <td>{pool.general_price}</td>
                <td>{pool.training_price}</td>
                <td>
                  <button
                    onClick={() => handleDeletePool(pool.pool_id)}
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No pools available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePools;
