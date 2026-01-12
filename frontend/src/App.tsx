import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Positions from './components/Positions';
import PositionDetails from './pages/PositionDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/positions" element={<Positions />} />
        <Route path="/positions/:id" element={<PositionDetails />} />
        <Route path="/" element={<Navigate to="/positions" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
