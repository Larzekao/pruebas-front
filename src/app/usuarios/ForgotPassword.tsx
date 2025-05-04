// src/app/usuarios/ForgotPassword.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Key, Lock, Eye, EyeOff } from "lucide-react";
import AxiosInstance from "../../components/AxiosInstance";

export default function ForgotPassword() {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AxiosInstance.post("/user/auth/forgot-password/", { email });
      setError("");
      setStep("verify");
    } catch {
      setError("Error al enviar el PIN. Verifica tu email.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AxiosInstance.post("/user/auth/reset-password/", {
        email,
        pin,
        password: newPassword,
      });
      navigate("/login");
    } catch {
      setError("PIN inválido o error al cambiar contraseña.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="bg-white flex flex-col md:flex-row w-full max-w-4xl rounded-3xl overflow-hidden shadow-xl">
        {/* Ilustración */}
        <div className="hidden md:flex md:w-1/2 bg-blue-100 items-center justify-center p-8">
          <img
            src="/images/forgot-password-illustration.svg"
            alt="Forgot password"
            className="max-w-full h-auto"
          />
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-8 bg-white">
          {step === "request" ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                ¿Olvidaste tu contraseña?
              </h2>
              <form onSubmit={handleRequest} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-400 text-white font-semibold rounded-lg hover:bg-blue-300 transition"
                >
                  Enviar PIN
                </button>

                <p className="text-center text-sm text-gray-600">
                  <Link
                    to="/login"
                    className="text-blue-400 hover:underline"
                  >
                    Volver al inicio
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Ingresa tu PIN y nueva contraseña
              </h2>
              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label htmlFor="pin" className="block text-gray-700 mb-1">
                    PIN de verificación
                  </label>
                  <div className="relative">
                    <Key className="w-5 h-5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="pin"
                      type="text"
                      placeholder="123456"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-gray-700 mb-1"
                  >
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="new-password"
                      type={show ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      aria-label="Toggle Password"
                    >
                      {show ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-400 text-white font-semibold rounded-lg hover:bg-blue-300 transition"
                >
                  Cambiar contraseña
                </button>

                <p className="text-center text-sm text-gray-600">
                  <Link
                    to="/login"
                    className="text-blue-400 hover:underline"
                  >
                    Volver al inicio
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
