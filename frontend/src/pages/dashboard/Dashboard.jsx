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
      </div>

      {/* Features Grid */}
      <div className="dashboard-grid">
        {/* Activities Card */}
        <div className="dashboard-card">
          <h2>My Activities</h2>
          <div className="feature-description">
            <p>
              Track and manage your swimming activities, classes, and events.
              View your schedule and progress.
            </p>
          </div>
        </div>

        {/* Training Card */}
        <div className="dashboard-card">
          <h2>Training</h2>
          <div className="feature-description">
            <p>
              Access your training programs, workout schedules, and swimming
              techniques.
            </p>
          </div>
        </div>

        {/* Classes Card */}
        <div className="dashboard-card">
          <h2>Swimming Classes</h2>
          <div className="feature-description">
            <p>
              Browse and enroll in swimming classes.{" "}
              {user?.user_type === "coach" &&
                "As a coach, you can also create and manage classes."}
            </p>
          </div>
        </div>

        {/* Events Card */}
        <div className="dashboard-card">
          <h2>Events</h2>
          <div className="feature-description">
            <p>
              Participate in swimming events and competitions.{" "}
              {user?.user_type === "manager" &&
                "Managers can create and organize events."}
            </p>
          </div>
        </div>

        {/* Membership Card */}
        <div className="dashboard-card">
          <h2>Membership</h2>
          <div className="feature-description">
            <p>Explore membership benefits and join our swimming community.</p>
          </div>
        </div>

        {/* Evaluation Card */}
        <div className="dashboard-card">
          <h2>Evaluations</h2>
          <div className="feature-description">
            <p>
              Provide and view feedback for coaches and classes to help improve
              our services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
