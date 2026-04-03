import { useState, useRef, useEffect, useCallback } from "react";

// ── LOGO (pez disco real, mismo que favicon) ──────────────────────────────────
const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAFxUlEQVR42u2XzW4jxxWFv1tV3fyRSIqUKI1GcOLExniSRRZZBlkHWWafTbZ5hAB5gLxD3idAdjOA4fyMkYwdWdZoREriT5PdXVU3iyY5lEYyKMlBvHAt2N3V7Opz7z33nGrJ81LP3r6l3W6zvbWFDwERwVpDUZQ8dqgqIgIoIoYY4+peNQuKIshqfhxmuOks48WLl+wf9Nnf7yNisdZwfj7gk2fPFos+bIgIZem5Gl1hxBBipNfdYTyZgsB2s0lRFBRliSpoVGax4C98jmSzXL/88j80txq0Wi0EQVWZZhm9bhdjzCpqVV29cHl+F6Dl/ahKPp+jiwylaUpYZM05SwyRGBWkyq6PgTMdVcCSxBFCRERWqU7ThDwviKo4a8mLgjRJiBrRqKtMWmurYmi1sDGyWms9qGXp4tr1eqDr5TUY3HQ25/T1Kb1ul2wyodXuMB5fMc9z+nt9xuMxSZIQojKfZ/R6u1xcDOnu9MiyKaUv8UVJu9NBRBhPxnTaOwwG5/R6Pfb7fbz3VRbXeHeTh6tzIBCQ2WikoSyReoOIYBboQwhYa1HVRRkE1fgu+kV2b0atqu+eW5w/iJ+xLFSsAQzX46iAGGMe3I3V8UFP407OLyEGDg76uBvRiRgupgW5jzSTitCXg1NELM45yrIkaiSxjqIscC6h1WrRqDeo12uLNe4fUDYrcEZgls8J3l8Dtuyiy6xkNCvZ23Yk1lDkOXnpaTaahODxIZAD1jny6YTSez442nq0/omuMS8u+bLW8g/RMb2F4HcCuJEIFnLlLkcTsmlGZ6eDXbS3oszzglriSGsJUcGJQdFFA5gKeNS1UsnqINUPbIAtoguZMURVYgxYY3ECZFlGu91CFjdZALBqOI8TXr9+TXMipM0are02zllCjHQbTZqd9t1E2iDZg+EFMUQQcC7h7OwNu7u7SAhBjTH4EFfiKlI5lzFC0GreigGRqrSqRFWsMfdn9/tshwVtVHUVi1xejXQ2m9Go1+l02qta+xDw3lNL00rVl3XRGw78rYzK4K8xrSwLDSEgxl4TwyV5vQ94H+4UymXClksuremmdy4S/V6CqzmhLMuFOyhGDE6Nw4jFGbm1A7PpjFle0Gm3Nuouaw1pcj0IHyLehzuqXrnDYHhRaaJLaDTqyOnE61dvBjzbTdjudN97rCw9UXUDBa9yls8Lvjh+g3MGEIL37PV26Pbat6dsrULr9ibD0VQJJSIGI0LUqgGssTSbDYyR93YAt7Z9rOzrs0//xW9//yfSRoP5+Yikk/DHP/yO3/zqFyv/3UT93dnlDM2GDIcXNBp1VKEoCra2mvz0J59U9r1R51X/SesJttbgUCY0Pmzz8mRKrVbjvv7kPuhvQ2zy4x99uJIAXcjBQ1Tf1mokvqS3M+eXv/45n/75Bfloer2jNwHWrKV89fUp89mMWq2GD4Gjp4fU03RjW1lnv0kc5XjC/MCR/vCA5z87Yjqa3ztAp8De7i5J4hCRjXlwB/cpRhNsp43U4N8np7Q/3qN31N/YCd4BU+V8cM58Nqfb7dLrdR+t5NuHu5hu4O1xTr6/R+f54UYNdA0YIhwcPAGN9wvpjlK61hbp4T6Tr/8BiWGYNMnHGTy5n1GY4yvPZ6cZzhmcs49xlUpMs4J8XlJrGPzFFVp45lc5993Omqcty/ODBmC+FdeTUMJ4zLzWR8Yw+ec52cng3l1pNAZOT0549epziqJ4NDCTOnQyY6pt3nZ/wGhYkD7A7Z21lqdPD3HOfePOZBO1VhWKecHf//o3drrHNEzg+KJkPJqszH2ztUDyvNA3Z2fMsoz9/X12djo3XrZZDZa7iyzLefnyFc5ZrAhZXvLxR0c8edL7Jqu8hRIhaFmWxKikaXLL1kcevRd8yHCl9wyGQ4q8oNfr0m63H70hfbcTrq6NkXvbm8QYtChKvPckSUKapt+JjF37fLv9a/r/A8zwHR3fA/se2P96/Be+wTsOb0FddwAAAABJRU5ErkJggg==";

// ── CONSTANTES ────────────────────────────────────────────────────────────────
const PARAM_DEFS = [
  { key:"temperatura", label:"Temperatura", unit:"°C", icon:"🌡️", min:26, max:30, ideal:"27-29", color:"#f97316" },
  { key:"ph", label:"pH", unit:"", icon:"⚗️", min:6.0, max:7.5, ideal:"6.5-7.0", color:"#a78bfa" },
  { key:"gh", label:"GH", unit:"°dH", icon:"💧", min:3, max:10, ideal:"4-8", color:"#38bdf8" },
  { key:"kh", label:"KH", unit:"°dH", icon:"🔬", min:2, max:6, ideal:"3-5", color:"#34d399" },
  { key:"amonio", label:"Amonio (NH₃)", unit:"mg/L", icon:"⚠️", min:0, max:0.5, ideal:"0", color:"#f87171" },
  { key:"nitritos", label:"Nitritos (NO₂⁻)", unit:"mg/L", icon:"⚠️", min:0, max:0.5, ideal:"0", color:"#fb923c" },
  { key:"nitratos", label:"Nitratos (NO₃⁻)", unit:"mg/L", icon:"📊", min:0, max:30, ideal:"<20", color:"#fbbf24" },
  { key:"co2", label:"CO2", unit:"mg/L", icon:"🌿", min:15, max:35, ideal:"20-30", color:"#4ade80" },
];
const EXTRA_PARAM_DEFS = [
  { key:"fosfatos", label:"Fosfatos (PO₄³⁻)", unit:"mg/L", icon:"🧪", min:0, max:0.5, ideal:"<0.1", color:"#e879f9" },
  { key:"oxigeno", label:"Oxígeno disuelto", unit:"mg/L", icon:"💨", min:6, max:10, ideal:">7", color:"#67e8f9" },
  { key:"conductividad", label:"Conductividad", unit:"μS/cm", icon:"⚡", min:50, max:200, ideal:"80-150", color:"#facc15" },
  { key:"cloro", label:"Cloro", unit:"mg/L", icon:"🧴", min:0, max:0.1, ideal:"0", color:"#f43f5e" },
  { key:"hierro", label:"Hierro (Fe)", unit:"mg/L", icon:"🔩", min:0, max:0.5, ideal:"0.1-0.3", color:"#d97706" },
  { key:"magnesio", label:"Magnesio (Mg)", unit:"mg/L", icon:"⚗️", min:5, max:20, ideal:"10-15", color:"#818cf8" },
];
const INITIAL_FISH = [
  { id:1, nombre:"Disco", cantidad:8, emoji:"🔵", especie:"Symphysodon spp.", estado:"saludable", adquisicion:"", notas:"", historial:[] },
  { id:2, nombre:"Ramirezi", cantidad:6, emoji:"🟡", especie:"Mikrogeophagus ramirezi", estado:"saludable", adquisicion:"", notas:"", historial:[] },
  { id:3, nombre:"Neón", cantidad:8, emoji:"🔴", especie:"Paracheirodon innesi", estado:"saludable", adquisicion:"", notas:"", historial:[] },
  { id:4, nombre:"Corydoras", cantidad:9, emoji:"⚪", especie:"Corydoras spp.", estado:"saludable", adquisicion:"", notas:"", historial:[] },
  { id:5, nombre:"Ancistrus", cantidad:4, emoji:"🟤", especie:"Ancistrus spp.", estado:"saludable", adquisicion:"", notas:"", historial:[] },
];
const FISH_CATALOG = [
  { nombre:"Disco", especie:"Symphysodon spp.", emoji:"🔵" },
  { nombre:"Ramirezi", especie:"Mikrogeophagus ramirezi", emoji:"🟡" },
  { nombre:"Neón tetras", especie:"Paracheirodon innesi", emoji:"🔴" },
  { nombre:"Corydoras", especie:"Corydoras spp.", emoji:"⚪" },
  { nombre:"Ancistrus", especie:"Ancistrus spp.", emoji:"🟤" },
  { nombre:"Ángel", especie:"Pterophyllum scalare", emoji:"🔷" },
  { nombre:"Guppy", especie:"Poecilia reticulata", emoji:"🟢" },
  { nombre:"Betta", especie:"Betta splendens", emoji:"🔴" },
  { nombre:"Otro (personalizado)", especie:"", emoji:"🐠" },
];
const PLANT_CATALOG = [
  { nombre:"Rótala", zona:"Fondo" },
  { nombre:"Cryptocoryne wendtii", zona:"Medio" },
  { nombre:"Tenellum", zona:"Bajo" },
  { nombre:"Anubias nana", zona:"Medio" },
  { nombre:"Java fern", zona:"Medio" },
  { nombre:"Ludwigia repens", zona:"Fondo" },
  { nombre:"Vallisneria", zona:"Fondo" },
  { nombre:"Otra (personalizada)", zona:"Libre" },
];
const FISH_DB = {
  "Symphysodon spp.": { temp:"28-31°C", ph:"5.5-7.0", gh:"1-8°dH", tamano:"15-21cm", dieta:"Omnívoro (gránulos, corazón de buey, artemia)", compatibilidad:"Otras especies de aguas blandas y cálidas", nivel:"Avanzado", curiosidades:"El disco es uno de los peces más exigentes. Son muy sensibles al amonio y nitritos. Forman parejas estables y cuidan a sus crías." },
  "Mikrogeophagus ramirezi": { temp:"26-30°C", ph:"5.0-7.0", gh:"1-6°dH", tamano:"5-7cm", dieta:"Omnívoro (gránulos pequeños, artemia, tubifex)", compatibilidad:"Pacífico con especies similares", nivel:"Intermedio", curiosidades:"El ramirezi es uno de los cíclidos enanos más coloridos. Forma parejas monógamas y defiende su zona de puesta." },
  "Paracheirodon innesi": { temp:"20-26°C", ph:"5.5-7.5", gh:"1-10°dH", tamano:"3-4cm", dieta:"Omnívoro (microgránulos, artemia nauplii)", compatibilidad:"Muy pacífico, ideal para comunidad", nivel:"Principiante", curiosidades:"El neón tetras nada en bancos. Se siente más seguro en grupos de 8+." },
  "Corydoras spp.": { temp:"22-28°C", ph:"6.0-7.8", gh:"2-15°dH", tamano:"4-7cm", dieta:"Omnívoro bentónico (pastillas de fondo, gusanos)", compatibilidad:"Muy pacífico, limpiador del sustrato", nivel:"Principiante", curiosidades:"Los corydoras respiran aire atmosférico ocasionalmente. Son muy sociales." },
  "Ancistrus spp.": { temp:"23-28°C", ph:"6.0-7.5", gh:"2-12°dH", tamano:"10-15cm", dieta:"Herbívoro (algas, madera, verduras)", compatibilidad:"Pacífico, puede ser territorial con otros plecos", nivel:"Principiante", curiosidades:"El ancistrus es esencial para el control de algas. Necesitan madera para digerir correctamente." },
};
const INITIAL_PLANTS = [
  { id:1, nombre:"Rótala", zona:"Fondo", estado:"creciendo", cantidad:1 },
  { id:2, nombre:"Criptocorinas", zona:"Medio", estado:"estable", cantidad:1 },
  { id:3, nombre:"Tenellum", zona:"Bajo", estado:"creciendo", cantidad:1 },
];
const INITIAL_EQUIPO = [
  { id:1, nombre:"Filtro Oase 300", estado:"activo" },
  { id:2, nombre:"Filtro Ultramax 2000", estado:"activo" },
  { id:3, nombre:"Calentador Chihiros", estado:"activo" },
  { id:4, nombre:"Pantalla Chihiros Slim", estado:"activo" },
  { id:5, nombre:"Sistema CO2", estado:"activo" },
];
const FEED_TYPES = ["Gránulos","Corazón de buey","Artemia","Tubifex","Pellets","Liofilizado","Verduras","Otro"];
const MANT_TASKS_DEFAULT = { agua:"🪣 Cambio de agua", filtro:"🔧 Limpiar filtro", algas:"🧽 Limpiar algas", sustrato:"🪨 Aspirar sustrato", co2:"💨 Revisar CO2", fertilizante:"🌱 Fertilizante" };
const MANT_TASKS_EXTRA = ["🌡️ Calibrar termómetro","💡 Revisar iluminación","🔌 Revisar enchufes","🪵 Limpiar decoración","🐌 Control de caracoles","🧬 Verificar parámetros","💧 Rellenar depósito CO2","🌿 Podar plantas","🪨 Renovar sustrato","💊 Añadir fertilizante líquido"];
const SECTIONS = [
  { id:"dashboard", label:"Inicio", icon:"🏠" },
  { id:"params", label:"Params", icon:"📊" },
  { id:"vida", label:"Vida", icon:"🐠" },
  { id:"extras", label:"Extras", icon:"🍽️" },
  { id:"ia", label:"IA", icon:"🤖" },
];
const EXPENSE_CATS = [
  { id:"alimento", label:"Alimento", icon:"🍽️", color:"#4ade80" },
  { id:"medicamento", label:"Medicamento", icon:"💊", color:"#f43f5e" },
  { id:"equipo", label:"Equipo", icon:"🔧", color:"#38bdf8" },
  { id:"planta", label:"Plantas", icon:"🌿", color:"#34d399" },
  { id:"pez", label:"Peces", icon:"🐠", color:"#a78bfa" },
  { id:"otro", label:"Otro", icon:"📦", color:"#94a3b8" },
];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS = ["L","M","X","J","V","S","D"];

