import React, { useState, useEffect } from "react";
import { createClass } from "../../services/class.service";
import { fetchPools } from "../../services/pool.service"; // Import fetchPools service
import Input from "../../components/common/Input/Input";
import "./CreateClass.css";

const CreateClass = () => {
  const [formData, setFormData] = useState({
    name: "",
    coach_id: "",
    level: "",
    age_req: "",
    gender_req: "",
    capacity: "",
    avg_rating: 0,
    course_content: "",
    enroll_deadline: "",
    session_date: "",
    start_time: "",
    end_time: "",
    lane_number: "",
    pool_id: "",
    price: "",
  });

  const [pools, setPools] = useState([]); // Store pool options
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch pool data on component mount
    const fetchPoolData = async () => {
      try {
        const response = await fetchPools();
        setPools(response);
      } catch (error) {
        console.error("Error fetching pools:", error);
      }
    };

    fetchPoolData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.start_time >= formData.end_time) {
      setError("Start time must be earlier than end time.");
      return;
    }
    setError("");
    setSuccess("");
    try {
      const payload = { ...formData };
      await createClass(payload);
      setSuccess("Class created successfully!");
      setFormData({
        name: "",
        coach_id: "",
        level: "",
        age_req: "",
        gender_req: "",
        capacity: "",
        avg_rating: 0,
        course_content: "",
        enroll_deadline: "",
        session_date: "",
        start_time: "",
        end_time: "",
        lane_number: "",
        pool_id: "",
        price: "",
      });
    } catch (error) {
      setError(
        "Error creating class: " + (error.response?.data?.error || error.message)
      );
    }
  };

  // Restrict time options between 6:00 and 20:00
  const hourOptions = Array.from({ length: 15 }, (_, i) => {
    const hour = 6 + i; // Generate hours from 6 to 20
    return {
      value: `${hour.toString().padStart(2, "0")}:00`,
      label: `${hour.toString().padStart(2, "0")}:00`,
    };
  });

  const poolOptions = pools.map((pool) => ({
    value: pool.pool_id,
    label: pool.name,
  }));

  return (
    <div className="create-class-container">
      <h2>Create a New Class</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Class Name"
          name="name"
          placeholder="Enter class name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Coach ID"
          name="coach_id"
          type="number"
          placeholder="Enter coach ID"
          value={formData.coach_id}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Level"
          name="level"
          type="number"
          placeholder="Enter level"
          value={formData.level}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Age Requirement"
          name="age_req"
          type="number"
          placeholder="Enter age requirement"
          value={formData.age_req}
          onChange={handleInputChange}
        />
        <Input
          label="Gender Requirement"
          name="gender_req"
          isSelect
          options={[
            { value: "", label: "Any" },
            { value: "M", label: "Male" },
            { value: "F", label: "Female" },
          ]}
          value={formData.gender_req}
          onChange={handleInputChange}
        />
        <Input
          label="Capacity"
          name="capacity"
          type="number"
          placeholder="Enter capacity"
          value={formData.capacity}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Course Content"
          name="course_content"
          type="textarea"
          placeholder="Enter course content"
          value={formData.course_content}
          onChange={handleInputChange}
        />
        <Input
          label="Enrollment Deadline"
          name="enroll_deadline"
          type="date"
          value={formData.enroll_deadline}
          onChange={handleInputChange}
        />
        <h4>Session Details</h4>
        <Input
          label="Session Date"
          name="session_date"
          type="date"
          value={formData.session_date}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Start Time"
          name="start_time"
          isSelect
          options={hourOptions}
          value={formData.start_time}
          onChange={handleInputChange}
          required
        />
        <Input
          label="End Time"
          name="end_time"
          isSelect
          options={hourOptions}
          value={formData.end_time}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Lane Number"
          name="lane_number"
          type="number"
          placeholder="Enter lane number"
          value={formData.lane_number}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Pool"
          name="pool_id"
          isSelect
          options={poolOptions}
          value={formData.pool_id}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Price"
          name="price"
          type="number"
          placeholder="Enter price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />

        <button type="submit" className="btn btn-primary">
          Create Class
        </button>
      </form>
    </div>
  );
};

export default CreateClass;
