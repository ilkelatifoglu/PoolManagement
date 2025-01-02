import React, { useState, useEffect } from "react";
import { fetchReadyClasses, cancelClass } from "../../services/class.service";
import Button from "../../components/common/Button/Button";
import "./CancelClass.css";

const CancelClass = () => {
  const [classes, setClasses] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await fetchReadyClasses();
      const formattedClasses = response.map((cls) => ({
        ...cls,
        session_date: new Date(cls.session_date).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      }));
      setClasses(formattedClasses);
    } catch (error) {
      setErrorMessage("Failed to fetch classes.");
    }
  };

  const handleCancelClass = async (classId) => {
    try {
      await cancelClass({ class_id: classId });
      setSuccessMessage("Class cancelled successfully.");
      setClasses(classes.filter((cls) => cls.class_id !== classId));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to cancel class.");
    }
  };

  return (
    <div className="cancel-class-container">
      <h2 className="cancel-class-title">Cancel Classes</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="table-wrapper">
        <table className="cancel-class-table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Coach</th>
              <th>Pool</th>
              <th>Date</th>
              <th>Time</th>
              <th>Capacity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.length > 0 ? (
              classes.map((cls) => (
                <tr key={cls.class_id}>
                  <td>{cls.class_name}</td>
                  <td>{cls.coach_name}</td>
                  <td>{cls.pool_name}</td>
                  <td>{cls.session_date}</td>
                  <td>{cls.session_time}</td>
                  <td>{cls.capacity}</td>
                  <td>${cls.price}</td>
                  <td>
                    <Button
                      className="cancel-button"
                      onClick={() => handleCancelClass(cls.class_id)}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-classes-message">
                  No classes available to cancel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CancelClass;
