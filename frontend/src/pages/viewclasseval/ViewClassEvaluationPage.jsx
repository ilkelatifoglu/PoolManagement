import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import Button from "../../components/common/Button/Button";
import { evaluationService } from "../../services/evaluation.service";
import "./viewclassevaluationpage.css";

Modal.setAppElement("#root");

const ViewClassEvaluationsPage = () => {
  const { coachId } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState("");

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const data = await evaluationService.getClassEvaluations(coachId);
        setEvaluations(data);
      } catch (error) {
        console.error("Error fetching class evaluations:", error);
      }
    };

    fetchEvaluations();
  }, [coachId]);

  const openModal = (comment) => {
    setCurrentComment(comment || "No comment available.");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentComment("");
  };

  return (
    <div className="view-class-evaluations-page">
        <h1 className="class-evaluation-title">Class Evaluations for Coach</h1>
        <table className="evaluation-table">
        <thead>
          <tr>
            <th>Coach Name</th>
            <th>Class Name</th>
            <th>Session Date</th>
            <th>Pool Name</th>
            <th>Rating</th>
            <th>Average Rating</th>
            <th>Evaluation Date</th>
            <th>View Comments</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evalItem, index) => (
            <tr key={index}>
              <td>{evalItem.CoachName}</td>
              <td>{evalItem.ClassName}</td>
              <td>{evalItem.SessionDate}</td>
              <td>{evalItem.PoolName}</td>
              <td>{evalItem.Rating}</td>
              <td>{(Number(evalItem.AverageRating) || 0).toFixed(2)}</td>
              <td>{evalItem.EvaluationDate}</td>
              <td>
                <Button onClick={() => openModal(evalItem.Comment)}>
                  View Comment
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Evaluation Comment</h2>
        <p>{currentComment}</p>
        <button className="modal-close-button" onClick={closeModal}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ViewClassEvaluationsPage;
