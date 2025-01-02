import React, { useState, useEffect } from "react";
import {
  fetchSelfTrainings,
  fetchAvailableCoaches,
  fetchPoolsWithAvailableSessions,
  fetchSessionsWithAvailableLanes,
  fetchAvailableLanes,
  createSelfTraining,
  cancelTraining,
  cancelSelfTraining,
  signUpForTraining,
} from "../../services/training.service";
import Modal from "../../components/common/Modal/Modal";
import Button from "../../components/common/Button/Button";
import "./trainingPage.css";

const TrainingPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [selfTrainings, setSelfTrainings] = useState([]);
  const [pools, setPools] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [lanes, setLanes] = useState([]);
  const [selectedPool, setSelectedPool] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [availableCoaches, setAvailableCoaches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState(null);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [selfTrainingsData, poolsData, availableCoachesData] = await Promise.all([
          fetchSelfTrainings(),
          fetchPoolsWithAvailableSessions(),
          fetchAvailableCoaches(),
        ]);
        console.log("Fetched initial data:", { selfTrainingsData, poolsData , availableCoachesData });
        setSelfTrainings(selfTrainingsData);
        setPools(poolsData);
        setAvailableCoaches(availableCoachesData);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to fetch training data. Please try again.");
      }
    };
    fetchData();
  }, []);

  const handleSignUpForTraining = async (sessionId, poolId, laneNumber, goal, coachId) => {
    if (!goal) {
        setError("Please enter a goal.");
        return;
    }
    console.log("Payload:", { session_id: sessionId, pool_id: poolId, lane_number: laneNumber, goal, coach_id: coachId });
    try {
        const response = await signUpForTraining(sessionId, poolId, laneNumber, goal, coachId);
        console.log("Successfully signed up:", response);
        setAvailableCoaches((prev) =>
            prev.filter((coach) => coach.session_id !== sessionId || coach.pool_id !== poolId)
        );
        setIsSignUpModalOpen(false);
    } catch (err) {
        console.error("Error signing up for training:", err);
        setError("Failed to sign up for training. Please try again.");
    }
};    

  // Handle pool and session selection
  const handlePoolOrSessionChange = async (poolId, sessionId) => {
    try {
      if (poolId !== selectedPool) {
        setSelectedPool(poolId);
        setSelectedSession(""); // Reset session when pool changes
        setSessions([]);
        setLanes([]);
        if (poolId) {
          const availableSessions = await fetchSessionsWithAvailableLanes(poolId);
          setSessions(availableSessions);
        }
      } else if (sessionId !== selectedSession) {
        setSelectedSession(sessionId);
        setLanes([]);
        if (poolId && sessionId) {
          const availableLanes = await fetchAvailableLanes(poolId, sessionId);
          setLanes(availableLanes);
        }
      }
    } catch (err) {
      console.error("Error in handlePoolOrSessionChange:", err);
      setError("Failed to fetch available lanes or sessions.");
    }
  };

  // Handle creation of self-training
  const handleCreateSelfTraining = async (goal, poolId, sessionId, laneNumber) => {
    try {
      console.log("Payload for creating self-training:", { sessionId, poolId, laneNumber, goal });

      const response = await createSelfTraining(sessionId, poolId, laneNumber, goal);
      console.log("Self-training created:", response);
      setIsModalOpen(false);

      const selectedPoolData = pools.find((pool) => pool.pool_id === Number(poolId));
      const selectedSessionData = sessions.find(
        (session) => session.session_id === Number(sessionId)
      );

      setSelfTrainings((prev) => [
        ...prev,
        {
          goal,
          pool_name: selectedPoolData?.name || "Unknown Pool",
          date: selectedSessionData?.date || "Unknown Date",
          start_time: selectedSessionData?.start_time || "Unknown",
          end_time: selectedSessionData?.end_time || "Unknown",
        },
      ]);
    } catch (err) {
      console.error("Error in handleCreateSelfTraining:", err);
      setError("Failed to create self-training. Please try again.");
    }
  };

  // Handle cancel training for swimmers
  const handleCancelTraining = async (trainingId) => {
    try {
      await cancelTraining(trainingId);
      setTrainings((prev) =>
        prev.filter((training) => training.training_id !== trainingId)
      );
    } catch (err) {
      console.error("Error in handleCancelTraining:", err);
      setError("Failed to cancel training. Please try again.");
    }
  };

  // Handle cancel self-training
  const handleCancelSelfTraining = async (selfTrainingId) => {
    try {
      await cancelSelfTraining(selfTrainingId);
      setSelfTrainings((prev) =>
        prev.filter((selfTraining) => selfTraining.self_training_id !== selfTrainingId)
      );
    } catch (err) {
      console.error("Error in handleCancelSelfTraining:", err);
      setError("Failed to cancel self-training. Please try again.");
    }
  };

  const selfTrainingColumns = [
    { header: "Goal", accessor: "goal" },
    { header: "Date", accessor: "date" },
    { header: "Start Time", accessor: "start_time" },
    { header: "End Time", accessor: "end_time" },
    { header: "Pool", accessor: "pool_name" },
  ];

  return (
    <div className="training-page">
      <h1>Trainings</h1>
      {error && <p className="error">{error}</p>}

      <div className="table-container">
        <h2>Available Coaches</h2>
        <table className="training-page-table">
          <thead>
            <tr>
              <th>Coach Name</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {availableCoaches.map((coach) => (
                <tr key={`${coach.coach_id}-${coach.session_id}`}>
                <td>{coach.coach_name}</td>
                <td>{coach.specialization}</td>
                <td>{coach.date}</td>
                <td>{coach.start_time}</td>
                <td>{coach.end_time}</td>
                <td>
                <button
                    className="training-page-button"
                    onClick={() => {
                        setSelectedTrainingId(coach.coach_id); // Save the coach_id
                        setSelectedPool(coach.pool_id); // Automatically set pool
                        setSelectedSession(coach.session_id); // Automatically set session
                        fetchAvailableLanes(coach.pool_id, coach.session_id)
                            .then(setLanes)
                            .catch((err) => setError("Failed to fetch lanes."));
                        setIsSignUpModalOpen(true);
                    }}
                >
                    Sign Up
                </button>


                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>

      {/* Modal for Sign-Up */}
      <Modal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        title="Sign Up for Training"
        >
        <form
        onSubmit={(e) => {
            e.preventDefault();
            const laneNumber = e.target.lane.value;
            const goal = e.target.goal.value;
            handleSignUpForTraining(selectedSession, selectedPool, laneNumber, goal, selectedTrainingId);
            console.log("Selected pool:", selectedPool);
console.log("Selected session:", selectedSession);
console.log("Fetched lanes:", lanes);

        }}
        >
        <div className="form-field">
            <label>
            Goal:
            <input
                type="text"
                name="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Enter your goal"
                required
            />
            </label>
        </div>
        <div className="form-field">
            <label>
            Lane:
            <select name="lane" required>
                <option value="">Select Lane</option>
                {lanes.map((lane) => (
                <option key={lane.lane_number} value={lane.lane_number}>
                    Lane {lane.lane_number} ({lane.type})
                </option>
                ))}
            </select>
            </label>
        </div>
        <Button type="submit">Sign Up</Button>
        </form>
      </Modal>


      {/* Self-Trainings Section */}
      <div className="self-trainings-section">
        <div className="self-trainings-header">
          <h2>My Self-Trainings</h2>
          <Button onClick={() => setIsModalOpen(true)}>+ Add Self-Training</Button>
        </div>
        <table className="training-page-table">
          <thead>
            <tr>
              {selfTrainingColumns.map((col) => (
                <th key={col.header}>{col.header}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selfTrainings.map((selfTraining) => (
              <tr key={selfTraining.self_training_id}>
                {selfTrainingColumns.map((col) => (
                  <td key={col.accessor}>{selfTraining[col.accessor]}</td>
                ))}
                <td>
                  <button
                    className="training-page-button"
                    onClick={() =>
                      handleCancelSelfTraining(selfTraining.self_training_id)
                    }
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Self-Training */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Self-Training"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const goal = e.target.goal.value;
            const poolId = e.target.pool.value;
            const sessionId = e.target.session.value;
            const laneNumber = e.target.lane.value;
            handleCreateSelfTraining(goal, poolId, sessionId, laneNumber);
          }}
        >
          <div className="form-field">
            <label>
              Goal:
              <input type="text" name="goal" required />
            </label>
          </div>
          <div className="form-field">
            <label>
              Pool:
              <select
                name="pool"
                onChange={(e) =>
                  handlePoolOrSessionChange(e.target.value, selectedSession)
                }
                required
              >
                <option value="">Select Pool</option>
                {pools.map((pool) => (
                  <option key={pool.pool_id} value={pool.pool_id}>
                    {pool.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-field">
            <label>
              Session:
              <select
                name="session"
                onChange={(e) =>
                  handlePoolOrSessionChange(selectedPool, e.target.value)
                }
                required
              >
                <option value="">Select Session</option>
                {sessions.map((session) => (
                  <option key={session.session_id} value={session.session_id}>
                    {session.date} {session.start_time} - {session.end_time}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-field">
            <label>
              Lane:
              <select name="lane" required>
                <option value="">Select Lane</option>
                {lanes.map((lane) => (
                  <option key={lane.lane_number} value={lane.lane_number}>
                    Lane {lane.lane_number} ({lane.type})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Modal>
    </div>
  );
};

export default TrainingPage;
