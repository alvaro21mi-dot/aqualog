import { useState, useRef, useEffect, useCallback } from "react";

// ── CONSTANTES ────────────────────────────────────────────────────────────────
const PARAM_DEFS = [
  { key:"temperatura", label:"Temperatura", unit:"°C", icon:"🌡️", min:26, max:30, ideal:"27-29", color:"#f97316" },
  { key:"ph", label:"pH", unit:"", icon:"⚗️", min:6.0, max:7.5, ideal:"6.5-7.0", color:"#a78bfa" },
  { key:"gh", label:"GH", unit:"°dH", icon:"💧", min:3, max:10, ideal:"4-8", color:"#38bdf8" },
  { key:"kh", label:"KH", unit:"°dH", icon:"🔬", min:2, max:6, ideal:"3-5", color:"#34d399" },
  { key:"amonio", label:"Amonio", unit:"mg/L", icon:"⚠️", min:0, max:0.5, ideal:"0", color:"#f87171" },
  { key:"nitritos", label:"Nitritos", unit:"mg/L", icon:"⚠️", min:0, max:0.5, ideal:"0", color:"#fb923c" },
  { key:"nitratos", label:"Nitratos", unit:"mg/L", icon:"📊", min:0, max:30, ideal:"<20", color:"#fbbf24" },
  { key:"co2", label:"CO2", unit:"mg/L", icon:"🌿", min:15, max:35, ideal:"20-30", color:"#4ade80" },
];
const INITIAL_FISH = [
  { id:1, nombre:"Disco", cantidad:8, emoji:"🔵", especie:"Symphysodon spp.", estado:"saludable", adquisicion:"", notas:"", historial:[] },
  { id:2, nombre:"Ramirezi", cantidad:6, emoji:"🟡", especie:"Mikrogeophagus ramirezi", estado:"saludable", adquisicion:"", notas:"", historial:[] },
  { id:3, nombre:"Neón", cantidad:8, emoji:"🔴", especie:"Paracheirodon innesi", estado:"saludable", adquisicion:"", notas:"", historial:[] },
  { id:4, nombre:"Corydoras", cantidad:9, emoji:"⚪", especie:"Corydoras spp.", estado:"saludable", adquisicion:"", notas:"", historial:[] },
  { id:5, nombre:"Ancistrus", cantidad:4, emoji:"🟤", especie:"Ancistrus spp.", estado:"saludable", adquisicion:"", notas:"", historial:[] },
];
const FISH_DB = {
  "Symphysodon spp.": { temp:"28-31°C", ph:"5.5-7.0", gh:"1-8°dH", tamano:"15-21cm", dieta:"Omnívoro (gránulos, corazón de buey, artemia)", compatibilidad:"Otras especies de aguas blandas y cálidas", nivel:"Avanzado", curiosidades:"El disco es uno de los peces más exigentes en cuanto a calidad de agua. Son muy sensibles al amonio y nitritos. Forman parejas estables y cuidan a sus crías." },
  "Mikrogeophagus ramirezi": { temp:"26-30°C", ph:"5.0-7.0", gh:"1-6°dH", tamano:"5-7cm", dieta:"Omnívoro (gránulos pequeños, artemia, tubifex)", compatibilidad:"Pacífico con especies similares", nivel:"Intermedio", curiosidades:"El ramirezi es uno de los cíclidos enanos más coloridos. Forma parejas monógamas y defiende su zona de puesta." },
  "Paracheirodon innesi": { temp:"20-26°C", ph:"5.5-7.5", gh:"1-10°dH", tamano:"3-4cm", dieta:"Omnívoro (microgránulos, artemia nauplii)", compatibilidad:"Muy pacífico, ideal para comunidad", nivel:"Principiante", curiosidades:"El neón tetras nada en bancos y se siente más seguro en grupos de 8+. La franja azul-roja es una advertencia a depredadores." },
  "Corydoras spp.": { temp:"22-28°C", ph:"6.0-7.8", gh:"2-15°dH", tamano:"4-7cm", dieta:"Omnívoro bentónico (pastillas de fondo, gusanos)", compatibilidad:"Muy pacífico, limpiador del sustrato", nivel:"Principiante", curiosidades:"Los corydoras respiran aire atmosférico ocasionalmente. Viven en grupos y son muy sociales. Nunca deben mantenerse solos." },
  "Ancistrus spp.": { temp:"23-28°C", ph:"6.0-7.5", gh:"2-12°dH", tamano:"10-15cm", dieta:"Herbívoro (algas, madera, verduras)", compatibilidad:"Pacífico, puede ser territorial con otros plecos", nivel:"Principiante", curiosidades:"El ancistrus es esencial para el control de algas. Los machos tienen tentáculos en el hocico. Necesitan madera para digerir correctamente." },
};
const INITIAL_PLANTS = [
  { id:1, nombre:"Rótala", zona:"Fondo", estado:"creciendo" },
  { id:2, nombre:"Criptocorinas", zona:"Medio", estado:"estable" },
  { id:3, nombre:"Tenellum", zona:"Bajo", estado:"creciendo" },
];
const EQUIPO = ["Filtro Oase 300","Filtro Ultramax 2000","Calentador Chihiros","Pantalla Chihiros Slim","Sistema CO2"];
const FEED_TYPES = ["Gránulos","Corazón de buey","Artemia","Tubifex","Pellets","Liofilizado","Verduras","Otro"];
const MANT_TASKS = { agua:"🪣 Cambio de agua", filtro:"🔧 Limpiar filtro", algas:"🧽 Limpiar algas", sustrato:"🪨 Aspirar sustrato", co2:"💨 Revisar CO2", fertilizante:"🌱 Fertilizante" };
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

