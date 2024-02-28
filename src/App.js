import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mains from "./mains";
import Login from "./Login";
import Dashboard from "./dashboard";
import Photo from "./photo";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mains />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/photo/:id" element={<Photo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
