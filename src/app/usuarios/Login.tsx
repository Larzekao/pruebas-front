// src/app/usuarios/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Llama a tu API aquí
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="bg-white flex flex-col md:flex-row w-full max-w-4xl rounded-3xl overflow-hidden shadow-xl">
        {/* Panel Izquierdo */}
        <div className="hidden md:flex md:w-1/2 bg-blue-100 items-center justify-center p-8">
          <img
            src="/images/login-illustration.svg"
            alt="Illustration"
            className="max-w-full h-auto"
          />
        </div>

        {/* Panel Derecho (formulario) */}
        <div className="w-full md:w-1/2 p-8 bg-white">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Bienvenido de Nuevo</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Usuario */}
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-1">
                Usuario
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="username"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Contraseña + Olvidé */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="text-gray-700">
                  Contraseña
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-400 hover:underline">
                  Olvidé mi contraseña
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label="Toggle Password Visibility"
                >
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Recordar contraseña */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="h-4 w-4 text-blue-400 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Recordar contraseña
              </label>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-400 text-white font-semibold rounded-lg hover:bg-blue-300 transition"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
