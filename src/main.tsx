import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css'
import Home from "./app/usuarios/Home";
import Login from "./app/usuarios/Login";
import AlumnoDashboard from "./app/dashboard/AlumnosDashboard";
import Register from "./app/usuarios/Register";
import SuperAdminDashboard from "./app/dashboard/SuperAdminDashboard";
import ForgotPassword from "./app/usuarios/ForgotPassword";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/alumno" element={<AlumnoDashboard />} />
        <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
