import React, { useEffect, useState } from "react";
import ActivityService from "../../services/activity.service"; // Import ActivityService
import { useAuth } from "../../context/AuthContext";
import "./my_activities.css";

const MyActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buttonLoading, setButtonLoading] = useState({}); // Track cancel button loading state

  // Fetch activities based on user type
  const fetchActivities = async () => {
    if (!user || !user.user_type) {
      setError("User role is missing. Please try logging in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const endpoint =
        user.user_type === "swimmer"
          ? "/activities/swimmer"
          : "/activities/coach";

      console.log("Fetching activities from:", endpoint);

      const response = await ActivityService.getActivities(endpoint);
      console.log("Activities fetched successfully:", response);
      setActivities(response || []);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to load activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  // Handle cancel activity
  const handleCancelActivity = async (activityId) => {
    setButtonLoading((prev) => ({ ...prev, [activityId]: true })); // Set button loading
    try {
      console.log(activityId);
      const response = await ActivityService.cancelActivity(activityId);
      alert(response.message || "Activity canceled successfully!");
      fetchActivities(); // Refresh activities after cancellation
    } catch (error) {
      console.error("Failed to cancel activity:", error);
      alert("Failed to cancel activity.");
    } finally {
      setButtonLoading((prev) => ({ ...prev, [activityId]: false })); // Reset button loading
    }
  };

  const handleWithdrawClass = async (classId) => {
    setButtonLoading((prev) => ({ ...prev, [classId]: true }));
    try {
      // Use the user's ID from the auth context
      const response = await ActivityService.withdrawClass(user.user_id, classId);
      alert(response.message || "Class withdrawn successfully!");
      fetchActivities();
    } catch (error) {
      console.error("Failed to withdraw class:", error);
      alert("Failed to withdraw class.");
    } finally {
      setButtonLoading((prev) => ({ ...prev, [classId]: false }));
    }
  };

  const handleCancelClass = async (classId) => {
    setButtonLoading((prev) => ({ ...prev, [classId]: true }));
    try {
      const response = await ActivityService.cancelClass(classId);
      alert(response.message || "Class canceled successfully!");
      fetchActivities();
    } catch (error) {
      console.error("Failed to cancel class:", error);
      alert("Failed to cancel class.");
    } finally {
      setButtonLoading((prev) => ({ ...prev, [classId]: false }));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
          {user.user_type === "swimmer" ? (
            <p>
              <strong>Instructor:</strong> <a href="#">{activity.instructor_name}</a>
            </p>
          ) : user.user_type === "coach" ? (
            <p>
              <strong>Participant:</strong> {activity.participant_count || 0}
            </p>
          ) : null}

              {/* Display cancel button only for active activities */}
              {activity.status === "READY" &&
                (activity.activity_name === "Self-Training" || activity.activity_name === "Training") && (
                  <button
                    onClick={() => handleCancelActivity(activity.activity_id)}
                    className="cancel-button"
                    disabled={buttonLoading[activity.activity_id]} // Disable while loading
                  >
                    {buttonLoading[activity.activity_id] ? "Canceling..." : "Cancel"}
                  </button>
                )}
              {(activity.activity_name !== "Self-Training" && activity.activity_name !== "Training") && activity.status === "READY" && (
                user.user_type === "swimmer" ? (
                  <button
                    onClick={() => handleWithdrawClass(activity.activity_id)}
                    className="cancel-button"
                    disabled={buttonLoading[activity.activity_id]} // Disable while loading
                  >
                    {buttonLoading[activity.activity_id] ? "Withdrawing..." : "Withdraw"}
                  </button>
                ) : user.user_type === "coach" ? (
                  <button
                    onClick={() => handleCancelClass(activity.activity_id)}
                    className="cancel-button"
                    disabled={buttonLoading[activity.activity_id]}
                  >
                    {buttonLoading[activity.activity_id] ? "Canceling..." : "Cancel"}
                  </button>
                ) : null
              )}
              {/* Optionally display a badge for cancelled activities */}
              {activity.status === "CANCELLED" && (
                <p style={{ color: "red", fontWeight: "bold" }}>CANCELLED</p>
              )}
              {activity.status === "DONE" && (
                <p style={{ color: "green", fontWeight: "bold" }}>DONE</p>
              )}
            </li>
          ))}
        </ul>

      )}
    </div>
  );
};

export default MyActivities;
