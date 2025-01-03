import React, { useState, useEffect } from "react";
import LifeguardService from "../../services/lifeguard.service";
import ScheduleGrid from "../../components/ScheduleGrid/ScheduleGrid";
import "./lifeguardSchedules.css";

const LifeguardSchedules = () => {
  const [schedules, setSchedules] = useState({});
  const [lifeguards, setLifeguards] = useState([]);
  const [selectedLifeguard, setSelectedLifeguard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [schedulesData, lifeguardsData] = await Promise.all([
        LifeguardService.getAllSchedules(),
        LifeguardService.getAllLifeguards(),
      ]);

      setSchedules(schedulesData);
      setLifeguards(lifeguardsData);
      if (lifeguardsData.length > 0) {
        setSelectedLifeguard(lifeguardsData[0].user_id);
      }
    } catch (err) {
      setError("Failed to load lifeguard schedules");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="lifeguard-schedules-container">
      <h1>Lifeguard Schedules</h1>

      <div className="lifeguard-selector">
        <select
          value={selectedLifeguard || ""}
          onChange={(e) => setSelectedLifeguard(e.target.value)}
        >
          {lifeguards.map((guard) => (
            <option key={guard.user_id} value={guard.user_id}>
              {guard.name}
            </option>
          ))}
        </select>
      </div>

      {selectedLifeguard && schedules[selectedLifeguard] && (
        <div className="schedule-display">
          <h2>{schedules[selectedLifeguard].name}'s Schedule</h2>
          <ScheduleGrid
            schedule={schedules[selectedLifeguard].schedule}
            readOnly={true}
          />
        </div>
      )}

      <div className="lifeguard-info">
        <h3>Lifeguard Details</h3>
        {selectedLifeguard &&
          lifeguards.find((g) => g.user_id === parseInt(selectedLifeguard)) && (
            <div className="info-grid">
              {Object.entries(
                lifeguards.find(
                  (g) => g.user_id === parseInt(selectedLifeguard)
                )
              ).map(([key, value]) => (
                <div key={key} className="info-item">
                  <span className="label">
                    {key.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="value">
                    {key.includes("date")
                      ? new Date(value).toLocaleDateString()
                      : value}
                  </span>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default LifeguardSchedules;
