import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════
// DATA — LOADED FROM SUPABASE (fallback to hardcoded)
// ═══════════════════════════════════════════════════
const FALLBACK_V = [
{id:1,make:"Volkswagen",model:"Golf",variant:"1.5 TSI 150 Life",year:2021,price:18995,mileage:24500,fuel:"Petrol",transmission:"DSG Auto",bodyType:"Hatchback",colour:"Indium Grey",doors:5,engineSize:"1.5L",co2:130,insuranceGroup:15,euroEmissions:"Euro 6d",ulezCompliant:true,taxCost:165,img:"🚗",dealerId:1,daysListed:12,vrm:"AB21 CDE",motExpiry:"2026-03-14",previousKeepers:1,serviceHistory:true,hpiClear:true,matchScore:96,priceRating:"Good Deal",location:"London, E14",features:["Adaptive Cruise","Apple CarPlay","Parking Sensors","LED Headlights","Heated Seats"],specs:{bhp:150,torque:"250 Nm",acceleration:8.5,bootSpace:380,fuelEconomy:47.1},mot:[{date:"2025-03-14",result:"Pass",mileage:21200,advisories:["Front-left tyre slightly worn (minor)"]},{date:"2024-03-10",result:"Pass",mileage:16800,advisories:[]},{date:"2023-03-08",result:"Pass",mileage:11500,advisories:["Nearside brake disc slightly worn"]}]},
{id:2,make:"BMW",model:"3 Series",variant:"320d M Sport",year:2020,price:22495,mileage:38200,fuel:"Diesel",transmission:"Automatic",bodyType:"Saloon",colour:"Alpine White",doors:4,engineSize:"2.0L",co2:118,insuranceGroup:28,euroEmissions:"Euro 6d",ulezCompliant:true,taxCost:155,img:"🏎️",dealerId:2,daysListed:28,vrm:"CD20 FGH",motExpiry:"2026-01-22",previousKeepers:2,serviceHistory:true,hpiClear:true,matchScore:91,priceRating:"Great Deal",location:"London, NW1",features:["M Sport Body Kit","Sat Nav Pro","Leather Seats","Reverse Camera","Harman Kardon"],specs:{bhp:190,torque:"400 Nm",acceleration:7.1,bootSpace:480,fuelEconomy:55.4},mot:[{date:"2025-01-22",result:"Pass",mileage:35100,advisories:["Rear exhaust slightly corroded"]},{date:"2024-01-18",result:"Pass",mileage:28400,advisories:[]}]},
{id:3,make:"Tesla",model:"Model 3",variant:"Long Range AWD",year:2022,price:29995,mileage:18300,fuel:"Electric",transmission:"Automatic",bodyType:"Saloon",colour:"Pearl White",doors:4,engineSize:"Electric",co2:0,insuranceGroup:48,euroEmissions:"Zero Emission",ulezCompliant:true,taxCost:0,img:"⚡",dealerId:3,daysListed:5,vrm:"EF22 GHI",motExpiry:"2025-11-30",previousKeepers:1,serviceHistory:true,hpiClear:true,matchScore:88,priceRating:"Fair Price",location:"London, SW19",features:["Autopilot","15\" Touchscreen","Glass Roof","Premium Audio","Sentry Mode"],specs:{bhp:346,torque:"493 Nm",acceleration:4.4,bootSpace:561,fuelEconomy:"4 mi/kWh",batteryCapacity:"75 kWh",range:374},mot:[{date:"2025-11-30",result:"Pass",mileage:16200,advisories:[]}]},
{id:4,make:"Ford",model:"Focus",variant:"1.0 EcoBoost ST-Line",year:2020,price:13495,mileage:42100,fuel:"Petrol",transmission:"Manual",bodyType:"Hatchback",colour:"Magnetic Grey",doors:5,engineSize:"1.0L",co2:125,insuranceGroup:14,euroEmissions:"Euro 6d",ulezCompliant:true,taxCost:155,img:"🚗",dealerId:4,daysListed:35,vrm:"GH20 JKL",motExpiry:"2026-04-18",previousKeepers:2,serviceHistory:true,hpiClear:true,matchScore:85,priceRating:"Good Deal",location:"Croydon, CR0",features:["ST-Line Body Kit","SYNC 3","B&O Audio","Lane Keep Assist","Auto Headlights"],specs:{bhp:125,torque:"200 Nm",acceleration:10.0,bootSpace:375,fuelEconomy:51.4},mot:[{date:"2025-04-18",result:"Pass",mileage:38900,advisories:["Offside front tyre approaching minimum tread"]},{date:"2024-04-15",result:"Pass",mileage:32100,advisories:["Windscreen wiper worn (minor)"]},{date:"2024-04-12",result:"Fail",mileage:32100,advisories:["Nearside headlamp not working (major)","Windscreen wiper worn (minor)"]}]},
{id:5,make:"Audi",model:"A3",variant:"35 TFSI S Line",year:2021,price:21995,mileage:29800,fuel:"Petrol",transmission:"S tronic Auto",bodyType:"Hatchback",colour:"Navarra Blue",doors:5,engineSize:"1.5L",co2:132,insuranceGroup:21,euroEmissions:"Euro 6d",ulezCompliant:true,taxCost:165,img:"🏎️",dealerId:1,daysListed:18,vrm:"JK21 MNO",motExpiry:"2026-06-02",previousKeepers:1,serviceHistory:true,hpiClear:true,matchScore:93,priceRating:"Fair Price",location:"London, W1",features:["S Line Interior","Virtual Cockpit","MMI Navigation","Audi Pre Sense","Privacy Glass"],specs:{bhp:150,torque:"250 Nm",acceleration:8.4,bootSpace:380,fuelEconomy:48.7},mot:[{date:"2025-06-02",result:"Pass",mileage:27100,advisories:[]}]},
{id:6,make:"Mercedes-Benz",model:"A-Class",variant:"A200 AMG Line",year:2021,price:23495,mileage:22100,fuel:"Petrol",transmission:"7G-DCT Auto",bodyType:"Hatchback",colour:"Cosmos Black",doors:5,engineSize:"1.3L",co2:138,insuranceGroup:24,euroEmissions:"Euro 6d",ulezCompliant:true,taxCost:165,img:"🏎️",dealerId:2,daysListed:8,vrm:"LM21 PQR",motExpiry:"2026-07-11",previousKeepers:1,serviceHistory:true,hpiClear:true,matchScore:90,priceRating:"Good Deal",location:"London, EC2",features:["AMG Body Kit","MBUX","Ambient Lighting","Widescreen Cockpit","Keyless Entry"],specs:{bhp:163,torque:"250 Nm",acceleration:8.0,bootSpace:370,fuelEconomy:46.3},mot:[{date:"2025-07-11",result:"Pass",mileage:19800,advisories:["Slight oil leak from engine (advisory)"]}]},
{id:7,make:"Toyota",model:"Yaris",variant:"1.5 Hybrid Design",year:2022,price:16995,mileage:15200,fuel:"Hybrid",transmission:"CVT Auto",bodyType:"Hatchback",colour:"Tokyo Red",doors:5,engineSize:"1.5L",co2:92,insuranceGroup:10,euroEmissions:"Euro 6d",ulezCompliant:true,taxCost:0,img:"🚗",dealerId:3,daysListed:14,vrm:"NP22 STU",motExpiry:"2025-09-28",previousKeepers:1,serviceHistory:true,hpiClear:true,matchScore:82,priceRating:"Fair Price",location:"Richmond, TW9",features:["Hybrid System","Toyota Safety Sense","8\" Touchscreen","Wireless Charging","Auto Climate"],specs:{bhp:116,torque:"120 Nm",acceleration:9.7,bootSpace:286,fuelEconomy:68.9},mot:[{date:"2025-09-28",result:"Pass",mileage:13100,advisories:[]}]},
{id:8,make:"Kia",model:"Sportage",variant:"1.6 T-GDi HEV GT-Line S",year:2023,price:31995,mileage:8400,fuel:"Hybrid",transmission:"Automatic",bodyType:"SUV",colour:"Runway Red",doors:5,engineSize:"1.6L",co2:135,insuranceGroup:22,euroEmissions:"Euro 6d",ulezCompliant:true,taxCost:165,img:"🚙",dealerId:4,daysListed:3,vrm:"QR23 VWX",motExpiry:"2026-08-15",previousKeepers:1,serviceHistory:true,hpiClear:true,matchScore:87,priceRating:"Fair Price",location:"Wimbledon, SW19",features:["7-Year Warranty","Panoramic Roof","12.3\" Dual Screens","360° Camera","Heated/Ventilated Seats"],specs:{bhp:230,torque:"350 Nm",acceleration:8.0,bootSpace:591,fuelEconomy:47.9},mot:[{date:"2025-08-15",result:"Pass",mileage:5200,advisories:[]}]},
];
const FALLBACK_D = [
{id:1,name:"Hilton Car Supermarket",location:"London, E14",rating:4.8,reviews:342,responseTime:"< 15 min",trustScore:95},
{id:2,name:"Premium Motors London",location:"London, NW1",rating:4.6,reviews:218,responseTime:"< 30 min",trustScore:88},
{id:3,name:"Electric Avenue Cars",location:"London, SW19",rating:4.9,reviews:156,responseTime:"< 10 min",trustScore:97},
{id:4,name:"South London Motors",location:"Croydon, CR0",rating:4.5,reviews:287,responseTime:"< 20 min",trustScore:85},
];
const NOTIFS_SEED = [
{id:1,type:"price_drop",title:"Price dropped!",desc:"BMW 320d M Sport now £22,495 (was £23,995)",time:"2h ago",read:false,vehicleIdx:1,icon:"🔻",color:"#DC2626"},
{id:2,type:"new_match",title:"New match found",desc:"2021 Audi A3 S Line matches 'Hatchback under £25k'",time:"4h ago",read:false,vehicleIdx:4,icon:"🆕",color:"#2563EB"},
{id:3,type:"agent",title:"Deal Hunter found something",desc:"Great deal on Golf GTI — £1,200 below market",time:"1d ago",read:true,icon:"🤖",color:"#7C3AED"},
{id:4,type:"mot_reminder",title:"MOT due in 31 days",desc:"Your VW Golf (AB21 CDE) MOT expires 14 Mar 2026",time:"1d ago",read:false,icon:"📋",color:"#D97706"},
{id:5,type:"saved_search",title:"3 new cars match your search",desc:"'Electric under £35k' — Tesla, MG4 & Polestar listed today",time:"6h ago",read:false,icon:"🔔",color:"#059669"},
{id:6,type:"dealer_response",title:"Dealer replied",desc:"Hilton Car Supermarket responded to your enquiry",time:"3h ago",read:false,icon:"💬",color:"#2563EB"},
{id:7,type:"price_drop",title:"Watching: Kia Sportage",desc:"Price reduced £500 to £31,495 — 3 days on market",time:"5h ago",read:true,vehicleIdx:7,icon:"🔻",color:"#DC2626"},
];
const REVIEWS_SEED = [
{id:1,dealerId:1,author:"James T.",rating:5,date:"2026-01-15",verified:true,text:"Brilliant experience. Smooth process from viewing to collection. No pressure at all and the car was exactly as described. Would 100% buy from Hilton again."},
{id:2,dealerId:1,author:"Sarah M.",rating:4,date:"2025-12-08",verified:true,text:"Good selection of cars and fair prices. The salesperson was helpful though it took a bit longer than expected to get the finance sorted."},
{id:3,dealerId:1,author:"David K.",rating:5,date:"2025-11-20",verified:true,text:"Third car I've bought from Hilton. They always go the extra mile. Full service history checked, HPI clear, and even threw in a valet."},
{id:4,dealerId:2,author:"Emma R.",rating:4,date:"2026-01-22",verified:true,text:"Really transparent pricing — the car was listed at a fair price and they didn't try to upsell. Quick response to my messages too."},
{id:5,dealerId:2,author:"Chris L.",rating:3,date:"2025-10-14",verified:false,text:"Car was fine but the handover felt rushed. Would have liked more time to go through features. Average experience overall."},
{id:6,dealerId:3,author:"Tom H.",rating:5,date:"2026-02-01",verified:true,text:"Best EV dealer in London. Incredibly knowledgeable about charging, range, and running costs. Made the switch to electric stress-free."},
{id:7,dealerId:3,author:"Lisa W.",rating:5,date:"2026-01-28",verified:true,text:"Amazing service. They even helped me set up my home charger installer. The Tesla was in immaculate condition."},
];
const GARAGE = [{id:101,make:"Volkswagen",model:"Golf",variant:"1.5 TSI Life",year:2021,vrm:"AB21 CDE",colour:"Indium Grey",mileage:24500,motExpiry:"2026-03-14",taxExpiry:"2026-04-01",value:18500,img:"🚗",services:[{date:"2025-08-12",type:"Full Service",garage:"Halfords Autocentre",cost:189},{date:"2024-12-01",type:"MOT + Service",garage:"VW Main Dealer",cost:295},{date:"2024-03-10",type:"Annual Service",garage:"Halfords Autocentre",cost:169}]}];
const EXPENSES=[{month:"Jan",fuel:142,insurance:0,tax:0,mot:0,service:0,parking:45,tolls:5,other:12},{month:"Feb",fuel:128,insurance:52,tax:0,mot:0,service:0,parking:38,tolls:5,other:8},{month:"Mar",fuel:155,insurance:52,tax:0,mot:45,service:189,parking:52,tolls:10,other:15},{month:"Apr",fuel:138,insurance:52,tax:165,mot:0,service:0,parking:42,tolls:5,other:22},{month:"May",fuel:145,insurance:52,tax:0,mot:0,service:0,parking:55,tolls:15,other:10},{month:"Jun",fuel:162,insurance:52,tax:0,mot:0,service:0,parking:48,tolls:5,other:18}];
const BIK_DATA=[{name:"Tesla Model 3 LR",co2:0,p11d:42990,type:"EV",bikRate:3},{name:"BMW 320d M Sport",co2:118,p11d:38850,type:"Diesel",bikRate:31},{name:"VW Golf 1.5 TSI",co2:130,p11d:27610,type:"Petrol",bikRate:32},{name:"Toyota Yaris Hybrid",co2:92,p11d:22810,type:"Hybrid",bikRate:24},{name:"Audi A3 35 TFSI",co2:132,p11d:32280,type:"Petrol",bikRate:32},{name:"Kia Sportage HEV",co2:135,p11d:35400,type:"Hybrid",bikRate:33}];
const WARNING_LIGHTS=[{icon:"🔴",name:"Engine (Check Engine)",severity:"Medium-High",meaning:"Engine fault detected. Could be minor sensor or serious issue.",action:"Safe to drive short distance. Book diagnostic ASAP.",cost:"£50-£500+"},{icon:"🔴",name:"Oil Pressure",severity:"Critical",meaning:"Oil pressure dangerously low. Engine damage imminent.",action:"STOP immediately. Do NOT continue driving.",cost:"£100-£3,000+"},{icon:"🟡",name:"Battery / Charging",severity:"Medium",meaning:"Battery not charging properly. Alternator or battery failing.",action:"Drive to garage. May stop suddenly.",cost:"£80-£350"},{icon:"🔴",name:"Brake System",severity:"Critical",meaning:"Brake fluid low or brake system fault.",action:"STOP when safe. Check fluid level. Do not drive.",cost:"£100-£400"},{icon:"🟡",name:"Tyre Pressure (TPMS)",severity:"Low",meaning:"One or more tyres below recommended pressure.",action:"Safe to drive to nearest garage. Check pressures.",cost:"Free-£5 (air)"},{icon:"🟡",name:"ABS Warning",severity:"Medium",meaning:"Anti-lock braking system fault. Normal brakes still work.",action:"Drive carefully. ABS won't activate in emergency.",cost:"£100-£300"},{icon:"🟡",name:"Engine Temperature",severity:"High",meaning:"Engine overheating. Coolant level or thermostat issue.",action:"Pull over. Let engine cool. Check coolant.",cost:"£50-£500"},{icon:"🟢",name:"Diesel Particulate Filter",severity:"Low",meaning:"DPF needs regeneration. Short journeys clogging filter.",action:"Take a 30-min motorway drive at 60+mph.",cost:"£100-£1,500 if blocked"}];
const THEORY_QS=[{q:"What's the minimum tread depth for car tyres?",opts:["1.0mm","1.6mm","2.0mm","2.5mm"],correct:1},{q:"You're driving at 70mph on a motorway. What's the minimum safe gap in dry conditions?",opts:["1 second","2 seconds","3 seconds","4 seconds"],correct:1},{q:"What should you do at a pelican crossing when the amber light is flashing?",opts:["Stop and wait","Accelerate through","Give way to pedestrians on the crossing","Flash your headlights"],correct:2},{q:"You've just passed your test. How many penalty points will result in your licence being revoked?",opts:["3 points","6 points","9 points","12 points"],correct:1},{q:"What's the national speed limit on a single carriageway for cars?",opts:["50mph","60mph","70mph","80mph"],correct:1}];
const ACCIDENT_STEPS=[{title:"Are you safe?",icon:"🆘",items:["Turn on hazard lights","Turn off engine if safe","Check yourself & passengers for injuries","If anyone is hurt, call 999 immediately","If on motorway, get behind barrier"],action:"I'm safe — next step"},{title:"Secure the scene",icon:"⚠️",items:["Set up warning triangle 45m behind car","Wear high-vis if you have one","Do NOT stand between vehicles","If blocking road, move cars if safe to do so","Note exact location (road name, landmark)"],action:"Scene secured"},{title:"Exchange details",icon:"📋",items:["Name & address of other driver(s)","Vehicle registration number(s)","Insurance company & policy number","Phone number of other driver(s)","Note: make, model, colour of other car(s)"],action:"Details collected"},{title:"Gather evidence",icon:"📸",items:["Photograph all vehicle damage (all angles)","Photograph the road layout & positions","Capture road signs, markings, conditions","Get witness names & phone numbers","Note weather, lighting, road surface"],action:"Evidence captured"},{title:"Report & claim",icon:"📞",items:["Report to police if injury or road blocked","Report to insurer within 24 hours","You MUST report within 24h if you didn't exchange details at scene","Keep all receipts for expenses","Do NOT admit fault to anyone"],action:"Understood — show contacts"}];

const fmt = p => `£${p.toLocaleString()}`;
const fmtMi = m => `${m.toLocaleString()} mi`;
const carImg = (make, model, year, angle = 1) => `https://cdn.imagin.studio/getimage?customer=img&make=${encodeURIComponent(make)}&modelFamily=${encodeURIComponent(model.split(" ")[0])}&modelYear=${year}&angle=${angle}&width=800`;

// ═══════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════
const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #F7F8FA;
  --surface: #FFFFFF;
  --surface-hover: #F0F2F5;
  --border: #E8ECF0;
  --border-light: #F0F2F5;
  --text: #1A1D21;
  --text-secondary: #6B7280;
  --text-tertiary: #9CA3AF;
  --primary: #2563EB;
  --primary-light: #EFF6FF;
  --primary-dark: #1D4ED8;
  --success: #059669;
  --success-light: #ECFDF5;
  --warning: #D97706;
  --warning-light: #FFFBEB;
  --error: #DC2626;
  --error-light: #FEF2F2;
  --radius: 16px;
  --radius-sm: 10px;
  --radius-xs: 6px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  --shadow-lg: 0 8px 30px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
  --shadow-xl: 0 16px 48px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05);
  --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}

* { margin:0; padding:0; box-sizing:border-box; }
body { background:var(--bg); color:var(--text); font-family:var(--font); -webkit-font-smoothing:antialiased; }
::selection { background:var(--primary); color:white; }
input, select, textarea { font-family:var(--font); }

