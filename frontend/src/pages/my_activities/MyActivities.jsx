import React, { useEffect, useState } from "react";
import axios from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./my_activities.css";

const MyActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("User in MyActivities:", user);
    if (!user || !user.user_type) {
      setError("User role is missing. Please try logging in again.");
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        setLoading(true);
        const endpoint =
          user.user_type === "swimmer"
            ? "/activities/swimmer"
            : "/activities/coach";

        console.log("Fetching activities from:", endpoint);

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Activities fetched successfully:", response.data);
        setActivities(response.data);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Failed to load activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="activities-container">
      <header className="activities-header">
        <h1>My Activities</h1>
        <p>Here is a list of your scheduled activities:</p>
      </header>
      {activities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        <ul className="activities-list">
          {activities.map((activity, index) => (
            <li key={index} className="activity-item">
              <h2>{activity.activity_name}</h2>
              <p>
                <strong>Date:</strong> {new Date(activity.activity_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {activity.start_time} - {activity.end_time}
              </p>
              <p>
                <strong>Location:</strong> {activity.pool_name}
              </p>
              <p>
                <strong>Instructor:</strong>{" "}
                <a href="#">{activity.instructor_name}</a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>

  );
};

export default MyActivities;
