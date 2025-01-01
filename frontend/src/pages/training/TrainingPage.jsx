import React from "react";
import TrainingForm from "./TrainingForm";
import TrainingList from "./TrainingList";
import Cart from "./Cart";
import { useAuth } from "../../context/AuthContext";
import "./training.css";

const TrainingPage = () => {
  const { user } = useAuth();

  return (
    <div className="training-container">
      <h1>Trainings</h1>
      {user?.role === "swimmer" && <TrainingForm refreshTrainings={() => {}} />}
      <TrainingList user={user} />
      <Cart />
    </div>
  );
};

export default TrainingPage;