function usePersist(key, def) {
  const [v, setV] = useState(() => { try { const s=localStorage.getItem("aq4_"+key); return s?JSON.parse(s):def; } catch { return def; } });
  const set = useCallback(val => setV(prev => { const n=typeof val==="function"?val(prev):val; try{localStorage.setItem("aq4_"+key,JSON.stringify(n));}catch{} return n; }), [key]);
  return [v, set];
}
function getStatus(key, value) {
  const d=PARAM_DEFS.find(p=>p.key===key);
  if (!d||value===undefined||value==="") return "neutral";
  const v=parseFloat(value);
  if (key==="amonio"||key==="nitritos") return v===0?"ok":v<0.25?"warning":"danger";
  if (key==="nitratos") return v<=20?"ok":v<=30?"warning":"danger";
  return v>=d.min&&v<=d.max?"ok":"danger";
}
function useAutoAlerts(params) {
  return PARAM_DEFS.map(p=>{
    const st=getStatus(p.key,params[p.key]); if(st==="neutral") return null;
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
function DiscusFish({ size=36, color="#38bdf8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <ellipse cx="48" cy="50" rx="32" ry="36" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2.5"/>
      <line x1="36" y1="16" x2="32" y2="84" stroke={color} strokeWidth="1.5" strokeOpacity="0.45"/>
      <line x1="48" y1="14" x2="48" y2="86" stroke={color} strokeWidth="1.5" strokeOpacity="0.45"/>
      <line x1="60" y1="16" x2="64" y2="84" stroke={color} strokeWidth="1.5" strokeOpacity="0.45"/>
      <path d="M28 34 Q38 10 62 20 Q55 30 48 32 Q40 34 28 34Z" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="1.5"/>
      <path d="M30 66 Q40 88 62 80 Q55 70 48 68 Q40 66 30 66Z" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="1.5"/>
      <path d="M16 50 Q4 35 8 20 Q18 38 16 50Z" fill={color} fillOpacity="0.55" stroke={color} strokeWidth="1.5"/>
      <path d="M16 50 Q4 65 8 80 Q18 62 16 50Z" fill={color} fillOpacity="0.55" stroke={color} strokeWidth="1.5"/>
      <circle cx="64" cy="44" r="5" fill="#0f172a"/>
      <circle cx="65.5" cy="42.5" r="1.5" fill="#fff" fillOpacity="0.8"/>
    </svg>
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

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ params, fish, history, reminders, expenses, photo, setPhoto, setSection }) {
  const photoRef = useRef();
  const alerts = useAutoAlerts(params);
  const dangers = alerts.filter(a=>a.level==="danger");
  const warnings = alerts.filter(a=>a.level==="warning");
  const totalFish = fish.reduce((s,f)=>s+f.cantidad,0);
  const pending = reminders.filter(r=>!r.done);
  const lastMaint = history.find(h=>h.tipo==="mantenimiento");
  const lastFeed = history.find(h=>h.tipo==="alimentacion");
  const thisMonth = new Date().getMonth();
  const totalMonth = expenses.filter(e=>{ try{ const d=new Date(e.fecha); return d.getMonth()===thisMonth; } catch{ return false; } }).reduce((s,e)=>s+parseFloat(e.importe||0),0);
  const handlePhoto = e => { const file=e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=ev=>setPhoto(ev.target.result); r.readAsDataURL(file); };

  return (
    <div style={{paddingBottom:80}}>
      <div style={{borderRadius:20,margin:"0 16px 14px",position:"relative",overflow:"hidden",minHeight:180}}>
        {photo?<img src={photo} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#0f3460,#16213e 60%,#0a1628)"}}/>}
        {photo&&<div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(10,22,40,0.95) 35%,rgba(10,22,40,0.2) 100%)"}}/>}
        <div style={{position:"relative",padding:"20px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:10,color:C.blue,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>Mi Acuario</div>
              <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:1}}>Amazónico 300L</div>
              <div style={{fontSize:11,color:"#7dd3fc"}}>Oase 300 · Ultramax 2000 · Chihiros</div>
            </div>
            <button onClick={()=>photoRef.current.click()} style={{background:"rgba(14,165,233,0.25)",border:"1px solid rgba(56,189,248,0.5)",borderRadius:10,padding:"7px 10px",color:"#7dd3fc",fontSize:10,fontWeight:700,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
              <span style={{fontSize:16}}>📷</span><span>{photo?"Cambiar":"Foto"}</span>
            </button>
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            {[{l:"Peces",v:totalFish},{l:"Plantas",v:3},{l:"Estado",v:dangers.length>0?"✗":warnings.length>0?"!":"✓",c:dangers.length>0?C.red:warnings.length>0?C.yellow:C.green}].map(it=>(
              <div key={it.l} style={{flex:1,background:"rgba(255,255,255,0.12)",borderRadius:10,padding:"8px 10px"}}>
                <div style={{fontSize:9,color:"#7dd3fc"}}>{it.l}</div>
                <div style={{fontSize:20,fontWeight:800,color:it.c||"#fff"}}>{it.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {dangers.length>0&&<div style={{margin:"0 16px 10px",background:"#450a0a",border:`2px solid ${C.red}`,borderRadius:14,padding:"12px 14px"}}><div style={{fontSize:13,fontWeight:800,color:C.red,marginBottom:8}}>🚨 ALERTA CRÍTICA</div>{dangers.map((a,i)=><div key={i} style={{fontSize:12,color:"#fca5a5",marginBottom:4,background:"rgba(248,113,113,0.1)",borderRadius:8,padding:"6px 10px"}}><span style={{fontWeight:700}}>{a.param.icon} {a.param.label}: {a.value} {a.param.unit}</span> — ideal: {a.param.ideal}</div>)}</div>}
      {warnings.length>0&&<div style={{margin:"0 16px 10px",background:"#422006",border:`1px solid ${C.orange}`,borderRadius:14,padding:"12px 14px"}}><div style={{fontSize:13,fontWeight:700,color:C.orange,marginBottom:6}}>⚠️ Parámetros en atención</div>{warnings.map((a,i)=><div key={i} style={{fontSize:12,color:"#fdba74",marginBottom:2}}>• {a.param.icon} {a.param.label}: {a.value} {a.param.unit}</div>)}</div>}
      {pending.length>0&&<div style={{margin:"0 16px 10px",background:"#1c2a1e",border:`1px solid ${C.green}`,borderRadius:14,padding:"12px 14px"}}><div style={{fontSize:13,fontWeight:700,color:C.green,marginBottom:6}}>🔔 {pending.length} recordatorio{pending.length>1?"s":""} pendiente{pending.length>1?"s":""}</div>{pending.slice(0,2).map(r=><div key={r.id} style={{fontSize:12,color:"#86efac",marginBottom:2}}>• {r.titulo}</div>)}<button onClick={()=>setSection("extras")} style={{marginTop:4,fontSize:11,color:C.green,background:"none",border:"none",cursor:"pointer",padding:0}}>Ver todos →</button></div>}

      <div style={{margin:"0 16px 12px"}}>
        <div style={ss.slab}>Últimos parámetros</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {PARAM_DEFS.slice(0,4).map(p=>{
            const st=getStatus(p.key,params[p.key]);
            const bc={ok:"#1e3a2e",warning:"#3a2e1e",danger:"#3a1e1e",neutral:C.card}[st];
            return <div key={p.key} style={{background:C.card,borderRadius:12,padding:"11px 13px",border:`1px solid ${bc}`}}><div style={{fontSize:16,marginBottom:3}}>{p.icon}</div><div style={{fontSize:10,color:C.muted}}>{p.label}</div><div style={{fontSize:18,fontWeight:800,color:C.text}}>{params[p.key]||"—"}<span style={{fontSize:10,color:C.muted}}> {p.unit}</span></div><Dot status={st}/><span style={{fontSize:9,color:C.muted}}>ideal: {p.ideal}</span></div>;
          })}
        </div>
      </div>

      <div style={{display:"flex",gap:10,margin:"0 16px 10px"}}>
        <div style={{...ss.card,flex:1,marginBottom:0,background:"linear-gradient(135deg,#1e1b4b,#1e293b)"}}>
          <div style={{fontSize:10,color:"#a78bfa",fontWeight:700,marginBottom:2}}>GASTO MES</div>
          <div style={{fontSize:22,fontWeight:900,color:"#fff"}}>{totalMonth.toFixed(2)}<span style={{fontSize:11,color:"#a78bfa"}}> €</span></div>
        </div>
        <div style={{...ss.card,flex:1,marginBottom:0}}>
          <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:2}}>ÚLTIMO MANT.</div>
          <div style={{fontSize:13,fontWeight:700,color:C.text}}>{lastMaint?lastMaint.fecha:"—"}</div>
        </div>
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
function Params({ params, setParams, history, addHistory }) {
  const [tab, setTab] = useState("reg");
  const [local, setLocal] = useState({...params});
  const [chartKey, setChartKey] = useState("temperatura");
  const alerts = useAutoAlerts(local);
  const def = PARAM_DEFS.find(p=>p.key===chartKey);
  const pHistory = history.filter(h=>h.tipo==="parametros").slice(0,30).reverse();
  const chartData = pHistory.map(h=>({l:h.fecha.slice(0,5),v:parseFloat(h.datos?.[chartKey])})).filter(d=>!isNaN(d.v));
  const save = () => { setParams(local); addHistory({tipo:"parametros",fecha:today(),datos:{...local}}); alert("✅ Parámetros guardados"); };
  return (
    <div style={{paddingBottom:90}}>
      <TabBar tabs={[{id:"reg",label:"📝 Registro"},{id:"graf",label:"📈 Gráficas"},{id:"alertas",label:"🚨 Alertas"}]} active={tab} onChange={setTab} small/>
      {tab==="reg"&&<div style={{padding:"0 16px"}}>
        {alerts.length>0&&<div style={{background:alerts.some(a=>a.level==="danger")?"#450a0a":"#422006",border:`1px solid ${alerts.some(a=>a.level==="danger")?C.red:C.orange}`,borderRadius:12,padding:"10px 14px",marginBottom:14}}><div style={{fontSize:12,fontWeight:700,color:alerts.some(a=>a.level==="danger")?C.red:C.orange,marginBottom:6}}>{alerts.some(a=>a.level==="danger")?"🚨 Valores críticos":"⚠️ Valores en atención"}</div>{alerts.map((a,i)=><div key={i} style={{fontSize:11,color:"#fca5a5",marginBottom:2}}>• {a.param.icon} {a.param.label}: {a.value} {a.param.unit}</div>)}</div>}
        {PARAM_DEFS.map(p=>{
          const st=getStatus(p.key,local[p.key]); const alert=alerts.find(a=>a.param.key===p.key);
          return <div key={p.key} style={{...ss.card,border:`1px solid ${alert?(alert.level==="danger"?C.red+"55":C.orange+"55"):"transparent"}`,marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{p.icon}</span><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{p.label}</div><div style={{fontSize:10,color:C.muted}}>Ideal: {p.ideal} {p.unit}</div></div></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>{alert&&<span style={{fontSize:9,background:alert.level==="danger"?C.red+"22":C.orange+"22",color:alert.level==="danger"?C.red:C.orange,border:`1px solid ${alert.level==="danger"?C.red+"44":C.orange+"44"}`,borderRadius:20,padding:"2px 7px",fontWeight:700}}>{alert.level==="danger"?"CRÍTICO":"ATENCIÓN"}</span>}<Dot status={st}/></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><input type="number" step="0.1" value={local[p.key]||""} onChange={e=>setLocal(l=>({...l,[p.key]:e.target.value}))} placeholder="—" style={{flex:1,background:C.bg,border:`1px solid ${alert?(alert.level==="danger"?C.red+"66":C.orange+"55"):C.border}`,borderRadius:10,padding:"9px 12px",color:C.text,fontSize:17,fontWeight:700,outline:"none",fontFamily:"inherit"}}/><span style={{color:C.muted,fontSize:13,minWidth:28}}>{p.unit}</span></div>
          </div>;
        })}
        <button onClick={save} style={ss.btn}>💾 Guardar parámetros</button>
      </div>}
      {tab==="graf"&&<div style={{padding:"0 16px"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{PARAM_DEFS.map(p=><button key={p.key} onClick={()=>setChartKey(p.key)} style={{background:chartKey===p.key?p.color+"33":C.card,border:`1px solid ${chartKey===p.key?p.color:C.border}`,borderRadius:20,padding:"4px 11px",color:chartKey===p.key?p.color:C.muted,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{p.icon} {p.label}</button>)}</div>
        <div style={ss.card}><div style={{fontSize:13,fontWeight:700,color:def.color,marginBottom:2}}>{def.icon} {def.label}</div><div style={{fontSize:10,color:C.muted,marginBottom:10}}>Ideal: {def.ideal} {def.unit} · <span style={{color:def.color}}>{params[def.key]||"—"} {def.unit} actual</span></div><MiniChart data={chartData} color={def.color} minRef={def.min} maxRef={def.max}/>{chartData.slice(-4).reverse().map((d,i)=><div key={i} style={ss.row}><span style={{fontSize:11,color:C.muted}}>{d.l}</span><span style={{fontSize:12,fontWeight:700,color:def.color}}>{d.v} {def.unit}</span></div>)}</div>
      </div>}
      {tab==="alertas"&&<div style={{padding:"0 16px"}}>
        {PARAM_DEFS.map(p=>{
          const st=getStatus(p.key,params[p.key]); const stC={ok:C.green,warning:C.orange,danger:C.red,neutral:C.muted}[st]; const stL={ok:"✓ Correcto",warning:"⚠ Atención",danger:"🚨 Crítico",neutral:"— Sin datos"}[st];
          return <div key={p.key} style={{...ss.card,border:`1px solid ${stC}33`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{p.icon}</span><div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{p.label}</div><div style={{fontSize:10,color:C.muted}}>Actual: <span style={{color:stC,fontWeight:700}}>{params[p.key]||"—"} {p.unit}</span></div></div></div><span style={{fontSize:10,background:stC+"22",color:stC,border:`1px solid ${stC}44`,borderRadius:20,padding:"3px 10px",fontWeight:700}}>{stL}</span></div>
            <div style={{display:"flex",gap:8}}><div style={{flex:1,background:C.bg,borderRadius:8,padding:"6px 10px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted}}>Mínimo</div><div style={{fontSize:14,fontWeight:700,color:C.blue}}>{p.min} {p.unit}</div></div><div style={{flex:1,background:"#1c2a1e",borderRadius:8,padding:"6px 10px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted}}>Ideal</div><div style={{fontSize:14,fontWeight:700,color:C.green}}>{p.ideal} {p.unit}</div></div><div style={{flex:1,background:C.bg,borderRadius:8,padding:"6px 10px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted}}>Máximo</div><div style={{fontSize:14,fontWeight:700,color:C.orange}}>{p.max} {p.unit}</div></div></div>
          </div>;
        })}
      </div>}
    </div>
  );
}

// ── VIDA + FICHAS ─────────────────────────────────────────────────────────────
function Vida({ fish, setFish, plants, setPlants, gallery, setGallery }) {
  const [tab, setTab] = useState("peces");
  const [selectedFish, setSelectedFish] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [nf, setNf] = useState({nombre:"",especie:"",cantidad:1,emoji:"🐠",estado:"saludable",adquisicion:"",notas:"",historial:[]});
  const [lightbox, setLightbox] = useState(null);
  const [newNote, setNewNote] = useState("");
  const gallRef = useRef();
  const fishPhotoRef = useRef();
  const eC={saludable:C.green,enfermo:C.red,observacion:C.yellow};
  const pC={creciendo:C.green,estable:C.blue,deteriorando:C.red};
  const toggleE=id=>{const e=["saludable","observacion","enfermo"];setFish(f=>f.map(x=>x.id===id?{...x,estado:e[(e.indexOf(x.estado)+1)%e.length]}:x));};
  const addGallery=e=>{Array.from(e.target.files).forEach(file=>{const r=new FileReader();r.onload=ev=>setGallery(g=>[...g,{id:Date.now()+Math.random(),src:ev.target.result,fecha:today()}]);r.readAsDataURL(file);});};
  const addFishPhoto=e=>{const file=e.target.files[0];if(!file||!selectedFish)return;const r=new FileReader();r.onload=ev=>{setFish(f=>f.map(x=>x.id===selectedFish.id?{...x,foto:ev.target.result}:x));setSelectedFish(s=>({...s,foto:ev.target.result}));};r.readAsDataURL(file);};
  const addHistorialNote=()=>{if(!newNote.trim()||!selectedFish)return;const nota={fecha:today(),texto:newNote};setFish(f=>f.map(x=>x.id===selectedFish.id?{...x,historial:[nota,...(x.historial||[])]}:x));setSelectedFish(s=>({...s,historial:[nota,...(s.historial||[])]}));setNewNote("");};
  const updateFishField=(field,val)=>{setFish(f=>f.map(x=>x.id===selectedFish.id?{...x,[field]:val}:x));setSelectedFish(s=>({...s,[field]:val}));};

  // Ficha detallada
  if (selectedFish) {
    const dbInfo = FISH_DB[selectedFish.especie];
    const nivelColor={Principiante:C.green,Intermedio:C.yellow,Avanzado:C.red};
    return (
      <div style={{paddingBottom:90}}>
        {lightbox&&<div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.93)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><img src={lightbox} alt="" style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:16,objectFit:"contain"}}/><button onClick={()=>setLightbox(null)} style={{position:"absolute",top:20,right:20,background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",fontSize:18,borderRadius:"50%",width:38,height:38,cursor:"pointer"}}>✕</button></div>}
        <div style={{padding:"0 16px"}}>
          <button onClick={()=>setSelectedFish(null)} style={{background:"none",border:"none",color:C.blue,fontSize:14,cursor:"pointer",marginBottom:14,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4,padding:0}}>← Volver a peces</button>

          {/* Hero ficha */}
          <div style={{...ss.card,background:"linear-gradient(135deg,#0f3460,#1e293b)",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
              <div style={{position:"relative"}}>
                {selectedFish.foto
                  ?<img src={selectedFish.foto} alt="" onClick={()=>setLightbox(selectedFish.foto)} style={{width:72,height:72,borderRadius:16,objectFit:"cover",cursor:"pointer",border:`2px solid ${C.blue}44`}}/>
                  :<div onClick={()=>fishPhotoRef.current.click()} style={{width:72,height:72,borderRadius:16,background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",border:`2px dashed ${C.border}`}}><span style={{fontSize:28}}>{selectedFish.emoji}</span><span style={{fontSize:9,color:C.muted}}>Añadir foto</span></div>
                }
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
              <div style={{textAlign:"right"}}><div style={{fontSize:10,color:C.muted}}>Ejemplares</div><div style={{fontSize:28,fontWeight:900,color:C.blue}}>{selectedFish.cantidad}</div></div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:1,background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted}}>Estado</div><div style={{fontSize:13,fontWeight:700,color:eC[selectedFish.estado]||C.green}}>{selectedFish.estado}</div></div>
              <div style={{flex:1,background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted}}>Adquisición</div><div style={{fontSize:11,fontWeight:700,color:C.text}}>{selectedFish.adquisicion||"—"}</div></div>
            </div>
          </div>

          {/* Info DB */}
          {dbInfo&&<div style={ss.card}>
            <div style={ss.slab}>Ficha de especie</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[{l:"Temperatura",v:dbInfo.temp},{l:"pH",v:dbInfo.ph},{l:"Dureza GH",v:dbInfo.gh},{l:"Tamaño adulto",v:dbInfo.tamano}].map(it=>(
                <div key={it.l} style={{background:C.bg,borderRadius:10,padding:"8px 10px"}}><div style={{fontSize:9,color:C.muted}}>{it.l}</div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{it.v}</div></div>
              ))}
            </div>
            <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.muted,marginBottom:4}}>DIETA</div><div style={{fontSize:12,color:C.text}}>{dbInfo.dieta}</div></div>
            <div style={{marginBottom:10}}><div style={{fontSize:10,color:C.muted,marginBottom:4}}>COMPATIBILIDAD</div><div style={{fontSize:12,color:C.text}}>{dbInfo.compatibilidad}</div></div>
            <div style={{background:C.bg,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:10,color:C.blue,fontWeight:700,marginBottom:4}}>💡 CURIOSIDADES</div><div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{dbInfo.curiosidades}</div></div>
          </div>}

          {/* Datos personales */}
          <div style={ss.card}>
            <div style={ss.slab}>Mis datos</div>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>Fecha de adquisición</div>
            <input type="date" value={selectedFish.adquisicion||""} onChange={e=>updateFishField("adquisicion",e.target.value)} style={{...ss.inp,marginBottom:10}}/>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>Notas personales</div>
            <textarea value={selectedFish.notas||""} onChange={e=>updateFishField("notas",e.target.value)} placeholder="Comportamiento, características individuales, observaciones..." style={{...ss.inp,height:80,resize:"none"}} rows="3"></textarea>
          </div>

          {/* Historial */}
          <div style={ss.card}>
            <div style={ss.slab}>Historial de incidencias</div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Añadir nota o incidencia..." style={{...ss.inp,flex:1,fontSize:13,padding:"9px 12px"}}/>
              <button onClick={addHistorialNote} style={{background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:10,padding:"9px 14px",color:"#fff",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>+</button>
            </div>
            {(selectedFish.historial||[]).length===0
              ?<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:12}}>Sin incidencias registradas</div>
              :(selectedFish.historial||[]).map((n,i)=><div key={i} style={{...ss.row,flexDirection:"column",gap:2}}><span style={{fontSize:10,color:C.muted}}>{n.fecha}</span><span style={{fontSize:13,color:C.text}}>{n.texto}</span></div>)
            }
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
                <div><div style={{fontSize:15,fontWeight:800,color:C.text}}>{f.nombre}</div><div style={{fontSize:10,color:C.muted,fontStyle:"italic"}}>{f.especie}</div>{f.adquisicion&&<div style={{fontSize:9,color:C.muted}}>Desde {new Date(f.adquisicion).toLocaleDateString("es-ES")}</div>}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:900,color:C.blue}}>{f.cantidad}</div>
                <button onClick={e=>{e.stopPropagation();toggleE(f.id);}} style={{fontSize:10,background:(eC[f.estado]||C.green)+"22",color:eC[f.estado]||C.green,border:`1px solid ${(eC[f.estado]||C.green)}44`,borderRadius:20,padding:"2px 7px",cursor:"pointer",fontFamily:"inherit"}}>{f.estado}</button>
              </div>
            </div>
            {(f.historial||[]).length>0&&<div style={{marginTop:8,fontSize:10,color:C.muted}}>📋 {f.historial.length} nota{f.historial.length>1?"s":""} en historial</div>}
            <div style={{marginTop:6,fontSize:10,color:C.blue}}>Ver ficha completa →</div>
          </div>
        ))}
        <button onClick={()=>setShowForm(!showForm)} style={{width:"100%",background:C.card,border:`2px dashed ${C.border}`,borderRadius:14,padding:13,color:C.blue,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Añadir pez</button>
        {showForm&&<div style={{...ss.card,marginTop:10,border:`1px solid ${C.border}`}}>
          <input value={nf.nombre} onChange={e=>setNf(n=>({...n,nombre:e.target.value}))} placeholder="Nombre común" style={{...ss.inp,marginBottom:8}}/>
          <input value={nf.especie} onChange={e=>setNf(n=>({...n,especie:e.target.value}))} placeholder="Especie" style={{...ss.inp,marginBottom:8}}/>
          <div style={{display:"flex",gap:8,marginBottom:8}}><input value={nf.cantidad} type="number" min="1" onChange={e=>setNf(n=>({...n,cantidad:parseInt(e.target.value)}))} style={{...ss.inp,flex:1}} placeholder="Cantidad"/><input value={nf.emoji} onChange={e=>setNf(n=>({...n,emoji:e.target.value}))} style={{...ss.inp,flex:1}} placeholder="Emoji"/></div>
          <button onClick={()=>{if(!nf.nombre)return;setFish(f=>[...f,{...nf,id:Date.now()}]);setShowForm(false);setNf({nombre:"",especie:"",cantidad:1,emoji:"🐠",estado:"saludable",adquisicion:"",notas:"",historial:[]});}} style={ss.btn}>Guardar</button>
        </div>}
      </div>}
      {tab==="plantas"&&<div style={{padding:"0 16px"}}>
        {plants.map(p=><div key={p.id} style={{...ss.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:700,color:C.text}}>🌿 {p.nombre}</div><div style={{fontSize:11,color:C.muted}}>Zona: {p.zona}</div></div><span style={{fontSize:10,background:pC[p.estado]+"22",color:pC[p.estado],border:`1px solid ${pC[p.estado]}44`,borderRadius:20,padding:"3px 9px"}}>{p.estado}</span></div>)}
        <button onClick={()=>setPlants(pl=>[...pl,{id:Date.now(),nombre:"Nueva planta",zona:"Libre",estado:"estable"}])} style={{width:"100%",background:C.card,border:`2px dashed ${C.border}`,borderRadius:14,padding:13,color:C.green,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Añadir planta</button>
      </div>}
      {tab==="galeria"&&<div style={{padding:"0 16px"}}>
        <button onClick={()=>gallRef.current.click()} style={{...ss.btn,marginBottom:14}}>📷 Añadir foto(s)</button>
        <input ref={gallRef} type="file" accept="image/*" multiple onChange={addGallery} style={{display:"none"}}/>
        {gallery.length===0?<div style={{...ss.card,textAlign:"center",color:C.muted,padding:28}}><div style={{fontSize:36,marginBottom:8}}>🖼️</div>Aún no hay fotos.</div>
          :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>{gallery.map(img=><div key={img.id} style={{position:"relative"}}><img src={img.src} alt="" onClick={()=>setLightbox(img.src)} style={{width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:10,cursor:"pointer"}}/><button onClick={()=>setGallery(g=>g.filter(x=>x.id!==img.id))} style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,0.65)",border:"none",color:"#fff",fontSize:10,borderRadius:"50%",width:20,height:20,cursor:"pointer"}}>✕</button></div>)}</div>}
      </div>}
    </div>
  );
}

// ── GRÁFICA CAMBIOS DE AGUA ────────────────────────────────────────────────────
function WaterChart({ cambios }) {
  if (!cambios || cambios.length < 1) return (
    <div style={{textAlign:"center",color:C.muted,fontSize:12,padding:20}}>
      Registra cambios de agua para ver la gráfica
    </div>
  );
  const data = cambios.slice(0,20).reverse();
  const W=300, H=110, P=20;
  const vals = data.map(d=>d.pct);
  const maxV = Math.max(...vals, 40);
  const x = i => P + (i/(Math.max(data.length-1,1)))*(W-P*2);
  const y = v => H-P - (v/maxV)*(H-P*2);
  const pts = data.map((d,i)=>`${x(i)},${y(d.pct)}`).join(" ");
  const area = `${x(0)},${H-P} ${pts} ${x(data.length-1)},${H-P}`;
  // línea recomendada 30%
  const refY = y(30);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",overflow:"visible"}}>
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.blue} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={C.blue} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* línea referencia 30% */}
      <line x1={P} y1={refY} x2={W-P} y2={refY} stroke={C.green} strokeDasharray="4,4" strokeOpacity="0.5" strokeWidth="1.5"/>
      <text x={W-P+2} y={refY+4} fill={C.green} fontSize="8" opacity="0.7">30%</text>
      {/* barras de fondo */}
      {data.map((d,i)=>(
        <rect key={i} x={x(i)-6} y={y(d.pct)} width={12} height={H-P-y(d.pct)} fill={C.blue} fillOpacity="0.15" rx="3"/>
      ))}
      {/* área y línea */}
      <polygon points={area} fill="url(#wg)"/>
      <polyline points={pts} fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {/* puntos */}
      {data.map((d,i)=>(
        <g key={i}>
          <circle cx={x(i)} cy={y(d.pct)} r="5" fill={d.pct>=25?C.green:d.pct>=15?C.yellow:C.red} stroke="#0f172a" strokeWidth="2"/>
          <text x={x(i)} y={y(d.pct)-8} textAnchor="middle" fill={C.text} fontSize="8" fontWeight="600">{d.pct}%</text>
        </g>
      ))}
      {/* etiquetas fecha */}
      {data.filter((_,i)=>i%Math.ceil(data.length/5)===0).map((d,i)=>(
        <text key={i} x={x(data.indexOf(d))} y={H-2} textAnchor="middle" fill={C.muted} fontSize="8">{d.fecha.slice(0,5)}</text>
      ))}
    </svg>
  );
}

// ── EXTRAS ────────────────────────────────────────────────────────────────────
function Extras({ addHistory, history, reminders, setReminders }) {
  const [tab, setTab] = useState("rem");
  const [mantTab, setMantTab] = useState("registro");
  const [feedType, setFeedType] = useState("Gránulos"); const [feedQty, setFeedQty] = useState("normal"); const [feedNota, setFeedNota] = useState("");
  const [tr, setTr] = useState({pez:"",enf:"",med:"",dosis:"",notas:"",fecha:toISO()});
  const [mnt, setMnt] = useState({fecha:toISO(),pct:"",notas:"",tareas:Object.fromEntries(Object.keys(MANT_TASKS).map(k=>[k,false]))});
  const [newRem, setNewRem] = useState({titulo:"",fecha:"",repetir:"nunca",cat:"general"});
  const remColors={general:C.blue,medicacion:C.red,agua:C.green,alimentacion:C.orange};

  // Datos de cambios de agua
  const cambiosAgua = history
    .filter(h=>h.tipo==="mantenimiento"&&h.tareas?.agua&&h.porcentaje)
    .map(h=>({fecha:h.fecha, pct:parseFloat(h.porcentaje), notas:h.notas||""}));
  const totalCambios = cambiosAgua.length;
  const pctPromedio = totalCambios>0 ? (cambiosAgua.reduce((s,c)=>s+c.pct,0)/totalCambios).toFixed(1) : 0;
  const litrosPromedio = totalCambios>0 ? ((parseFloat(pctPromedio)/100)*300).toFixed(0) : 0;
  const ultimoCambio = cambiosAgua[0];
  const diasDesdeUltimo = ultimoCambio ? Math.floor((new Date()-new Date(ultimoCambio.fecha.includes("/")?ultimoCambio.fecha.split("/").reverse().join("-"):ultimoCambio.fecha))/(1000*60*60*24)) : null;

  return (
    <div style={{paddingBottom:90}}>
      <TabBar tabs={[{id:"rem",label:"🔔 Rec."},{id:"ali",label:"🍽️ Com."},{id:"tra",label:"💊 Trat."},{id:"man",label:"🔧 Mant."}]} active={tab} onChange={setTab} small/>

      {tab==="rem"&&<div style={{padding:"0 16px"}}>
        <div style={ss.card}>
          <div style={ss.slab}>Nuevo recordatorio</div>
          <input value={newRem.titulo} onChange={e=>setNewRem(r=>({...r,titulo:e.target.value}))} placeholder="Ej: Cambio de agua semanal" style={{...ss.inp,marginBottom:8}}/>
          <input type="date" value={newRem.fecha} onChange={e=>setNewRem(r=>({...r,fecha:e.target.value}))} style={{...ss.inp,marginBottom:8}}/>
          <div style={{display:"flex",gap:6,marginBottom:8}}>{["general","agua","medicacion","alimentacion"].map(c=><button key={c} onClick={()=>setNewRem(r=>({...r,cat:c}))} style={{flex:1,background:newRem.cat===c?remColors[c]+"33":C.bg,border:`1px solid ${newRem.cat===c?remColors[c]:C.border}`,borderRadius:8,padding:"6px 2px",color:newRem.cat===c?remColors[c]:C.muted,fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{c}</button>)}</div>
          <select value={newRem.repetir} onChange={e=>setNewRem(r=>({...r,repetir:e.target.value}))} style={{...ss.inp,marginBottom:10,fontSize:13}}><option value="nunca">Sin repetición</option><option value="diario">Diario</option><option value="semanal">Semanal</option><option value="mensual">Mensual</option></select>
          <button onClick={()=>{if(!newRem.titulo)return;setReminders(r=>[...r,{...newRem,id:Date.now(),done:false}]);setNewRem({titulo:"",fecha:"",repetir:"nunca",cat:"general"});}} style={ss.btn}>🔔 Añadir</button>
        </div>
        {reminders.filter(r=>!r.done).map(r=><div key={r.id} style={{...ss.card,border:`1px solid ${remColors[r.cat]||C.border}33`,display:"flex",alignItems:"center",gap:10}}><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{r.titulo}</div><div style={{fontSize:10,color:C.muted}}>{r.fecha&&`📅 ${r.fecha}`}{r.repetir!=="nunca"&&` · 🔁 ${r.repetir}`}</div></div><button onClick={()=>setReminders(rem=>rem.map(x=>x.id===r.id?{...x,done:true}:x))} style={{background:"#1c2a1e",border:`1px solid ${C.green}`,borderRadius:8,padding:"5px 9px",color:C.green,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✓</button><button onClick={()=>setReminders(rem=>rem.filter(x=>x.id!==r.id))} style={{background:"#2a1e1e",border:`1px solid ${C.red}`,borderRadius:8,padding:"5px 9px",color:C.red,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✕</button></div>)}
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
        {/* Sub-tabs mantenimiento */}
        <div style={{display:"flex",background:"#162032",borderRadius:10,padding:3,gap:3,marginBottom:14}}>
          {[{id:"registro",label:"📝 Registro"},{id:"historial",label:"🔄 Historial agua"}].map(t=>(
            <button key={t.id} onClick={()=>setMantTab(t.id)} style={{flex:1,background:mantTab===t.id?"#0ea5e9":"transparent",border:"none",borderRadius:8,padding:"8px 4px",color:mantTab===t.id?"#fff":C.muted,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{t.label}</button>
          ))}
        </div>

        {mantTab==="registro"&&<>
          <div style={ss.card}><div style={{fontSize:11,color:C.muted,marginBottom:6}}>Fecha</div><input type="date" value={mnt.fecha} onChange={e=>setMnt(m=>({...m,fecha:e.target.value}))} style={ss.inp}/></div>
          <div style={ss.card}><div style={ss.slab}>Tareas realizadas</div>{Object.entries(MANT_TASKS).map(([k,label])=><div key={k} onClick={()=>setMnt(m=>({...m,tareas:{...m.tareas,[k]:!m.tareas[k]}}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid #1a2540`,cursor:"pointer"}}><span style={{fontSize:13,color:mnt.tareas[k]?C.text:C.muted}}>{label}</span><div style={{width:22,height:22,borderRadius:6,background:mnt.tareas[k]?"#0ea5e9":C.bg,border:`2px solid ${mnt.tareas[k]?"#0ea5e9":C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{mnt.tareas[k]&&<span style={{color:"#fff",fontSize:13,fontWeight:900}}>✓</span>}</div></div>)}</div>
          {mnt.tareas.agua&&<div style={ss.card}><div style={{fontSize:11,color:C.muted,marginBottom:6}}>% agua cambiada</div><input type="number" min="0" max="100" value={mnt.pct} onChange={e=>setMnt(m=>({...m,pct:e.target.value}))} placeholder="ej: 30" style={ss.inp}/></div>}
          <div style={ss.card}><textarea value={mnt.notas} onChange={e=>setMnt(m=>({...m,notas:e.target.value}))} placeholder="Observaciones..." style={{...ss.inp,height:60,resize:"none"}}></textarea></div>
          <div style={ss.card}><div style={ss.slab}>🔧 Equipo</div>{EQUIPO.map(eq=><div key={eq} style={ss.row}><span style={{fontSize:12,color:C.sub}}>{eq}</span><span style={{fontSize:10,color:C.green}}>● activo</span></div>)}</div>
          <button onClick={()=>{addHistory({tipo:"mantenimiento",fecha:mnt.fecha,tareas:{...mnt.tareas},porcentaje:mnt.pct,notas:mnt.notas});setMnt(m=>({...m,notas:"",pct:"",tareas:Object.fromEntries(Object.keys(MANT_TASKS).map(k=>[k,false]))}));alert("✅ Registrado");}} style={ss.btn}>💾 Guardar mantenimiento</button>
        </>}

        {mantTab==="historial"&&<>
          {/* Estadísticas */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div style={{...ss.card,marginBottom:0,background:"linear-gradient(135deg,#0c2340,#1e293b)",border:`1px solid ${C.blue}33`}}>
              <div style={{fontSize:10,color:C.blue,fontWeight:700,marginBottom:2}}>TOTAL CAMBIOS</div>
              <div style={{fontSize:28,fontWeight:900,color:C.blue}}>{totalCambios}</div>
            </div>
            <div style={{...ss.card,marginBottom:0,background:"linear-gradient(135deg,#0c2a1a,#1e293b)",border:`1px solid ${C.green}33`}}>
              <div style={{fontSize:10,color:C.green,fontWeight:700,marginBottom:2}}>% PROMEDIO</div>
              <div style={{fontSize:28,fontWeight:900,color:C.green}}>{pctPromedio}<span style={{fontSize:14}}>%</span></div>
            </div>
            <div style={{...ss.card,marginBottom:0,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:2}}>LITROS PROM.</div>
              <div style={{fontSize:22,fontWeight:900,color:C.text}}>{litrosPromedio}<span style={{fontSize:12,color:C.muted}}> L</span></div>
            </div>
            <div style={{...ss.card,marginBottom:0,border:`1px solid ${diasDesdeUltimo!==null&&diasDesdeUltimo>7?C.red+"44":C.green+"44"}`}}>
              <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:2}}>ÚLTIMO HACE</div>
              <div style={{fontSize:22,fontWeight:900,color:diasDesdeUltimo!==null&&diasDesdeUltimo>7?C.red:C.green}}>
                {diasDesdeUltimo!==null?`${diasDesdeUltimo}d`:"—"}
              </div>
              {diasDesdeUltimo!==null&&diasDesdeUltimo>7&&<div style={{fontSize:9,color:C.red,marginTop:2}}>⚠ Hace más de 1 semana</div>}
            </div>
          </div>

          {/* Gráfica */}
          <div style={ss.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{fontSize:13,fontWeight:700,color:C.blue}}>🔄 Evolución cambios de agua</div>
            </div>
            <div style={{fontSize:10,color:C.muted,marginBottom:12}}>Últimos {Math.min(cambiosAgua.length,20)} cambios · Recomendado: 30% semanal</div>
            <WaterChart cambios={cambiosAgua}/>
            <div style={{display:"flex",gap:12,marginTop:10,justifyContent:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.muted}}><div style={{width:8,height:8,borderRadius:"50%",background:C.green}}/> ≥25%</div>
              <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.muted}}><div style={{width:8,height:8,borderRadius:"50%",background:C.yellow}}/> 15-24%</div>
              <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.muted}}><div style={{width:8,height:8,borderRadius:"50%",background:C.red}}/> &lt;15%</div>
              <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.muted}}><div style={{width:16,height:2,background:C.green,opacity:0.6}}/> 30% ideal</div>
            </div>
          </div>

          {/* Lista historial */}
          <div style={ss.card}>
            <div style={ss.slab}>Todos los cambios</div>
            {cambiosAgua.length===0
              ?<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:16}}>Sin cambios de agua registrados.<br/>Regístralos en la pestaña "Registro" marcando 🪣 Cambio de agua.</div>
              :cambiosAgua.map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:`1px solid #1a2540`}}>
                  <div style={{width:42,height:42,borderRadius:12,background:c.pct>=25?"#1c2a1e":c.pct>=15?"#2a2a1e":"#2a1e1e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <div style={{fontSize:14,fontWeight:900,color:c.pct>=25?C.green:c.pct>=15?C.yellow:C.red,lineHeight:1}}>{c.pct}%</div>
                    <div style={{fontSize:8,color:C.muted}}>{Math.round(c.pct/100*300)}L</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:C.text,fontWeight:600}}>{c.fecha}</div>
                    {c.notas&&<div style={{fontSize:10,color:C.muted,marginTop:1}}>{c.notas}</div>}
                  </div>
                  <div style={{width:4,height:36,borderRadius:2,background:c.pct>=25?C.green:c.pct>=15?C.yellow:C.red}}/>
                </div>
              ))
            }
          </div>
        </>}
      </div>}
    </div>
  );
}

// ── IA + INFORME + GASTOS + CALENDARIO ────────────────────────────────────────
function IA({ params, fish, history, expenses, setExpenses, reminders }) {
  const [tab, setTab] = useState("chat");
  const [msgs, setMsgs] = useState([{role:"assistant",text:"¡Hola! 🐠 Soy tu asistente de acuariofilia. Conozco tu acuario amazónico de 300L con discos, ramirezi, neones, corydoras y ancistrus.\n\nPregúntame sobre parámetros, enfermedades, plantas o cualquier duda."}]);
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false);
  const endRef = useRef();
  const [newExp, setNewExp] = useState({concepto:"",importe:"",categoria:"alimento",fecha:toISO()});
  const [expFilter, setExpFilter] = useState("all");
  const [calDate, setCalDate] = useState(new Date());
  const [reportMonth, setReportMonth] = useState(new Date().getMonth()===0?11:new Date().getMonth()-1);
  const [reportYear, setReportYear] = useState(new Date().getMonth()===0?new Date().getFullYear()-1:new Date().getFullYear());

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  // ── Informe mensual
  const generateReport = (month, year) => {
    const isInMonth = (fechaStr) => { try { const d = new Date(fechaStr.includes("/")?fechaStr.split("/").reverse().join("-"):fechaStr); return d.getMonth()===month&&d.getFullYear()===year; } catch { return false; } };
    const mHistory = history.filter(h=>isInMonth(h.fecha));
    const mParams = mHistory.filter(h=>h.tipo==="parametros");
    const mMant = mHistory.filter(h=>h.tipo==="mantenimiento");
    const mFeed = mHistory.filter(h=>h.tipo==="alimentacion");
    const mTreat = mHistory.filter(h=>h.tipo==="tratamiento");
    const mExp = expenses.filter(e=>isInMonth(e.fecha));
    const prevMonth = month===0?11:month-1;
    const prevYear = month===0?year-1:year;
    const prevExp = expenses.filter(e=>isInMonth2(e.fecha,prevMonth,prevYear));
    function isInMonth2(fechaStr,m,y){ try{const d=new Date(fechaStr.includes("/")?fechaStr.split("/").reverse().join("-"):fechaStr);return d.getMonth()===m&&d.getFullYear()===y;}catch{return false;} }
    const totalExp = mExp.reduce((s,e)=>s+parseFloat(e.importe||0),0);
    const prevTotalExp = prevExp.reduce((s,e)=>s+parseFloat(e.importe||0),0);
    const paramStats = PARAM_DEFS.map(p=>{
      const values = mParams.map(h=>parseFloat(h.datos?.[p.key])).filter(v=>!isNaN(v));
      if(!values.length) return {...p,min:null,max:null,avg:null,outOfRange:0};
      const min=Math.min(...values), max=Math.max(...values), avg=values.reduce((a,b)=>a+b,0)/values.length;
      const outOfRange=values.filter(v=>getStatus(p.key,v)==="danger"||getStatus(p.key,v)==="warning").length;
      return {...p,min,max,avg:avg.toFixed(2),outOfRange,total:values.length};
    });
    const cambiosAgua = mMant.filter(m=>m.tareas?.agua).length;
    const pctPromedio = mMant.filter(m=>m.tareas?.agua&&m.porcentaje).reduce((s,m,_,a)=>s+parseFloat(m.porcentaje)/a.length,0);
    return { month, year, mParams, mMant, mFeed, mTreat, mExp, totalExp, prevTotalExp, paramStats, cambiosAgua, pctPromedio, fishStatus: fish };
  };

  const report = generateReport(reportMonth, reportYear);

  // ── Calendario
  const year=calDate.getFullYear(), month=calDate.getMonth();
  const firstDay=(new Date(year,month,1).getDay()+6)%7;
  const daysInMonth=new Date(year,month+1,0).getDate();
  const tipoColor={parametros:C.blue,alimentacion:C.green,mantenimiento:C.orange,tratamiento:C.red,recordatorio:"#a78bfa",gasto:"#fbbf24"};
  const allEvents=[...history,...reminders.map(r=>({...r,tipo:"recordatorio",fecha:r.fecha})),...expenses.map(e=>({...e,tipo:"gasto"}))];
  const getEventsForDay=day=>{const ds=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;return allEvents.filter(e=>{try{const d=new Date(e.fecha?.includes("/")?e.fecha.split("/").reverse().join("-"):e.fecha);return d.getDate()===day&&d.getMonth()===month&&d.getFullYear()===year;}catch{return false;}});};

  // ── Gastos
  const filteredExp=expFilter==="all"?expenses:expenses.filter(e=>e.categoria===expFilter);
  const totalAll=expenses.reduce((s,e)=>s+parseFloat(e.importe||0),0);
  const thisMonthExp=expenses.filter(e=>{try{const d=new Date(e.fecha);return d.getMonth()===new Date().getMonth()&&d.getFullYear()===new Date().getFullYear();}catch{return false;}});
  const totalMonth=thisMonthExp.reduce((s,e)=>s+parseFloat(e.importe||0),0);

  // ── Chat
  const ctx=()=>{const lp=history.find(h=>h.tipo==="parametros");const ps=lp?PARAM_DEFS.map(p=>`${p.label}: ${lp.datos?.[p.key]||"sin dato"} ${p.unit}`).join(", "):"sin registros";return `Eres experto en acuariofilia tropical, especialmente discos (Symphysodon). Acuario amazónico 300L, filtros Oase 300 + Ultramax 2000, calentador Chihiros, CO2. Peces: 8 discos, 6 ramirezi, 8 neones, 9 corydoras, 4 ancistrus. Plantas: rótalas, criptocorinas, Tenellum. Parámetros: ${ps}. Responde en español, conciso, máx 3 párrafos.`;};
  const send=async(text)=>{const msg=text||input.trim();if(!msg)return;setInput("");setLoading(true);const newMsgs=[...msgs,{role:"user",text:msg}];setMsgs([...newMsgs,{role:"assistant",text:"•••"}]);try{const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:ctx(),messages:newMsgs.map(m=>({role:m.role,content:m.text}))})});const data=await res.json();setMsgs([...newMsgs,{role:"assistant",text:data.content?.[0]?.text||"Sin respuesta."}]);}catch{setMsgs([...newMsgs,{role:"assistant",text:"❌ Error de conexión."}]);}setLoading(false);};
  const quickQ=["¿Están bien mis parámetros?","Enfermedades comunes en discos","Consejos para CO2","¿Puedo añadir más peces?"];

  const exportCSV=()=>{const rows=[["Fecha","Tipo","Temp","pH","GH","KH","Amonio","Nitritos","Nitratos","CO2","Notas"]];history.forEach(h=>{if(h.tipo==="parametros")rows.push([h.fecha,"Parámetros",...PARAM_DEFS.map(p=>h.datos?.[p.key]||""),""]);else rows.push([h.fecha,h.tipo,"","","","","","","","",h.notas||h.enfermedad||h.tipo_alimento||""]);});const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"}));a.download="aqualog.csv";a.click();};

  const stC={ok:C.green,warning:C.orange,danger:C.red,neutral:C.muted};

  return (
    <div style={{paddingBottom:90}}>
      <TabBar tabs={[{id:"chat",label:"🤖 IA"},{id:"informe",label:"📊 Informe"},{id:"cal",label:"📅 Cal."},{id:"gastos",label:"💰 €"}]} active={tab} onChange={setTab} small/>

      {/* ── CHAT ── */}
      {tab==="chat"&&<div style={{padding:"0 16px"}}>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:10,marginBottom:4,scrollbarWidth:"none"}}>{quickQ.map((q,i)=><button key={i} onClick={()=>send(q)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"6px 13px",color:C.blue,fontSize:11,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,fontFamily:"inherit"}}>{q}</button>)}</div>
        <div style={{...ss.card,padding:0,overflow:"hidden"}}>
          <div style={{height:300,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
            {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:6}}>{m.role==="assistant"&&<DiscusFish size={20} color={C.blue}/>}<div style={{maxWidth:"82%",background:m.role==="user"?"linear-gradient(135deg,#0ea5e9,#38bdf8)":C.bg,borderRadius:m.role==="user"?"16px 16px 3px 16px":"16px 16px 16px 3px",padding:"9px 13px",fontSize:13,color:C.text,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{m.text}</div></div>)}
            <div ref={endRef}/>
          </div>
          <div style={{borderTop:`1px solid ${C.card}`,padding:"10px 12px",display:"flex",gap:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Pregunta..." style={{...ss.inp,flex:1,fontSize:13,padding:"9px 12px"}}/>
            <button onClick={()=>send()} disabled={loading||!input.trim()} style={{background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",border:"none",borderRadius:10,padding:"9px 16px",color:"#fff",fontWeight:800,fontSize:17,cursor:"pointer",opacity:loading||!input.trim()?0.4:1,fontFamily:"inherit"}}>→</button>
          </div>
        </div>
        <button onClick={exportCSV} style={{...ss.btn,marginTop:10,background:"linear-gradient(135deg,#7c3aed,#a78bfa)"}}>📤 Exportar CSV</button>
      </div>}

      {/* ── INFORME MENSUAL ── */}
      {tab==="informe"&&<div style={{padding:"0 16px"}}>
        {/* Selector mes */}
        <div style={{...ss.card,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>{if(reportMonth===0){setReportMonth(11);setReportYear(y=>y-1);}else setReportMonth(m=>m-1);}} style={{background:"none",border:"none",color:C.blue,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>‹</button>
          <div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:700,color:C.text}}>{MESES[reportMonth]} {reportYear}</div><div style={{fontSize:10,color:C.muted}}>Informe mensual</div></div>
          <button onClick={()=>{if(reportMonth===11){setReportMonth(0);setReportYear(y=>y+1);}else setReportMonth(m=>m+1);}} style={{background:"none",border:"none",color:C.blue,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>›</button>
        </div>

        {report.mParams.length===0&&report.mMant.length===0&&report.mFeed.length===0
          ?<div style={{...ss.card,textAlign:"center",color:C.muted,padding:32}}><div style={{fontSize:40,marginBottom:8}}>📊</div>Sin datos para {MESES[reportMonth]} {reportYear}</div>
          :<>
            {/* Resumen */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              {[{l:"Mediciones",v:report.mParams.length,i:"📊",c:C.blue},{l:"Mantenimientos",v:report.mMant.length,i:"🔧",c:C.orange},{l:"Comidas",v:report.mFeed.length,i:"🍽️",c:C.green},{l:"Tratamientos",v:report.mTreat.length,i:"💊",c:C.red}].map(it=><div key={it.l} style={{background:C.card,borderRadius:12,padding:"12px",border:`1px solid ${it.c}22`}}><div style={{fontSize:18,marginBottom:4}}>{it.i}</div><div style={{fontSize:10,color:C.muted}}>{it.l}</div><div style={{fontSize:22,fontWeight:800,color:it.c}}>{it.v}</div></div>)}
            </div>

            {/* Parámetros del mes */}
            <div style={ss.card}>
              <div style={ss.slab}>Parámetros del mes</div>
              {report.paramStats.filter(p=>p.avg!==null).map(p=>(
                <div key={p.key} style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid #1a2540`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13,color:C.text}}>{p.icon} {p.label}</span>
                    <span style={{fontSize:11,fontWeight:700,color:p.outOfRange>0?C.orange:C.green}}>{p.outOfRange>0?`⚠ ${p.outOfRange}/${p.total} fuera de rango`:`✓ ${p.total} mediciones`}</span>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <div style={{flex:1,background:C.bg,borderRadius:8,padding:"5px 8px",textAlign:"center"}}><div style={{fontSize:8,color:C.muted}}>MIN</div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{p.min} {p.unit}</div></div>
                    <div style={{flex:1,background:"#1c2a1e",borderRadius:8,padding:"5px 8px",textAlign:"center"}}><div style={{fontSize:8,color:C.muted}}>MEDIA</div><div style={{fontSize:12,fontWeight:700,color:C.green}}>{p.avg} {p.unit}</div></div>
                    <div style={{flex:1,background:C.bg,borderRadius:8,padding:"5px 8px",textAlign:"center"}}><div style={{fontSize:8,color:C.muted}}>MAX</div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{p.max} {p.unit}</div></div>
                  </div>
                </div>
              ))}
              {report.paramStats.every(p=>p.avg===null)&&<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:12}}>Sin mediciones este mes</div>}
            </div>

            {/* Mantenimiento */}
            {report.mMant.length>0&&<div style={ss.card}>
              <div style={ss.slab}>Mantenimiento</div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <div style={{flex:1,background:C.bg,borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted}}>Cambios de agua</div><div style={{fontSize:20,fontWeight:800,color:C.blue}}>{report.cambiosAgua}</div></div>
                <div style={{flex:1,background:C.bg,borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:9,color:C.muted}}>% Promedio</div><div style={{fontSize:20,fontWeight:800,color:C.green}}>{report.pctPromedio>0?Math.round(report.pctPromedio):"—"}{report.pctPromedio>0?"%":""}</div></div>
              </div>
              {report.mMant.map((m,i)=><div key={i} style={ss.row}><span style={{fontSize:11,color:C.muted}}>{m.fecha}</span><span style={{fontSize:11,color:C.text}}>{Object.entries(m.tareas||{}).filter(([,v])=>v).map(([k])=>k).join(", ")||"Sin tareas"}</span></div>)}
            </div>}

            {/* Gastos del mes */}
            <div style={ss.card}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={ss.slab}>Gastos del mes</div>
                <div style={{fontSize:16,fontWeight:800,color:"#a78bfa"}}>{report.totalExp.toFixed(2)} €</div>
              </div>
              {report.prevTotalExp>0&&<div style={{fontSize:11,color:C.muted,marginBottom:10}}>Mes anterior: {report.prevTotalExp.toFixed(2)} € {report.totalExp>report.prevTotalExp?`(+${(report.totalExp-report.prevTotalExp).toFixed(2)} €)`:`(-${(report.prevTotalExp-report.totalExp).toFixed(2)} €)`}</div>}
              {EXPENSE_CATS.map(cat=>{const t=report.mExp.filter(e=>e.categoria===cat.id).reduce((s,e)=>s+parseFloat(e.importe||0),0);if(!t)return null;return <div key={cat.id} style={ss.row}><span style={{fontSize:12,color:C.text}}>{cat.icon} {cat.label}</span><span style={{fontSize:12,fontWeight:700,color:cat.color}}>{t.toFixed(2)} €</span></div>;})}
              {report.mExp.length===0&&<div style={{textAlign:"center",color:C.muted,fontSize:12,padding:8}}>Sin gastos registrados</div>}
            </div>

            {/* Estado peces */}
            <div style={ss.card}>
              <div style={ss.slab}>Estado de los peces</div>
              {fish.map(f=><div key={f.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid #1a2540`}}><span style={{fontSize:20}}>{f.emoji}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.text}}>{f.nombre}</div><div style={{fontSize:10,color:C.muted}}>{f.cantidad} ejemplares · {f.especie}</div></div><span style={{fontSize:10,background:(eC[f.estado]||C.green)+"22",color:eC[f.estado]||C.green,border:`1px solid ${(eC[f.estado]||C.green)}44`,borderRadius:20,padding:"2px 8px"}}>{f.estado}</span></div>)}
            </div>
          </>
        }
      </div>}

      {/* ── CALENDARIO ── */}
      {tab==="cal"&&<div style={{padding:"0 16px"}}>
        <div style={{...ss.card,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={()=>setCalDate(d=>new Date(d.getFullYear(),d.getMonth()-1,1))} style={{background:"none",border:"none",color:C.blue,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>‹</button>
          <div style={{fontSize:15,fontWeight:700,color:C.text}}>{MESES[month]} {year}</div>
          <button onClick={()=>setCalDate(d=>new Date(d.getFullYear(),d.getMonth()+1,1))} style={{background:"none",border:"none",color:C.blue,fontSize:20,cursor:"pointer",fontFamily:"inherit"}}>›</button>
        </div>
        <div style={ss.card}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6}}>{DIAS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:C.muted,fontWeight:700,padding:"4px 0"}}>{d}</div>)}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {Array(firstDay).fill(null).map((_,i)=><div key={"e"+i}/>)}
            {Array(daysInMonth).fill(null).map((_,i)=>{const day=i+1;const devs=getEventsForDay(day);const isToday=new Date().getDate()===day&&new Date().getMonth()===month&&new Date().getFullYear()===year;return <div key={day} style={{textAlign:"center",padding:"5px 2px",borderRadius:8,background:isToday?"#0ea5e922":"transparent",border:isToday?`1px solid ${C.blue}`:"1px solid transparent"}}><div style={{fontSize:11,color:isToday?C.blue:C.text,fontWeight:isToday?700:400}}>{day}</div><div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:1,marginTop:2}}>{devs.slice(0,3).map((e,j)=><div key={j} style={{width:5,height:5,borderRadius:"50%",background:tipoColor[e.tipo]||C.muted}}/>)}</div></div>;})}
          </div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>{Object.entries(tipoColor).map(([t,c])=><div key={t} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.muted}}><div style={{width:7,height:7,borderRadius:"50%",background:c}}/>{t}</div>)}</div>
        <div style={ss.card}>
          <div style={ss.slab}>Eventos de {MESES[month]}</div>
          {[...history,...reminders.map(r=>({...r,tipo:"recordatorio",fecha:r.fecha})),...expenses.map(e=>({...e,tipo:"gasto"}))].filter(e=>{try{const d=new Date(e.fecha?.includes("/")?e.fecha.split("/").reverse().join("-"):e.fecha);return d.getMonth()===month&&d.getFullYear()===year;}catch{return false;}}).slice(0,12).map((e,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,...ss.row}}><div style={{width:8,height:8,borderRadius:"50%",background:tipoColor[e.tipo]||C.muted,flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:12,color:C.text}}>{e.titulo||e.tipo_alimento||e.concepto||e.enfermedad||e.tipo}</div><div style={{fontSize:9,color:C.muted}}>{e.fecha}</div></div><span style={{fontSize:9,color:tipoColor[e.tipo]||C.muted,background:(tipoColor[e.tipo]||C.muted)+"22",borderRadius:20,padding:"1px 6px"}}>{e.tipo}</span></div>)}
        </div>
      </div>}

      {/* ── GASTOS ── */}
      {tab==="gastos"&&<div style={{padding:"0 16px"}}>
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <div style={{flex:1,...ss.card,background:"linear-gradient(135deg,#1e1b4b,#1e293b)",marginBottom:0}}><div style={{fontSize:10,color:"#a78bfa",fontWeight:700,marginBottom:2}}>ESTE MES</div><div style={{fontSize:24,fontWeight:900,color:"#fff"}}>{totalMonth.toFixed(2)}<span style={{fontSize:11,color:"#a78bfa"}}> €</span></div></div>
          <div style={{flex:1,...ss.card,marginBottom:0}}><div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:2}}>TOTAL</div><div style={{fontSize:24,fontWeight:900,color:C.text}}>{totalAll.toFixed(2)}<span style={{fontSize:11,color:C.muted}}> €</span></div></div>
        </div>
        <div style={ss.card}>
          <div style={ss.slab}>Por categoría</div>
          {EXPENSE_CATS.map(cat=>{const t=expenses.filter(e=>e.categoria===cat.id).reduce((s,e)=>s+parseFloat(e.importe||0),0);const pct=totalAll>0?(t/totalAll*100):0;return <div key={cat.id} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:C.text}}>{cat.icon} {cat.label}</span><span style={{fontSize:12,fontWeight:700,color:cat.color}}>{t.toFixed(2)} €</span></div><div style={{height:4,background:C.bg,borderRadius:2}}><div style={{height:4,background:cat.color,borderRadius:2,width:`${pct}%`}}/></div></div>;})}
        </div>
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

// ── APP ───────────────────────────────────────────────────────────────────────
const eC={saludable:C.green,enfermo:C.red,observacion:C.yellow};

export default function App() {
  const [section, setSection] = useState("dashboard");
  const [params, setParams] = usePersist("params", {});
  const [fish, setFish] = usePersist("fish", INITIAL_FISH);
  const [plants, setPlants] = usePersist("plants", INITIAL_PLANTS);
  const [history, setHistory] = usePersist("history", []);
  const [gallery, setGallery] = usePersist("gallery", []);
  const [reminders, setReminders] = usePersist("reminders", []);
  const [expenses, setExpenses] = usePersist("expenses", []);
  const [photo, setPhotoRaw] = usePersist("photo", null);
  const setPhoto = useCallback(v=>setPhotoRaw(v),[setPhotoRaw]);
  const addHistory = useCallback(e=>setHistory(h=>[{...e,id:Date.now()},...h]),[setHistory]);
  const pending = reminders.filter(r=>!r.done).length;
  const alerts = useAutoAlerts(params);
  const criticals = alerts.filter(a=>a.level==="danger").length;

  return (
    <div style={{background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"-apple-system,'SF Pro Display','Segoe UI',sans-serif",color:C.text}}>
      <div style={{padding:"48px 16px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <DiscusFish size={38} color={C.blue}/>
          <div><div style={{fontSize:19,fontWeight:900,color:C.text,lineHeight:1.1}}>AquaLog</div><div style={{fontSize:10,color:C.blue,letterSpacing:0.5}}>{SECTIONS.find(s=>s.id===section)?.label}</div></div>
        </div>
        {criticals>0
          ?<div style={{fontSize:11,color:C.red,background:"#450a0a",borderRadius:8,padding:"4px 10px",fontWeight:700,border:`1px solid ${C.red}44`}}>🚨 {criticals} crítica{criticals>1?"s":""}</div>
          :<div style={{fontSize:10,color:"#334155",background:C.card,borderRadius:8,padding:"4px 8px"}}>💾 Auto-guardado</div>
        }
      </div>

      {section==="dashboard"&&<Dashboard params={params} fish={fish} history={history} reminders={reminders} expenses={expenses} photo={photo} setPhoto={setPhoto} setSection={setSection}/>}
      {section==="params"&&<Params params={params} setParams={setParams} history={history} addHistory={addHistory}/>}
      {section==="vida"&&<Vida fish={fish} setFish={setFish} plants={plants} setPlants={setPlants} gallery={gallery} setGallery={setGallery}/>}
      {section==="extras"&&<Extras addHistory={addHistory} history={history} reminders={reminders} setReminders={setReminders}/>}
      {section==="ia"&&<IA params={params} fish={fish} history={history} expenses={expenses} setExpenses={setExpenses} reminders={reminders} setReminders={setReminders}/>}

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
