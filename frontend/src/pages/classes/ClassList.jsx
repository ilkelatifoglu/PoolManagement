import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import Table from "../../components/common/Table/Table"; // Import the Table component
import { fetchClasses, addToCart } from "../../services/class.service";
import "./ClassList.css";
import { useAuth } from "../../context/AuthContext";

const ClassList = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [filters, setFilters] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await fetchClasses();
      setClasses(data);
      setFilteredClasses(data);
    } catch (err) {
      console.error("Error fetching classes:", err.response || err);
      setError(err.response?.data?.error || "Internal Server Error");
    }
  };

  const handleAddToCart = async (classData) => {
    try {
      await addToCart({ swimmer_id: user.user_id, class_id: classData.class_id });
      setSuccess("Class added to cart successfully!");
      setFilteredClasses((prev) =>
        prev.filter((cls) => cls.class_id !== classData.class_id)
      );
    } catch (err) {
      setError("Failed to add class to cart");
    }
  };

  const applyFilters = () => {
    let filtered = classes;

    if (filters.pool_name) {
      filtered = filtered.filter((cls) =>
        cls.pool_name.toLowerCase().includes(filters.pool_name.toLowerCase())
      );
    }
    if (filters.coach_name) {
      filtered = filtered.filter((cls) =>
        cls.coach_name.toLowerCase().includes(filters.coach_name.toLowerCase())
      );
    }
    if (filters.level) {
      filtered = filtered.filter((cls) => cls.level === Number(filters.level));
    }
    if (filters.gender_req) {
      filtered = filtered.filter((cls) => cls.gender_req === filters.gender_req);
    }
    if (filters.capacity) {
      filtered = filtered.filter((cls) => cls.capacity >= Number(filters.capacity));
    }
    if (filters.age_req) {
      filtered = filtered.filter((cls) => cls.age_req <= Number(filters.age_req));
    }
    if (filters.date) {
      filtered = filtered.filter((cls) =>
        cls.session_date.startsWith(filters.date)
      );
    }

    setFilteredClasses(filtered);
  };

  const clearFilters = () => {
    setFilters({});
    setFilteredClasses(classes);
  };

  const columns = [
    { header: "Class Name", accessor: "class_name" },
    { header: "Coach", accessor: "coach_name" },
    { header: "Pool", accessor: "pool_name" },
    { header: "Date", accessor: "session_date" },
    { header: "Time", accessor: "session_time" },
    { header: "Capacity", accessor: "capacity" },
    { header: "Price", accessor: "price" },
  ];

  const actions = [
    {
      label: "Add to Cart",
      onClick: handleAddToCart,
    },
  ];

  return (
    <div className="class-list-container">
      <h2>Pool Booking System</h2>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <div className="filter-section">
        <Input
          name="pool_name"
          label="Pool Name"
          onChange={(e) => setFilters({ ...filters, pool_name: e.target.value })}
          value={filters.pool_name || ""}
        />
        <Input
          name="coach_name"
          label="Coach Name"
          onChange={(e) => setFilters({ ...filters, coach_name: e.target.value })}
          value={filters.coach_name || ""}
        />
        <Input
          name="level"
          label="Level"
          type="number"
          onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          value={filters.level || ""}
        />
        <Input
          name="gender_req"
          label="Gender Requirement"
          isSelect
          options={[
            { value: "", label: "Any" },
            { value: "M", label: "Male" },
            { value: "F", label: "Female" },
          ]}
          onChange={(e) => setFilters({ ...filters, gender_req: e.target.value })}
          value={filters.gender_req || ""}
        />
        <Input
          name="capacity"
          label="Capacity"
          type="number"
          onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
          value={filters.capacity || ""}
        />
        <Input
          name="age_req"
          label="Age Requirement"
          type="number"
          onChange={(e) => setFilters({ ...filters, age_req: e.target.value })}
          value={filters.age_req || ""}
        />
        <Input
          name="date"
          label="Date"
          type="date"
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          value={filters.date || ""}
        />
        <div className="button-group">
          <Button onClick={applyFilters}>Search</Button>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      </div>

      <div className="table-section">
        <Table columns={columns} data={filteredClasses} actions={actions} />
      </div>
    </div>
  );
};

export default ClassList;
