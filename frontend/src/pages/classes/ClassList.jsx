import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import Table from "../../components/common/Table/Table";
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

  // Generate hourly time options
  const generateTimeOptions = () => {
    const options = [];
    for (let i = 6; i <= 20; i++) {
      const hour = i.toString().padStart(2, "0");
      options.push(`${hour}:00`);
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

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

  // Add this function to check if enrollment deadline has passed
  const isEnrollmentDeadlinePassed = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

  const handleAddToCart = async (classData) => {
    try {
      // Check enrollment deadline before making the API call
      if (isEnrollmentDeadlinePassed(classData.enroll_deadline)) {
        setError("❌ Cannot add to cart: Enrollment deadline has passed");
        return;
      }

      await addToCart({
        swimmer_id: user.user_id,
        class_id: classData.class_id,
      });
      setSuccess("✅ Class added to cart successfully!");
      setFilteredClasses((prev) =>
        prev.filter((cls) => cls.class_id !== classData.class_id)
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.log("Error details:", err); // Add this for debugging

      // Get the error message from the response
      const errorMessage =
        err.error || err.message || "Failed to add class to cart";

      // Add emoji indicators for different types of errors
      let formattedError = "❌ ";
      if (errorMessage.includes("gender")) {
        formattedError += "Gender Restriction: " + errorMessage;
      } else if (errorMessage.includes("age")) {
        formattedError += "Age Restriction: " + errorMessage;
      } else if (
        errorMessage.includes("capacity") ||
        errorMessage.includes("full")
      ) {
        formattedError += "Class Full: " + errorMessage;
      } else if (errorMessage.includes("scheduled")) {
        formattedError += "Schedule Conflict: " + errorMessage;
      } else {
        formattedError += errorMessage;
      }

      setError(formattedError);
      setTimeout(() => setError(""), 3000);
    }
  };

  const applyFilters = () => {
    let filtered = classes;

    if (
      filters.start_time &&
      filters.end_time &&
      filters.start_time >= filters.end_time
    ) {
      setError("Start Time must be earlier than End Time");
      return;
    }

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
      filtered = filtered.filter(
        (cls) => cls.gender_req === filters.gender_req
      );
    }
    if (filters.capacity) {
      filtered = filtered.filter(
        (cls) => cls.capacity >= Number(filters.capacity)
      );
    }
    if (filters.date) {
      filtered = filtered.filter((cls) =>
        cls.session_date.startsWith(filters.date)
      );
    }
    if (filters.start_time) {
      filtered = filtered.filter(
        (cls) => cls.start_time === filters.start_time
      );
    }
    if (filters.end_time) {
      filtered = filtered.filter((cls) => cls.end_time === filters.end_time);
    }
    if (filters.duration) {
      filtered = filtered.filter(
        (cls) => cls.duration === Number(filters.duration)
      );
    }
    if (filters.lane_number) {
      filtered = filtered.filter(
        (cls) => cls.lane_number === Number(filters.lane_number)
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
    { header: "Pool", accessor: "pool_name" },
    { header: "Coach", accessor: "coach_name" },
    { header: "Level", accessor: "level" },
    { header: "Age Req.", accessor: "age_req" },
    { header: "Gender", accessor: "gender_req" },
    { header: "Capacity", accessor: "capacity" },
    { header: "Date", accessor: "session_date" },
    { header: "Start Time", accessor: "start_time" },
    { header: "End Time", accessor: "end_time" },
    { header: "Duration", accessor: "duration" },
    { header: "Lane", accessor: "lane_number" },
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
      {success && (
        <p
          className="success"
          style={{
            backgroundColor: "#e7f7e7",
            color: "#2e7d32",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          {success}
        </p>
      )}
      {error && (
        <p
          className="error"
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          {error}
        </p>
      )}

      <div className="filter-section">
        <Input
          name="pool_name"
          label="Pool Name"
          onChange={(e) =>
            setFilters({ ...filters, pool_name: e.target.value })
          }
          value={filters.pool_name || ""}
        />
        <Input
          name="coach_name"
          label="Coach Name"
          onChange={(e) =>
            setFilters({ ...filters, coach_name: e.target.value })
          }
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
          onChange={(e) =>
            setFilters({ ...filters, gender_req: e.target.value })
          }
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
          name="date"
          label="Date"
          type="date"
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          value={filters.date || ""}
        />
        <Input
          name="start_time"
          label="Start Time"
          isSelect
          options={timeOptions.map((time) => ({ value: time, label: time }))}
          onChange={(e) =>
            setFilters({ ...filters, start_time: e.target.value })
          }
          value={filters.start_time || ""}
        />
        <Input
          name="end_time"
          label="End Time"
          isSelect
          options={timeOptions.map((time) => ({ value: time, label: time }))}
          onChange={(e) => setFilters({ ...filters, end_time: e.target.value })}
          value={filters.end_time || ""}
        />
        <Input
          name="duration"
          label="Duration (Hours)"
          type="number"
          onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
          value={filters.duration || ""}
        />
        <Input
          name="lane_number"
          label="Lane Number"
          type="number"
          onChange={(e) =>
            setFilters({ ...filters, lane_number: e.target.value })
          }
          value={filters.lane_number || ""}
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
