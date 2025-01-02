import React, { useState, useEffect } from "react";
import { fetchReadyClasses, cancelClass } from "../../services/class.service";
import Table from "../../components/common/Table/Table";
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
        session_time: cls.session_time,
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
    } catch (error) {
      setErrorMessage("Failed to cancel class.");
    }
  };

  const columns = [
    { header: "Class Name", accessor: "class_name" },
    { header: "Coach", accessor: "coach_name" },
    { header: "Pool", accessor: "pool_name" },
    { header: "Date", accessor: "session_date" },
    { header: "Time", accessor: "session_time" },
    { header: "Capacity", accessor: "capacity" },
    { header: "Price", accessor: "price" },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <Button onClick={() => handleCancelClass(row.class_id)}>Cancel</Button>
      ),
    },
  ];

  return (
    <div className="cancel-class-container">
      <h2>Cancel Classes</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <Table columns={columns} data={classes} />
    </div>
  );
};

export default CancelClass;
