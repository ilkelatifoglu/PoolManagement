import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { evaluationService } from "../../services/evaluation.service";
import Button from "../../components/common/Button/Button";
import "react-toastify/dist/ReactToastify.css";
import "./evaluationpage.css";

const EvaluationPage = () => {
  const [evaluationItems, setEvaluationItems] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState({});
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const items = await evaluationService.getEvaluations();
        console.log("Fetched evaluation items:", items); // Debugging
        setEvaluationItems(items);
      } catch (error) {
        console.error("Error fetching evaluations:", error);
      }
    };

    fetchEvaluations();
  }, []);

  const handleEvaluate = (item, target) => {
    setCurrentEvaluation(item);
    setComment("");
    setRating(null);
    if (target === "coach") {
      setIsPopupVisible("coach");
    } else if (target === "class") {
      setIsPopupVisible("class");
    }
  };

  const handleConfirm = async () => {
    if (isConfirmed) {
      const { Reservation, CoachID, ClassID } = currentEvaluation;

      const evaluationData = {
        coach_id: isPopupVisible === "coach" ? CoachID : null,
        class_id: ClassID, // Always pass class_id for class reservations
        rating: rating || null,
        comment: comment || "",
        Reservation,
        evaluate_coach: isPopupVisible === "coach", // Indicates if it's a coach evaluation
        BookingId: currentEvaluation.BookingID,
      };

      console.log("Submitting evaluation data:", evaluationData);

      try {
        await evaluationService.submitEvaluation(evaluationData);

        // Update local state
        setEvaluationItems((prevItems) =>
          prevItems.map((item) =>
            item.BookingID === currentEvaluation.BookingID
              ? {
                  ...item,
                  is_evaluated_coach:
                    isPopupVisible === "coach"
                      ? true
                      : item.is_evaluated_coach,
                  is_evaluated_class:
                    isPopupVisible === "class"
                      ? true
                      : item.is_evaluated_class,
                }
              : item
          )
        );
        toast.success("Evaluation received successfully!");

      } catch (error) {
        console.error("Error submitting evaluation:", error);
        toast.error("Evaluation received successfully!");
      }

      setRating(null);
      setComment("");
      setIsConfirmed(false);
      setIsPopupVisible(false);
    }
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evaluationItems.map((item) => (
            <tr key={`evaluation-${item.BookingID}`}>
              <td>{item.Reservation}</td>
              <td>{item.Coach}</td>
              <td>{item.Date}</td>
              <td>{item.Time}</td>
              <td>{item.Pool}</td>
              <td>${item.Price}</td>
              <td>
                {/* Show Evaluate Coach Button */}
                {!item.is_evaluated_coach && (
                  <Button onClick={() => handleEvaluate(item, "coach")}>
                    Evaluate Coach
                  </Button>
                )}

                {/* Show Evaluate Class Button only for Class reservations */}
                {item.Reservation === "Class" && !item.is_evaluated_class && (
                  <Button onClick={() => handleEvaluate(item, "class")}>
                    Evaluate Class
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPopupVisible && (
        <div className="popup-container">
          <button
            className="close-button"
            onClick={() => setIsPopupVisible(false)}
          >
            ×
          </button>
          <h2>
            Evaluate Your{" "}
            {isPopupVisible === "coach" ? "Coach" : "Class"}
          </h2>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={`rating-${num}`}>
                <input
                  type="radio"
                  value={num}
                  checked={rating === num}
                  onChange={() => setRating(num)}
                />
                {num}
              </label>
            ))}
          </div>
          <div>
            <label>
              Comment on Your{" "}
              {isPopupVisible === "coach" ? "Coach" : "Class"}:
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={() => setIsConfirmed(!isConfirmed)}
            />
            <label>Submit Your Evaluation</label>
          </div>
          <button onClick={handleConfirm} disabled={!isConfirmed}>
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default EvaluationPage;
