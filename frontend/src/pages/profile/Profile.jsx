import React, { useState } from "react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Modal from "../../components/common/Modal/Modal";
import { useAuth } from "../../context/AuthContext";
import "./profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const timeSlots = Array.from({ length: 15 }, (_, i) => `${i + 8}:00`);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="header-info">
          <h1>My Profile</h1>
          <p className="user-name">{user?.name}</p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="profile-grid">
        <div className="profile-card">
          <h2>Membership Status</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Status</span>
              <span className="value status-active">Active</span>
            </div>
            <div className="info-item">
              <span className="label">Active Until</span>
              <span className="value">December 31, 2024</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2>Account Details</h2>
          <form className="account-form">
            <div className="form-group">
              <Input
                label="Email Address"
                type="email"
                value="user@example.com"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <Input
                label="Full Name"
                type="text"
                value="John Doe"
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <Input
                label="Phone Number"
                type="tel"
                value="+1 234 567 8900"
                placeholder="Enter your phone number"
              />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </div>

        <div className="profile-card">
          <h2>Availability Schedule</h2>
          <Button onClick={() => setIsScheduleModalOpen(true)}>
            Update Schedule
          </Button>
        </div>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Update Availability Schedule"
      >
        <div className="schedule-grid-container">
          <div className="schedule-grid">
            <div className="time-labels">
              {timeSlots.map((time) => (
                <div key={time} className="time-slot">
                  {time}
                </div>
              ))}
            </div>
            {daysOfWeek.map((day) => (
              <div key={day} className="day-column">
                <div className="day-header">{day}</div>
                {timeSlots.map((time) => (
                  <div
                    key={`${day}-${time}`}
                    className="schedule-cell"
                    role="checkbox"
                    tabIndex={0}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="modal-actions">
            <Button onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button>Save Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
