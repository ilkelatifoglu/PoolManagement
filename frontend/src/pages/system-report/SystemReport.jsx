import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ReportService from "../../services/report.service";

const SystemReport = () => {
  const { user } = useAuth(); // Access the logged-in user's information
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null); // To store the selected report for the popup

  useEffect(() => {
    if (user && user.user_id) {
      fetchReports(user.user_id); // Fetch reports when the component mounts
    }
  }, [user]);

  const fetchReports = async (adminId) => {
    try {
      setLoading(true);
      const fetchedReports = await ReportService.getReports(adminId);
      setReports(fetchedReports);
      setError("");
    } catch (err) {
      setError("Failed to fetch reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      if (!user || !user.user_id) {
        setError("Unable to generate report. User ID is missing.");
        return;
      }
  
      const now = new Date();
      const reportData = {
        administrator_id: user.user_id, // Use the logged-in user's ID
        date: now.toISOString().split("T")[0] + " " + now.toTimeString().split(" ")[0], // Current date and time
      };
  
      setLoading(true);
      const message = await ReportService.generateReport(reportData);
      alert(message);
      fetchReports(user.user_id); // Refresh the reports table after generating a new report
    } catch (err) {
      setError("Failed to generate the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showDetails = (report) => {
    setSelectedReport(report); // Show the popup with report details
  };

  const deleteReport = async (reportId) => {
    console.log(reportId);
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this report?");
      if (!confirmDelete) return;

      setLoading(true);
      await ReportService.deleteReport(reportId); // Call the service to delete the report
      alert("Report deleted successfully.");
      setReports(reports.filter((report) => report.report_id !== reportId)); // Remove the report from the list
    } catch (err) {
      alert("Failed to delete the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setSelectedReport(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>System Reports</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report.report_id}>
                <td>{report.report_id}</td>
                <td>{report.date}</td>
                <td>
                  <button
                    onClick={() => showDetails(report)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "#007bff",
                      marginRight: "10px",
                    }}
                  >
                    🛈 {/* Icon for details */}
                  </button>
                  <button
                    onClick={() => deleteReport(report.report_id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "#dc3545", // Red color for delete button
                    }}
                  >
                    ❌ {/* Icon for delete */}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No reports available.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={generateReport}
        disabled={loading}
        style={{ padding: "30px 50px", marginBottom: "20px", marginTop: "20px" }}
      >
        {loading ? "Generating..." : "Generate Today's Report"}
      </button>

      {/* Popup for displaying details */}
      {selectedReport && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            borderRadius: "8px",
          }}
        >
          <h2>Report Details</h2>
          <p><strong>Report ID:</strong> {selectedReport.report_id}</p>
          <p><strong>Date:</strong> {selectedReport.date}</p>
          <p><strong>Daily Peak Hours:</strong> {selectedReport.daily_peak_hours}</p>
          <p><strong>Avg Cancellation Rate:</strong> {Number(selectedReport.avg_cancellation_rate || 0).toFixed(2)}</p>
          <p><strong>Daily Revenue:</strong> {Number(selectedReport.daily_revenue || 0).toFixed(2)}</p>
          <p><strong>Total Swimmer Count:</strong> {selectedReport.total_swimmer_count}</p>
          <p><strong>Total Member Count:</strong> {selectedReport.total_member_count}</p>
          <p><strong>Daily Self Training Count:</strong> {selectedReport.daily_self_training_count}</p>
          <p><strong>Daily Training Count:</strong> {selectedReport.daily_training_count}</p>
          <p><strong>Daily Class Count:</strong> {selectedReport.daily_class_count}</p>
          <p><strong>Avg Event Attendance Rate:</strong> {Number(selectedReport.avg_event_attendance_rate || 0).toFixed(2)}</p>
          <button
            onClick={closePopup}
            style={{
              padding: "10px 20px",
              marginTop: "20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
      {/* Overlay for the popup */}
      {selectedReport && (
        <div
          onClick={closePopup}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )}
    </div>
  );
};

export default SystemReport;
