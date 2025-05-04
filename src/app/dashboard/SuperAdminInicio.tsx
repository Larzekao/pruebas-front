import { Link } from "react-router-dom";

export default function SuperAdminInicio() {
  const cards = [
    { titulo: "Colegios",  valor: 12,  hint: "registrados", enlace: "colegios" },
    { titulo: "Unidades",  valor: 38,  hint: "totales",     enlace: "unidades" },
    { titulo: "Usuarios",  valor: 514, hint: "activos",      enlace: "usuarios" },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map(c => (
        <Link
          to={`/dashboard/superadmin/${c.enlace}`}
          key={c.titulo}
          className="bg-white rounded-xl shadow p-6 flex flex-col hover:shadow-lg transition-shadow"
        >
          <span className="text-sm text-gray-500">{c.titulo}</span>
          <span className="text-3xl font-bold text-blue-600 mt-2">{c.valor}</span>
          <span className="text-xs text-gray-400 mt-auto">{c.hint}</span>
        </Link>
      ))}
    </section>
  );
}
