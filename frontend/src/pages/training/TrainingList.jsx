import React, { useEffect, useState } from "react";
import { getTrainings, getSelfTrainings, addToCart } from "../../services/api";

const TrainingList = ({ user }) => {
  const [trainings, setTrainings] = useState([]);
  const [selfTrainings, setSelfTrainings] = useState([]);

  const fetchTrainings = async () => {
    try {
      const level = user.swim_level || 1; // Default to 1 if no swim_level
      const trainingResponse = await getTrainings(level);
      const selfTrainingResponse = await getSelfTrainings();
      setTrainings(trainingResponse.data);
      setSelfTrainings(selfTrainingResponse.data);
    } catch (err) {
      console.error("Error fetching trainings:", err);
    }
  };

  const handleAddToCart = async (type, id) => {
    try {
      await addToCart({ activity_type: type, activity_id: id, quantity: 1 });
      alert("Activity added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add activity to cart.");
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  return (
    <div>
      <h3>Available Trainings</h3>
      <ul>
        {trainings.map((training) => (
          <li key={training.id}>
            <h4>{training.name}</h4>
            <p>Date: {training.date}</p>
            <p>Time: {training.start_time} - {training.end_time}</p>
            <p>Pool: {training.pool_name}</p>
            <button onClick={() => handleAddToCart("training", training.id)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>

      <h3>Self Trainings</h3>
      <ul>
        {selfTrainings.map((selfTraining) => (
          <li key={selfTraining.id}>
            <h4>Self Training</h4>
            <p>Date: {selfTraining.date}</p>
            <p>Time: {selfTraining.start_time} - {selfTraining.end_time}</p>
            <p>Pool: {selfTraining.pool_name}</p>
            <button onClick={() => handleAddToCart("self_training", selfTraining.id)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainingList;
