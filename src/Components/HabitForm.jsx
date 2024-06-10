import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/HabitForm.css";

const HabitForm = () => {
  const [formData, setFormData] = useState({
    study: false,
    stepForward: false,
    workWell: false,
    sleepWell: false,
    eatWell: false,
    workout: false,
    mobileUsage: "",
    satisfactorily: false,
    madeMistake: false,
    mistakeReason: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate points
    let points = 0;

    // Points for boxes 1 to 6 (each box fetches 2 points)
    points += formData.study ? 2 : 0;
    points += formData.stepForward ? 2 : 0;
    points += formData.workWell ? 2 : 0;
    points += formData.sleepWell ? 2 : 0;
    points += formData.eatWell ? 2 : 0;
    points += formData.workout ? 2 : 0;

    // Points for box 7 based on mobile usage
    const mobileUsage = parseInt(formData.mobileUsage);
    if (mobileUsage < 3) {
      points += 2;
    } else if (mobileUsage < 2) {
      points += 3;
    } else if (mobileUsage < 1) {
      points += 4;
    }

    // Points for box 8 (2 points)
    points += formData.satisfactorily ? 2 : 0;

    // Deduct 9 points if box 9 is checked
    if (formData.madeMistake) {
      points -= 9;
    }
    const currentDate = new Date().toLocaleDateString();
    const existingEntry = await checkExistingEntry(currentDate);
    try {
      if (existingEntry) {
        setErrorMessage("An entry for today already exists.");
      } else {
        // Save form data to server
        await axios.post("http://localhost:5000/api/habits", formData);

        // Set formSubmitted in localStorage
        localStorage.setItem("formSubmitted", true);

        // Redirect to progress page with total points
        navigate("/progress", { state: { totalPoints: points } });
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  // Function to check if an entry exists for the current date
  const checkExistingEntry = async (date) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/habits?date=${date}`
      );
      return response.data.length > 0;
    } catch (error) {
      console.error("Error checking existing entry", error);
      return false;
    }
  };

  const getGreetingMessage = () => {
    const dayGreetings = {
      Sunday: "Superb Sunday",
      Monday: "Marvellous Monday",
      Tuesday: "Terrific Tuesday",
      Wednesday: "Wonderful Wednesday",
      Thursday: "Thrilling Thursday",
      Friday: "Fantastic Friday",
      Saturday: "Spectacular Saturday",
    };
    const today = new Date();
    const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
    return `Hi Rutvick, have a ${dayGreetings[dayName]}!`;
  };
  const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(new Date());
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    const formattedTime = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return <span className="clock">{formattedTime}</span>;
  };
  return (
    <div className="form-container">
      <h1 className="greeting-message">
        {getGreetingMessage()} {"It's "}
        <Clock />
      </h1>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p>{errorMessage}</p>}
        <label>
          <input
            type="checkbox"
            name="study"
            checked={formData.study}
            onChange={handleChange}
          />
          Did you study for atleast 3 hours yesterday and learn something new?
        </label>
        <label>
          <input
            type="checkbox"
            name="stepForward"
            checked={formData.stepForward}
            onChange={handleChange}
          />
          Do you feel we have taken a step forward in our goal?
        </label>
        <label>
          <input
            type="checkbox"
            name="workWell"
            checked={formData.workWell}
            onChange={handleChange}
          />
          Did you work well in your day job yesterday?
        </label>
        <label>
          <input
            type="checkbox"
            name="sleepWell"
            checked={formData.sleepWell}
            onChange={handleChange}
          />
          Did you sleep well? (atleast 7 hours)
        </label>
        <label>
          <input
            type="checkbox"
            name="eatWell"
            checked={formData.eatWell}
            onChange={handleChange}
          />
          Did you eat well? Had your protein intake?
        </label>
        <label>
          <input
            type="checkbox"
            name="workout"
            checked={formData.workout}
            onChange={handleChange}
          />
          Did you workout yesterday?
        </label>
        <label>
          How long did you use your mobile?
          <input
            type="number"
            name="mobileUsage"
            value={formData.mobileUsage}
            onChange={handleChange}
          />
        </label>
        <label>
          <input
            type="checkbox"
            name="satisfactorily"
            checked={formData.satisfactorily}
            onChange={handleChange}
          />
          Did you feel you did satisfactorily in the last 24 hours?
        </label>
        <label>
          <input
            type="checkbox"
            name="madeMistake"
            checked={formData.madeMistake}
            onChange={handleChange}
          />
          Check this box if you made a terrible mistake yesterday, along with
          the reason.
        </label>
        {formData.madeMistake && (
          <textarea
            name="mistakeReason"
            value={formData.mistakeReason}
            onChange={handleChange}
            placeholder="Reason for the mistake"
          />
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default HabitForm;
