import React from "react";
import "./Score.css";  

const Score = ({ score, total, restartQuiz }) => {
  let message = "Quiz Completed!";
  let textColor = "black"; 

  if (score === 5) {
    message = "🌟 Excellent!";
    textColor = "green";
  } else if (score === 4) {
    message = "👍 Very Good!";
    textColor = "blue";
  } else if (score === 3) {
    message = "🙂 Good!";
    textColor = "orange";
  } else if (score === 2) {
    message = "😐 Fair!";
    textColor = "darkorange";
  } else {
    message = "😞 Poor!";
    textColor = "red";
  }

  return (
    <div className="score-container">
      <h1 style={{ color: textColor }}>{message}</h1>
      <h2>Your Score: {score} / {total}</h2>
      <button onClick={restartQuiz}>Restart Quiz</button>
    </div>
  );
};

export default Score;
