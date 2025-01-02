import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ManagerService from "../../services/manager.service";
import ManageMembership from "../../components/manager/ManageMembership";
import SetPricesForm from "../../components/manager/SetPricesForm";
import ManageStaff from "../../components/manager/ManageStaff";
import ManagePools from "../../components/manager/ManagePools"; // Import ManagePools

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [pools, setPools] = useState([]); // Shared pools data
  const [message, setMessage] = useState(""); // Shared message state
  const [activeTab, setActiveTab] = useState("membership");

  useEffect(() => {
    if (user?.user_id) {
      fetchPools(user.user_id);
    }
  }, [user]);

  const fetchPools = async (managerId) => {
    try {
      const data = await ManagerService.getPools(managerId);
      setPools(data.pools || []);
    } catch (error) {
      console.error("Failed to fetch pools:", error);
    }
  };

  const handleSetPrices = async (prices) => {
    try {
      const { pool_id, type, price } = prices;
  
      // Dynamically construct the payload based on type
      const payload = {
        pool_id,
        [type]: price, // Use mapped attribute as the key
      };
  
      console.log(payload); // Debugging: log payload before sending
  
      const response = await ManagerService.setPrices(payload);
      setMessage(response.message || "Price updated successfully!");
    } catch (error) {
      console.error("Failed to set prices:", error);
      setMessage("Failed to set prices.");
    }
  };
  
  const handlePoolsUpdated = () => {
    // Refresh pools data when updated in ManagePools
    if (user?.user_id) {
      fetchPools(user.user_id);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manager Dashboard</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Navigation Bar */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("membership")} style={activeTab === "membership" ? { fontWeight: "bold" } : {}}>
          Manage Membership
        </button>
        <button onClick={() => setActiveTab("prices")} style={activeTab === "prices" ? { fontWeight: "bold" } : {}}>
          Set Prices
        </button>
        <button onClick={() => setActiveTab("staff")} style={activeTab === "staff" ? { fontWeight: "bold" } : {}}>
          Manage Staffs
        </button>
        <button onClick={() => setActiveTab("pools")} style={activeTab === "pools" ? { fontWeight: "bold" } : {}}>
          Manage Pools
        </button>
      </div>

      {/* Render Components Based on Active Tab */}
      {activeTab === "membership" && (
        <ManageMembership
            pools={pools}
            managerId={user?.user_id}
            onMembershipChange={(message) => setMessage(message)}
        />
        )}

      {activeTab === "prices" && <SetPricesForm pools={pools} onSubmit={handleSetPrices} />}
      {activeTab === "staff" && (
        <ManageStaff
            pools={pools}
            managerId={user?.user_id} // Pass manager ID
        />
        )}


      {activeTab === "pools" && <ManagePools
        pools={pools}
        onPoolsUpdated={handlePoolsUpdated}
        managerId={user?.user_id} // Pass the managerId to ManagePools
      />}
    </div>
  );
};

export default ManagerDashboard;
