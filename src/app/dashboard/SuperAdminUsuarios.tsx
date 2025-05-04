import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, X, ChevronUp, ChevronDown, Search,
  User, IdCard, Mail, Camera, Calendar, Lock, Check,
} from "lucide-react";

/* ── Tipos ─────────────────────────────────────── */
type Rol = "" | "superAdmin" | "admin" | "tutor" | "estudiante";

interface Unidad { id: string; nombre: string; }
interface Curso  { id: string; nombre: string; }
interface Paral  { id: string; nombre: string; }
interface Tutor  { id: string; ci: string; nombreCompleto: string; }
interface Est    { id: string; carnet: string; }

interface UsuarioDTO {
  id: string;
  nombre: string;
  apellido: string;
  foto: File | null;
  ci: string;
  email: string;
  fechaNacimiento: string;
  rol: Rol;
  /* admin */
  unidadAdm?: string;
  puesto?: string;
  /* tutor */
  unidadTut?: string;
  parentesco?: string;
  assignedStudentId?: string;
  /* estudiante */
  unidadEst?: string;
  curso?: string;
  paralelo?: string;
  rude?: string;
  tutoresIds?: string[];
  /* credenciales */
  username: string;
  password: string;
}

/* ── Mock catálogos — reemplaza con fetch ───────── */
const UNIDADES: Unidad[] = [
  { id: "u1", nombre: "Don Bosco Central" },
  { id: "u2", nombre: "La Salle Sur" },
];
const CURSOS: Curso[] = [{ id: "c1", nombre: "1º Sec." }];
const PARALELOS: Paral[] = [{ id: "p1", nombre: "A" }];
const TUTORES: Tutor[] = [
  { id: "t1", ci: "1234567", nombreCompleto: "Ana Pérez" },
  { id: "t2", ci: "7654321", nombreCompleto: "Luis Gómez" },
];
const ESTS: Est[] = [{ id: "e1", carnet: "7894561" }];

/* ╭─────────────────────────────┐
   │  Componente principal CRUD  │
   ╰─────────────────────────────*/
