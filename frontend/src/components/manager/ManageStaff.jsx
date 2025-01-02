import React, { useState, useEffect } from "react";
import ManagerService from "../../services/manager.service";

const ManageStaff = ({ pools, managerId }) => {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    role: "coach",
    pool_id: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (managerId) {
      fetchStaff(managerId); // Fetch staff when the component mounts
    }
  }, [managerId]);

  const fetchStaff = async (managerId) => {
    try {
      const response = await ManagerService.getStaffs(managerId);
      //console.log(response);
      setStaff(response.staffs || []);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await ManagerService.createStaff(newStaff);
      console.log(newStaff);
      setMessage(response.message || "Staff created successfully!");
      setNewStaff({
        name: "",
        email: "",
        password: "",
        role: "coach",
        pool_id: "",
      });
      fetchStaff(managerId); // Refresh staff after creation
    } catch (error) {
      console.error("Failed to create staff:", error);
      setMessage("Failed to create staff.");
    }
  };

  const handleDeleteStaff = async (staffId, role) => {
    try {
        console.log(staffId, role);
        const response = await ManagerService.deleteStaff(staffId, role);
        setMessage(response.message || "Staff pool assignment removed successfully!");
        fetchStaff(managerId);
    } catch (error) {
        console.error("Failed to delete staff:", error);
        setMessage("Failed to delete staff.");
    }
};


  return (
    <div>
      <h2>Manage Staff</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Create Staff Form */}
      <form onSubmit={handleCreateStaff}>
        <h3>Create New Staff</h3>
        <select
          value={newStaff.role}
          onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
          required
        >
          <option value="coach">Coach</option>
          <option value="lifeguard">Lifeguard</option>
        </select>
        <select
          value={newStaff.pool_id}
          onChange={(e) => setNewStaff({ ...newStaff, pool_id: e.target.value })}
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
          type="text"
          placeholder="Name"
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newStaff.email}
          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newStaff.password}
          onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
          required
        />
        <button type="submit">Create Staff</button>
      </form>

      {/* Staff List */}
      <h3>Existing Staff</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Pool</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.length > 0 ? (
            staff.map((member) => (
              <tr key={member.user_id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>{pools.find((pool) => pool.pool_id === member.pool_id)?.name || "Unknown Pool"}</td>
                <td>
                <button
                    onClick={() => handleDeleteStaff(member.user_id, member.role)}
                    style={{ color: "red", cursor: "pointer" }}
                >
                    Delete
                </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No staff available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageStaff;
