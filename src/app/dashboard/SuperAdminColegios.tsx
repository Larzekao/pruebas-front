// src/app/dashboard/SuperAdminColegios.tsx
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash, X } from "lucide-react";

interface Colegio {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  logoUrl?: string;
}

export default function SuperAdminColegios() {
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Colegio | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    logoFile: null as File | null,
    logoPreview: "",
  });

  // 1 · Carga inicial (demo si falla)
  useEffect(() => {
    fetch("/api/colegios")
      .then((r) => (r.ok ? r.json() : []))
      .then(setColegios)
      .catch(() =>
        setColegios([
          {
            id: "1",
            nombre: "Colegio Don Bosco",
            direccion: "Av. Potosí 123",
            telefono: "+591 71234567",
            logoUrl: "",
          },
        ])
      );
  }, []);

  // 2 · Abrir nuevo
  const abrirNuevo = () => {
    setForm({ nombre: "", direccion: "", telefono: "", logoFile: null, logoPreview: "" });
    setEditando(null);
    setShowForm(true);
  };

  // 3 · Abrir editar
  const abrirEditar = (c: Colegio) => {
    setForm({
      nombre: c.nombre,
      direccion: c.direccion,
      telefono: c.telefono,
      logoFile: null,
      logoPreview: c.logoUrl || "",
    });
    setEditando(c);
    setShowForm(true);
  };

  // 4 · File input manejado con botón
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    const preview = file ? URL.createObjectURL(file) : form.logoPreview;
    setForm((f) => ({ ...f, logoFile: file, logoPreview: preview }));
  };

  // 5 · Guardar en estado local
  const guardar = () => {
    if (!form.nombre.trim() || !form.direccion.trim()) return;
    if (editando) {
      setColegios((prev) =>
        prev.map((c) =>
          c.id === editando.id
            ? {
                ...c,
                nombre: form.nombre,
                direccion: form.direccion,
                telefono: form.telefono,
                logoUrl: form.logoPreview,
              }
            : c
        )
      );
    } else {
      setColegios((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          nombre: form.nombre,
          direccion: form.direccion,
          telefono: form.telefono,
          logoUrl: form.logoPreview,
        },
      ]);
    }
    setShowForm(false);
  };

  // 6 · Borrar
  const borrar = (id: string) => {
    if (confirm("¿Seguro que deseas eliminar este colegio?")) {
      setColegios((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <section className="space-y-6">
      {/* Cabecera */}
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">Colegios</h2>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <Plus className="w-5 h-5" /> Nuevo colegio
        </button>
      </header>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 relative">
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-semibold mb-4">
            {editando ? "Editar colegio" : "Nuevo colegio"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block mb-1 font-medium">Nombre</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Nombre del colegio"
              />
            </div>
            {/* Teléfono */}
            <div>
              <label className="block mb-1 font-medium">Teléfono</label>
              <input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="+591 7xxxxxxx"
              />
            </div>
            {/* Dirección */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Dirección</label>
              <input
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Av. Ejemplo 123, Calle 45 Nº6"
              />
            </div>
            {/* Logo */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Logo del colegio</label>
              <div className="flex items-center gap-4">
                <label className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg cursor-pointer">
                  Seleccionar archivo
                  <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                </label>
                {form.logoPreview && (
                  <img
                    src={form.logoPreview}
                    alt="Logo preview"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-blue-600">
            <tr>
              <th className="px-4 py-3 text-left">Logo</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Dirección</th>
              <th className="px-4 py-3 text-left">Teléfono</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {colegios.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-4 py-3">
                  {c.logoUrl ? (
                    <img
                      src={c.logoUrl}
                      alt="Logo"
                      className="w-10 h-10 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">{c.nombre}</td>
                <td className="px-4 py-3">{c.direccion}</td>
                <td className="px-4 py-3">{c.telefono}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button
                    onClick={() => abrirEditar(c)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="Editar"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => borrar(c.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="Eliminar"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {colegios.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Sin colegios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
