import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { Home, School, Building2, Users, Layers, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import PerfilModal from "./SuperAdminPerfil"; // Asegúrate de tener este componente

const items = [
  { to: "/dashboard/superadmin",              label: "Inicio",          icon: Home },
  { to: "/dashboard/superadmin/colegios",     label: "Colegios",        icon: School },
  { to: "/dashboard/superadmin/unidades",     label: "Unidades",        icon: Building2 },
  { to: "/dashboard/superadmin/usuarios",     label: "Usuarios",        icon: Users },
  { to: "/dashboard/superadmin/infraestructura", label: "Infraestructura", icon: Layers },
];

export default function SuperAdminLayout() {
  const [openSide, setOpenSide] = useState(true);
  const [showPerfil, setShowPerfil] = useState(false);
  const navigate = useNavigate();

  // Usuario mock; luego traerlo del contexto o API
  const user = {
    nombre: "Mauricio",
    apellido: "Caballero",
    email: "superadmin@ejemplo.com",
    fechaNacimiento: "1985-06-15",
    username: "superadmin",
    foto: "", // aquí iría la URL real
  };

  const logout = () => {
    console.log("Cerrar sesión");
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen flex bg-blue-50 text-gray-800">
        {/* Sidebar */}
        <aside className={clsx("bg-white shadow transition-all flex flex-col", openSide ? "w-64" : "w-16")}>
          <div className="flex items-center justify-between p-4">
            <Link to="/dashboard/superadmin" className="text-xl font-bold text-blue-600">
              {openSide ? "Admin" : "A"}
            </Link>
            <button onClick={() => setOpenSide(!openSide)} className="p-1 rounded hover:bg-blue-100">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 mt-4 space-y-1">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-4 py-2 mx-2 rounded-lg",
                    isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-blue-50"
                  )
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {openSide && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className={clsx(
                "flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-red-50",
                openSide ? "text-red-600" : "justify-center text-red-600"
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {openSide && <span>Cerrar sesión</span>}
            </button>
          </div>
        </aside>

        {/* Contenido */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-blue-600">Panel Super Admin</h1>
            <button onClick={() => setShowPerfil(true)} className="flex items-center gap-2 focus:outline-none">
              {user.foto ? (
                <img src={user.foto} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-semibold">
                  {user.nombre[0]}
                </div>
              )}
              <span className="hidden sm:block text-sm">{user.username}</span>
            </button>
          </header>
          <main className="p-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Modal Perfil */}
      {showPerfil && (
        <PerfilModal
          user={user}
          onClose={() => setShowPerfil(false)}
          onLogout={logout}
          onSave={(data) => console.log("Guardar perfil:", data)}
        />
      )}
    </>
  );
}
