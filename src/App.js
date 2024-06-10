import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HabitForm from "./Components/HabitForm";
import Progress from "./Components/Progress";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HabitForm />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </Router>
  );
};

export default App;
