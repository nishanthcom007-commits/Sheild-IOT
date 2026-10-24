import { useState, useRef } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Activity, Bell, Bot, Building2, Camera, Check, ChevronRight, ClipboardCheck, Code2, Copy, Cpu, FileJson, FileText, Info, LayoutDashboard, Lightbulb, Link2, LockKeyhole, Menu, Network, Play, Plus, RefreshCw, Router, Search, Send, Settings, Shield, ShieldAlert, ShieldCheck, Sparkles, Target, Terminal, Trash2, TriangleAlert, Upload, UserRound, Wifi, X, Zap } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './App.css'

type Risk = 'Low' | 'Medium' | 'High'
type Device = {id:number; name:string; kind:string; model:string; risk:Risk; status:string; checked:string; icon:'camera'|'router'|'scan'|'ac'|'light'}
const devices:Device[]=[
 {id:1,name:'Campus CCTV Camera',kind:'Camera',model:'VisionGuard C20',risk:'High',status:'Attention',checked:'18 min ago',icon:'camera'},
 {id:2,name:'Wi-Fi Router',kind:'Network',model:'NexaLink R500',risk:'Medium',status:'Protected',checked:'42 min ago',icon:'router'},
 {id:3,name:'Biometric Access Scanner',kind:'Access control',model:'BioEntry S2',risk:'Low',status:'Protected',checked:'1 hr ago',icon:'scan'},
 {id:4,name:'Smart AC Controller',kind:'HVAC',model:'ClimateCore 4',risk:'High',status:'Attention',checked:'3 hrs ago',icon:'ac'},
 {id:5,name:'Smart Lighting Controller',kind:'Lighting',model:'LumaMesh 12',risk:'Low',status:'Protected',checked:'Today, 08:30',icon:'light'}]
