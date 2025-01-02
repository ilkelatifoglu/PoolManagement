import React, { useState, useEffect } from "react";
import { fetchAllReadyEvents, cancelEvent } from "../../services/event.service";
import Button from "../../components/common/Button/Button";
import "./CancelEvent.css";

const CancelEvent = () => {
  const [events, setEvents] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetchAllReadyEvents();
      setEvents(response);
    } catch (error) {
      setErrorMessage("Failed to fetch events.");
    }
  };

  const handleCancelEvent = async (eventId) => {
    try {
      await cancelEvent({ event_id: eventId });
      setSuccessMessage("Event cancelled successfully.");
      setEvents(events.filter((event) => event.event_id !== eventId));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to cancel the event.");
    }
  };

  return (
    <div className="cancel-event-container">
      <h2 className="cancel-event-title">Cancel Events</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="table-wrapper">
        <table className="cancel-event-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Event Type</th>
              <th>Pool</th>
              <th>Date</th>
              <th>Time</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.event_id}>
                  <td>{event.event_name}</td>
                  <td>{event.event_type}</td>
                  <td>{event.pool_name}</td>
                  <td>{event.session_date}</td>
                  <td>{event.session_time}</td>
                  <td>{event.capacity}</td>
                  <td>
                    <Button
                      className="cancel-button"
                      onClick={() => handleCancelEvent(event.event_id)}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-events-message">
                  No events available to cancel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CancelEvent;