const C = { bg:"#0f172a", card:"#1e293b", border:"#334155", text:"#f1f5f9", muted:"#64748b", sub:"#94a3b8", blue:"#38bdf8", green:"#4ade80", yellow:"#facc15", red:"#f87171", orange:"#f97316" };
const ss = {
  card: { background:C.card, borderRadius:16, padding:16, marginBottom:12 },
  inp: { width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
  btn: { width:"100%", background:"linear-gradient(135deg,#0ea5e9,#38bdf8)", border:"none", borderRadius:14, padding:15, color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"inherit" },
  row: { display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid #1a2540` },
  slab: { fontSize:12, fontWeight:700, color:C.sub, marginBottom:10, textTransform:"uppercase", letterSpacing:1 },
};

// ── UTILS ─────────────────────────────────────────────────────────────────────
function usePersist(key, def) {
  const [v, setV] = useState(() => { try { const s=localStorage.getItem("aq4_"+key); return s?JSON.parse(s):def; } catch { return def; } });
  const set = useCallback(val => setV(prev => { const n=typeof val==="function"?val(prev):val; try{localStorage.setItem("aq4_"+key,JSON.stringify(n));}catch{} return n; }), [key]);
  return [v, set];
}

// FIX #2: getStatus ahora siempre usa customLimits
function getStatus(key, value, customLimits) {
  const d=PARAM_DEFS.find(p=>p.key===key) || EXTRA_PARAM_DEFS.find(p=>p.key===key);
  if (!d||value===undefined||value==="") return "neutral";
  const v=parseFloat(value);
  if(isNaN(v)) return "neutral";
  const min = (customLimits && customLimits[key]?.min !== undefined) ? customLimits[key].min : d.min;
  const max = (customLimits && customLimits[key]?.max !== undefined) ? customLimits[key].max : d.max;
  if (key==="amonio"||key==="nitritos") return v===0?"ok":v<0.25?"warning":"danger";
  if (key==="nitratos") return v<=20?"ok":v<=30?"warning":"danger";
  return v>=min&&v<=max?"ok":"danger";
}

// FIX #2: useAutoAlerts recibe customLimits y lo pasa a getStatus
function useAutoAlerts(params, customLimits) {
  return [...PARAM_DEFS,...EXTRA_PARAM_DEFS].filter(p=>params[p.key]!==undefined&&params[p.key]!=="").map(p=>{
    const st=getStatus(p.key,params[p.key],customLimits);
    if(st==="neutral") return null;
    const v=parseFloat(params[p.key]);
    if(st==="danger") return {level:"danger",param:p,value:v};
    if(st==="warning") return {level:"warning",param:p,value:v};
    return null;
  }).filter(Boolean);
}

function today() { return new Date().toLocaleDateString("es-ES"); }
function toISO() { return new Date().toISOString().slice(0,10); }

function Dot({ status }) {
  const c={ok:C.green,warning:C.yellow,danger:C.red,neutral:"#6b7280"};
  return <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:c[status]||c.neutral,marginRight:6}}/>;
}
function TabBar({ tabs, active, onChange, small }) {
  return (
    <div style={{display:"flex",background:C.card,borderRadius:12,padding:4,gap:4,margin:"0 16px 16px"}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>onChange(t.id)} style={{flex:1,background:active===t.id?"#0ea5e9":"transparent",border:"none",borderRadius:9,padding:small?"8px 2px":"10px 4px",color:active===t.id?"#fff":C.muted,fontWeight:700,fontSize:small?11:13,cursor:"pointer",fontFamily:"inherit"}}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// FIX #1: Logo real del pez disco bien escalado
function DiscusFish({ size=36 }) {
  return (
    <img
      src={LOGO_BASE64}
      width={size}
      height={size}
      style={{objectFit:"contain",display:"block"}}
      alt="AquaLog"
    />
  );
}

function MiniChart({ data, color, minRef, maxRef }) {
  if (!data||data.length<2) return <div style={{textAlign:"center",color:C.muted,fontSize:12,padding:16}}>Necesitas al menos 2 registros</div>;
  const W=300,H=100,P=18;
  const vals=data.map(d=>d.v), lo=Math.min(...vals)*0.95, hi=Math.max(...vals)*1.05;
  const x=i=>P+(i/(data.length-1))*(W-P*2), y=v=>H-P-((v-lo)/(hi-lo||1))*(H-P*2);
  const pts=data.map((d,i)=>`${x(i)},${y(d.v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",overflow:"visible"}}>
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      {minRef!==undefined&&<line x1={P} y1={y(minRef)} x2={W-P} y2={y(minRef)} stroke={color} strokeDasharray="4,4" strokeOpacity="0.4" strokeWidth="1.5"/>}
      {maxRef!==undefined&&<line x1={P} y1={y(maxRef)} x2={W-P} y2={y(maxRef)} stroke={color} strokeDasharray="4,4" strokeOpacity="0.4" strokeWidth="1.5"/>}
      <polygon points={`${x(0)},${H-P} ${pts} ${x(data.length-1)},${H-P}`} fill="url(#cg)"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {data.map((d,i)=><circle key={i} cx={x(i)} cy={y(d.v)} r="4" fill={color} stroke="#0f172a" strokeWidth="2"/>)}
      {data.filter((_,i)=>i%Math.ceil(data.length/5)===0).map((d,i)=><text key={i} x={x(data.indexOf(d))} y={H-2} textAnchor="middle" fill={C.muted} fontSize="8">{d.l}</text>)}
    </svg>
  );
}

function SparkLine({ data, color, minRef, maxRef }) {
  if(!data||data.length<2) return null;
  const W=260,H=36,P=4;
  const vals=data.map(d=>d.v);
  const lo=Math.min(...vals,minRef??Infinity)*0.97, hi=Math.max(...vals,maxRef??-Infinity)*1.03;
  const range=hi-lo||1;
  const x=i=>P+(i/(data.length-1))*(W-P*2), y=v=>H-P-((v-lo)/range)*(H-P*2);
  const pts=data.map((d,i)=>`${x(i)},${y(d.v)}`).join(" ");
  const last=data[data.length-1];
  return (
    <div style={{borderTop:`1px solid #1a2540`,paddingTop:4,marginBottom:4}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:36,overflow:"visible"}}>
        {minRef!==undefined&&minRef>=lo&&minRef<=hi&&<line x1={P} y1={y(minRef)} x2={W-P} y2={y(minRef)} stroke={color} strokeDasharray="3,3" strokeOpacity="0.35" strokeWidth="1"/>}
        {maxRef!==undefined&&maxRef>=lo&&maxRef<=hi&&<line x1={P} y1={y(maxRef)} x2={W-P} y2={y(maxRef)} stroke={color} strokeDasharray="3,3" strokeOpacity="0.35" strokeWidth="1"/>}
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" strokeOpacity="0.85"/>
        {data.map((d,i)=><circle key={i} cx={x(i)} cy={y(d.v)} r={i===data.length-1?3.5:2} fill={color} stroke="#0f172a" strokeWidth="1.2"/>)}
        <text x={x(data.length-1)+5} y={y(last.v)+4} fill={color} fontSize="9" fontWeight="700">{last.v}</text>
      </svg>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:8,color:C.muted,padding:"0 4px"}}>
        <span>{data[0].l}</span><span style={{color:color+"bb",fontSize:9}}>Últimas {data.length} mediciones</span><span>{last.l}</span>
      </div>
    </div>
  );
}

