import React, { useEffect, useRef, useState } from "react";
import "./Quiz.css";
import { data as initialData } from "../../assets/data";
import Score from "../score/Score";

const Quiz = () => {
  const getStoredQuestions = () => {
    const storedQuestions = localStorage.getItem("quizQuestions");
    return storedQuestions ? JSON.parse(storedQuestions) : initialData;
  };

  const [questions, setQuestions] = useState(getStoredQuestions());
  const [index, setIndex] = useState(0);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    ans: 1,
  });
  const [show, setShow] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  useEffect(() => {
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      next();
    }
  }, [timeLeft, quizCompleted]);

  const question = questions[index];

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);
  const optionArray = [option1, option2, option3, option4];

  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add("correct");
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add("wrong");
        if (optionArray[question.ans - 1].current) {
          optionArray[question.ans - 1].current.classList.add("correct");
        }
      }
      setLock(true);
    }
  };

  const next = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setLock(false);
      setTimeLeft(30);
      optionArray.forEach((option) => {
        if (option.current) {
          option.current.classList.remove("wrong", "correct");
        }
      });
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setIndex(0);
    setScore(0);
    setLock(false);
    setQuizCompleted(false);
    setTimeLeft(30);
  };

  const handleAddQuestion = () => {
    if (
      !newQuestion.question.trim() ||
      !newQuestion.option1.trim() ||
      !newQuestion.option2.trim() ||
      !newQuestion.option3.trim() ||
      !newQuestion.option4.trim() ||
      ![1, 2, 3, 4].includes(newQuestion.ans)
    ) {
      setError("All fields are required, and the correct answer must be 1-4.");
      return;
    }

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    localStorage.setItem("quizQuestions", JSON.stringify(updatedQuestions));

    setNewQuestion({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      ans: 1,
    });
    setIsAdding(false);
    setError("");
    setShow(true);
  };

  const handleAddFun = () => {
    setIsAdding(true);
    setShow(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setShow(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="container">
      {show && (
        <>
          {quizCompleted ? (
            <Score
              score={score}
              total={questions.length}
              restartQuiz={restartQuiz}
            />
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "60%" }}>
                  <h1>QUIZ APP</h1>
                  <h2>Time Left: {formatTime(timeLeft)}</h2>
                </div>
                <button
                  onClick={handleAddFun}
                  className="add-btn"
                  style={{
                    padding: "2%",
                    fontSize: "14px",
                    width: "40%",
                    marginLeft: "30%",
                  }}
                >
                  Add Question
                </button>
              </div>
              <hr />
              <h2>
                {index + 1}. {question.question}
              </h2>
              <ul>
                <li ref={option1} onClick={(e) => checkAns(e, 1)}>
                  {question.option1}
                </li>
                <li ref={option2} onClick={(e) => checkAns(e, 2)}>
                  {question.option2}
                </li>
                <li ref={option3} onClick={(e) => checkAns(e, 3)}>
                  {question.option3}
                </li>
                <li ref={option4} onClick={(e) => checkAns(e, 4)}>
                  {question.option4}
                </li>
              </ul>
              <button
                onClick={next}
                disabled={!lock}
                style={{
                  padding: "2%",
                  width: "40%",
                  marginLeft: "30%",
                }}
              >
                Next
              </button>
              <div className="index">
                {index + 1} of {questions.length} Questions
              </div>
            </>
          )}
        </>
      )}
      {isAdding && (
        <div className="add-question">
          <h2>Add New Question</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="text"
            placeholder="Question"
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, question: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Option 1"
            value={newQuestion.option1}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, option1: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Option 2"
            value={newQuestion.option2}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, option2: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Option 3"
            value={newQuestion.option3}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, option3: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Option 4"
            value={newQuestion.option4}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, option4: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Correct Answer (1-4)"
            value={newQuestion.ans}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, ans: parseInt(e.target.value) })
            }
          />
          <button onClick={handleAddQuestion}>Add</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
