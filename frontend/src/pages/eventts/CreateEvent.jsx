import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import {
  createEvent,
  fetchManagerPools,
  fetchEventTypes,
} from "../../services/event.service";
import "./CreateEvent.css";
import { useAuth } from "../../context/AuthContext";

const CreateEvent = () => {
  const { user, loading } = useAuth();

  const [eventData, setEventData] = useState({
    event_name: "",
    event_type: "",
    capacity: "",
    date: "",
    start_time: "",
    end_time: "",
    pool_id: "",
  });
  const [pools, setPools] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "manager") {
      setErrorMessage("Unauthorized: Only managers can create events");
      return;
    }

    if (user && user.user_type === "manager") {
      const fetchData = async () => {
        try {
          const poolData = await fetchManagerPools();
          const eventTypeData = await fetchEventTypes();
          setPools(poolData);
          setEventTypes(eventTypeData);
        } catch (error) {
          setErrorMessage("Failed to load data. Please try again.");
        }
      };

      fetchData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (eventData.start_time >= eventData.end_time) {
      setErrorMessage("Start time must be earlier than end time.");
      return;
    }

    try {
      await createEvent(eventData);
      setSuccessMessage("Event created successfully!");
      setErrorMessage("");
      setEventData({
        event_name: "",
        event_type: "",
        capacity: "",
        date: "",
        start_time: "",
        end_time: "",
        pool_id: "",
      });
    } catch (error) {
      if (error?.message === "Unauthorized") {
        setErrorMessage("Your session has expired. Please log in again.");
        // Optionally redirect to login page
      } else {
        setErrorMessage("Failed to create event. Please check the inputs.");
      }
      setSuccessMessage("");
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
    <div className="create-event-container">
      <h2>Create Event</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="event-form">
        <Input
          name="event_name"
          label="Event Name"
          value={eventData.event_name}
          onChange={handleInputChange}
        />
        <div className="form-group">
          <label htmlFor="event_type">Event Type</label>
          <select
            name="event_type"
            value={eventData.event_type}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select Event Type</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <Input
          name="capacity"
          label="Capacity"
          type="number"
          value={eventData.capacity}
          onChange={handleInputChange}
        />
        <Input
          name="date"
          label="Date"
          type="date"
          value={eventData.date}
          onChange={handleInputChange}
        />
        <div className="form-group">
          <label htmlFor="start_time">Start Time</label>
          <select
            name="start_time"
            value={eventData.start_time}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select Start Time</option>
            {Array.from({ length: 15 }, (_, i) => {
              const hour = 6 + i;
              return `${hour < 10 ? `0${hour}` : hour}:00`;
            }).map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="end_time">End Time</label>
          <select
            name="end_time"
            value={eventData.end_time}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select End Time</option>
            {Array.from({ length: 15 }, (_, i) => {
              const hour = 6 + i;
              return `${hour < 10 ? `0${hour}` : hour}:00`;
            }).map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="pool_id">Select Pool</label>
          <select
            name="pool_id"
            value={eventData.pool_id}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select a Pool</option>
            {pools.map((pool) => (
              <option key={pool.pool_id} value={pool.pool_id}>
                {pool.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit">Create Event</Button>
      </form>
    </div>
  );
};

export default CreateEvent;
