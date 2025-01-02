import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import { createEvent } from "../../services/event.service";
import { fetchPools } from "../../services/pool.service"; // Import fetchPools function
import "./CreateEvent.css";

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    manager_id: "",
    event_name: "",
    event_type: "",
    capacity: "",
    date: "",
    start_time: "",
    end_time: "",
    pool_id: "",
  });
  const [pools, setPools] = useState([]); // State for pools
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const hourlyOptions = Array.from({ length: 15 }, (_, i) => {
    const hour = 6 + i; // Generate hours from 6 to 20
    return hour < 10 ? `0${hour}:00` : `${hour}:00`;
  });

  useEffect(() => {
    // Fetch pools on component load
    const fetchPoolsData = async () => {
      try {
        const poolData = await fetchPools();
        setPools(poolData);
      } catch (error) {
        setErrorMessage("Failed to load pools.");
      }
    };
    fetchPoolsData();
  }, []);

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
        manager_id: "",
        event_name: "",
        event_type: "",
        capacity: "",
        date: "",
        start_time: "",
        end_time: "",
        pool_id: "",
      });
    } catch (error) {
      setErrorMessage("Failed to create event. Please check the inputs.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create Event</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="event-form">
        <Input
          name="manager_id"
          label="Manager ID"
          value={eventData.manager_id}
          onChange={handleInputChange}
        />
        <Input
          name="event_name"
          label="Event Name"
          value={eventData.event_name}
          onChange={handleInputChange}
        />
        <Input
          name="event_type"
          label="Event Type"
          value={eventData.event_type}
          onChange={handleInputChange}
        />
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
            {hourlyOptions.map((time) => (
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
            {hourlyOptions.map((time) => (
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
            {pools.length > 0 ? (
              pools.map((pool) => (
                <option key={pool.pool_id} value={pool.pool_id}>
                  {pool.name}
                </option>
              ))
            ) : (
              <option disabled>Loading pools...</option>
            )}
          </select>
        </div>
        <Button type="submit">
          Create Event
        </Button>
      </form>
    </div>
  );
};

export default CreateEvent;
