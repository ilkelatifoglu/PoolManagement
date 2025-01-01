import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button"; // Import the reusable Button component
import { fetchClasses, addToCart } from "../../services/class.service";
import "./ClassList.css";
import { useAuth } from "../../context/AuthContext"; // Import the useAuth hook

const ClassList = () => {
  const { user } = useAuth(); // Move this inside the functional component
  const [filters, setFilters] = useState({});
  const [classes, setClasses] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClassesData();
  }, []);

  const fetchClassesData = async () => {
    try {
      const data = await fetchClasses(filters);
      setClasses(data);
    } catch (error) {
      setError("Failed to fetch classes");
    }
  };

  const handleAddToCart = async (classId) => {
    if (!user) {
      console.error("User is null or undefined. Ensure user is logged in.");
      setError("User not logged in.");
      return;
    }
  
    if (!user.user_id) {
      console.error("user_id is missing in user object:", user);
      setError("User ID is missing. Please log in again.");
      return;
    }
  
    try {
      console.log("Adding class to cart for user:", user.user_id);
      await addToCart({ swimmer_id: user.user_id, class_id: classId });
      setSuccess("Class added to cart successfully!");
    } catch (error) {
      console.error("Failed to add class to cart:", error);
      setError("Failed to add class to cart.");
    }
  };
  


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleClearFilters = () => {
    setFilters({});
    fetchClassesData(); // Fetch all classes again after clearing filters
  };

  return (
    <div className="class-list-container">
      <h2>Pool Booking System</h2>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <div className="filter-section">
        <Input name="pool_name" label="Pool Name" onChange={handleFilterChange} value={filters.pool_name || ""} />
        <Input name="coach_name" label="Coach Name" onChange={handleFilterChange} value={filters.coach_name || ""} />
        <Input name="level" label="Level" type="number" onChange={handleFilterChange} value={filters.level || ""} />
        <Input
          name="gender_req"
          label="Gender Requirement"
          isSelect
          options={[{ value: "", label: "Any" }, { value: "M", label: "Male" }, { value: "F", label: "Female" }]}
          onChange={handleFilterChange}
          value={filters.gender_req || ""}
        />
        <Input name="capacity" label="Capacity" type="number" onChange={handleFilterChange} value={filters.capacity || ""} />
        <Input name="age_req" label="Age Requirement" type="number" onChange={handleFilterChange} value={filters.age_req || ""} />
        <Input name="date" label="Date" type="date" onChange={handleFilterChange} value={filters.date || ""} />
        <div className="button-group">
          <Button onClick={fetchClassesData} className="btn-primary">Search</Button>
          <Button onClick={handleClearFilters} className="btn-secondary">Clear Filters</Button>
        </div>
      </div>

      <table className="classes-table">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Coach</th>
            <th>Pool</th>
            <th>Date</th>
            <th>Time</th>
            <th>Lane</th>
            <th>Capacity</th>
            <th>Age Req.</th>
            <th>Gender Req.</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.class_id}>
              <td>{cls.class_name}</td>
              <td>{cls.coach_name}</td>
              <td>{cls.pool_name}</td>
              <td>{cls.session_date || "N/A"}</td>
              <td>{cls.session_time || "N/A"}</td>
              <td>{cls.lane_number || "N/A"}</td>
              <td>{cls.capacity || "N/A"}</td>
              <td>{cls.age_req || "N/A"}</td>
              <td>{cls.gender_req || "N/A"}</td>
              <td>${cls.price}</td>
              <td>
                <Button onClick={() => handleAddToCart(cls.class_id)} className="btn-success">
                  Add to Cart
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassList;