/* SCROLLBAR */
::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:#D1D5DB; border-radius:3px; }
::-webkit-scrollbar-thumb:hover { background:#9CA3AF; }

/* NAVBAR */
.navbar {
  position:fixed; top:0; left:0; right:0; z-index:100;
  height:64px; background:rgba(255,255,255,0.85);
  backdrop-filter:blur(20px) saturate(180%);
  border-bottom:1px solid var(--border);
  display:flex; align-items:center; justify-content:space-between;
  padding:0 32px;
}
.nav-left { display:flex; align-items:center; gap:32px; }
.nav-logo {
  font-size:22px; font-weight:800; letter-spacing:-0.5px;
  display:flex; align-items:center; gap:2px; cursor:pointer;
}
.nav-logo span { color:var(--primary); }
.nav-links { display:flex; gap:4px; }
.nav-link {
  padding:8px 16px; border-radius:var(--radius-sm); font-size:14px;
  font-weight:600; color:var(--text-secondary); background:none; border:none;
  cursor:pointer; transition:all 0.15s;
}
.nav-link:hover { color:var(--text); background:var(--surface-hover); }
.nav-link.active { color:var(--primary); background:var(--primary-light); }
.nav-right { display:flex; align-items:center; gap:12px; }
.nav-btn {
  width:40px; height:40px; border-radius:50%; background:none; border:none;
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  font-size:18px; transition:all 0.15s; position:relative; color:var(--text-secondary);
}
.nav-btn:hover { background:var(--surface-hover); color:var(--text); }
.nav-badge {
  position:absolute; top:4px; right:4px;
  width:8px; height:8px; border-radius:50%;
  background:var(--error); border:2px solid white;
}
.nav-avatar {
  width:36px; height:36px; border-radius:50%;
  background:linear-gradient(135deg, var(--primary), #7C3AED);
  color:white; font-weight:700; font-size:14px;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:transform 0.15s;
}
.nav-avatar:hover { transform:scale(1.05); }

/* LAYOUT */
.app-layout { padding-top:64px; min-height:100vh; }
.main-content { max-width:1400px; margin:0 auto; padding:0 32px; }

/* HERO AI SECTION */
.hero-section {
  padding:48px 0 32px; text-align:center;
}
.hero-badge {
  display:inline-flex; align-items:center; gap:6px;
  padding:6px 16px; border-radius:100px;
  background:var(--primary-light); color:var(--primary);
  font-size:13px; font-weight:600; margin-bottom:16px;
  border:1px solid rgba(37,99,235,0.15);
}
.hero-badge-dot {
  width:6px; height:6px; border-radius:50%;
  background:var(--primary); animation:pulse-dot 2s infinite;
}
@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
.hero-title {
  font-size:40px; font-weight:800; letter-spacing:-1px;
  line-height:1.15; margin-bottom:12px;
  background:linear-gradient(135deg, var(--text) 0%, #374151 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
}
.hero-sub {
  font-size:17px; color:var(--text-secondary);
  max-width:520px; margin:0 auto 28px; line-height:1.5;
}

/* AI CHAT INPUT — HERO */
.ai-search-box {
  max-width:680px; margin:0 auto;
  background:var(--surface); border:2px solid var(--border);
  border-radius:var(--radius); padding:6px 6px 6px 20px;
  display:flex; align-items:center; gap:8px;
  transition:all 0.25s; box-shadow:var(--shadow);
}
.ai-search-box:focus-within {
  border-color:var(--primary);
  box-shadow:0 0 0 4px rgba(37,99,235,0.1), var(--shadow-md);
}
.ai-search-icon { font-size:20px; flex-shrink:0; }
.ai-search-input {
  flex:1; border:none; background:none; outline:none;
  font-size:16px; color:var(--text); font-weight:500;
}
.ai-search-input::placeholder { color:var(--text-tertiary); font-weight:400; }
.ai-search-btn {
  padding:10px 24px; border-radius:var(--radius-sm);
  background:var(--primary); color:white; border:none;
  font-weight:700; font-size:14px; cursor:pointer;
  transition:all 0.15s; white-space:nowrap;
}
.ai-search-btn:hover { background:var(--primary-dark); }
.ai-search-btn:disabled { opacity:0.5; cursor:not-allowed; }

/* QUICK ACTIONS */
.quick-actions {
  display:flex; justify-content:center; gap:8px;
  margin-top:16px; flex-wrap:wrap;
}
.quick-action {
  padding:8px 18px; border-radius:100px;
  background:var(--surface); border:1px solid var(--border);
  font-size:13px; font-weight:600; color:var(--text-secondary);
  cursor:pointer; transition:all 0.15s;
}
.quick-action:hover { border-color:var(--primary); color:var(--primary); background:var(--primary-light); }

/* SECTION */
.section { padding:32px 0; }
.section-head {
  display:flex; justify-content:space-between; align-items:center;
  margin-bottom:20px;
}
.section-title { font-size:22px; font-weight:800; letter-spacing:-0.3px; }
.section-subtitle { font-size:14px; color:var(--text-secondary); margin-top:2px; }
.section-link {
  font-size:14px; font-weight:600; color:var(--primary);
  background:none; border:none; cursor:pointer;
  display:flex; align-items:center; gap:4px;
}
.section-link:hover { text-decoration:underline; }

/* FILTER BAR */
.filter-bar {
  display:flex; gap:8px; margin-bottom:20px;
  overflow-x:auto; padding-bottom:4px;
}
.filter-chip {
  padding:8px 18px; border-radius:100px;
  background:var(--surface); border:1px solid var(--border);
  font-size:13px; font-weight:600; color:var(--text-secondary);
  cursor:pointer; transition:all 0.15s; white-space:nowrap;
}
.filter-chip.active {
  background:var(--text); color:white; border-color:var(--text);
}
.filter-chip:hover:not(.active) { border-color:#9CA3AF; }

/* VEHICLE GRID */
.vehicle-grid {
  display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));
  gap:20px;
}
.vcard {
  background:var(--surface); border:1px solid var(--border);
  border-radius:var(--radius); overflow:hidden;
  cursor:pointer; transition:all 0.2s; position:relative;
}
.vcard:hover { box-shadow:var(--shadow-md); transform:translateY(-2px); border-color:#D1D5DB; }
.vcard-img {
  height:200px; display:flex; align-items:center; justify-content:center;
  background:linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
  position:relative; overflow:hidden;
}
.vcard-img img {
  width:100%; height:100%; object-fit:cover;
  transition:transform 0.3s ease;
}
.vcard:hover .vcard-img img { transform:scale(1.05); }
.vcard-match {
  position:absolute; top:12px; left:12px;
  padding:4px 10px; border-radius:100px;
  background:var(--primary); color:white;
  font-size:12px; font-weight:700;
}
.vcard-fav {
  position:absolute; top:12px; right:12px;
  width:36px; height:36px; border-radius:50%;
  background:rgba(255,255,255,0.9); border:none;
  cursor:pointer; font-size:16px; display:flex;
  align-items:center; justify-content:center;
  backdrop-filter:blur(8px); transition:all 0.15s;
}
.vcard-fav:hover { transform:scale(1.1); }
.vcard-body { padding:16px; }
.vcard-title { font-size:16px; font-weight:700; margin-bottom:2px; }
.vcard-variant { font-size:13px; color:var(--text-secondary); margin-bottom:8px; }
.vcard-price { font-size:20px; font-weight:800; color:var(--primary); margin-bottom:10px; }
.vcard-meta { display:flex; gap:12px; font-size:12px; color:var(--text-secondary); margin-bottom:10px; }
.vcard-badges { display:flex; gap:6px; flex-wrap:wrap; }

/* BADGES */
.badge {
  display:inline-flex; align-items:center; gap:4px;
  padding:4px 10px; border-radius:100px;
  font-size:12px; font-weight:600;
}
.badge-green { background:var(--success-light); color:var(--success); }
.badge-blue { background:var(--primary-light); color:var(--primary); }
.badge-yellow { background:var(--warning-light); color:var(--warning); }
.badge-red { background:var(--error-light); color:var(--error); }
.badge-gray { background:#F3F4F6; color:var(--text-secondary); }

/* CHAT PANEL */
.chat-panel {
  position:fixed; bottom:24px; right:32px; z-index:80;
  width:420px; max-height:calc(100vh - 112px);
  background:var(--surface); border-radius:var(--radius);
  border:1px solid var(--border); box-shadow:var(--shadow-xl);
  display:flex; flex-direction:column; overflow:hidden;
}
@keyframes slideUpChat { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.chat-header {
  padding:16px 20px; border-bottom:1px solid var(--border);
  display:flex; justify-content:space-between; align-items:center;
}
.chat-header-title { font-size:16px; font-weight:700; display:flex; align-items:center; gap:8px; }
.chat-header-dot { width:8px; height:8px; border-radius:50%; background:#10B981; }
.chat-close {
  width:32px; height:32px; border-radius:50%;
  background:none; border:none; cursor:pointer;
  font-size:18px; color:var(--text-secondary);
  display:flex; align-items:center; justify-content:center;
}
.chat-close:hover { background:var(--surface-hover); }
.chat-messages { flex:1; overflow-y:auto; padding:16px 20px; min-height:300px; max-height:400px; }
.chat-msg { margin-bottom:12px; display:flex; flex-direction:column; animation:fadeIn 0.2s ease; }
.chat-msg.user { align-items:flex-end; }
.chat-msg.user .chat-bubble { background:var(--primary); color:white; border-radius:var(--radius) var(--radius) 4px var(--radius); }
.chat-bubble {
  background:#F3F4F6; border-radius:var(--radius) var(--radius) var(--radius) 4px;
  padding:12px 16px; max-width:85%; font-size:14px; line-height:1.6;
}
.chat-cars { display:flex; gap:8px; overflow-x:auto; margin-top:8px; padding-bottom:4px; }
.chat-car-card {
  min-width:160px; padding:12px; background:var(--surface); border:1px solid var(--border);
  border-radius:var(--radius-sm); cursor:pointer; transition:all 0.15s; flex-shrink:0;
}
.chat-car-card:hover { border-color:var(--primary); }
.chat-quick-replies { display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; }
.chat-qr {
  padding:6px 14px; border-radius:100px;
  background:var(--surface); border:1px solid var(--border);
  font-size:12px; font-weight:600; color:var(--text-secondary);
  cursor:pointer; transition:all 0.15s;
}
.chat-qr:hover { border-color:var(--primary); color:var(--primary); }
.chat-input-area {
  padding:12px 16px; border-top:1px solid var(--border);
  display:flex; gap:8px; align-items:center;
}
.chat-input {
  flex:1; border:1px solid var(--border); border-radius:100px;
  padding:10px 16px; font-size:14px; outline:none; background:var(--bg);
}
.chat-input:focus { border-color:var(--primary); background:white; }
.chat-send {
  width:36px; height:36px; border-radius:50%;
  background:var(--primary); color:white; border:none;
  cursor:pointer; font-size:16px; display:flex;
  align-items:center; justify-content:center;
  transition:all 0.15s;
}
.chat-send:hover { background:var(--primary-dark); }
.btn-mic {
  width:36px; height:36px; border-radius:50%;
  background:var(--surface); border:1.5px solid var(--border);
  cursor:pointer; font-size:15px; display:flex;
  align-items:center; justify-content:center;
  transition:all 0.2s; flex-shrink:0;
}
.btn-mic:hover { border-color:var(--primary); background:rgba(66,133,244,0.06); }
.btn-mic.active {
  background:#DC2626; border-color:#DC2626; color:white;
  animation:micPulse 1.5s infinite;
}
.hero-mic { width:32px; height:32px; font-size:14px; background:transparent; border:none; flex-shrink:0; }
.hero-mic:hover { background:rgba(66,133,244,0.08); border-radius:50%; }
.hero-mic.active { background:#DC2626; border-radius:50%; color:white; animation:micPulse 1.5s infinite; }
.chat-mic { background:transparent; border:none; width:32px; height:32px; font-size:14px; }
.chat-mic:hover { background:rgba(66,133,244,0.08); }
.chat-mic.active { background:#DC2626; border-radius:50%; color:white; animation:micPulse 1.5s infinite; }
@keyframes micPulse { 0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,0.3)} 50%{box-shadow:0 0 0 8px rgba(220,38,38,0)} }
/* Voice listening states */
.voice-listening { border-color:#DC2626 !important; box-shadow:0 0 0 3px rgba(220,38,38,0.15) !important; animation:voiceGlow 1.5s infinite !important; }
@keyframes voiceGlow { 0%,100%{box-shadow:0 0 0 3px rgba(220,38,38,0.1)} 50%{box-shadow:0 0 0 6px rgba(220,38,38,0.2)} }
.voice-bar {
  max-width:680px; margin:10px auto 0; padding:10px 16px;
  background:linear-gradient(135deg,#FEE2E2,#FEF2F2); border:1.5px solid #FECACA;
  border-radius:var(--radius); display:flex; align-items:center; gap:12px;
  animation:fadeIn 0.2s ease;
}
.voice-bar span { font-size:13px; font-weight:600; color:#DC2626; flex:1; }
.voice-bar-inner { display:flex; gap:3px; align-items:center; }
.voice-wave {
  width:3px; border-radius:3px; background:#DC2626;
  animation:voiceWave 0.8s ease-in-out infinite;
}
.voice-wave:nth-child(1){height:12px;animation-delay:0s}
.voice-wave:nth-child(2){height:20px;animation-delay:0.1s}
.voice-wave:nth-child(3){height:16px;animation-delay:0.2s}
.voice-wave:nth-child(4){height:22px;animation-delay:0.3s}
.voice-wave:nth-child(5){height:14px;animation-delay:0.4s}
@keyframes voiceWave { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
.voice-bar-stop {
  padding:6px 14px; border-radius:100px; border:1.5px solid #DC2626;
  background:white; color:#DC2626; font-size:12px; font-weight:700;
  cursor:pointer; transition:all 0.15s;
}
.voice-bar-stop:hover { background:#DC2626; color:white; }
.typing-dots { display:flex; gap:4px; padding:4px 0; }
.typing-dot {
  width:7px; height:7px; border-radius:50%;
  background:var(--text-tertiary); animation:bounce 1.4s infinite;
}
.typing-dot:nth-child(2){animation-delay:0.2s}
.typing-dot:nth-child(3){animation-delay:0.4s}
@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}

/* CHAT FAB */
.chat-fab {
  position:fixed; bottom:24px; right:32px; z-index:80;
  width:60px; height:60px; border-radius:50%;
  background:linear-gradient(135deg, var(--primary), #7C3AED);
  color:white; border:none; cursor:pointer;
  font-size:24px; display:flex; align-items:center;
  justify-content:center; box-shadow:var(--shadow-lg);
  transition:all 0.2s;
}
.chat-fab:hover { transform:scale(1.08); box-shadow:var(--shadow-xl); }

/* SLIDE-OVER MODAL */
.modal-backdrop {
  position:fixed; inset:0; z-index:200;
  background:rgba(0,0,0,0.25); backdrop-filter:blur(2px);
  animation:fadeIn 0.2s ease;
}
.slide-over {
  position:fixed; top:0; right:0; bottom:0; z-index:201;
  width:min(520px, 100vw); background:var(--surface);
  border-left:1px solid var(--border);
  box-shadow:var(--shadow-xl);
  overflow-y:auto; animation:slideInRight 0.3s ease;
}
@keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
.slide-header {
  position:sticky; top:0; z-index:10;
  padding:20px 24px; background:rgba(255,255,255,0.95);
  backdrop-filter:blur(12px);
  border-bottom:1px solid var(--border);
  display:flex; justify-content:space-between; align-items:center;
}
.slide-title { font-size:18px; font-weight:800; }
.slide-close {
  width:36px; height:36px; border-radius:50%;
  background:var(--surface-hover); border:none; cursor:pointer;
  font-size:18px; display:flex; align-items:center; justify-content:center;
}
.slide-close:hover { background:#E5E7EB; }
.slide-body { padding:24px; }

/* DETAIL PAGE */
.detail-layout { display:grid; grid-template-columns:1fr 400px; gap:32px; padding:24px 0 80px; }
.detail-hero-img {
  height:400px; border-radius:var(--radius); display:flex;
  align-items:center; justify-content:center;
  background:linear-gradient(135deg, #F8F9FA, #E9ECEF);
  overflow:hidden;
}
.detail-hero-img img {
  width:100%; height:100%; object-fit:cover;
}
.detail-sidebar { display:flex; flex-direction:column; gap:16px; }
.detail-price-card {
  background:var(--surface); border:1px solid var(--border);
  border-radius:var(--radius); padding:24px;
}
.detail-price { font-size:28px; font-weight:800; color:var(--primary); margin-bottom:4px; }
.detail-actions-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:16px; }

/* BUTTONS */
.btn {
  padding:10px 20px; border-radius:var(--radius-sm);
  font-weight:700; font-size:14px; cursor:pointer;
  border:none; transition:all 0.15s; display:inline-flex;
  align-items:center; justify-content:center; gap:6px;
}
.btn-primary { background:var(--primary); color:white; }
.btn-primary:hover { background:var(--primary-dark); }
.btn-secondary { background:var(--surface-hover); color:var(--text); }
.btn-secondary:hover { background:#E5E7EB; }
.btn-outline { background:none; border:1px solid var(--border); color:var(--text); }
.btn-outline:hover { border-color:var(--primary); color:var(--primary); }
.btn-block { width:100%; }
.btn-sm { padding:8px 14px; font-size:13px; border-radius:var(--radius-xs); }
.btn-lg { padding:14px 28px; font-size:16px; }

/* CARD */
.card {
  background:var(--surface); border:1px solid var(--border);
  border-radius:var(--radius); padding:16px; transition:all 0.15s;
}
.card-clickable { cursor:pointer; }
.card-clickable:hover { box-shadow:var(--shadow); border-color:#D1D5DB; }

/* INFO GRID */
.info-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); border-radius:var(--radius-sm); overflow:hidden; }
.info-cell { background:var(--surface); padding:14px; text-align:center; }
.info-val { font-size:16px; font-weight:700; }
.info-label { font-size:12px; color:var(--text-secondary); margin-top:2px; }

/* INPUT */
.input {
  width:100%; padding:12px 16px; border:1px solid var(--border);
  border-radius:var(--radius-sm); font-size:14px; outline:none;
  background:var(--surface); color:var(--text); transition:border-color 0.15s;
}
.input:focus { border-color:var(--primary); }
.input-mono { font-family:monospace; font-weight:700; text-transform:uppercase; letter-spacing:2px; }

/* PROGRESS */
.progress { height:6px; background:var(--border-light); border-radius:3px; overflow:hidden; }
.progress-fill { height:100%; background:var(--primary); border-radius:3px; transition:width 0.5s ease; }

/* TAB SWITCHER */
.tabs { display:flex; gap:2px; background:var(--bg); padding:3px; border-radius:var(--radius-sm); }
.tab-btn {
  flex:1; padding:8px 16px; border-radius:8px;
  font-size:13px; font-weight:600; color:var(--text-secondary);
  background:none; border:none; cursor:pointer; transition:all 0.15s;
}
.tab-btn.active { background:var(--surface); color:var(--text); box-shadow:var(--shadow-sm); }

/* STEP ITEMS */
.step-item { display:flex; gap:12px; padding:10px 0; align-items:flex-start; }
.step-dot {
  width:24px; height:24px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:11px; flex-shrink:0; font-weight:700;
}
.step-done { background:var(--success); color:white; }
.step-active { background:var(--primary); color:white; animation:pulse-dot 1.5s infinite; }
.step-pending { background:var(--border); color:var(--text-tertiary); }

/* TOOLS GRID */
.tools-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:12px; margin-top:12px; }
.tool-card {
  background:var(--surface); border:1px solid var(--border);
  border-radius:var(--radius-sm); padding:16px; text-align:center;
  cursor:pointer; transition:all 0.15s;
}
.tool-card:hover { border-color:var(--primary); box-shadow:var(--shadow); transform:translateY(-1px); }
.tool-icon { font-size:28px; margin-bottom:8px; }
.tool-label { font-size:13px; font-weight:700; }
.tool-desc { font-size:11px; color:var(--text-secondary); margin-top:2px; }

/* SIDEBAR NAV (TOOLS) */
.tools-sidebar {
  position:fixed; left:0; top:64px; bottom:0;
  width:240px; background:var(--surface);
  border-right:1px solid var(--border);
  overflow-y:auto; z-index:50; padding:16px 0;
  animation:slideInLeft 0.25s ease;
}
@keyframes slideInLeft { from{transform:translateX(-100%)} to{transform:translateX(0)} }
.tools-section-title {
  font-size:11px; font-weight:700; color:var(--text-tertiary);
  text-transform:uppercase; letter-spacing:1px;
  padding:12px 16px 4px;
}
.tools-item {
  display:flex; align-items:center; gap:10px;
  width:100%; padding:10px 16px; background:none; border:none;
  color:var(--text-secondary); cursor:pointer; font-size:13px;
  font-weight:600; transition:all 0.1s; text-align:left;
}
.tools-item:hover { background:var(--surface-hover); color:var(--text); }
.tools-item.active { background:var(--primary-light); color:var(--primary); }
.tools-item-icon { font-size:16px; width:24px; text-align:center; }

/* NOTIFICATION PANEL */
.notif-panel {
  position:fixed; top:64px; right:32px; z-index:150;
  width:360px; background:var(--surface); border:1px solid var(--border);
  border-radius:var(--radius); box-shadow:var(--shadow-xl);
  animation:fadeIn 0.2s ease; overflow:hidden;
}
.notif-header { padding:16px 20px; border-bottom:1px solid var(--border); }
.notif-item {
  padding:14px 20px; border-bottom:1px solid var(--border-light);
  cursor:pointer; transition:background 0.1s;
}
.notif-item:hover { background:var(--surface-hover); }

/* ANIMATIONS */
@keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
@keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
.modal-overlay {
  position:fixed; top:0; left:0; right:0; bottom:0;
  background:rgba(0,0,0,0.5); backdrop-filter:blur(4px);
  display:flex; align-items:center; justify-content:center;
  padding:20px; z-index:10000;
}
.fade-in { animation:fadeIn 0.25s ease; }

/* UTILS */
.flex { display:flex; }
.flex-col { flex-direction:column; }
.gap-1 { gap:4px; }
.gap-2 { gap:8px; }
.gap-3 { gap:12px; }
.gap-4 { gap:16px; }
.items-center { align-items:center; }
.justify-between { justify-content:space-between; }
.justify-center { justify-content:center; }
.flex-1 { flex:1; }
.flex-wrap { flex-wrap:wrap; }
.text-xs { font-size:12px; }
.text-sm { font-size:13px; }
.text-md { font-size:15px; }
.text-lg { font-size:18px; }
.font-bold { font-weight:700; }
.font-extra { font-weight:800; }
.text-muted { color:var(--text-secondary); }
.text-primary { color:var(--primary); }
.text-success { color:var(--success); }
.text-error { color:var(--error); }
.text-center { text-align:center; }
.mb-1 { margin-bottom:4px; }
.mb-2 { margin-bottom:8px; }
.mb-3 { margin-bottom:12px; }
.mb-4 { margin-bottom:16px; }
.mt-2 { margin-top:8px; }
.mt-3 { margin-top:12px; }
.mt-4 { margin-top:16px; }
.p-3 { padding:12px; }
.p-4 { padding:16px; }
.w-full { width:100%; }
.label-sm { font-size:11px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:8px; }
.divider { height:1px; background:var(--border); margin:16px 0; }

/* RESPONSIVE */
@media (max-width:1024px) {
  .detail-layout { grid-template-columns:1fr; }
  .vehicle-grid { grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); }
}
@media (max-width:768px) {
  .navbar { padding:0 16px; }
  .main-content { padding:0 16px; }
  .nav-links { display:none; }
  .hero-title { font-size:28px; }
  .slide-over { width:100vw; }
  .chat-panel { width:calc(100vw - 32px); right:16px; bottom:16px; }
}
`;

// ═══════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════
// ═══ SlideOver Component (stable reference — outside main component) ═══
const SlideOver = ({show, onClose, title, children}) => {
  if(!show) return null;
  return (<>
    <div className="modal-backdrop" onClick={onClose}/>
    <div className="slide-over">
      <div className="slide-header">
        <div className="slide-title">{title}</div>
        <button className="slide-close" onClick={onClose}>✕</button>
      </div>
      <div className="slide-body">{children}</div>
    </div>
  </>);
};

export default function CarGPTDesktop() {
  // ═══ DATABASE STATE ═══
  const [V, setV] = useState(FALLBACK_V);
  const [D, setD] = useState(FALLBACK_D);
  const [dbLoaded, setDbLoaded] = useState(false);

  // ═══ FETCH FROM DATABASE ═══
  useEffect(() => {
    const fuelMap = {petrol:"Petrol",diesel:"Diesel",electric:"Electric",hybrid:"Hybrid",plug_in_hybrid:"Plug-in Hybrid"};
    const transMap = {manual:"Manual",automatic:"Automatic"};
    const bodyMap = {hatchback:"Hatchback",saloon:"Saloon",suv:"SUV",estate:"Estate",coupe:"Coupe",convertible:"Convertible",mpv:"MPV",van:"Van",pickup:"Pickup",other:"Other"};
    const imgMap = {electric:"⚡",suv:"🚙",saloon:"🏎️",hatchback:"🚗",estate:"🚗",coupe:"🏎️"};
    fetch("/api/vehicles").then(r=>r.json()).then(data=>{
      if(!data.vehicles?.length) return;
      const cars = data.vehicles.map((v,i) => ({
        id: v.id,
        make: v.make,
        model: v.model,
        variant: v.variant || "",
        year: v.year,
        price: v.price,
        mileage: v.mileage,
        fuel: fuelMap[v.fuel_type] || v.fuel_type,
        transmission: v.transmission === "automatic" ? "Automatic" : "Manual",
        bodyType: bodyMap[v.body_type] || v.body_type,
        colour: v.colour,
        doors: v.doors,
        engineSize: v.engine_size || "",
        co2: v.co2_emissions || 0,
        insuranceGroup: v.insurance_group || 0,
        euroEmissions: v.euro_emissions || "",
        ulezCompliant: v.ulez_compliant !== false,
        taxCost: v.tax_cost || 0,
        img: imgMap[v.fuel_type] || imgMap[v.body_type] || "🚗",
        dealerId: v.dealer_id,
        daysListed: v.days_listed || 0,
        vrm: v.vrm,
        motExpiry: v.mot_expiry || "",
        previousKeepers: v.previous_keepers || 1,
        serviceHistory: v.service_history === "full",
        hpiClear: v.hpi_clear !== false,
        matchScore: 95 - (i * 3),
        priceRating: v.price_indicator || "Good Deal",
        location: v.dealer ? `${v.dealer.city || "London"}, ${v.dealer.postcode || ""}` : "London",
        features: v.features || [],
        specs: {
          bhp: v.bhp || 0,
          torque: v.torque || "",
          acceleration: v.acceleration || 0,
          bootSpace: v.boot_space || 0,
          fuelEconomy: v.fuel_economy || "",
          batteryCapacity: v.battery_capacity || null,
          range: v.electric_range || null,
        },
        mot: v.mot || [],
        description: v.description || "",
        images: v.images || [],
      }));
      const dealers = (data.dealers || []).map(d => ({
        id: d.id,
        name: d.name,
        location: `${d.city || "London"}, ${d.postcode || ""}`,
        rating: parseFloat(d.rating) || 4.5,
        reviews: d.review_count || 0,
        responseTime: d.response_time || "< 2 hours",
        trustScore: d.trust_score || 80,
      }));
      setV(cars);
      setD(dealers);
      setDbLoaded(true);
      console.log(`✅ Loaded ${cars.length} vehicles, ${dealers.length} dealers from database`);
    }).catch(e => console.warn("DB fetch failed, using fallback data:", e.message));
  }, []);

  // ═══ AUTH STATE ═══
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModal, setAuthModal] = useState(null); // null | "login" | "signup"
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  // Check saved session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("cargpt_session");
    if (saved) {
      try {
        const { token, user: u } = JSON.parse(saved);
        if (token) {
          fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "session", token }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.user) {
                setUser(data.user);
                console.log("✅ Session restored:", data.user.email);
              } else {
                sessionStorage.removeItem("cargpt_session");
              }
            })
            .catch(() => sessionStorage.removeItem("cargpt_session"))
            .finally(() => setAuthLoading(false));
          return;
        }
      } catch {}
    }
    setAuthLoading(false);
  }, []);

  // Auth actions
  const authAction = async (action, email, password, name) => {
    setAuthBusy(true);
    setAuthError("");
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, email, password, name }),
      });
      const data = await r.json();
      if (data.error) {
        setAuthError(data.error);
        return false;
      }
      if (data.user) {
        setUser(data.user);
        if (data.session?.access_token) {
          sessionStorage.setItem("cargpt_session", JSON.stringify({ token: data.session.access_token, user: data.user }));
        }
        setAuthModal(null);
        setAEmail(""); setAPass(""); setAName("");
        // Load favourites after login
        loadFavourites(data.user.id);
        console.log("✅ Logged in:", data.user.email);
        return true;
      }
      return false;
    } catch (e) {
      setAuthError("Something went wrong. Please try again.");
      return false;
    } finally {
      setAuthBusy(false);
    }
  };

  const logout = () => {
    const saved = sessionStorage.getItem("cargpt_session");
    if (saved) {
      try {
        const { token } = JSON.parse(saved);
        fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "logout", token }),
        });
      } catch {}
    }
    sessionStorage.removeItem("cargpt_session");
    setUser(null);
    setFavs([]);
    setPage("home");
    setSel(null);
  };

  // Navigation & Views
  const [page, setPage] = useState("home"); // home, search, favourites, garage, profile
  const [sel, setSel] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showTools, setShowTools] = useState(false);

  // Favourites & Data (persistent when logged in)
  const [favs, setFavs] = useState([]);
  const loadFavourites = (userId) => {
    if (!userId) return;
    fetch(`/api/favourites?user_id=${userId}`)
      .then(r => r.json())
      .then(data => { if (data.favourites) setFavs(data.favourites); })
      .catch(() => {});
  };
  // Load favs when user is set
  useEffect(() => { if (user?.id) loadFavourites(user.id); }, [user?.id]);

  const toggleFav = (vehicleId) => {
    if (!user) {
      setAuthModal("login");
      return;
    }
    const isFav = favs.includes(vehicleId);
    // Optimistic update
    setFavs(p => isFav ? p.filter(x => x !== vehicleId) : [...p, vehicleId]);
    // Persist to DB
    fetch("/api/favourites", {
      method: isFav ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, vehicle_id: vehicleId }),
    }).catch(() => {
      // Rollback on error
      setFavs(p => isFav ? [...p, vehicleId] : p.filter(x => x !== vehicleId));
    });
  };

  // Filters
  const [fFuel, setFFuel] = useState("All");
  const [fBody, setFBody] = useState("All");
  const [fPrice, setFPrice] = useState("All");
  const [fSort, setFSort] = useState("match");
  const filtered = V.filter(v => (fFuel==="All"||v.fuel===fFuel) && (fBody==="All"||v.bodyType===fBody) && (fPrice==="All" || (fPrice==="u15"&&v.price<15000) || (fPrice==="15-25"&&v.price>=15000&&v.price<=25000) || (fPrice==="25+"&&v.price>25000)))
    .sort((a,b) => fSort==="price-low"?a.price-b.price : fSort==="price-high"?b.price-a.price : fSort==="newest"?a.daysListed-b.daysListed : b.matchScore-a.matchScore);

  // Notifications
  const [notifs, setNotifs] = useState(NOTIFS_SEED);
  const unreadCount = notifs.filter(n=>!n.read).length;
  const markRead = (id) => setNotifs(p=>p.map(n=>n.id===id?{...n,read:true}:n));
  const markAllRead = () => setNotifs(p=>p.map(n=>({...n,read:true})));

  // Saved Searches
  const [savedSearches, setSavedSearches] = useState([
    {id:1,name:"Family SUV under £30k",filters:{fuel:"All",body:"SUV",price:"u15"},alertFreq:"instant",created:"2026-02-10",matchCount:2},
    {id:2,name:"Electric under £35k",filters:{fuel:"Electric",body:"All",price:"All"},alertFreq:"daily",created:"2026-02-18",matchCount:1},
  ]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);

  // Reviews
  const [reviews] = useState(REVIEWS_SEED);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // AI Chat
  const [msgs, setMsgs] = useState([{role:"assistant",text:"Hey! 👋 I'm CarGPT — 8 cars in stock across London, £13,495 to £31,995. Tell me what you're after and I'll find your match.",quickReplies:["I need a family car","Show me EVs","Budget under £15k","What's the best deal?","I'm a new driver"]}]);
  const [chatIn, setChatIn] = useState("");
  const [heroIn, setHeroIn] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);
  useEffect(() => { chatRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs,typing]);

  // Finance
  const [finDep, setFinDep] = useState(2000);
  const [finTerm, setFinTerm] = useState(48);
  const [finType, setFinType] = useState("PCP");

  // Vehicle Detail
  const [detailTab, setDetailTab] = useState("details");
  const [galleryAngle, setGalleryAngle] = useState(1);
  const [vMsgs, setVMsgs] = useState([]);
  const [vIn, setVIn] = useState("");
  const [vTyping, setVTyping] = useState(false);
  const vRef = useRef(null);
  useEffect(() => { vRef.current?.scrollIntoView({behavior:"smooth"}); }, [vMsgs,vTyping]);
  useEffect(() => { if(sel){setDetailTab("details");setVMsgs([]);} }, [sel]);

  // Dealer Chat — now with real-time persistence
  const [showDChat, setShowDChat] = useState(false);
  const [dMsgs, setDMsgs] = useState([]);
  const [dIn, setDIn] = useState("");
  const [dTyping, setDTyping] = useState(false);
  const [dCtx, setDCtx] = useState(null);
  const [activeConvoId, setActiveConvoId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [inboxOpen, setInboxOpen] = useState(false);
  const dRef = useRef(null);
  useEffect(() => { dRef.current?.scrollIntoView({behavior:"smooth"}); }, [dMsgs,dTyping]);

  // Load conversations on login
  const loadConversations = async () => {
    if (!user?.id) return;
    try {
      const r = await fetch(`/api/conversations?user_id=${user.id}`);
      const data = await r.json();
      if (data.conversations) setConversations(data.conversations);
    } catch {}
  };
  useEffect(() => { if (user?.id) loadConversations(); }, [user?.id]);

  // Poll for new messages in active conversation
  useEffect(() => {
    if (!activeConvoId) return;
    const poll = setInterval(async () => {
      try {
        const r = await fetch(`/api/conversations?id=${activeConvoId}`);
        const data = await r.json();
        if (data.messages) {
          const dbMsgs = data.messages.map(m => ({
            id: m.id,
            role: m.sender_type === "user" ? "user" : "bot",
            text: m.content,
            time: m.created_at,
          }));
          // Only update if we have more messages than current
          setDMsgs(prev => dbMsgs.length > prev.length ? dbMsgs : prev);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(poll);
  }, [activeConvoId]);

  // All tool modals state
  const [activeModal, setActiveModal] = useState(null);
  const [regIn, setRegIn] = useState("");
  const [regResult, setRegResult] = useState(null);
  const [dealUrl, setDealUrl] = useState("");
  const [dealResult, setDealResult] = useState(null);
  const [ulezReg, setUlezReg] = useState("");
  const [ulezResult, setUlezResult] = useState(null);
  const [motCar, setMotCar] = useState(null);
  const [valReg, setValReg] = useState("");
  const [valResult, setValResult] = useState(null);
  const [pexReg, setPexReg] = useState("");
  const [pexResult, setPexResult] = useState(null);
  const [hpiReg, setHpiReg] = useState("");
  const [hpiResult, setHpiResult] = useState(null);
  const [hpiPremium, setHpiPremium] = useState(false);
  const [compCars, setCompCars] = useState([V[0],V[1]]);
  const [agentSteps, setAgentSteps] = useState([]);
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentType, setAgentType] = useState(null);
  const [accidentStep, setAccidentStep] = useState(0);
  const [warningResult, setWarningResult] = useState(null);
  const [journeyFrom, setJourneyFrom] = useState("");
  const [journeyTo, setJourneyTo] = useState("");
  const [journeyResult, setJourneyResult] = useState(null);
  const [fineType, setFineType] = useState(null);
  const [bikSalary, setBikSalary] = useState(50000);
  const [bikCar, setBikCar] = useState(null);
  const [theoryScore, setTheoryScore] = useState(null);
  const [theoryQ, setTheoryQ] = useState(0);
  const [profTab, setProfTab] = useState("account");

  // ═══ CORE FUNCTIONS ═══
  const calcFin = (price) => {
    const p = price - finDep, apr = finType==="HP"?0.079:finType==="PCP"?0.089:0.069, r = apr/12;
    const balloon = finType==="PCP"?price*0.35:0;
    const f = p-(finType==="PCP"?balloon*Math.pow(1+r,-finTerm):0);
    const m = finType==="PCH"?(price*0.015):(f*r*Math.pow(1+r,finTerm))/(Math.pow(1+r,finTerm)-1);
    return {monthly:Math.round(m),apr:(apr*100).toFixed(1),balloon:Math.round(balloon),total:Math.round(m*finTerm+finDep+balloon)};
  };

  const callAI = async (messages, maxTokens = 1024) => {
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, max_tokens: maxTokens })
      });
      if (!r.ok) { console.warn("AI API error:", r.status); return null; }
      const d = await r.json();
      if (d.error) { console.warn("AI error:", d.error); return null; }
      return (d.content || []).filter(i => i.type === "text").map(i => i.text).join("\n") || null;
    } catch (e) { console.warn("AI call failed:", e.message); return null; }
  };

  // Build rich vehicle data string for AI context
  const buildVehicleContext = (v) => {
    const dl = D.find(d => d.id === v.dealerId) || D[0];
    const fin = calcFin(v.price);
    const motSummary = (v.mot || []).map(m => `${m.date}: ${m.result}${m.advisories?.length ? " — " + m.advisories.join("; ") : ""}`).join(" | ");
    return [
      `${v.year} ${v.make} ${v.model} ${v.variant}`,
      `Price: ${fmt(v.price)} (${v.priceRating}) — Listed ${v.daysListed} days`,
      `Mileage: ${fmtMi(v.mileage)} | Fuel: ${v.fuel} | Gearbox: ${v.transmission} | Body: ${v.bodyType}`,
      `Engine: ${v.engineSize}, ${v.specs.bhp}bhp, ${v.specs.torque}, 0-62 in ${v.specs.acceleration}s`,
      `Economy: ${v.specs.fuelEconomy}${typeof v.specs.fuelEconomy === "number" ? " mpg" : ""} | Boot: ${v.specs.bootSpace}L`,
      v.specs.range ? `Range: ${v.specs.range} miles | Battery: ${v.specs.batteryCapacity}` : null,
      `Colour: ${v.colour} | Doors: ${v.doors} | Reg: ${v.vrm}`,
      `CO2: ${v.co2}g/km | Euro: ${v.euroEmissions} | ULEZ: ${v.ulezCompliant ? "Compliant" : "NOT compliant (£12.50/day)"}`,
      `Insurance Group: ${v.insuranceGroup}/50 | Tax: ${v.taxCost === 0 ? "FREE" : "£" + v.taxCost + "/yr"}`,
      `HPI: ${v.hpiClear ? "Clear" : "Pending"} | Service History: ${v.serviceHistory ? "Full" : "Partial"} | Previous Keepers: ${v.previousKeepers}`,
      `MOT Expires: ${v.motExpiry} | History: ${motSummary || "Clean"}`,
      `Features: ${v.features.join(", ")}`,
      `Location: ${v.location} | Match Score: ${v.matchScore}%`,
      `Finance: PCP ~£${fin.monthly}/mo (${fin.apr}% APR, ${fmt(finDep)} dep, ${finTerm}mo) | HP ~£${Math.round(fin.monthly * 1.15)}/mo | Balloon: ${fmt(fin.balloon)}`,
      `Dealer: ${dl.name} (${dl.location}) | Rating: ${dl.rating}★ (${dl.reviews} reviews) | Response: ${dl.responseTime} | Trust: ${dl.trustScore}/100`,
    ].filter(Boolean).join("\n");
  };

  // Build full inventory summary for main chat
  const buildInventoryContext = () => {
    return V.map(v => {
      const fin = calcFin(v.price);
      return `• ${v.year} ${v.make} ${v.model} ${v.variant} — ${fmt(v.price)} (${v.priceRating}), ${fmtMi(v.mileage)}, ${v.fuel}, ${v.transmission}, ${v.bodyType}, ${v.colour}, ${v.engineSize} ${v.specs.bhp}bhp, 0-62 ${v.specs.acceleration}s, ${v.specs.fuelEconomy}${typeof v.specs.fuelEconomy === "number" ? "mpg" : ""}, boot ${v.specs.bootSpace}L, insurance grp ${v.insuranceGroup}, tax £${v.taxCost}/yr, ULEZ ${v.ulezCompliant ? "yes" : "no"}, ${v.features.slice(0, 3).join(", ")}, ${v.location}, PCP ~£${fin.monthly}/mo, match ${v.matchScore}%${v.specs.range ? ", range " + v.specs.range + "mi" : ""}`;
    }).join("\n");
  };

  // System prompts for each chat type
  const SYSTEM_PROMPTS = {
    main: `You are CarGPT, the UK's AI car buying assistant. Friendly, knowledgeable mate who knows cars.

CRITICAL RULES:
- Keep responses to 2-3 sentences MAX. Be punchy, not an essay.
- British English. Say "mate", "brilliant", "sorted" naturally.
- Give honest opinions — if overpriced say so, if great deal be enthusiastic.
- Only reference vehicles from the inventory below. Never invent cars.
- When recommending, say WHY in one short line per car.
- If asked a specific question, answer it directly — don't pad with extra info.
- ALWAYS end your response with exactly 3 suggested follow-up questions on a new line in this format:
  [SUGGESTIONS: suggestion one | suggestion two | suggestion three]
  Make them short (3-6 words), natural, and relevant to what the user might want to ask next.

CURRENT INVENTORY (${V.length} vehicles, all London area):
`,
    vehicle: `You are CarGPT, a knowledgeable UK car expert giving advice on a specific vehicle.

CRITICAL RULES:
- Keep responses to 2-3 sentences MAX. Direct and useful, not essays.
- Answer the exact question asked. Don't volunteer a life story about the car.
- Use the actual data below to back up your answer with specific numbers.
- Be honest — flag concerns, praise good value. Like a trusted mechanic mate.
- Only mention alternatives if the user specifically asks to compare.
- ALWAYS end your response with exactly 3 suggested follow-up questions on a new line in this format:
  [SUGGESTIONS: suggestion one | suggestion two | suggestion three]
  Make them short (3-6 words), natural, and relevant to the vehicle discussion.

THE VEHICLE:
`,
    dealer: `You are the AI assistant for {DEALER_NAME} at {DEALER_LOCATION}, rated {DEALER_RATING}★.

CRITICAL RULES:
- Keep responses to 2-3 sentences MAX. Professional but warm.
- Answer the question directly. Don't over-explain.
- Test drive slots: Mon 10am, Tue 2pm, Wed 11am, Thu 3:30pm, Sat 10am.
- For finance, quote PCP/HP figures from the data. Keep it brief.
- The car IS in stock. Confirm things confidently.
- ALWAYS end your response with exactly 3 suggested follow-up actions on a new line in this format:
  [SUGGESTIONS: suggestion one | suggestion two | suggestion three]
  Make them short (3-6 words), natural buyer actions like "Book a test drive", "Ask about finance", etc.

THE VEHICLE:
`
  };

  const smartReply = (q, ctx) => {
    const t = (q||"").toLowerCase(), v = ctx?.vehicle;
    if(v){
      const f=calcFin(v.price);
      if(/hpi|stolen|write.?off|clear/i.test(t))return v.hpiClear?`Good news — this ${v.make} ${v.model} is fully HPI clear. No outstanding finance, not stolen, no insurance write-off. It's had ${v.previousKeepers} previous keeper${v.previousKeepers>1?"s":""} and comes with ${v.serviceHistory?"full service history":"partial service history"}. You can run our premium check for the full 10-point report.`:`The HPI check is still pending on this one. I'd recommend waiting for the full report before committing.`;
      if(/mot|advisory|test/i.test(t)){const lastMot=v.mot?.[0];return `MOT is valid until ${v.motExpiry}. ${lastMot?`Last test on ${lastMot.date} was a ${lastMot.result}${lastMot.advisories?.length?". Advisory noted: "+lastMot.advisories.join(", ")+". Nothing to worry about but worth keeping an eye on":". Clean pass, no advisories — that's great"}.`:"No issues flagged."} ${v.mot?.some(m=>m.result==="Fail")?"There was a previous fail in the history — it was fixed and has passed since.":""}`;}
      if(/insurance|insur/i.test(t))return `Insurance group ${v.insuranceGroup} out of 50. ${v.insuranceGroup<=12?"That's really low — great for younger drivers or if you want to keep costs down.":v.insuranceGroup<=20?"Mid-range, pretty reasonable for a ${v.make} ${v.model}.":v.insuranceGroup<=30?"On the higher side — budget around £${Math.round(800+v.insuranceGroup*25)}-£${Math.round(1200+v.insuranceGroup*30)}/yr depending on your profile.":"That's quite high — you'll want to get quotes from comparison sites. Consider black box insurance if you're under 25."}`;
      if(/good.?deal|worth|value|overpriced|fair/i.test(t))return `At ${fmt(v.price)} with ${fmtMi(v.mileage)}, this is rated "${v.priceRating}". ${v.priceRating==="Great Deal"?"Honestly, this is priced below market — I'd move quickly if you're interested. It's been listed "+v.daysListed+" days and won't last.":v.priceRating==="Good Deal"?"Solid pricing for the spec and mileage. Listed "+v.daysListed+" days."+( v.daysListed>21?" That's been around a while — there could be room to negotiate.":""):"Fair price but there might be room to negotiate, especially if you're paying cash or have a part-exchange."}`;
      if(/running|fuel|economy|mpg|cost.*run|cheap.*run/i.test(t))return v.fuel==="Electric"?`Running costs are where EVs really shine. Zero road tax, ULEZ exempt, and charging costs around 5-7p per mile (vs 15-18p for petrol). Servicing is cheaper too — fewer moving parts. The main cost is depreciation, but the ${v.make} ${v.model} holds value well.`:`Real-world economy should be around ${v.specs.fuelEconomy} mpg. Road tax is ${v.taxCost===0?"free":"£"+v.taxCost+"/yr"}, insurance group ${v.insuranceGroup}. ${v.ulezCompliant?"ULEZ compliant so no daily charge in London.":"⚠️ Not ULEZ compliant — that's £12.50/day in London."} All in, budget roughly £${Math.round(150+v.taxCost/12+v.insuranceGroup*4)}-£${Math.round(250+v.taxCost/12+v.insuranceGroup*6)}/month for fuel, tax, and insurance.`;
      if(/finance|monthly|pcp|hp |hire|lease|afford/i.test(t))return `Here are your finance options on this ${v.make} ${v.model} at ${fmt(v.price)}:\n\n• PCP: ~£${f.monthly}/mo (${f.apr}% APR, ${fmt(finDep)} deposit, ${finTerm} months, ${fmt(f.balloon)} balloon)\n• HP: ~£${Math.round(f.monthly*1.15)}/mo (own it outright at the end)\n• PCH Lease: ~£${Math.round(v.price*0.015)}/mo (never own it, just hand back)\n\nPCP is most popular — lower monthlies but you don't own it until you pay the balloon. HP costs more monthly but it's yours at the end. Want me to adjust the deposit or term?`;
      if(/spec|feature|what.*got|equipment|kit/i.test(t))return `This ${v.make} ${v.model} comes with: ${v.features.join(", ")}. Under the bonnet it's ${v.specs.bhp}bhp with ${v.specs.torque} torque, doing 0-62 in ${v.specs.acceleration}s. ${v.specs.bootSpace}L boot${v.bodyType==="SUV"?" — plenty of space for the family":""}. ${v.fuel==="Electric"?`Battery is ${v.specs.batteryCapacity} giving ${v.specs.range} miles range.`:""}`;
      if(/tax|ved|road.?tax/i.test(t))return v.taxCost===0?`Road tax is completely free on this one! ${v.fuel==="Electric"?"All EVs are zero-rated for VED.":"Hybrid with CO2 under 100g/km gets the free rate."}`:`Road tax is £${v.taxCost}/yr (${v.co2}g/km CO2). ${v.co2>150?"That's above average — worth factoring into your budget.":"Pretty standard for a "+v.fuel.toLowerCase()+" car this size."}`;
      if(/ulez|emission|london|zone|clean/i.test(t))return v.ulezCompliant?`This ${v.make} ${v.model} is fully ULEZ compliant (${v.euroEmissions}). No daily charge in London's Ultra Low Emission Zone or any Clean Air Zone. ${v.co2===0?"Zero emissions — as clean as it gets!":""}`:`⚠️ This car is NOT ULEZ compliant. You'd pay £12.50 every day you drive in London's ULEZ zone. That's £3,125/year if you commute daily. Seriously consider an alternative if you drive in London regularly.`;
      if(/mileage|miles|how far|high.?mile|low.?mile/i.test(t))return `${fmtMi(v.mileage)} on the clock. ${v.mileage<15000?"That's very low mileage — well below average for a "+v.year+". Could mean it was a second car or barely used.":v.mileage<25000?"Below average mileage for its age — that's good.":v.mileage<40000?"About average for a "+(2026-v.year)+"-year-old car (roughly 10K/year).":"Above average mileage, but "+v.make+"s handle it well."} ${v.serviceHistory?"Full service history backs it up.":"Partial service history — you might want to ask the dealer for more detail."}`;
      if(/reliab|problem|issue|fault|common/i.test(t))return `The ${v.make} ${v.model} is generally ${v.make==="Toyota"||v.make==="Kia"?"very reliable — "+v.make+" consistently tops reliability surveys.":v.make==="BMW"||v.make==="Mercedes-Benz"?"well-built but can have higher repair costs when things do go wrong.":"a solid choice with good reliability."}${v.mot?.some(m=>m.advisories?.length)?" The MOT history shows minor advisories but nothing concerning.":""} With ${v.serviceHistory?"full":"partial"} service history and ${v.previousKeepers} previous keeper${v.previousKeepers>1?"s":""}, this example looks well cared for.`;
      return `The ${v.year} ${v.make} ${v.model} ${v.variant} is at ${fmt(v.price)} with ${fmtMi(v.mileage)} — rated "${v.priceRating}". It's ${v.fuel.toLowerCase()}, ${v.transmission.toLowerCase()}, insurance group ${v.insuranceGroup}, and ${v.ulezCompliant?"ULEZ compliant":"not ULEZ compliant"}. What would you like to know more about?`;
    }
    if(/family|suv|kids|child|space|boot/i.test(t))return `For families, I'd look at the Kia Sportage (${fmt(31995)}) — 591L boot, 7-year warranty, brilliant spec with panoramic roof and 360° camera. Or if budget is tighter, the Ford Focus ST-Line (${fmt(13495)}) has decent space and great tech. The Toyota Yaris is good on running costs but the boot's only 286L — might be tight with a pushchair.`;
    if(/first.?car|new.?driver|just.?passed|young/i.test(t))return `For a new driver, insurance is the big one. The Toyota Yaris Hybrid (${fmt(16995)}, group 10) is your best bet — cheap insurance, brilliant fuel economy (68.9mpg), and Toyota reliability. The Ford Focus (${fmt(13495)}, group 14) is also decent. Stay under group 15 to keep premiums manageable. Consider a black box policy too — saves 20-40%.`;
    if(/electric|ev|tesla|zero.?emission|charge/i.test(t))return `The Tesla Model 3 Long Range (${fmt(29995)}) is our EV pick — 374 miles range, 0-62 in 4.4s, zero road tax, ULEZ exempt. Running costs are roughly 5-7p/mile vs 15-18p for petrol. The Autopilot and 15" touchscreen are brilliant. We also have two hybrids if you're not ready to go fully electric — the Yaris Hybrid and Kia Sportage HEV.`;
    if(/cheap|budget|under.*15|affordable|bargain/i.test(t))return `Best value in stock is the Ford Focus ST-Line at ${fmt(13495)} — sporty looks, B&O audio, 125bhp, group 14 insurance. It's been listed ${V[3].daysListed} days so there might be negotiation room. Next up is the Toyota Yaris Hybrid at ${fmt(16995)} with the lowest running costs of anything we have. What's your absolute max budget?`;
    if(/bmw|audi|merc|premium|luxury|posh/i.test(t))return `Three premium options for you: The BMW 320d M Sport (${fmt(22495)}) is rated "Great Deal" — 190bhp, leather, Harman Kardon. The Audi A3 S Line (${fmt(21995)}) has the Virtual Cockpit and that premium Audi interior. The Mercedes A200 AMG Line (${fmt(23495)}) has MBUX, ambient lighting, and the widescreen cockpit. All three are ULEZ compliant with strong specs. The BMW is the best value right now.`;
    if(/compare|vs|or|between|which/i.test(t))return `Happy to compare any of our cars! Just tell me the two you're considering and I'll break down the differences — price, running costs, specs, the lot. Or tell me what matters most to you (budget, space, performance, insurance) and I'll recommend the best match.`;
    if(/hi|hello|hey|morning|afternoon|hiya/i.test(t))return `Hey! 👋 Welcome to CarGPT. I've got ${V.length} brilliant cars in stock across London, from ${fmt(13495)} to ${fmt(31995)}. I can search by budget, lifestyle, fuel type — or just tell me what you need and I'll find the perfect match. What are you after?`;
    if(/thanks|thank|cheers|ta /i.test(t))return `No worries! 😊 Anything else you'd like to know? I can check finance, MOT history, insurance costs, or help you book a test drive on any car.`;
    return `I've got ${V.length} cars in stock from ${fmt(13495)} to ${fmt(31995)} — hatchbacks, saloons, SUVs, petrol, diesel, electric, and hybrid. Tell me your budget, what you'll use it for, or what matters most to you, and I'll find the right match!`;
  };

  // ── Parse AI suggestions from response ──
  const parseSuggestions = (text) => {
    const match = text.match(/\[SUGGESTIONS?:\s*(.+?)\]/i);
    if (!match) return { text, suggestions: [] };
    const clean = text.replace(/\[SUGGESTIONS?:\s*.+?\]/i, "").trim();
    const suggestions = match[1].split("|").map(s => s.trim()).filter(s => s.length > 0 && s.length < 50);
    return { text: clean, suggestions: suggestions.slice(0, 4) };
  };

  // ── Voice-to-text (Web Speech API) — continuous with visual feedback ──
  const [voiceActive, setVoiceActive] = useState(null); // 'main' | 'vehicle' | 'dealer' | null
  const [voiceText, setVoiceText] = useState("");
  const recognitionRef = useRef(null);
  const voiceTargetRef = useRef(null);
  const voiceFinalRef = useRef("");

  const startVoice = (target) => {
    // Toggle off if already active
    if (voiceActive) { stopVoice(); return; }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input isn't supported in this browser. Please try Chrome or Safari."); return; }

    const recognition = new SR();
    recognition.lang = "en-GB";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    voiceTargetRef.current = target;
    voiceFinalRef.current = "";
    setVoiceActive(target);
    setVoiceText("");

    // Clear the current input
    if (target === "main") { setChatIn(""); setHeroIn(""); }
    else if (target === "vehicle") setVIn("");
    else if (target === "dealer") setDIn("");

    recognition.onresult = (e) => {
      let final = voiceFinalRef.current;
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          final += (final ? " " : "") + transcript;
          voiceFinalRef.current = final;
        } else {
          interim = transcript;
        }
      }
      const display = (final + (interim ? " " + interim : "")).trim();
      setVoiceText(display);
      // Push to the right input in real-time
      const t = voiceTargetRef.current;
      if (t === "main") { setChatIn(display); setHeroIn(display); }
      else if (t === "vehicle") setVIn(display);
      else if (t === "dealer") setDIn(display);
    };

    recognition.onend = () => {
      // If still meant to be active, restart (browser sometimes stops mid-speech)
      if (recognitionRef.current && voiceTargetRef.current) {
        try { recognition.start(); } catch(e) {
          setVoiceActive(null);
          recognitionRef.current = null;
          voiceTargetRef.current = null;
        }
      }
    };

    recognition.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return; // don't kill on silence
      setVoiceActive(null);
      recognitionRef.current = null;
      voiceTargetRef.current = null;
    };

    try { recognition.start(); } catch(e) {
      setVoiceActive(null);
    }
  };

  const stopVoice = () => {
    voiceTargetRef.current = null;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
      recognitionRef.current = null;
    }
    setVoiceActive(null);
  };

  const sendChat = async (text) => {
    if(!text?.trim())return;
    const um={role:"user",text:text.trim()};
    setMsgs(p=>[...p,um]); setChatIn(""); setHeroIn(""); setTyping(true);
    if(!chatOpen) setChatOpen(true);

    // Smart vehicle matching — show relevant car cards
    const lo=text.toLowerCase();
    let cars=null;
    if(/family|suv|kids|child|space|boot|pushchair/i.test(lo)) cars=V.filter(v=>v.bodyType==="SUV"||v.specs.bootSpace>400);
    else if(/electric|ev|zero.?emission|charge|tesla/i.test(lo)) cars=V.filter(v=>v.fuel==="Electric");
    else if(/hybrid|eco/i.test(lo)) cars=V.filter(v=>v.fuel==="Hybrid");
    else if(/cheap|budget|under.*15|afford|bargain/i.test(lo)) cars=[...V].sort((a,b)=>a.price-b.price).slice(0,4);
    else if(/under.*20/i.test(lo)) cars=V.filter(v=>v.price<20000);
    else if(/under.*25/i.test(lo)) cars=V.filter(v=>v.price<25000);
    else if(/under.*30/i.test(lo)) cars=V.filter(v=>v.price<30000);
    else if(/bmw|audi|merc|premium|luxury|posh/i.test(lo)) cars=V.filter(v=>["BMW","Audi","Mercedes-Benz"].includes(v.make));
    else if(/petrol/i.test(lo)) cars=V.filter(v=>v.fuel==="Petrol");
    else if(/diesel/i.test(lo)) cars=V.filter(v=>v.fuel==="Diesel");
    else if(/auto|automatic/i.test(lo)) cars=V.filter(v=>v.transmission!=="Manual");
    else if(/manual|stick/i.test(lo)) cars=V.filter(v=>v.transmission==="Manual");
    else if(/hatchback|hatch/i.test(lo)) cars=V.filter(v=>v.bodyType==="Hatchback");
    else if(/saloon|sedan/i.test(lo)) cars=V.filter(v=>v.bodyType==="Saloon");
    else if(/first.?car|new.?driver|young|insurance.*low|low.*insurance/i.test(lo)) cars=[...V].sort((a,b)=>a.insuranceGroup-b.insuranceGroup).slice(0,4);
    else if(/show|find|search|recommend|what.*got|browse|all/i.test(lo)) cars=[...V].sort((a,b)=>b.matchScore-a.matchScore).slice(0,4);
    // Match specific makes/models mentioned
    else { const makeMatch = V.filter(v => lo.includes(v.make.toLowerCase()) || lo.includes(v.model.toLowerCase())); if(makeMatch.length) cars=makeMatch; }

    // Build AI messages with rich context
    const fullPrompt = SYSTEM_PROMPTS.main + buildInventoryContext();
    const hist=[...msgs.slice(-8),um].map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
    const merged=[];for(const m of hist){if(merged.length>0&&merged[merged.length-1].role===m.role)merged[merged.length-1].content+="\n"+m.content;else merged.push({...m});}
    while(merged.length>0&&merged[0].role!=="user")merged.shift();
    if(merged.length>0) merged[0].content = fullPrompt + "\n\n---\nUser: " + merged[0].content;

    try {
      const r = await callAI(merged, 300);
      const raw = r || smartReply(text,{});
      const { text: cleanText, suggestions } = parseSuggestions(raw);
      const msg = {role:"assistant", text: cleanText};
      if(suggestions.length) msg.quickReplies = suggestions;
      if(cars?.length) msg.vehicles = cars.slice(0,4);
      setMsgs(p=>[...p,msg]);
    } catch(e) {
      const raw = smartReply(text,{});
      const { text: cleanText, suggestions } = parseSuggestions(raw);
      const msg = {role:"assistant", text: cleanText};
      if(suggestions.length) msg.quickReplies = suggestions;
      if(cars?.length) msg.vehicles = cars.slice(0,4);
      setMsgs(p=>[...p,msg]);
    }
    setTyping(false);
  };

  const sendVMsg = async (text) => {
    if(!text?.trim()||!sel)return;
    const v=sel;
    setVMsgs(p=>[...p,{role:"user",text:text.trim()}]); setVIn(""); setVTyping(true);

    // Build rich vehicle context
    const vehicleContext = buildVehicleContext(v);
    const altCars = V.filter(x=>x.id!==v.id).slice(0,3).map(a=>`  - ${a.year} ${a.make} ${a.model}: ${fmt(a.price)}, ${fmtMi(a.mileage)}, ${a.fuel}, grp ${a.insuranceGroup}`).join("\n");
    const fullPrompt = SYSTEM_PROMPTS.vehicle + vehicleContext + "\n\nALTERNATIVES IN STOCK (mention if relevant):\n" + altCars;

    const hist=[...vMsgs,{role:"user",text}].map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
    const merged=[];for(const m of hist){if(merged.length>0&&merged[merged.length-1].role===m.role)merged[merged.length-1].content+="\n"+m.content;else merged.push({...m});}
    while(merged.length>0&&merged[0].role!=="user")merged.shift();
    if(!merged.length)merged.push({role:"user",content:text});
    merged[0].content = fullPrompt + "\n\n---\nUser: " + merged[0].content;

    try {
      const r = await callAI(merged, 300);
      const raw = r||smartReply(text,{vehicle:v});
      const { text: cleanText, suggestions } = parseSuggestions(raw);
      const msg = {role:"assistant",text:cleanText};
      if(suggestions.length) msg.quickReplies = suggestions;
      setVMsgs(p=>[...p,msg]);
    } catch(e) {
      const raw = smartReply(text,{vehicle:v});
      const { text: cleanText, suggestions } = parseSuggestions(raw);
      const msg = {role:"assistant",text:cleanText};
      if(suggestions.length) msg.quickReplies = suggestions;
      setVMsgs(p=>[...p,msg]);
    }
    setVTyping(false);
  };

  const openDChat = async (vid, flow="general") => {
    if (!user) { setAuthModal("login"); return; }
    const v=V.find(x=>x.id===vid)||V[0], dl=D.find(d=>d.id===v.dealerId)||D[0];
    setDCtx({vehicleId:vid,flow,vehicle:v,dealer:dl});
    setShowDChat(true); setActiveModal("dealer-chat");

    // Create or load conversation from Supabase
    try {
      const cr = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, dealer_id: v.dealerId, vehicle_id: vid }),
      });
      const cdata = await cr.json();
      const convoId = cdata.conversation_id;
      setActiveConvoId(convoId);

      if (cdata.existing) {
        // Load existing messages
        const mr = await fetch(`/api/conversations?id=${convoId}`);
        const mdata = await mr.json();
        if (mdata.messages?.length > 0) {
          setDMsgs(mdata.messages.map(m => ({
            id: m.id,
            role: m.sender_type === "user" ? "user" : "bot",
            text: m.content,
            time: m.created_at,
          })));
          // Mark read
          fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "mark_read", conversation_id: convoId }),
          });
          return;
        }
      }

      // New conversation — send greeting
      const g=flow==="testDrive"
        ?`Hey! 👋 Great choice on the ${v.year} ${v.make} ${v.model}. I've got slots Mon 10am, Tue 2pm, Wed 11am, Thu 3:30pm. Which works?`
        :`Hey! 👋 Thanks for your interest in the ${v.year} ${v.make} ${v.model} at ${fmt(v.price)}. How can I help?`;
      const qr=flow==="testDrive"?["Mon 10am","Tue 2pm","Wed 11am","Thu 3:30pm"]:["Is it available?","📅 Test drive","💳 Finance options","🔄 Part exchange"];
      setDMsgs([{role:"bot",text:g,quickReplies:qr}]);

      // Save greeting to DB
      fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", conversation_id: convoId, sender_type: "dealer", text: g }),
      });
    } catch(e) {
      console.warn("Failed to create conversation:", e);
      // Fallback to local-only
      const g=flow==="testDrive"
        ?`Hey! 👋 Great choice on the ${v.year} ${v.make} ${v.model}. I've got slots Mon 10am, Tue 2pm, Wed 11am, Thu 3:30pm. Which works?`
        :`Hey! 👋 Thanks for your interest in the ${v.year} ${v.make} ${v.model} at ${fmt(v.price)}. How can I help?`;
      const qr=flow==="testDrive"?["Mon 10am","Tue 2pm","Wed 11am","Thu 3:30pm"]:["Is it available?","📅 Test drive","💳 Finance options","🔄 Part exchange"];
      setDMsgs([{role:"bot",text:g,quickReplies:qr}]);
    }
  };

  const sendDMsg = async (text) => {
    if(!text?.trim())return;
    const ctx=dCtx, v=ctx?.vehicle||V[0], dl=ctx?.dealer||D[0];
    const trimmed = text.trim();
    setDMsgs(p=>[...p,{role:"user",text:trimmed}]); setDIn(""); setDTyping(true);
    const fin=calcFin(v.price);

    // Save user message to DB
    if (activeConvoId) {
      fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", conversation_id: activeConvoId, sender_type: "user", text: trimmed }),
      });
    }

    // Fallback responses
    const fb=()=>{const dq=text.toLowerCase();
      if(/mon|tue|wed|thu|fri|sat|10am|2pm|11am|3:30/i.test(dq))return `Perfect! ✅ Booked you in for ${text} at our ${dl.location} showroom. Just bring your driving licence and we'll have the ${v.make} ${v.model} ready for you. Looking forward to meeting you!`;
      if(/available|in.?stock|still.?got/i.test(dq))return `Yes! The ${v.year} ${v.make} ${v.model} is here at our ${dl.location} showroom, ready to view or test drive. Would you like to book a slot? I've got availability this week.`;
      if(/test.?drive|view|book|come.?see/i.test(dq))return `Brilliant — I've got Mon 10am, Tue 2pm, Wed 11am, Thu 3:30pm, or Sat 10am available. Which works best for you? Takes about 30 minutes and there's no obligation.`;
      if(/finance|monthly|pcp|hp|afford/i.test(dq))return `Great question! On PCP, you're looking at around £${fin.monthly}/mo with a ${fmt(Math.round(v.price*0.1))} deposit over ${finTerm} months. HP would be ~£${Math.round(fin.monthly*1.15)}/mo but you own it outright at the end. We work with multiple lenders so we can usually find the best rate for your circumstances. Want me to run a soft credit check? It won't affect your score.`;
      if(/part.?ex|trade|my.?car|swap/i.test(dq))return `Happy to help with a part-exchange! If you send me your reg number and current mileage, I can get you a valuation within the hour. We aim to beat any online valuation you've had — We Buy Any Car, Motorway, etc.`;
      if(/price|discount|offer|deal|negotiate|best.?price/i.test(dq))return `The ${v.make} ${v.model} at ${fmt(v.price)} is competitively priced — it's rated "${v.priceRating}" against the market. Rather than just knocking money off, why not come in for a viewing? We can discuss the full package — finance, part-exchange, extras — and I'm sure we can put something together that works for you.`;
      if(/warranty|guarantee|cover/i.test(dq))return `The ${v.make} ${v.model} comes with our standard 3-month warranty included. We also offer 6-month and 12-month extended warranties if you want extra peace of mind. ${v.make==="Kia"?"Plus Kia's 7-year manufacturer warranty still has time remaining on this one — that's exceptional cover.":""}`;
      if(/deliver|collect|bring/i.test(dq))return `We offer both! You're welcome to collect from our ${dl.location} showroom, or we can deliver within a 50-mile radius for a small fee. Nationwide delivery is also available — we'll quote based on distance.`;
      return `The ${v.year} ${v.make} ${v.model} is a ${v.priceRating.toLowerCase()} at ${fmt(v.price)} with ${fmtMi(v.mileage)}. Would you like to book a test drive, discuss finance, or get a part-exchange valuation? I'm here to help.`;
    };

    // Build dealer-persona prompt with full vehicle data
    const vehicleContext = buildVehicleContext(v);
    const dealerPrompt = SYSTEM_PROMPTS.dealer
      .replace("{DEALER_NAME}", dl.name)
      .replace("{DEALER_LOCATION}", dl.location)
      .replace("{DEALER_RATING}", dl.rating)
      .replace("{DEALER_REVIEWS}", dl.reviews);

    const hist=[...dMsgs,{role:"user",text}].map(m=>({role:m.role==="bot"?"assistant":"user",content:m.text})).filter(m=>m.content);
    const merged=[];for(const m of hist){if(merged.length>0&&merged[merged.length-1].role===m.role)merged[merged.length-1].content+="\n"+m.content;else merged.push({...m});}
    while(merged.length>0&&merged[0].role!=="user")merged.shift();
    if(!merged.length)merged.push({role:"user",content:text});
    merged[0].content = dealerPrompt + vehicleContext + "\n\n---\nCustomer: " + merged[0].content;

    let respText;
    try {
      const r = await callAI(merged, 300);
      respText = r || fb();
    } catch(e) {
      respText = fb();
    }

    const { text: cleanResp, suggestions } = parseSuggestions(respText);
    const resp = {role:"bot", text: cleanResp};
    if (suggestions.length) {
      resp.quickReplies = suggestions;
    } else if(/test.?drive|slot|book|view/i.test(text.toLowerCase()) && !/mon|tue|wed|thu|sat/i.test(text.toLowerCase())) {
      resp.quickReplies = ["Mon 10am","Tue 2pm","Wed 11am","Thu 3:30pm","Sat 10am"];
    }
    setDMsgs(p=>[...p,resp]);
    setDTyping(false);

    // Save dealer response to DB
    if (activeConvoId) {
      fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", conversation_id: activeConvoId, sender_type: "dealer", text: cleanResp }),
      });
      // Refresh conversations list
      loadConversations();
    }
  };

  // Action functions
  const doRegLookup = () => { const q=regIn.toUpperCase().replace(/\s/g,""); const match=V.find(v=>v.vrm.replace(/\s/g,"")===q); setRegResult(match||V[Math.floor(Math.random()*V.length)]); };
  const doValuation = () => { const q=valReg.toUpperCase().replace(/\s/g,""); const match=V.find(v=>v.vrm.replace(/\s/g,"")===q); const base=match?match.price:15000+Math.floor(Math.random()*15000); setValResult({car:match||{year:2020,make:"Vehicle",model:"Found",variant:"",mileage:30000,fuel:"Petrol"},low:Math.round(base*0.92),mid:Math.round(base*0.96),high:Math.round(base*1.02)}); };
  const doPartEx = () => { const q=pexReg.toUpperCase().replace(/\s/g,""); const match=V.find(v=>v.vrm.replace(/\s/g,"")===q); const base=match?match.price:17500; setPexResult({car:match||{year:2021,make:"VW",model:"Golf",mileage:24500},low:Math.round(base*0.88),mid:Math.round(base*0.93),high:Math.round(base*0.97)}); };
  const doDealCheck = (vehicle) => { const r=vehicle||V[Math.floor(Math.random()*V.length)]; const savings=Math.round(r.price*0.03+Math.random()*r.price*0.05); setDealResult({vehicle:r,verdict:r.priceRating.includes("Great")?"Excellent":r.priceRating.includes("Good")?"Good":"Fair",savings,marketAvg:r.price+savings,confidence:75+Math.floor(Math.random()*20)}); };
  const doUlezCheck = () => { const q=ulezReg.toUpperCase().replace(/\s/g,""); const match=V.find(v=>v.vrm.replace(/\s/g,"")===q); setUlezResult(match||V[Math.floor(Math.random()*V.length)]); };
  const doHpiCheck = () => {const q=hpiReg.toUpperCase().replace(/\s/g,"");const match=V.find(v=>v.vrm.replace(/\s/g,"")===q);const car=match||V[Math.floor(Math.random()*V.length)];setHpiResult({car,free:{make:car.make,model:car.model,year:car.year,fuel:car.fuel,colour:car.colour,engineSize:car.engineSize,co2:car.co2,taxStatus:car.taxCost===0?"Taxed (£0)":"Taxed",taxDue:"01 Oct 2026",motStatus:"Valid",motExpiry:car.motExpiry,firstReg:"01 Mar "+car.year},premium:{financeOutstanding:Math.random()>0.85?"⚠️ YES — £8,420 outstanding":"✅ None recorded",stolen:"✅ Not recorded as stolen",writeOff:Math.random()>0.9?"⚠️ Cat N (2022)":"✅ No write-off recorded",scrapped:"✅ Not recorded as scrapped",plateChanges:Math.random()>0.7?`1 previous plate`:"None recorded",keeperChanges:`${car.previousKeepers+1} registered keepers`,mileageAnomaly:"✅ No mileage discrepancies found",importExport:"✅ UK registered — not imported",highRisk:Math.random()>0.92?"⚠️ Flagged":"✅ No high risk markers",vin:"WVW"+Math.random().toString(36).substring(2,12).toUpperCase()}}); };
  const doJourney=()=>{if(!journeyFrom&&!journeyTo)return;const dist=Math.round(5+Math.random()*80);const fuel=Math.round((dist/45)*4.546*1.45*100)/100;const tolls=dist>30?Math.random()>0.5?{name:"Dart Charge",cost:2.50}:null:null;const cong=journeyFrom.toLowerCase().includes("central")||journeyTo.toLowerCase().includes("central")?15:0;const ulez=cong>0?12.50:0;const park=3+Math.round(Math.random()*12);setJourneyResult({dist,time:Math.round(dist*1.8),fuel,tolls,cong,ulez,park,total:Math.round((fuel+(tolls?.cost||0)+cong+ulez+park)*100)/100});};

  const runAgent = (type) => {
    setAgentType(type); setAgentRunning(true); setAgentSteps([]);
    const stepsMap = {
      hunt:[{t:"Scanning 450,000+ listings...",d:800},{t:"Filtering by your preferences...",d:1000},{t:"Analysing pricing data...",d:900},{t:"Found 3 deals below market value!",d:700}],
      testdrive:[{t:"Checking dealer availability...",d:800},{t:"Contacting Hilton Car Supermarket...",d:1200},{t:"Finding optimal route for 2 dealers...",d:900},{t:"✅ Test drives booked: Tue 2pm & Wed 11am",d:600}],
      negotiate:[{t:"Analysing market position...",d:800},{t:"Preparing negotiation strategy...",d:1000},{t:"Contacting dealer with your offer...",d:1500},{t:"✅ Dealer countered at £1,200 off asking price!",d:600}],
      partex:[{t:"Looking up your vehicle...",d:700},{t:"Requesting valuations from 4 dealers...",d:1200},{t:"Comparing offers...",d:900},{t:"✅ Best offer: £18,750 from Hilton Car Supermarket",d:600}],
      finance:[{t:"Running soft credit check...",d:800},{t:"Querying 12 lenders...",d:1200},{t:"Comparing APR rates...",d:800},{t:"✅ Best rate: 6.9% APR with Black Horse (£287/mo)",d:600}],
      paperwork:[{t:"Generating V5C transfer checklist...",d:700},{t:"Finding insurance quotes...",d:1000},{t:"Preparing tax reminder...",d:800},{t:"✅ All documents ready — driveaway cover arranged",d:600}],
    };
    const steps=stepsMap[type]||stepsMap.hunt;
    let i=0;
    const runStep=()=>{if(i<steps.length){setAgentSteps(prev=>[...prev,steps[i]]);i++;setTimeout(runStep,steps[i-1].d);}else{setAgentRunning(false);}};
    setTimeout(runStep,400);
  };

  const openModal = (key) => { setActiveModal(key); setShowTools(false); };
  const closeModal = () => { setActiveModal(null); };

  // ═══ RENDER: SLIDE-OVER MODAL WRAPPER ═══
  // ═══ RENDER: NAVBAR ═══
  const Navbar = () => (
    <nav className="navbar">
      <div className="nav-left">
        <div className="nav-logo" onClick={()=>{setPage("home");setSel(null);}}>Car<span>GPT</span></div>
        <div className="nav-links">
          {[{key:"home",label:"Home"},{key:"search",label:"Browse"},{key:"favourites",label:"Favourites"},{key:"messages",label:"Messages"},{key:"garage",label:"My Garage"}].map(n =>
            <button key={n.key} className={`nav-link ${page===n.key && !sel?"active":""}`}
              onClick={()=>{
                if((n.key==="favourites"||n.key==="garage"||n.key==="messages") && !user){ setAuthModal("login"); return; }
                if(n.key==="messages") loadConversations();
                setPage(n.key);setSel(null);
              }}>{n.label}{n.key==="messages"&&conversations.filter(c=>c.user_unread_count>0).length>0&&<span style={{width:7,height:7,borderRadius:"50%",background:"#DC2626",display:"inline-block",marginLeft:4,verticalAlign:"middle"}}/>}</button>
          )}
          <button className={`nav-link ${showTools?"active":""}`} onClick={()=>setShowTools(!showTools)}>Tools ▾</button>
        </div>
      </div>
      <div className="nav-right">
        <button className="nav-btn" onClick={()=>setShowNotifs(!showNotifs)} title="Notifications" style={{position:"relative"}}>
          🔔 {unreadCount > 0 && <span style={{position:"absolute",top:2,right:2,width:18,height:18,borderRadius:"50%",background:"#DC2626",color:"white",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{unreadCount}</span>}
        </button>
        {user ? (
          <div className="nav-avatar" onClick={()=>{setPage("profile");setSel(null);}} title={user.name}>
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        ) : (
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button className="btn btn-secondary btn-sm" style={{padding:"6px 14px",fontSize:13}} onClick={()=>setAuthModal("login")}>Log in</button>
            <button className="btn btn-primary btn-sm" style={{padding:"6px 14px",fontSize:13}} onClick={()=>setAuthModal("signup")}>Sign up</button>
          </div>
        )}
      </div>
    </nav>
  );

  // ═══ RENDER: VEHICLE CARD ═══
  const VCard = ({v}) => (
    <div key={v.id} className="vcard" onClick={()=>{setGalleryAngle(1);setSel(v);}}>
      <div className="vcard-img">
        <img src={carImg(v.make, v.model, v.year)} alt={`${v.year} ${v.make} ${v.model}`} loading="lazy"/>
        {v.matchScore >= 85 && <div className="vcard-match">{v.matchScore}% match</div>}
        <button className="vcard-fav" onClick={e=>{e.stopPropagation();toggleFav(v.id);}}>{favs.includes(v.id)?"❤️":"🤍"}</button>
        <div style={{position:"absolute",bottom:8,left:8,background:"rgba(0,0,0,0.65)",color:"#fff",padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:600,backdropFilter:"blur(4px)"}}>📷 8 photos</div>
      </div>
      <div className="vcard-body">
        <div className="vcard-title">{v.year} {v.make} {v.model}</div>
        <div className="vcard-variant">{v.variant}</div>
        <div className="vcard-price">{fmt(v.price)}</div>
        <div className="vcard-meta">
          <span>📏 {fmtMi(v.mileage)}</span>
          <span>⛽ {v.fuel}</span>
          <span>⚙️ {v.transmission}</span>
        </div>
        <div className="vcard-badges">
          <span className={`badge ${v.priceRating.includes("Great")?"badge-green":v.priceRating.includes("Good")?"badge-green":"badge-gray"}`}>
            {v.priceRating.includes("Great")?"🔥":"✅"} {v.priceRating}
          </span>
          {v.fuel==="Electric"&&<span className="badge badge-blue">⚡ Zero Emission</span>}
          {v.fuel==="Hybrid"&&<span className="badge badge-blue">🌿 Hybrid</span>}
        </div>
        <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid var(--border-light)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:12,color:"var(--text-muted)"}}>📍 {v.location}</span>
          <span style={{fontSize:11,color:"var(--text-muted)",fontWeight:600}}>{v.daysListed<=3?"Just listed":v.daysListed+" days ago"}</span>
        </div>
      </div>
    </div>
  );

  // ═══ RENDER: HOME PAGE ═══
  const HomePage = () => (
    <>
      {/* Hero */}
      <div className="hero-section">
        <div className="hero-badge">
          <span className="hero-badge-dot"/>
          AI-Powered Car Search
        </div>
        <h1 className="hero-title">Find your perfect car<br/>with AI</h1>
        <p className="hero-sub">
          Describe what you need in plain English. CarGPT searches 450,000+ vehicles, compares prices, and even negotiates deals for you.
        </p>
        <div className="ai-search-box">
          <span className="ai-search-icon">✨</span>
          <input className={`ai-search-input${voiceActive==="main"?" voice-listening":""}`} placeholder={voiceActive==="main"?"🎙️ Listening — speak now...":"Try \"family SUV under £25k with low insurance\"..."}
            value={heroIn} onChange={e=>setHeroIn(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"){if(voiceActive)stopVoice();sendChat(heroIn);}}}/>          <button className={`btn-mic hero-mic${voiceActive==="main"?" active":""}`} onClick={()=>startVoice("main")} title="Voice search">{voiceActive==="main"?"⏹":"🎙️"}</button>
          <button className="ai-search-btn" onClick={()=>{if(voiceActive)stopVoice();sendChat(heroIn);}}>Search with AI</button>
        </div>
        {voiceActive==="main" && <div className="voice-bar"><div className="voice-bar-inner"><div className="voice-wave"/><div className="voice-wave"/><div className="voice-wave"/><div className="voice-wave"/><div className="voice-wave"/></div><span>Listening — speak now...</span><button className="voice-bar-stop" onClick={stopVoice}>Done</button></div>}
        </div>
        <div className="quick-actions">
          {["I need a family car","Show me EVs","Budget under £15k","What's the best deal?","I'm a new driver","Compare the premium cars"].map(q =>
            <button key={q} className="quick-action" onClick={()=>sendChat(q)}>{q}</button>
          )}
        </div>
      </div>

      {/* AI Tools Quick Access */}
      <div className="section">
        <div className="section-head">
          <div>
            <div className="section-title">AI Tools</div>
            <div className="section-subtitle">Everything you need to buy, own, and maintain your car</div>
          </div>
          <button className="section-link" onClick={()=>setShowTools(true)}>View all →</button>
        </div>
        <div className="tools-grid">
          {[
            {icon:"🤖",label:"AI Agents",desc:"Autonomous assistants",key:"agents"},
            {icon:"🔎",label:"Vehicle Check",desc:"DVLA + HPI history",key:"hpi"},
            {icon:"💳",label:"Finance Calc",desc:"PCP, HP & PCH",key:"finance"},
            {icon:"🎯",label:"Deal Checker",desc:"Price analysis",key:"deal"},
            {icon:"⚖️",label:"Compare",desc:"Side by side",key:"compare"},
            {icon:"💷",label:"Sell My Car",desc:"Instant valuation",key:"valuation"},
            {icon:"🌍",label:"ULEZ Checker",desc:"London compliance",key:"ulez"},
            {icon:"📊",label:"Cost Dashboard",desc:"Track expenses",key:"costs"},
          ].map(t =>
            <div key={t.key} className="tool-card" onClick={()=>openModal(t.key)}>
              <div className="tool-icon">{t.icon}</div>
              <div className="tool-label">{t.label}</div>
              <div className="tool-desc">{t.desc}</div>
            </div>
          )}
        </div>
      </div>

      {/* Top Matches */}
      <div className="section">
        <div className="section-head">
          <div>
            <div className="section-title">Top Matches For You</div>
            <div className="section-subtitle">{V.length} vehicles available</div>
          </div>
          <button className="section-link" onClick={()=>{setPage("search");setSel(null);}}>Browse all →</button>
        </div>
        <div className="vehicle-grid">
          {[...V].sort((a,b)=>b.matchScore-a.matchScore).slice(0,4).map(v => VCard({v}))}
        </div>
      </div>

      {/* Recently Listed */}
      <div className="section" style={{paddingBottom:80}}>
        <div className="section-head">
          <div>
            <div className="section-title">Just Listed</div>
            <div className="section-subtitle">Added in the last 7 days</div>
          </div>
        </div>
        <div className="vehicle-grid">
          {[...V].sort((a,b)=>a.daysListed-b.daysListed).slice(0,4).map(v => VCard({v}))}
        </div>
      </div>
    </>
  );

  // ═══ RENDER: SEARCH PAGE ═══
  const saveCurrentSearch = () => {
    if (!user) { setAuthModal("login"); return; }
    const name = `${fFuel!=="All"?fFuel+" ":""}${fBody!=="All"?fBody+" ":""}${fPrice==="u15"?"Under £15k":fPrice==="15-25"?"£15k-£25k":fPrice==="25+"?"Over £25k":"All cars"}`.trim();
    const newSearch = {id:Date.now(),name,filters:{fuel:fFuel,body:fBody,price:fPrice},alertFreq:"instant",created:new Date().toISOString().split("T")[0],matchCount:filtered.length};
    setSavedSearches(p=>[newSearch,...p]);
    // Add notification
    setNotifs(p=>[{id:Date.now(),type:"saved_search",title:"Search saved!",desc:`You'll get alerts for "${name}"`,time:"Just now",read:false,icon:"✅",color:"#059669"},...p]);
  };
  const deleteSearch = (id) => setSavedSearches(p=>p.filter(s=>s.id!==id));

  const SearchPage = () => (
    <div className="section" style={{paddingBottom:80}}>
      <div className="section-head">
        <div style={{flex:1}}>
          <div className="section-title">Browse Cars</div>
          <div className="section-subtitle">{filtered.length} vehicles found</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-outline btn-sm" onClick={()=>setShowSavedSearches(!showSavedSearches)} style={{fontSize:12}}>
            🔔 Saved ({savedSearches.length})
          </button>
          <button className="btn btn-primary btn-sm" onClick={saveCurrentSearch} style={{fontSize:12}}>
            💾 Save Search
          </button>
        </div>
      </div>

      {/* Saved Searches Dropdown */}
      {showSavedSearches && (
        <div className="card mb-4" style={{animation:"fadeIn 0.2s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div className="label-sm" style={{margin:0}}>Saved Searches</div>
            <button onClick={()=>setShowSavedSearches(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16}}>✕</button>
          </div>
          {savedSearches.length === 0 ? (
            <div className="text-sm text-muted text-center" style={{padding:16}}>No saved searches yet. Use the filters and tap "Save Search".</div>
          ) : savedSearches.map(s => (
            <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border-light)"}}>
              <div style={{flex:1,cursor:"pointer"}} onClick={()=>{setFFuel(s.filters.fuel);setFBody(s.filters.body);setFPrice(s.filters.price);setShowSavedSearches(false);}}>
                <div className="text-sm font-bold">{s.name}</div>
                <div className="text-xs text-muted">{s.matchCount} matches · Alerts: {s.alertFreq} · Saved {s.created}</div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <select value={s.alertFreq} onChange={e=>setSavedSearches(p=>p.map(x=>x.id===s.id?{...x,alertFreq:e.target.value}:x))} style={{
                  padding:"3px 6px",borderRadius:6,border:"1px solid var(--border-light)",fontSize:11,background:"white"
                }}>
                  <option value="instant">Instant</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="off">Off</option>
                </select>
                <button onClick={()=>deleteSearch(s.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"var(--text-muted)"}}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar" style={{flexWrap:"wrap",gap:6}}>
        <span className="text-sm font-bold text-muted" style={{padding:"8px 4px",whiteSpace:"nowrap"}}>Fuel:</span>
        {["All","Petrol","Diesel","Electric","Hybrid"].map(f =>
          <button key={f} className={`filter-chip ${fFuel===f?"active":""}`} onClick={()=>setFFuel(f)}>{f}</button>
        )}
        <div style={{width:8}}/>
        <span className="text-sm font-bold text-muted" style={{padding:"8px 4px",whiteSpace:"nowrap"}}>Body:</span>
        {["All","Hatchback","Saloon","SUV"].map(b =>
          <button key={b} className={`filter-chip ${fBody===b?"active":""}`} onClick={()=>setFBody(b)}>{b}</button>
        )}
        <div style={{width:8}}/>
        <span className="text-sm font-bold text-muted" style={{padding:"8px 4px",whiteSpace:"nowrap"}}>Price:</span>
        {[{k:"All",l:"All"},{k:"u15",l:"Under £15k"},{k:"15-25",l:"£15-25k"},{k:"25+",l:"Over £25k"}].map(p =>
          <button key={p.k} className={`filter-chip ${fPrice===p.k?"active":""}`} onClick={()=>setFPrice(p.k)}>{p.l}</button>
        )}
      </div>

      {/* Sort bar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",marginBottom:8}}>
        <div className="text-xs text-muted">{filtered.length} results</div>
        <div style={{display:"flex",gap:4}}>
          {[{k:"match",l:"Best Match"},{k:"price-low",l:"Price ↑"},{k:"price-high",l:"Price ↓"},{k:"newest",l:"Newest"}].map(s=>
            <button key={s.k} onClick={()=>setFSort(s.k)} style={{
              padding:"4px 10px",borderRadius:100,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",
              background:fSort===s.k?"var(--primary)":"#F3F4F6",color:fSort===s.k?"white":"var(--text-muted)"
            }}>{s.l}</button>
          )}
        </div>
      </div>

      <div className="vehicle-grid">{filtered.map(v => VCard({v}))}</div>
    </div>
  );

  // ═══ RENDER: FAVOURITES ═══
  const FavouritesPage = () => {
    if (!user) return (
      <div className="section" style={{paddingBottom:80,textAlign:"center"}}>
        <div style={{padding:"60px 20px"}}>
          <div style={{fontSize:48,marginBottom:16}}>❤️</div>
          <div className="text-lg font-extra mb-2">Save cars you love</div>
          <div className="text-sm text-muted mb-4">Log in to save favourites and access them from any device</div>
          <button className="btn btn-primary" onClick={()=>setAuthModal("login")}>Log in to get started</button>
        </div>
      </div>
    );
    return (
      <div className="section" style={{paddingBottom:80}}>
        <div className="section-head">
          <div className="section-title">❤️ Saved Cars ({favs.length})</div>
        </div>
        {favs.length>0 ?
          <div className="vehicle-grid">{V.filter(v=>favs.includes(v.id)).map(v => VCard({v}))}</div> :
          <div className="card text-center" style={{padding:60}}>
            <div style={{fontSize:48,marginBottom:12}}>🤍</div>
            <div className="text-md font-bold mb-2">No saved cars yet</div>
            <div className="text-sm text-muted">Tap the heart on any car to save it here</div>
          </div>
        }
      </div>
    );
  };

  // ═══ RENDER: MESSAGES ═══
  const MessagesPage = () => {
    if (!user) return (
      <div className="section" style={{paddingBottom:80,textAlign:"center"}}>
        <div style={{padding:"60px 20px"}}>
          <div style={{fontSize:48,marginBottom:16}}>💬</div>
          <div className="text-lg font-extra mb-2">Your messages</div>
          <div className="text-sm text-muted mb-4">Sign in to view your dealer conversations.</div>
          <button className="btn btn-primary" onClick={()=>setAuthModal("login")}>Sign In</button>
        </div>
      </div>
    );
    return (
      <div className="section" style={{paddingBottom:80}}>
        <div className="section-head" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div className="section-title">💬 Messages</div>
          <div className="text-sm text-muted">{conversations.length} conversation{conversations.length!==1?"s":""}</div>
        </div>
        {conversations.length === 0 ? (
          <div className="text-center" style={{padding:"60px 20px"}}>
            <div style={{fontSize:48,marginBottom:16}}>📭</div>
            <div className="text-md font-bold mb-2">No conversations yet</div>
            <div className="text-sm text-muted mb-4">When you message a dealer about a car, your conversations will appear here.</div>
            <button className="btn btn-primary" onClick={()=>setPage("search")}>Browse Cars</button>
          </div>
        ) : (
          <div>
            {conversations.map(c => {
              const dl = D.find(d=>d.id===c.dealer_id) || D[0];
              const v = c.vehicle_id ? V.find(x=>x.id===c.vehicle_id) : null;
              const timeAgo = c.updated_at ? (() => {
                const diff = Date.now() - new Date(c.updated_at).getTime();
                if (diff < 60000) return "just now";
                if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
                if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
                return `${Math.floor(diff/86400000)}d ago`;
              })() : "";
              return (
                <div key={c.id} onClick={async ()=>{
                  setDCtx(v ? {vehicleId:v.id,flow:"general",vehicle:v,dealer:dl} : {vehicleId:null,flow:"general",vehicle:V[0],dealer:dl});
                  setActiveConvoId(c.id);
                  setInboxOpen(false);
                  setActiveModal("dealer-chat");
                  // Load messages
                  try {
                    const mr = await fetch(`/api/conversations?id=${c.id}`);
                    const data = await mr.json();
                    if(data.messages) setDMsgs(data.messages.map(m=>({id:m.id,role:m.sender_type==="user"?"user":"bot",text:m.content,time:m.created_at})));
                  } catch{}
                  // Mark read
                  fetch("/api/conversations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"mark_read",conversation_id:c.id})});
                }} className="card" style={{
                  display:"flex",gap:14,padding:16,marginBottom:8,cursor:"pointer",
                  border:c.user_unread_count>0?"1.5px solid var(--primary)":"1px solid var(--border-light)",
                  background:c.user_unread_count>0?"rgba(66,133,244,0.03)":"white"
                }}>
                  <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,var(--primary),#1a5cd6)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:18,flexShrink:0}}>
                    {dl?.name?.charAt(0)||"D"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                      <div className="text-sm font-bold">{dl?.name||"Dealer"}</div>
                      <span className="text-xs text-muted">{timeAgo}</span>
                    </div>
                    {v && <div className="text-xs" style={{color:"var(--primary)",fontWeight:600,marginBottom:2}}>{v.year} {v.make} {v.model} · {fmt(v.price)}</div>}
                    <div className="text-xs text-muted" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",opacity:0.7}}>
                      {c.last_message_preview || "Start of conversation"}
                    </div>
                  </div>
                  {c.user_unread_count > 0 && (
                    <div style={{width:24,height:24,borderRadius:"50%",background:"var(--primary)",color:"white",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,alignSelf:"center"}}>
                      {c.user_unread_count}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ═══ RENDER: GARAGE ═══
  const GaragePage = () => {
    if (!user) return (
      <div className="section" style={{paddingBottom:80,textAlign:"center"}}>
        <div style={{padding:"60px 20px"}}>
          <div style={{fontSize:48,marginBottom:16}}>🚗</div>
          <div className="text-lg font-extra mb-2">Your digital garage</div>
          <div className="text-sm text-muted mb-4">Track MOT, tax, service history, and running costs for your cars</div>
          <button className="btn btn-primary" onClick={()=>setAuthModal("login")}>Log in to get started</button>
        </div>
      </div>
    );
    return (
    <div className="section" style={{paddingBottom:80}}>
      <div className="section-head"><div className="section-title">🚗 My Garage</div></div>
      {GARAGE.map(g => (
        <div key={g.id} className="card mb-4">
          <div className="flex gap-4 items-center mb-4">
            <div style={{width:72,height:72,display:"flex",alignItems:"center",justifyContent:"center",background:"#F3F4F6",borderRadius:12,overflow:"hidden"}}><img src={carImg(g.make,g.model,g.year)} alt={g.make} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
            <div>
              <div className="text-lg font-extra">{g.year} {g.make} {g.model}</div>
              <div className="text-sm text-muted">{g.vrm} · {g.colour} · {g.variant}</div>
            </div>
          </div>
          <div className="info-grid mb-4">
            {[{l:"Mileage",v:fmtMi(g.mileage)},{l:"Value",v:fmt(g.value)},{l:"MOT Expires",v:g.motExpiry},{l:"Tax Due",v:g.taxExpiry}].map((s,i) =>
              <div key={i} className="info-cell"><div className="info-val">{s.v}</div><div className="info-label">{s.l}</div></div>
            )}
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary flex-1" onClick={()=>{setValReg(g.vrm);setValResult(null);openModal("valuation");}}>💷 Value My Car</button>
            <button className="btn btn-outline flex-1" onClick={()=>openModal("service")}>🔧 Service History</button>
            <button className="btn btn-outline flex-1" onClick={()=>openModal("costs")}>📊 Costs</button>
          </div>
          <div className="divider"/>
          <div className="label-sm">Upcoming Reminders</div>
          <div>
            {[{icon:"📋",label:"MOT Due",val:"31 days",c:"var(--warning)"},{icon:"💰",label:"Tax Renewal",val:"48 days"},{icon:"🔧",label:"Next Service",val:"~2,500 mi"},{icon:"🛡️",label:"Insurance",val:"94 days"}].map((r,i) =>
              <div key={i} className="flex justify-between items-center" style={{padding:"8px 0",borderBottom:i<3?"1px solid var(--border-light)":"none"}}>
                <span className="text-sm">{r.icon} {r.label}</span>
                <span className="text-sm font-bold" style={{color:r.c||"var(--text)"}}>{r.val}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
    );
  };

  // ═══ RENDER: PROFILE ═══
  const ProfilePage = () => {
    if (!user) {
      return (
        <div className="section" style={{paddingBottom:80,maxWidth:500,textAlign:"center"}}>
          <div style={{padding:"60px 20px"}}>
            <div style={{fontSize:48,marginBottom:16}}>🔒</div>
            <div className="text-lg font-extra mb-2">Log in to see your profile</div>
            <div className="text-sm text-muted mb-4">Access your saved cars, garage, and preferences</div>
            <button className="btn btn-primary" onClick={()=>setAuthModal("login")}>Log in</button>
            <div className="text-sm text-muted" style={{marginTop:12}}>
              Don't have an account? <button style={{background:"none",border:"none",color:"var(--primary)",fontWeight:700,cursor:"pointer"}} onClick={()=>setAuthModal("signup")}>Sign up free</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="section" style={{paddingBottom:80, maxWidth:600}}>
        <div className="text-center mb-4" style={{padding:20}}>
          <div style={{
            width:72,height:72,borderRadius:"50%",margin:"0 auto 12px",
            background:"linear-gradient(135deg,var(--primary),#1a5cd6)",
            display:"flex",alignItems:"center",justifyContent:"center",
            color:"white",fontSize:28,fontWeight:800
          }}>{user.name?.charAt(0)?.toUpperCase()||"U"}</div>
          <div className="text-lg font-extra">{user.name}</div>
          <div className="text-sm text-muted">{user.plan==="pro"?"CarGPT Pro Member":"CarGPT Free"}</div>
        </div>
        <div className="tabs mb-4">
          {["account","prefs","about"].map(t =>
            <button key={t} className={`tab-btn ${profTab===t?"active":""}`} onClick={()=>setProfTab(t)}>
              {t==="account"?"Account":t==="prefs"?"Preferences":"About"}
            </button>
          )}
        </div>
        {profTab==="account" && <div className="card">
          {[
            {l:"Email",v:user.email},
            {l:"Plan",v:user.plan==="pro"?"Pro (£9.99/mo)":"Free"},
            {l:"Saved Cars",v:`${favs.length} favourites`},
            {l:"Joined",v:user.joined ? new Date(user.joined).toLocaleDateString("en-GB",{month:"long",year:"numeric"}) : "February 2026"},
          ].map((r,i) =>
            <div key={i} className="flex justify-between" style={{padding:"12px 0",borderBottom:i<3?"1px solid var(--border-light)":"none"}}>
              <span className="text-sm text-muted">{r.l}</span><span className="text-sm font-bold">{r.v}</span>
            </div>
          )}
          <button className="btn btn-outline btn-block btn-sm" style={{marginTop:16,color:"#DC2626",borderColor:"#FECACA"}} onClick={logout}>
            Log out
          </button>
        </div>}
        {profTab==="prefs" && <div className="card">
          {["🔔 Push Notifications","📧 Email Alerts","🌙 Dark Mode","📍 Location Services"].map((p,i) =>
            <div key={i} className="flex justify-between items-center" style={{padding:"12px 0",borderBottom:i<3?"1px solid var(--border-light)":"none"}}>
              <span className="text-sm">{p}</span><span className="text-sm text-success font-bold">On</span>
            </div>
          )}
        </div>}
        {profTab==="about" && <div className="card">
          <div className="text-md font-bold mb-2">CarGPT v2.0</div>
          <div className="text-sm text-muted">AI-First Car Marketplace. 450,000+ vehicles. 15,000+ dealers. Powered by Claude AI.</div>
        </div>}
      </div>
    );
  };

  // ═══ RENDER: VEHICLE DETAIL ═══
  const DetailPage = () => {
    if(!sel) return null;
    const v=sel, dl=D.find(d=>d.id===v.dealerId)||D[0], fin=calcFin(v.price);
    return (
      <div style={{paddingBottom:80}}>
        <div style={{padding:"16px 0"}}>
          <button className="btn btn-secondary btn-sm" onClick={()=>setSel(null)}>← Back to results</button>
        </div>
        <div className="detail-layout">
          {/* Left column */}
          <div>
            <div className="detail-hero-img mb-2"><img src={carImg(v.make, v.model, v.year, galleryAngle)} alt={`${v.year} ${v.make} ${v.model}`}/></div>
            <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
              {[1,5,9,13,17,21,25,29].map(a=>(
                <div key={a} onClick={()=>setGalleryAngle(a)} style={{
                  width:80,height:52,borderRadius:8,overflow:"hidden",cursor:"pointer",flexShrink:0,
                  border:galleryAngle===a?"2px solid var(--primary)":"2px solid transparent",
                  background:"#F3F4F6",opacity:galleryAngle===a?1:0.7,transition:"all 0.2s"
                }}>
                  <img src={carImg(v.make,v.model,v.year,a)} alt={`angle ${a}`} style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy"/>
                </div>
              ))}
            </div>

            <div className="tabs mb-4">
              {["details","mot","reviews","ai"].map(t =>
                <button key={t} className={`tab-btn ${detailTab===t?"active":""}`} onClick={()=>setDetailTab(t)}>
                  {t==="details"?"Details & Specs":t==="mot"?"MOT History":t==="reviews"?"Reviews":"Ask AI"}
                </button>
              )}
            </div>

            {detailTab==="details" && <>
              <div className="info-grid mb-4">
                {[{l:"Engine",v:v.engineSize},{l:"Power",v:v.specs.bhp+"bhp"},{l:"0-62 mph",v:v.specs.acceleration+"s"},{l:"Economy",v:v.specs.fuelEconomy+(typeof v.specs.fuelEconomy==="number"?" mpg":"")},{l:"Boot Space",v:v.specs.bootSpace+"L"},{l:"Fuel",v:v.fuel},{l:"Gearbox",v:v.transmission},{l:"Colour",v:v.colour}].map((s,i) =>
                  <div key={i} className="info-cell"><div className="info-val">{s.v}</div><div className="info-label">{s.l}</div></div>
                )}
              </div>

              <div className="label-sm">Trust & Checks</div>
              <div className="card mb-4">
                {[{icon:v.hpiClear?"✅":"⏳",label:"HPI Check",val:v.hpiClear?"Clear":"Pending"},{icon:"📋",label:"MOT",val:`Until ${v.motExpiry}`},{icon:"🔧",label:"Service History",val:v.serviceHistory?"Full":"Partial"},{icon:"👤",label:"Previous Keepers",val:`${v.previousKeepers}`},{icon:"🌍",label:"ULEZ",val:v.ulezCompliant?"Compliant":"Not compliant"},{icon:"🛡️",label:"Insurance Group",val:`${v.insuranceGroup}/50`},{icon:"💰",label:"Road Tax",val:v.taxCost===0?"FREE":`£${v.taxCost}/yr`}].map((c,i) =>
                  <div key={i} className="flex justify-between items-center" style={{padding:"10px 0",borderBottom:i<6?"1px solid var(--border-light)":"none"}}>
                    <span className="text-sm">{c.icon} {c.label}</span><span className="text-sm font-bold">{c.val}</span>
                  </div>
                )}
              </div>

              <div className="label-sm">Features</div>
              <div className="flex gap-2 flex-wrap mb-4">
                {v.features.map((f,i) => <span key={i} className="badge badge-blue">{f}</span>)}
              </div>
            </>}

            {detailTab==="mot" && <div>
              <div className="label-sm">MOT History</div>
              {(v.mot||[]).map((m,i) =>
                <div key={i} className="card mb-3 fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold">{m.date}</span>
                    <span className={`badge ${m.result==="Pass"?"badge-green":"badge-red"}`}>{m.result==="Pass"?"✅ Pass":"❌ Fail"}</span>
                  </div>
                  <div className="text-xs text-muted">Mileage: {m.mileage?.toLocaleString()}</div>
                  {m.advisories?.length>0 && m.advisories.map((a,j) =>
                    <div key={j} className="mt-2" style={{padding:10,background:a.includes("major")?"var(--error-light)":"var(--warning-light)",borderRadius:8}}>
                      <div className="text-sm font-bold">{a.includes("major")?"❌":"⚠️"} {a.split("(")[0].trim()}</div>
                      <div className="text-xs text-muted mt-1">{a.includes("minor")?"Minor — keep an eye on it.":a.includes("major")?"Major — needs fixing.":"Advisory — worth monitoring."}</div>
                    </div>
                  )}
                </div>
              )}
            </div>}

            {detailTab==="reviews" && <div>
              {/* Dealer rating summary */}
              <div className="card mb-4" style={{background:"linear-gradient(135deg,#F8F9FA,#EEF2FF)"}}>
                <div style={{display:"flex",gap:20,alignItems:"center"}}>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:42,fontWeight:800,color:"var(--primary)"}}>{dl.rating}</div>
                    <div style={{display:"flex",gap:2,justifyContent:"center",margin:"4px 0"}}>
                      {[1,2,3,4,5].map(s=><span key={s} style={{fontSize:16,color:s<=Math.round(dl.rating)?"#FBBF24":"#D1D5DB"}}>★</span>)}
                    </div>
                    <div className="text-xs text-muted">{dl.reviews} reviews</div>
                  </div>
                  <div style={{flex:1}}>
                    {[{s:5,p:72},{s:4,p:20},{s:3,p:5},{s:2,p:2},{s:1,p:1}].map(r=>(
                      <div key={r.s} style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                        <span style={{fontSize:11,width:8}}>{r.s}</span>
                        <span style={{fontSize:10}}>★</span>
                        <div style={{flex:1,height:6,background:"#E5E7EB",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${r.p}%`,height:"100%",background:r.s>=4?"#FBBF24":r.s===3?"#F59E0B":"#EF4444",borderRadius:3}}/>
                        </div>
                        <span style={{fontSize:10,color:"var(--text-muted)",width:28,textAlign:"right"}}>{r.p}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Write review button */}
              <button className="btn btn-outline btn-block btn-sm mb-4" onClick={()=>{
                if(!user){setAuthModal("login");return;}
                setReviewModal(true);setReviewStars(0);setReviewText("");setReviewSubmitted(false);
              }}>✍️ Write a Review</button>

              {/* Review list */}
              {reviews.filter(r=>r.dealerId===dl.id).map(r=>(
                <div key={r.id} className="card mb-3 fade-in">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:8}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#E5E7EB,#D1D5DB)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#6B7280"}}>{r.author.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-bold" style={{display:"flex",alignItems:"center",gap:4}}>
                            {r.author}
                            {r.verified && <span style={{background:"#E8F5E9",color:"#2E7D32",fontSize:9,padding:"1px 5px",borderRadius:4,fontWeight:700}}>✓ Verified Buyer</span>}
                          </div>
                          <div style={{display:"flex",gap:2}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:12,color:s<=r.rating?"#FBBF24":"#D1D5DB"}}>★</span>)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted">{new Date(r.date).toLocaleDateString("en-GB",{month:"short",year:"numeric"})}</div>
                  </div>
                  <div className="text-sm" style={{lineHeight:1.5,color:"var(--text-secondary)"}}>{r.text}</div>
                </div>
              ))}
            </div>}

            {detailTab==="ai" && <div>
              <div className="text-sm text-muted mb-3">Ask anything about this {v.make} {v.model}</div>
              <div className="flex gap-2 flex-wrap mb-4">
                {["Is this a good deal?","What are the running costs?","Any MOT issues?","How much is insurance?","Is it reliable?","What's the finance like?","Is it ULEZ compliant?","Should I negotiate?"].map((q,i) =>
                  <button key={i} className="quick-action" onClick={()=>sendVMsg(q)}>{q}</button>
                )}
              </div>
              {vMsgs.map((m,i) =>
                <div key={i} className={`chat-msg ${m.role==="user"?"user":""} fade-in`} style={{marginBottom:8}}>
                  <div className="chat-bubble">{m.text}</div>
                  {m.quickReplies && <div className="chat-quick-replies">{m.quickReplies.map((qr,j) =>
                    <button key={j} className="chat-qr" onClick={()=>sendVMsg(qr)}>{qr}</button>
                  )}</div>}
                </div>
              )}
              {vTyping && <div className="chat-msg fade-in"><div className="chat-bubble"><div className="typing-dots"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div></div></div>}
              <div ref={vRef}/>
              <div className="flex gap-2 mt-3">
                <input className={`input${voiceActive==="vehicle"?" voice-listening":""}`} style={{flex:1}} placeholder={voiceActive==="vehicle"?"🎙️ Listening...":"Ask about this car..."} value={vIn} onChange={e=>setVIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){if(voiceActive)stopVoice();sendVMsg(vIn);}}}/>
                <button className={`btn-mic${voiceActive==="vehicle"?" active":""}`} onClick={()=>startVoice("vehicle")} title="Voice input">{voiceActive==="vehicle"?"⏹":"🎙️"}</button>
                <button className="btn btn-primary" onClick={()=>{if(voiceActive)stopVoice();sendVMsg(vIn);}}>Send</button>
              </div>
            </div>}
          </div>

          {/* Right sidebar */}
          <div className="detail-sidebar">
            <div className="detail-price-card">
              <div className="detail-price">{fmt(v.price)}</div>
              <div className="flex gap-2 items-center mb-3">
                <span className={`badge ${v.priceRating.includes("Great")?"badge-green":"badge-green"}`}>{v.priceRating}</span>
                <span className="text-xs text-muted">{fmtMi(v.mileage)} · {v.year} · {v.location}</span>
              </div>
              <div className="detail-actions-grid">
                <button className="btn btn-primary" onClick={()=>openDChat(v.id)}>💬 Message</button>
                <button className="btn btn-outline" onClick={()=>openDChat(v.id,"testDrive")}>📅 Test Drive</button>
                <button className="btn btn-outline" onClick={()=>{setHpiReg(v.vrm);setHpiResult(null);setHpiPremium(false);openModal("hpi");}}>🔎 Check</button>
                <button className="btn btn-outline" onClick={()=>openModal("finance")}>💳 Finance</button>
              </div>
            </div>

            <div className="card">
              <div className="label-sm">Finance Estimate</div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">PCP from</span>
                <span className="text-lg font-extra text-primary">£{fin.monthly}/mo</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm">HP from</span>
                <span className="text-md font-bold">£{Math.round(fin.monthly*1.15)}/mo</span>
              </div>
              <button className="btn btn-secondary btn-block btn-sm" onClick={()=>openModal("finance")}>Full Finance Calculator</button>
            </div>

            <div className="card">
              <div className="label-sm">Dealer</div>
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:8}}>
                <div style={{width:44,height:44,borderRadius:10,background:"linear-gradient(135deg,var(--primary),#1a5cd6)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:16}}>{dl.name.charAt(0)}</div>
                <div>
                  <div className="text-md font-bold" style={{display:"flex",alignItems:"center",gap:4}}>{dl.name} <span style={{background:"#E8F5E9",color:"#2E7D32",fontSize:10,padding:"1px 6px",borderRadius:4,fontWeight:700}}>✓ Verified</span></div>
                  <div className="text-xs text-muted">⭐ {dl.rating} ({dl.reviews} reviews) · 📍 {dl.location}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <div style={{flex:1,background:"#F8F9FA",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:11,color:"var(--text-muted)"}}>Trust Score</div><div style={{fontWeight:700,color:dl.trustScore>=90?"#2E7D32":"var(--text-primary)"}}>{dl.trustScore}/100</div></div>
                <div style={{flex:1,background:"#F8F9FA",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:11,color:"var(--text-muted)"}}>Response</div><div style={{fontWeight:700}}>{dl.responseTime}</div></div>
              </div>
              <button className="btn btn-primary btn-block btn-sm" onClick={()=>openDChat(v.id)}>Message Dealer</button>
            </div>

            <div className="card">
              <div className="label-sm">More Actions</div>
              <div className="flex flex-col gap-2">
                <button className="btn btn-outline btn-sm btn-block" onClick={()=>{setPexResult(null);openModal("partex");}}>🔄 Part Exchange</button>
                <button className="btn btn-outline btn-sm btn-block" onClick={()=>{setCompCars([v,V.find(x=>x.id!==v.id)||V[1]]);openModal("compare");}}>⚖️ Compare</button>
                <button className="btn btn-outline btn-sm btn-block" onClick={()=>openModal("negotiate")}>🤝 Negotiation Coach</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ═══ RENDER: AI CHAT PANEL ═══
  // ChatPanel is inlined in the main return to avoid remounting

  // ═══ RENDER: TOOLS SIDEBAR ═══
  const ToolsSidebar = () => {
    if(!showTools) return null;
    const sections = [
      {title:"AI TOOLS",items:[{icon:"🤖",label:"AI Agents",key:"agents"},{icon:"🔎",label:"Vehicle Check",key:"hpi"},{icon:"💳",label:"Finance Calculator",key:"finance"},{icon:"🎯",label:"Deal Checker",key:"deal"},{icon:"🤝",label:"Negotiation Coach",key:"negotiate"},{icon:"⚖️",label:"Compare Cars",key:"compare"}]},
      {title:"BUY & SELL",items:[{icon:"🔍",label:"Reg Plate Lookup",key:"reg"},{icon:"💷",label:"Sell My Car",key:"valuation"},{icon:"🔄",label:"Part Exchange",key:"partex"},{icon:"🛡️",label:"Insurance Groups",key:"insurance"},{icon:"⚡",label:"EV Calculator",key:"ev"}]},
      {title:"MY CAR",items:[{icon:"📊",label:"Cost Dashboard",key:"costs"},{icon:"🔧",label:"Service History",key:"service"},{icon:"🏢",label:"Company Car Tax",key:"companycar"}]},
      {title:"DAILY DRIVING",items:[{icon:"🗺️",label:"Journey Costs",key:"journey"},{icon:"⛽",label:"Fuel Prices",key:"fuel"},{icon:"📸",label:"Speed Cameras",key:"speed"},{icon:"🅿️",label:"Parking Helper",key:"parking"},{icon:"🛣️",label:"Road Trip Planner",key:"roadtrip"},{icon:"🌧️",label:"Weather Alerts",key:"weather"}]},
      {title:"UK TOOLS",items:[{icon:"🌍",label:"ULEZ Checker",key:"ulez"},{icon:"📋",label:"MOT Explainer",key:"mot"}]},
      {title:"EMERGENCY",items:[{icon:"🚨",label:"Accident Helper",key:"accident"},{icon:"⚠️",label:"Warning Lights",key:"warning"},{icon:"📋",label:"Fines & Legal",key:"fines"}]},
      {title:"LEARN TO DRIVE",items:[{icon:"📝",label:"Theory Test Prep",key:"theory"},{icon:"👨‍🏫",label:"Find Instructor",key:"instructor"},{icon:"🔰",label:"First Car Guide",key:"firstcar"}]},
      {title:"CAR CARE",items:[{icon:"🧽",label:"Car Wash Finder",key:"carwash"},{icon:"🔵",label:"Tyre Finder",key:"tyres"},{icon:"🔧",label:"Garage Finder",key:"garagefinder"},{icon:"🛠️",label:"DIY Guides",key:"diy"},{icon:"📦",label:"Parts Prices",key:"parts"}]},
    ];
    return (<>
      <div style={{position:"fixed",inset:0,zIndex:200,background:"transparent"}} onClick={()=>setShowTools(false)}/>
      <div className="tools-sidebar">
        {sections.map(sec => (
          <div key={sec.title}>
            <div className="tools-section-title">{sec.title}</div>
            {sec.items.map(item =>
              <button key={item.key} className="tools-item" onClick={()=>openModal(item.key)}>
                <span className="tools-item-icon">{item.icon}</span>{item.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </>);
  };

  // ═══ RENDER: NOTIFICATION PANEL ═══
  const [notifTab, setNotifTab] = useState("all");
  const NotifPanel = () => {
    if(!showNotifs) return null;
    const filteredNotifs = notifTab==="all" ? notifs : notifTab==="unread" ? notifs.filter(n=>!n.read) : notifs.filter(n=>n.type===notifTab);
    return (<>
      <div style={{position:"fixed",inset:0,zIndex:150,background:"transparent"}} onClick={()=>setShowNotifs(false)}/>
      <div className="notif-panel">
        <div className="notif-header">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div className="text-md font-bold">Notifications</div>
            {unreadCount > 0 && <button onClick={markAllRead} style={{background:"none",border:"none",color:"var(--primary)",fontSize:12,fontWeight:600,cursor:"pointer"}}>Mark all read</button>}
          </div>
          <div style={{display:"flex",gap:4,marginTop:8,overflowX:"auto"}}>
            {[{key:"all",label:"All"},{key:"unread",label:`Unread (${unreadCount})`},{key:"price_drop",label:"💰 Price"},{key:"saved_search",label:"🔔 Searches"},{key:"mot_reminder",label:"📋 MOT"}].map(t=>
              <button key={t.key} onClick={()=>setNotifTab(t.key)} style={{
                padding:"4px 10px",borderRadius:100,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",
                background:notifTab===t.key?"var(--primary)":"#F3F4F6",color:notifTab===t.key?"white":"var(--text-muted)"
              }}>{t.label}</button>
            )}
          </div>
        </div>
        {filteredNotifs.length === 0 ? (
          <div style={{padding:"40px 20px",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:8}}>✅</div>
            <div className="text-sm text-muted">All caught up!</div>
          </div>
        ) : filteredNotifs.map(n =>
          <div key={n.id} className="notif-item" style={{background:n.read?"transparent":"#F0F7FF",borderLeft:n.read?"3px solid transparent":`3px solid ${n.color||"var(--primary)"}`}} onClick={()=>{
            markRead(n.id);setShowNotifs(false);
            if(n.type==="price_drop"&&n.vehicleIdx!=null)setSel(V[n.vehicleIdx]);
            if(n.type==="new_match"&&n.vehicleIdx!=null)setSel(V[n.vehicleIdx]);
            if(n.type==="agent")openModal("agents");
            if(n.type==="saved_search"){setPage("search");setSel(null);}
            if(n.type==="dealer_response")openModal("dealer-chat");
          }}>
            <div className="flex gap-3">
              <div style={{width:36,height:36,borderRadius:10,background:`${n.color||"#E5E7EB"}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{n.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                  <div className="text-sm font-bold" style={{color:n.read?"var(--text-muted)":"var(--text-primary)"}}>{n.title}</div>
                  {!n.read && <div style={{width:8,height:8,borderRadius:"50%",background:"var(--primary)",flexShrink:0,marginTop:4}}/>}
                </div>
                <div className="text-xs text-muted" style={{marginTop:2}}>{n.desc}</div>
                <div className="text-xs text-muted" style={{marginTop:4,opacity:0.7}}>{n.time}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>);
  };

  // ═══ MODAL CONTENT RENDERERS ═══
  const renderModalContent = () => {
    switch(activeModal) {
      // FINANCE
      case "finance": {
        const v=sel||V[0], fin=calcFin(v.price);
        return <SlideOver show={true} onClose={closeModal} title="💳 Finance Calculator">
          <div className="text-sm text-muted mb-3">{v.year} {v.make} {v.model} — {fmt(v.price)}</div>
          <div className="tabs mb-4">{["PCP","HP","PCH"].map(t=><button key={t} className={`tab-btn ${finType===t?"active":""}`} onClick={()=>setFinType(t)}>{t}</button>)}</div>
          <div className="mb-3"><div className="text-xs text-muted mb-1">Deposit: {fmt(finDep)}</div><input type="range" min={0} max={v.price*0.5} step={500} value={finDep} onChange={e=>setFinDep(+e.target.value)} style={{width:"100%"}}/></div>
          <div className="mb-4"><div className="text-xs text-muted mb-1">Term: {finTerm} months</div><input type="range" min={12} max={60} step={12} value={finTerm} onChange={e=>setFinTerm(+e.target.value)} style={{width:"100%"}}/></div>
          <div className="card mb-3" style={{background:"var(--primary-light)",border:"1px solid var(--primary)"}}>
            <div className="text-center">
              <div className="text-xs text-muted">Monthly Payment</div>
              <div style={{fontSize:36,fontWeight:800,color:"var(--primary)"}}>£{fin.monthly}</div>
              <div className="text-xs text-muted">{fin.apr}% APR · {finType}{finType==="PCP"?` · Balloon: ${fmt(fin.balloon)}`:""}</div>
            </div>
          </div>
          <div className="card">{[{l:"Cash Price",v:fmt(v.price)},{l:"Deposit",v:fmt(finDep)},{l:"Total Payable",v:fmt(fin.total)},{l:"Interest",v:fmt(fin.total-v.price)}].map((r,i)=><div key={i} className="flex justify-between" style={{padding:"8px 0",borderBottom:i<3?"1px solid var(--border-light)":"none"}}><span className="text-sm text-muted">{r.l}</span><span className="text-sm font-bold">{r.v}</span></div>)}</div>
        </SlideOver>;
      }

      // HPI / VEHICLE CHECK
      case "hpi":
        return <SlideOver show={true} onClose={()=>{closeModal();setHpiResult(null);setHpiPremium(false);}} title="🔎 Vehicle Check">
          <div className="text-sm text-muted mb-3">Enter any reg to check a vehicle's history</div>
          <div className="flex gap-2 mb-4">
            <input className="input input-mono flex-1" placeholder="Enter reg (e.g. AB21 CDE)" value={hpiReg} onChange={e=>setHpiReg(e.target.value)}/>
            <button className="btn btn-primary" onClick={doHpiCheck}>Check</button>
          </div>
          {hpiResult && <div className="fade-in">
            <div className="label-sm">Free DVLA Check ✅</div>
            <div className="card mb-3">
              <div className="text-md font-bold mb-2">{hpiResult.car.year} {hpiResult.car.make} {hpiResult.car.model}</div>
              {[{l:"Fuel",v:hpiResult.free.fuel},{l:"Engine",v:hpiResult.free.engineSize},{l:"Colour",v:hpiResult.free.colour},{l:"CO2",v:hpiResult.free.co2+"g/km"},{l:"Tax Status",v:hpiResult.free.taxStatus},{l:"MOT Status",v:hpiResult.free.motStatus},{l:"MOT Expires",v:hpiResult.free.motExpiry}].map((r,i)=><div key={i} className="flex justify-between" style={{padding:"6px 0",borderBottom:i<6?"1px solid var(--border-light)":"none"}}><span className="text-xs text-muted">{r.l}</span><span className="text-xs font-bold">{r.v}</span></div>)}
            </div>
            {!hpiPremium ? <div className="card mb-3" style={{background:"var(--primary-light)",border:"1px solid var(--primary)"}}>
              <div className="text-center">
                <div style={{fontSize:32}}>🛡️</div>
                <div className="text-md font-bold mt-2">Premium HPI Check</div>
                <div className="text-xs text-muted mt-1 mb-3">Finance, stolen, write-off, mileage, VIN</div>
                <div className="flex gap-2 justify-center mb-3"><span className="badge badge-green">FREE with Pro</span><span className="badge badge-blue">or £2.99</span></div>
                <button className="btn btn-primary btn-block" onClick={()=>setHpiPremium(true)}>🔓 Unlock Full Report</button>
              </div>
            </div> : <><div className="label-sm">🛡️ Premium Report</div>
              <div className="card mb-3">{[{l:"💳 Finance",v:hpiResult.premium.financeOutstanding},{l:"🚔 Stolen",v:hpiResult.premium.stolen},{l:"💥 Write-Off",v:hpiResult.premium.writeOff},{l:"♻️ Scrapped",v:hpiResult.premium.scrapped},{l:"👤 Keepers",v:hpiResult.premium.keeperChanges},{l:"📏 Mileage",v:hpiResult.premium.mileageAnomaly},{l:"✈️ Import",v:hpiResult.premium.importExport},{l:"🔑 VIN",v:hpiResult.premium.vin}].map((r,i)=><div key={i} className="flex justify-between items-center" style={{padding:"8px 0",borderBottom:i<7?"1px solid var(--border-light)":"none"}}><span className="text-xs">{r.l}</span><span className="text-xs font-bold" style={{color:r.v.includes("⚠️")?"var(--error)":"var(--success)",maxWidth:"60%",textAlign:"right"}}>{r.v}</span></div>)}</div>
              <div className="card" style={{background:hpiResult.premium.financeOutstanding.includes("⚠️")?"var(--error-light)":"var(--success-light)"}}>
                <div className="flex gap-3 items-center"><span style={{fontSize:24}}>{hpiResult.premium.financeOutstanding.includes("⚠️")?"⚠️":"✅"}</span>
                  <div><div className="text-sm font-bold">{hpiResult.premium.financeOutstanding.includes("⚠️")?"Issues Found":"All Clear — Safe to Buy"}</div>
                  <div className="text-xs text-muted">{hpiResult.premium.financeOutstanding.includes("⚠️")?"Finance outstanding must be settled.":"No issues found."}</div></div>
                </div>
              </div>
            </>}
          </div>}
        </SlideOver>;

      // DEAL CHECKER
      case "deal":
        return <SlideOver show={true} onClose={()=>{closeModal();setDealResult(null);}} title="🎯 Deal Checker">
          <div className="text-sm text-muted mb-3">Paste a URL or tap a car to check if it's a good deal</div>
          <div className="flex gap-2 mb-4"><input className="input flex-1" placeholder="Paste URL or enter details..." value={dealUrl} onChange={e=>setDealUrl(e.target.value)}/><button className="btn btn-primary" onClick={()=>doDealCheck()}>Check</button></div>
          {dealResult && <div className="card mb-4 fade-in" style={{background:"var(--primary-light)",border:"1px solid var(--primary)"}}>
            <div className="flex justify-between items-center mb-2"><div className="text-sm font-bold">{dealResult.vehicle.year} {dealResult.vehicle.make} {dealResult.vehicle.model}</div><span className={`badge ${dealResult.verdict==="Excellent"?"badge-green":"badge-yellow"}`}>{dealResult.verdict==="Excellent"?"🔥":"✅"} {dealResult.verdict}</span></div>
            {[{l:"Listed",v:fmt(dealResult.vehicle.price)},{l:"Market Avg",v:fmt(dealResult.marketAvg)},{l:"You Save",v:fmt(dealResult.savings),c:"var(--success)"}].map((r,i)=><div key={i} className="flex justify-between" style={{padding:"4px 0"}}><span className="text-xs text-muted">{r.l}</span><span className="text-sm font-bold" style={{color:r.c||"inherit"}}>{r.v}</span></div>)}
            <div className="progress mt-2"><div className="progress-fill" style={{width:`${dealResult.confidence}%`}}/></div><div className="text-xs text-muted mt-1">Confidence: {dealResult.confidence}%</div>
          </div>}
          <div className="label-sm">Quick Check</div>
          {V.slice(0,4).map(v=><div key={v.id} className="card card-clickable mb-2" onClick={()=>doDealCheck(v)}><div className="flex justify-between items-center"><div><div className="text-sm font-bold">{v.year} {v.make} {v.model}</div><div className="text-xs text-muted">{fmtMi(v.mileage)} · {v.fuel}</div></div><div style={{textAlign:"right"}}><div className="text-sm font-bold">{fmt(v.price)}</div><span className={`badge ${v.priceRating.includes("Great")?"badge-green":"badge-gray"}`}>{v.priceRating}</span></div></div></div>)}
        </SlideOver>;

      // COMPARE
      case "compare":
        return <SlideOver show={true} onClose={closeModal} title="⚖️ Compare Cars">
          <div className="flex gap-2 mb-4">{compCars.map((c,i)=><select key={i} className="input" value={c.id} onChange={e=>{const nc=[...compCars];nc[i]=V.find(v=>v.id===+e.target.value)||V[0];setCompCars(nc);}} style={{flex:1}}>{V.map(v=><option key={v.id} value={v.id}>{v.make} {v.model}</option>)}</select>)}</div>
          <div className="flex gap-2 mb-4">{compCars.map((c,i)=><div key={i} style={{flex:1,textAlign:"center"}}><div style={{width:"100%",height:80,borderRadius:8,overflow:"hidden",background:"#F3F4F6",marginBottom:4}}><img src={carImg(c.make,c.model,c.year)} alt={c.make} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div><div className="text-xs font-bold">{c.make} {c.model}</div></div>)}</div>
          {[{l:"Price",k:v=>fmt(v.price)},{l:"Year",k:v=>""+v.year},{l:"Mileage",k:v=>fmtMi(v.mileage)},{l:"Fuel",k:v=>v.fuel},{l:"Power",k:v=>v.specs.bhp+"bhp"},{l:"0-62",k:v=>v.specs.acceleration+"s"},{l:"Economy",k:v=>v.specs.fuelEconomy+(typeof v.specs.fuelEconomy==="number"?" mpg":"")},{l:"Boot",k:v=>v.specs.bootSpace+"L"},{l:"Insurance",k:v=>"Grp "+v.insuranceGroup},{l:"Tax",k:v=>v.taxCost===0?"FREE":"£"+v.taxCost+"/yr"},{l:"ULEZ",k:v=>v.ulezCompliant?"✅":"❌"},{l:"Rating",k:v=>v.priceRating}].map((r,i)=><div key={i} className="flex" style={{borderBottom:"1px solid var(--border-light)",padding:"10px 0"}}><div className="text-xs text-muted" style={{width:80,flexShrink:0}}>{r.l}</div>{compCars.map((c,j)=><div key={j} className="text-sm font-bold" style={{flex:1,textAlign:"center"}}>{r.k(c)}</div>)}</div>)}
          <div className="flex gap-2 mt-4">{compCars.map((c,i)=><button key={i} className="btn btn-primary flex-1" onClick={()=>{setSel(c);closeModal();}}>View {c.make}</button>)}</div>
        </SlideOver>;

      // AGENTS
      case "agents":
        return <SlideOver show={true} onClose={()=>{closeModal();setAgentSteps([]);setAgentRunning(false);setAgentType(null);}} title="🤖 AI Agents">
          {!agentType ? <>
            <div className="text-sm text-muted mb-4">Autonomous AI assistants that act on your behalf</div>
            {[{key:"hunt",icon:"🔍",name:"Deal Hunter",desc:"Monitors 450K+ listings for great deals"},{key:"testdrive",icon:"📅",name:"Test Drive Booker",desc:"Arranges test drives across dealers"},{key:"negotiate",icon:"💰",name:"Price Negotiator",desc:"Contacts dealers with offers"},{key:"partex",icon:"🔄",name:"Part-Ex Agent",desc:"Gets valuations from multiple dealers"},{key:"finance",icon:"💳",name:"Finance Shopper",desc:"Compares 12+ lender offers"},{key:"paperwork",icon:"📋",name:"Paperwork Agent",desc:"Handles V5C, insurance, tax"}].map(a =>
              <div key={a.key} className="card card-clickable mb-2" onClick={()=>runAgent(a.key)}>
                <div className="flex justify-between items-center"><div className="flex gap-3 items-center"><span style={{fontSize:24}}>{a.icon}</span><div><div className="text-sm font-bold">{a.name}</div><div className="text-xs text-muted">{a.desc}</div></div></div><span className="badge badge-blue">▶ Run</span></div>
              </div>
            )}
          </> : <>
            <div className="text-sm text-muted mb-3">Agent working...</div>
            {agentSteps.map((s,i)=><div key={i} className="step-item fade-in"><div className={`step-dot ${i<agentSteps.length-1||!agentRunning?"step-done":"step-active"}`}>{i<agentSteps.length-1||!agentRunning?"✓":"⟳"}</div><div className="text-sm" style={{paddingTop:3}}>{s.t}</div></div>)}
            <div className="progress mt-3"><div className="progress-fill" style={{width:`${agentRunning?Math.min(90,agentSteps.length*25):100}%`}}/></div>
            {!agentRunning&&agentSteps.length>0&&<button className="btn btn-secondary btn-block mt-3" onClick={()=>{setAgentType(null);setAgentSteps([]);}}>← Back to Agents</button>}
          </>}
        </SlideOver>;

      // VALUATION
      case "valuation":
        return <SlideOver show={true} onClose={()=>{closeModal();setValResult(null);}} title="💷 Instant Valuation">
          <div className="text-sm text-muted mb-3">Enter your reg for a market-accurate valuation</div>
          <div className="flex gap-2 mb-4"><input className="input input-mono flex-1" placeholder="Enter reg (e.g. AB21 CDE)" value={valReg} onChange={e=>setValReg(e.target.value)}/><button className="btn btn-primary" onClick={doValuation}>Value</button></div>
          {valResult && <div className="fade-in">
            <div className="card mb-3" style={{background:"var(--primary-light)"}}>
              <div className="text-center"><div className="text-xs text-muted">Estimated Value</div><div style={{fontSize:28,fontWeight:800,color:"var(--primary)"}}>{fmt(valResult.low)} – {fmt(valResult.high)}</div><div className="text-xs text-muted mt-1">{valResult.car.year} {valResult.car.make} {valResult.car.model}</div></div>
            </div>
            {[{icon:"🏪",label:"Sell to Dealer",desc:"Get offers from multiple dealers"},{icon:"📱",label:"List on CarGPT",desc:"AI-assisted listing for private sale"},{icon:"🔄",label:"Part Exchange",desc:"Against a car you're buying"}].map((o,i)=><div key={i} className="card card-clickable mb-2"><div className="flex gap-3 items-center"><span style={{fontSize:20}}>{o.icon}</span><div><div className="text-sm font-bold">{o.label}</div><div className="text-xs text-muted">{o.desc}</div></div></div></div>)}
          </div>}
        </SlideOver>;

      // ULEZ
      case "ulez":
        return <SlideOver show={true} onClose={()=>{closeModal();setUlezResult(null);}} title="🌍 ULEZ Checker">
          <div className="text-sm text-muted mb-3">Enter a reg or tap a car to check</div>
          <div className="flex gap-2 mb-4"><input className="input input-mono flex-1" placeholder="Enter reg..." value={ulezReg} onChange={e=>setUlezReg(e.target.value)}/><button className="btn btn-primary" onClick={doUlezCheck}>Check</button></div>
          {ulezResult && <div className="card mb-3 fade-in" style={{background:ulezResult.ulezCompliant?"var(--success-light)":"var(--error-light)"}}>
            <div className="flex justify-between items-center mb-2"><div className="text-sm font-bold">{ulezResult.year} {ulezResult.make} {ulezResult.model}</div><span className={`badge ${ulezResult.ulezCompliant?"badge-green":"badge-red"}`}>{ulezResult.ulezCompliant?"✅ Compliant":"❌ Not Compliant"}</span></div>
            <div className="text-xs text-muted">{ulezResult.euroEmissions} · CO2: {ulezResult.co2}g/km</div>
            {!ulezResult.ulezCompliant&&<div className="text-xs text-error mt-2">Daily charge: £12.50 in London ULEZ zone</div>}
          </div>}
          <div className="label-sm">All Vehicles</div>
          {V.map(v=><div key={v.id} className="card card-clickable mb-2" onClick={()=>setUlezResult(v)}><div className="flex justify-between items-center"><div><div className="text-sm font-bold">{v.make} {v.model}</div><div className="text-xs text-muted">{v.euroEmissions} · CO2: {v.co2}g/km</div></div><span className={`badge ${v.ulezCompliant?"badge-green":"badge-red"}`}>{v.ulezCompliant?"✅":"❌"}</span></div></div>)}
        </SlideOver>;

      // REG LOOKUP
      case "reg":
        return <SlideOver show={true} onClose={()=>{closeModal();setRegResult(null);}} title="🔍 Reg Plate Lookup">
          <div className="flex gap-2 mb-4"><input className="input input-mono flex-1" placeholder="Enter reg..." value={regIn} onChange={e=>setRegIn(e.target.value)}/><button className="btn btn-primary" onClick={doRegLookup}>Look Up</button></div>
          {regResult && <div className="card fade-in">
            <div className="text-md font-bold">{regResult.year} {regResult.make} {regResult.model}</div>
            <div className="text-xs text-muted mb-3">{regResult.variant}</div>
            <div className="info-grid">{[{l:"Fuel",v:regResult.fuel},{l:"Engine",v:regResult.engineSize},{l:"Colour",v:regResult.colour},{l:"MOT",v:regResult.motExpiry},{l:"Tax",v:regResult.taxCost===0?"FREE":`£${regResult.taxCost}/yr`},{l:"ULEZ",v:regResult.ulezCompliant?"✅":"❌"}].map((s,i)=><div key={i} className="info-cell"><div className="info-val" style={{fontSize:13}}>{s.v}</div><div className="info-label">{s.l}</div></div>)}</div>
            <div className="flex gap-2 mt-3"><button className="btn btn-primary flex-1" onClick={()=>{setSel(regResult);closeModal();}}>View Details</button><button className="btn btn-outline flex-1" onClick={()=>{closeModal();openModal("finance");}}>💳 Finance</button></div>
          </div>}
        </SlideOver>;

      // NEGOTIATE
      case "negotiate":
        return <SlideOver show={true} onClose={closeModal} title="🤝 Negotiation Coach">
          {sel ? <>
            <div className="text-sm mb-3">{sel.make} {sel.model} at {fmt(sel.price)}</div>
            <div className="card mb-3" style={{background:"var(--primary-light)"}}>
              <div className="text-center"><div className="text-xs text-muted">Opening Offer</div><div style={{fontSize:28,fontWeight:800,color:"var(--primary)"}}>{fmt(Math.round(sel.price*0.94))}</div><div className="text-xs text-muted">Walk-away: {fmt(Math.round(sel.price*0.97))}</div></div>
            </div>
            <div className="label-sm">Talking Points</div>
            {[`Listed ${sel.daysListed} days — ${sel.daysListed>21?"more leverage":"less room"}.`,`${sel.mileage>30000?"Higher mileage = leverage":"Low mileage = less room"}.`,"Ask about upcoming price drops.","Say you're ready to buy today.","Request extras: warranty, floor mats, full tank."].map((t,i)=><div key={i} className="card mb-2 p-3"><div className="text-sm">💡 {t}</div></div>)}
            <button className="btn btn-primary btn-block mt-3" onClick={()=>{closeModal();openModal("agents");runAgent("negotiate");}}>🤖 Let AI Negotiate</button>
          </> : <div className="text-sm text-muted">Select a car first to get negotiation tips.</div>}
        </SlideOver>;

      // PART EXCHANGE
      case "partex":
        return <SlideOver show={true} onClose={()=>{closeModal();setPexResult(null);}} title="🔄 Part Exchange">
          <div className="text-sm text-muted mb-3">Get valuations from multiple dealers</div>
          <div className="flex gap-2 mb-4"><input className="input input-mono flex-1" placeholder="Reg (e.g. AB21 CDE)" value={pexReg} onChange={e=>setPexReg(e.target.value)}/><button className="btn btn-primary" onClick={doPartEx}>Value</button></div>
          {pexResult && <div className="fade-in">
            <div className="card mb-3" style={{background:"var(--primary-light)"}}><div className="text-center"><div style={{fontSize:28,fontWeight:800,color:"var(--primary)"}}>{fmt(pexResult.low)} – {fmt(pexResult.high)}</div><div className="text-xs text-muted mt-1">{pexResult.car.year} {pexResult.car.make} {pexResult.car.model}</div></div></div>
            <div className="label-sm">Dealer Offers</div>
            {D.slice(0,3).map((dl,i)=>{const offer=pexResult.mid+Math.round((i-1)*500);return(<div key={dl.id} className="card mb-2"><div className="flex justify-between items-center"><div><div className="text-sm font-bold">{dl.name}</div><div className="text-xs text-muted">{dl.location} · ⭐ {dl.rating}</div></div><div style={{textAlign:"right"}}><div className="text-md font-bold text-primary">{fmt(offer)}</div>{i===0&&<span className="badge badge-green">Best</span>}</div></div></div>);})}
          </div>}
        </SlideOver>;

      // MOT
      case "mot": {
        const v=motCar||sel||V[0];
        return <SlideOver show={true} onClose={closeModal} title={`🔧 MOT — ${v.make} ${v.model}`}>
          {(v.mot||[]).map((m,i)=><div key={i} className="card mb-3 fade-in"><div className="flex justify-between mb-2"><span className="text-sm font-bold">{m.date}</span><span className={`badge ${m.result==="Pass"?"badge-green":"badge-red"}`}>{m.result==="Pass"?"✅ Pass":"❌ Fail"}</span></div><div className="text-xs text-muted">Mileage: {m.mileage?.toLocaleString()}</div>{m.advisories?.length>0&&m.advisories.map((a,j)=><div key={j} className="mt-2" style={{padding:10,background:a.includes("major")?"var(--error-light)":"var(--warning-light)",borderRadius:8}}><div className="text-sm font-bold">{a.includes("major")?"❌":"⚠️"} {a.split("(")[0].trim()}</div><div className="text-xs text-muted mt-1">{a.includes("minor")?"Minor — keep an eye on it.":"Advisory — worth monitoring."}</div></div>)}</div>)}
          <div className="label-sm">Check Another</div>
          {V.filter(x=>x.id!==v.id).slice(0,3).map(v2=><div key={v2.id} className="card card-clickable mb-2" onClick={()=>setMotCar(v2)}><div className="text-sm font-bold">{v2.make} {v2.model}</div><div className="text-xs text-muted">MOT until {v2.motExpiry}</div></div>)}
        </SlideOver>;
      }

      // EV CALCULATOR
      case "ev":
        return <SlideOver show={true} onClose={closeModal} title="⚡ EV Calculator">
          <div className="text-sm text-muted mb-3">Should you go electric?</div>
          <div className="card mb-3"><div className="text-sm font-bold mb-2">Annual Savings vs Petrol</div>{[{l:"Fuel savings",v:"£1,200–1,800/yr"},{l:"Road tax",v:"£0 (save £165)"},{l:"ULEZ",v:"£0 (save £3,125/yr if daily)"},{l:"Maintenance",v:"30-40% lower"}].map((r,i)=><div key={i} className="flex justify-between" style={{padding:"6px 0"}}><span className="text-xs text-muted">{r.l}</span><span className="text-sm font-bold text-success">{r.v}</span></div>)}</div>
          <div className="label-sm">EVs in Stock</div>
          {V.filter(v=>v.fuel==="Electric").map(v=><div key={v.id} className="card card-clickable mb-2" onClick={()=>{setSel(v);closeModal();}}><div className="text-sm font-bold">{v.year} {v.make} {v.model}</div><div className="text-xs text-muted">{fmt(v.price)} · {v.specs.range||250}mi range</div></div>)}
          <div className="label-sm mt-3">Hybrids</div>
          {V.filter(v=>v.fuel==="Hybrid").map(v=><div key={v.id} className="card card-clickable mb-2" onClick={()=>{setSel(v);closeModal();}}><div className="text-sm font-bold">{v.year} {v.make} {v.model}</div><div className="text-xs text-muted">{fmt(v.price)} · {v.specs.fuelEconomy}mpg</div></div>)}
        </SlideOver>;

      // INSURANCE
      case "insurance":
        return <SlideOver show={true} onClose={closeModal} title="🛡️ Insurance Groups">
          <div className="text-sm text-muted mb-3">Compare insurance groups across all vehicles</div>
          {[...V].sort((a,b)=>a.insuranceGroup-b.insuranceGroup).map(v=><div key={v.id} className="card card-clickable mb-2" onClick={()=>{setSel(v);closeModal();}}><div className="flex justify-between items-center"><div><div className="text-sm font-bold">{v.make} {v.model}</div><div className="text-xs text-muted">{v.variant}</div></div><div style={{textAlign:"right"}}><div className="text-md font-bold">Group {v.insuranceGroup}</div><div className="text-xs text-muted">{v.insuranceGroup<=15?"🟢 Low":v.insuranceGroup<=25?"🟡 Medium":"🔴 High"}</div></div></div></div>)}
        </SlideOver>;

      // COSTS DASHBOARD
      case "costs": {
        const total=EXPENSES.reduce((a,m)=>a+m.fuel+m.insurance+m.tax+m.mot+m.service+m.parking+m.tolls+m.other,0);
        const annEst=Math.round(total*2);
        const cats=[{l:"⛽ Fuel",v:EXPENSES.reduce((a,m)=>a+m.fuel,0)},{l:"🛡️ Insurance",v:EXPENSES.reduce((a,m)=>a+m.insurance,0)},{l:"💰 Road Tax",v:EXPENSES.reduce((a,m)=>a+m.tax,0)},{l:"📋 MOT",v:EXPENSES.reduce((a,m)=>a+m.mot,0)},{l:"🔧 Service",v:EXPENSES.reduce((a,m)=>a+m.service,0)},{l:"🅿️ Parking",v:EXPENSES.reduce((a,m)=>a+m.parking,0)}];
        return <SlideOver show={true} onClose={closeModal} title="📊 Cost Dashboard">
          <div className="text-sm text-muted mb-3">{GARAGE[0].year} {GARAGE[0].make} {GARAGE[0].model}</div>
          <div className="card mb-3" style={{background:"var(--primary-light)"}}><div className="flex justify-between items-center"><div><div className="text-xs text-muted">6-Month Total</div><div style={{fontSize:24,fontWeight:800,color:"var(--primary)"}}>{fmt(total)}</div></div><div style={{textAlign:"right"}}><div className="text-xs text-muted">Est. Annual</div><div className="text-md font-bold">{fmt(annEst)}</div></div></div></div>
          <div className="label-sm">Breakdown</div>
          <div className="card mb-3">{cats.filter(c=>c.v>0).sort((a,b)=>b.v-a.v).map((c,i)=><div key={i}><div className="flex justify-between" style={{padding:"6px 0"}}><span className="text-xs">{c.l}</span><span className="text-xs font-bold">{fmt(c.v)}</span></div><div className="progress" style={{height:4,marginBottom:4}}><div className="progress-fill" style={{width:`${(c.v/cats[0].v)*100}%`}}/></div></div>)}</div>
          <div className="label-sm">Monthly Trend</div>
          <div className="card">{EXPENSES.map((m,i)=>{const t=m.fuel+m.insurance+m.tax+m.mot+m.service+m.parking+m.tolls+m.other;return(<div key={i} className="flex items-center" style={{padding:"6px 0"}}><span className="text-xs" style={{width:30}}>{m.month}</span><div style={{flex:1,margin:"0 8px"}}><div className="progress" style={{height:4,margin:0}}><div className="progress-fill" style={{width:`${(t/520)*100}%`}}/></div></div><span className="text-xs font-bold">{fmt(t)}</span></div>);})}</div>
        </SlideOver>;
      }

      // SERVICE
      case "service":
        return <SlideOver show={true} onClose={closeModal} title="🔧 Service History">
          <div className="text-sm text-muted mb-3">{GARAGE[0].year} {GARAGE[0].make} {GARAGE[0].model}</div>
          {GARAGE[0].services?.map((s,i)=><div key={i} className="card mb-2 fade-in"><div className="flex justify-between items-center"><div><div className="text-sm font-bold">{s.type}</div><div className="text-xs text-muted">{s.date} · {s.garage}</div></div><span className="text-sm font-bold">{fmt(s.cost)}</span></div></div>)}
          <div className="card mb-4" style={{background:"var(--primary-light)"}}><div className="text-xs text-muted">Total Spent</div><div className="text-md font-bold text-primary">{fmt(GARAGE[0].services?.reduce((a,s)=>a+s.cost,0)||0)}</div></div>
          <div className="label-sm">Book Next Service</div>
          {[{name:"Halfords Autocentre",price:"From £149",time:"2 days"},{name:"VW Main Dealer",price:"From £249",time:"5 days"},{name:"Kwik Fit",price:"From £129",time:"Same day"}].map((g,i)=><div key={i} className="card mb-2"><div className="flex justify-between items-center"><div><div className="text-sm font-bold">{g.name}</div><div className="text-xs text-muted">{g.price} · Available: {g.time}</div></div><button className="btn btn-primary btn-sm">Book</button></div></div>)}
        </SlideOver>;

      // COMPANY CAR TAX
      case "companycar": {
        const rate=bikSalary>=50271?0.40:0.20;
        return <SlideOver show={true} onClose={closeModal} title="🏢 Company Car Tax (BIK)">
          <div className="text-sm text-muted mb-3">Calculate Benefit in Kind tax</div>
          <div className="mb-3"><div className="text-xs text-muted mb-1">Salary: {fmt(bikSalary)}/yr ({rate===0.40?"Higher":"Basic"} rate: {Math.round(rate*100)}%)</div><input type="range" min={25000} max={120000} step={1000} value={bikSalary} onChange={e=>setBikSalary(+e.target.value)} style={{width:"100%"}}/></div>
          {bikCar&&<div className="card mb-3 fade-in" style={{background:"var(--primary-light)"}}><div className="text-sm font-bold mb-2">{bikCar.name}</div>{[{l:"P11D Value",v:fmt(bikCar.p11d)},{l:"BIK Rate",v:bikCar.bikRate+"%"},{l:"Taxable Benefit",v:fmt(Math.round(bikCar.p11d*bikCar.bikRate/100))+"/yr"}].map((r,i)=><div key={i} className="flex justify-between" style={{padding:"4px 0"}}><span className="text-xs text-muted">{r.l}</span><span className="text-xs font-bold">{r.v}</span></div>)}<div style={{borderTop:"1px solid var(--primary)",paddingTop:8,marginTop:4}} className="flex justify-between"><span className="text-sm font-bold">You Pay</span><span className="text-md font-bold text-primary">{fmt(Math.round(bikCar.p11d*bikCar.bikRate/100*rate))}/yr</span></div></div>}
          <div className="label-sm">Compare Vehicles</div>
          {BIK_DATA.map((c,i)=>{const tax=Math.round(c.p11d*c.bikRate/100*rate);return(<div key={i} className="card card-clickable mb-2" onClick={()=>setBikCar(c)}><div className="flex justify-between items-center"><div><div className="text-sm font-bold">{c.name}</div><div className="text-xs text-muted">{c.type} · CO2: {c.co2}g/km</div></div><div style={{textAlign:"right"}}><div className="text-sm font-bold" style={{color:tax<500?"var(--success)":tax<2000?"var(--warning)":"var(--error)"}}>{fmt(tax)}/yr</div></div></div></div>);})}
        </SlideOver>;
      }

      // ACCIDENT HELPER
      case "accident":
        return <SlideOver show={true} onClose={()=>{closeModal();setAccidentStep(0);}} title="🚨 Accident Helper">
          <div className="progress mb-3"><div className="progress-fill" style={{width:`${((accidentStep+1)/ACCIDENT_STEPS.length)*100}%`}}/></div>
          <div className="text-xs text-muted mb-3">Step {accidentStep+1} of {ACCIDENT_STEPS.length}</div>
          {(()=>{const s=ACCIDENT_STEPS[accidentStep];return(<div className="fade-in">
            <div className="card mb-3" style={{background:accidentStep===0?"var(--error-light)":"var(--primary-light)"}}>
              <div className="flex gap-3 items-center mb-3"><span style={{fontSize:28}}>{s.icon}</span><div className="text-md font-bold">{s.title}</div></div>
              {s.items.map((item,i)=><div key={i} className="flex gap-2 items-center" style={{padding:"8px 0",borderBottom:i<s.items.length-1?"1px solid var(--border-light)":"none"}}><span>☐</span><span className="text-sm">{item}</span></div>)}
            </div>
            {accidentStep<ACCIDENT_STEPS.length-1?<button className="btn btn-primary btn-block" onClick={()=>setAccidentStep(accidentStep+1)}>{s.action} →</button>:
              <div><div className="label-sm">Emergency Contacts</div>{[{icon:"🚔",name:"Police",num:"101"},{icon:"🚑",name:"Emergency",num:"999"},{icon:"📞",name:"Your Insurer",num:"Check policy"},{icon:"🚗",name:"RAC",num:"0330 159 1111"},{icon:"🔧",name:"AA",num:"0800 887 766"}].map((c,i)=><div key={i} className="card mb-2"><div className="flex justify-between items-center"><div className="flex gap-2 items-center"><span>{c.icon}</span><span className="text-sm font-bold">{c.name}</span></div><span className="text-sm font-bold text-primary">{c.num}</span></div></div>)}</div>
            }
            {accidentStep>0&&<button className="btn btn-secondary btn-block mt-2" onClick={()=>setAccidentStep(accidentStep-1)}>← Previous step</button>}
          </div>);})()}
        </SlideOver>;

      // WARNING LIGHTS
      case "warning":
        return <SlideOver show={true} onClose={()=>{closeModal();setWarningResult(null);}} title="⚠️ Warning Light Decoder">
          {warningResult ? <div className="fade-in">
            <button className="btn btn-secondary btn-sm mb-3" onClick={()=>setWarningResult(null)}>← All Lights</button>
            <div className="card mb-3" style={{background:warningResult.severity==="Critical"?"var(--error-light)":"var(--warning-light)"}}>
              <div className="flex gap-3 items-center mb-3"><span style={{fontSize:32}}>{warningResult.icon}</span><div><div className="text-sm font-bold">{warningResult.name}</div><span className={`badge ${warningResult.severity==="Critical"?"badge-red":"badge-yellow"}`}>{warningResult.severity}</span></div></div>
              <div className="label-sm" style={{margin:"8px 0 4px"}}>What It Means</div><div className="text-sm mb-2">{warningResult.meaning}</div>
              <div className="label-sm" style={{margin:"8px 0 4px"}}>What To Do</div><div className="text-sm font-bold mb-2" style={{color:warningResult.severity==="Critical"?"var(--error)":"inherit"}}>{warningResult.action}</div>
              <div className="label-sm" style={{margin:"8px 0 4px"}}>Estimated Cost</div><div className="text-sm font-bold text-primary">{warningResult.cost}</div>
            </div>
            <button className="btn btn-primary btn-block" onClick={()=>{closeModal();sendChat(`My ${GARAGE[0].make} ${GARAGE[0].model} ${warningResult.name} warning light is on. What should I do?`);}}>🤖 Ask AI for Help</button>
          </div> : <>
            <div className="text-sm text-muted mb-3">Identify any dashboard warning light</div>
            {WARNING_LIGHTS.map((w,i)=><div key={i} className="card card-clickable mb-2" onClick={()=>setWarningResult(w)}><div className="flex justify-between items-center"><div className="flex gap-3 items-center"><span style={{fontSize:20}}>{w.icon}</span><div><div className="text-sm font-bold">{w.name}</div><div className="text-xs text-muted">{w.action.substring(0,40)}...</div></div></div><span className={`badge ${w.severity==="Critical"?"badge-red":"badge-yellow"}`}>{w.severity}</span></div></div>)}
          </>}
        </SlideOver>;

      // JOURNEY COSTS
      case "journey":
        return <SlideOver show={true} onClose={()=>{closeModal();setJourneyResult(null);}} title="🗺️ Journey Cost Calculator">
          <div className="text-sm text-muted mb-3">Calculate the true cost of any journey</div>
          <input className="input mb-2" placeholder="From (e.g. London SW1)" value={journeyFrom} onChange={e=>setJourneyFrom(e.target.value)}/>
          <input className="input mb-3" placeholder="To (e.g. Birmingham B1)" value={journeyTo} onChange={e=>setJourneyTo(e.target.value)}/>
          <button className="btn btn-primary btn-block mb-4" onClick={doJourney}>Calculate Cost</button>
          {journeyResult&&<div className="fade-in"><div className="card mb-3" style={{background:"var(--primary-light)"}}><div className="text-center"><div className="text-xs text-muted">Total Journey Cost</div><div style={{fontSize:28,fontWeight:800,color:"var(--primary)"}}>£{journeyResult.total.toFixed(2)}</div><div className="text-xs text-muted">{journeyResult.dist} miles · ~{journeyResult.time} mins</div></div></div>
            <div className="card">{[{l:"⛽ Fuel",v:`£${journeyResult.fuel.toFixed(2)}`},{l:"🅿️ Parking",v:`£${journeyResult.park}`},journeyResult.tolls&&{l:`🛣️ ${journeyResult.tolls.name}`,v:`£${journeyResult.tolls.cost.toFixed(2)}`},journeyResult.cong>0&&{l:"🚦 Congestion",v:`£${journeyResult.cong}`},journeyResult.ulez>0&&{l:"🌍 ULEZ",v:`£${journeyResult.ulez}`}].filter(Boolean).map((r,i)=><div key={i} className="flex justify-between" style={{padding:"6px 0"}}><span className="text-xs text-muted">{r.l}</span><span className="text-sm font-bold">{r.v}</span></div>)}</div>
          </div>}
        </SlideOver>;

      // FINES & LEGAL
      case "fines":
        return <SlideOver show={true} onClose={()=>{closeModal();setFineType(null);}} title="📋 Fines & Legal">
          {!fineType ? <>
            {[{key:"pcn",icon:"🅿️",name:"Parking Fine Appeal",desc:"AI drafts your appeal letter"},{key:"speed",icon:"📸",name:"Speeding Ticket Advisor",desc:"Options: accept, course, or challenge"},{key:"points",icon:"🔴",name:"Points Tracker",desc:"Track points & when they expire"},{key:"law",icon:"⚖️",name:"Motoring Law Guide",desc:"Plain English UK driving law"}].map(f=>
              <div key={f.key} className="card card-clickable mb-2" onClick={()=>setFineType(f.key)}><div className="flex gap-3 items-center"><span style={{fontSize:24}}>{f.icon}</span><div><div className="text-sm font-bold">{f.name}</div><div className="text-xs text-muted">{f.desc}</div></div></div></div>
            )}
          </> : <div>
            <button className="btn btn-secondary btn-sm mb-3" onClick={()=>setFineType(null)}>← Back</button>
            {fineType==="pcn"&&<><div className="text-md font-bold mb-3">🅿️ Parking Fine Appeal</div><div className="card mb-3"><div className="text-sm font-bold mb-2">Common winning grounds:</div>{["Signage not clearly visible","Pay & display machine faulty","Loading/unloading within time","Grace period not given (10 min rule)","PCN not issued correctly"].map((g,i)=><div key={i} className="flex gap-2 items-center" style={{padding:"4px 0"}}><span className="text-xs">✅</span><span className="text-xs">{g}</span></div>)}</div><button className="btn btn-primary btn-block" onClick={()=>{closeModal();sendChat("I received a parking fine and want to appeal. Can you help?");}}>🤖 Start AI Appeal</button></>}
            {fineType==="speed"&&<><div className="text-md font-bold mb-3">📸 Speeding Ticket Advisor</div><div className="card mb-3">{[{s:"1-9mph over",p:"3 pts",f:"£100",c:"✅ Course eligible"},{s:"10-20mph over",p:"3-6 pts",f:"£100-£500",c:"❌ No course"},{s:"21-30mph over",p:"4-6 pts",f:"£500+",c:"❌ No course"},{s:"30+ over",p:"6 pts",f:"£1,000+",c:"❌ Ban likely"}].map((b,i)=><div key={i} className="flex justify-between" style={{padding:"8px 0",borderBottom:i<3?"1px solid var(--border-light)":"none"}}><span className="text-xs">{b.s}</span><span className="text-xs">{b.p} · {b.f}</span><span className="text-xs">{b.c}</span></div>)}</div></>}
            {fineType==="points"&&<><div className="text-md font-bold mb-3">🔴 Points Tracker</div><div className="card mb-3 text-center" style={{background:"var(--primary-light)"}}><div className="text-xs text-muted">Your Points</div><div style={{fontSize:36,fontWeight:800,color:"var(--primary)"}}>3</div><div className="text-xs text-muted">of 12 (ban threshold)</div><div className="progress mt-2"><div className="progress-fill" style={{width:"25%",background:"var(--success)"}}/></div></div></>}
            {fineType==="law"&&<><div className="text-md font-bold mb-3">⚖️ Motoring Law</div>{["Can I use my phone at a red light?","What's the drink drive limit?","Are dashcams legal?","Can I eat while driving?","Do I need to carry my licence?"].map((q,i)=><div key={i} className="card card-clickable mb-2" onClick={()=>{closeModal();sendChat(q);}}><div className="text-sm">{q}</div></div>)}</>}
          </div>}
        </SlideOver>;

      // THEORY TEST
      case "theory":
        return <SlideOver show={true} onClose={()=>{closeModal();setTheoryScore(null);setTheoryQ(0);}} title="📝 Theory Test Prep">
          {theoryScore!==null ? <div className="fade-in text-center">
            <div className="card mb-3" style={{background:theoryScore>=3?"var(--success-light)":"var(--error-light)",padding:24}}>
              <div style={{fontSize:48}}>{theoryScore>=3?"🎉":"😕"}</div>
              <div className="text-lg font-extra mt-2">{theoryScore}/{THEORY_QS.length} Correct</div>
              <div className="text-sm text-muted">{theoryScore>=3?"Great! You're on track.":"Keep practising."}</div>
            </div>
            <button className="btn btn-primary btn-block" onClick={()=>{setTheoryScore(null);setTheoryQ(0);}}>Try Again</button>
          </div> : theoryQ<THEORY_QS.length ? <div className="fade-in">
            <div className="progress mb-2"><div className="progress-fill" style={{width:`${(theoryQ/THEORY_QS.length)*100}%`}}/></div>
            <div className="text-xs text-muted mb-3">Question {theoryQ+1} of {THEORY_QS.length}</div>
            <div className="card mb-3"><div className="text-sm font-bold">{THEORY_QS[theoryQ].q}</div></div>
            {THEORY_QS[theoryQ].opts.map((o,i)=><button key={i} className="card card-clickable mb-2 w-full" style={{textAlign:"left"}} onClick={()=>{const correct=i===THEORY_QS[theoryQ].correct;if(theoryQ>=THEORY_QS.length-1){setTheoryScore((theoryScore||0)+(correct?1:0));}else{if(correct)setTheoryScore(s=>(s||0)+1);setTheoryQ(theoryQ+1);}}}><div className="text-sm">{o}</div></button>)}
          </div> : null}
        </SlideOver>;

      // DEALER CHAT
      case "dealer-chat":
        return <SlideOver show={true} onClose={()=>{closeModal();setShowDChat(false);setActiveConvoId(null);setInboxOpen(false);}} title={inboxOpen?"💬 Messages":dCtx?`💬 ${dCtx.dealer?.name}`:"💬 Dealer"}>
          {/* Inbox Toggle */}
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <button className={`filter-chip ${!inboxOpen?"active":""}`} onClick={()=>setInboxOpen(false)} style={{flex:1,textAlign:"center"}}>Chat</button>
            <button className={`filter-chip ${inboxOpen?"active":""}`} onClick={()=>{setInboxOpen(true);loadConversations();}} style={{flex:1,textAlign:"center",position:"relative"}}>
              Inbox {conversations.filter(c=>c.user_unread_count>0).length>0 && <span style={{width:8,height:8,borderRadius:"50%",background:"#DC2626",display:"inline-block",marginLeft:4}}/>}
            </button>
          </div>

          {inboxOpen ? (
            /* ── INBOX VIEW ── */
            <div>
              {conversations.length === 0 ? (
                <div className="text-center" style={{padding:40}}>
                  <div style={{fontSize:36,marginBottom:8}}>💬</div>
                  <div className="text-sm text-muted">No conversations yet. Message a dealer to get started.</div>
                </div>
              ) : conversations.map(c => {
                const dl = D.find(d=>d.id===c.dealer_id) || D[0];
                const v = c.vehicle_id ? V.find(x=>x.id===c.vehicle_id) : null;
                const timeAgo = c.updated_at ? (() => {
                  const diff = Date.now() - new Date(c.updated_at).getTime();
                  if (diff < 60000) return "just now";
                  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
                  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
                  return `${Math.floor(diff/86400000)}d ago`;
                })() : "";
                return (
                  <div key={c.id} onClick={async ()=>{
                    setInboxOpen(false);
                    if(v) setDCtx({vehicleId:v.id,flow:"general",vehicle:v,dealer:dl});
                    setActiveConvoId(c.id);
                    // Load messages
                    const mr = await fetch(`/api/conversations?id=${c.id}`);
                    const data = await mr.json();
                    if(data.messages) setDMsgs(data.messages.map(m=>({id:m.id,role:m.sender_type==="user"?"user":"bot",text:m.content,time:m.created_at})));
                    // Mark read
                    fetch("/api/conversations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"mark_read",conversation_id:c.id})});
                  }} style={{
                    display:"flex",gap:12,padding:"14px 0",borderBottom:"1px solid var(--border-light)",
                    cursor:"pointer",transition:"background 0.15s",alignItems:"center"
                  }}>
                    <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,var(--primary),#1a5cd6)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:15,flexShrink:0}}>
                      {dl?.name?.charAt(0)||"D"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div className="text-sm font-bold" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dl?.name||"Dealer"}</div>
                        <span className="text-xs text-muted" style={{flexShrink:0,marginLeft:8}}>{timeAgo}</span>
                      </div>
                      {v && <div className="text-xs text-muted">{v.year} {v.make} {v.model}</div>}
                      <div className="text-xs text-muted" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2,opacity:0.7}}>
                        {c.last_message_preview || "No messages yet"}
                      </div>
                    </div>
                    {c.user_unread_count > 0 && <div style={{width:20,height:20,borderRadius:"50%",background:"var(--primary)",color:"white",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{c.user_unread_count}</div>}
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── CHAT VIEW ── */
            <>
              {/* Vehicle context bar */}
              {dCtx?.vehicle && (
                <div style={{display:"flex",gap:10,padding:"10px 12px",background:"#F8F9FA",borderRadius:10,marginBottom:12,alignItems:"center"}}>
                  <div style={{width:48,height:36,borderRadius:6,overflow:"hidden",background:"#E5E7EB",flexShrink:0}}>
                    <img src={carImg(dCtx.vehicle.make,dCtx.vehicle.model,dCtx.vehicle.year)} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="text-xs font-bold" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dCtx.vehicle.year} {dCtx.vehicle.make} {dCtx.vehicle.model}</div>
                    <div className="text-xs text-muted">{fmt(dCtx.vehicle.price)} · {fmtMi(dCtx.vehicle.mileage)}</div>
                  </div>
                  <div className="text-xs" style={{color:"#059669",fontWeight:600}}>● Online</div>
                </div>
              )}
              <div style={{minHeight:300,maxHeight:400,overflowY:"auto"}}>
                {dMsgs.map((m,i)=>{
                  const msgTime = m.time ? new Date(m.time).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}) : "";
                  return (
                    <div key={m.id||i} className={`chat-msg ${m.role==="user"?"user":""} fade-in`} style={{marginBottom:8}}>
                      <div className="chat-bubble">{m.text}</div>
                      {msgTime && <div style={{fontSize:10,color:"var(--text-muted)",marginTop:2,textAlign:m.role==="user"?"right":"left",opacity:0.6}}>{msgTime}</div>}
                      {m.quickReplies&&<div className="chat-quick-replies">{m.quickReplies.map((qr,j)=><button key={j} className="chat-qr" onClick={()=>sendDMsg(qr)}>{qr}</button>)}</div>}
                    </div>
                  );
                })}
                {dTyping&&<div className="chat-msg fade-in"><div className="chat-bubble"><div className="typing-dots"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div></div></div>}
                <div ref={dRef}/>
              </div>
              <div className="flex gap-2 mt-3">
                <input className={`input flex-1${voiceActive==="dealer"?" voice-listening":""}`} value={dIn} onChange={e=>setDIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){if(voiceActive)stopVoice();sendDMsg(dIn);}}} placeholder={voiceActive==="dealer"?"🎙️ Listening...":"Type a message..."}/>
                <button className={`btn-mic${voiceActive==="dealer"?" active":""}`} onClick={()=>startVoice("dealer")} title="Voice input">{voiceActive==="dealer"?"⏹":"🎙️"}</button>
                <button className="btn btn-primary" onClick={()=>{if(voiceActive)stopVoice();sendDMsg(dIn);}}>Send</button>
              </div>
            </>
          )}
        </SlideOver>;

      // SIMPLE PLACEHOLDER MODALS FOR REMAINING TOOLS
      case "fuel": case "speed": case "parking": case "roadtrip": case "weather":
      case "instructor": case "firstcar": case "carwash": case "tyres": case "garagefinder": case "diy": case "parts":
        const titles = {fuel:"⛽ Fuel Prices",speed:"📸 Speed Cameras",parking:"🅿️ Parking Helper",roadtrip:"🛣️ Road Trip Planner",weather:"🌧️ Weather Alerts",instructor:"👨‍🏫 Find Instructor",firstcar:"🔰 First Car Guide",carwash:"🧽 Car Wash Finder",tyres:"🔵 Tyre Finder",garagefinder:"🔧 Garage Finder",diy:"🛠️ DIY Guides",parts:"📦 Parts Prices"};
        return <SlideOver show={true} onClose={closeModal} title={titles[activeModal]||"Tool"}>
          <div className="text-center" style={{padding:40}}>
            <div style={{fontSize:48,marginBottom:12}}>🔧</div>
            <div className="text-md font-bold mb-2">{titles[activeModal]}</div>
            <div className="text-sm text-muted mb-4">This tool is available in the full CarGPT app.</div>
            <button className="btn btn-primary" onClick={()=>{closeModal();sendChat(`Tell me about ${titles[activeModal]?.replace(/[^\w\s]/g,"")}`);}}>🤖 Ask AI Instead</button>
          </div>
        </SlideOver>;

      default: return null;
    }
  };

  // ═══ RENDER: AUTH MODAL ═══
  const [aEmail, setAEmail] = useState("");
  const [aPass, setAPass] = useState("");
  const [aName, setAName] = useState("");
  const [showPass, setShowPass] = useState(false);

  const authSubmit = async () => {
    const isSignup = authModal === "signup";
    if (isSignup) {
      await authAction("signup", aEmail, aPass, aName);
    } else {
      await authAction("login", aEmail, aPass);
    }
  };

  const SB_URL = "https://ugknhpkvjlaixzopckxr.supabase.co";
  const googleLogin = () => {
    const redirect = window.location.origin + "/api/auth/callback";
    window.location.href = `${SB_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirect)}`;
  };
  const appleLogin = () => {
    const redirect = window.location.origin + "/api/auth/callback";
    window.location.href = `${SB_URL}/auth/v1/authorize?provider=apple&redirect_to=${encodeURIComponent(redirect)}`;
  };

  // ═══ MAIN RENDER ═══
  return (
    <>
      <style>{css}</style>
      {Navbar()}
      <div className="app-layout">
        <div className="main-content">
          {sel ? DetailPage() :
            page==="home" ? HomePage() :
            page==="search" ? SearchPage() :
            page==="favourites" ? FavouritesPage() :
            page==="messages" ? MessagesPage() :
            page==="garage" ? GaragePage() :
            page==="profile" ? ProfilePage() : HomePage()
          }
        </div>
      </div>

      {/* Tools Sidebar */}
      {ToolsSidebar()}

      {/* Notification Panel */}
      {NotifPanel()}

      {/* AI Chat */}
      {/* AI Chat — always mounted, toggled with display */}
      <div className="chat-panel" style={{display:chatOpen?"flex":"none"}}>
        <div className="chat-header">
          <div className="chat-header-title"><span className="chat-header-dot"/> CarGPT AI</div>
          <button className="chat-close" onClick={()=>setChatOpen(false)}>✕</button>
        </div>
        <div className="chat-messages">
          {msgs.map((m,i) => (
            <div key={i} className={`chat-msg ${m.role==="user"?"user":""}`}>
              <div className="chat-bubble">{m.text}</div>
              {m.vehicles && <div className="chat-cars">{m.vehicles.map(v =>
                <div key={v.id} className="chat-car-card" onClick={()=>{setSel(v);setChatOpen(false);}}>
                  <div style={{width:48,height:36,borderRadius:6,overflow:"hidden",background:"#F3F4F6",marginBottom:4}}><img src={carImg(v.make,v.model,v.year)} alt={v.make} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
                  <div className="text-xs font-bold">{v.year} {v.make} {v.model}</div>
                  <div className="text-sm font-extra text-primary">{fmt(v.price)}</div>
                  <div className="text-xs text-muted">{fmtMi(v.mileage)} · {v.fuel}</div>
                </div>
              )}</div>}
              {m.quickReplies && <div className="chat-quick-replies">{m.quickReplies.map((qr,j) =>
                <button key={j} className="chat-qr" onClick={()=>sendChat(qr)}>{qr}</button>
              )}</div>}
            </div>
          ))}
          {typing && <div className="chat-msg fade-in"><div className="chat-bubble"><div className="typing-dots"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div></div></div>}
          <div ref={chatRef}/>
        </div>
        <div className="chat-input-area">
          <input className={`chat-input${voiceActive==="main"?" voice-listening":""}`} placeholder={voiceActive==="main"?"🎙️ Listening...":"Ask CarGPT anything..."}
            value={chatIn} onChange={e=>setChatIn(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"){if(voiceActive)stopVoice();sendChat(chatIn);}}}/>
          <button className={`btn-mic chat-mic${voiceActive==="main"?" active":""}`} onClick={()=>startVoice("main")} title="Voice input">{voiceActive==="main"?"⏹":"🎙️"}</button>
          <button className="chat-send" onClick={()=>{if(voiceActive)stopVoice();sendChat(chatIn);}}>↑</button>
        </div>
      </div>
      {!chatOpen &&
        <button className="chat-fab" onClick={()=>setChatOpen(true)} title="Ask CarGPT AI">✨</button>
      }

      {/* Active Modal */}
      {renderModalContent()}

      {/* Auth Modal — inlined to prevent re-mount on keystroke */}
      {authModal && (
        <div className="modal-overlay" style={{zIndex:10000}} onClick={()=>{setAuthModal(null);setAuthError("");setAEmail("");setAPass("");setAName("");}}>
          <div style={{
            background:"white",borderRadius:20,width:"100%",maxWidth:440,padding:0,
            boxShadow:"0 25px 60px rgba(0,0,0,0.3)",overflow:"hidden",animation:"slideUp 0.3s ease"
          }} onClick={e=>e.stopPropagation()}>
            {/* Header */}
            <div style={{padding:"32px 32px 0",textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:800,marginBottom:4}}>
                Car<span style={{color:"var(--primary)"}}>GPT</span>
              </div>
              <div style={{fontSize:18,fontWeight:700,marginTop:12}}>
                {authModal==="signup" ? "Create your account" : "Welcome back"}
              </div>
              <div style={{fontSize:14,color:"var(--text-muted)",marginTop:4}}>
                {authModal==="signup" ? "Join 50,000+ smart car buyers" : "Log in to access your saved cars"}
              </div>
            </div>

            <div style={{padding:"24px 32px 32px"}}>
              {/* Social OAuth Buttons */}
              <button onClick={googleLogin} style={{
                width:"100%",padding:"12px",borderRadius:12,border:"1.5px solid var(--border-light)",
                background:"white",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",
                alignItems:"center",justifyContent:"center",gap:10,marginBottom:10,transition:"all 0.2s"
              }}
                onMouseEnter={e=>e.currentTarget.style.background="#F9FAFB"}
                onMouseLeave={e=>e.currentTarget.style.background="white"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>

              <button onClick={appleLogin} style={{
                width:"100%",padding:"12px",borderRadius:12,border:"1.5px solid var(--border-light)",
                background:"#000",color:"white",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",
                alignItems:"center",justifyContent:"center",gap:10,marginBottom:16,transition:"all 0.2s"
              }}>
                <svg width="16" height="18" viewBox="0 0 16 20" fill="white"><path d="M13.54 10.68c-.02-2.17 1.77-3.22 1.85-3.27-1.01-1.47-2.58-1.67-3.14-1.7-1.33-.14-2.61.79-3.28.79-.68 0-1.73-.77-2.84-.75-1.46.02-2.81.85-3.56 2.16-1.52 2.64-.39 6.55 1.09 8.7.73 1.05 1.59 2.23 2.73 2.19 1.09-.05 1.51-.71 2.83-.71 1.32 0 1.7.71 2.84.68 1.18-.02 1.93-1.07 2.65-2.13.83-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.32-3.5zM11.35 3.95c.6-.74 1.01-1.76.9-2.78-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.96-.49 2.56-1.21z"/></svg>
                Continue with Apple
              </button>

              {/* Divider */}
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{flex:1,height:1,background:"var(--border-light)"}}/>
                <span style={{fontSize:12,color:"var(--text-muted)"}}>or continue with email</span>
                <div style={{flex:1,height:1,background:"var(--border-light)"}}/>
              </div>

              {/* Email/Password Form */}
              {authModal==="signup" && (
                <div style={{marginBottom:16}}>
                  <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6,color:"var(--text-secondary)"}}>Full name</label>
                  <input
                    type="text" value={aName} onChange={e=>setAName(e.target.value)}
                    placeholder="John Smith"
                    style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid var(--border-light)",fontSize:15,outline:"none",transition:"border 0.2s",boxSizing:"border-box"}}
                    onFocus={e=>e.target.style.borderColor="var(--primary)"}
                    onBlur={e=>e.target.style.borderColor="var(--border-light)"}
                  />
                </div>
              )}
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6,color:"var(--text-secondary)"}}>Email address</label>
                <input
                  type="email" value={aEmail} onChange={e=>setAEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid var(--border-light)",fontSize:15,outline:"none",transition:"border 0.2s",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor="var(--primary)"}
                  onBlur={e=>e.target.style.borderColor="var(--border-light)"}
                  onKeyDown={e=>{if(e.key==="Enter") authSubmit();}}
                />
              </div>
              <div style={{marginBottom:20}}>
                <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6,color:"var(--text-secondary)"}}>Password</label>
                <div style={{position:"relative"}}>
                  <input
                    type={showPass?"text":"password"} value={aPass} onChange={e=>setAPass(e.target.value)}
                    placeholder={authModal==="signup"?"Create a password (min 6 chars)":"Enter your password"}
                    style={{width:"100%",padding:"12px 44px 12px 14px",borderRadius:10,border:"1.5px solid var(--border-light)",fontSize:15,outline:"none",transition:"border 0.2s",boxSizing:"border-box"}}
                    onFocus={e=>e.target.style.borderColor="var(--primary)"}
                    onBlur={e=>e.target.style.borderColor="var(--border-light)"}
                    onKeyDown={e=>{if(e.key==="Enter") authSubmit();}}
                  />
                  <button onClick={()=>setShowPass(!showPass)} style={{
                    position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text-muted)"
                  }}>{showPass?"🙈":"👁️"}</button>
                </div>
              </div>

              {authError && (
                <div style={{
                  padding:"10px 14px",borderRadius:10,marginBottom:16,fontSize:13,fontWeight:500,
                  background:"#FEF2F2",color:"#DC2626",border:"1px solid #FECACA"
                }}>⚠️ {authError}</div>
              )}

              <button
                onClick={authSubmit}
                disabled={authBusy || !aEmail || !aPass || (authModal==="signup" && !aName)}
                style={{
                  width:"100%",padding:"14px",borderRadius:12,border:"none",
                  background: (authBusy || !aEmail || !aPass) ? "#E5E7EB" : "var(--primary)",
                  color: (authBusy || !aEmail || !aPass) ? "#9CA3AF" : "white",
                  fontSize:15,fontWeight:700,cursor: (authBusy || !aEmail || !aPass) ? "not-allowed" : "pointer",
                  transition:"all 0.2s"
                }}
              >
                {authBusy ? "Please wait..." : authModal==="signup" ? "Create account" : "Log in"}
              </button>

              {/* Toggle login/signup */}
              <div style={{textAlign:"center",fontSize:14,marginTop:20}}>
                <span style={{color:"var(--text-muted)"}}>
                  {authModal==="signup" ? "Already have an account? " : "Don't have an account? "}
                </span>
                <button
                  onClick={()=>{setAuthModal(authModal==="signup"?"login":"signup");setAuthError("");}}
                  style={{background:"none",border:"none",color:"var(--primary)",fontWeight:700,cursor:"pointer",fontSize:14}}
                >
                  {authModal==="signup" ? "Log in" : "Sign up free"}
                </button>
              </div>

              {authModal==="signup" && (
                <div style={{textAlign:"center",fontSize:11,color:"var(--text-muted)",marginTop:12}}>
                  By signing up, you agree to CarGPT's Terms of Service and Privacy Policy
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="modal-overlay" style={{zIndex:10000}} onClick={()=>setReviewModal(false)}>
          <div style={{background:"white",borderRadius:20,width:"100%",maxWidth:480,padding:32,boxShadow:"0 25px 60px rgba(0,0,0,0.3)",animation:"slideUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
            {reviewSubmitted ? (
              <div className="text-center fade-in">
                <div style={{fontSize:48,marginBottom:12}}>🎉</div>
                <div className="text-lg font-extra mb-2">Thank you!</div>
                <div className="text-sm text-muted mb-4">Your review has been submitted and will appear after verification.</div>
                <button className="btn btn-primary" onClick={()=>setReviewModal(false)}>Done</button>
              </div>
            ) : (<>
              <div className="text-lg font-extra mb-1">Write a Review</div>
              <div className="text-sm text-muted mb-4">Share your experience with this dealer</div>
              <div className="label-sm">Your Rating</div>
              <div style={{display:"flex",gap:6,marginBottom:20}}>
                {[1,2,3,4,5].map(s=>(
                  <button key={s} onClick={()=>setReviewStars(s)} style={{
                    fontSize:32,background:"none",border:"none",cursor:"pointer",
                    color:s<=reviewStars?"#FBBF24":"#D1D5DB",transition:"transform 0.15s",
                    transform:s<=reviewStars?"scale(1.1)":"scale(1)"
                  }}>★</button>
                ))}
                <span className="text-sm text-muted" style={{alignSelf:"center",marginLeft:8}}>
                  {reviewStars===0?"":reviewStars===1?"Poor":reviewStars===2?"Fair":reviewStars===3?"Average":reviewStars===4?"Good":"Excellent"}
                </span>
              </div>
              <div className="label-sm">Your Review</div>
              <textarea
                value={reviewText} onChange={e=>setReviewText(e.target.value)}
                placeholder="Tell others about your experience buying from this dealer..."
                style={{width:"100%",height:120,padding:14,borderRadius:10,border:"1.5px solid var(--border-light)",fontSize:14,resize:"vertical",fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor="var(--primary)"}
                onBlur={e=>e.target.style.borderColor="var(--border-light)"}
              />
              <div className="text-xs text-muted" style={{marginTop:6,marginBottom:16}}>{reviewText.length}/500 characters</div>
              <div style={{display:"flex",gap:10}}>
                <button className="btn btn-secondary flex-1" onClick={()=>setReviewModal(false)}>Cancel</button>
                <button className="btn btn-primary flex-1" disabled={!reviewStars||!reviewText.trim()}
                  onClick={()=>setReviewSubmitted(true)}
                  style={{opacity:(!reviewStars||!reviewText.trim())?0.5:1}}
                >Submit Review</button>
              </div>
            </>)}
          </div>
        </div>
      )}
    </>
  );
}
