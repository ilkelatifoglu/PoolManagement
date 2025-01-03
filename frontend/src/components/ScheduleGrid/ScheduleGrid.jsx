import React from "react";
import "./ScheduleGrid.css";

const ScheduleGrid = ({ schedule, readOnly }) => {
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

  return (
    <div className="schedule-grid">
      <div className="time-labels">
        <div className="empty-header"></div>
        {timeSlots.map((time) => (
          <div key={time} className="time-slot">
            {time}
          </div>
        ))}
      </div>
      <div className="days-container" style={{ display: "flex", flex: 1 }}>
        {daysOfWeek.map((day) => (
          <div key={day} className="day-column">
            <div className="day-header">{day}</div>
            {timeSlots.map((time) => (
              <div
                key={`${day}-${time}`}
                className={`schedule-cell ${
                  schedule[day]?.[time] ? "selected" : ""
                }`}
                role={readOnly ? "presentation" : "checkbox"}
                aria-checked={schedule[day]?.[time]}
                tabIndex={readOnly ? -1 : 0}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleGrid;