// ── DASHBOARD — FIX #2: pasa customLimits a useAutoAlerts ─────────────────────
function Dashboard({ params, customLimits, fish, plants, history, reminders, expenses, aquariumName, setAquariumName, setSection }) {
  // FIX #2: usar customLimits para las alertas del dashboard
  const alerts = useAutoAlerts(params, customLimits);
  const dangers = alerts.filter(a=>a.level==="danger");
  const warnings = alerts.filter(a=>a.level==="warning");
  const totalFish = fish.reduce((s,f)=>s+f.cantidad,0);
  const totalPlants = plants.reduce((s,p)=>s+(p.cantidad||1),0);
  const pending = reminders.filter(r=>!r.done);
  const lastMaint = history.find(h=>h.tipo==="mantenimiento");
  const lastFeed = history.find(h=>h.tipo==="alimentacion");
  const thisMonth = new Date().getMonth();
  const totalMonth = expenses.filter(e=>{ try{ const d=new Date(e.fecha); return d.getMonth()===thisMonth; } catch{ return false; } }).reduce((s,e)=>s+parseFloat(e.importe||0),0);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(aquariumName);

  return (
    <div style={{paddingBottom:80}}>
      <div style={{borderRadius:16,margin:"0 16px 14px",background:"linear-gradient(135deg,#0f3460,#16213e 60%,#0a1628)",padding:"14px 18px"}}>
          <div style={{marginBottom:0}}>
            <div style={{fontSize:10,color:C.blue,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Mi Acuario</div>
            {editingName
              ?<div style={{display:"flex",gap:6,alignItems:"center"}}>
                <input value={tempName} onChange={e=>setTempName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setAquariumName(tempName);setEditingName(false);}if(e.key==="Escape")setEditingName(false);}} autoFocus style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(56,189,248,0.5)",borderRadius:8,padding:"4px 10px",color:"#fff",fontSize:18,fontWeight:800,outline:"none",fontFamily:"inherit",flex:1}}/>
                <button onClick={()=>{setAquariumName(tempName);setEditingName(false);}} style={{background:"#0ea5e9",border:"none",borderRadius:8,padding:"4px 10px",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>✓</button>
              </div>
              :<div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{aquariumName}</div>
                <button onClick={()=>{setTempName(aquariumName);setEditingName(true);}} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:6,padding:"2px 7px",color:"rgba(255,255,255,0.5)",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✏️</button>
              </div>
            }
          </div>
      </div>
      <div style={{display:"flex",gap:10,margin:"0 16px 12px"}}>
        <div style={{flex:1,background:C.card,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.border}33`}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:4}}>🐠 PECES</div><div style={{fontSize:26,fontWeight:900,color:C.blue}}>{totalFish}</div></div>
        <div style={{flex:1,background:C.card,borderRadius:12,padding:"12px 14px",border:`1px solid ${C.border}33`}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:4}}>🌿 PLANTAS</div><div style={{fontSize:26,fontWeight:900,color:C.green}}>{totalPlants}</div></div>
        <div onClick={()=>setSection("params")} style={{flex:1,background:C.card,borderRadius:12,padding:"12px 14px",cursor:"pointer",border:`1px solid ${dangers.length>0?C.red:warnings.length>0?C.yellow:C.green}44`}}>
          <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:4}}>⚡ ESTADO</div>
          <div style={{fontSize:26,fontWeight:900,color:dangers.length>0?C.red:warnings.length>0?C.yellow:C.green}}>{dangers.length>0?"✗":warnings.length>0?"!":"✓"}</div>
          <div style={{fontSize:8,color:C.muted}}>{dangers.length>0?"Ver alertas →":warnings.length>0?"Ver avisos →":"Todo OK"}</div>
        </div>
      </div>
      {dangers.length>0&&<div style={{margin:"0 16px 10px",background:"#450a0a",border:`2px solid ${C.red}`,borderRadius:14,padding:"12px 14px"}}><div style={{fontSize:13,fontWeight:800,color:C.red,marginBottom:8}}>🚨 ALERTA CRÍTICA</div>{dangers.map((a,i)=><div key={i} style={{fontSize:12,color:"#fca5a5",marginBottom:4,background:"rgba(248,113,113,0.1)",borderRadius:8,padding:"6px 10px"}}><span style={{fontWeight:700}}>{a.param.icon} {a.param.label}: {a.value} {a.param.unit}</span> — ideal: {a.param.ideal}</div>)}</div>}
      {warnings.length>0&&<div style={{margin:"0 16px 10px",background:"#422006",border:`1px solid ${C.orange}`,borderRadius:14,padding:"12px 14px"}}><div style={{fontSize:13,fontWeight:700,color:C.orange,marginBottom:6}}>⚠️ Parámetros en atención</div>{warnings.map((a,i)=><div key={i} style={{fontSize:12,color:"#fdba74",marginBottom:2}}>• {a.param.icon} {a.param.label}: {a.value} {a.param.unit}</div>)}</div>}
      {pending.length>0&&<div style={{margin:"0 16px 10px",background:"#1c2a1e",border:`1px solid ${C.green}`,borderRadius:14,padding:"12px 14px"}}><div style={{fontSize:13,fontWeight:700,color:C.green,marginBottom:6}}>🔔 {pending.length} recordatorio{pending.length>1?"s":""} pendiente{pending.length>1?"s":""}</div>{pending.slice(0,2).map(r=><div key={r.id} style={{fontSize:12,color:"#86efac",marginBottom:2}}>• {r.titulo}</div>)}<button onClick={()=>setSection("extras")} style={{marginTop:4,fontSize:11,color:C.green,background:"none",border:"none",cursor:"pointer",padding:0}}>Ver todos →</button></div>}
      <div style={{margin:"0 16px 12px"}}>
        <div style={ss.slab}>Últimos parámetros</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {PARAM_DEFS.slice(0,4).map(p=>{
            // FIX #2: usar customLimits aquí también
            const st=getStatus(p.key,params[p.key],customLimits);
            const bc={ok:"#1e3a2e",warning:"#3a2e1e",danger:"#3a1e1e",neutral:C.card}[st];
            return <div key={p.key} style={{background:C.card,borderRadius:12,padding:"11px 13px",border:`1px solid ${bc}`}}><div style={{fontSize:16,marginBottom:3}}>{p.icon}</div><div style={{fontSize:10,color:C.muted}}>{p.label}</div><div style={{fontSize:18,fontWeight:800,color:C.text}}>{params[p.key]||"—"}<span style={{fontSize:10,color:C.muted}}> {p.unit}</span></div><Dot status={st}/><span style={{fontSize:9,color:C.muted}}>ideal: {p.ideal}</span></div>;
          })}
        </div>
      </div>
      <div style={{display:"flex",gap:10,margin:"0 16px 10px"}}>
        <div style={{...ss.card,flex:1,marginBottom:0,background:"linear-gradient(135deg,#1e1b4b,#1e293b)"}}><div style={{fontSize:10,color:"#a78bfa",fontWeight:700,marginBottom:2}}>GASTO MES</div><div style={{fontSize:22,fontWeight:900,color:"#fff"}}>{totalMonth.toFixed(2)}<span style={{fontSize:11,color:"#a78bfa"}}> €</span></div></div>
        <div style={{...ss.card,flex:1,marginBottom:0}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:2}}>ÚLTIMO MANT.</div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{lastMaint?lastMaint.fecha:"—"}</div></div>
      </div>
      <div style={{margin:"0 16px",...ss.card}}>
        <div style={ss.slab}>Actividad reciente</div>
        {lastMaint?<div style={{fontSize:12,color:C.blue,marginBottom:4}}>🔧 Mantenimiento: {lastMaint.fecha}</div>:<div style={{fontSize:12,color:C.muted,marginBottom:4}}>🔧 Sin mantenimientos</div>}
        {lastFeed?<div style={{fontSize:12,color:C.green}}>🍽️ Comida: {lastFeed.fecha} · {lastFeed.tipo_alimento}</div>:<div style={{fontSize:12,color:C.muted}}>🍽️ Sin alimentación registrada</div>}
      </div>
    </div>
  );
}

// ── PARÁMETROS ────────────────────────────────────────────────────────────────
function Params({ params, setParams, history, addHistory, customLimits, setCustomLimits, activeExtraParams, setActiveExtraParams }) {
  const [tab, setTab] = useState("reg");
  const [local, setLocal] = useState({...params});
  const [chartKey, setChartKey] = useState("temperatura");
  const [editingLimits, setEditingLimits] = useState(null);
  const [showExtraSelector, setShowExtraSelector] = useState(false);
  const alerts = useAutoAlerts(local, customLimits);
  const ALL_PARAMS = [...PARAM_DEFS, ...EXTRA_PARAM_DEFS];
  const defaultActive = PARAM_DEFS.map(p=>p.key);
  const activeKeys = activeExtraParams.length > 0 ? activeExtraParams : defaultActive;
  const allActiveParams = ALL_PARAMS.filter(p=>activeKeys.includes(p.key));
  const def = allActiveParams.find(p=>p.key===chartKey) || PARAM_DEFS[0];
  const pHistory = history.filter(h=>h.tipo==="parametros").slice(0,30).reverse();
  const chartData = pHistory.map(h=>({l:h.fecha.slice(0,5),v:parseFloat(h.datos?.[chartKey])})).filter(d=>!isNaN(d.v));
  const save = () => { setParams(local); addHistory({tipo:"parametros",fecha:today(),datos:{...local}}); alert("✅ Parámetros guardados"); };
  const getLimit = (key, which) => (customLimits && customLimits[key]?.[which] !== undefined) ? customLimits[key][which] : (PARAM_DEFS.find(p=>p.key===key)||EXTRA_PARAM_DEFS.find(p=>p.key===key))?.[which];

  return (
    <div style={{paddingBottom:90}}>
      <TabBar tabs={[{id:"reg",label:"📝 Registro"},{id:"graf",label:"📈 Gráficas"},{id:"alertas",label:"🚨 Alertas"}]} active={tab} onChange={setTab} small/>
      {tab==="reg"&&<div style={{padding:"0 16px"}}>
        <div style={{marginBottom:12}}>
          <button onClick={()=>setShowExtraSelector(!showExtraSelector)} style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 14px",color:C.blue,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>⚙️ Gestionar parámetros ({allActiveParams.length} activos)</span>
            <span style={{fontSize:10,color:C.muted}}>{showExtraSelector?"▲":"▼"}</span>
          </button>
          {showExtraSelector&&<div style={{background:C.card,borderRadius:10,padding:12,marginTop:4,border:`1px solid ${C.border}`}}>
            {ALL_PARAMS.map(p=>{
              const active=activeKeys.includes(p.key);
              return <div key={p.key} onClick={()=>{if(active){if(activeKeys.length<=1)return;setActiveExtraParams(activeKeys.filter(k=>k!==p.key));}else{setActiveExtraParams([...activeKeys,p.key]);}}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid #1a2540`,cursor:"pointer",opacity:active?1:0.6}}>
                <span style={{fontSize:13,color:active?C.text:C.muted}}>{p.icon} {p.label} <span style={{fontSize:10,color:C.muted}}>({p.unit||"sin unidad"})</span></span>
                <div style={{width:22,height:22,borderRadius:6,background:active?"#0ea5e9":C.bg,border:`2px solid ${active?"#0ea5e9":C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{active&&<span style={{color:"#fff",fontSize:13,fontWeight:900}}>✓</span>}</div>
              </div>;
            })}
          </div>}
        </div>
        {alerts.length>0&&<div style={{background:alerts.some(a=>a.level==="danger")?"#450a0a":"#422006",border:`1px solid ${alerts.some(a=>a.level==="danger")?C.red:C.orange}`,borderRadius:12,padding:"10px 14px",marginBottom:14}}><div style={{fontSize:12,fontWeight:700,color:alerts.some(a=>a.level==="danger")?C.red:C.orange,marginBottom:6}}>{alerts.some(a=>a.level==="danger")?"🚨 Valores críticos":"⚠️ Valores en atención"}</div>{alerts.map((a,i)=><div key={i} style={{fontSize:11,color:"#fca5a5",marginBottom:2}}>• {a.param.icon} {a.param.label}: {a.value} {a.param.unit}</div>)}</div>}
        {allActiveParams.map(p=>{
          const st=getStatus(p.key,local[p.key],customLimits);
          const alert=alerts.find(a=>a.param.key===p.key);
          const minVal=getLimit(p.key,"min"), maxVal=getLimit(p.key,"max");
          const sparkData=pHistory.map(h=>({l:h.fecha.slice(0,5),v:parseFloat(h.datos?.[p.key])})).filter(d=>!isNaN(d.v)).slice(-8);
          return <div key={p.key} style={{...ss.card,border:`1px solid ${alert?(alert.level==="danger"?C.red+"55":C.orange+"55"):"transparent"}`,marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{p.icon}</span><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{p.label}</div><div style={{fontSize:10,color:C.muted}}>Ideal: {p.ideal} {p.unit}</div></div></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>{alert&&<span style={{fontSize:9,background:alert.level==="danger"?C.red+"22":C.orange+"22",color:alert.level==="danger"?C.red:C.orange,border:`1px solid ${alert.level==="danger"?C.red+"44":C.orange+"44"}`,borderRadius:20,padding:"2px 7px",fontWeight:700}}>{alert.level==="danger"?"CRÍTICO":"ATENCIÓN"}</span>}<Dot status={st}/></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:sparkData.length>=2?6:8}}>
              <input type="number" step="0.1" value={local[p.key]||""} onChange={e=>setLocal(l=>({...l,[p.key]:e.target.value}))} placeholder="—" style={{flex:1,background:C.bg,border:`1px solid ${alert?(alert.level==="danger"?C.red+"66":C.orange+"55"):C.border}`,borderRadius:10,padding:"9px 12px",color:C.text,fontSize:17,fontWeight:700,outline:"none",fontFamily:"inherit"}}/>
              <span style={{color:C.muted,fontSize:13,minWidth:28}}>{p.unit}</span>
            </div>
            {sparkData.length>=2&&<SparkLine data={sparkData} color={p.color} minRef={minVal} maxRef={maxVal}/>}
            <div style={{borderTop:`1px solid #1a2540`,paddingTop:8}}>
              {editingLimits===p.key
                ?<div>
                  <div style={{fontSize:10,color:C.muted,marginBottom:6}}>Personalizar límites:</div>
                  <div style={{display:"flex",gap:6,marginBottom:6}}>
                    <div style={{flex:1}}><div style={{fontSize:9,color:C.muted,marginBottom:2}}>Mínimo</div><input type="number" step="0.1" defaultValue={minVal} onBlur={e=>setCustomLimits(cl=>({...cl,[p.key]:{...(cl?.[p.key]||{}),min:parseFloat(e.target.value)}}))} style={{...ss.inp,fontSize:13,padding:"6px 10px"}}/></div>
                    <div style={{flex:1}}><div style={{fontSize:9,color:C.muted,marginBottom:2}}>Máximo</div><input type="number" step="0.1" defaultValue={maxVal} onBlur={e=>setCustomLimits(cl=>({...cl,[p.key]:{...(cl?.[p.key]||{}),max:parseFloat(e.target.value)}}))} style={{...ss.inp,fontSize:13,padding:"6px 10px"}}/></div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>setEditingLimits(null)} style={{flex:1,background:"#0ea5e9",border:"none",borderRadius:8,padding:"6px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✓ Guardar</button>
                    <button onClick={()=>{setCustomLimits(cl=>{const n={...cl};delete n[p.key];return n;});setEditingLimits(null);}} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>↺ Restablecer</button>
                  </div>
                </div>
                :<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:10,color:C.muted}}>Rango: {minVal}–{maxVal} {p.unit}{customLimits?.[p.key]?" (personalizado)":""}</span>
                  <button onClick={()=>setEditingLimits(p.key)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"2px 8px",color:C.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>✏️ Editar</button>
                </div>
              }
            </div>
          </div>;
        })}
        <button onClick={save} style={ss.btn}>💾 Guardar parámetros</button>
      </div>}
      {tab==="graf"&&<div style={{padding:"0 16px"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{allActiveParams.map(p=><button key={p.key} onClick={()=>setChartKey(p.key)} style={{background:chartKey===p.key?p.color+"33":C.card,border:`1px solid ${chartKey===p.key?p.color:C.border}`,borderRadius:20,padding:"4px 11px",color:chartKey===p.key?p.color:C.muted,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{p.icon} {p.label}</button>)}</div>
        <div style={ss.card}><div style={{fontSize:13,fontWeight:700,color:def.color,marginBottom:2}}>{def.icon} {def.label}</div><div style={{fontSize:10,color:C.muted,marginBottom:10}}>Ideal: {def.ideal} {def.unit} · <span style={{color:def.color}}>{params[def.key]||"—"} {def.unit} actual</span></div><MiniChart data={chartData} color={def.color} minRef={getLimit(def.key,"min")} maxRef={getLimit(def.key,"max")}/>{chartData.slice(-4).reverse().map((d,i)=><div key={i} style={ss.row}><span style={{fontSize:11,color:C.muted}}>{d.l}</span><span style={{fontSize:12,fontWeight:700,color:def.color}}>{d.v} {def.unit}</span></div>)}</div>
      </div>}
      {tab==="alertas"&&<div style={{padding:"0 16px"}}>
        {allActiveParams.map(p=>{
          const st=getStatus(p.key,params[p.key],customLimits);
          const stC={ok:C.green,warning:C.orange,danger:C.red,neutral:C.muted}[st];
          const stL={ok:"✓ Correcto",warning:"⚠ Atención",danger:"🚨 Crítico",neutral:"— Sin datos"}[st];
          const minVal=getLimit(p.key,"min"), maxVal=getLimit(p.key,"max");
          return <div key={p.key} style={{...ss.card,border:`1px solid ${stC}33`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{p.icon}</span><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{p.label}</div><div style={{fontSize:10,color:C.muted}}>Actual: <span style={{color:stC,fontWeight:700}}>{params[p.key]||"—"} {p.unit}</span></div></div></div><span style={{fontSize:10,background:stC+"22",color:stC,border:`1px solid ${stC}44`,borderRadius:20,padding:"3px 10px",fontWeight:700}}>{stL}</span></div>
            <div style={{display:"flex",gap:8}}><div style={{flex:1,background:C.bg,borderRadius:8,padding:"6px 10px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted}}>Mínimo</div><div style={{fontSize:14,fontWeight:700,color:C.blue}}>{minVal} {p.unit}</div></div><div style={{flex:1,background:"#1c2a1e",borderRadius:8,padding:"6px 10px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted}}>Ideal</div><div style={{fontSize:14,fontWeight:700,color:C.green}}>{p.ideal} {p.unit}</div></div><div style={{flex:1,background:C.bg,borderRadius:8,padding:"6px 10px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted}}>Máximo</div><div style={{fontSize:14,fontWeight:700,color:C.orange}}>{maxVal} {p.unit}</div></div></div>
          </div>;
        })}
      </div>}
    </div>
  );
}

// ── VIDA ──────────────────────────────────────────────────────────────────────
function Vida({ fish, setFish, plants, setPlants, gallery, setGallery }) {
  const [tab, setTab] = useState("peces");
  const [selectedFish, setSelectedFish] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPlantForm, setShowPlantForm] = useState(false);
  const [nf, setNf] = useState({nombre:"",especie:"",cantidad:1,emoji:"🐠",estado:"saludable",adquisicion:"",notas:"",historial:[]});
  const [selectedCatalogFish, setSelectedCatalogFish] = useState("");
  const [selectedCatalogPlant, setSelectedCatalogPlant] = useState("");
  const [newPlant, setNewPlant] = useState({nombre:"",zona:"Libre",estado:"estable",cantidad:1});
  const [lightbox, setLightbox] = useState(null);
  const [newNote, setNewNote] = useState("");
  const gallRef = useRef(); const fishPhotoRef = useRef();
  const eC={saludable:C.green,enfermo:C.red,observacion:C.yellow};
  const pC={creciendo:C.green,estable:C.blue,deteriorando:C.red};
  const toggleE=id=>{const e=["saludable","observacion","enfermo"];setFish(f=>f.map(x=>x.id===id?{...x,estado:e[(e.indexOf(x.estado)+1)%e.length]}:x));};
  const addGallery=e=>{Array.from(e.target.files).forEach(file=>{const r=new FileReader();r.onload=ev=>setGallery(g=>[...g,{id:Date.now()+Math.random(),src:ev.target.result,fecha:today()}]);r.readAsDataURL(file);});};
  const addFishPhoto=e=>{const file=e.target.files[0];if(!file||!selectedFish)return;const r=new FileReader();r.onload=ev=>{setFish(f=>f.map(x=>x.id===selectedFish.id?{...x,foto:ev.target.result}:x));setSelectedFish(s=>({...s,foto:ev.target.result}));};r.readAsDataURL(file);};
  const addHistorialNote=()=>{if(!newNote.trim()||!selectedFish)return;const nota={fecha:today(),texto:newNote};setFish(f=>f.map(x=>x.id===selectedFish.id?{...x,historial:[nota,...(x.historial||[])]}:x));setSelectedFish(s=>({...s,historial:[nota,...(s.historial||[])]}));setNewNote("");};
  const updateFishField=(field,val)=>{setFish(f=>f.map(x=>x.id===selectedFish.id?{...x,[field]:val}:x));setSelectedFish(s=>({...s,[field]:val}));};

  if (selectedFish) {
    const dbInfo = FISH_DB[selectedFish.especie];
    const nivelColor={Principiante:C.green,Intermedio:C.yellow,Avanzado:C.red};
    return (
      <div style={{paddingBottom:90}}>
        {lightbox&&<div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><img src={lightbox} alt="" style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:16,objectFit:"contain"}}/><button onClick={()=>setLightbox(null)} style={{position:"absolute",top:20,right:20,background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",fontSize:18,borderRadius:"50%",width:38,height:38,cursor:"pointer"}}>✕</button></div>}
        <div style={{padding:"0 16px"}}>
          <button onClick={()=>setSelectedFish(null)} style={{background:"none",border:"none",color:C.blue,fontSize:14,cursor:"pointer",marginBottom:14,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4,padding:0}}>← Volver a peces</button>
          <div style={{...ss.card,background:"linear-gradient(135deg,#0f3460,#1e293b)",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
              <div style={{position:"relative"}}>
                {selectedFish.foto?<img src={selectedFish.foto} alt="" onClick={()=>setLightbox(selectedFish.foto)} style={{width:72,height:72,borderRadius:16,objectFit:"cover",cursor:"pointer",border:`2px solid ${C.blue}44`}}/>:<div onClick={()=>fishPhotoRef.current.click()} style={{width:72,height:72,borderRadius:16,background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",border:`2px dashed ${C.border}`}}><span style={{fontSize:28}}>{selectedFish.emoji}</span><span style={{fontSize:9,color:C.muted}}>Añadir foto</span></div>}
                {selectedFish.foto&&<button onClick={()=>fishPhotoRef.current.click()} style={{position:"absolute",bottom:-4,right:-4,background:C.card,border:`1px solid ${C.border}`,borderRadius:"50%",width:22,height:22,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>📷</button>}
                <input ref={fishPhotoRef} type="file" accept="image/*" onChange={addFishPhoto} style={{display:"none"}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:18,fontWeight:800,color:C.text}}>{selectedFish.nombre}</div>
                <div style={{fontSize:11,color:C.muted,fontStyle:"italic",marginBottom:6}}>{selectedFish.especie}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <button onClick={()=>toggleE(selectedFish.id)} style={{fontSize:10,background:(eC[selectedFish.estado]||C.green)+"22",color:eC[selectedFish.estado]||C.green,border:`1px solid ${(eC[selectedFish.estado]||C.green)}44`,borderRadius:20,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit"}}>{selectedFish.estado}</button>
                  {dbInfo&&<span style={{fontSize:10,background:nivelColor[dbInfo.nivel]+"22",color:nivelColor[dbInfo.nivel],border:`1px solid ${nivelColor[dbInfo.nivel]}44`,borderRadius:20,padding:"2px 8px"}}>{dbInfo.nivel}</span>}
                </div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:10,color:C.muted,marginBottom:4}}>Ejemplares</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button onClick={()=>updateFishField("cantidad",Math.max(0,selectedFish.cantidad-1))} style={{width:28,height:28,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>−</button>
                  <div style={{fontSize:26,fontWeight:900,color:C.blue,minWidth:32,textAlign:"center"}}>{selectedFish.cantidad}</div>
                  <button onClick={()=>updateFishField("cantidad",selectedFish.cantidad+1)} style={{width:28,height:28,background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>+</button>
                </div>
              </div>
            </div>
          </div>
          {dbInfo&&<div style={ss.card}>
            <div style={ss.slab}>Ficha de especie</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>{[{l:"Temperatura",v:dbInfo.temp},{l:"pH",v:dbInfo.ph},{l:"Dureza GH",v:dbInfo.gh},{l:"Tamaño adulto",v:dbInfo.tamano}].map(it=>(<div key={it.l} style={{background:C.bg,borderRadius:10,padding:"8px 10px"}}><div style={{fontSize:9,color:C.muted}}>{it.l}</div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{it.v}</div></div>))}</div>
            <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.muted,marginBottom:4}}>DIETA</div><div style={{fontSize:12,color:C.text}}>{dbInfo.dieta}</div></div>
            <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.muted,marginBottom:4}}>COMPATIBILIDAD</div><div style={{fontSize:12,color:C.text}}>{dbInfo.compatibilidad}</div></div>
            <div style={{background:C.bg,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:10,color:C.blue,fontWeight:700,marginBottom:4}}>💡 CURIOSIDADES</div><div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{dbInfo.curiosidades}</div></div>
          </div>}
          <div style={ss.card}>
            <div style={ss.slab}>Mis datos</div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>Fecha de adquisición</div>
            <input type="date" value={selectedFish.adquisicion||""} onChange={e=>updateFishField("adquisicion",e.target.value)} style={{...ss.inp,marginBottom:10}}/>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>Notas personales</div>
            <textarea value={selectedFish.notas||""} onChange={e=>updateFishField("notas",e.target.value)} placeholder="Comportamiento, observaciones..." style={{...ss.inp,height:80,resize:"none"}} rows="3"></textarea>
          </div>
          <div style={ss.card}>
            <div style={ss.slab}>Historial de incidencias</div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Añadir nota o incidencia..." style={{...ss.inp,flex:1,fontSize:13,padding:"9px 12px"}}/>
              <button onClick={addHistorialNote} style={{background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:10,padding:"9px 14px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>+</button>
            </div>
            {(selectedFish.historial||[]).length===0?<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:12}}>Sin incidencias registradas</div>:(selectedFish.historial||[]).map((n,i)=><div key={i} style={{...ss.row,flexDirection:"column",gap:2}}><span style={{fontSize:10,color:C.muted}}>{n.fecha}</span><span style={{fontSize:13,color:C.text}}>{n.texto}</span></div>)}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{paddingBottom:90}}>
      {lightbox&&<div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><img src={lightbox} alt="" style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:16,objectFit:"contain"}}/><button onClick={()=>setLightbox(null)} style={{position:"absolute",top:20,right:20,background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",fontSize:18,borderRadius:"50%",width:38,height:38,cursor:"pointer"}}>✕</button></div>}
      <TabBar tabs={[{id:"peces",label:"🐠 Peces"},{id:"plantas",label:"🌿 Plantas"},{id:"galeria",label:"📷 Galería"}]} active={tab} onChange={setTab} small/>
      {tab==="peces"&&<div style={{padding:"0 16px"}}>
        <div style={{fontSize:12,color:C.muted,marginBottom:12}}>Toca cualquier pez para ver su ficha completa</div>
        {fish.map(f=>(
          <div key={f.id} style={{...ss.card,cursor:"pointer"}} onClick={()=>setSelectedFish(f)}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                {f.foto?<img src={f.foto} alt="" style={{width:44,height:44,borderRadius:10,objectFit:"cover"}}/>:<span style={{fontSize:36}}>{f.emoji}</span>}
                <div><div style={{fontSize:15,fontWeight:800,color:C.text}}>{f.nombre}</div><div style={{fontSize:10,color:C.muted,fontStyle:"italic"}}>{f.especie}</div></div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <button onClick={e=>{e.stopPropagation();setFish(fs=>fs.map(x=>x.id===f.id?{...x,cantidad:Math.max(0,x.cantidad-1)}:x));}} style={{width:24,height:24,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>−</button>
                  <span style={{fontSize:20,fontWeight:900,color:C.blue,minWidth:24,textAlign:"center"}}>{f.cantidad}</span>
                  <button onClick={e=>{e.stopPropagation();setFish(fs=>fs.map(x=>x.id===f.id?{...x,cantidad:x.cantidad+1}:x));}} style={{width:24,height:24,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>+</button>
                </div>
                <button onClick={e=>{e.stopPropagation();toggleE(f.id);}} style={{fontSize:10,background:(eC[f.estado]||C.green)+"22",color:eC[f.estado]||C.green,border:`1px solid ${(eC[f.estado]||C.green)}44`,borderRadius:20,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit"}}>{f.estado}</button>
              </div>
            </div>
            <div style={{marginTop:6,fontSize:10,color:C.blue}}>Ver ficha completa →</div>
          </div>
        ))}
        <button onClick={()=>setShowForm(!showForm)} style={{width:"100%",background:C.card,border:`2px dashed ${C.border}`,borderRadius:14,padding:13,color:C.blue,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Añadir pez</button>
        {showForm&&<div style={{...ss.card,marginTop:10,border:`1px solid ${C.border}`}}>
          <select value={selectedCatalogFish} onChange={e=>{const sel=e.target.value;setSelectedCatalogFish(sel);if(sel&&sel!=="custom"){const found=FISH_CATALOG.find(f=>f.especie===sel);if(found)setNf(n=>({...n,nombre:found.nombre,especie:found.especie,emoji:found.emoji}));}else if(sel==="custom"){setNf(n=>({...n,nombre:"",especie:"",emoji:"🐠"}));}}} style={{...ss.inp,marginBottom:8}}>
            <option value="">— Elige un pez —</option>
            {FISH_CATALOG.map((f,i)=><option key={i} value={f.especie||"custom"}>{f.nombre} {f.especie?"("+f.especie+")":""}</option>)}
          </select>
          {(selectedCatalogFish==="custom"||selectedCatalogFish===""||FISH_CATALOG.find(f=>f.especie===selectedCatalogFish)?.nombre==="Otro (personalizado)")&&<>
            <input value={nf.nombre} onChange={e=>setNf(n=>({...n,nombre:e.target.value}))} placeholder="Nombre común" style={{...ss.inp,marginBottom:8}}/>
            <input value={nf.especie} onChange={e=>setNf(n=>({...n,especie:e.target.value}))} placeholder="Especie" style={{...ss.inp,marginBottom:8}}/>
            <input value={nf.emoji} onChange={e=>setNf(n=>({...n,emoji:e.target.value}))} placeholder="Emoji" style={{...ss.inp,marginBottom:8}}/>
          </>}
          <input value={nf.cantidad} type="number" min="1" onChange={e=>setNf(n=>({...n,cantidad:parseInt(e.target.value)}))} style={{...ss.inp,marginBottom:8}} placeholder="Cantidad"/>
          <button onClick={()=>{if(!nf.nombre)return;setFish(f=>[...f,{...nf,id:Date.now()}]);setShowForm(false);setSelectedCatalogFish("");setNf({nombre:"",especie:"",cantidad:1,emoji:"🐠",estado:"saludable",adquisicion:"",notas:"",historial:[]});}} style={ss.btn}>Guardar</button>
        </div>}
      </div>}
      {tab==="plantas"&&<div style={{padding:"0 16px"}}>
        {plants.map(p=>(
          <div key={p.id} style={{...ss.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:C.text}}>🌿 {p.nombre}</div><div style={{fontSize:11,color:C.muted}}>Zona: {p.zona}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <button onClick={()=>setPlants(ps=>ps.map(x=>x.id===p.id?{...x,cantidad:Math.max(0,x.cantidad-1)}:x))} style={{width:22,height:22,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>−</button>
                <span style={{fontSize:14,fontWeight:700,color:C.green,minWidth:20,textAlign:"center"}}>{p.cantidad||1}</span>
                <button onClick={()=>setPlants(ps=>ps.map(x=>x.id===p.id?{...x,cantidad:(x.cantidad||1)+1}:x))} style={{width:22,height:22,background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>+</button>
              </div>
              <span onClick={()=>setPlants(ps=>{const estados=["creciendo","estable","deteriorando"];return ps.map(x=>x.id===p.id?{...x,estado:estados[(estados.indexOf(x.estado)+1)%estados.length]}:x);})} style={{fontSize:10,background:(({creciendo:C.green,estable:C.blue,deteriorando:C.red})[p.estado]||C.muted)+"22",color:({creciendo:C.green,estable:C.blue,deteriorando:C.red})[p.estado]||C.muted,border:`1px solid ${(({creciendo:C.green,estable:C.blue,deteriorando:C.red})[p.estado]||C.muted)}44`,borderRadius:20,padding:"3px 9px",cursor:"pointer"}}>{p.estado}</span>
              <button onClick={()=>setPlants(ps=>ps.filter(x=>x.id!==p.id))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>✕</button>
            </div>
          </div>
        ))}
        <button onClick={()=>setShowPlantForm(!showPlantForm)} style={{width:"100%",background:C.card,border:`2px dashed ${C.border}`,borderRadius:14,padding:13,color:C.green,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Añadir planta</button>
        {showPlantForm&&<div style={{...ss.card,marginTop:10,border:`1px solid ${C.border}`}}>
          <select value={selectedCatalogPlant} onChange={e=>{const sel=e.target.value;setSelectedCatalogPlant(sel);if(sel&&sel!=="Otra (personalizada)"){const found=PLANT_CATALOG.find(p=>p.nombre===sel);if(found)setNewPlant(n=>({...n,nombre:found.nombre,zona:found.zona}));}else{setNewPlant(n=>({...n,nombre:"",zona:"Libre"}));}}} style={{...ss.inp,marginBottom:8}}>
            <option value="">— Elige una planta —</option>
            {PLANT_CATALOG.map((p,i)=><option key={i} value={p.nombre}>{p.nombre} ({p.zona})</option>)}
          </select>
          {(selectedCatalogPlant===""||selectedCatalogPlant==="Otra (personalizada)")&&<>
            <input value={newPlant.nombre} onChange={e=>setNewPlant(n=>({...n,nombre:e.target.value}))} placeholder="Nombre de la planta" style={{...ss.inp,marginBottom:8}}/>
            <input value={newPlant.zona} onChange={e=>setNewPlant(n=>({...n,zona:e.target.value}))} placeholder="Zona" style={{...ss.inp,marginBottom:8}}/>
          </>}
          <button onClick={()=>{const nombre=newPlant.nombre||selectedCatalogPlant;if(!nombre||nombre==="Otra (personalizada)")return;setPlants(ps=>[...ps,{id:Date.now(),nombre,zona:newPlant.zona||"Libre",estado:"estable",cantidad:1}]);setShowPlantForm(false);setSelectedCatalogPlant("");setNewPlant({nombre:"",zona:"Libre",estado:"estable",cantidad:1});}} style={{...ss.btn,background:"linear-gradient(135deg,#059669,#4ade80)"}}>🌿 Añadir planta</button>
        </div>}
      </div>}
      {tab==="galeria"&&<div style={{padding:"0 16px"}}>
        <button onClick={()=>gallRef.current.click()} style={{...ss.btn,marginBottom:14}}>📷 Añadir foto(s)</button>
        <input ref={gallRef} type="file" accept="image/*" multiple onChange={addGallery} style={{display:"none"}}/>
        {gallery.length===0?<div style={{...ss.card,textAlign:"center",color:C.muted,padding:28}}><div style={{fontSize:36,marginBottom:8}}>🖼️</div>Aún no hay fotos.</div>:<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>{gallery.map(img=><div key={img.id} style={{position:"relative"}}><img src={img.src} alt="" onClick={()=>setLightbox(img.src)} style={{width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:10,cursor:"pointer"}}/><button onClick={()=>setGallery(g=>g.filter(x=>x.id!==img.id))} style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,0.65)",border:"none",color:"#fff",fontSize:10,borderRadius:"50%",width:20,height:20,cursor:"pointer"}}>✕</button></div>)}</div>}
      </div>}
    </div>
  );
}

// ── GRÁFICA AGUA ──────────────────────────────────────────────────────────────
function WaterChart({ cambios }) {
  if (!cambios||cambios.length<1) return <div style={{textAlign:"center",color:C.muted,fontSize:12,padding:20}}>Registra cambios de agua para ver la gráfica</div>;
  const data=cambios.slice(0,20).reverse();
  const W=300,H=110,P=20;
  const maxV=Math.max(...data.map(d=>d.pct),40);
  const x=i=>P+(i/(Math.max(data.length-1,1)))*(W-P*2);
  const y=v=>H-P-(v/maxV)*(H-P*2);
  const pts=data.map((d,i)=>`${x(i)},${y(d.pct)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",overflow:"visible"}}>
      <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.blue} stopOpacity="0.35"/><stop offset="100%" stopColor={C.blue} stopOpacity="0"/></linearGradient></defs>
      <line x1={P} y1={y(30)} x2={W-P} y2={y(30)} stroke={C.green} strokeDasharray="4,4" strokeOpacity="0.5" strokeWidth="1.5"/>
      {data.map((d,i)=>(<rect key={i} x={x(i)-6} y={y(d.pct)} width={12} height={H-P-y(d.pct)} fill={C.blue} fillOpacity="0.15" rx="3"/>))}
      <polygon points={`${x(0)},${H-P} ${pts} ${x(data.length-1)},${H-P}`} fill="url(#wg)"/>
      <polyline points={pts} fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {data.map((d,i)=>(<g key={i}><circle cx={x(i)} cy={y(d.pct)} r="5" fill={d.pct>=25?C.green:d.pct>=15?C.yellow:C.red} stroke="#0f172a" strokeWidth="2"/><text x={x(i)} y={y(d.pct)-8} textAnchor="middle" fill={C.text} fontSize="8" fontWeight="600">{d.pct}%</text></g>))}
      {data.filter((_,i)=>i%Math.ceil(data.length/5)===0).map((d,i)=>(<text key={i} x={x(data.indexOf(d))} y={H-2} textAnchor="middle" fill={C.muted} fontSize="8">{d.fecha?.slice(0,5)}</text>))}
    </svg>
  );
}

// ── EXTRAS ────────────────────────────────────────────────────────────────────
function Extras({ addHistory, history, reminders, setReminders, equipo, setEquipo, mantTasks, setMantTasks }) {
  const [tab, setTab] = useState("rem");
  const [mantTab, setMantTab] = useState("registro");
  const [feedType, setFeedType] = useState("Gránulos");
  const [feedQty, setFeedQty] = useState("normal");
  const [feedNota, setFeedNota] = useState("");
  const [tr, setTr] = useState({pez:"",enf:"",med:"",dosis:"",notas:"",fecha:toISO()});
  const [mnt, setMnt] = useState({fecha:toISO(),pct:"",notas:"",tareas:Object.fromEntries(Object.keys(mantTasks).map(k=>[k,false]))});
  const [newRem, setNewRem] = useState({titulo:"",fecha:"",hora:"",repetir:"nunca",cat:"general"});
  const [showExtraTasks, setShowExtraTasks] = useState(false);
  const [customTaskInput, setCustomTaskInput] = useState("");
  const [showAddEquipo, setShowAddEquipo] = useState(false);
  const [newEquipoName, setNewEquipoName] = useState("");
  const remColors={general:C.blue,medicacion:C.red,agua:C.green,alimentacion:C.orange};
  const equipoEstados=["activo","inactivo","avería"];
  const equipoEstadoColor={activo:C.green,inactivo:C.muted,avería:C.red};
  const cambiosAgua=history.filter(h=>h.tipo==="mantenimiento"&&h.tareas?.agua&&h.porcentaje).map(h=>({fecha:h.fecha,pct:parseFloat(h.porcentaje),notas:h.notas||""}));
  const totalCambios=cambiosAgua.length;
  const pctPromedio=totalCambios>0?(cambiosAgua.reduce((s,c)=>s+c.pct,0)/totalCambios).toFixed(1):0;
  const litrosPromedio=totalCambios>0?((parseFloat(pctPromedio)/100)*300).toFixed(0):0;
  const ultimoCambio=cambiosAgua[0];
  const diasDesdeUltimo=ultimoCambio?Math.floor((new Date()-new Date(ultimoCambio.fecha.includes("/")?ultimoCambio.fecha.split("/").reverse().join("-"):ultimoCambio.fecha))/(1000*60*60*24)):null;
  const addCustomTask=()=>{if(!customTaskInput.trim())return;const key="custom_"+Date.now();setMantTasks(prev=>({...prev,[key]:customTaskInput.trim()}));setMnt(m=>({...m,tareas:{...m.tareas,[key]:false}}));setCustomTaskInput("");};
  const addExtraTask=(label)=>{const key="extra_"+label.replace(/[^a-zA-Z0-9]/g,"");if(mantTasks[key])return;setMantTasks(prev=>({...prev,[key]:label}));setMnt(m=>({...m,tareas:{...m.tareas,[key]:false}}));};

  return (
    <div style={{paddingBottom:90}}>
      <TabBar tabs={[{id:"rem",label:"🔔 Rec."},{id:"ali",label:"🍽️ Com."},{id:"tra",label:"💊 Trat."},{id:"man",label:"🔧 Mant."}]} active={tab} onChange={setTab} small/>
      {tab==="rem"&&<div style={{padding:"0 16px"}}>
        <div style={ss.card}>
          <div style={ss.slab}>Nuevo recordatorio</div>
          <input value={newRem.titulo} onChange={e=>setNewRem(r=>({...r,titulo:e.target.value}))} placeholder="Ej: Cambio de agua semanal" style={{...ss.inp,marginBottom:8}}/>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <div style={{flex:1}}><div style={{fontSize:10,color:C.muted,marginBottom:4}}>Fecha</div><input type="date" value={newRem.fecha} onChange={e=>setNewRem(r=>({...r,fecha:e.target.value}))} style={ss.inp}/></div>
            <div style={{flex:1}}><div style={{fontSize:10,color:C.muted,marginBottom:4}}>Hora</div><input type="time" value={newRem.hora} onChange={e=>setNewRem(r=>({...r,hora:e.target.value}))} style={ss.inp}/></div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:8}}>{["general","agua","medicacion","alimentacion"].map(c=><button key={c} onClick={()=>setNewRem(r=>({...r,cat:c}))} style={{flex:1,background:newRem.cat===c?remColors[c]+"33":C.bg,border:`1px solid ${newRem.cat===c?remColors[c]:C.border}`,borderRadius:8,padding:"6px 2px",color:newRem.cat===c?remColors[c]:C.muted,fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{c}</button>)}</div>
          <select value={newRem.repetir} onChange={e=>setNewRem(r=>({...r,repetir:e.target.value}))} style={{...ss.inp,marginBottom:10,fontSize:13}}><option value="nunca">Sin repetición</option><option value="diario">Diario</option><option value="semanal">Semanal</option><option value="mensual">Mensual</option></select>
          <button onClick={()=>{if(!newRem.titulo)return;setReminders(r=>[...r,{...newRem,id:Date.now(),done:false}]);setNewRem({titulo:"",fecha:"",hora:"",repetir:"nunca",cat:"general"});}} style={ss.btn}>🔔 Añadir</button>
        </div>
        {reminders.filter(r=>!r.done).map(r=><div key={r.id} style={{...ss.card,border:`1px solid ${remColors[r.cat]||C.border}33`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.titulo}</div><div style={{fontSize:10,color:C.muted}}>{r.fecha&&`📅 ${r.fecha}`}{r.hora&&` 🕐 ${r.hora}`}{r.repetir!=="nunca"&&` · 🔁 ${r.repetir}`}</div></div>
          <button onClick={()=>setReminders(rem=>rem.map(x=>x.id===r.id?{...x,done:true}:x))} style={{background:"#1c2a1e",border:`1px solid ${C.green}`,borderRadius:8,padding:"5px 9px",color:C.green,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✓</button>
          <button onClick={()=>setReminders(rem=>rem.filter(x=>x.id!==r.id))} style={{background:"#2a1e1e",border:`1px solid ${C.red}`,borderRadius:8,padding:"5px 9px",color:C.red,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
        </div>)}
      </div>}
      {tab==="ali"&&<div style={{padding:"0 16px"}}>
        <div style={ss.card}><div style={{fontSize:11,color:C.muted,marginBottom:8}}>Tipo de alimento</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{FEED_TYPES.map(t=><button key={t} onClick={()=>setFeedType(t)} style={{background:feedType===t?"#0ea5e933":C.bg,border:`1px solid ${feedType===t?"#38bdf8":C.border}`,borderRadius:20,padding:"6px 12px",color:feedType===t?C.blue:C.muted,fontSize:12,fontWeight:feedType===t?700:400,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>)}</div></div>
        <div style={ss.card}><div style={{fontSize:11,color:C.muted,marginBottom:8}}>Cantidad</div><div style={{display:"flex",gap:8}}>{["poco","normal","abundante"].map(q=><button key={q} onClick={()=>setFeedQty(q)} style={{flex:1,background:feedQty===q?"#0ea5e933":C.bg,border:`1px solid ${feedQty===q?"#38bdf8":C.border}`,borderRadius:10,padding:9,color:feedQty===q?C.blue:C.muted,fontWeight:700,fontSize:12,cursor:"pointer",textTransform:"capitalize",fontFamily:"inherit"}}>{q}</button>)}</div></div>
        <div style={ss.card}><textarea value={feedNota} onChange={e=>setFeedNota(e.target.value)} placeholder="Notas..." style={{...ss.inp,height:60,resize:"none"}}></textarea></div>
        <button onClick={()=>{addHistory({tipo:"alimentacion",fecha:today(),tipo_alimento:feedType,cantidad:feedQty,notas:feedNota});setFeedNota("");alert("✅ Registrado");}} style={ss.btn}>🍽️ Registrar comida</button>
        {history.filter(h=>h.tipo==="alimentacion").slice(0,4).length>0&&<div style={{...ss.card,marginTop:14}}><div style={ss.slab}>Últimas comidas</div>{history.filter(h=>h.tipo==="alimentacion").slice(0,4).map((h,i)=><div key={i} style={ss.row}><span style={{fontSize:11,color:C.muted}}>{h.fecha}</span><span style={{fontSize:12,color:C.blue}}>{h.tipo_alimento} · {h.cantidad}</span></div>)}</div>}
      </div>}
      {tab==="tra"&&<div style={{padding:"0 16px"}}>
        <div style={ss.card}><div style={{fontSize:11,color:C.muted,marginBottom:6}}>Fecha</div><input type="date" value={tr.fecha} onChange={e=>setTr(t=>({...t,fecha:e.target.value}))} style={ss.inp}/></div>
        <div style={ss.card}><div style={{fontSize:11,color:C.muted,marginBottom:6}}>Pez(es) afectado(s)</div><input value={tr.pez} onChange={e=>setTr(t=>({...t,pez:e.target.value}))} placeholder="Ej: Disco #3..." style={ss.inp}/></div>
        <div style={ss.card}><div style={{fontSize:11,color:C.muted,marginBottom:6}}>Enfermedad / síntoma</div><input value={tr.enf} onChange={e=>setTr(t=>({...t,enf:e.target.value}))} placeholder="Ej: Ich, hongos..." style={ss.inp}/></div>
        <div style={{display:"flex",gap:8}}><div style={{...ss.card,flex:1}}><div style={{fontSize:11,color:C.muted,marginBottom:6}}>Medicamento</div><input value={tr.med} onChange={e=>setTr(t=>({...t,med:e.target.value}))} placeholder="Nombre" style={ss.inp}/></div><div style={{...ss.card,flex:1}}><div style={{fontSize:11,color:C.muted,marginBottom:6}}>Dosis</div><input value={tr.dosis} onChange={e=>setTr(t=>({...t,dosis:e.target.value}))} placeholder="ml/L" style={ss.inp}/></div></div>
        <div style={ss.card}><textarea value={tr.notas} onChange={e=>setTr(t=>({...t,notas:e.target.value}))} placeholder="Notas..." style={{...ss.inp,height:60,resize:"none"}}></textarea></div>
        <button onClick={()=>{if(!tr.enf)return;addHistory({tipo:"tratamiento",fecha:tr.fecha,pez:tr.pez,enfermedad:tr.enf,medicamento:tr.med,dosis:tr.dosis,notas:tr.notas});setTr({pez:"",enf:"",med:"",dosis:"",notas:"",fecha:toISO()});alert("💊 Registrado");}} style={{...ss.btn,background:"linear-gradient(135deg,#be185d,#f43f5e)"}}>💊 Guardar tratamiento</button>
      </div>}
      {tab==="man"&&<div style={{padding:"0 16px"}}>
        <div style={{display:"flex",background:"#162032",borderRadius:10,padding:3,gap:3,marginBottom:14}}>
          {[{id:"registro",label:"📝 Registro"},{id:"historial",label:"🔄 Historial agua"}].map(t=><button key={t.id} onClick={()=>setMantTab(t.id)} style={{flex:1,background:mantTab===t.id?"#0ea5e9":"transparent",border:"none",borderRadius:8,padding:"8px 4px",color:mantTab===t.id?"#fff":C.muted,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{t.label}</button>)}
        </div>
        {mantTab==="registro"&&<>
          <div style={ss.card}><div style={{fontSize:11,color:C.muted,marginBottom:6}}>Fecha</div><input type="date" value={mnt.fecha} onChange={e=>setMnt(m=>({...m,fecha:e.target.value}))} style={ss.inp}/></div>
          <div style={ss.card}>
            <div style={ss.slab}>Tareas realizadas</div>
            {Object.entries(mantTasks).map(([k,label])=>(
              <div key={k} onClick={()=>setMnt(m=>({...m,tareas:{...m.tareas,[k]:!m.tareas[k]}}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid #1a2540`,cursor:"pointer"}}>
                <span style={{fontSize:13,color:mnt.tareas[k]?C.text:C.muted}}>{label}</span>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {(k.startsWith("custom_")||k.startsWith("extra_"))&&<button onClick={e=>{e.stopPropagation();setMantTasks(prev=>{const n={...prev};delete n[k];return n;});setMnt(m=>{const t={...m.tareas};delete t[k];return{...m,tareas:t};});}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>✕</button>}
                  <div style={{width:22,height:22,borderRadius:6,background:mnt.tareas[k]?"#0ea5e9":C.bg,border:`2px solid ${mnt.tareas[k]?"#0ea5e9":C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{mnt.tareas[k]&&<span style={{color:"#fff",fontSize:13,fontWeight:900}}>✓</span>}</div>
                </div>
              </div>
            ))}
            <div style={{marginTop:12}}>
              <button onClick={()=>setShowExtraTasks(!showExtraTasks)} style={{width:"100%",background:C.bg,border:`1px dashed ${C.border}`,borderRadius:8,padding:"8px",color:C.blue,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{showExtraTasks?"▲ Ocultar":"➕ Más tareas"}</button>
              {showExtraTasks&&<div style={{marginTop:8}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>{MANT_TASKS_EXTRA.filter(t=>!Object.values(mantTasks).includes(t)).map((t,i)=><button key={i} onClick={()=>addExtraTask(t)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:20,padding:"5px 10px",color:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>)}</div>
                <div style={{display:"flex",gap:6}}><input value={customTaskInput} onChange={e=>setCustomTaskInput(e.target.value)} placeholder="Tarea personalizada..." style={{...ss.inp,flex:1,fontSize:12,padding:"8px 12px"}} onKeyDown={e=>e.key==="Enter"&&addCustomTask()}/><button onClick={addCustomTask} style={{background:"#0ea5e9",border:"none",borderRadius:8,padding:"8px 14px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>+</button></div>
              </div>}
            </div>
          </div>
          {mnt.tareas.agua&&<div style={ss.card}><div style={{fontSize:11,color:C.muted,marginBottom:6}}>% agua cambiada</div><input type="number" min="0" max="100" value={mnt.pct} onChange={e=>setMnt(m=>({...m,pct:e.target.value}))} placeholder="ej: 30" style={ss.inp}/></div>}
          <div style={ss.card}><textarea value={mnt.notas} onChange={e=>setMnt(m=>({...m,notas:e.target.value}))} placeholder="Observaciones..." style={{...ss.inp,height:60,resize:"none"}}></textarea></div>
          <div style={ss.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={ss.slab}>🔧 Equipo</div><button onClick={()=>setShowAddEquipo(!showAddEquipo)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"3px 10px",color:C.blue,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>+ Añadir</button></div>
            {equipo.map(eq=>(<div key={eq.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid #1a2540`}}><div style={{flex:1,fontSize:12,color:C.text}}>{eq.nombre}</div><button onClick={()=>{const estados=equipoEstados;setEquipo(prev=>prev.map(x=>x.id===eq.id?{...x,estado:estados[(estados.indexOf(x.estado)+1)%estados.length]}:x));}} style={{fontSize:10,background:equipoEstadoColor[eq.estado]+"22",color:equipoEstadoColor[eq.estado],border:`1px solid ${equipoEstadoColor[eq.estado]}44`,borderRadius:20,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit"}}>● {eq.estado}</button><button onClick={()=>setEquipo(prev=>prev.filter(x=>x.id!==eq.id))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>✕</button></div>))}
            {showAddEquipo&&<div style={{marginTop:10,display:"flex",gap:6}}><input value={newEquipoName} onChange={e=>setNewEquipoName(e.target.value)} placeholder="Nombre del equipo..." style={{...ss.inp,flex:1,fontSize:12,padding:"8px 12px"}} onKeyDown={e=>e.key==="Enter"&&newEquipoName.trim()&&(setEquipo(prev=>[...prev,{id:Date.now(),nombre:newEquipoName.trim(),estado:"activo"}]),setNewEquipoName(""),setShowAddEquipo(false))}/><button onClick={()=>{if(!newEquipoName.trim())return;setEquipo(prev=>[...prev,{id:Date.now(),nombre:newEquipoName.trim(),estado:"activo"}]);setNewEquipoName("");setShowAddEquipo(false);}} style={{background:"#0ea5e9",border:"none",borderRadius:8,padding:"8px 14px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>+</button></div>}
          </div>
          <button onClick={()=>{const tareasRealizadas=Object.entries(mnt.tareas).filter(([,v])=>v).map(([k])=>mantTasks[k]||k).join(", ");addHistory({tipo:"mantenimiento",fecha:mnt.fecha,tareas:{...mnt.tareas},tareasTexto:tareasRealizadas,porcentaje:mnt.pct,notas:mnt.notas});setMnt(m=>({...m,notas:"",pct:"",tareas:Object.fromEntries(Object.keys(mantTasks).map(k=>[k,false]))}));alert("✅ Registrado");}} style={ss.btn}>💾 Guardar mantenimiento</button>
        </>}
        {mantTab==="historial"&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div style={{...ss.card,marginBottom:0,background:"linear-gradient(135deg,#0c2340,#1e293b)",border:`1px solid ${C.blue}33`}}><div style={{fontSize:10,color:C.blue,fontWeight:700,marginBottom:2}}>TOTAL CAMBIOS</div><div style={{fontSize:28,fontWeight:900,color:C.blue}}>{totalCambios}</div></div>
            <div style={{...ss.card,marginBottom:0,background:"linear-gradient(135deg,#0c2a1a,#1e293b)",border:`1px solid ${C.green}33`}}><div style={{fontSize:10,color:C.green,fontWeight:700,marginBottom:2}}>% PROMEDIO</div><div style={{fontSize:28,fontWeight:900,color:C.green}}>{pctPromedio}<span style={{fontSize:14}}>%</span></div></div>
            <div style={{...ss.card,marginBottom:0}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:2}}>LITROS PROM.</div><div style={{fontSize:22,fontWeight:900,color:C.text}}>{litrosPromedio}<span style={{fontSize:12,color:C.muted}}> L</span></div></div>
            <div style={{...ss.card,marginBottom:0,border:`1px solid ${diasDesdeUltimo!==null&&diasDesdeUltimo>7?C.red+"44":C.green+"44"}`}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:2}}>ÚLTIMO HACE</div><div style={{fontSize:22,fontWeight:900,color:diasDesdeUltimo!==null&&diasDesdeUltimo>7?C.red:C.green}}>{diasDesdeUltimo!==null?`${diasDesdeUltimo}d`:"—"}</div>{diasDesdeUltimo!==null&&diasDesdeUltimo>7&&<div style={{fontSize:9,color:C.red,marginTop:2}}>⚠ Hace más de 1 semana</div>}</div>
          </div>
          <div style={ss.card}><WaterChart cambios={cambiosAgua}/></div>
          <div style={ss.card}><div style={ss.slab}>Todos los cambios</div>{cambiosAgua.length===0?<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:16}}>Sin cambios registrados</div>:cambiosAgua.map((c,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:`1px solid #1a2540`}}><div style={{width:42,height:42,borderRadius:12,background:c.pct>=25?"#1c2a1e":c.pct>=15?"#2a2a1e":"#2a1e1e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}><div style={{fontSize:14,fontWeight:900,color:c.pct>=25?C.green:c.pct>=15?C.yellow:C.red,lineHeight:1}}>{c.pct}%</div><div style={{fontSize:8,color:C.muted}}>{Math.round(c.pct/100*300)}L</div></div><div style={{flex:1}}><div style={{fontSize:12,color:C.text,fontWeight:600}}>{c.fecha}</div>{c.notas&&<div style={{fontSize:10,color:C.muted,marginTop:1}}>{c.notas}</div>}</div></div>))}</div>
        </>}
      </div>}
    </div>
  );
}

// ── IA + INFORME + GASTOS + CALENDARIO ────────────────────────────────────────
function IA({ params, fish, history, expenses, setExpenses, reminders, mantTasks }) {
  const [tab, setTab] = useState("chat");
  // FIX #4: IA - mensajes y estado
  const [msgs, setMsgs] = useState([{role:"assistant",text:"¡Hola! 🐠 Soy tu asistente de acuariofilia. Conozco tu acuario amazónico de 300L con discos, ramirezi, neones, corydoras y ancistrus.\n\nPregúntame sobre parámetros, enfermedades, plantas o cualquier duda."}]);
  const [input, setInput] = useState(""); 
  const [loading, setLoading] = useState(false);
  const endRef = useRef();
  const [newExp, setNewExp] = useState({concepto:"",importe:"",categoria:"alimento",fecha:toISO()});
  const [expFilter, setExpFilter] = useState("all");
  const [calDate, setCalDate] = useState(new Date());
  // FIX #3: día seleccionado en calendario
  const [selectedDay, setSelectedDay] = useState(null);
  const [reportMonth, setReportMonth] = useState(new Date().getMonth()===0?11:new Date().getMonth()-1);
  const [reportYear, setReportYear] = useState(new Date().getMonth()===0?new Date().getFullYear()-1:new Date().getFullYear());

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const generateReport=(month,year)=>{
    const isInMonth=(fechaStr)=>{try{const d=new Date(fechaStr.includes("/")?fechaStr.split("/").reverse().join("-"):fechaStr);return d.getMonth()===month&&d.getFullYear()===year;}catch{return false;}};
    const mHistory=history.filter(h=>isInMonth(h.fecha));
    const mParams=mHistory.filter(h=>h.tipo==="parametros");
    const mMant=mHistory.filter(h=>h.tipo==="mantenimiento");
    const mFeed=mHistory.filter(h=>h.tipo==="alimentacion");
    const mTreat=mHistory.filter(h=>h.tipo==="tratamiento");
    const mExp=expenses.filter(e=>isInMonth(e.fecha));
    const prevMonth=month===0?11:month-1, prevYear=month===0?year-1:year;
    const prevExp=expenses.filter(e=>{try{const d=new Date(e.fecha.includes("/")?e.fecha.split("/").reverse().join("-"):e.fecha);return d.getMonth()===prevMonth&&d.getFullYear()===prevYear;}catch{return false;}});
    const totalExp=mExp.reduce((s,e)=>s+parseFloat(e.importe||0),0);
    const prevTotalExp=prevExp.reduce((s,e)=>s+parseFloat(e.importe||0),0);
    const paramStats=PARAM_DEFS.map(p=>{const values=mParams.map(h=>parseFloat(h.datos?.[p.key])).filter(v=>!isNaN(v));if(!values.length)return{...p,min:null,max:null,avg:null,outOfRange:0};const min=Math.min(...values),max=Math.max(...values),avg=values.reduce((a,b)=>a+b,0)/values.length;const outOfRange=values.filter(v=>getStatus(p.key,v)==="danger"||getStatus(p.key,v)==="warning").length;return{...p,min,max,avg:avg.toFixed(2),outOfRange,total:values.length};});
    const cambiosAgua=mMant.filter(m=>m.tareas?.agua).length;
    const pctPromedio=mMant.filter(m=>m.tareas?.agua&&m.porcentaje).reduce((s,m,_,a)=>s+parseFloat(m.porcentaje)/a.length,0);
    return{month,year,mParams,mMant,mFeed,mTreat,mExp,totalExp,prevTotalExp,paramStats,cambiosAgua,pctPromedio,fishStatus:fish};
  };
  const report=generateReport(reportMonth,reportYear);

  const year=calDate.getFullYear(), month=calDate.getMonth();
  const firstDay=(new Date(year,month,1).getDay()+6)%7;
  const daysInMonth=new Date(year,month+1,0).getDate();
  const tipoColor={alimentacion:C.green,mantenimiento:C.orange,tratamiento:C.red,recordatorio:"#a78bfa",gasto:"#fbbf24"};
  const allEvents=[
    ...history.filter(h=>["mantenimiento","alimentacion","tratamiento"].includes(h.tipo)),
    ...reminders.map(r=>({...r,tipo:"recordatorio",fecha:r.fecha})),
    ...expenses.map(e=>({...e,tipo:"gasto"}))
  ];

  // Normalizar fecha a "YYYY-MM-DD"
  const normFecha=(f)=>{if(!f)return"";try{if(f.includes("/"))return f.split("/").reverse().join("-");return f.slice(0,10);}catch{return"";}};

  const getEventsForDay=(day)=>{
    const ds=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return allEvents.filter(e=>normFecha(e.fecha)===ds);
  };

  const filteredExp=expFilter==="all"?expenses:expenses.filter(e=>e.categoria===expFilter);
  const totalAll=expenses.reduce((s,e)=>s+parseFloat(e.importe||0),0);
  const thisMonthExp=expenses.filter(e=>{try{const d=new Date(e.fecha);return d.getMonth()===new Date().getMonth()&&d.getFullYear()===new Date().getFullYear();}catch{return false;}});
  const totalMonth=thisMonthExp.reduce((s,e)=>s+parseFloat(e.importe||0),0);

  // FIX #4: contexto IA
  const ctx=()=>{
    const lp=history.find(h=>h.tipo==="parametros");
    const ps=lp?PARAM_DEFS.map(p=>`${p.label}: ${lp.datos?.[p.key]||"sin dato"} ${p.unit}`).join(", "):"sin registros";
    return `Eres experto en acuariofilia tropical, especialmente discos (Symphysodon). Acuario amazónico 300L, filtros Oase 300 + Ultramax 2000, calentador Chihiros, CO2. Peces: 8 discos, 6 ramirezi, 8 neones, 9 corydoras, 4 ancistrus. Plantas: rótalas, criptocorinas, Tenellum. Parámetros actuales: ${ps}. Responde en español, conciso, máximo 3 párrafos.`;
  };

  // FIX #4: función send corregida
  const send=async(text)=>{
    const msg=text||input.trim();
    if(!msg||loading)return;
    setInput(""); setLoading(true);
    const newMsgs=[...msgs,{role:"user",text:msg}];
    setMsgs([...newMsgs,{role:"assistant",text:"•••"}]);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "anthropic-dangerous-direct-browser-access":"true"
        },
        body:JSON.stringify({
          model:"claude-opus-4-6",
          max_tokens:800,
          system:ctx(),
          messages:newMsgs.map(m=>({role:m.role,content:m.text}))
        })
      });
      if(!res.ok){
        const err=await res.text();
        throw new Error(`HTTP ${res.status}: ${err}`);
      }
      const data=await res.json();
      const respText=data.content?.[0]?.text||"Sin respuesta.";
      setMsgs([...newMsgs,{role:"assistant",text:respText}]);
    }catch(e){
      console.error("IA error:",e);
      setMsgs([...newMsgs,{role:"assistant",text:`❌ Error al conectar con la IA. Detalles: ${e.message}`}]);
    }
    setLoading(false);
  };

  const quickQ=["¿Están bien mis parámetros?","Enfermedades comunes en discos","Consejos para CO2","¿Puedo añadir más peces?"];
  const exportCSV=()=>{const rows=[["Fecha","Tipo","Temp","pH","GH","KH","Amonio","Nitritos","Nitratos","CO2","Notas"]];history.forEach(h=>{if(h.tipo==="parametros")rows.push([h.fecha,"Parámetros",...PARAM_DEFS.map(p=>h.datos?.[p.key]||""),""]);else rows.push([h.fecha,h.tipo,"","","","","","","","",h.notas||h.enfermedad||h.tipo_alimento||""]);});const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"}));a.download="aqualog.csv";a.click();};
  const eC={saludable:C.green,enfermo:C.red,observacion:C.yellow};
  const getEventLabel=(e)=>{if(e.tipo==="mantenimiento")return e.tareasTexto||"Mantenimiento";if(e.tipo==="alimentacion")return`🍽️ ${e.tipo_alimento||""} (${e.cantidad||""})`;if(e.tipo==="tratamiento")return`💊 ${e.enfermedad||"Tratamiento"}`;if(e.tipo==="recordatorio")return`🔔 ${e.titulo||"Recordatorio"}`;if(e.tipo==="gasto")return`💰 ${e.concepto||"Gasto"} (${parseFloat(e.importe||0).toFixed(2)}€)`;return e.tipo;};

  return (
    <div style={{paddingBottom:90}}>
      <TabBar tabs={[{id:"chat",label:"🤖 IA"},{id:"informe",label:"📊 Informe"},{id:"cal",label:"📅 Cal."},{id:"gastos",label:"💰 €"}]} active={tab} onChange={setTab} small/>

      {tab==="chat"&&<div style={{padding:"0 16px"}}>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:10,marginBottom:4,scrollbarWidth:"none"}}>{quickQ.map((q,i)=><button key={i} onClick={()=>send(q)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"6px 13px",color:C.blue,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,fontFamily:"inherit"}}>{q}</button>)}</div>
        <div style={{...ss.card,padding:0,overflow:"hidden"}}>
          <div style={{height:300,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
            {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:6}}>
              {m.role==="assistant"&&<DiscusFish size={20} color={C.blue}/>}
              <div style={{maxWidth:"82%",background:m.role==="user"?"linear-gradient(135deg,#0ea5e9,#38bdf8)":C.bg,borderRadius:m.role==="user"?"16px 16px 3px 16px":"16px 16px 16px 3px",padding:"9px 13px",fontSize:13,color:C.text,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{m.text}</div>
            </div>)}
            {loading&&<div style={{display:"flex",alignItems:"center",gap:6}}><DiscusFish size={20} color={C.blue}/><div style={{background:C.bg,borderRadius:"16px 16px 16px 3px",padding:"9px 13px",fontSize:13,color:C.muted}}>Pensando...</div></div>}
            <div ref={endRef}/>
          </div>
          <div style={{borderTop:`1px solid ${C.card}`,padding:"10px 12px",display:"flex",gap:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!loading&&send()} placeholder="Pregunta sobre tu acuario..." style={{...ss.inp,flex:1,fontSize:13,padding:"9px 12px"}}/>
            <button onClick={()=>send()} disabled={loading||!input.trim()} style={{background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:10,padding:"9px 16px",color:"#fff",fontWeight:800,fontSize:17,cursor:"pointer",opacity:loading||!input.trim()?0.4:1,fontFamily:"inherit"}}>→</button>
          </div>
        </div>
        <button onClick={exportCSV} style={{...ss.btn,marginTop:10,background:"linear-gradient(135deg,#7c3aed,#a78bfa)"}}>📤 Exportar CSV</button>
      </div>}

      {tab==="informe"&&<div style={{padding:"0 16px"}}>
        <div style={{...ss.card,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>{if(reportMonth===0){setReportMonth(11);setReportYear(y=>y-1);}else setReportMonth(m=>m-1);}} style={{background:"none",border:"none",color:C.blue,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>‹</button>
          <div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:700,color:C.text}}>{MESES[reportMonth]} {reportYear}</div><div style={{fontSize:10,color:C.muted}}>Informe mensual</div></div>
          <button onClick={()=>{if(reportMonth===11){setReportMonth(0);setReportYear(y=>y+1);}else setReportMonth(m=>m+1);}} style={{background:"none",border:"none",color:C.blue,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>›</button>
        </div>
        {report.mParams.length===0&&report.mMant.length===0&&report.mFeed.length===0
          ?<div style={{...ss.card,textAlign:"center",color:C.muted,padding:32}}><div style={{fontSize:40,marginBottom:8}}>📊</div>Sin datos para {MESES[reportMonth]} {reportYear}</div>
          :<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>{[{l:"Mediciones",v:report.mParams.length,i:"📊",c:C.blue},{l:"Mantenimientos",v:report.mMant.length,i:"🔧",c:C.orange},{l:"Comidas",v:report.mFeed.length,i:"🍽️",c:C.green},{l:"Tratamientos",v:report.mTreat.length,i:"💊",c:C.red}].map(it=><div key={it.l} style={{background:C.card,borderRadius:12,padding:"12px",border:`1px solid ${it.c}22`}}><div style={{fontSize:18,marginBottom:4}}>{it.i}</div><div style={{fontSize:10,color:C.muted}}>{it.l}</div><div style={{fontSize:22,fontWeight:800,color:it.c}}>{it.v}</div></div>)}</div>
            <div style={ss.card}><div style={ss.slab}>Parámetros del mes</div>{report.paramStats.filter(p=>p.avg!==null).map(p=>(<div key={p.key} style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid #1a2540`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,color:C.text}}>{p.icon} {p.label}</span><span style={{fontSize:11,fontWeight:700,color:p.outOfRange>0?C.orange:C.green}}>{p.outOfRange>0?`⚠ ${p.outOfRange}/${p.total} fuera de rango`:`✓ ${p.total} mediciones`}</span></div><div style={{display:"flex",gap:6}}><div style={{flex:1,background:C.bg,borderRadius:8,padding:"5px 8px",textAlign:"center"}}><div style={{fontSize:8,color:C.muted}}>MIN</div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{p.min}</div></div><div style={{flex:1,background:"#1c2a1e",borderRadius:8,padding:"5px 8px",textAlign:"center"}}><div style={{fontSize:8,color:C.muted}}>MEDIA</div><div style={{fontSize:12,fontWeight:700,color:C.green}}>{p.avg}</div></div><div style={{flex:1,background:C.bg,borderRadius:8,padding:"5px 8px",textAlign:"center"}}><div style={{fontSize:8,color:C.muted}}>MAX</div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{p.max}</div></div></div></div>))}{report.paramStats.every(p=>p.avg===null)&&<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:12}}>Sin mediciones este mes</div>}</div>
            <div style={ss.card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={ss.slab}>Gastos</div><div style={{fontSize:16,fontWeight:800,color:"#a78bfa"}}>{report.totalExp.toFixed(2)} €</div></div>{report.prevTotalExp>0&&<div style={{fontSize:11,color:C.muted,marginBottom:10}}>Mes anterior: {report.prevTotalExp.toFixed(2)} € {report.totalExp>report.prevTotalExp?`(+${(report.totalExp-report.prevTotalExp).toFixed(2)} €)`:`(-${(report.prevTotalExp-report.totalExp).toFixed(2)} €)`}</div>}{EXPENSE_CATS.map(cat=>{const t=report.mExp.filter(e=>e.categoria===cat.id).reduce((s,e)=>s+parseFloat(e.importe||0),0);if(!t)return null;return <div key={cat.id} style={ss.row}><span style={{fontSize:12,color:C.text}}>{cat.icon} {cat.label}</span><span style={{fontSize:12,fontWeight:700,color:cat.color}}>{t.toFixed(2)} €</span></div>;})}
            {report.mExp.length===0&&<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:8}}>Sin gastos</div>}</div>
          </>
        }
      </div>}

      {/* FIX #3: CALENDARIO INTERACTIVO */}
      {tab==="cal"&&<div style={{padding:"0 16px"}}>
        <div style={{...ss.card,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>{setCalDate(d=>new Date(d.getFullYear(),d.getMonth()-1,1));setSelectedDay(null);}} style={{background:"none",border:"none",color:C.blue,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>‹</button>
          <div style={{fontSize:15,fontWeight:700,color:C.text}}>{MESES[month]} {year}</div>
          <button onClick={()=>{setCalDate(d=>new Date(d.getFullYear(),d.getMonth()+1,1));setSelectedDay(null);}} style={{background:"none",border:"none",color:C.blue,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>›</button>
        </div>

        {/* Grid del calendario */}
        <div style={ss.card}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6}}>{DIAS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:C.muted,fontWeight:700,padding:"4px 0"}}>{d}</div>)}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {Array(firstDay).fill(null).map((_,i)=><div key={"e"+i}/>)}
            {Array(daysInMonth).fill(null).map((_,i)=>{
              const day=i+1;
              const devs=getEventsForDay(day);
              const isToday=new Date().getDate()===day&&new Date().getMonth()===month&&new Date().getFullYear()===year;
              const isSelected=selectedDay===day;
              return (
                <div key={day}
                  onClick={()=>setSelectedDay(isSelected?null:day)}
                  style={{
                    textAlign:"center",padding:"5px 2px",borderRadius:8,cursor:"pointer",
                    background:isSelected?"#0ea5e9":isToday?"#0ea5e922":"transparent",
                    border:isSelected?`2px solid ${C.blue}`:isToday?`1px solid ${C.blue}`:"1px solid transparent",
                    transition:"background 0.15s"
                  }}
                >
                  <div style={{fontSize:11,color:isSelected?"#fff":isToday?C.blue:C.text,fontWeight:isSelected||isToday?700:400}}>{day}</div>
                  <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:1,marginTop:2}}>
                    {devs.slice(0,3).map((e,j)=><div key={j} style={{width:5,height:5,borderRadius:"50%",background:isSelected?"rgba(255,255,255,0.7)":tipoColor[e.tipo]||C.muted}}/>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leyenda */}
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>{Object.entries(tipoColor).map(([t,c])=><div key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.muted}}><div style={{width:7,height:7,borderRadius:"50%",background:c}}/>{t}</div>)}</div>

        {/* FIX #3: Panel del día seleccionado */}
        {selectedDay&&(()=>{
          const dayEvs=getEventsForDay(selectedDay);
          return (
            <div style={{...ss.card,border:`2px solid ${C.blue}55`,marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:14,fontWeight:800,color:C.blue}}>📅 {selectedDay} de {MESES[month]} de {year}</div>
                <button onClick={()=>setSelectedDay(null)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"3px 9px",color:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
              </div>
              {dayEvs.length===0
                ?<div style={{textAlign:"center",color:C.muted,padding:"16px 0",fontSize:13}}>
                  <div style={{fontSize:28,marginBottom:6}}>🗓️</div>
                  Sin actividad registrada este día
                </div>
                :<div>
                  {dayEvs.map((e,i)=>(
                    <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<dayEvs.length-1?`1px solid #1a2540`:"none",alignItems:"flex-start"}}>
                      <div style={{width:34,height:34,borderRadius:10,background:(tipoColor[e.tipo]||C.muted)+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                        {{mantenimiento:"🔧",alimentacion:"🍽️",tratamiento:"💊",recordatorio:"🔔",gasto:"💰"}[e.tipo]||"📌"}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2}}>{getEventLabel(e)}</div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                          <span style={{fontSize:10,background:(tipoColor[e.tipo]||C.muted)+"22",color:tipoColor[e.tipo]||C.muted,borderRadius:20,padding:"1px 8px",fontWeight:600}}>{e.tipo}</span>
                          {e.hora&&<span style={{fontSize:10,color:C.muted}}>🕐 {e.hora}</span>}
                          {e.porcentaje&&<span style={{fontSize:10,color:C.blue}}>💧 {e.porcentaje}%</span>}
                        </div>
                        {e.notas&&<div style={{fontSize:11,color:C.muted,marginTop:3,fontStyle:"italic"}}>"{e.notas}"</div>}
                        {e.enfermedad&&<div style={{fontSize:11,color:C.red,marginTop:2}}>🦠 {e.enfermedad}{e.medicamento?` · 💊 ${e.medicamento}`:""}{e.dosis?` (${e.dosis})`:""}</div>}
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:8,fontSize:11,color:C.muted,textAlign:"center"}}>{dayEvs.length} evento{dayEvs.length!==1?"s":""} este día</div>
                </div>
              }
            </div>
          );
        })()}

        {/* Historial del mes completo */}
        <div style={ss.card}>
          <div style={ss.slab}>Todos los eventos de {MESES[month]}</div>
          {allEvents.filter(e=>{try{const f=normFecha(e.fecha);return f.startsWith(`${year}-${String(month+1).padStart(2,"0")}`);}catch{return false;}}).sort((a,b)=>normFecha(a.fecha).localeCompare(normFecha(b.fecha))).slice(0,30).map((e,i)=>(
            <div key={i}
              onClick={()=>{const f=normFecha(e.fecha);if(f){const d=parseInt(f.split("-")[2]);setSelectedDay(d);}}}
              style={{display:"flex",alignItems:"center",gap:10,...ss.row,cursor:"pointer"}}
            >
              <div style={{width:8,height:8,borderRadius:"50%",background:tipoColor[e.tipo]||C.muted,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:C.text}}>{getEventLabel(e)}</div>
                <div style={{fontSize:9,color:C.muted}}>{e.fecha}{e.hora?` · ${e.hora}`:""}</div>
              </div>
              <span style={{fontSize:9,color:tipoColor[e.tipo]||C.muted,background:(tipoColor[e.tipo]||C.muted)+"22",borderRadius:20,padding:"1px 6px"}}>{e.tipo}</span>
            </div>
          ))}
        </div>
      </div>}

      {tab==="gastos"&&<div style={{padding:"0 16px"}}>
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <div style={{flex:1,...ss.card,background:"linear-gradient(135deg,#1e1b4b,#1e293b)",marginBottom:0}}><div style={{fontSize:10,color:"#a78bfa",fontWeight:700,marginBottom:2}}>ESTE MES</div><div style={{fontSize:24,fontWeight:900,color:"#fff"}}>{totalMonth.toFixed(2)}<span style={{fontSize:11,color:"#a78bfa"}}> €</span></div></div>
          <div style={{flex:1,...ss.card,marginBottom:0}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:2}}>TOTAL</div><div style={{fontSize:24,fontWeight:900,color:C.text}}>{totalAll.toFixed(2)}<span style={{fontSize:11,color:C.muted}}> €</span></div></div>
        </div>
        <div style={ss.card}><div style={ss.slab}>Por categoría</div>{EXPENSE_CATS.map(cat=>{const t=expenses.filter(e=>e.categoria===cat.id).reduce((s,e)=>s+parseFloat(e.importe||0),0);const pct=totalAll>0?(t/totalAll*100):0;return <div key={cat.id} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:C.text}}>{cat.icon} {cat.label}</span><span style={{fontSize:12,fontWeight:700,color:cat.color}}>{t.toFixed(2)} €</span></div><div style={{height:4,background:C.bg,borderRadius:2}}><div style={{height:4,background:cat.color,borderRadius:2,width:`${pct}%`}}/></div></div>;})}</div>
        <div style={ss.card}>
          <div style={ss.slab}>Añadir gasto</div>
          <input value={newExp.concepto} onChange={e=>setNewExp(n=>({...n,concepto:e.target.value}))} placeholder="Concepto (ej: Gránulos Sera)" style={{...ss.inp,marginBottom:8}}/>
          <div style={{display:"flex",gap:8,marginBottom:8}}><input value={newExp.importe} type="number" step="0.01" min="0" onChange={e=>setNewExp(n=>({...n,importe:e.target.value}))} placeholder="Importe €" style={{...ss.inp,flex:1}}/><input value={newExp.fecha} type="date" onChange={e=>setNewExp(n=>({...n,fecha:e.target.value}))} style={{...ss.inp,flex:1}}/></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>{EXPENSE_CATS.map(cat=><button key={cat.id} onClick={()=>setNewExp(n=>({...n,categoria:cat.id}))} style={{background:newExp.categoria===cat.id?cat.color+"33":C.bg,border:`1px solid ${newExp.categoria===cat.id?cat.color:C.border}`,borderRadius:20,padding:"5px 11px",color:newExp.categoria===cat.id?cat.color:C.muted,fontSize:11,fontWeight:newExp.categoria===cat.id?700:400,cursor:"pointer",fontFamily:"inherit"}}>{cat.icon} {cat.label}</button>)}</div>
          <button onClick={()=>{if(!newExp.concepto||!newExp.importe)return;setExpenses(e=>[{...newExp,id:Date.now()},...e]);setNewExp({concepto:"",importe:"",categoria:"alimento",fecha:toISO()});}} style={ss.btn}>💰 Añadir gasto</button>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}><button onClick={()=>setExpFilter("all")} style={{background:expFilter==="all"?"#0ea5e933":C.card,border:`1px solid ${expFilter==="all"?C.blue:C.border}`,borderRadius:20,padding:"5px 12px",color:expFilter==="all"?C.blue:C.muted,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Todos</button>{EXPENSE_CATS.map(cat=><button key={cat.id} onClick={()=>setExpFilter(cat.id)} style={{background:expFilter===cat.id?cat.color+"33":C.card,border:`1px solid ${expFilter===cat.id?cat.color:C.border}`,borderRadius:20,padding:"5px 11px",color:expFilter===cat.id?cat.color:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{cat.icon}</button>)}</div>
        {filteredExp.length===0?<div style={{...ss.card,textAlign:"center",color:C.muted,padding:20}}>Sin gastos</div>:filteredExp.map(e=>{const cat=EXPENSE_CATS.find(c=>c.id===e.categoria)||EXPENSE_CATS[5];return <div key={e.id} style={{...ss.card,display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:10,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{cat.icon}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{e.concepto}</div><div style={{fontSize:10,color:C.muted}}>{e.fecha} · {cat.label}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:800,color:cat.color}}>{parseFloat(e.importe).toFixed(2)} €</div><button onClick={()=>setExpenses(ex=>ex.filter(x=>x.id!==e.id))} style={{fontSize:10,color:C.muted,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>eliminar</button></div></div>;})}
      </div>}
    </div>
  );
}

// ── MULTI-ACUARIO ─────────────────────────────────────────────────────────────
function createEmptyAquarium(id, nombre) {
  return {id,nombre:nombre||"Nuevo Acuario",params:{},fish:[],plants:[],history:[],gallery:[],reminders:[],expenses:{},photo:null,customLimits:{},activeExtraParams:[],equipo:[...INITIAL_EQUIPO.map(e=>({...e,id:Date.now()+Math.random()}))],mantTasks:{...MANT_TASKS_DEFAULT}};
}

function useAquariums() {
  const KEY_IDS="aq4_ids"; const KEY_ACTIVE="aq4_activeAquarium";
  const readField=(id,field,def)=>{try{const s=localStorage.getItem(`aq4_${id}_${field}`);return s!==null?JSON.parse(s):def;}catch{return def;}};
  const writeField=(id,field,val)=>{try{localStorage.setItem(`aq4_${id}_${field}`,JSON.stringify(val));}catch(e){console.warn(`Error guardando ${field}:`,e);}};
  const loadAquarium=(id)=>({id,nombre:readField(id,"nombre",id==="aq1"?"Amazónico 300L":"Nuevo Acuario"),params:readField(id,"params",{}),fish:readField(id,"fish",id==="aq1"?INITIAL_FISH:[]),plants:readField(id,"plants",id==="aq1"?INITIAL_PLANTS:[]),history:readField(id,"history",[]),gallery:readField(id,"gallery",[]),reminders:readField(id,"reminders",[]),expenses:readField(id,"expenses",[]),customLimits:readField(id,"customLimits",{}),activeExtraParams:readField(id,"activeExtraParams",[]),equipo:readField(id,"equipo",INITIAL_EQUIPO),mantTasks:readField(id,"mantTasks",MANT_TASKS_DEFAULT)});
  const migrateIfNeeded=()=>{
    if(localStorage.getItem(KEY_IDS))return;
    try{const saved=localStorage.getItem("aq4_aquariums");if(saved){const aqs=JSON.parse(saved);localStorage.setItem(KEY_IDS,JSON.stringify(aqs.map(a=>a.id)));aqs.forEach(a=>Object.entries(a).forEach(([f,v])=>{if(f!=="id"&&f!=="photo")writeField(a.id,f,v);}));return;}}catch{}
    const m=(k,d)=>{try{const s=localStorage.getItem("aq4_"+k);return s?JSON.parse(s):d;}catch{return d;}};
    localStorage.setItem(KEY_IDS,JSON.stringify(["aq1"]));
    ["nombre","params","fish","plants","history","gallery","reminders","expenses","customLimits","activeExtraParams","equipo","mantTasks"].forEach(f=>writeField("aq1",f,m(f===f?f:f,null)));
    writeField("aq1","nombre",m("aquariumName","Amazónico 300L"));
    writeField("aq1","params",m("params",{}));writeField("aq1","fish",m("fish",INITIAL_FISH));writeField("aq1","plants",m("plants",INITIAL_PLANTS));
    writeField("aq1","history",m("history",[]));writeField("aq1","gallery",m("gallery",[]));writeField("aq1","reminders",m("reminders",[]));
    writeField("aq1","expenses",m("expenses",[]));writeField("aq1","customLimits",m("customLimits",{}));writeField("aq1","activeExtraParams",m("activeExtraParams",[]));
    writeField("aq1","equipo",m("equipo",INITIAL_EQUIPO));writeField("aq1","mantTasks",m("mantTasks",MANT_TASKS_DEFAULT));
    const p=m("photo",null);if(p)try{localStorage.setItem("aq4_photo_aq1",p);}catch{}
  };
  const [ids]=useState(()=>{migrateIfNeeded();try{const s=localStorage.getItem(KEY_IDS);return s?JSON.parse(s):["aq1"];}catch{return["aq1"];}});
  const [aquariums,setAquariumsState]=useState(()=>ids.map(loadAquarium));
  const [activeId,setActiveIdRaw]=useState(()=>{try{return localStorage.getItem(KEY_ACTIVE)||ids[0]||"aq1";}catch{return"aq1";}});
  const setActiveId=(id)=>{setActiveIdRaw(id);try{localStorage.setItem(KEY_ACTIVE,id);}catch{}};
  const updateAquarium=(id,updater)=>{setAquariumsState(prev=>prev.map(a=>{if(a.id!==id)return a;const next={...a,...(typeof updater==="function"?updater(a):updater)};Object.keys(next).forEach(f=>{if(f==="id"||f==="photo"||f==="_photoTs")return;if(JSON.stringify(next[f])!==JSON.stringify(a[f]))writeField(id,f,next[f]);});return next;}));};
  const setAquariums=(val)=>{setAquariumsState(prev=>{const next=typeof val==="function"?val(prev):val;try{localStorage.setItem(KEY_IDS,JSON.stringify(next.map(a=>a.id)));}catch{}next.forEach(a=>{if(!prev.find(p=>p.id===a.id))Object.entries(a).forEach(([f,v])=>{if(f!=="id"&&f!=="photo")writeField(a.id,f,v);});});prev.forEach(a=>{if(!next.find(n=>n.id===a.id)){["nombre","params","fish","plants","history","gallery","reminders","expenses","customLimits","activeExtraParams","equipo","mantTasks"].forEach(f=>{try{localStorage.removeItem(`aq4_${a.id}_${f}`);}catch{}});try{localStorage.removeItem("aq4_photo_"+a.id);}catch{}}});return next;});};
  const activeAquarium=aquariums.find(a=>a.id===activeId)||aquariums[0]||loadAquarium("aq1");
  return{aquariums,setAquariums,activeId,setActiveId,activeAquarium,updateAquarium};
}

function AquariumSelector({ aquariums, activeId, setActiveId, setAquariums, onClose }) {
  const [showNew,setShowNew]=useState(false);const [newName,setNewName]=useState("");const [editingId,setEditingId]=useState(null);const [editName,setEditName]=useState("");
  const addAquarium=()=>{if(!newName.trim())return;const id="aq_"+Date.now();setAquariums(prev=>[...prev,createEmptyAquarium(id,newName.trim())]);setActiveId(id);setNewName("");setShowNew(false);onClose();};
  const deleteAquarium=(id)=>{if(aquariums.length<=1)return;if(!confirm("¿Eliminar este acuario y todos sus datos?"))return;setAquariums(prev=>prev.filter(a=>a.id!==id));if(activeId===id)setActiveId(aquariums.find(a=>a.id!==id)?.id||aquariums[0].id);};
  const renameAquarium=(id)=>{if(!editName.trim())return;setAquariums(prev=>prev.map(a=>a.id===id?{...a,nombre:editName.trim()}:a));setEditingId(null);};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:200,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",padding:"20px 16px 40px",maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div style={{fontSize:17,fontWeight:800,color:C.text}}>Mis Acuarios</div><button onClick={onClose} style={{background:C.bg,border:"none",borderRadius:10,padding:"6px 12px",color:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>✕ Cerrar</button></div>
        {aquariums.map(aq=>(
          <div key={aq.id} style={{background:activeId===aq.id?"linear-gradient(135deg,#0f3460,#1e293b)":C.bg,borderRadius:14,padding:"14px 16px",marginBottom:10,border:`1px solid ${activeId===aq.id?C.blue+"66":C.border}`}}>
            {editingId===aq.id
              ?<div style={{display:"flex",gap:8}}><input value={editName} onChange={e=>setEditName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")renameAquarium(aq.id);}} autoFocus style={{...ss.inp,flex:1,fontSize:14,padding:"8px 12px"}}/><button onClick={()=>renameAquarium(aq.id)} style={{background:"#0ea5e9",border:"none",borderRadius:8,padding:"8px 12px",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓</button><button onClick={()=>setEditingId(null)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.muted,cursor:"pointer",fontFamily:"inherit"}}>✕</button></div>
              :<div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:48,height:48,borderRadius:10,background:C.card,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><DiscusFish size={32} color={activeId===aq.id?C.blue:"#475569"}/></div>
                <div style={{flex:1}} onClick={()=>{setActiveId(aq.id);onClose();}}><div style={{fontSize:15,fontWeight:700,color:activeId===aq.id?C.blue:C.text,cursor:"pointer"}}>{aq.nombre}</div><div style={{fontSize:11,color:C.muted}}>{(aq.fish||[]).reduce((s,f)=>s+f.cantidad,0)} peces · {(aq.plants||[]).length} plantas</div>{activeId===aq.id&&<div style={{fontSize:10,color:C.blue,marginTop:2}}>● Activo ahora</div>}</div>
                <div style={{display:"flex",gap:6}}><button onClick={()=>{setEditingId(aq.id);setEditName(aq.nombre);}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 8px",color:C.muted,cursor:"pointer",fontFamily:"inherit",fontSize:12}}>✏️</button>{aquariums.length>1&&<button onClick={()=>deleteAquarium(aq.id)} style={{background:"none",border:`1px solid ${C.red}44`,borderRadius:8,padding:"5px 8px",color:C.red,cursor:"pointer",fontFamily:"inherit",fontSize:12}}>🗑️</button>}</div>
              </div>
            }
          </div>
        ))}
        {showNew?<div style={{background:C.bg,borderRadius:14,padding:14,border:`2px dashed ${C.green}`}}><div style={{fontSize:11,color:C.muted,marginBottom:8}}>Nombre del nuevo acuario</div><input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAquarium()} placeholder="Ej: Plantado 60L, Marino 100L..." autoFocus style={{...ss.inp,marginBottom:10}}/><div style={{display:"flex",gap:8}}><button onClick={addAquarium} style={{...ss.btn,flex:1,padding:12,fontSize:14}}>✓ Crear acuario</button><button onClick={()=>setShowNew(false)} style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:12,color:C.muted,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button></div></div>:<button onClick={()=>setShowNew(true)} style={{width:"100%",background:"none",border:`2px dashed ${C.green}`,borderRadius:14,padding:14,color:C.green,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>+ Añadir nuevo acuario</button>}
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("dashboard");
  const [showAquariumSelector, setShowAquariumSelector] = useState(false);
  const { aquariums, setAquariums, activeId, setActiveId, activeAquarium, updateAquarium } = useAquariums();
  const aq = activeAquarium;
  const upd = (field, val) => updateAquarium(activeId, a => ({...a, [field]: typeof val === "function" ? val(a[field]) : val}));
  const params = aq.params || {};       const setParams = (v) => upd("params", v);
  const fish = aq.fish || [];           const setFish = (v) => upd("fish", v);
  const plants = aq.plants || [];       const setPlants = (v) => upd("plants", v);
  const history = aq.history || [];     const setHistory = (v) => upd("history", v);
  const gallery = aq.gallery || [];     const setGallery = (v) => upd("gallery", v);
  const reminders = aq.reminders || []; const setReminders = (v) => upd("reminders", v);
  const expenses = aq.expenses || [];   const setExpenses = (v) => upd("expenses", v);
  const [photo, setPhotoState] = useState(() => { try { return localStorage.getItem("aq4_photo_"+activeId) || null; } catch { return null; } });
  useEffect(() => { try { setPhotoState(localStorage.getItem("aq4_photo_"+activeId) || null); } catch {} }, [activeId]);
  const setPhoto = (v) => { try { if (v) localStorage.setItem("aq4_photo_"+activeId, v); else localStorage.removeItem("aq4_photo_"+activeId); } catch(e) { console.warn(e); } setPhotoState(v || null); };
  const aquariumName = aq.nombre || "Mi Acuario";
  const setAquariumName = (v) => updateAquarium(activeId, {nombre: v});
  const customLimits = aq.customLimits || {};   const setCustomLimits = (v) => upd("customLimits", v);
  const activeExtraParams = aq.activeExtraParams || []; const setActiveExtraParams = (v) => upd("activeExtraParams", v);
  const equipo = aq.equipo || INITIAL_EQUIPO;   const setEquipo = (v) => upd("equipo", v);
  const mantTasks = aq.mantTasks || MANT_TASKS_DEFAULT; const setMantTasks = (v) => upd("mantTasks", v);
  const addHistory = useCallback(e => setHistory(h => [{...e, id:Date.now()}, ...(Array.isArray(h)?h:[])]), [activeId]);
  const pending = reminders.filter(r=>!r.done).length;
  // FIX #2: pasar customLimits a useAutoAlerts del nivel app
  const alerts = useAutoAlerts(params, customLimits);
  const criticals = alerts.filter(a=>a.level==="danger").length;

  useEffect(()=>{
    let link=document.querySelector("link[rel~='icon']")||document.createElement("link");
    link.rel="icon"; link.href=LOGO_BASE64; document.head.appendChild(link);
    let apple=document.querySelector("link[rel='apple-touch-icon']")||document.createElement("link");
    apple.rel="apple-touch-icon"; apple.href=LOGO_BASE64; document.head.appendChild(apple);
    document.title="AquaLog";
  },[]);

  return (
    <div style={{background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"-apple-system,'SF Pro Display','Segoe UI',sans-serif",color:C.text}}>
      {showAquariumSelector&&<AquariumSelector aquariums={aquariums} activeId={activeId} setActiveId={setActiveId} setAquariums={setAquariums} onClose={()=>setShowAquariumSelector(false)}/>}
      <div style={{padding:"48px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {/* FIX #1: Logo del pez disco bien escalado */}
          <DiscusFish size={38} color={C.blue}/>
          <div>
            <div style={{fontSize:19,fontWeight:900,color:C.text,lineHeight:1.1}}>AquaLog</div>
            <div style={{fontSize:10,color:C.blue,letterSpacing:0.5}}>{SECTIONS.find(s=>s.id===section)?.label}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {criticals>0&&<div style={{fontSize:11,color:C.red,background:"#450a0a",borderRadius:8,padding:"4px 10px",fontWeight:700,border:`1px solid ${C.red}44`}}>🚨 {criticals}</div>}
          <button onClick={()=>setShowAquariumSelector(true)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"6px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit"}}>
            <span style={{fontSize:16}}>🐡</span>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:11,fontWeight:700,color:C.text,maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{aquariumName}</div>
              {aquariums.length>1&&<div style={{fontSize:9,color:C.muted}}>{aquariums.length} acuarios ▾</div>}
            </div>
          </button>
        </div>
      </div>
      {aquariums.length>1&&(
        <div style={{display:"flex",gap:6,padding:"0 16px 10px",overflowX:"auto",scrollbarWidth:"none"}}>
          {aquariums.map(a=>(<button key={a.id} onClick={()=>setActiveId(a.id)} style={{flexShrink:0,background:activeId===a.id?"linear-gradient(135deg,#0ea5e9,#38bdf8)":C.card,border:`1px solid ${activeId===a.id?C.blue:C.border}`,borderRadius:20,padding:"5px 14px",color:activeId===a.id?"#fff":C.muted,fontSize:12,fontWeight:activeId===a.id?700:400,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{a.nombre}</button>))}
          <button onClick={()=>setShowAquariumSelector(true)} style={{flexShrink:0,background:"none",border:`1px dashed ${C.border}`,borderRadius:20,padding:"5px 12px",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>+ Añadir</button>
        </div>
      )}
      {/* FIX #2: pasar customLimits al Dashboard */}
      {section==="dashboard"&&<Dashboard params={params} customLimits={customLimits} fish={fish} plants={plants} history={history} reminders={reminders} expenses={expenses} aquariumName={aquariumName} setAquariumName={setAquariumName} setSection={setSection}/>}
      {section==="params"&&<Params params={params} setParams={setParams} history={history} addHistory={addHistory} customLimits={customLimits} setCustomLimits={setCustomLimits} activeExtraParams={activeExtraParams} setActiveExtraParams={setActiveExtraParams}/>}
      {section==="vida"&&<Vida fish={fish} setFish={setFish} plants={plants} setPlants={setPlants} gallery={gallery} setGallery={setGallery}/>}
      {section==="extras"&&<Extras addHistory={addHistory} history={history} reminders={reminders} setReminders={setReminders} equipo={equipo} setEquipo={setEquipo} mantTasks={mantTasks} setMantTasks={setMantTasks}/>}
      {section==="ia"&&<IA params={params} fish={fish} history={history} expenses={expenses} setExpenses={setExpenses} reminders={reminders} mantTasks={mantTasks}/>}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",padding:"10px 0 18px",zIndex:100}}>
        {SECTIONS.map(sec=>(
          <button key={sec.id} onClick={()=>setSection(sec.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"5px 0",position:"relative",fontFamily:"inherit"}}>
            <span style={{fontSize:19}}>{sec.icon}</span>
            {sec.id==="extras"&&pending>0&&<span style={{position:"absolute",top:1,right:"15%",background:C.red,color:"#fff",fontSize:8,fontWeight:900,borderRadius:"50%",width:15,height:15,display:"flex",alignItems:"center",justifyContent:"center"}}>{pending}</span>}
            {sec.id==="params"&&criticals>0&&<span style={{position:"absolute",top:1,right:"15%",background:C.red,color:"#fff",fontSize:8,fontWeight:900,borderRadius:"50%",width:15,height:15,display:"flex",alignItems:"center",justifyContent:"center"}}>!</span>}
            <span style={{fontSize:8,fontWeight:700,color:section===sec.id?C.blue:"#475569",textTransform:"uppercase",letterSpacing:0.5}}>{sec.label}</span>
            {section===sec.id&&<div style={{width:18,height:2,background:C.blue,borderRadius:1}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
