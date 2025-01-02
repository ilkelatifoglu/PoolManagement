import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Modal from "../../components/common/Modal/Modal";
import { useAuth } from "../../context/AuthContext";
import "./profile.css";
import UserService from "../../services/user.service";

const Profile = () => {
  const { user } = useAuth();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCells, setSelectedCells] = useState({});
  const [currentSchedule, setCurrentSchedule] = useState({});

  const timeSlots = Array.from(
    { length: 15 },
    (_, i) => `${String(i + 8).padStart(2, "0")}:00`
  );
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Function to load the current schedule
  const loadSchedule = async () => {
    try {
      const scheduleData = await UserService.getSchedule();

      // Initialize an empty schedule
      const transformedData = {};
      daysOfWeek.forEach((day) => {
        transformedData[day] = {};
        timeSlots.forEach((time) => {
          transformedData[day][time] = false;
        });
      });

      // Fill in the existing schedule data
      if (scheduleData) {
        Object.entries(scheduleData).forEach(([day, times]) => {
          Object.entries(times).forEach(([time, value]) => {
            // Handle both "8:00:00:00" and "08:00:00:00" formats
            const hour = time.split(":")[0];
            const paddedTime = `${hour.padStart(2, "0")}:00`;
            transformedData[day][paddedTime] = value === 1;
          });
        });
      }

      setCurrentSchedule(transformedData);
    } catch (error) {
      console.error("Failed to load schedule:", error);
    }
  };

  // Handle view modal open
  const handleViewScheduleClick = async () => {
    await loadSchedule();
    setIsViewModalOpen(true);
  };

  // Handle update modal open
  const handleUpdateScheduleClick = () => {
    // Start with an empty schedule for updates
    const emptySchedule = {};
    daysOfWeek.forEach((day) => {
      emptySchedule[day] = {};
      timeSlots.forEach((time) => {
        emptySchedule[day][time] = false;
      });
    });
    setSelectedCells(emptySchedule);
    setIsScheduleModalOpen(true);
  };

  const toggleCell = (day, time) => {
    setSelectedCells((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: !prev[day]?.[time],
      },
    }));
  };

  const saveSchedule = async () => {
    try {
      const transformedData = {};
      Object.entries(selectedCells).forEach(([day, times]) => {
        transformedData[day] = {};
        Object.entries(times).forEach(([time, value]) => {
          if (value) {
            transformedData[day][`${time}:00:00`] = 1;
          }
        });
      });

      await UserService.updateSchedule(transformedData);
      setIsScheduleModalOpen(false);
      // Reload the schedule after saving
      await loadSchedule();
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

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
          <div className="button-group">
            <Button onClick={handleViewScheduleClick}>View Schedule</Button>
            <Button onClick={handleUpdateScheduleClick}>Update Schedule</Button>
          </div>
        </div>
      </div>

      {/* View Schedule Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Current Availability Schedule"
      >
        <div className="schedule-grid-container">
          <div className="schedule-grid">
            <div className="time-labels">
              <div className="time-slot empty-header"></div>
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
                    className={`schedule-cell ${
                      currentSchedule[day]?.[time] ? "selected" : ""
                    }`}
                    role="presentation"
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="modal-actions">
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Update Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Update Availability Schedule"
      >
        <div className="schedule-grid-container">
          <div className="schedule-grid">
            <div className="time-labels">
              <div className="time-slot empty-header"></div>
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
                    className={`schedule-cell ${
                      selectedCells[day]?.[time] ? "selected" : ""
                    }`}
                    onClick={() => toggleCell(day, time)}
                    role="checkbox"
                    aria-checked={selectedCells[day]?.[time]}
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
            <Button onClick={saveSchedule}>Save Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
