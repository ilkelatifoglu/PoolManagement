import React, { useState, useEffect } from "react";
import { evaluationService } from "../../services/evaluation.service";
import Button from "../../components/common/Button/Button";
import "./evaluationpage.css";

const EvaluationPage = () => {
  const [evaluationItems, setEvaluationItems] = useState([]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const items = await evaluationService.getEvaluations();
        setEvaluationItems(items);
      } catch (error) {
        console.error("Error fetching evaluations:", error);
      }
    };

    fetchEvaluations();
  }, []);

  const handleEvaluate = (bookingId) => {
    console.log(`Evaluating item with BookingID: ${bookingId}`);
    // Navigate to an evaluation form or open a modal here
  };

  return (
    <div className="evaluation-page-container">
      <h1 className="evaluation-header">Evaluations</h1>
      <table className="evaluation-page-table">
        <thead>
          <tr>
            <th>Reservation</th>
            <th>Coach</th>
            <th>Date</th>
            <th>Time</th>
            <th>Pool</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {evaluationItems.map((item) => (
            <tr key={item.BookingID}>
              <td>{item.Reservation}</td>
              <td>{item.Coach}</td>
              <td>{item.Date}</td>
              <td>{item.Time}</td>
              <td>{item.Pool}</td>
              <td>${item.Price}</td>
              <td>
                <Button onClick={() => handleEvaluate(item.BookingID)}>
                  Evaluate
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EvaluationPage;
