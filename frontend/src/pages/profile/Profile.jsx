import React, { useState, useEffect } from "react";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Modal from "../../components/common/Modal/Modal";
import { useAuth } from "../../context/AuthContext";
import UserService from "../../services/user.service";
import "./profile.css";
import ScheduleGrid from "../../components/ScheduleGrid/ScheduleGrid";

const Profile = () => {
  const { user } = useAuth();
  const userRole =
    localStorage.getItem("role").charAt(0).toUpperCase() +
    localStorage.getItem("role").slice(1); // Get role from localStorage with first letter uppercase
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCells, setSelectedCells] = useState({});
  const [currentSchedule, setCurrentSchedule] = useState({});
  const [profileData, setProfileData] = useState({
    email: "",
    name: "",
    phone_number: "",
    birth_date: "",
    blood_type: "",
    gender: "",
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [memberships, setMemberships] = useState([]);

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

  // Load profile data
  const loadProfile = async () => {
    try {
      const data = await UserService.getProfile();
      setProfileData({
        email: data.email || "",
        name: data.name || "",
        phone_number: data.phone_number || "",
        birth_date: data.birth_date || "",
        blood_type: data.blood_type || "",
        gender: data.gender || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      setError("Failed to load profile data");
    }
  };

  // Handle profile updates
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      await UserService.updateProfile(profileData);
      setSuccessMessage("Profile updated successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      await UserService.updatePassword(passwordData);
      setSuccessMessage("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordModalOpen(false);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(
        "Failed to update password. Please check your current password."
      );
    }
  };

  // Add this new function to load memberships
  const loadMemberships = async () => {
    try {
      const response = await UserService.getSwimmerMemberships(user.user_id);
      console.log("Memberships data:", response);
      // Access the nested memberships array
      setMemberships(response.memberships || []);
    } catch (error) {
      console.error("Failed to load memberships:", error);
      setMemberships([]);
    }
  };

  // Load schedule on component mount
  useEffect(() => {
    loadSchedule();
    loadProfile();
    loadMemberships();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="header-info">
          <h1>My Profile</h1>
          <p className="user-name">{user?.name}</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h2>User Status</h2>
          <div className="info-list">
            <div className="info-item">
              <span>Role</span>
              <span className="value status-active">{userRole}</span>
            </div>
            {memberships.map((membership, index) => (
              <div key={index} className="info-item">
                <span>Membership - {membership.name}</span>
                <span className="value status-active">
                  Expires: {new Date(membership.end_date).toLocaleDateString()}
                </span>
              </div>
            ))}
            <div className="info-item">
              <span>Status</span>
              <span className="value status-active">Active</span>
            </div>
            <div className="info-item">
              <span>Birth Date</span>
              <span className="value">
                {new Date(profileData.birth_date).toLocaleDateString()}
              </span>
            </div>
            <div className="info-item">
              <span>Blood Type</span>
              <span className="value">{profileData.blood_type}</span>
            </div>
            <div className="info-item">
              <span>Gender</span>
              <span className="value">
                {profileData.gender === "M" ? "Male" : "Female"}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2>Account Details</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                disabled
              />
            </div>
            <div className="form-group">
              <Input
                label="Full Name"
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <Input
                label="Phone Number"
                type="tel"
                value={profileData.phone_number}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    phone_number: e.target.value,
                  }))
                }
              />
            </div>

            <div className="message-container">
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="button-group">
              <Button type="submit">Save Changes</Button>
              <Button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </form>
        </div>

        <div className="profile-card">
          <h2>Availability Schedule</h2>
          <div className="schedule-container">
            <ScheduleGrid schedule={currentSchedule} readOnly={true} />
          </div>
          <div className="button-group">
            <Button onClick={handleUpdateScheduleClick}>
              Upload a New Schedule
            </Button>
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

      {/* Password Change Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setError("");
        }}
        title="Change Password"
      >
        <form onSubmit={handlePasswordChange} className="password-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="form-group">
            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="form-group">
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="modal-actions">
            <Button type="button" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
