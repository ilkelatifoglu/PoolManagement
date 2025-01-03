import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Button from "../../components/common/Button/Button";
import "./viewratepage.css";
import { evaluationService } from "../../services/evaluation.service";

const ViewRatePage = () => {
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchCoachRatings = async () => {
      try {
        const ratings = await evaluationService.getCoachAverageRatings();
        setCoaches(ratings);
        setFilteredCoaches(ratings);
      } catch (error) {
        console.error("Error fetching coach ratings:", error);
      }
    };

    fetchCoachRatings();
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    setFilteredCoaches(
      coaches.filter((coach) =>
        coach.CoachName.toLowerCase().includes(value)
      )
    );
  };

  return (
    <div className="viewrate-page">
      <h1 className="coach-rating-title">Coach Ratings</h1>

      <div className="filter-container">
        <label htmlFor="filter" className="filter-label">
          Filter by Coach Name:
        </label>
        <input
          id="filter"
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Enter coach name"
          className="filter-input"
          style={{ width: "35%", marginBottom: "20px" }}
        />
      </div>

      <table className="viewrate-table">
        <thead>
          <tr>
            <th>Coach Name</th>
            <th>Average Rating</th>
            <th>View Comments</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoaches.map((coach) => (
            <tr key={coach.CoachId}>
              <td>{coach.CoachName}</td>
              <td>{(Number(coach.AverageRating) || 0).toFixed(2)}</td>
              <td>
                <div className="action-buttons">
                  <Button
                    onClick={() => navigate(`/coach-evaluations/${coach.CoachId}`)}
                  >
                    View Coach Evaluations
                  </Button>
                  <Button
                    onClick={() => navigate(`/class-evaluations/${coach.CoachId}`)}
                  >
                    View Class Evaluations
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRatePage;
