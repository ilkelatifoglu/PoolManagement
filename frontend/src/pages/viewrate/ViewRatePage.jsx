
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Button from "../../components/common/Button/Button";
import "./viewratepage.css";
import { evaluationService } from "../../services/evaluation.service";

const ViewRatePage = () => {
  const [coaches, setCoaches] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchCoachRatings = async () => {
      try {
        const ratings = await evaluationService.getCoachAverageRatings();
        console.log("Fetched Ratings:", ratings); // Debug: Inspect the response
        setCoaches(ratings);
      } catch (error) {
        console.error("Error fetching coach ratings:", error);
      }
    };

    fetchCoachRatings();
  }, []);

  return (
    <div className="viewrate-page">
      <h1 className="coach-rating-title">Coach Ratings</h1>
      <table className="viewrate-table">
        <thead>
          <tr>
            <th>Coach Name</th>
            <th>Average Rating</th>
            <th>View Comments</th>
          </tr>
        </thead>
        <tbody>
          {coaches.map((coach) => (
            <tr key={coach.CoachId}>
              <td>{coach.CoachName}</td>
              <td>{(Number(coach.AverageRating) || 0).toFixed(2)}</td>
              <td>
                <div className="action-buttons">
                  <Button onClick={() => navigate(`/coach-evaluations/${coach.CoachId}`)}>
                    View Coach Evaluations
                  </Button>
                  <Button onClick={() => navigate(`/class-evaluations/${coach.CoachId}`)}>
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
