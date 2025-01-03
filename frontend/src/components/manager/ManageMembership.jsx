import React, { useState, useEffect } from "react";
import ManagerService from "../../services/manager.service";

const ManageMembership = ({ pools, onMembershipChange, managerId }) => {
  const [memberships, setMemberships] = useState([]);
  const [newMembership, setNewMembership] = useState({
    price: "",
    duration: "",
    pool_id: "",
  });

  useEffect(() => {
    if (managerId) {
      fetchMemberships(managerId);
    }
  }, [managerId]);

  const fetchMemberships = async (managerId) => {
    try {
      const data = await ManagerService.getMemberships(managerId); // Assumes this API exists
      setMemberships(data.memberships || []);
    } catch (error) {
      console.error("Failed to fetch memberships:", error);
    }
  };

  const handleCreateMembership = async (e) => {
    e.preventDefault();
    try {
      const response = await ManagerService.createMembership(newMembership);
      setMemberships([...memberships, response.membership]);
      setNewMembership({ price: "", duration: "", pool_id: "" });
      onMembershipChange("Membership created successfully!");
    } catch (error) {
      console.error("Failed to create membership:", error);
      onMembershipChange("Failed to create membership.");
    }
  };

  const handleDeleteMembership = async (membershipId) => {
    try {
      console.log(membershipId);
      await ManagerService.deleteMembership(membershipId); // Assumes this API exists
      setMemberships(
        memberships.filter((membership) => membership.id !== membershipId)
      );
      onMembershipChange("Membership deleted successfully!");
    } catch (error) {
      console.error("Failed to delete membership:", error);
      onMembershipChange("Failed to delete membership.");
    }
  };

  return (
    <div>
      <h2>Manage Memberships</h2>

      {/* Create Membership Form */}
      <form onSubmit={handleCreateMembership} style={{ marginBottom: "20px" }}>
        <select
          value={newMembership.pool_id}
          onChange={(e) =>
            setNewMembership({ ...newMembership, pool_id: e.target.value })
          }
          required
        >
          <option value="">Select Pool</option>
          {pools.map((pool) => (
            <option key={pool.pool_id} value={pool.pool_id}>
              {pool.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Duration (months)"
          value={newMembership.duration}
          onChange={(e) =>
            setNewMembership({ ...newMembership, duration: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newMembership.price}
          onChange={(e) =>
            setNewMembership({ ...newMembership, price: e.target.value })
          }
          required
        />
        <button type="submit">Add Membership</button>
      </form>

      <h3>Current Memberships</h3>
      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{ width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>Membership ID</th>
            <th>Pool Name</th>
            <th>Duration (months)</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {memberships.length > 0 ? (
            memberships.map((membership) => (
              <tr key={membership.membership_id}>
                <td>{membership.membership_id}</td>
                <td>{membership.pool_name}</td>
                <td>{membership.duration}</td>
                <td>${membership.price}</td>
                <td>
                  <button
                    onClick={() =>
                      handleDeleteMembership(membership.membership_id)
                    }
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No memberships available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageMembership;