const posture=[{day:'Mon',score:69},{day:'Tue',score:72},{day:'Wed',score:70},{day:'Thu',score:77},{day:'Fri',score:76},{day:'Sat',score:81},{day:'Sun',score:84}]
const risks=[{name:'Low',value:2,color:'#3ddc97'},{name:'Medium',value:1,color:'#e7be67'},{name:'High',value:2,color:'#f17b6b'}]
const nav=[['Overview','/',LayoutDashboard],['Device Passport','/passport',ShieldCheck],['Code Security Auditor','/auditor',Code2],['Attack Simulator','/simulator',Network],['Security Reports','/reports',FileText],['Gemma AI Assistant','/assistant',Sparkles],['Trust Center','/trust',LockKeyhole],['About ShieldIoT','/about',Building2],['Settings','/settings',Settings]] as const
const example='# Wi-Fi telemetry example — DEMO ONLY\nSSID = "campus-iot"\nPASSWORD = "admin123"  # avoid secrets in source\n\ndef send_status(device_id, value):\n    url = "http://telemetry.example/status"\n    return requests.post(url, json={"id": device_id, "value": value})\n'
function Icon({type}:{type:Device['icon']}) { const C=type==='camera'?Camera:type==='router'?Router:type==='scan'?ClipboardCheck:type==='ac'?Activity:Lightbulb;return <C size={18}/> }
function Badge({children}:{children:React.ReactNode}){return <span className={'badge '+String(children).toLowerCase()}>{children}</span>}
function Card({children,cn='' }:{children:React.ReactNode;cn?:string}){return <section className={'card '+cn}>{children}</section>}
function Demo(){return <span className="demo"><i/> Demo data</span>}
function Intro({title,children,actions}:{title:string;children:React.ReactNode;actions?:React.ReactNode}){return <div className="intro"><div><small>SECURITY WORKSPACE</small><h1>{title}</h1><p>{children}</p></div><div className="intro-actions">{actions}</div></div>}
function Notice({children}:{children:React.ReactNode}){return <div className="notice"><Info size={18}/>{children}</div>}
function Metric({icon,label,value,detail,tone}:{icon:React.ReactNode;label:string;value:string;detail:string;tone:string}){return <Card cn="metric"><span className={'metric-icon '+tone}>{icon}</span><div><small>{label}</small><strong>{value}</strong><span>{detail}</span></div></Card>}
function Event({title,time,tone='blue'}:{title:string;time:string;tone?:string}){return <div className="event"><span className={'event-icon '+tone}><Activity size={16}/></span><div><b>{title}</b><small>{time}</small></div></div>}
function Overview({toast}:{toast:(s:string)=>void}){return <div className="page"><Intro title="Security overview" actions={<><button className="btn soft"><FileJson size={16}/> Export snapshot</button><button className="btn primary" onClick={()=>toast('Demo assessment started — no live device was contacted.')}><Plus size={16}/> New assessment</button></>}>A high-level view of your <Demo/> connected-device security posture.</Intro><div className="metrics"><Metric icon={<Cpu/>} label="Devices assessed" value="05" detail="All demo devices" tone="green"/><Metric icon={<TriangleAlert/>} label="Require attention" value="02" detail="Review recommended" tone="orange"/><Metric icon={<ShieldAlert/>} label="Open findings" value="06" detail="4 high priority" tone="red"/><Metric icon={<RefreshCw/>} label="Last assessment" value="18m" detail="Campus CCTV Camera" tone="blue"/></div><div className="dashboard"><Card cn="chart-card"><header><div><h3>Security posture</h3><span>Demo trend across the last 7 days</span></div><b className="score">84 <small>/100</small></b></header><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={posture}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#47d7b1" stopOpacity=".3"/><stop offset="1" stopColor="#47d7b1" stopOpacity="0"/></linearGradient></defs><CartesianGrid vertical={false} stroke="#23354a"/><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{fill:'#8292a8',fontSize:12}}/><YAxis hide domain={[50,100]}/><Tooltip contentStyle={{background:'#111d2e',border:'1px solid #28435a'}}/><Area dataKey="score" stroke="#47d7b1" strokeWidth={3} fill="url(#g)"/></AreaChart></ResponsiveContainer></div></Card><Card cn="risk-card"><header><div><h3>Risk distribution</h3><span>5 assessed demo devices</span></div></header><div className="pie"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={risks} dataKey="value" innerRadius={53} outerRadius={77} paddingAngle={5} stroke="none">{risks.map(x=><Cell key={x.name} fill={x.color}/>)}</Pie></PieChart></ResponsiveContainer><div><b>05</b><small>devices</small></div></div><div className="legend">{risks.map(x=><span key={x.name}><i style={{background:x.color}}/>{x.name}<b>{x.value}</b></span>)}</div></Card></div><div className="overview-bottom"><Card cn="inventory"><header><div><h3>Device inventory</h3><span>Sample devices for demonstration purposes only</span></div></header><div className="table-wrap"><table><thead><tr><th>Device</th><th>Model</th><th>Risk level</th><th>Status</th><th>Last assessed</th></tr></thead><tbody>{devices.map(d=><tr key={d.id}><td><div className="device"><span><Icon type={d.icon}/></span><div><b>{d.name}</b><small>{d.kind}</small></div></div></td><td>{d.model}</td><td><Badge>{d.risk}</Badge></td><td><i className={'dot '+(d.status==='Protected'?'ok':'warn')}/>{d.status}</td><td>{d.checked}</td></tr>)}</tbody></table></div></Card><Card cn="events"><header><div><h3>Recent events</h3><span>From virtual demo assessments</span></div></header><Event title="Unencrypted telemetry endpoint" time="18 min ago" tone="red"/><Event title="Virtual defense verified" time="42 min ago" tone="green"/><Event title="Assessment completed" time="1 hr ago"/><Event title="Firmware review recommended" time="3 hrs ago" tone="orange"/></Card></div></div>}
function Passport({toast}:{toast:(s:string)=>void}){const [preview,setPreview]=useState('');const [working,setWorking]=useState(false);const [done,setDone]=useState(false);const input=useRef<HTMLInputElement>(null);const [form,setForm]=useState({manufacturer:'VisionGuard',model:'C20',firmware:'2.4.1'});function file(f?:File){if(f){setPreview(URL.createObjectURL(f));setDone(false)}}function assess(){if(!form.model)return toast('Enter a device model to continue.');setWorking(true);setTimeout(()=>{setWorking(false);setDone(true);toast('Demo assessment complete. No live device was contacted.')},1200)}return <div className="page"><Intro title="Device Passport" actions={<Demo/>}>Assess a device label or QR code with a transparent, backend-ready review flow.</Intro><Notice><span><b>Demo mode:</b> A photo or QR code alone cannot establish whether a device has been hacked or completely secure. Results are illustrative, not verified advisories.</span></Notice><div className="passport"><div><Card><header><div><h3>Device label inspection</h3><span>Upload an image or choose a demo device</span></div><Camera size={19}/></header><input ref={input} className="hidden" type="file" accept="image/*" onChange={e=>file(e.target.files?.[0])}/><div className="drop" onClick={()=>input.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();file(e.dataTransfer.files?.[0])}}>{preview?<img src={preview} alt="Selected device label"/>:<><span><Upload size={25}/></span><b>Drop a label photo here</b><small>PNG, JPG or WEBP up to 10 MB</small><button className="btn soft">Browse image</button></>}</div><div className="samples"><small>Or use demo sample</small>{devices.slice(0,3).map(d=><button key={d.id} onClick={()=>{setForm({manufacturer:d.model.split(' ')[0],model:d.model,firmware:'2.4.1'});toast('Demo device loaded.')}}><Icon type={d.icon}/>{d.kind}</button>)}</div></Card><Card cn="findings"><header><div><h3>{done?'Assessment findings':'Assessment preview'}</h3><span>{done?'Illustrative demo signals':'Run a demo assessment to see structured results'}</span></div></header>{done?<><Finding risk="High" title="Review exposed telemetry configuration" text="Demo rule: endpoint uses a non-encrypted URL pattern."/><Finding risk="Medium" title="Confirm firmware support status" text="No verified manufacturer advisory is connected in demo mode."/></>:<div className="empty"><ShieldCheck size={28}/><b>No assessment yet</b><span>Your demo findings and their limits will appear here.</span></div>}</Card></div><div><Card cn="form"><header><div><h3>Device details</h3><span>Edit information before assessment</span></div></header>{Object.entries(form).map(([key,value])=><label key={key}>{key==='firmware'?'Firmware version':key[0].toUpperCase()+key.slice(1)}<input value={value} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}<div className="qr"><Link2/><div><b>QR inspection</b><small>Available when a readable QR is in an uploaded image.</small></div><Badge>Unknown</Badge></div><button className="btn primary wide" disabled={working} onClick={assess}>{working?<><RefreshCw className="spin"/> Assessing…</>:<><ShieldCheck/> Assess device</>}</button></Card><Card cn="history"><header><div><h3>Demo assessment history</h3><span>Stored locally in this browser</span></div></header>{devices.slice(0,2).map(d=><div className="history-row" key={d.id}><span><Icon type={d.icon}/></span><div><b>{d.name}</b><small>Today · Demo</small></div><Badge>{d.risk}</Badge></div>)}</Card></div></div></div>}
function Finding({risk,title,text}:{risk:Risk;title:string;text:string}){return <div className="finding"><Badge>{risk}</Badge><div><b>{title}</b><p>{text}</p><small><Info size={13}/> Heuristic demo signal · Checked just now</small></div></div>}
function Auditor({toast}:{toast:(s:string)=>void}){const [code,setCode]=useState(example);const [done,setDone]=useState(false);const [lang,setLang]=useState('Python');const copy=()=>{navigator.clipboard?.writeText(code);toast('Code copied to clipboard.')};return <div className="page"><Intro title="Code Security Auditor" actions={<Demo/>}>Review Arduino, C/C++, and Python snippets with clear separation between demo heuristics and future AI analysis.</Intro><Notice><span>Current results are <b>rule-based demo checks</b>. A Gemma 4 backend can later add AI analysis, context, and verified evidence.</span></Notice><div className="auditor"><Card cn="editor-card"><header><div><Terminal size={18}/><h3>Source workspace</h3></div><div><select value={lang} onChange={e=>setLang(e.target.value)}><option>Python</option><option>Arduino</option><option>C++</option><option>C</option></select><button className="icon-btn" onClick={copy}><Copy size={16}/></button></div></header><div className="editor"><div>{code.split('\n').map((_,i)=><span key={i}>{i+1}</span>)}</div><textarea value={code} onChange={e=>setCode(e.target.value)} spellCheck={false}/></div><footer><button className="text-btn" onClick={()=>setCode(example)}>Load vulnerable example</button><button className="btn primary" onClick={()=>{setDone(true);toast('Demo heuristic scan complete — not AI output.')}}><Play size={16}/> Analyze code</button></footer></Card><Card cn="audit"><header><div><h3>{done?'Heuristic findings':'Analysis results'}</h3><span>{done?'Demo rules — no model connection':'Run a local demo analysis to begin'}</span></div></header>{done?<><Audit risk="High" line="3" title="Hardcoded credential" text="Secrets in source can be exposed through repositories, logs, or device extraction."/><Audit risk="Medium" line="6" title="Unencrypted HTTP transport" text="Telemetry may be observable or modifiable in transit."/><Audit risk="Medium" line="7" title="Input validation review" text="Confirm inputs are type-checked before use."/></>:<div className="empty"><Code2 size={28}/><b>Ready to inspect your code</b><span>Results will include affected lines, explanation, remediation, and confidence labels.</span></div>}</Card></div>{done&&<Card cn="secure"><header><div><h3>Suggested secure pattern</h3><span>Illustrative remediation; adapt it to your deployment.</span></div><button className="text-btn" onClick={copy}><Copy size={15}/> Copy</button></header><pre>{'# Never place production credentials in source control\nendpoint = os.environ.get("TELEMETRY_URL")\nresponse = requests.post(endpoint, json=payload, timeout=5, verify=True)'}</pre></Card>}</div>}
function Audit({risk,line,title,text}:{risk:Risk;line:string;title:string;text:string}){return <div className="audit-item"><div><Badge>{risk}</Badge><small>Line {line}</small></div><b>{title}</b><p>{text}</p><span><Lightbulb size={15}/> <b>Suggested remediation:</b> use secure provisioning, encrypted transport, and input validation.</span></div>}
function Simulator({toast}:{toast:(s:string)=>void}){const [active,setActive]=useState(1);const [attack,setAttack]=useState('Stable');const [isolated,setIsolated]=useState<number[]>([]);const selected=devices.find(d=>d.id===active)!;function run(type:string){setAttack(type);setActive(type==='DDoS active'?1:5);toast(type==='DDoS active'?'Virtual DDoS traffic started.':'Virtual suspicious connection added.')}function toggle(){setIsolated(x=>x.includes(active)?x.filter(n=>n!==active):[...x,active]);toast(isolated.includes(active)?'Virtual device restored.':'Virtual device isolated.')};return <div className="page"><Intro title="Attack Simulator" actions={<span className="simulation"><Activity size={14}/> SIMULATION ONLY</span>}>Explore a closed, virtual campus IoT network. Nothing here scans, connects to, or attacks real devices.</Intro><div className="sim"><Card cn="network"><header><div><h3>Virtual device network</h3><span>Click a node to inspect its simulated state</span></div><Badge>{attack==='Stable'?'Low':attack==='DDoS active'?'High':'Medium'}</Badge></header><div className="stage"><div className="hub"><Shield size={25}/><b>ShieldIoT</b></div>{devices.map((d,i)=><button key={d.id} className={'node n'+i+(active===d.id?' selected':'')+(isolated.includes(d.id)?' isolated':'')} onClick={()=>setActive(d.id)}><span><Icon type={d.icon}/></span><b>{d.name.replace('Campus ','').replace(' Controller','')}</b><small>{isolated.includes(d.id)?'Isolated':d.status}</small></button>)}</div><footer><button className="btn danger" onClick={()=>run('DDoS active')}><Zap size={16}/> Simulate DDoS</button><button className="btn soft" onClick={()=>run('Unknown connection')}><Wifi size={16}/> Suspicious connection</button><button className="btn green" onClick={()=>{setAttack('Defense applied');toast('Virtual defense applied. No real network was affected.')}}><ShieldCheck size={16}/> Run virtual defense</button></footer></Card><div className="sim-side"><Card><header><div><h3>Selected device</h3><span>Virtual state</span></div><Icon type={selected.icon}/></header><h2>{selected.name}</h2><p>{selected.model} · {selected.kind}</p><div className="details"><span>Risk level <Badge>{selected.risk}</Badge></span><span>Network state <b>{isolated.includes(active)?'Isolated':attack==='DDoS active'&&active===1?'Affected':'Normal'}</b></span><span>Data source <b>Demo scenario</b></span></div><button className="btn wide soft" onClick={toggle}>{isolated.includes(active)?<><RefreshCw/> Restore device</>:<><LockKeyhole/> Isolate virtual device</>}</button></Card><Card><header><div><h3>Incident timeline</h3><span>Current virtual session</span></div></header><Event title="Scenario initialized" time="Now"/>{attack!=='Stable'&&<Event title={attack+' simulated'} time="Just now" tone="red"/>}</Card></div></div></div>}
function Assistant({toast}:{toast:(s:string)=>void}){const [items,setItems]=useState([{role:'ai',text:'I’m the ShieldIoT demo assistant. I can explain the sample workspace, but I am not connected to Gemma 4 or any live security source.'}]);const [input,setInput]=useState('');const [loading,setLoading]=useState(false);function send(q=input){if(!q.trim())return;setItems(x=>[...x,{role:'user',text:q}]);setInput('');setLoading(true);setTimeout(()=>{setItems(x=>[...x,{role:'ai',text:'Demo response: this interface is ready for a future Gemma 4 backend. Until then, verify recommendations against device documentation and your environment.'}]);setLoading(false)},600)}const q=['Explain the security risks in this camera assessment.','Review this Arduino code for vulnerabilities.','Summarize the latest virtual incident.','How can I improve my router’s security?'];return <div className="page"><Intro title="Security assistant" actions={<Badge>Unknown</Badge>}>Static replies are clearly marked as demo content and never presented as Gemma 4 output.</Intro><div className="assistant"><Card cn="chat"><header><div className="ai-avatar"><Sparkles size={18}/></div><div><h3>ShieldIoT Assistant</h3><span>Demo response engine</span></div><button className="icon-btn" onClick={()=>{setItems([]);toast('Conversation cleared.')}}><Trash2 size={16}/></button></header><div className="messages">{items.map((m,i)=><div key={i} className={'message '+m.role}><span>{m.role==='ai'?<Bot size={17}/>:<UserRound size={16}/>}</span><div>{m.text}{m.role==='ai'&&<small>Demo content · no live model connection</small>}</div></div>)}{loading&&<div className="message ai"><span><Bot size={17}/></span><div className="typing">•••</div></div>}</div><footer><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask about a demo security scenario…"/><button className="btn primary" onClick={()=>send()}><Send size={16}/></button></footer></Card><div className="assistant-side"><Card><header><div><h3>Suggested questions</h3><span>For this demo session</span></div></header>{q.map(x=><button className="question" key={x} onClick={()=>send(x)}>{x}<ChevronRight size={15}/></button>)}</Card><Card cn="evidence"><ShieldCheck size={20}/><h3>Evidence & uncertainty</h3><p>Future AI outputs should distinguish verified evidence, inferred risks, and unknown information. This demo has no external evidence connection.</p></Card></div></div></div>}
function Reports({toast}:{toast:(s:string)=>void}){const [filter,setFilter]=useState('All');const reports=[['Device assessment','Campus CCTV Camera assessment','High','Today, 10:42'],['Code audit','Telemetry Python review','High','Today, 09:15'],['Virtual incident','CCTV DDoS scenario','Medium','Yesterday'],['Device assessment','Wi-Fi Router assessment','Medium','Oct 21']];const list=filter==='All'?reports:reports.filter(x=>x[0]===filter);function download(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(list,null,2)],{type:'application/json'}));a.download='sheildiot-demo-reports.json';a.click();toast('Demo reports exported as JSON.')}return <div className="page"><Intro title="Security reports" actions={<button className="btn primary" onClick={download}><FileJson size={16}/> Export JSON</button>}>Find device assessments, code audits, and virtual incident reports. Every record is marked as demo content.</Intro><div className="report-tools"><div><Search size={17}/><input placeholder="Search demo reports"/></div>{['All','Device assessment','Code audit','Virtual incident'].map(x=><button className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><Card cn="reports">{list.map((r,i)=><div className="report" key={i}><span>{r[0]==='Code audit'?<Code2/>:r[0]==='Virtual incident'?<Network/>:<ClipboardCheck/>}</span><div><b>{r[1]}</b><small>{r[0]} · {r[3]} · Demo data</small></div><Badge>{r[2]}</Badge><button className="text-btn" onClick={()=>toast('Report detail view is ready; this record has no verified external evidence.')}>View <ChevronRight size={16}/></button></div>)}</Card><Notice><span><b>Report limitation:</b> exports contain local demonstration data only. They do not represent verified device, firmware, or incident findings.</span></Notice></div>}
function Trust(){const rows=[['What you provide','Device labels, model names, firmware versions, and code snippets may be needed for an assessment. Supply only information you are authorized to share.'],['Credentials and secrets','Do not enter Wi-Fi passwords, camera passwords, private keys, API keys, or other secrets into this demo.'],['Local and backend processing','This frontend currently runs a local demo. Any future backend processing, retention, and data transfer rules are planned until implemented and verified.'],['AI limitations','AI may be incomplete or wrong. Treat suggestions as prompts for human review, not a security guarantee.'],['Responsible use','Use simulations only on virtual scenarios. Obtain authorization before assessing any real device or network.']];return <div className="page narrow"><Intro title="Trust Center">Plain-language transparency for the ShieldIoT demo and its future integrations.</Intro><div className="trust-hero"><ShieldCheck size={32}/><div><h2>Security decisions deserve clear limits.</h2><p>ShieldIoT is a frontend demonstration. It does not connect to devices, verify firmware, store a security guarantee, or send data to Gemma 4.</p></div><Demo/></div><div className="trust">{rows.map((r,i)=><Card key={r[0]}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{r[0]}</h3><p>{r[1]}</p></div></Card>)}</div></div>}
function About(){const principles=[['Security with context','Bring device information, code review, and virtual incident response into one understandable workspace.'],['Honest by design','Label demo content, uncertainty, and evidence boundaries so teams do not mistake illustration for verified risk intelligence.'],['Human-led decisions','Use AI as a transparent assistant for explanation and prioritization—not as a substitute for authorized security review.']];return <div className="page narrow about"><Intro title="About ShieldIoT">A security workspace concept for teams responsible for connected devices, firmware, and operational technology.</Intro><section className="about-hero"><div className="about-emblem"><ShieldCheck size={42}/></div><div><span className="about-label">OUR PURPOSE</span><h2>Make IoT security understandable, actionable, and responsible.</h2><p>ShieldIoT is designed as a unified experience for assessing device information, reviewing firmware-related code, rehearsing virtual incidents, and communicating risk clearly across technical and non-technical teams.</p></div></section><section className="about-grid"><Card><Target size={21}/><span className="about-label">MISSION</span><h3>Confidence without false certainty</h3><p>We help teams organize security signals and next steps while being candid about what is verified, inferred, unknown, or purely demonstrative.</p></Card><Card><Building2 size={21}/><span className="about-label">WHO IT IS FOR</span><h3>Built around connected environments</h3><p>Campus teams, facilities operators, prototyping labs, and security analysts working with cameras, routers, access systems, and smart controllers.</p></Card></section><section className="about-principles"><div><span className="about-label">WORKING PRINCIPLES</span><h2>A professional security posture starts with clarity.</h2></div><div>{principles.map(([title,text],index)=><article key={title}><span>{String(index+1).padStart(2,'0')}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section><section className="about-note"><Info size={19}/><div><b>Current product status</b><p>This is a frontend demonstration. ShieldIoT does not currently connect to real devices, store assessment data on a server, verify manufacturer advisories, or invoke Gemma 4. Those capabilities require a separately configured and authorized backend.</p></div></section></div>}
function SettingsPage({toast}:{toast:(s:string)=>void}){const [notify,setNotify]=useState(true);const [compact,setCompact]=useState(false);return <div className="page narrow"><Intro title="Settings">Manage local preferences for this browser-based demonstration.</Intro><div className="settings">{[['Demo mode','All current device, report, and assistant content is illustrative.'],['Notifications','Show local in-app feedback after demo actions.'],['Compact workspace','Use tighter spacing where supported.'],['Assessment history','Demo history is stored in this browser when implemented actions add data.'],['Application information','ShieldIoT frontend · Gemma 4 integration status: not configured.']].map((x,i)=><Card key={x[0]}><div><h3>{x[0]}</h3><p>{x[1]}</p></div>{i===0?<Demo/>:i===1?<button className={'toggle '+(notify?'on':'')} onClick={()=>setNotify(!notify)}><i/></button>:i===2?<button className={'toggle '+(compact?'on':'')} onClick={()=>setCompact(!compact)}><i/></button>:i===3?<button className="btn danger-outline" onClick={()=>toast('Demo history cleared locally.')}><Trash2 size={16}/> Clear demo data</button>:<small>v0.1.0 demo</small>}</Card>)}</div></div>}
function Shell(){const [open,setOpen]=useState(false);const [toasts,setToasts]=useState<{id:number;text:string}[]>([]);function toast(text:string){const id=Date.now();setToasts(x=>[...x,{id,text}]);setTimeout(()=>setToasts(x=>x.filter(a=>a.id!==id)),3400)}return <div className={'shell '+(open?'open':'')}><aside><div className="brand"><span><Shield size={21}/></span><b>shield<i>iot</i></b></div><nav>{nav.map(([name,path,C])=><NavLink end={path==='/'} to={path} key={path} onClick={()=>setOpen(false)}><C size={18}/><span>{name}</span></NavLink>)}</nav><div className="model"><i className="dot warn"/><div><b>Gemma 4</b><small>Demo mode</small></div></div></aside><div className="workspace"><header className="topbar"><button className="menu" onClick={()=>setOpen(true)}><Menu size={20}/></button><div className="crumb"><span>Workspace</span><ChevronRight size={14}/><b>ShieldIoT</b></div><div><button className="search"><Search size={17}/> Search <kbd>⌘ K</kbd></button><button className="icon-btn"><Bell size={18}/></button><span className="avatar">AD</span></div></header><main><Routes><Route path="/" element={<Overview toast={toast}/>}/><Route path="/passport" element={<Passport toast={toast}/>}/><Route path="/auditor" element={<Auditor toast={toast}/>}/><Route path="/simulator" element={<Simulator toast={toast}/>}/><Route path="/reports" element={<Reports toast={toast}/>}/><Route path="/assistant" element={<Assistant toast={toast}/>}/><Route path="/trust" element={<Trust/>}/><Route path="/about" element={<About/>}/><Route path="/settings" element={<SettingsPage toast={toast}/>}/><Route path="*" element={<Navigate to="/"/>}/></Routes></main></div><div className="shade" onClick={()=>setOpen(false)}/><div className="toasts">{toasts.map(x=><div key={x.id}><Check size={16}/>{x.text}<button onClick={()=>setToasts(v=>v.filter(y=>y.id!==x.id))}><X size={14}/></button></div>)}</div></div>}
export default function ShieldIoT(){return <Shell/>}
/*

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
*/
