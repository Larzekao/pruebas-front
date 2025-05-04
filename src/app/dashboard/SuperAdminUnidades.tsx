import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";

/* ── Tipos ─────────────────────────────────────── */
type Turno = "Mañana" | "Tarde" | "Noche";
type Nivel = "Inicial" | "Primaria" | "Secundaria";

interface UnidadDTO {
  id: string;
  nombre: string;       //  👈 nuevo
  colegioId: string;
  adminId: string;
  codigoSie: string;
  turno: Turno;
  nivel: Nivel;
}

interface Colegio { id: string; nombre: string; }
interface Admin   { id: string; nombre: string; ci: string; }

/* ── Componente ───────────────────────────────── */
export default function SuperAdminUnidades() {
  /* Datos mock */
  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [admins,   setAdmins]   = useState<Admin[]>([]);
  const [rows,     setRows]     = useState<UnidadDTO[]>([]);

  /* Form */
  const [open, setOpen]  = useState(false);
  const [edit, setEdit]  = useState<UnidadDTO | null>(null);
  const [form, setForm]  = useState<Omit<UnidadDTO,"id">>({
    nombre:"", colegioId:"", adminId:"", codigoSie:"", turno:"" as any, nivel:"" as any,
  });
  const [adminQuery, setAdminQuery] = useState("");

  /* Ordenamiento */
  const [sort, setSort] = useState<{ key: keyof UnidadDTO; asc: boolean }>({
    key:"nombre", asc:true,
  });

  /* Carga inicial (+ejemplo) */
  useEffect(()=>{
    setColegios([
      { id:"c1", nombre:"Don Bosco" },
      { id:"c2", nombre:"La Salle" },
    ]);
    setAdmins([
      { id:"a1", nombre:"Ana Pérez",  ci:"12345678" },
      { id:"a2", nombre:"Luis Gómez", ci:"87654321" },
    ]);
    setRows([{
      id:crypto.randomUUID(),
      nombre:"Don Bosco Central A",
      colegioId:"c1",
      adminId:"a1",
      codigoSie:"45871234",
      turno:"Mañana",
      nivel:"Secundaria",
    }]);
  },[]);

  /* Buscar admins */
  const adminsFiltrados =
    adminQuery.length>=7
      ? admins.filter(a=>a.ci.includes(adminQuery))
      : [];

  /* Abrir/Nuevo/Editar */
  const nuevo = ()=>{
    setForm({ nombre:"", colegioId:"", adminId:"", codigoSie:"", turno:"" as any, nivel:"" as any });
    setAdminQuery("");
    setEdit(null);
    setOpen(true);
  };
  const editar = (u:UnidadDTO)=>{
    setForm({...u});
    setAdminQuery(admins.find(a=>a.id===u.adminId)?.ci || "");
    setEdit(u);
    setOpen(true);
  };

  /* Guardar */
  const guardar = ()=>{
    const ok = Object.values(form).every(v=>v);
    if(!ok) return alert("Completa todos los campos");
    if(edit){
      setRows(r=>r.map(x=>x.id===edit.id?{...edit,...form}:x));
    }else{
      setRows(r=>[...r,{ id:crypto.randomUUID(), ...form }]);
    }
    setOpen(false);
  };

  /* Eliminar */
  const eliminar = (id:string)=>
    confirm("¿Eliminar?") && setRows(r=>r.filter(x=>x.id!==id));

  /* Ordenar */
  const filas = [...rows].sort((a,b)=>{
    const A=a[sort.key] as any, B=b[sort.key] as any;
    return sort.asc ? (A>B?1:-1) : A<B?1:-1;
  });
  const toggleSort = (key:keyof UnidadDTO)=>
    setSort(s=>({ key, asc: s.key===key ? !s.asc : true }));

  /* ── UI ─────────────────────────────────────── */
  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">Unidades educativas</h2>
        <button onClick={nuevo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          <Plus className="w-5 h-5"/> Nueva unidad
        </button>
      </header>

      {/* Formulario */}
      {open&&(
        <div className="bg-white p-6 rounded-xl shadow space-y-5 relative">
          <button onClick={()=>setOpen(false)}
                  className="absolute top-5 right-5 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5"/>
          </button>

          <h3 className="text-xl font-semibold">{edit?"Editar":"Nueva"} unidad</h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Nombre unidad */}
            <div className="md:col-span-2">
              <label className="font-medium">Nombre de la unidad</label>
              <input value={form.nombre}
                     onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}
                     className="w-full border rounded-lg px-3 py-2"
                     placeholder="Ej. Don Bosco Central A"/>
            </div>

            {/* Colegio */}
            <div>
              <label className="font-medium">Colegio</label>
              <select value={form.colegioId}
                      onChange={e=>setForm(f=>({...f,colegioId:e.target.value}))}
                      className="w-full border rounded-lg px-3 py-2">
                <option value="">— Selecciona —</option>
                {colegios.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            {/* Código SIE */}
            <div>
              <label className="font-medium">Código SIE</label>
              <input value={form.codigoSie}
                     onChange={e=>setForm(f=>({...f,codigoSie:e.target.value}))}
                     className="w-full border rounded-lg px-3 py-2"/>
            </div>

            {/* Turno */}
            <div>
              <label className="font-medium">Turno</label>
              <select value={form.turno}
                      onChange={e=>setForm(f=>({...f,turno:e.target.value as Turno}))}
                      className="w-full border rounded-lg px-3 py-2">
                <option value="">— Selecciona —</option>
                {["Mañana","Tarde","Noche"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Nivel */}
            <div>
              <label className="font-medium">Nivel</label>
              <select value={form.nivel}
                      onChange={e=>setForm(f=>({...f,nivel:e.target.value as Nivel}))}
                      className="w-full border rounded-lg px-3 py-2">
                <option value="">— Selecciona —</option>
                {["Inicial","Primaria","Secundaria"].map(n=><option key={n}>{n}</option>)}
              </select>
            </div>

            {/* Buscar Admin */}
            <div className="md:col-span-2">
              <label className="font-medium">Buscar Admin (CI)</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400"/>
                <input value={adminQuery}
                       onChange={e=>{
                         setAdminQuery(e.target.value.replace(/\D/g,""));
                         setForm(f=>({...f,adminId:""}));
                       }}
                       placeholder="Mín. 7 dígitos"
                       className="pl-10 w-full border rounded-lg px-3 py-2"/>
              </div>
              <div className="border rounded-lg mt-2 max-h-32 overflow-auto p-2">
                {adminQuery.length<7?(
                  <p className="text-sm text-gray-500">Escribe al menos 7 dígitos</p>
                ):adminsFiltrados.length?(
                  adminsFiltrados.map(a=>(
                    <label key={a.id}
                           className="flex items-center gap-2 py-1 cursor-pointer hover:bg-blue-50 rounded px-1">
                      <input type="radio" name="admin" className="accent-blue-600"
                             checked={form.adminId===a.id}
                             onChange={()=>setForm(f=>({...f,adminId:a.id}))}/>
                      <span className="flex-1">{a.nombre} — <span className="font-mono">{a.ci}</span></span>
                    </label>
                  ))
                ):(
                  <p className="text-sm text-gray-500">Sin resultados</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={()=>setOpen(false)}
                    className="px-4 py-2 border rounded-lg">Cancelar</button>
            <button onClick={guardar}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg">Guardar</button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-blue-600 select-none">
            {(
              [
                ["nombre","Nombre unidad"],
                ["colegioId","Colegio"],
                ["codigoSie","Código SIE"],
                ["turno","Turno"],
                ["nivel","Nivel"],
                ["adminId","Admin"],
              ] as [keyof UnidadDTO,string][]
            ).map(([key,label])=>{
              const active=sort.key===key;
              return(
                <th key={key} onClick={()=>toggleSort(key)}
                    className="px-4 py-3 text-left cursor-pointer">
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {active&&(sort.asc
                      ?<ChevronUp className="w-4 h-4"/>
                      :<ChevronDown className="w-4 h-4"/>)}
                  </span>
                </th>
              );
            })}
            <th className="px-4 py-3 text-right">Acciones</th>
          </thead>

          <tbody className="divide-y">
            {filas.length===0&&(
              <tr><td colSpan={7}
                  className="p-8 text-center text-gray-500">Sin unidades registradas</td></tr>
            )}
            {filas.map(u=>{
              const col=colegios.find(c=>c.id===u.colegioId)?.nombre;
              const adm=admins.find(a=>a.id===u.adminId);
              return(
                <tr key={u.id} className="hover:bg-blue-50">
                  <td className="px-4 py-3">{u.nombre}</td>
                  <td className="px-4 py-3">{col}</td>
                  <td className="px-4 py-3">{u.codigoSie}</td>
                  <td className="px-4 py-3">{u.turno}</td>
                  <td className="px-4 py-3">{u.nivel}</td>
                  <td className="px-4 py-3">{adm?.nombre} — {adm?.ci}</td>
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <button onClick={()=>editar(u)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                      <Pencil className="w-4 h-4"/>
                    </button>
                    <button onClick={()=>eliminar(u.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
