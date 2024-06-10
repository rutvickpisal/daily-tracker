import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Progress.css";

const Progress = () => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/habits");
        setHabits(response.data);
      } catch (error) {
        console.error("Error fetching habits", error);
      }
    };

    fetchHabits();
  }, []);
  const getFormattedDateTime = (dateTimeString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };

    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString("en-IN", options);
  };
  return (
    <div className="progress-container">
      <ul className="habit-list">
        {habits.map((habit) => (
          <li key={habit._id} className="habit-item">
            <h3
              className={`day-category ${habit.dayCategory
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
            >
              Day Category: {habit.dayCategory}
            </h3>
            <p className="habit-details">
              Created At: {getFormattedDateTime(habit.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Progress;
