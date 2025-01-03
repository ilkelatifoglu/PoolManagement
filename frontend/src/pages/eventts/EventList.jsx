import React, { useState, useEffect } from "react";
import { fetchReadyEvents, attendEvent } from "../../services/event.service";
import { useAuth } from "../../context/AuthContext";
import "./EventList.css";

const EventList = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState("");

    const loadEvents = async () => {
        if (!user || !user.user_id) {
            setMessage("User not authenticated.");
            return;
        }
    
        try {
            const data = await fetchReadyEvents(user.user_id);
            if (data.length === 0) {
                setMessage("No available events found.");
            } else {
                setMessage("");
            }
            setEvents(data);
        } catch (err) {
            setMessage("Failed to load events.");
            console.error("Error fetching events:", err);
        }
    };

    useEffect(() => {
        loadEvents();
    }, [user]); // Run loadEvents whenever `user` changes
    
    const handleAttend = async (eventId) => {
        try {
            await attendEvent(user.user_id, eventId);
            setMessage("Successfully registered for the event!");
            loadEvents(); // Reload the events to update the UI
        } catch (err) {
            setMessage(err.error || "Failed to register for the event.");
        }
    };

    if (!user) {
        return <p>Please log in to view events.</p>; // Add a fallback if user is null
    }

    return (
        <div className="event-list-container">
            <h2>Available Events</h2>
            {message && <p className="message">{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Event Type</th>
                        <th>Capacity</th>
                        <th>Pool</th>
                        <th>Time</th> {/* Add Time column */}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.event_id}>
                            <td>{event.event_name}</td>
                            <td>{event.event_type}</td>
                            <td>{event.capacity}</td>
                            <td>{event.pool_name}</td>
                            <td>{event.session_time}</td> {/* Map session_time */}
                            <td>
                                <button onClick={() => handleAttend(event.event_id)}>
                                    Attend
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EventList;
