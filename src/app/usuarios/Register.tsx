// src/app/usuarios/Register.tsx
import React, { useState, useEffect } from "react";
import {
  User,
  IdCard,
  Mail,
  Camera,
  Calendar,
  Lock,
  Search,
  Check,
} from "lucide-react";

type Role = "" | "superAdmin" | "admin" | "tutor" | "estudiante";

interface UnidadEdu { id: string; nombre: string; }
interface Curso      { id: string; nombre: string; }
interface Paralelo   { id: string; nombre: string; }
interface Tutor      { id: string; ci: string; nombreCompleto: string; }
interface Estudiante { id: string; carnet: string; }

export default function Register() {
  // ── 1. Paso actual
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // ── 2. Datos del formulario
  const [data, setData] = useState({
    // Paso 1
    nombre: "",
    apellido: "",
    foto: null as File | null,
    ci: "",
    email: "",
    fechaNacimiento: "",
    // Paso 2
    role: "" as Role,
    unidadAdm: "",
    puesto: "",
    unidadTut: "",
    parentesco: "",
    studentSearch: "",
    assignedStudentId: "",
    unidadEst: "",
    curso: "",
    paralelo: "",
    rude: "",
    tutorSearch: "",
    tutorsIds: [] as string[],
    // Paso 3
    username: "",
    password: "",
  });

  // ── 3. Catálogos
  const [unidades, setUnidades] = useState<UnidadEdu[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [paralelos, setParalelos] = useState<Paralelo[]>([]);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [estFound, setEstFound] = useState<Estudiante[]>([]);

  // ── 4. Carga inicial y dependencias
  useEffect(() => {
    fetch("/api/unidades")
      .then(r => r.json())
      .then(setUnidades)
      .catch(console.error);

    fetch("/api/tutores")
      .then(r => r.json())
      .then(setTutores)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!data.unidadEst) {
      setCursos([]);
      setParalelos([]);
      setData(d => ({ ...d, curso: "", paralelo: "" }));
      return;
    }
    fetch(`/api/unidades/${data.unidadEst}/cursos`)
      .then(r => r.json())
      .then(setCursos)
      .catch(console.error);
  }, [data.unidadEst]);

  useEffect(() => {
    if (!data.curso) {
      setParalelos([]);
      setData(d => ({ ...d, paralelo: "" }));
      return;
    }
    fetch(`/api/cursos/${data.curso}/paralelos`)
      .then(r => r.json())
      .then(setParalelos)
      .catch(console.error);
  }, [data.curso]);

  useEffect(() => {
    if (data.role === "tutor" && data.studentSearch.length >= 7) {
      fetch(`/api/estudiantes?carnet=${data.studentSearch}`)
        .then(r => r.json())
        .then(setEstFound)
        .catch(console.error);
    } else {
      setEstFound([]);
    }
  }, [data.studentSearch, data.role]);

  // ── 5. Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    if (id === "foto" && (e.target as HTMLInputElement).files) {
      setData(d => ({ ...d, foto: (e.target as HTMLInputElement).files![0] }));
    } else {
      setData(d => ({ ...d, [id]: value }));
    }
  };

  const toggleTutor = (id: string) =>
    setData(d => ({
      ...d,
      tutorsIds: d.tutorsIds.includes(id)
        ? d.tutorsIds.filter(x => x !== id)
        : [...d.tutorsIds, id],
    }));

  const next = () => setStep(s => (s < 4 ? (s + 1) as any : s));
  const back = () => setStep(s => (s > 1 ? (s - 1) as any : s));
  const submit = () => {
    console.log("Payload enviado:", data);
    alert("✅ Registro completado. Revisa la consola.");
  };

  // ── 6. Indicador de pasos
  const StepIndicator = ({ n, label }: { n: number; label: string }) => {
    const active = step === n,
      done = step > n;
    return (
      <li className={`flex items-center ${!active && !done ? "text-gray-400" : ""}`}>
        <div
          className={`w-6 h-6 flex items-center justify-center mr-3 rounded-full
          ${done ? "bg-green-500 text-white"
            : active ? "bg-blue-500 text-white"
              : "border border-gray-300"}`}
        >
          {done ? <Check className="w-4 h-4" /> : n}
        </div>
        <span className={`${done ? "text-green-700" : active ? "text-blue-700" : ""}`}>
          {label}
        </span>
      </li>
    );
  };

  // ── Paso 1: Datos personales
  const StepOne = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block mb-1">Nombre</label>
        <div className="relative">
          <User className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
          <input
            id="nombre"
            value={data.nombre}
            onChange={handleChange}
            className="pl-10 w-full border rounded py-2"
            placeholder="Nombre"
          />
        </div>
      </div>
      {/* Apellido */}
      <div>
        <label htmlFor="apellido" className="block mb-1">Apellido</label>
        <div className="relative">
          <User className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
          <input
            id="apellido"
            value={data.apellido}
            onChange={handleChange}
            className="pl-10 w-full border rounded py-2"
            placeholder="Apellido"
          />
        </div>
      </div>
      {/* Foto */}
      <div>
        <label htmlFor="foto" className="block mb-1">Foto</label>
        <div className="relative">
          <Camera className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
          <input
            id="foto"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="pl-10 w-full border rounded py-2"
          />
        </div>
      </div>
      {/* CI */}
      <div>
        <label htmlFor="ci" className="block mb-1">CI</label>
        <div className="relative">
          <IdCard className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
          <input
            id="ci"
            value={data.ci}
            onChange={handleChange}
            className="pl-10 w-full border rounded py-2"
            placeholder="Número de CI"
          />
        </div>
      </div>
      {/* Email */}
      <div>
        <label htmlFor="email" className="block mb-1">Correo electrónico</label>
        <div className="relative">
          <Mail className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            className="pl-10 w-full border rounded py-2"
            placeholder="email@ejemplo.com"
          />
        </div>
      </div>
      {/* Fecha de nacimiento */}
      <div>
        <label htmlFor="fechaNacimiento" className="block mb-1">Fecha de nacimiento</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-2 w-5 h-5 text-blue-400" />
          <input
            id="fechaNacimiento"
            type="date"
            value={data.fechaNacimiento}
            onChange={handleChange}
            className="pl-10 w-full border rounded py-2"
          />
        </div>
      </div>
    </div>
  );

  // ── Paso 2: Tipo de cuenta y condicionales
  const StepTwo = () => (
    <div className="space-y-6">
      {/* Rol */}
      <div>
        <label htmlFor="role" className="block mb-1">Rol</label>
        <select
          id="role"
          value={data.role}
          onChange={handleChange}
          className="w-full border rounded py-2"
        >
          <option value="">— Selecciona —</option>
          <option value="superAdmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="tutor">Tutor</option>
          <option value="estudiante">Estudiante</option>
        </select>
      </div>

      {/* Administrador */}
      {data.role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="unidadAdm" className="block mb-1">Unidad educativa</label>
            <select
              id="unidadAdm"
              value={data.unidadAdm}
              onChange={handleChange}
              className="w-full border rounded py-2"
            >
              <option value="">— Selecciona —</option>
              {unidades.map(u => (
                <option key={u.id} value={u.id}>{u.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="puesto" className="block mb-1">Puesto</label>
            <select
              id="puesto"
              value={data.puesto}
              onChange={handleChange}
              className="w-full border rounded py-2"
            >
              <option value="">— Selecciona —</option>
              <option value="director">Director</option>
              <option value="secretario">Secretario</option>
              <option value="regente">Regente</option>
            </select>
          </div>
        </div>
      )}

      {/* Tutor */}
      {data.role === "tutor" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="unidadTut" className="block mb-1">Unidad educativa</label>
              <select
                id="unidadTut"
                value={data.unidadTut}
                onChange={handleChange}
                className="w-full border rounded py-2"
              >
                <option value="">— Selecciona —</option>
                {unidades.map(u => (
                  <option key={u.id} value={u.id}>{u.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="parentesco" className="block mb-1">Parentesco</label>
              <select
                id="parentesco"
                value={data.parentesco}
                onChange={handleChange}
                className="w-full border rounded py-2"
              >
                <option value="">— Selecciona —</option>
                <option value="padre">Padre</option>
                <option value="madre">Madre</option>
                <option value="tutorLegal">Tutor Legal</option>
              </select>
            </div>
          </div>
          {/* Asignar estudiante */}
          <div className="space-y-2">
            <label className="block mb-1">Asignar estudiante (CI)</label>
            <input
              id="studentSearch"
              value={data.studentSearch}
              onChange={handleChange}
              className="w-full border rounded py-2 px-3"
              placeholder="Min. 7 dígitos"
            />
            <div className="max-h-28 overflow-auto border rounded p-2">
              {data.studentSearch.length >= 7 ? (
                estFound.length > 0 ? (
                  estFound.map(e => (
                    <label key={e.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="assigned"
                        checked={data.assignedStudentId === e.id}
                        onChange={() => setData(d => ({ ...d, assignedStudentId: e.id }))}
                      />
                      <span>CI {e.carnet}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Sin resultados</p>
                )
              ) : (
                <p className="text-sm text-gray-500">Escribe al menos 7 dígitos del CI</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Estudiante */}
      {data.role === "estudiante" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Unidad */}
          <div>
            <label htmlFor="unidadEst" className="block mb-1">Unidad educativa</label>
            <select
              id="unidadEst"
              value={data.unidadEst}
              onChange={handleChange}
              className="w-full border rounded py-2"
            >
              <option value="">— Selecciona unidad —</option>
              {unidades.map(u => (
                <option key={u.id} value={u.id}>{u.nombre}</option>
              ))}
            </select>
          </div>
          {/* Curso */}
          <div>
            <label className="block mb-1">Curso</label>
            <select
              id="curso"
              value={data.curso}
              onChange={handleChange}
              disabled={cursos.length === 0}
              className="w-full border rounded py-2 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                {cursos.length ? "— Selecciona curso —" : "(elige unidad primero)"}
              </option>
              {cursos.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          {/* Paralelo */}
          <div>
            <label className="block mb-1">Paralelo</label>
            <select
              id="paralelo"
              value={data.paralelo}
              onChange={handleChange}
              disabled={paralelos.length === 0}
              className="w-full border rounded py-2 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                {paralelos.length ? "— Selecciona paralelo —" : "(elige curso primero)"}
              </option>
              {paralelos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          {/* RUDE */}
          <div>
            <label htmlFor="rude" className="block mb-1">RUDE</label>
            <input
              id="rude"
              value={data.rude}
              onChange={handleChange}
              className="w-full border rounded py-2"
              placeholder="Código RUDE"
            />
          </div>
          {/* Tutores */}
          <div className="md:col-span-2">
            <label className="block mb-1">Tutores / Padres</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-2 w-5 h-5 text-gray-500" />
              <input
                id="tutorSearch"
                value={data.tutorSearch}
                onChange={handleChange}
                className="pl-10 w-full border rounded py-2"
                placeholder="Min. 7 dígitos del CI…"
              />
            </div>
            <div className="max-h-32 overflow-auto border rounded p-2">
              {data.tutorSearch.length >= 7 ? (
                tutores
                  .filter(t =>
                    t.ci.includes(data.tutorSearch) ||
                    t.nombreCompleto.toLowerCase().includes(data.tutorSearch.toLowerCase())
                  )
                  .map(t => (
                    <label key={t.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={data.tutorsIds.includes(t.id)}
                        onChange={() => toggleTutor(t.id)}
                      />
                      <span>{t.nombreCompleto} — CI {t.ci}</span>
                    </label>
                  ))
              ) : (
                <p className="text-sm text-gray-500">Escribe al menos 7 dígitos del CI</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── Paso 3: Credenciales
  const StepThree = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="username" className="block mb-1">Usuario</label>
        <div className="relative">
          <User className="absolute left-3 top-2 w-5 h-5 text-gray-500" />
          <input
            id="username"
            value={data.username}
            onChange={handleChange}
            className="pl-10 w-full border rounded py-2"
            placeholder="Usuario"
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="block mb-1">Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-3 top-2 w-5 h-5 text-gray-500" />
          <input
            id="password"
            type="password"
            value={data.password}
            onChange={handleChange}
            className="pl-10 w-full border rounded py-2"
            placeholder="••••••••"
          />
        </div>
      </div>
    </div>
  );

  // ── Paso 4: Resumen
  const StepFour = () => (
    <div className="text-sm space-y-1 text-gray-700">
      <p><strong>Nombre:</strong> {data.nombre} {data.apellido}</p>
      <p><strong>CI:</strong> {data.ci}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Fecha Nac.:</strong> {data.fechaNacimiento}</p>
      <p><strong>Rol:</strong> {data.role}</p>

      {data.role === "admin" && (
        <>
          <p><strong>Unidad:</strong> {unidades.find(u => u.id === data.unidadAdm)?.nombre}</p>
          <p><strong>Puesto:</strong> {data.puesto}</p>
        </>
      )}

      {data.role === "tutor" && (
        <>
          <p><strong>Unidad:</strong> {unidades.find(u => u.id === data.unidadTut)?.nombre}</p>
          <p><strong>Parentesco:</strong> {data.parentesco}</p>
          <p><strong>Estudiante CI:</strong> {estFound.find(e => e.id === data.assignedStudentId)?.carnet}</p>
        </>
      )}

      {data.role === "estudiante" && (
        <>
          <p><strong>Unidad:</strong> {unidades.find(u => u.id === data.unidadEst)?.nombre}</p>
          <p><strong>Curso:</strong> {cursos.find(c => c.id === data.curso)?.nombre}</p>
          <p><strong>Paralelo:</strong> {paralelos.find(p => p.id === data.paralelo)?.nombre}</p>
          <p><strong>RUDE:</strong> {data.rude}</p>
          <p><strong>Tutores:</strong> {data.tutorsIds
            .map(id => tutores.find(t => t.id === id)?.nombreCompleto)
            .join(", ")}</p>
        </>
      )}

      <p><strong>Usuario:</strong> {data.username}</p>
      {/* No mostramos contraseña por seguridad */}
    </div>
  );

  // ── Render completo
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden">
        {/* Barra de pasos */}
        <div className="bg-blue-100 p-4">
          <ul className="flex space-x-4">
            <StepIndicator n={1} label="Datos personales" />
            <StepIndicator n={2} label="Tipo de cuenta" />
            <StepIndicator n={3} label="Credenciales" />
            <StepIndicator n={4} label="Resumen" />
          </ul>
        </div>

        {/* Contenido de paso */}
        <div className="p-6">
          {step === 1 && <StepOne />}
          {step === 2 && <StepTwo />}
          {step === 3 && <StepThree />}
          {step === 4 && <StepFour />}

          <div className="mt-6 flex justify-between">
            {step > 1 ? (
              <button onClick={back} className="px-4 py-2 border rounded">
                Anterior
              </button>
            ) : (
              <span />
            )}
            {step < 4 ? (
              <button onClick={next} className="px-4 py-2 bg-blue-500 text-white rounded">
                Siguiente
              </button>
            ) : (
              <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">
                Confirmar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
