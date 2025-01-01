import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./my_activities.css";

const MyActivities = () => {
  const { role } = useParams(); // Get the role from the route (e.g., 'swimmer' or 'coach')
  const { user } = useAuth(); // Get user from AuthContext
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!role) {
      setError("Role not specified in the route.");
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        setLoading(true);
        const endpoint = `/activities/${role}`; // Use role from the route
        const response = await axios.get(endpoint);
        setActivities(response.data);
      } catch (err) {
        setError("Failed to load activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [role]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="activities-container">
      <h1>My Activities</h1>
      {activities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        <ul className="activities-list">
          {activities.map((activity, index) => (
            <li key={index} className="activity-item">
              <h2>{activity.activity_name}</h2>
              <p>
                Date: {new Date(activity.activity_date).toLocaleDateString()}{" "}
                {new Date(activity.start_time).toLocaleTimeString()} -{" "}
                {new Date(activity.end_time).toLocaleTimeString()}
              </p>
              <p>Location: {activity.pool_name}</p>
              {role === "swimmer" && <p>Instructor: {activity.instructor_name}</p>}
              {role === "coach" && <p>Participants: {activity.participant_count}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyActivities;
