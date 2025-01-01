import React, { useState, useEffect } from "react";
import ReportService from "../../services/report.service";

const SystemReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const adminId = 40; // Replace with the actual admin ID

  useEffect(() => {
    // Fetch reports when the component mounts
    fetchReports();
  }, []);

  const fetchReports = async () => {
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
      setLoading(true);
      const reportData = {
        administrator_id: adminId,
        report_id: Math.floor(Math.random() * 100000), // Example: Generate a random report ID
        date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      };
      const message = await ReportService.generateReport(reportData);
      alert(message);
      fetchReports(); // Refresh the reports table after generating a new report
    } catch (err) {
      setError("Failed to generate the report. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <th>Daily Peak Hours</th>
            <th>Avg Cancellation Rate</th>
            <th>Daily Revenue</th>
            <th>Total Swimmer Count</th>
            <th>Total Member Count</th>
            <th>Daily Self Training Count</th>
            <th>Daily Training Count</th>
            <th>Daily Class Count</th>
            <th>Avg Event Attendance Rate</th>
          </tr>
        </thead>
        <tbody>
  {reports.length > 0 ? (
    reports.map((report) => (
      <tr key={report.report_id}>
        <td>{report.report_id}</td>
        <td>{report.date}</td>
        <td>{report.daily_peak_hours}</td>
        <td>{Number(report.avg_cancellation_rate || 0).toFixed(2)}</td>
        <td>{Number(report.daily_revenue || 0).toFixed(2)}</td>
        <td>{report.total_swimmer_count}</td>
        <td>{report.total_member_count}</td>
        <td>{report.daily_self_training_count}</td>
        <td>{report.daily_training_count}</td>
        <td>{report.daily_class_count}</td>
        <td>{Number(report.avg_event_attendance_rate || 0).toFixed(2)}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="12">No reports available.</td>
    </tr>
  )}
</tbody>

      </table>
      <button onClick={generateReport} disabled={loading} style={{ padding: "30px 50px", marginBottom: "20px" }}>
        {loading ? "Generating..." : "Generate Today's Report"}
      </button>
    </div>
  );
};

export default SystemReport;
