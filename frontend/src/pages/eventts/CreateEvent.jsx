import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input/Input";
import Button from "../../components/common/Button/Button";
import { createEvent, fetchEventTypes } from "../../services/event.service";
import { fetchPools } from "../../services/pool.service";
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
  const [pools, setPools] = useState([]);
  const [eventTypes, setEventTypes] = useState([]); // State for event types
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch pools and event types on component load
    const fetchData = async () => {
      try {
        const poolData = await fetchPools();
        const eventTypeData = await fetchEventTypes();
        setPools(poolData);
        setEventTypes(eventTypeData);
      } catch (error) {
        setErrorMessage("Failed to load data.");
      }
    };
    fetchData();
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
        <Button type="submit">Create Event</Button>
      </form>
    </div>
  );
};

export default CreateEvent;
