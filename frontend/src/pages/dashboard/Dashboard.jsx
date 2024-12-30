import { useAuth } from "../../context/AuthContext";
import "./dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-info">
          <h1>{getGreeting()}</h1>
          <p className="user-name">{user?.name}</p>
        </div>
        <span className="role-badge">{user?.role}</span>
      </div>

      {/* Cards Grid */}
      <div className="dashboard-grid">
        {/* User Info Card */}
        <div className="dashboard-card">
          <h2>Summary</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Balance</span>
              <span className="value">$50.00</span>
            </div>
            <div className="info-item">
              <span className="label">Phone</span>
              <span className="value">{user?.phone_number}</span>
            </div>
            {user?.role === "swimmer" && (
              <div className="info-item">
                <span className="label">Swim Level</span>
                <span className="value">Intermediate</span>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Card (replacing Quick Actions) */}
        <div className="dashboard-card">
          <h2>Notifications</h2>
          <div className="notifications-list">
            <p className="empty-state">No new notifications</p>
          </div>
        </div>

        {/* Upcoming Schedule Card */}
        <div className="dashboard-card">
          <h2>Upcoming Sessions</h2>
          <div className="sessions-list">
            <p className="empty-state">No upcoming sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
