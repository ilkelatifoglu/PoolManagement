import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cartService } from "../../services/cart.service";
import "./bememberpage.css";

const BeMemberPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [filteredMemberships, setFilteredMemberships] = useState([]);
  const [balance, setBalance] = useState(0);
  const [poolFilter, setPoolFilter] = useState("");

  useEffect(() => {
    // Fetch memberships and balance
    const fetchData = async () => {
      try {
        const membershipsData = await cartService.getAvailableMemberships();
        setMemberships(membershipsData);
        setFilteredMemberships(membershipsData);

        const currentBalance = await cartService.getBalance();
        setBalance(currentBalance);
      } catch (error) {
        toast.error("Error loading data.");
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const filterValue = e.target.value.toLowerCase();
    setPoolFilter(filterValue);
    setFilteredMemberships(
      memberships.filter((membership) =>
        membership.PoolName.toLowerCase().includes(filterValue)
      )
    );
  };

  const handleBecomeMember = async (membershipId, price) => {
    if (balance < price) {
        toast.error("Insufficient balance! Please add money to your account.");
        return;
    }

    try {
      await cartService.becomeMember(membershipId);
      toast.success("You are now a member!");

      // Update balance and memberships
      setBalance((prev) => prev - price);
      setMemberships((prev) =>
        prev.filter((membership) => membership.membership_id !== membershipId)
      );
      setFilteredMemberships((prev) =>
        prev.filter((membership) => membership.membership_id !== membershipId)
      );
    } catch (error) {
        toast.error("Failed to become a member. Please try again.");
    }
  };

  return (
    <div className="bemember-page">
      <h1 className="available-membership-title">Available Memberships</h1>
      <div className="header-container">
        <div className="filter-container">
          <label htmlFor="pool-filter" className="filter-label">
            Filter by Pool Name:
          </label>
          <input
            id="pool-filter"
            type="text"
            value={poolFilter}
            onChange={handleFilterChange}
            placeholder="Enter pool name"
            className="filter-input"
          />
        </div>
        <div className="balance-container">
          <span>Your Balance: ${balance}</span>
          <a href="/add-money" className="add-money-link">
            Add Money
          </a>
        </div>
      </div>
      <table className="memberships-table">
        <thead>
          <tr>
            <th>Pool Name</th>
            <th>Duration (Month)</th>
            <th>Price</th>
            <th>Be a Member</th>
          </tr>
        </thead>
        <tbody>
          {filteredMemberships.map((membership) => (
            <tr key={membership.membership_id}>
              <td>{membership.PoolName}</td>
              <td>{membership.MembershipDuration}</td>
              <td>${membership.MembershipPrice}</td>
              <td>
                <button
                  onClick={() =>
                    handleBecomeMember(
                      membership.membership_id,
                      membership.MembershipPrice
                    )
                  }
                  className="be-member-button"
                >
                  Be a Member
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BeMemberPage;