export default function SuperAdminUsuarios() {
  const [rows, setRows] = useState<UsuarioDTO[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UsuarioDTO | null>(null);

  /* búsqueda y orden */
  const [ciQuery, setCiQuery] = useState("");
  const [sort, setSort] = useState<{ key: keyof UsuarioDTO; asc: boolean }>({
    key: "nombre",
    asc: true,
  });

  /* ejemplo */
  useEffect(() => {
    setRows([
      {
        id: crypto.randomUUID(),
        nombre: "María",
        apellido: "Rodríguez",
        foto: null,
        ci: "78945612",
        email: "maria@colegio.com",
        fechaNacimiento: "2000-05-12",
        rol: "tutor",
        unidadTut: "u1",
        parentesco: "madre",
        assignedStudentId: "e1",
        username: "mrodriguez",
        password: "",
      },
    ]);
  }, []);

  /* guardar */
  const save = (u: UsuarioDTO) => {
    setRows(r =>
      editUser ? r.map(x => (x.id === editUser.id ? u : x)) : [...r, { ...u, id: crypto.randomUUID() }]
    );
    setModalOpen(false);
  };
  const del = (id: string) =>
    confirm("¿Eliminar?") && setRows(r => r.filter(x => x.id !== id));

  /* filtro + sort */
  const filtered = ciQuery.length >= 7 ? rows.filter(u => u.ci.includes(ciQuery)) : rows;
  const ordered = [...filtered].sort((a, b) => {
    const A = a[sort.key] as any, B = b[sort.key] as any;
    return sort.asc ? (A > B ? 1 : -1) : A < B ? 1 : -1;
  });
  const sortBy = (k: keyof UsuarioDTO) =>
    setSort(s => ({ key: k, asc: s.key === k ? !s.asc : true }));

  /* ── UI tabla ── */
  return (
    <section className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-600">Usuarios</h2>
        <button
          onClick={() => { setEditUser(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" /> Nuevo
        </button>
      </header>

      <div className="relative w-72">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          value={ciQuery}
          onChange={e => setCiQuery(e.target.value.replace(/\D/g, ""))}
          placeholder="Buscar por CI…"
          className="pl-10 w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-blue-600">
            {(["nombre","apellido","ci","email","rol","username"] as (keyof UsuarioDTO)[])
              .map(k=>{
                const l={nombre:"Nombre",apellido:"Apellido",ci:"CI",email:"Correo",rol:"Rol",username:"Usuario"}[k];
                const act=sort.key===k;
                return(
                  <th key={k} onClick={()=>sortBy(k)}
                      className="px-4 py-3 text-left cursor-pointer select-none">
                    <span className="inline-flex items-center gap-1">
                      {l}{act&&(sort.asc?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>)}
                    </span>
                  </th>
                );
              })}
            <th className="px-4 py-3 text-right">Acciones</th>
          </thead>
          <tbody className="divide-y">
            {ordered.length===0&&<tr><td colSpan={7} className="p-8 text-center text-gray-500">Sin usuarios</td></tr>}
            {ordered.map(u=>(
              <tr key={u.id} className="hover:bg-blue-50">
                <td className="px-4 py-3">{u.nombre}</td>
                <td className="px-4 py-3">{u.apellido}</td>
                <td className="px-4 py-3">{u.ci}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.rol}</td>
                <td className="px-4 py-3">{u.username}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button onClick={()=>{setEditUser(u);setModalOpen(true);}}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"><Pencil className="w-4 h-4"/></button>
                  <button onClick={()=>del(u.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen&&(
        <WizardUsuario
          initial={editUser}
          onCancel={()=>setModalOpen(false)}
          onSave={save}
        />
      )}
    </section>
  );
}

/* ╭─────────────────────────────┐
   │  Wizard de alta / edición   │
   ╰─────────────────────────────*/
function WizardUsuario({
  initial,
  onCancel,
  onSave,
}:{
  initial:UsuarioDTO|null;
  onCancel:()=>void;
  onSave:(u:UsuarioDTO)=>void;
}){
  const [step,setStep]=useState<1|2|3|4>(1);
  const [data,setData]=useState<UsuarioDTO>(initial??{
    id:"",
    nombre:"",apellido:"",foto:null,ci:"",email:"",fechaNacimiento:"",
    rol:"",unidadAdm:"",puesto:"",unidadTut:"",parentesco:"",
    assignedStudentId:"",unidadEst:"",curso:"",paralelo:"",rude:"",
    tutoresIds:[],username:"",password:"",
  });

  /* catálogos locales */
  const unidades=UNIDADES,cursos=CURSOS,paralelos=PARALELOS,tutores=TUTORES;
  const estFound = data.studentSearch?.length>=7
    ? ESTS.filter(e=>e.carnet.includes(data.studentSearch))
    : [];

  /* handlers */
  const handle=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
    const {id,value}=e.target;
    if(id==="foto" && (e.target as HTMLInputElement).files){
      setData(d=>({...d,foto:(e.target as HTMLInputElement).files![0]}));
    }else{
      setData(d=>({...d,[id]:value}));
    }
  };
  const toggleTutor=(id:string)=>
    setData(d=>({...d,tutoresIds:d.tutoresIds?.includes(id)
      ?d.tutoresIds.filter(x=>x!==id)
      :[...(d.tutoresIds||[]),id]}));

  /* pasos UI */
  const Paso1=()=>(
    <div className="grid md:grid-cols-2 gap-6">
      {[
        ["nombre","Nombre",User],["apellido","Apellido",User],
      ].map(([id,l,Icon])=>(
        <div key={id}>
          <label className="block mb-1">{l}</label>
          <div className="relative">
            <Icon className="absolute left-3 top-2 w-5 h-5 text-blue-400"/>
            <input id={id} value={(data as any)[id]} onChange={handle}
              className="pl-10 w-full border rounded py-2" placeholder={l}/>
          </div>
        </div>
      ))}
      <div>
        <label className="block mb-1">Foto</label>
        <div className="relative">
          <Camera className="absolute left-3 top-2 w-5 h-5 text-blue-400"/>
          <input id="foto" type="file" accept="image/*" onChange={handle}
                 className="pl-10 w-full border rounded py-2"/>
        </div>
      </div>
      <div>
        <label className="block mb-1">CI</label>
        <div className="relative">
          <IdCard className="absolute left-3 top-2 w-5 h-5 text-blue-400"/>
          <input id="ci" value={data.ci} onChange={handle}
                 className="pl-10 w-full border rounded py-2" placeholder="Número de CI"/>
        </div>
      </div>
      <div>
        <label className="block mb-1">Correo</label>
        <div className="relative">
          <Mail className="absolute left-3 top-2 w-5 h-5 text-blue-400"/>
          <input id="email" type="email" value={data.email} onChange={handle}
                 className="pl-10 w-full border rounded py-2" placeholder="email@ejemplo.com"/>
        </div>
      </div>
      <div>
        <label className="block mb-1">Fecha de nacimiento</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-2 w-5 h-5 text-blue-400"/>
          <input id="fechaNacimiento" type="date" value={data.fechaNacimiento} onChange={handle}
                 className="pl-10 w-full border rounded py-2"/>
        </div>
      </div>
    </div>
  );

  const Paso2=()=>(
    <div className="space-y-6">
      <div>
        <label className="block mb-1">Rol</label>
        <select id="rol" value={data.rol} onChange={handle}
                className="w-full border rounded py-2">
          <option value="">— Selecciona —</option>
          <option value="superAdmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="tutor">Tutor</option>
          <option value="estudiante">Estudiante</option>
        </select>
      </div>

      {/* Admin */}
      {data.rol==="admin"&&(
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">Unidad educativa</label>
            <select id="unidadAdm" value={data.unidadAdm} onChange={handle}
                    className="w-full border rounded py-2">
              <option value="">— Selecciona —</option>
              {unidades.map(u=><option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1">Puesto</label>
            <select id="puesto" value={data.puesto} onChange={handle}
                    className="w-full border rounded py-2">
              <option value="">— Selecciona —</option>
              <option value="director">Director</option>
              <option value="secretario">Secretario</option>
              <option value="regente">Regente</option>
            </select>
          </div>
        </div>
      )}

      {/* Tutor */}
      {data.rol==="tutor"&&(
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Unidad educativa</label>
              <select id="unidadTut" value={data.unidadTut} onChange={handle}
                      className="w-full border rounded py-2">
                <option value="">— Selecciona —</option>
                {unidades.map(u=><option key={u.id} value={u.id}>{u.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1">Parentesco</label>
              <select id="parentesco" value={data.parentesco} onChange={handle}
                      className="w-full border rounded py-2">
                <option value="">— Selecciona —</option>
                <option value="padre">Padre</option>
                <option value="madre">Madre</option>
                <option value="tutorLegal">Tutor Legal</option>
              </select>
            </div>
          </div>

          {/* asignar estudiante */}
          <div className="space-y-2">
            <label className="block mb-1">Asignar estudiante (CI)</label>
            <input id="studentSearch" value={data.studentSearch||""} onChange={handle}
                   className="w-full border rounded py-2 px-3" placeholder="Min. 7 dígitos"/>
            <div className="max-h-28 overflow-auto border rounded p-2">
              {data.studentSearch?.length>=7?(
                estFound.length?estFound.map(e=>(
                  <label key={e.id} className="flex items-center gap-2">
                    <input type="radio" name="as" checked={data.assignedStudentId===e.id}
                           onChange={()=>setData(d=>({...d,assignedStudentId:e.id}))}/>
                    <span>CI {e.carnet}</span>
                  </label>
                )):<p className="text-sm text-gray-500">Sin resultados</p>
              ):<p className="text-sm text-gray-500">Escribe al menos 7 dígitos</p>}
            </div>
            {data.assignedStudentId && (
              <p className="text-sm text-green-700">
                Estudiante asignado: CI {ESTS.find(e=>e.id===data.assignedStudentId)?.carnet}
              </p>
            )}
          </div>
        </>
      )}

      {/* Estudiante */}
      {data.rol==="estudiante"&&(
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">Unidad educativa</label>
            <select id="unidadEst" value={data.unidadEst} onChange={handle}
                    className="w-full border rounded py-2">
              <option value="">— Selecciona —</option>
              {unidades.map(u=><option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1">Curso</label>
            <select id="curso" value={data.curso} onChange={handle}
                    disabled={!data.unidadEst}
                    className="w-full border rounded py-2 disabled:bg-gray-100">
              <option value="">
                {data.unidadEst?"— Selecciona —":"(elige unidad primero)"}
              </option>
              {cursos.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1">Paralelo</label>
            <select id="paralelo" value={data.paralelo} onChange={handle}
                    disabled={!data.curso}
                    className="w-full border rounded py-2 disabled:bg-gray-100">
              <option value="">
                {data.curso?"— Selecciona —":"(elige curso primero)"}
              </option>
              {paralelos.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1">RUDE</label>
            <input id="rude" value={data.rude} onChange={handle}
                   className="w-full border rounded py-2" placeholder="Código RUDE"/>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Tutores / Padres</label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-2 w-5 h-5 text-gray-500"/>
              <input id="tutorSearch" value={data.tutorSearch||""} onChange={handle}
                     className="pl-10 w-full border rounded py-2" placeholder="Min. 7 dígitos del CI"/>
            </div>
            <div className="max-h-32 overflow-auto border rounded p-2">
              {data.tutorSearch?.length>=7?(
                tutores.filter(t=>t.ci.includes(data.tutorSearch||"")||
                                  t.nombreCompleto.toLowerCase().includes((data.tutorSearch||"").toLowerCase()))
                       .map(t=>(
                         <label key={t.id} className="flex items-center gap-2">
                           <input type="checkbox" checked={data.tutoresIds?.includes(t.id)}
                                  onChange={()=>toggleTutor(t.id)}/>
                           <span>{t.nombreCompleto} — CI {t.ci}</span>
                         </label>
                       ))
              ):<p className="text-sm text-gray-500">Escribe al menos 7 dígitos</p>}
            </div>
            {data.tutoresIds?.length>0 && (
              <p className="text-sm text-green-700">
                Tutores seleccionados: {data.tutoresIds.map(id=>tutores.find(t=>t.id===id)?.nombreCompleto).join(", ")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const Paso3=()=>(
    <div className="space-y-6">
      <div>
        <label className="block mb-1">Usuario</label>
        <div className="relative">
          <User className="absolute left-3 top-2 w-5 h-5 text-gray-500"/>
          <input id="username" value={data.username} onChange={handle}
                 className="pl-10 w-full border rounded py-2" placeholder="Usuario"/>
        </div>
      </div>
      <div>
        <label className="block mb-1">Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-3 top-2 w-5 h-5 text-gray-500"/>
          <input id="password" type="password" value={data.password} onChange={handle}
                 className="pl-10 w-full border rounded py-2" placeholder="••••••••"/>
        </div>
      </div>
    </div>
  );

  const Paso4=()=>(
    <div className="text-sm space-y-1">
      <p><strong>Nombre:</strong> {data.nombre} {data.apellido}</p>
      <p><strong>CI:</strong> {data.ci}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Rol:</strong> {data.rol}</p>
      {data.rol==="tutor"&&data.assignedStudentId&&(
        <p><strong>Estudiante asignado:</strong> {ESTS.find(e=>e.id===data.assignedStudentId)?.carnet}</p>
      )}
      {data.rol==="estudiante"&&data.tutoresIds?.length>0&&(
        <p><strong>Tutores:</strong> {data.tutoresIds.map(id=>tutores.find(t=>t.id===id)?.nombreCompleto).join(", ")}</p>
      )}
      <p><strong>Usuario:</strong> {data.username}</p>
    </div>
  );

  return(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative">
        {/* X salir */}
        <button onClick={onCancel} aria-label="Cerrar"
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700
                           rounded-full p-1 hover:bg-gray-100">
          <X className="w-5 h-5"/>
        </button>

        {/* header steps */}
        <div className="bg-blue-100 p-3 rounded mb-6">
          <ul className="flex gap-4">
            {[
              [1,"Datos personales"],
              [2,"Tipo de cuenta"],
              [3,"Credenciales"],
              [4,"Resumen"],
            ].map(([n,l]:any)=>{
              const a=step===n,d=step>n;
              return(
                <li key={n} className="flex items-center gap-1 text-sm">
                  <div className={`w-5 h-5 flex items-center justify-center rounded-full
                                  ${d?"bg-green-500 text-white":a?"bg-blue-500 text-white":"border"}`}>
                    {d?<Check className="w-4 h-4"/>:n}
                  </div>
                  <span className={a?"text-blue-700":d?"text-green-700":"text-gray-500"}>{l}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {step===1&&<Paso1/>}
        {step===2&&<Paso2/>}
        {step===3&&<Paso3/>}
        {step===4&&<Paso4/>}

        <div className="mt-6 flex justify-between">
          {step>1?<button onClick={()=>setStep(s=>s-1 as any)}
                          className="px-4 py-2 border rounded">Anterior</button>:<span/>}
          {step<4?<button onClick={()=>setStep(s=>s+1 as any)}
                          className="px-4 py-2 bg-blue-600 text-white rounded">Siguiente</button>
                  :<button onClick={()=>onSave(data)}
                           className="px-4 py-2 bg-green-600 text-white rounded">Guardar</button>}
        </div>
      </div>
    </div>
  );
}
