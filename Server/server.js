// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/habitTracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

const habitSchema = new mongoose.Schema({
  study: Boolean,
  stepForward: Boolean,
  workWell: Boolean,
  sleepWell: Boolean,
  eatWell: Boolean,
  workout: Boolean,
  mobileUsage: String,
  satisfactorily: Boolean,
  madeMistake: Boolean,
  mistakeReason: String,
  points: Number, // Add a field for storing points
  dayCategory: String, // Add a field for day category
  createdAt: {
    type: Date,
    default: () =>
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  },
});

const Habit = mongoose.model("Habit", habitSchema);

app.post("/api/habits", async (req, res) => {
  try {
    const {
      study,
      stepForward,
      workWell,
      sleepWell,
      eatWell,
      workout,
      mobileUsage,
      satisfactorily,
      madeMistake,
      mistakeReason,
      points,
    } = req.body;

    // Create a new habit entry
    const habit = new Habit({
      study,
      stepForward,
      workWell,
      sleepWell,
      eatWell,
      workout,
      mobileUsage,
      satisfactorily,
      madeMistake,
      mistakeReason,
      points, // Save points data
    });

    // Save the habit entry to the database
    await habit.save();

    res.status(201).send(habit);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/api/habits", async (req, res) => {
  try {
    const habits = await Habit.find();

    // Calculate total points and categorize the day for each habit
    habits.forEach((habit) => {
      let totalPoints = 0;
      totalPoints += habit.study ? 2 : 0;
      totalPoints += habit.stepForward ? 2 : 0;
      totalPoints += habit.workWell ? 2 : 0;
      totalPoints += habit.sleepWell ? 2 : 0;
      totalPoints += habit.eatWell ? 2 : 0;
      totalPoints += habit.workout ? 2 : 0;

      const mobileUsage = parseFloat(habit.mobileUsage);
      if (mobileUsage < 1) {
        totalPoints += 4;
      } else if (mobileUsage < 2) {
        totalPoints += 3;
      } else if (mobileUsage < 3) {
        totalPoints += 2;
      }

      totalPoints += habit.satisfactorily ? 2 : 0;
      totalPoints -= habit.madeMistake ? 9 : 0;

      // Categorize the day
      let dayCategory = "";
      if (totalPoints >= 16) {
        dayCategory = "Tesla Day";
      } else if (totalPoints >= 10) {
        dayCategory = "Champion Day";
      } else if (totalPoints >= 0) {
        dayCategory = "Average Joe Day";
      } else if (totalPoints >= -8) {
        dayCategory = "Loser Day";
      } else {
        dayCategory = "Pitiful Day";
      }

      // Add category to habit object
      habit.dayCategory = dayCategory;
    });

    res.status(200).send(habits);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
