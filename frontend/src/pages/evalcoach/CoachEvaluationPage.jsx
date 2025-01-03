import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import Button from "../../components/common/Button/Button";
import { evaluationService } from "../../services/evaluation.service";
import "./coachevaluationpage.css";

Modal.setAppElement("#root");

const CoachEvaluationsPage = () => {
  const { coachId } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [poolFilter, setPoolFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState("");

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const data = await evaluationService.getCoachEvaluations(coachId);
        setEvaluations(data);
        setFilteredEvaluations(data);
      } catch (error) {
        console.error("Error fetching evaluations:", error);
      }
    };

    fetchEvaluations();
  }, [coachId]);

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setPoolFilter(value);
    setFilteredEvaluations(
      evaluations.filter((evalItem) =>
        evalItem.PoolName.toLowerCase().includes(value)
      )
    );
  };

  const openModal = (comment) => {
    setCurrentComment(comment || "No comment available.");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentComment("");
  };

  return (
    <div className="coach-evaluations-page">
      <h1 className="coach-evaluation-title">Evaluations for Coach</h1>

      <div className="filter-container">
        <label htmlFor="pool-filter" className="filter-label">
          Filter by Pool Name:
        </label>
        <input
          id="pool-filter"
          type="text"
          value={poolFilter}
          onChange={handleFilterChange}
          placeholder="Enter pool name"
          className="filter-input"
          style={{ width: "35%", marginBottom: "20px" }}
        />
      </div>

      <table className="evaluation-table">
        <thead>
          <tr>
            <th>Coach Name</th>
            <th>Session Date</th>
            <th>Pool Name</th>
            <th>Rating</th>
            <th>Average Rating</th>
            <th>Evaluation Date</th>
            <th>View Comments</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvaluations.map((evalItem, index) => (
            <tr key={index}>
              <td>{evalItem.CoachName}</td>
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

      {/* Modal Popup */}
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

export default CoachEvaluationsPage;
