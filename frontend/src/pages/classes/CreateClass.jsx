import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import { createClass } from "../../services/class.service";
import { fetchPools, fetchCoachPools } from "../../services/pool.service";
import { useAuth } from "../../context/AuthContext";
import "./CreateClass.css";

const CreateClass = () => {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    age_req: "",
    gender_req: "",
    capacity: "",
    course_content: "",
    enroll_deadline: "",
    session_date: "",
    start_time: "",
    end_time: "",
    lane_number: "",
    pool_id: "",
    price: "",
  });

  const [pools, setPools] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if user is coach
    const role = localStorage.getItem("role");
    if (role !== "coach") {
      setErrorMessage("Unauthorized: Only coaches can create classes");
      return;
    }

    const fetchPoolsData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.user_id) {
          setErrorMessage("Coach information not found. Please log in again.");
          return;
        }
        const coachId = user.user_id;
        console.log("Coach ID:", coachId); // Debug log

        const poolData = await fetchCoachPools(coachId);
        console.log("Pool Data:", poolData); // Debug log
        setPools(poolData);

        setFormData((prev) => ({
          ...prev,
          coach_id: coachId,
        }));
      } catch (error) {
        console.error("Pool fetching error:", error);
        setErrorMessage(`Failed to load pools: ${error.message}`);
      }
    };

    fetchPoolsData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.enroll_deadline) >= new Date(formData.session_date)) {
      setErrorMessage("Enrollment deadline must be earlier than the session date.");
      return;
    }
    if (formData.start_time >= formData.end_time) {
      setErrorMessage("Start time must be earlier than end time.");
      return;
    }

    try {
      await createClass(formData);
      setSuccessMessage("Class created successfully!");
      setErrorMessage("");
      setFormData({
        name: "",
        level: "",
        age_req: "",
        gender_req: "",
        capacity: "",
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
      console.error("Class creation error:", error.response?.data || error);
      setErrorMessage(
        `Failed to create class: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  if (!user || !user.user_type) {
    return (
      <p className="error-message">
        User information is missing. Please log in again.
      </p>
    );
  }

  return (
    <div className="create-class-container">
      <h2>Create a New Class</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="class-form">
        <Input
          label="Class Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Level"
          name="level"
          type="number"
          value={formData.level}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Age Requirement"
          name="age_req"
          type="number"
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
          value={formData.capacity}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Course Content"
          name="course_content"
          type="textarea"
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
          options={Array.from({ length: 15 }, (_, i) => {
            const hour = 6 + i;
            return { value: `${hour}:00`, label: `${hour}:00` };
          })}
          value={formData.start_time}
          onChange={handleInputChange}
          required
        />
        <Input
          label="End Time"
          name="end_time"
          isSelect
          options={Array.from({ length: 15 }, (_, i) => {
            const hour = 6 + i;
            return { value: `${hour}:00`, label: `${hour}:00` };
          })}
          value={formData.end_time}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Lane Number"
          name="lane_number"
          type="number"
          value={formData.lane_number}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Select Pool"
          name="pool_id"
          isSelect
          options={pools.map((pool) => ({
            value: pool.pool_id,
            label: pool.name,
          }))}
          value={formData.pool_id}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <Button type="submit">Create Class</Button>
      </form>
    </div>
  );
};

export default CreateClass;
