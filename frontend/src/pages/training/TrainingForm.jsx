import React, { useState } from "react";
import api from "../../services/api";

const TrainingForm = ({ refreshTrainings }) => {
  const [formData, setFormData] = useState({
    pool_id: "",
    date: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/self-training`, formData); // Use your `api` instance
      alert("Self-training created successfully!");
      refreshTrainings();
      setFormData({
        pool_id: "",
        date: "",
        start_time: "",
        end_time: "",
      });
    } catch (err) {
      console.error("Error creating self-training:", err);
      alert("Failed to create self-training.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="training-form">
      <h3>Create Self-Training</h3>
      <input
        type="text"
        name="pool_id"
        placeholder="Pool ID"
        value={formData.pool_id}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        type="time"
        name="start_time"
        value={formData.start_time}
        onChange={handleChange}
        required
      />
      <input
        type="time"
        name="end_time"
        value={formData.end_time}
        onChange={handleChange}
        required
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default TrainingForm;
