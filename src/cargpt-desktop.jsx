import React, { useState, useRef, useEffect, useCallback } from "react";

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
  --text-muted: #9CA3AF;
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
  --card-bg: #FFFFFF;
  --input-bg: #FFFFFF;
  --modal-bg: #FFFFFF;
  --overlay-bg: rgba(0,0,0,0.5);
  --skeleton: #E5E7EB;
  --badge-muted-bg: #F3F4F6;
  --badge-muted-text: #6B7280;
}

/* ═══ DARK MODE ═══ */
.dark {
  --bg: #0F1117;
  --surface: #1A1D27;
  --surface-hover: #242836;
  --border: #2A2E3B;
  --border-light: #1F2330;
  --text: #E8ECF0;
  --text-secondary: #9CA3AF;
  --text-tertiary: #6B7280;
  --text-muted: #6B7280;
  --primary: #3B82F6;
  --primary-light: rgba(59,130,246,0.12);
  --primary-dark: #60A5FA;
  --success: #10B981;
  --success-light: rgba(16,185,129,0.12);
  --warning: #F59E0B;
  --warning-light: rgba(245,158,11,0.12);
  --error: #EF4444;
  --error-light: rgba(239,68,68,0.12);
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.2);
  --shadow: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2);
  --shadow-lg: 0 8px 30px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.2);
  --shadow-xl: 0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3);
  --card-bg: #1A1D27;
  --input-bg: #242836;
  --modal-bg: #1A1D27;
  --overlay-bg: rgba(0,0,0,0.7);
  --skeleton: #2A2E3B;
  --badge-muted-bg: #242836;
  --badge-muted-text: #9CA3AF;
}
.dark body, .dark { background:var(--bg); color:var(--text); }
.dark .card, .dark .detail-price-card { background:var(--card-bg); border-color:var(--border); }
.dark input, .dark select, .dark textarea, .dark .input { background:var(--input-bg); color:var(--text); border-color:var(--border); }
.dark .input:focus, .dark input:focus, .dark select:focus { border-color:var(--primary); }
.dark .btn-outline { border-color:var(--border); color:var(--text); }
.dark .btn-outline:hover { background:var(--surface-hover); }
.dark .btn-secondary { background:var(--surface-hover); color:var(--text); }
.dark .modal-overlay { background:var(--overlay-bg); }
.dark .slide-over { background:var(--modal-bg); }
.dark .slide-header { background:var(--modal-bg); border-color:var(--border); }
.dark .navbar { background:var(--surface); border-color:var(--border); }
.dark .bottom-nav { background:var(--surface); border-color:var(--border); }
.dark .filter-select { background:var(--input-bg); color:var(--text); border-color:var(--border); }
.dark .filter-pill { background:var(--surface); color:var(--text); border-color:var(--border); }
.dark .filter-pill:hover { border-color:var(--text-tertiary); }
.dark .fp-row { border-color:var(--border); }
.dark .fp-row:hover { background:var(--surface-hover); }
.dark .fp-option { background:var(--surface); color:var(--text); border-color:var(--border); }
.dark .fp-option:hover { border-color:var(--text-tertiary); }
.dark .filter-tag { background:var(--primary-light); color:var(--primary-dark); }
.dark .tabs { border-color:var(--border); }
.dark .tab-btn { color:var(--text-tertiary); }
.dark .tab-btn.active { color:var(--primary); border-color:var(--primary); }
.dark .info-cell { background:var(--surface); }
.dark .badge-green { background:rgba(16,185,129,0.15); color:#34D399; }
.dark .badge-blue { background:rgba(59,130,246,0.15); color:#60A5FA; }
.dark .badge-red { background:rgba(239,68,68,0.15); color:#F87171; }
.dark .progress { background:var(--border); }
.dark .divider { background:var(--border); }
.dark .chat-bubble { background:var(--surface-hover); color:var(--text); }
.dark .chat-msg.user .chat-bubble { background:var(--primary); color:white; }
.dark .quick-action { background:var(--surface); border-color:var(--border); color:var(--text); }
.dark .quick-action:hover { background:var(--primary-light); }
.dark .garage-hero { background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%); }
.dark .profile-header { background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%); }
.dark .settings-row { background:var(--surface); border-color:var(--border); }
.dark .settings-row:hover { background:var(--surface-hover); }
.dark .countdown-card { background:var(--surface); border-color:var(--border); }
.dark .garage-action { background:var(--surface); border-color:var(--border); }
.dark .garage-action:hover { background:var(--primary-light); border-color:var(--primary); }
.dark .cost-bar-track { background:var(--border); }
.dark .fav-list-item { background:var(--surface); border-color:var(--border); }
.dark .fav-list-item:hover { background:var(--surface-hover); }
.dark .specs-grid { background:var(--border); }
.dark .spec-cell { background:var(--surface); }
.dark .compare-table th { background:var(--surface-hover); color:var(--text-tertiary); border-color:var(--border); }
.dark .compare-table td { border-color:var(--border); color:var(--text); }
.dark .compare-highlight { background:rgba(16,185,129,0.12); color:#34D399; }
.dark .detail-sticky-cta { background:var(--surface); border-color:var(--border); }
.dark .detail-hero-fav { background:rgba(30,33,42,0.9); }
.dark .fav-compare-header { background:var(--surface-hover); }
.dark .fav-compare-label { background:var(--surface-hover); }
.dark .fav-compare-cell { background:var(--surface); color:var(--text); }
.dark .fav-compare-grid { background:var(--border); }
.dark .profile-stats { background:var(--border); }
.dark .profile-stat-cell { background:var(--surface); }
.dark .fav-stat-row { background:var(--border); }
.dark .fav-stat-cell { background:var(--surface); }
.dark .toggle-switch { background:#374151; }
.dark .onb-overlay { background:var(--bg); }
.dark .onb-option { background:var(--surface); border-color:var(--border); color:var(--text); }
.dark .onb-option:hover { border-color:var(--text-tertiary); }
.dark .onb-chip { background:var(--surface); border-color:var(--border); color:var(--text); }
.dark .onb-feature { background:var(--surface); border-color:var(--border); }
.dark .onb-welcome-card { background:var(--surface); border-color:var(--border); }
.dark .vehicle-card { background:var(--surface); border-color:var(--border); }
.dark .hero-search { background:var(--surface); border-color:var(--border); }
.dark ::selection { background:var(--primary); color:white; }

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
/* FILTERS */
.filter-bar {
  display:flex; gap:8px; margin-bottom:16px;
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
.filter-select {
  padding:9px 32px 9px 12px; border-radius:10px;
  border:1.5px solid var(--border); background:var(--surface);
  font-size:13px; font-weight:600; color:var(--text);
  cursor:pointer; transition:all 0.15s;
  appearance:none; -webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:right 10px center;
}
.filter-select:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 3px rgba(66,133,244,0.1); }
.filter-select.has-value { border-color:var(--primary); background:var(--primary-light); color:var(--primary); }
.filter-grid {
  display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));
  gap:10px;
}
.filter-tag {
  display:inline-flex; align-items:center; gap:6px;
  padding:6px 12px; border-radius:100px;
  background:var(--primary-light); color:var(--primary);
  font-size:12px; font-weight:600;
}
.filter-tag-x {
  width:16px; height:16px; border-radius:50%; border:none;
  background:rgba(66,133,244,0.15); color:var(--primary);
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  font-size:10px; font-weight:700; transition:all 0.15s;
}
.filter-tag-x:hover { background:var(--primary); color:white; }

/* FILTER PILL BAR (Auto Trader style) */
.filter-pills {
  display:flex; gap:8px; overflow-x:auto; padding:0 0 12px;
  scrollbar-width:none; -ms-overflow-style:none;
}
.filter-pills::-webkit-scrollbar { display:none; }
.filter-pill {
  display:flex; align-items:center; gap:6px;
  padding:9px 16px; border-radius:100px;
  border:1.5px solid var(--border); background:var(--surface);
  font-size:13px; font-weight:600; color:var(--text);
  cursor:pointer; white-space:nowrap; transition:all 0.15s;
}
.filter-pill:hover { border-color:#9CA3AF; }
.filter-pill.has-value {
  background:var(--primary); color:white; border-color:var(--primary);
}
.filter-pill-chevron { font-size:10px; opacity:0.5; }
.filter-sort-btn {
  display:flex; align-items:center; gap:6px;
  padding:9px 18px; border-radius:100px;
  border:1.5px solid var(--text); background:var(--text); color:white;
  font-size:13px; font-weight:700; cursor:pointer;
  white-space:nowrap; transition:all 0.15s; flex-shrink:0;
}
.filter-sort-btn:hover { opacity:0.9; }

/* FILTER PANEL (Slide-over accordion) */
.fp-row {
  display:flex; align-items:center; justify-content:space-between;
  padding:18px 0; border-bottom:1px solid var(--border-light);
  cursor:pointer; transition:background 0.1s;
}
.fp-row:hover { background:rgba(0,0,0,0.01); }
.fp-row-left { display:flex; align-items:center; gap:14px; }
.fp-row-icon {
  width:28px; height:28px; display:flex; align-items:center; justify-content:center;
  font-size:16px; color:var(--text-secondary); flex-shrink:0;
}
.fp-row-label { font-size:15px; font-weight:600; color:var(--text); }
.fp-row-value { font-size:13px; color:var(--text-tertiary); margin-top:1px; }
.fp-row-chevron {
  font-size:12px; color:var(--text-tertiary); transition:transform 0.2s;
}
.fp-row-chevron.open { transform:rotate(180deg); }
.fp-options {
  padding:8px 0 16px 42px;
  display:flex; flex-wrap:wrap; gap:8px;
  animation:fadeIn 0.15s ease;
}
.fp-option {
  padding:8px 16px; border-radius:10px;
  border:1.5px solid var(--border); background:var(--surface);
  font-size:13px; font-weight:500; color:var(--text);
  cursor:pointer; transition:all 0.15s;
}
.fp-option:hover { border-color:#9CA3AF; }
.fp-option.active {
  background:var(--primary); color:white; border-color:var(--primary);
}
.fp-clear-row {
  display:flex; justify-content:space-between; align-items:center;
  padding:16px 0; border-bottom:2px solid var(--border);
}

/* GARAGE DASHBOARD */
.garage-hero {
  position:relative; border-radius:20px; overflow:hidden;
  background:linear-gradient(135deg,#1E293B 0%,#0F172A 100%);
  color:white; padding:24px; margin-bottom:20px;
}
.garage-hero-img {
  width:100%; height:160px; object-fit:cover; border-radius:14px;
  margin-bottom:16px; background:#334155;
}
.garage-vrm {
  display:inline-block; padding:6px 16px; border-radius:6px;
  background:#F7DC6F; color:#1A1A2E; font-weight:800;
  font-size:15px; letter-spacing:1px; font-family:monospace;
  border:2px solid #1A1A2E; margin-bottom:12px;
}
.garage-stat-row {
  display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:16px;
}
.garage-stat {
  text-align:center; padding:10px 4px;
  background:rgba(255,255,255,0.08); border-radius:12px;
}
.garage-stat-val { font-size:16px; font-weight:800; }
.garage-stat-label { font-size:10px; opacity:0.6; margin-top:2px; text-transform:uppercase; letter-spacing:0.5px; }

/* Countdown rings */
.countdown-grid {
  display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:20px;
}
.countdown-card {
  background:var(--surface); border:1px solid var(--border-light);
  border-radius:16px; padding:16px; text-align:center;
  transition:all 0.15s;
}
.countdown-card:hover { border-color:var(--border); }
.countdown-ring {
  width:72px; height:72px; border-radius:50%; margin:0 auto 10px;
  display:flex; align-items:center; justify-content:center;
  position:relative;
}
.countdown-ring svg { position:absolute; top:0; left:0; transform:rotate(-90deg); }
.countdown-days { font-size:20px; font-weight:800; position:relative; z-index:1; }
.countdown-unit { font-size:9px; font-weight:600; opacity:0.5; }
.countdown-label { font-size:13px; font-weight:700; margin-bottom:2px; }
.countdown-date { font-size:11px; color:var(--text-tertiary); }

/* Quick actions */
.garage-actions {
  display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:20px;
}
.garage-action {
  display:flex; flex-direction:column; align-items:center; gap:6px;
  padding:14px 8px; border-radius:14px; cursor:pointer;
  background:var(--surface); border:1px solid var(--border-light);
  transition:all 0.15s; text-align:center;
}
.garage-action:hover { border-color:var(--primary); background:var(--primary-light); }
.garage-action-icon { font-size:22px; }
.garage-action-label { font-size:11px; font-weight:600; color:var(--text-secondary); }

/* Service timeline */
.timeline { position:relative; padding-left:28px; }
.timeline::before {
  content:''; position:absolute; left:8px; top:4px; bottom:4px;
  width:2px; background:var(--border);
}
.timeline-item { position:relative; padding-bottom:20px; }
.timeline-dot {
  position:absolute; left:-24px; top:2px;
  width:16px; height:16px; border-radius:50%;
  border:2.5px solid var(--primary); background:white; z-index:1;
}
.timeline-dot.green { border-color:var(--success); }
.timeline-dot.amber { border-color:var(--warning); }
.timeline-dot.red { border-color:var(--error); }
.timeline-item:first-child .timeline-dot { background:var(--primary); }

/* Cost mini bars */
.cost-bar-row {
  display:flex; align-items:center; gap:10px; padding:8px 0;
}
.cost-bar-label { font-size:12px; width:80px; flex-shrink:0; }
.cost-bar-track {
  flex:1; height:8px; background:#F3F4F6; border-radius:100px; overflow:hidden;
}
.cost-bar-fill {
  height:100%; border-radius:100px; transition:width 0.5s ease;
}
.cost-bar-val { font-size:12px; font-weight:700; width:52px; text-align:right; flex-shrink:0; }

/* PROFILE & SETTINGS */
.profile-header {
  text-align:center; padding:28px 20px 20px;
  background:linear-gradient(135deg,#1E293B 0%,#0F172A 100%);
  color:white; border-radius:20px; margin-bottom:20px;
}
.profile-avatar {
  width:80px; height:80px; border-radius:50%; margin:0 auto 14px;
  background:linear-gradient(135deg,#4285F4,#1a5cd6);
  display:flex; align-items:center; justify-content:center;
  color:white; font-size:32px; font-weight:800;
  border:3px solid rgba(255,255,255,0.2);
}
.profile-badges {
  display:flex; justify-content:center; gap:8px; margin-top:12px;
}
.profile-badge {
  display:inline-flex; align-items:center; gap:4px;
  padding:4px 12px; border-radius:100px; font-size:11px; font-weight:600;
  background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.8);
}
.profile-stats {
  display:grid; grid-template-columns:repeat(3,1fr); gap:1px;
  background:var(--border-light); border-radius:14px; overflow:hidden;
  margin-bottom:20px;
}
.profile-stat-cell {
  background:var(--surface); padding:16px 8px; text-align:center;
}
.profile-stat-val { font-size:18px; font-weight:800; color:var(--text); }
.profile-stat-label { font-size:10px; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.5px; margin-top:2px; }
.settings-group {
  margin-bottom:20px;
}
.settings-group-title {
  font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;
  color:var(--text-tertiary); padding:0 4px 8px; margin:0;
}
.settings-row {
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 16px; background:var(--surface);
  border-bottom:1px solid var(--border-light);
  cursor:pointer; transition:background 0.1s;
}
.settings-row:first-of-type { border-radius:12px 12px 0 0; }
.settings-row:last-of-type { border-radius:0 0 12px 12px; border-bottom:none; }
.settings-row:only-of-type { border-radius:12px; }
.settings-row:hover { background:#FAFAFA; }
.settings-row-left { display:flex; align-items:center; gap:12px; }
.settings-row-icon {
  width:32px; height:32px; border-radius:8px;
  display:flex; align-items:center; justify-content:center;
  font-size:16px; flex-shrink:0;
}
.settings-row-text { }
.settings-row-label { font-size:14px; font-weight:600; color:var(--text); }
.settings-row-desc { font-size:12px; color:var(--text-tertiary); margin-top:1px; }
.settings-row-right { display:flex; align-items:center; gap:6px; }
.settings-row-val { font-size:13px; color:var(--text-tertiary); }
.settings-chevron { font-size:12px; color:var(--text-tertiary); }
/* Toggle switch */
.toggle-switch {
  position:relative; width:44px; height:26px; border-radius:100px;
  background:#D1D5DB; cursor:pointer; transition:background 0.2s;
  border:none; padding:0; flex-shrink:0;
}
.toggle-switch.on { background:var(--primary); }
.toggle-knob {
  position:absolute; top:3px; left:3px;
  width:20px; height:20px; border-radius:50%;
  background:white; transition:transform 0.2s;
  box-shadow:0 1px 3px rgba(0,0,0,0.15);
}
.toggle-switch.on .toggle-knob { transform:translateX(18px); }

/* FAVOURITES PAGE */
.fav-toolbar {
  display:flex; justify-content:space-between; align-items:center;
  margin-bottom:16px; gap:12px;
}
.fav-view-toggle {
  display:flex; background:#F3F4F6; border-radius:10px; overflow:hidden;
}
.fav-view-btn {
  padding:7px 14px; border:none; background:transparent;
  font-size:12px; font-weight:600; cursor:pointer;
  color:var(--text-muted); transition:all 0.15s;
}
.fav-view-btn.active { background:var(--primary); color:white; }
.fav-list-item {
  display:flex; gap:14px; padding:14px;
  background:var(--surface); border:1px solid var(--border-light);
  border-radius:14px; margin-bottom:10px; transition:all 0.15s;
  cursor:pointer; align-items:center;
}
.fav-list-item:hover { border-color:var(--border); box-shadow:0 2px 8px rgba(0,0,0,0.04); }
.fav-list-img {
  width:100px; height:68px; border-radius:10px; overflow:hidden;
  flex-shrink:0; background:#F3F4F6;
}
.fav-list-img img { width:100%; height:100%; object-fit:cover; }
.fav-list-info { flex:1; min-width:0; }
.fav-list-actions { display:flex; flex-direction:column; gap:6px; align-items:flex-end; flex-shrink:0; }
.fav-note-badge {
  display:inline-flex; align-items:center; gap:4px;
  padding:3px 10px; border-radius:6px; font-size:11px;
  background:#FEF3C7; color:#92400E; max-width:200px;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.fav-alert-badge {
  display:inline-flex; align-items:center; gap:3px;
  padding:3px 8px; border-radius:6px; font-size:10px; font-weight:600;
  background:#DCFCE7; color:#166534;
}
.fav-compare-grid {
  display:grid; gap:1px; background:var(--border-light);
  border-radius:14px; overflow:hidden;
}
.fav-compare-cell {
  background:var(--surface); padding:10px 12px; text-align:center;
  font-size:13px;
}
.fav-compare-header {
  background:#F8FAFC; font-weight:700; font-size:12px;
  color:var(--text-secondary); padding:12px;
}
.fav-compare-label {
  background:#F8FAFC; font-weight:600; font-size:11px;
  color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.3px;
  text-align:left; padding:10px 12px;
}
.fav-price-drop {
  display:inline-flex; align-items:center; gap:3px;
  font-size:11px; font-weight:700; color:#16A34A;
}
.fav-stat-row {
  display:grid; grid-template-columns:repeat(3,1fr); gap:1px;
  background:var(--border-light); border-radius:12px; overflow:hidden; margin-bottom:16px;
}
.fav-stat-cell {
  background:var(--surface); padding:14px 8px; text-align:center;
}
.fav-stat-val { font-size:20px; font-weight:800; }
.fav-stat-label { font-size:10px; color:var(--text-tertiary); text-transform:uppercase; margin-top:2px; }

/* ONBOARDING */
.onb-overlay {
  position:fixed; inset:0; z-index:20000;
  background:white; display:flex; flex-direction:column;
  overflow-y:auto;
}
.onb-content {
  flex:1; display:flex; flex-direction:column;
  max-width:480px; margin:0 auto; padding:32px 24px;
  width:100%;
}
.onb-progress {
  display:flex; gap:6px; margin-bottom:32px;
}
.onb-progress-dot {
  flex:1; height:4px; border-radius:100px; background:#E5E7EB;
  transition:all 0.3s;
}
.onb-progress-dot.active { background:var(--primary); }
.onb-progress-dot.done { background:var(--success); }
.onb-emoji { font-size:56px; margin-bottom:20px; }
.onb-title { font-size:26px; font-weight:800; line-height:1.2; margin-bottom:8px; }
.onb-subtitle { font-size:15px; color:var(--text-secondary); line-height:1.5; margin-bottom:32px; }
.onb-options {
  display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:24px;
}
.onb-option {
  display:flex; flex-direction:column; align-items:center; gap:8px;
  padding:18px 12px; border-radius:16px;
  border:2px solid var(--border-light); background:var(--surface);
  cursor:pointer; transition:all 0.15s; text-align:center;
}
.onb-option:hover { border-color:#9CA3AF; }
.onb-option.selected { border-color:var(--primary); background:var(--primary-light); }
.onb-option-icon { font-size:28px; }
.onb-option-label { font-size:13px; font-weight:700; }
.onb-option-desc { font-size:11px; color:var(--text-tertiary); }
.onb-chips {
  display:flex; flex-wrap:wrap; gap:10px; margin-bottom:24px;
}
.onb-chip {
  padding:10px 20px; border-radius:100px;
  border:2px solid var(--border-light); background:var(--surface);
  font-size:13px; font-weight:600; cursor:pointer;
  transition:all 0.15s; display:flex; align-items:center; gap:6px;
}
.onb-chip:hover { border-color:#9CA3AF; }
.onb-chip.selected { border-color:var(--primary); background:var(--primary-light); color:var(--primary); }
.onb-footer {
  display:flex; gap:12px; margin-top:auto; padding-top:24px;
}
.onb-feature-grid {
  display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:24px;
}
.onb-feature {
  display:flex; flex-direction:column; align-items:center; gap:4px;
  padding:14px 8px; border-radius:14px;
  border:2px solid var(--border-light); background:var(--surface);
  cursor:pointer; transition:all 0.15s; text-align:center;
}
.onb-feature:hover { border-color:#9CA3AF; }
.onb-feature.selected { border-color:var(--primary); background:var(--primary-light); }
.onb-feature-icon { font-size:24px; }
.onb-feature-label { font-size:11px; font-weight:600; }
.onb-welcome-cards {
  display:flex; flex-direction:column; gap:12px; margin-bottom:24px;
}
.onb-welcome-card {
  display:flex; align-items:center; gap:14px;
  padding:16px; border-radius:14px; background:#F8FAFC;
  border:1px solid var(--border-light);
}
.onb-welcome-card-icon {
  width:44px; height:44px; border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  font-size:22px; flex-shrink:0;
}
.onb-welcome-card-text { }
.onb-welcome-card-title { font-size:14px; font-weight:700; margin-bottom:2px; }
.onb-welcome-card-desc { font-size:12px; color:var(--text-tertiary); }

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
  cursor:pointer; display:flex;
  align-items:center; justify-content:center;
  transition:all 0.2s; flex-shrink:0; color:var(--text-secondary);
}
.btn-mic:hover { border-color:var(--primary); color:var(--primary); background:rgba(66,133,244,0.06); }
.btn-mic.active {
  background:#DC2626; border-color:#DC2626; color:white;
  animation:micPulse 1.5s infinite;
}
.hero-mic { width:34px; height:34px; background:transparent; border:none; }
.hero-mic:hover { background:rgba(66,133,244,0.08); border-radius:50%; }
.hero-mic.active { background:#DC2626; border-radius:50%; color:white; border:none; animation:micPulse 1.5s infinite; }
.chat-mic { background:transparent; border:none; width:32px; height:32px; }
.chat-mic:hover { background:rgba(66,133,244,0.08); border-radius:50%; }
.chat-mic.active { background:#DC2626; border-radius:50%; color:white; animation:micPulse 1.5s infinite; }
@keyframes micPulse { 0%,100%{box-shadow:0 0 0 0 rgba(220,38,38,0.3)} 50%{box-shadow:0 0 0 8px rgba(220,38,38,0)} }
.voice-listening { border-color:#DC2626 !important; box-shadow:0 0 0 3px rgba(220,38,38,0.12) !important; }
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
.detail-layout { display:grid; grid-template-columns:1fr 380px; gap:28px; padding:0 0 120px; }
.detail-hero-img {
  height:420px; border-radius:16px; display:flex;
  align-items:center; justify-content:center;
  background:linear-gradient(135deg, #F8F9FA, #E9ECEF);
  overflow:hidden; position:relative;
}
.detail-hero-img img {
  width:100%; height:100%; object-fit:cover;
}
.detail-hero-badge {
  position:absolute; top:14px; left:14px;
  display:flex; gap:6px;
}
.detail-hero-badge .badge { backdrop-filter:blur(8px); }
.detail-hero-fav {
  position:absolute; top:14px; right:14px;
  width:40px; height:40px; border-radius:50%;
  background:rgba(255,255,255,0.9); backdrop-filter:blur(8px);
  border:none; cursor:pointer; display:flex;
  align-items:center; justify-content:center; font-size:18;
  transition:all 0.2s; box-shadow:0 2px 8px rgba(0,0,0,0.1);
}
.detail-hero-fav:hover { transform:scale(1.1); }
.detail-hero-counter {
  position:absolute; bottom:14px; right:14px;
  padding:5px 12px; border-radius:8px;
  background:rgba(0,0,0,0.6); color:white;
  font-size:12px; font-weight:600; backdrop-filter:blur(4px);
}
.gallery-dots {
  display:none; position:absolute; bottom:12px; left:50%;
  transform:translateX(-50%);
  gap:6px; padding:6px 10px; background:rgba(0,0,0,0.4);
  border-radius:100px; backdrop-filter:blur(4px);
}
.gallery-dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.5); transition:all 0.2s; }
.gallery-dot.active { background:white; width:16px; border-radius:3px; }
@media (max-width:768px) {
  .detail-hero-img { height:260px; border-radius:12px; }
  .gallery-dots { display:flex; }
}
.gallery-strip {
  display:flex; gap:8px; overflow-x:auto; padding:8px 0 4px;
  scrollbar-width:none; -ms-overflow-style:none;
}
.gallery-strip::-webkit-scrollbar { display:none; }
.gallery-thumb {
  width:76px; height:52px; border-radius:10px; overflow:hidden;
  cursor:pointer; flex-shrink:0; border:2.5px solid transparent;
  transition:all 0.2s; opacity:0.65;
}
.gallery-thumb.active { border-color:var(--primary); opacity:1; }
.gallery-thumb:hover { opacity:0.9; }
.gallery-thumb img { width:100%; height:100%; object-fit:cover; }

.detail-sidebar { display:flex; flex-direction:column; gap:16px; position:sticky; top:20px; align-self:start; }
.detail-price-card {
  background:var(--surface); border:1px solid var(--border);
  border-radius:16px; padding:24px;
}
.detail-price { font-size:32px; font-weight:800; color:var(--text); margin-bottom:2px; letter-spacing:-0.5px; }
.detail-price-sub { font-size:14px; color:var(--text-muted); margin-bottom:12px; }
.detail-actions-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:16px; }

/* Specs grid */
.specs-grid {
  display:grid; grid-template-columns:repeat(4, 1fr); gap:1px;
  background:var(--border-light); border-radius:14px; overflow:hidden;
  margin-bottom:20px;
}
.spec-cell {
  background:var(--surface); padding:16px 10px; text-align:center;
}
.spec-icon { font-size:20px; margin-bottom:4px; }
.spec-val { font-size:14px; font-weight:700; color:var(--text); }
.spec-label { font-size:10px; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.3px; margin-top:2px; }

/* Sticky bottom CTA */
.detail-sticky-cta {
  position:fixed; bottom:0; left:0; right:0; z-index:90;
  background:white; border-top:1px solid var(--border);
  padding:12px 24px; display:flex; align-items:center; gap:12px;
  box-shadow:0 -4px 20px rgba(0,0,0,0.08);
}
.detail-sticky-price { font-size:22px; font-weight:800; }
.detail-sticky-sub { font-size:11px; color:var(--text-muted); }

/* Compare inline */
.compare-table {
  width:100%; border-collapse:separate; border-spacing:0;
  border-radius:14px; overflow:hidden; border:1px solid var(--border-light);
}
.compare-table th {
  background:#F8F9FA; padding:10px 12px; font-size:11px;
  font-weight:700; text-transform:uppercase; letter-spacing:0.3px;
  color:var(--text-tertiary); text-align:left; border-bottom:1px solid var(--border-light);
}
.compare-table td {
  padding:10px 12px; font-size:13px; border-bottom:1px solid var(--border-light);
}
.compare-table tr:last-child td { border-bottom:none; }
.compare-highlight { background:#F0FDF4; font-weight:700; color:var(--success); }

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
  overflow-y:auto; z-index:201; padding:16px 0;
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
  position:fixed; top:64px; right:32px; z-index:151;
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
  /* NAVBAR — compact on mobile */
  .navbar { padding:0 16px; height:56px; }
  .nav-links { display:none; }
  .nav-left { gap:12px; }
  .nav-logo { font-size:20px; }
  .nav-right { gap:8px; }
  .nav-btn { width:36px; height:36px; font-size:16px; }
  .nav-avatar { width:32px; height:32px; font-size:12px; }
  
  /* LAYOUT — account for bottom nav */
  .app-layout { padding-top:56px; padding-bottom:72px; }
  .main-content { padding:0 16px; }
  
  /* HERO — compact */
  .hero-section { padding:24px 0 20px; }
  .hero-badge { font-size:11px; }
  .hero-title { font-size:26px; line-height:1.15; }
  .hero-sub { font-size:13px; margin-bottom:16px; }
  .ai-search-box { padding:4px 4px 4px 14px; }
  .ai-search-input { font-size:16px; } /* prevent iOS zoom */
  .ai-search-btn { padding:10px 14px; font-size:13px; }
  .quick-actions { gap:6px; }
  .quick-action { padding:8px 12px; font-size:12px; }
  
  /* TOOLS GRID — 3 columns on mobile */
  .tools-grid { grid-template-columns:repeat(3, 1fr); gap:8px; }
  .tool-card { padding:14px 8px; }
  .tool-card .text-xs { display:none; } /* hide descriptions on mobile */
  
  /* VEHICLE GRID */
  .vehicle-grid { grid-template-columns:1fr; gap:12px; }
  .vcard-img { height:180px; }
  
  /* FILTER BAR */
  .filter-bar { gap:6px; margin-bottom:14px; }
  .filter-chip { padding:8px 14px; font-size:12px; }
  
  /* SECTION HEADERS */
  .section-head { margin-bottom:12px; }
  .section-title { font-size:18px; }
  
  /* DETAIL PAGE */
  .detail-layout { gap:16px; padding:12px 0 80px; }
  .detail-hero-img { border-radius:12px; }
  .detail-hero-img img { border-radius:12px; }
  .info-grid { grid-template-columns:1fr 1fr 1fr; }
  .info-cell { padding:10px 6px; }
  .info-val { font-size:13px; }
  .info-label { font-size:10px; }
  .tabs { overflow-x:auto; flex-wrap:nowrap; }
  .tab-btn { white-space:nowrap; font-size:12px; padding:8px 12px; flex-shrink:0; }
  
  /* SLIDE-OVER — full screen on mobile */
  .slide-over { width:100vw; border-radius:0; }
  .slide-header { padding:16px; }
  .slide-body { padding:16px; }
  
  /* CHAT PANEL — full width above bottom nav on mobile */
  .chat-panel { width:100vw; right:0; bottom:64px; max-height:calc(100vh - 130px); border-radius:16px 16px 0 0; }
  .chat-fab { display:none; }
  
  /* BUTTONS & INPUTS — touch friendly */
  .btn { min-height:44px; font-size:14px; }
  .btn-sm { min-height:38px; }
  .input, .chat-input { font-size:16px; min-height:44px; } /* 16px prevents iOS zoom */
  
  /* TOOLS SIDEBAR — full width on mobile */
  .tools-sidebar { width:280px; }
  
  /* CARDS */
  .card { padding:14px; }
  
  /* NOTIF PANEL */
  .notif-panel { right:8px; left:8px; width:auto; max-height:70vh; }
  
  /* AUTH MODAL */
  .modal-overlay > div { margin:16px; border-radius:16px !important; }

  /* CHAT ELEMENTS — touch friendly */
  .chat-qr { padding:10px 16px; font-size:13px; }
  .chat-bubble { font-size:14px; max-width:90%; }
  .chat-car-card { min-width:140px; }
  .chat-input-area { padding:10px 12px; }
  .btn-mic { width:40px; height:40px; }
  
  /* DEALER CHAT in SlideOver */
  .slide-body .chat-messages { max-height:calc(100vh - 300px); }

  /* GALLERY THUMBNAILS hide on mobile — use swipe dots instead */
  .gallery-thumbs-row { display:none; }
  
  /* Favourite/action buttons — bigger tap targets */
  .fav-btn { width:42px; height:42px; font-size:18px; }
}

/* MOBILE BOTTOM NAV */
.mobile-nav {
  display:none; position:fixed; bottom:0; left:0; right:0;
  height:64px; background:rgba(255,255,255,0.95);
  backdrop-filter:blur(20px) saturate(180%);
  border-top:1px solid var(--border);
  z-index:100; padding:0 8px;
  padding-bottom:env(safe-area-inset-bottom, 0px);
}
@media (max-width:768px) {
  .mobile-nav { display:flex; align-items:center; justify-content:space-around; }
}
.mob-tab {
  display:flex; flex-direction:column; align-items:center; gap:2px;
  padding:6px 12px; background:none; border:none;
  cursor:pointer; font-size:10px; font-weight:600;
  color:var(--text-tertiary); transition:all 0.15s;
  position:relative; min-width:56px;
}
.mob-tab.active { color:var(--primary); }
.mob-tab-icon { font-size:22px; line-height:1; }
.mob-tools-btn { display:none; }
@media (max-width:768px) {
  .mob-tools-btn { display:flex; }
}
.mob-tab-badge {
  position:absolute; top:2px; right:8px;
  width:8px; height:8px; border-radius:50%;
  background:#DC2626;
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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onbStep, setOnbStep] = useState(0);
  const [onbBudget, setOnbBudget] = useState(null);
  const [onbFuel, setOnbFuel] = useState([]);
  const [onbBody, setOnbBody] = useState([]);
  const [onbUse, setOnbUse] = useState(null);
  const [onbFeatures, setOnbFeatures] = useState([]);
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
        // Show onboarding for new signups
        if (action === "signup") {
          setShowOnboarding(true);
          setOnbStep(0);
        }
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
  const [favView, setFavView] = useState("grid"); // grid, list, compare
  const [favSort, setFavSort] = useState("added"); // added, price-low, price-high, mileage
  const [favNotes, setFavNotes] = useState({}); // {vehicleId: "note text"}
  const [favAlerts, setFavAlerts] = useState({}); // {vehicleId: true/false}
  const [favEditNote, setFavEditNote] = useState(null); // vehicleId being edited
  const [favNoteText, setFavNoteText] = useState("");
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
  const [fTrans, setFTrans] = useState("All");
  const [fMiles, setFMiles] = useState("All");
  const [fYear, setFYear] = useState("All");
  const [fInsurance, setFInsurance] = useState("All");
  const [fUlez, setFUlez] = useState("All");
  const [fColour, setFColour] = useState("All");
  const [fDoors, setFDoors] = useState("All");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterAccordion, setFilterAccordion] = useState(null);
  const [fEngine, setFEngine] = useState("All");
  const [fBhp, setFBhp] = useState("All");
  const [fSeats, setFSeats] = useState("All");
  const [fBoot, setFBoot] = useState("All");

  const activeFilterCount = [fFuel,fBody,fPrice,fTrans,fMiles,fYear,fInsurance,fUlez,fColour,fDoors,fEngine,fBhp,fSeats,fBoot].filter(f=>f!=="All").length;

  const clearAllFilters = () => {
    setFFuel("All"); setFBody("All"); setFPrice("All"); setFTrans("All");
    setFMiles("All"); setFYear("All"); setFInsurance("All"); setFUlez("All");
    setFColour("All"); setFDoors("All"); setAiSearchQuery("");
    setFEngine("All"); setFBhp("All"); setFSeats("All"); setFBoot("All");
  };

  // Smart AI filter parser — sets filters from natural language
  const applyAiFilters = (text) => {
    const lo = text.toLowerCase();
    clearAllFilters();
    setAiSearchQuery(text);
    if (/\belectric\b|ev\b|tesla/i.test(lo)) setFFuel("Electric");
    else if (/\bhybrid\b/i.test(lo)) setFFuel("Hybrid");
    else if (/\bpetrol\b/i.test(lo)) setFFuel("Petrol");
    else if (/\bdiesel\b/i.test(lo)) setFFuel("Diesel");
    if (/\bsuv\b|family|space|boot|kids/i.test(lo)) setFBody("SUV");
    else if (/\bhatchback\b|\bhatch\b/i.test(lo)) setFBody("Hatchback");
    else if (/\bsaloon\b|\bsedan\b/i.test(lo)) setFBody("Saloon");
    if (/under.*15|below.*15|max.*15|budget/i.test(lo)) setFPrice("u15");
    else if (/under.*20|below.*20|max.*20/i.test(lo)) setFPrice("u20");
    else if (/under.*25|below.*25|max.*25/i.test(lo)) setFPrice("u25");
    else if (/under.*30|below.*30|max.*30/i.test(lo)) setFPrice("u30");
    else if (/over.*25|above.*25|premium|luxury/i.test(lo)) setFPrice("25+");
    if (/\bauto\b|\bautomatic\b/i.test(lo)) setFTrans("Automatic");
    else if (/\bmanual\b|\bstick\b/i.test(lo)) setFTrans("Manual");
    if (/low.?mile|under.*10k|less.*10/i.test(lo)) setFMiles("u10");
    else if (/under.*20k|under.*20.*mile/i.test(lo)) setFMiles("u20");
    else if (/under.*30k|low.*mileage/i.test(lo)) setFMiles("u30");
    if (/low.?insur|cheap.?insur|new.?driver|first.?car|young/i.test(lo)) setFInsurance("low");
    if (/ulez|clean.?air|london|emission/i.test(lo)) setFUlez("yes");
    if (/\b202[4-6]\b|newest|latest/i.test(lo)) setFYear("2024+");
    else if (/\b202[2-3]\b/i.test(lo)) setFYear("2022+");
    if (/cheap|budget|affordable|bargain/i.test(lo)) setFSort("price-low");
    else if (/best.?deal|value|great.?price/i.test(lo)) setFSort("deal");
    else if (/new|latest|recent/i.test(lo)) setFSort("newest");
    else if (/low.?insur|first.?car/i.test(lo)) setFSort("insurance");
    else setFSort("match");
    setPage("search"); setSel(null);
  };

  const filtered = V.filter(v =>
    (fFuel==="All"||v.fuel===fFuel) &&
    (fBody==="All"||v.bodyType===fBody) &&
    (fPrice==="All"||(fPrice==="u15"&&v.price<15000)||(fPrice==="u20"&&v.price<20000)||(fPrice==="u25"&&v.price<25000)||(fPrice==="u30"&&v.price<30000)||(fPrice==="15-25"&&v.price>=15000&&v.price<=25000)||(fPrice==="25+"&&v.price>25000)) &&
    (fTrans==="All"||v.transmission===fTrans) &&
    (fMiles==="All"||(fMiles==="u10"&&v.mileage<10000)||(fMiles==="u20"&&v.mileage<20000)||(fMiles==="u30"&&v.mileage<30000)||(fMiles==="u50"&&v.mileage<50000)) &&
    (fYear==="All"||(fYear==="2024+"&&v.year>=2024)||(fYear==="2022+"&&v.year>=2022)||(fYear==="2020+"&&v.year>=2020)) &&
    (fInsurance==="All"||(fInsurance==="low"&&v.insuranceGroup<=15)||(fInsurance==="mid"&&v.insuranceGroup>15&&v.insuranceGroup<=25)||(fInsurance==="high"&&v.insuranceGroup>25)) &&
    (fUlez==="All"||(fUlez==="yes"&&v.ulezCompliant)||(fUlez==="no"&&!v.ulezCompliant)) &&
    (fColour==="All"||v.colour===fColour) &&
    (fDoors==="All"||v.doors===parseInt(fDoors)) &&
    (fEngine==="All"||(fEngine==="1.0"&&parseFloat(v.engineSize)<=1.0)||(fEngine==="1.5"&&parseFloat(v.engineSize)<=1.5)||(fEngine==="2.0"&&parseFloat(v.engineSize)<=2.0)||(fEngine==="2.0+"&&parseFloat(v.engineSize)>2.0)||v.engineSize==="Electric") &&
    (fBhp==="All"||(fBhp==="u150"&&v.specs.bhp<150)||(fBhp==="150-250"&&v.specs.bhp>=150&&v.specs.bhp<=250)||(fBhp==="250+"&&v.specs.bhp>250)) &&
    (fSeats==="All"||(fSeats==="4"&&v.doors<=4)||(fSeats==="5"&&v.doors===5)) &&
    (fBoot==="All"||(fBoot==="s"&&v.specs.bootSpace<350)||(fBoot==="m"&&v.specs.bootSpace>=350&&v.specs.bootSpace<500)||(fBoot==="l"&&v.specs.bootSpace>=500))
  ).sort((a,b) =>
    fSort==="price-low"?a.price-b.price : fSort==="price-high"?b.price-a.price :
    fSort==="newest"?a.daysListed-b.daysListed : fSort==="miles-low"?a.mileage-b.mileage :
    fSort==="deal"?(a.priceRating==="Great Deal"?-1:b.priceRating==="Great Deal"?1:a.price-b.price) :
    fSort==="insurance"?a.insuranceGroup-b.insuranceGroup :
    b.matchScore-a.matchScore
  );

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
  const galleryAngles = [1,5,9,13,17,21,25,29];
  const touchStartX = useRef(null);
  const handleGallerySwipe = (dir) => {
    const idx = galleryAngles.indexOf(galleryAngle);
    if (dir === "left" && idx < galleryAngles.length - 1) setGalleryAngle(galleryAngles[idx + 1]);
    if (dir === "right" && idx > 0) setGalleryAngle(galleryAngles[idx - 1]);
  };
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
  const [dFlow, setDFlow] = useState(null); // active flow: testdrive|finance|partex|negotiate|null
  const [dFlowData, setDFlowData] = useState({});
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
  const [prefNotifs, setPrefNotifs] = useState(true);
  const [prefEmails, setPrefEmails] = useState(true);
  const [prefDarkMode, setPrefDarkMode] = useState(false);
  const [prefLocation, setPrefLocation] = useState(true);
  const [prefPriceAlerts, setPrefPriceAlerts] = useState(true);
  const [prefDealerMsgs, setPrefDealerMsgs] = useState(true);
  const [prefDistUnit, setPrefDistUnit] = useState("miles");
  const [prefSearchRadius, setPrefSearchRadius] = useState("national");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Dark mode — apply to body
  useEffect(() => {
    document.body.style.background = prefDarkMode ? "#0F1117" : "#F7F8FA";
    document.body.style.color = prefDarkMode ? "#E8ECF0" : "#1A1D21";
  }, [prefDarkMode]);

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
    dealer: `You are the AI assistant for {DEALER_NAME} at {DEALER_LOCATION}, rated {DEALER_RATING}★ ({DEALER_REVIEWS} reviews).

CRITICAL RULES:
- Keep responses to 2-3 sentences MAX. Professional but warm, like a helpful sales advisor.
- Answer the question directly. Don't over-explain.
- British English. Be confident about the car — it IS in stock.

FLOW HANDLING — Detect these intents and respond naturally:
- TEST DRIVE: Confirm enthusiasm, mention the showroom location. Time slots available.
- FINANCE: Quote the specific PCP/HP figures from the vehicle data. Keep it brief.
- PART EXCHANGE: Ask for their reg and current mileage so you can value it.
- PRICE/NEGOTIATE: Acknowledge their interest, explain the car is competitively priced but you're open to discussing the full package.
- AVAILABILITY: Confirm it's in stock and ready to view.
- WARRANTY: Standard 3-month included, extended options available.
- DELIVERY: Collection or delivery within 50 miles, nationwide available.

ALWAYS end your response with exactly 3 suggested follow-up actions on a new line in this format:
[SUGGESTIONS: suggestion one | suggestion two | suggestion three]
Make them short (3-6 words), natural buyer actions.

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

  // ── Voice-to-text ──
  const [voiceActive, setVoiceActive] = useState(null);
  const recognitionRef = useRef(null);
  const micSvg = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>;
  const stopSvg = <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>;

  const toggleVoice = (target, setter) => {
    if (voiceActive) {
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(e) {}
      recognitionRef.current = null;
      setVoiceActive(null);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "en-GB";
    r.interimResults = true;
    r.continuous = true;
    recognitionRef.current = r;
    setVoiceActive(target);
    let final = "";
    r.onresult = (e) => {
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += (final?" ":"") + e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setter((final + (interim ? " " + interim : "")).trim());
    };
    r.onend = () => {
      // Auto restart if still active (browser stops after silence)
      if (recognitionRef.current && voiceActive) {
        try { r.start(); } catch(e) {
          setVoiceActive(null); recognitionRef.current = null;
        }
        return;
      }
      setVoiceActive(null); recognitionRef.current = null;
    };
    r.onerror = (e) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      setVoiceActive(null); recognitionRef.current = null;
    };
    try { r.start(); } catch(e) { setVoiceActive(null); }
  };

  const sendChat = async (text) => {
    if(!text?.trim())return;
    const um={role:"user",text:text.trim()};
    setMsgs(p=>[...p,um]); setChatIn(""); setHeroIn(""); setTyping(true);
    if(!chatOpen) setChatOpen(true);

    // Also apply filters to search page
    applyAiFilters(text);

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
    setDFlow(flow==="testDrive"?"testdrive":null); setDFlowData({});

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
        ?`Hey! 👋 Great choice on the ${v.year} ${v.make} ${v.model}. I've got several slots available this week — pick one that works for you!`
        :`Hey! 👋 Thanks for your interest in the ${v.year} ${v.make} ${v.model} at ${fmt(v.price)}. How can I help?`;
      const qr=flow==="testDrive"?["Mon 10am","Tue 2pm","Wed 11am","Thu 3:30pm","Sat 10am"]:["Is it available?","📅 Book a test drive","💳 Finance options","🔄 Part exchange","Negotiate the price"];
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
        ?`Hey! 👋 Great choice on the ${v.year} ${v.make} ${v.model}. I've got slots available this week — pick one that works for you!`
        :`Hey! 👋 Thanks for your interest in the ${v.year} ${v.make} ${v.model} at ${fmt(v.price)}. How can I help?`;
      const qr=flow==="testDrive"?["Mon 10am","Tue 2pm","Wed 11am","Thu 3:30pm","Sat 10am"]:["Is it available?","📅 Book a test drive","💳 Finance options","🔄 Part exchange","Negotiate the price"];
      setDMsgs([{role:"bot",text:g,quickReplies:qr}]);
    }
  };

  const sendDMsg = async (text) => {
    if(!text?.trim())return;
    const ctx=dCtx, v=ctx?.vehicle||V[0], dl=ctx?.dealer||D[0];
    const trimmed = text.trim();
    const lower = trimmed.toLowerCase();
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

    const addResp = (msg) => {
      setDMsgs(p=>[...p,msg]);
      setDTyping(false);
      if (activeConvoId) {
        const saveText = msg.text || (msg.card ? `[${msg.card.type}] ${msg.card.title||""}` : trimmed);
        fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "send", conversation_id: activeConvoId, sender_type: "dealer", text: saveText }),
        });
        loadConversations();
      }
    };

    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    await delay(600 + Math.random() * 800);

    // ── FLOW: Test Drive Booking ──
    if (/📅|test.?drive|book.*view|come.*see|want.*see/i.test(lower) && !dFlow) {
      setDFlow("testdrive");
      setDFlowData({});
      addResp({
        role:"bot",
        text:`Great choice! The ${v.make} ${v.model} is ready at our ${dl.location} showroom. Pick a slot that works for you:`,
        card: {
          type:"slot-picker",
          slots:["Mon 10am","Tue 2pm","Wed 11am","Thu 3:30pm","Sat 10am"],
        }
      });
      return;
    }

    // Handle slot selection (in testdrive flow)
    if (dFlow === "testdrive" && !dFlowData.slot) {
      const slotMatch = trimmed.match(/mon|tue|wed|thu|sat|10am|2pm|11am|3:30|10 am|2 pm/i);
      if (slotMatch || /^\w+ \d/i.test(trimmed)) {
        setDFlowData({...dFlowData, slot: trimmed});
        addResp({
          role:"bot",
          text:`Brilliant, ${trimmed} it is! Just need your name and phone number to confirm the booking.`,
          quickReplies:["Use my account details"],
        });
        return;
      }
    }

    // Handle contact details (in testdrive flow)
    if (dFlow === "testdrive" && dFlowData.slot && !dFlowData.confirmed) {
      const name = /use my account|my details/i.test(lower) ? (user?.name||"Customer") : trimmed.split(/[,\n]/)[0];
      setDFlowData({...dFlowData, confirmed:true, name});
      setDFlow(null);
      addResp({
        role:"bot",
        text:`All confirmed! 🎉`,
        card: {
          type:"confirmation",
          title:"Test Drive Booked",
          icon:"📅",
          lines:[
            {label:"Car", value:`${v.year} ${v.make} ${v.model}`},
            {label:"When", value:dFlowData.slot},
            {label:"Where", value:`${dl.name}, ${dl.location}`},
            {label:"Name", value:name},
          ],
          footer:"Bring your driving licence. Takes about 30 mins, no obligation.",
        },
        quickReplies:["Ask about finance","Get a valuation","What's included in the price?"],
      });
      return;
    }

    // ── FLOW: Finance Options ──
    if (/💳|finance|monthly|pcp|hp |afford|payment/i.test(lower) && !dFlow) {
      setDFlow("finance");
      setDFlowData({deposit: Math.round(v.price * 0.1), term: 48});
      const dep = Math.round(v.price * 0.1);
      const pcpM = fin.monthly;
      const hpM = Math.round(fin.monthly * 1.15);
      addResp({
        role:"bot",
        text:`Here are your finance options on the ${v.make} ${v.model} at ${fmt(v.price)}:`,
        card: {
          type:"finance",
          options:[
            {name:"PCP", monthly:pcpM, apr:fin.apr, deposit:dep, term:48, balloon:fin.balloon, desc:"Lower monthly, option to return or buy at end"},
            {name:"HP", monthly:hpM, apr:fin.apr+0.5, deposit:dep, term:48, balloon:0, desc:"Higher monthly, but you own it outright"},
            {name:"PCH Lease", monthly:Math.round(v.price*0.015), apr:null, deposit:dep*3, term:48, balloon:null, desc:"Just hand it back, no ownership"},
          ],
          carPrice: v.price,
        },
        quickReplies:["Run a soft credit check","Adjust deposit amount","Which is best for me?"],
      });
      return;
    }

    // Handle credit check (in finance flow)
    if (dFlow === "finance" && /credit.?check|soft.?check|check.*score|apply|eligible/i.test(lower)) {
      setDTyping(true);
      await delay(1500);
      const score = 600 + Math.floor(Math.random() * 300);
      const approved = score > 650;
      setDFlow(null);
      addResp({
        role:"bot",
        text: approved ? `Great news! 🎉 Soft check complete — no impact on your credit score.` : `We've run the check — here are your results:`,
        card: {
          type:"confirmation",
          title: approved ? "Pre-Approved" : "Referred",
          icon: approved ? "✅" : "⏳",
          lines:[
            {label:"Status", value: approved ? "Pre-approved" : "Referred to underwriter"},
            {label:"Indicative APR", value:`${fin.apr}%`},
            {label:"Monthly (PCP)", value:`£${fin.monthly}/mo`},
            {label:"Credit Impact", value:"None (soft check)"},
          ],
          footer: approved ? "This is indicative. Final rate confirmed on full application." : "A specialist will review — usually 24-48 hours.",
        },
        quickReplies: approved ? ["Book a test drive","Proceed with application","Ask about part-exchange"] : ["Try another lender","Book a test drive","Ask a question"],
      });
      return;
    }

    // Handle deposit adjustment
    if (dFlow === "finance" && /adjust|change.*deposit|lower.*deposit|higher.*deposit|deposit.*(\d)/i.test(lower)) {
      const numMatch = lower.match(/(\d[\d,]*)/);
      const newDep = numMatch ? parseInt(numMatch[1].replace(/,/g,"")) : Math.round(v.price * 0.15);
      const pcpM = Math.round((v.price - newDep) / 48 * 1.08);
      const hpM = Math.round(pcpM * 1.15);
      setDFlowData({...dFlowData, deposit: newDep});
      addResp({
        role:"bot",
        text:`Updated with ${fmt(newDep)} deposit:`,
        card: {
          type:"finance",
          options:[
            {name:"PCP", monthly:pcpM, apr:fin.apr, deposit:newDep, term:48, balloon:Math.round(v.price*0.35), desc:"Lower monthly, option to return or buy"},
            {name:"HP", monthly:hpM, apr:fin.apr+0.5, deposit:newDep, term:48, balloon:0, desc:"Own it outright at the end"},
          ],
          carPrice: v.price,
        },
        quickReplies:["Run a soft credit check","Book a test drive","What about 60 months?"],
      });
      return;
    }

    // ── FLOW: Part Exchange ──
    if (/🔄|part.?ex|trade.?in|my.?car|swap|got.*to.?sell/i.test(lower) && !dFlow) {
      setDFlow("partex");
      setDFlowData({});
      addResp({
        role:"bot",
        text:`Happy to help with a part-exchange! What's the reg number and rough mileage of your current car?`,
        quickReplies:["I'll type the reg","I don't have a car to trade"],
      });
      return;
    }

    // Handle reg input (in part-ex flow)
    if (dFlow === "partex" && !dFlowData.valued) {
      if (/don.?t have|no car|no trade|skip/i.test(lower)) {
        setDFlow(null);
        addResp({
          role:"bot",
          text:`No problem at all! The ${v.make} ${v.model} is ${fmt(v.price)} as it stands. Anything else I can help with?`,
          quickReplies:["Ask about finance","Book a test drive","Negotiate the price"],
        });
        return;
      }
      // Try to parse a reg
      const regMatch = trimmed.match(/[A-Z]{2}\d{2}\s*[A-Z]{3}/i) || trimmed.match(/\b\w{2,4}\s?\w{3}\b/i);
      const mileMatch = lower.match(/(\d[\d,]+)\s*(k|miles|mi)/i);
      const estMiles = mileMatch ? parseInt(mileMatch[1].replace(/,/g,"")) * (mileMatch[2]==="k"?1000:1) : 25000 + Math.floor(Math.random()*30000);
      const pexVal = 8000 + Math.floor(Math.random()*14000);
      const net = v.price - pexVal;
      setDFlowData({valued:true, reg: regMatch?.[0]||trimmed.split(/\s/)[0], pexVal, miles:estMiles});
      setDFlow(null);
      addResp({
        role:"bot",
        text:`We've valued your car — here's the breakdown:`,
        card: {
          type:"confirmation",
          title:"Part-Exchange Valuation",
          icon:"🔄",
          lines:[
            {label:"Your Car", value: regMatch?.[0]||trimmed.split(/\s/)[0].toUpperCase()},
            {label:"Est. Mileage", value:fmtMi(estMiles)},
            {label:"Trade-In Value", value:fmt(pexVal)},
            {label:v.make+" "+v.model, value:fmt(v.price)},
            {label:"You Pay", value:fmt(Math.max(0,net)), highlight:true},
          ],
          footer:"Final valuation confirmed on inspection. We aim to beat online quotes.",
        },
        quickReplies:["Accept this valuation","Finance the remainder","Book a test drive"],
      });
      return;
    }

    // ── FLOW: Price Negotiation ──
    if (/negotiate|offer|best.?price|discount|deal|knock.*off|willing.*pay|reduce/i.test(lower) && !dFlow) {
      setDFlow("negotiate");
      setDFlowData({});
      addResp({
        role:"bot",
        text:`I understand you're looking for the best deal. The ${v.make} ${v.model} at ${fmt(v.price)} is rated "${v.priceRating}" against the market. ${v.daysListed > 21 ? "It's been with us " + v.daysListed + " days so there could be some flexibility." : "It's priced competitively but I'm open to a conversation."} What figure did you have in mind?`,
        quickReplies:[fmt(Math.round(v.price*0.95)),fmt(Math.round(v.price*0.93)),fmt(Math.round(v.price*0.9)),"Make me an offer"],
      });
      return;
    }

    // Handle offer amount (in negotiate flow)
    if (dFlow === "negotiate") {
      const numMatch = lower.replace(/[£,]/g,"").match(/(\d{4,6})/);
      if (numMatch) {
        const offer = parseInt(numMatch[1]);
        const diff = v.price - offer;
        const pct = diff / v.price;
        setDFlow(null);
        if (pct <= 0.03) {
          // Accept
          addResp({
            role:"bot",
            text:`You know what — you've got yourself a deal. 🤝`,
            card: {
              type:"confirmation", title:"Offer Accepted!", icon:"🎉",
              lines:[
                {label:"Original Price", value:fmt(v.price)},
                {label:"Your Offer", value:fmt(offer)},
                {label:"You Save", value:fmt(diff), highlight:true},
              ],
              footer:"This price is held for 48 hours. Come in or call to finalise.",
            },
            quickReplies:["Book a test drive","Ask about finance","Reserve this car"],
          });
        } else if (pct <= 0.07) {
          // Counter
          const counter = Math.round(v.price - diff * 0.5);
          addResp({
            role:"bot",
            text:`I appreciate the offer. I can't quite do ${fmt(offer)}, but I could meet you at ${fmt(counter)} — that's ${fmt(v.price - counter)} off the asking price. How does that sound?`,
            quickReplies:["Accept " + fmt(counter), fmt(Math.round((offer+counter)/2)), "I'll think about it"],
          });
        } else {
          // Too low
          addResp({
            role:"bot",
            text:`I appreciate the offer, but ${fmt(offer)} is quite a stretch from our asking price of ${fmt(v.price)}. The best I could realistically do is ${fmt(Math.round(v.price * 0.95))}. Would you like to discuss the full package — finance, part-exchange, extras — to make it work for your budget?`,
            quickReplies:["Ask about finance","Part-exchange my car","Book a test drive"],
          });
        }
        return;
      }
    }

    // ── DEFAULT: AI-powered response ──
    // Clear flow if switching topics
    if (dFlow && !/slot|deposit|reg|offer|accept/i.test(lower)) setDFlow(null);

    // Fallback responses
    const fb=()=>{const dq=text.toLowerCase();
      if(/available|in.?stock|still.?got/i.test(dq))return `Yes! The ${v.year} ${v.make} ${v.model} is here at our ${dl.location} showroom, ready to view or test drive. Would you like to book a slot?`;
      if(/warranty|guarantee|cover/i.test(dq))return `The ${v.make} ${v.model} comes with our standard 3-month warranty included. We also offer 6-month and 12-month extended warranties. ${v.make==="Kia"?"Plus Kia's 7-year manufacturer warranty still has time remaining — exceptional cover.":""}`;
      if(/deliver|collect|bring/i.test(dq))return `You're welcome to collect from our ${dl.location} showroom, or we deliver within 50 miles. Nationwide also available.`;
      return `The ${v.year} ${v.make} ${v.model} is at ${fmt(v.price)} with ${fmtMi(v.mileage)}. Would you like to book a test drive, discuss finance, or get a part-exchange valuation?`;
    };

    // Build dealer-persona prompt with full vehicle data
    const vehicleContext = buildVehicleContext(v);
    const dealerPrompt = SYSTEM_PROMPTS.dealer
      .replace("{DEALER_NAME}", dl.name)
      .replace("{DEALER_LOCATION}", dl.location)
      .replace("{DEALER_RATING}", dl.rating)
      .replace("{DEALER_REVIEWS}", dl.reviews);

    const hist=[...dMsgs,{role:"user",text}].map(m=>({role:m.role==="bot"?"assistant":"user",content:m.text||""})).filter(m=>m.content);
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
    }
    addResp(resp);
  };

  // Action functions
  const doRegLookup = () => { const q=regIn.toUpperCase().replace(/\s/g,""); const match=V.find(v=>v.vrm.replace(/\s/g,"")===q); setRegResult(match||V[Math.floor(Math.random()*V.length)]); };
  const doValuation = () => { const q=valReg.toUpperCase().replace(/\s/g,""); const match=V.find(v=>v.vrm.replace(/\s/g,"")===q); const base=match?match.price:15000+Math.floor(Math.random()*15000); setValResult({car:match||{year:2020,make:"Vehicle",model:"Found",variant:"",mileage:30000,fuel:"Petrol"},low:Math.round(base*0.92),mid:Math.round(base*0.96),high:Math.round(base*1.02)}); };
  const doPartEx = () => { const q=pexReg.toUpperCase().replace(/\s/g,""); const match=V.find(v=>v.vrm.replace(/\s/g,"")===q); const base=match?match.price:17500; setPexResult({car:match||{year:2021,make:"VW",model:"Golf",mileage:24500},low:Math.round(base*0.88),mid:Math.round(base*0.93),high:Math.round(base*0.97)}); };
  const doDealCheck = (vehicle) => { const r=vehicle||V[Math.floor(Math.random()*V.length)]; const savings=Math.round(r.price*0.03+Math.random()*r.price*0.05); setDealResult({vehicle:r,verdict:r.priceRating.includes("Great")?"Excellent":r.priceRating.includes("Good")?"Good":"Fair",savings,marketAvg:r.price+savings,confidence:75+Math.floor(Math.random()*20)}); };
  const doUlezCheck = () => { const q=ulezReg.toUpperCase().replace(/\s/g,""); const match=V.find(v=>v.vrm.replace(/\s/g,"")===q); setUlezResult(match||V[Math.floor(Math.random()*V.length)]); };
  const doHpiCheck = () => {const q=hpiReg.toUpperCase().replace(/\s/g,"");const match=V.find(v=>v.vrm.replace(/\s/g,"")===q);const car=match||V[Math.floor(Math.random()*V.length)];setHpiResult({car,free:{make:car.make,model:car.model,year:car.year,fuel:car.fuel,colour:car.colour,engineSize:car.engineSize,co2:car.co2,taxStatus:car.taxCost===0?"Taxed (£0)":"Taxed",taxDue:"01 Oct 2026",motStatus:"Valid",motExpiry:car.motExpiry,firstReg:"01 Mar "+car.year},premium:{financeOutstanding:Math.random()>0.85?"⚠️ YES — £8,420 outstanding":"✅ None recorded",stolen:"✅ Not recorded as stolen",writeOff:Math.random()>0.9?"⚠️ Cat N (2022)":"✅ No write-off recorded",scrapped:"✅ Not recorded as scrapped",plateChanges:Math.random()>0.7?`1 previous plate`:"None recorded",keeperChanges:`${car.previousKeepers+1} registered keepers`,mileageAnomaly:"✅ No mileage discrepancies found",importExport:"✅ UK registered — not imported",highRisk:Math.random()>0.92?"⚠️ Flagged":"✅ No high risk markers",vin:"WVW"+Math.random().toString(36).substring(2,12).toUpperCase()}}); };
  const doJourney=()=>{if(!journeyFrom&&!journeyTo)return;const dist=Math.round(5+Math.random()*80);const fuel=Math.round((dist/45)*4.546*1.45*100)/100;const tolls=dist>30?Math.random()>0.5?{name:"Dart Charge",cost:2.50}:null:null;const cong=journeyFrom.toLowerCase().includes("central")||journeyTo.toLowerCase().includes("central")?15:0;const ulez=cong>0?12.50:0;const park=3+Math.round(Math.random()*12);setJourneyResult({dist,time:Math.round(dist*1.8),fuel,tolls,cong,ulez,park,total:Math.round((fuel+(tolls?.cost||0)+cong+ulez+park)*100)/100});};

  const runAgent = async (type) => {
    setAgentType(type); setAgentRunning(true); setAgentSteps([]);
    const v = sel || V[Math.floor(Math.random()*V.length)];
    const fin = calcFin(v.price);

    const addStep = (t, delay=600) => new Promise(r => {
      setTimeout(() => { setAgentSteps(prev=>[...prev,{t}]); r(); }, delay);
    });

    try {
      if (type === "hunt") {
        await addStep("🔍 Scanning 450,000+ UK listings...", 400);
        await addStep("🎯 Filtering by your preferences...", 800);
        await addStep("📊 Analysing market pricing data...", 900);
        // Real AI call
        const prompt = `You're CarGPT Deal Hunter. Given these cars in stock, identify the top 3 deals and explain why in 1 line each. Be specific with numbers.\n${V.map(c=>`${c.year} ${c.make} ${c.model}: ${fmt(c.price)}, ${fmtMi(c.mileage)}, ${c.daysListed} days listed, rated "${c.priceRating}"`).join("\n")}\nFormat: numbered list, 1 line each, mention savings.`;
        const r = await callAI([{role:"user",content:prompt}], 250);
        const { text: clean } = parseSuggestions(r || "Found 3 great deals below market value!");
        await addStep("✅ " + clean, 400);
      }
      else if (type === "testdrive") {
        await addStep("📅 Checking dealer availability...", 400);
        await addStep(`🏪 Contacting ${V.slice(0,3).map(c=>c.location.split(",")[0]).join(", ")}...`, 900);
        await addStep("🗓️ Finding optimal schedule...", 700);
        const slots = ["Mon 10am","Tue 2pm","Wed 11am","Thu 3:30pm","Sat 10am"];
        const s1 = slots[Math.floor(Math.random()*slots.length)];
        const s2 = slots[Math.floor(Math.random()*slots.length)];
        await addStep(`✅ 2 test drives booked:\n• ${v.make} ${v.model} — ${s1} at ${v.location}\n• ${V.find(x=>x.id!==v.id)?.make} ${V.find(x=>x.id!==v.id)?.model} — ${s2}`, 400);
      }
      else if (type === "negotiate") {
        await addStep("📊 Analysing market position...", 400);
        await addStep(`💰 ${v.make} ${v.model} at ${fmt(v.price)} — rated "${v.priceRating}"`, 700);
        await addStep("🤝 Preparing negotiation strategy...", 800);
        const prompt = `You're CarGPT Price Negotiator. This ${v.year} ${v.make} ${v.model} is listed at ${fmt(v.price)} with ${fmtMi(v.mileage)}, rated "${v.priceRating}", listed ${v.daysListed} days. Give a 2-sentence negotiation result: what discount you got and why the dealer agreed. Be specific with £ amounts. Be realistic.`;
        const r = await callAI([{role:"user",content:prompt}], 150);
        const { text: clean } = parseSuggestions(r || `Negotiated £800 off — now ${fmt(v.price-800)}`);
        await addStep("✅ " + clean, 400);
      }
      else if (type === "partex") {
        await addStep("🚗 Looking up your vehicle...", 400);
        await addStep("📨 Requesting valuations from 4 dealers...", 1000);
        await addStep("⚖️ Comparing offers...", 800);
        const base = 8000 + Math.floor(Math.random()*12000);
        const offers = D.slice(0,4).map((d,i) => ({name:d.name, offer:base + (i===0?1200:i===1?800:i===2?-200:-600)}));
        offers.sort((a,b)=>b.offer-a.offer);
        await addStep(`✅ Best offer: ${fmt(offers[0].offer)} from ${offers[0].name}\n• ${offers[1].name}: ${fmt(offers[1].offer)}\n• ${offers[2].name}: ${fmt(offers[2].offer)}\n• ${offers[3].name}: ${fmt(offers[3].offer)}`, 400);
      }
      else if (type === "finance") {
        await addStep("📋 Running soft credit check (no impact)...", 400);
        await addStep("🏦 Querying 12 lenders...", 1000);
        await addStep(`💳 Comparing rates for ${fmt(v.price)}...`, 800);
        const prompt = `You're CarGPT Finance Shopper. For a ${v.year} ${v.make} ${v.model} at ${fmt(v.price)}, give the best finance result in 2 sentences: best APR rate, monthly payment on PCP with 10% deposit over 48 months, and which lender. Mention a second option briefly. Be specific with numbers.`;
        const r = await callAI([{role:"user",content:prompt}], 150);
        const { text: clean } = parseSuggestions(r || `Best rate: ${fin.apr}% APR with Black Horse — £${fin.monthly}/mo PCP`);
        await addStep("✅ " + clean, 400);
      }
      else if (type === "paperwork") {
        await addStep("📄 Generating V5C transfer checklist...", 400);
        await addStep("🛡️ Finding insurance quotes...", 900);
        await addStep("💰 Setting up tax reminder...", 700);
        await addStep(`✅ All sorted for ${v.make} ${v.model}:\n• V5C transfer guide ready\n• 3 insurance quotes found (from £${Math.round(300+v.insuranceGroup*18)}/yr)\n• Tax reminder set (£${v.taxCost}/yr)\n• Driveaway cover available`, 400);
      }
    } catch(e) {
      await addStep("✅ Complete — results ready", 400);
    }
    setAgentRunning(false);
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
              }}>{n.label}{n.key==="messages"&&(conversations||[]).length>0&&(conversations||[]).some(c=>c.user_unread_count>0)&&<span style={{width:7,height:7,borderRadius:"50%",background:"#DC2626",display:"inline-block",marginLeft:4,verticalAlign:"middle"}}/>}</button>
          )}
          <button className={`nav-link ${showTools?"active":""}`} onClick={()=>setShowTools(!showTools)}>Tools ▾</button>
        </div>
      </div>
      <div className="nav-right">
        <button className="nav-btn mob-tools-btn" onClick={()=>setShowTools(!showTools)} title="Tools" style={{position:"relative"}}>
          ☰
        </button>
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
          <input className={`ai-search-input${voiceActive==="main"?" voice-listening":""}`} placeholder={voiceActive==="main"?"Listening...":"Try \"family SUV under £25k with low insurance\"..."}
            value={heroIn} onChange={e=>setHeroIn(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter")sendChat(heroIn);}}/>
          <button className={`btn-mic hero-mic${voiceActive==="main"?" active":""}`} onClick={()=>toggleVoice("main",(t)=>{setHeroIn(t);setChatIn(t);})} title="Voice search">{voiceActive==="main"?stopSvg:micSvg}</button>
          <button className="ai-search-btn" onClick={()=>sendChat(heroIn)}>Search with AI</button>
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
    const parts = [];
    if (aiSearchQuery) parts.push(`"${aiSearchQuery}"`);
    else {
      if(fFuel!=="All") parts.push(fFuel);
      if(fBody!=="All") parts.push(fBody);
      if(fTrans!=="All") parts.push(fTrans);
      if(fPrice==="u15") parts.push("Under £15k"); else if(fPrice==="u20") parts.push("Under £20k"); else if(fPrice==="u25") parts.push("Under £25k"); else if(fPrice==="u30") parts.push("Under £30k"); else if(fPrice==="25+") parts.push("Over £25k");
      if(fInsurance==="low") parts.push("Low insurance");
      if(fUlez==="yes") parts.push("ULEZ");
      if(!parts.length) parts.push("All cars");
    }
    const name = parts.join(" · ");
    const newSearch = {id:Date.now(),name,filters:{fuel:fFuel,body:fBody,price:fPrice,trans:fTrans,miles:fMiles,year:fYear,insurance:fInsurance,ulez:fUlez,colour:fColour,doors:fDoors,query:aiSearchQuery},alertFreq:"instant",created:new Date().toISOString().split("T")[0],matchCount:filtered.length};
    setSavedSearches(p=>[newSearch,...p]);
    setNotifs(p=>[{id:Date.now(),type:"saved_search",title:"Search saved!",desc:`You'll get alerts for "${name}"`,time:"Just now",read:false,icon:"✅",color:"#059669"},...p]);
  };
  const deleteSearch = (id) => setSavedSearches(p=>p.filter(s=>s.id!==id));

  const SearchPage = () => {
    // Active filter tags
    const activeTags = [];
    if(fFuel!=="All") activeTags.push({label:fFuel, clear:()=>setFFuel("All")});
    if(fBody!=="All") activeTags.push({label:fBody, clear:()=>setFBody("All")});
    if(fPrice!=="All") activeTags.push({label:{u15:"Under £15k",u20:"Under £20k",u25:"Under £25k",u30:"Under £30k","25+":"Over £25k","15-25":"£15-25k"}[fPrice], clear:()=>setFPrice("All")});
    if(fTrans!=="All") activeTags.push({label:fTrans, clear:()=>setFTrans("All")});
    if(fMiles!=="All") activeTags.push({label:{u10:"Under 10k mi",u20:"Under 20k mi",u30:"Under 30k mi",u50:"Under 50k mi"}[fMiles], clear:()=>setFMiles("All")});
    if(fYear!=="All") activeTags.push({label:fYear, clear:()=>setFYear("All")});
    if(fInsurance!=="All") activeTags.push({label:{low:"Ins. 1-15",mid:"Ins. 16-25",high:"Ins. 26+"}[fInsurance], clear:()=>setFInsurance("All")});
    if(fUlez!=="All") activeTags.push({label:fUlez==="yes"?"ULEZ ✓":"Not ULEZ", clear:()=>setFUlez("All")});
    if(fColour!=="All") activeTags.push({label:fColour, clear:()=>setFColour("All")});
    if(fDoors!=="All") activeTags.push({label:fDoors+" door", clear:()=>setFDoors("All")});
    if(fEngine!=="All") activeTags.push({label:fEngine==="2.0+"?"2.0L+":"≤"+fEngine+"L", clear:()=>setFEngine("All")});
    if(fBhp!=="All") activeTags.push({label:{u150:"Under 150bhp","150-250":"150-250bhp","250+":"250+bhp"}[fBhp], clear:()=>setFBhp("All")});
    if(fBoot!=="All") activeTags.push({label:{s:"Small boot",m:"Medium boot",l:"Large boot"}[fBoot], clear:()=>setFBoot("All")});

    // Pill bar items — show current value if set
    const pills = [
      {label:fYear!=="All"?fYear:"Year", hasVal:fYear!=="All", key:"year"},
      {label:fPrice!=="All"?{u15:"Under £15k",u20:"Under £20k",u25:"Under £25k",u30:"Under £30k","25+":"Over £25k"}[fPrice]:"Price", hasVal:fPrice!=="All", key:"price"},
      {label:fMiles!=="All"?{u10:"Under 10k",u20:"Under 20k",u30:"Under 30k",u50:"Under 50k"}[fMiles]:"Mileage", hasVal:fMiles!=="All", key:"mileage"},
      {label:fTrans!=="All"?fTrans:"Gearbox", hasVal:fTrans!=="All", key:"gearbox"},
      {label:fBody!=="All"?fBody:"Body type", hasVal:fBody!=="All", key:"body"},
      {label:fFuel!=="All"?fFuel:"Fuel type", hasVal:fFuel!=="All", key:"fuel"},
      {label:fEngine!=="All"?(fEngine==="2.0+"?"2.0L+":"≤"+fEngine+"L"):"Engine size", hasVal:fEngine!=="All", key:"engine"},
      {label:fColour!=="All"?fColour:"Colour", hasVal:fColour!=="All", key:"colour"},
    ];

    return (
    <div className="section" style={{paddingBottom:80}}>
      {/* AI Search Banner */}
      {aiSearchQuery && (
        <div className="fade-in" style={{
          display:"flex",alignItems:"center",gap:10,padding:"10px 14px",marginBottom:14,
          background:"linear-gradient(135deg,#EEF2FF,#E0E7FF)",borderRadius:12,
          border:"1px solid #C7D2FE"
        }}>
          <span style={{fontSize:18}}>✨</span>
          <div style={{flex:1}}>
            <div className="text-xs text-muted">AI filtered results for</div>
            <div className="text-sm font-bold" style={{color:"#4338CA"}}>"{aiSearchQuery}"</div>
          </div>
          <button onClick={()=>{setAiSearchQuery("");clearAllFilters();}} style={{
            background:"rgba(67,56,202,0.1)",border:"none",borderRadius:8,padding:"6px 10px",
            cursor:"pointer",fontSize:11,fontWeight:600,color:"#4338CA"
          }}>Clear</button>
        </div>
      )}

      {/* Pill Bar — Auto Trader style */}
      <div className="filter-pills">
        {pills.map(p => (
          <button key={p.key} className={`filter-pill${p.hasVal?" has-value":""}`}
            onClick={()=>{setShowFilterPanel(true);setFilterAccordion(p.key);}}>
            {p.label} <span className="filter-pill-chevron">▾</span>
          </button>
        ))}
        <button className="filter-sort-btn" onClick={()=>{setShowFilterPanel(true);setFilterAccordion("sort");}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h10M4 18h4"/></svg>
          Filter and sort
          {activeFilterCount > 0 && <span style={{
            background:"#DC2626",color:"white",borderRadius:100,
            minWidth:18,height:18,fontSize:10,fontWeight:700,
            display:"inline-flex",alignItems:"center",justifyContent:"center"
          }}>{activeFilterCount}</span>}
        </button>
      </div>

      {/* Active filter tags */}
      {activeTags.length > 0 && (
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
          {activeTags.map((t,i) => (
            <span key={i} className="filter-tag">
              {t.label}
              <button className="filter-tag-x" onClick={t.clear}>✕</button>
            </span>
          ))}
          <button onClick={clearAllFilters} style={{
            background:"none",border:"none",cursor:"pointer",
            fontSize:12,fontWeight:600,color:"var(--error)",padding:"6px 8px"
          }}>Clear all</button>
        </div>
      )}

      {/* Results count + sort */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div className="text-sm">
          <strong>{filtered.length}</strong> <span className="text-muted">of {V.length} cars</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-outline btn-sm" onClick={()=>setShowSavedSearches(!showSavedSearches)} style={{fontSize:12,padding:"6px 12px"}}>
            🔔 {savedSearches.length}
          </button>
          <button className="btn btn-primary btn-sm" onClick={saveCurrentSearch} style={{fontSize:12,padding:"6px 12px"}}>
            💾 Save
          </button>
        </div>
      </div>

      {/* Saved Searches */}
      {showSavedSearches && (
        <div className="card mb-4 fade-in" style={{padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div className="text-sm font-bold">Saved Searches</div>
            <button onClick={()=>setShowSavedSearches(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text-muted)"}}>✕</button>
          </div>
          {savedSearches.length === 0 ? (
            <div className="text-sm text-muted text-center" style={{padding:20}}>No saved searches yet</div>
          ) : savedSearches.map(s => (
            <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--border-light)"}}>
              <div style={{flex:1,cursor:"pointer"}} onClick={()=>{
                clearAllFilters();
                setFFuel(s.filters.fuel||"All");setFBody(s.filters.body||"All");setFPrice(s.filters.price||"All");
                setFTrans(s.filters.trans||"All");setFMiles(s.filters.miles||"All");setFYear(s.filters.year||"All");
                setFInsurance(s.filters.insurance||"All");setFUlez(s.filters.ulez||"All");
                setFColour(s.filters.colour||"All");setFDoors(s.filters.doors||"All");
                if(s.filters.query) setAiSearchQuery(s.filters.query);
                setShowSavedSearches(false);
              }}>
                <div className="text-sm font-bold">{s.name}</div>
                <div className="text-xs text-muted">{s.matchCount} matches · {s.alertFreq}</div>
              </div>
              <button onClick={()=>deleteSearch(s.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"var(--text-muted)"}}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{width:64,height:64,borderRadius:16,background:"var(--skeleton)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:16}}>🔍</div>
          <div className="text-md font-bold mb-2">No cars match</div>
          <div className="text-sm text-muted mb-4">Try removing some filters</div>
          <button className="btn btn-primary" onClick={clearAllFilters}>Reset filters</button>
        </div>
      ) : (
        <div className="vehicle-grid">{filtered.map(v => VCard({v}))}</div>
      )}

      {/* Filter & Sort Panel — full-screen slide-over */}
      {showFilterPanel && (<>
        <div className="modal-backdrop" onClick={()=>setShowFilterPanel(false)}/>
        <div className="slide-over" style={{overflowY:"auto"}}>
          <div className="slide-header">
            <div className="slide-title">Filter and sort</div>
            <button className="slide-close" onClick={()=>setShowFilterPanel(false)}>✕</button>
          </div>
          <div style={{padding:"0 24px 100px"}}>
            {/* Saved search link */}
            {!user && (
              <div style={{padding:"12px 16px",margin:"16px 0",background:"var(--surface-hover)",borderRadius:10,textAlign:"center"}}>
                <button onClick={()=>{setShowFilterPanel(false);setAuthModal("login");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,fontWeight:600,color:"var(--primary)"}}>
                  Sign in to see your saved searches →
                </button>
              </div>
            )}

            {/* Clear + count */}
            {activeFilterCount > 0 && (
              <div className="fp-clear-row">
                <span className="text-sm text-muted">{activeFilterCount} filter{activeFilterCount>1?"s":""} active</span>
                <button onClick={clearAllFilters} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,color:"var(--error)"}}>Clear all</button>
              </div>
            )}

            {/* Accordion Rows */}
            {[
              {key:"sort",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h12M3 18h6"/></svg>,label:"Sort",value:{match:"Relevance","price-low":"Price: low","price-high":"Price: high",newest:"Newest",deal:"Best deal","miles-low":"Low mileage",insurance:"Low insurance"}[fSort],
                opts:[{k:"match",l:"Relevance"},{k:"price-low",l:"Price: low to high"},{k:"price-high",l:"Price: high to low"},{k:"newest",l:"Newest listed"},{k:"deal",l:"Best deal"},{k:"miles-low",l:"Lowest mileage"},{k:"insurance",l:"Lowest insurance"}],
                val:fSort,set:setFSort},
              {key:"price",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/></svg>,label:"Price",value:fPrice==="All"?"Any":{u15:"Under £15k",u20:"Under £20k",u25:"Under £25k",u30:"Under £30k","25+":"Over £25k"}[fPrice],
                opts:[{k:"All",l:"Any price"},{k:"u15",l:"Under £15,000"},{k:"u20",l:"Under £20,000"},{k:"u25",l:"Under £25,000"},{k:"u30",l:"Under £30,000"},{k:"25+",l:"Over £25,000"}],
                val:fPrice,set:setFPrice},
              {key:"year",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,label:"Year",value:fYear==="All"?"Any":fYear+" onwards",
                opts:[{k:"All",l:"Any year"},{k:"2024+",l:"2024 onwards"},{k:"2022+",l:"2022 onwards"},{k:"2020+",l:"2020 onwards"}],
                val:fYear,set:setFYear},
              {key:"mileage",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,label:"Mileage",value:fMiles==="All"?"Any":{u10:"Under 10k",u20:"Under 20k",u30:"Under 30k",u50:"Under 50k"}[fMiles],
                opts:[{k:"All",l:"Any mileage"},{k:"u10",l:"Under 10,000"},{k:"u20",l:"Under 20,000"},{k:"u30",l:"Under 30,000"},{k:"u50",l:"Under 50,000"}],
                val:fMiles,set:setFMiles},
              {key:"gearbox",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M6 8v10M18 8v10M8 6h8"/></svg>,label:"Gearbox",value:fTrans==="All"?"Any":fTrans,
                opts:[{k:"All",l:"Any"},{k:"Automatic",l:"Automatic"},{k:"Manual",l:"Manual"}],
                val:fTrans,set:setFTrans},
              {key:"body",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17h14M5 17a2 2 0 01-2-2V9l3-5h12l3 5v6a2 2 0 01-2 2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>,label:"Body type",value:fBody==="All"?"Any":fBody,
                opts:[{k:"All",l:"Any"},{k:"Hatchback",l:"Hatchback"},{k:"Saloon",l:"Saloon"},{k:"SUV",l:"SUV"}],
                val:fBody,set:setFBody},
              {key:"fuel",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22V6l3-4h6l3 4v16"/><path d="M3 14h12M15 6l3 3v8a2 2 0 004 0V10"/></svg>,label:"Fuel type",value:fFuel==="All"?"Any":fFuel,
                opts:[{k:"All",l:"Any"},{k:"Petrol",l:"Petrol"},{k:"Diesel",l:"Diesel"},{k:"Electric",l:"Electric"},{k:"Hybrid",l:"Hybrid"}],
                val:fFuel,set:setFFuel},
              {key:"colour",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z"/><circle cx="7.5" cy="11.5" r="1.5"/><circle cx="12" cy="7.5" r="1.5"/><circle cx="16.5" cy="11.5" r="1.5"/></svg>,label:"Colour",value:fColour==="All"?"Any":fColour,
                opts:[{k:"All",l:"Any colour"},...[...new Set(V.map(v=>v.colour))].sort().map(c=>({k:c,l:c}))],
                val:fColour,set:setFColour},
              {key:"doors",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>,label:"Doors",value:fDoors==="All"?"Any":fDoors+" door",
                opts:[{k:"All",l:"Any"},{k:"3",l:"3 door"},{k:"5",l:"5 door"}],
                val:fDoors,set:setFDoors},
              {key:"engine",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="8" width="16" height="10" rx="2"/><path d="M8 8V5h8v3M12 12v3"/></svg>,label:"Engine size",value:fEngine==="All"?"Any":fEngine==="2.0+"?"Over 2.0L":"Up to "+fEngine+"L",
                opts:[{k:"All",l:"Any"},{k:"1.0",l:"Up to 1.0L"},{k:"1.5",l:"Up to 1.5L"},{k:"2.0",l:"Up to 2.0L"},{k:"2.0+",l:"Over 2.0L"}],
                val:fEngine,set:setFEngine},
              {key:"bhp",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,label:"Engine power",value:fBhp==="All"?"Any":{u150:"Under 150bhp","150-250":"150-250bhp","250+":"250+ bhp"}[fBhp],
                opts:[{k:"All",l:"Any"},{k:"u150",l:"Under 150 bhp"},{k:"150-250",l:"150-250 bhp"},{k:"250+",l:"250+ bhp"}],
                val:fBhp,set:setFBhp},
              {key:"boot",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 8h-3V4H7v4H4l-2 6v6h4l1-2h10l1 2h4v-6l-2-6z"/></svg>,label:"Boot space",value:fBoot==="All"?"Any":{s:"Small (<350L)",m:"Medium (350-500L)",l:"Large (500L+)"}[fBoot],
                opts:[{k:"All",l:"Any"},{k:"s",l:"Small (under 350L)"},{k:"m",l:"Medium (350-500L)"},{k:"l",l:"Large (500L+)"}],
                val:fBoot,set:setFBoot},
              {key:"insurance",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,label:"Insurance group",value:fInsurance==="All"?"Any":{low:"Group 1-15",mid:"Group 16-25",high:"Group 26+"}[fInsurance],
                opts:[{k:"All",l:"Any"},{k:"low",l:"Low (group 1-15)"},{k:"mid",l:"Mid (group 16-25)"},{k:"high",l:"High (group 26+)"}],
                val:fInsurance,set:setFInsurance},
              {key:"ulez",icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/><path d="M8 12l3 3 5-5"/></svg>,label:"ULEZ",value:fUlez==="All"?"Any":fUlez==="yes"?"Compliant":"Not compliant",
                opts:[{k:"All",l:"Any"},{k:"yes",l:"ULEZ compliant"},{k:"no",l:"Not ULEZ compliant"}],
                val:fUlez,set:setFUlez},
            ].map(row => (
              <div key={row.key}>
                <div className="fp-row" onClick={()=>setFilterAccordion(filterAccordion===row.key?null:row.key)}>
                  <div className="fp-row-left">
                    <div className="fp-row-icon">{row.icon}</div>
                    <div>
                      <div className="fp-row-label">{row.label}</div>
                      <div className="fp-row-value">{row.value}</div>
                    </div>
                  </div>
                  <span className={`fp-row-chevron ${filterAccordion===row.key?"open":""}`}>▾</span>
                </div>
                {filterAccordion===row.key && (
                  <div className="fp-options">
                    {row.opts.map(o => (
                      <button key={o.k} className={`fp-option${row.val===o.k?" active":""}`}
                        onClick={()=>row.set(o.k)}>{o.l}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sticky bottom bar */}
          <div style={{
            position:"sticky",bottom:0,padding:"16px 24px",
            background:"var(--surface)",borderTop:"1px solid var(--border)",
            display:"flex",gap:12
          }}>
            <button className="btn btn-outline" style={{flex:1}} onClick={clearAllFilters}>Clear all</button>
            <button className="btn btn-primary" style={{flex:2}} onClick={()=>setShowFilterPanel(false)}>
              Show {filtered.length} car{filtered.length!==1?"s":""}
            </button>
          </div>
        </div>
      </>)}
    </div>
    );
  };

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

    const favCars = V.filter(v=>favs.includes(v.id));
    // Sort
    const sorted = [...favCars].sort((a,b) => {
      if(favSort==="price-low") return a.price - b.price;
      if(favSort==="price-high") return b.price - a.price;
      if(favSort==="mileage") return a.mileage - b.mileage;
      return favs.indexOf(a.id) - favs.indexOf(b.id); // added order
    });

    // Simulated price changes for demo
    const priceChanges = {1:-500, 3:-1200, 5:-200};
    const totalValue = favCars.reduce((a,v)=>a+v.price,0);
    const avgPrice = favCars.length ? Math.round(totalValue/favCars.length) : 0;
    const alertCount = Object.values(favAlerts).filter(Boolean).length;

    return (
      <div className="section" style={{paddingBottom:80}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div>
            <div className="text-lg font-extra">Saved Cars</div>
            <div className="text-sm text-muted">{favs.length} car{favs.length!==1?"s":""} saved</div>
          </div>
          {favs.length > 0 && (
            <button className="btn btn-outline btn-sm" style={{fontSize:12}} onClick={()=>{
              if(favCars.length>=2){setFavView("compare");}
            }}>⚖️ Compare all</button>
          )}
        </div>

        {favs.length === 0 ? (
          <div className="card text-center" style={{padding:60}}>
            <div style={{fontSize:48,marginBottom:12}}>🤍</div>
            <div className="text-md font-bold mb-2">No saved cars yet</div>
            <div className="text-sm text-muted mb-4">Tap the heart on any car to save it here</div>
            <button className="btn btn-primary" onClick={()=>setPage("search")}>Browse Cars</button>
          </div>
        ) : (<>
          {/* Stats row */}
          <div className="fav-stat-row">
            <div className="fav-stat-cell">
              <div className="fav-stat-val">{favs.length}</div>
              <div className="fav-stat-label">Saved</div>
            </div>
            <div className="fav-stat-cell">
              <div className="fav-stat-val">{fmt(avgPrice)}</div>
              <div className="fav-stat-label">Avg Price</div>
            </div>
            <div className="fav-stat-cell">
              <div className="fav-stat-val" style={{color:alertCount>0?"var(--success)":"var(--text-muted)"}}>{alertCount}</div>
              <div className="fav-stat-label">Alerts On</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="fav-toolbar">
            <div className="fav-view-toggle">
              {[{k:"grid",l:"Grid"},{k:"list",l:"List"},{k:"compare",l:"Compare"}].map(v=>(
                <button key={v.k} className={`fav-view-btn${favView===v.k?" active":""}`} onClick={()=>setFavView(v.k)}>{v.l}</button>
              ))}
            </div>
            <select className="filter-select" value={favSort} onChange={e=>setFavSort(e.target.value)} style={{padding:"6px 28px 6px 10px",fontSize:12}}>
              <option value="added">Recently added</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="mileage">Lowest mileage</option>
            </select>
          </div>

          {/* GRID VIEW */}
          {favView==="grid" && (
            <div className="vehicle-grid">
              {sorted.map(v => {
                const drop = priceChanges[v.id];
                return (
                  <div key={v.id} style={{position:"relative"}}>
                    {VCard({v})}
                    {/* Overlay extras */}
                    <div style={{padding:"0 4px",marginTop:-8}}>
                      {drop && <div className="fav-price-drop" style={{marginBottom:4}}>↓ {fmt(Math.abs(drop))} price drop</div>}
                      <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                        {favNotes[v.id] && <span className="fav-note-badge">📝 {favNotes[v.id]}</span>}
                        {favAlerts[v.id] && <span className="fav-alert-badge">🔔 Alert on</span>}
                      </div>
                      <div style={{display:"flex",gap:6,marginTop:6}}>
                        <button className="btn btn-outline btn-sm" style={{fontSize:10,padding:"4px 10px",flex:1}} onClick={(e)=>{
                          e.stopPropagation();
                          setFavEditNote(favEditNote===v.id?null:v.id);
                          setFavNoteText(favNotes[v.id]||"");
                        }}>📝 Note</button>
                        <button className={`btn btn-sm ${favAlerts[v.id]?"btn-primary":"btn-outline"}`} style={{fontSize:10,padding:"4px 10px",flex:1}} onClick={(e)=>{
                          e.stopPropagation();
                          setFavAlerts(p=>({...p,[v.id]:!p[v.id]}));
                        }}>{favAlerts[v.id]?"🔔 Alert on":"🔕 Set alert"}</button>
                      </div>
                      {favEditNote===v.id && (
                        <div className="fade-in" style={{marginTop:8}}>
                          <textarea className="input" placeholder="Add a note about this car..." value={favNoteText} onChange={e=>setFavNoteText(e.target.value)}
                            style={{width:"100%",minHeight:60,fontSize:12,resize:"vertical",marginBottom:6}}/>
                          <div style={{display:"flex",gap:6}}>
                            <button className="btn btn-primary btn-sm" style={{flex:1,fontSize:11}} onClick={()=>{
                              setFavNotes(p=>({...p,[v.id]:favNoteText}));
                              setFavEditNote(null);
                            }}>Save</button>
                            {favNotes[v.id] && <button className="btn btn-outline btn-sm" style={{fontSize:11,color:"var(--error)"}} onClick={()=>{
                              setFavNotes(p=>{const n={...p};delete n[v.id];return n;});
                              setFavEditNote(null);
                            }}>Delete</button>}
                            <button className="btn btn-outline btn-sm" style={{fontSize:11}} onClick={()=>setFavEditNote(null)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {favView==="list" && (
            <div>
              {sorted.map(v => {
                const drop = priceChanges[v.id];
                const fin = calcFin(v.price);
                return (
                  <div key={v.id} className="fav-list-item" onClick={()=>{setSel(v);setPage("search");setGalleryAngle(1);setDetailTab("details");}}>
                    <div className="fav-list-img">
                      <img src={carImg(v.make,v.model,v.year)} alt={v.make}/>
                    </div>
                    <div className="fav-list-info">
                      <div className="text-sm font-bold" style={{marginBottom:2}}>{v.year} {v.make} {v.model}</div>
                      <div className="text-xs text-muted" style={{marginBottom:4}}>{v.variant} · {fmtMi(v.mileage)} · {v.fuel} · {v.transmission}</div>
                      <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                        <span className={`badge ${v.priceRating.includes("Great")?"badge-green":"badge-green"}`} style={{fontSize:10}}>{v.priceRating}</span>
                        {drop && <span className="fav-price-drop">↓ {fmt(Math.abs(drop))}</span>}
                        {favNotes[v.id] && <span className="fav-note-badge" style={{fontSize:10}}>📝 {favNotes[v.id]}</span>}
                        {favAlerts[v.id] && <span className="fav-alert-badge">🔔</span>}
                      </div>
                    </div>
                    <div className="fav-list-actions">
                      <div className="text-md font-extra">{fmt(v.price)}</div>
                      <div className="text-xs text-muted">£{fin.monthly}/mo</div>
                      <div style={{display:"flex",gap:4,marginTop:4}}>
                        <button className="btn btn-outline btn-sm" style={{fontSize:10,padding:"3px 8px"}} onClick={(e)=>{
                          e.stopPropagation();
                          setFavAlerts(p=>({...p,[v.id]:!p[v.id]}));
                        }}>{favAlerts[v.id]?"🔔":"🔕"}</button>
                        <button className="btn btn-outline btn-sm" style={{fontSize:10,padding:"3px 8px",color:"var(--error)"}} onClick={(e)=>{
                          e.stopPropagation(); toggleFav(v.id);
                        }}>✕</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* COMPARE VIEW */}
          {favView==="compare" && favCars.length >= 2 && (
            <div style={{overflowX:"auto"}}>
              <div className="card" style={{padding:0,minWidth:favCars.length*160+120}}>
                <div className="fav-compare-grid" style={{gridTemplateColumns:`120px repeat(${sorted.length},1fr)`}}>
                  {/* Header row — car images + names */}
                  <div className="fav-compare-header"/>
                  {sorted.map(v=>(
                    <div key={v.id} className="fav-compare-header" style={{cursor:"pointer"}} onClick={()=>{setSel(v);setPage("search");setGalleryAngle(1);setDetailTab("details");}}>
                      <div style={{width:60,height:40,borderRadius:8,overflow:"hidden",margin:"0 auto 6px",background:"var(--skeleton)"}}>
                        <img src={carImg(v.make,v.model,v.year)} alt={v.make} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      </div>
                      <div style={{fontSize:11,fontWeight:700}}>{v.make} {v.model}</div>
                      <div style={{fontSize:10,color:"var(--text-tertiary)"}}>{v.year}</div>
                    </div>
                  ))}

                  {/* Data rows */}
                  {[
                    {label:"Price",get:v=>fmt(v.price),best:(vals)=>{const prices=vals.map(v=>v.price);return prices.indexOf(Math.min(...prices));}},
                    {label:"Monthly",get:v=>"£"+calcFin(v.price).monthly+"/mo"},
                    {label:"Mileage",get:v=>fmtMi(v.mileage),best:(vals)=>{const m=vals.map(v=>v.mileage);return m.indexOf(Math.min(...m));}},
                    {label:"Year",get:v=>""+v.year,best:(vals)=>{const y=vals.map(v=>v.year);return y.indexOf(Math.max(...y));}},
                    {label:"Fuel",get:v=>v.fuel},
                    {label:"Power",get:v=>v.specs.bhp+"bhp",best:(vals)=>{const b=vals.map(v=>v.specs.bhp);return b.indexOf(Math.max(...b));}},
                    {label:"0-62",get:v=>v.specs.acceleration+"s",best:(vals)=>{const a=vals.map(v=>v.specs.acceleration);return a.indexOf(Math.min(...a));}},
                    {label:"Economy",get:v=>typeof v.specs.fuelEconomy==="number"?v.specs.fuelEconomy+" mpg":""+v.specs.fuelEconomy},
                    {label:"Boot",get:v=>v.specs.bootSpace+"L",best:(vals)=>{const b=vals.map(v=>v.specs.bootSpace);return b.indexOf(Math.max(...b));}},
                    {label:"Insurance",get:v=>"Group "+v.insuranceGroup,best:(vals)=>{const ig=vals.map(v=>v.insuranceGroup);return ig.indexOf(Math.min(...ig));}},
                    {label:"Tax",get:v=>v.taxCost===0?"FREE":"£"+v.taxCost+"/yr",best:(vals)=>{const t=vals.map(v=>v.taxCost);return t.indexOf(Math.min(...t));}},
                    {label:"Rating",get:v=>v.priceRating},
                    {label:"ULEZ",get:v=>v.ulezCompliant?"✅ Yes":"❌ No"},
                  ].map((row,ri) => (
                    <React.Fragment key={ri}>
                    <div className="fav-compare-label">{row.label}</div>
                    {sorted.map((v,vi) => {
                      const isBest = row.best ? row.best(sorted) === vi : false;
                      return <div key={v.id} className="fav-compare-cell" style={{fontWeight:isBest?700:400,color:isBest?"var(--success)":"var(--text)"}}>{row.get(v)}</div>;
                    })}
                  </React.Fragment>))}

                  {/* Action row */}
                  <div className="fav-compare-label">Actions</div>
                  {sorted.map(v=>(
                    <div key={v.id} className="fav-compare-cell" style={{padding:"8px 6px"}}>
                      <button className="btn btn-primary btn-sm btn-block" style={{fontSize:10,padding:"5px 8px",marginBottom:4}} onClick={()=>{setSel(v);setPage("search");setGalleryAngle(1);setDetailTab("details");}}>View</button>
                      <button className="btn btn-outline btn-sm btn-block" style={{fontSize:10,padding:"5px 8px"}} onClick={()=>openDChat(v.id)}>Message</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted mt-3" style={{textAlign:"center"}}>Green values show the best in each category. Scroll horizontally for more.</div>
            </div>
          )}

          {favView==="compare" && favCars.length < 2 && (
            <div className="card text-center" style={{padding:40}}>
              <div style={{fontSize:32,marginBottom:8}}>⚖️</div>
              <div className="text-sm font-bold mb-2">Save at least 2 cars to compare</div>
              <div className="text-xs text-muted">Add more cars from Browse to unlock comparison</div>
            </div>
          )}
        </>)}
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

    const g = GARAGE[0];
    const today = new Date();
    const daysBetween = (d) => Math.ceil((new Date(d) - today) / (1000*60*60*24));
    const motDays = daysBetween(g.motExpiry);
    const taxDays = daysBetween(g.taxExpiry);
    const insDays = 94; // simulated
    const serviceMiles = 2500; // simulated

    const ringColor = (days) => days <= 14 ? "#DC2626" : days <= 30 ? "#F59E0B" : "#22C55E";
    const ringPct = (days, max=365) => Math.min(Math.max(days/max, 0), 1);

    const CountdownRing = ({days, label, date, icon, max=365}) => {
      const r = 30, circ = 2 * Math.PI * r;
      const col = ringColor(days);
      const pct = ringPct(days, max);
      return (
        <div className="countdown-card">
          <div className="countdown-ring">
            <svg width="72" height="72"><circle cx="36" cy="36" r={r} fill="none" stroke="#F3F4F6" strokeWidth="5"/>
            <circle cx="36" cy="36" r={r} fill="none" stroke={col} strokeWidth="5" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}/></svg>
            <div><div className="countdown-days" style={{color:col}}>{days}</div><div className="countdown-unit">days</div></div>
          </div>
          <div className="countdown-label">{icon} {label}</div>
          <div className="countdown-date">{date}</div>
        </div>
      );
    };

    const total6m = EXPENSES.reduce((a,m)=>a+m.fuel+m.insurance+m.tax+m.mot+m.service+m.parking+m.tolls+m.other,0);
    const monthlyAvg = Math.round(total6m / EXPENSES.length);
    const cats = [
      {l:"Fuel",v:EXPENSES.reduce((a,m)=>a+m.fuel,0),col:"#3B82F6"},
      {l:"Insurance",v:EXPENSES.reduce((a,m)=>a+m.insurance,0),col:"#8B5CF6"},
      {l:"Tax",v:EXPENSES.reduce((a,m)=>a+m.tax,0),col:"#F59E0B"},
      {l:"Servicing",v:EXPENSES.reduce((a,m)=>a+m.service+m.mot,0),col:"#22C55E"},
      {l:"Parking",v:EXPENSES.reduce((a,m)=>a+m.parking,0),col:"#EC4899"},
      {l:"Other",v:EXPENSES.reduce((a,m)=>a+m.tolls+m.other,0),col:"#6B7280"},
    ].filter(c=>c.v>0).sort((a,b)=>b.v-a.v);
    const maxCat = cats[0]?.v || 1;

    return (
    <div className="section" style={{paddingBottom:80}}>
      {/* Hero Car Card */}
      <div className="garage-hero">
        <div className="garage-hero-img" style={{display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
          <img src={carImg(g.make,g.model,g.year)} alt={g.make} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
        <div className="garage-vrm">{g.vrm}</div>
        <div style={{fontSize:22,fontWeight:800,marginBottom:2}}>{g.year} {g.make} {g.model}</div>
        <div style={{fontSize:13,opacity:0.6}}>{g.variant} · {g.colour} · {fmtMi(g.mileage)}</div>
        <div className="garage-stat-row">
          <div className="garage-stat">
            <div className="garage-stat-val">{fmt(g.value)}</div>
            <div className="garage-stat-label">Est. Value</div>
          </div>
          <div className="garage-stat">
            <div className="garage-stat-val">{fmt(monthlyAvg)}</div>
            <div className="garage-stat-label">Monthly Cost</div>
          </div>
          <div className="garage-stat">
            <div className="garage-stat-val" style={{color:motDays<=30?"#FCA5A5":"#86EFAC"}}>{motDays}d</div>
            <div className="garage-stat-label">MOT Due</div>
          </div>
        </div>
      </div>

      {/* Countdown Rings */}
      <div className="countdown-grid">
        <CountdownRing days={motDays} label="MOT" date={g.motExpiry} icon="📋"/>
        <CountdownRing days={taxDays} label="Road Tax" date={g.taxExpiry} icon="💰"/>
        <CountdownRing days={insDays} label="Insurance" date="2026-06-01" icon="🛡️"/>
        <div className="countdown-card">
          <div className="countdown-ring">
            <svg width="72" height="72"><circle cx="36" cy="36" r="30" fill="none" stroke="#F3F4F6" strokeWidth="5"/>
            <circle cx="36" cy="36" r="30" fill="none" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={2*Math.PI*30} strokeDashoffset={2*Math.PI*30*(1-serviceMiles/10000)}/></svg>
            <div><div className="countdown-days" style={{color:"#3B82F6",fontSize:16}}>~{(serviceMiles/1000).toFixed(1)}k</div><div className="countdown-unit">miles</div></div>
          </div>
          <div className="countdown-label">🔧 Service</div>
          <div className="countdown-date">Next due ~{(serviceMiles).toLocaleString()} mi</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="garage-actions">
        {[
          {icon:"💷",label:"Value Car",action:()=>{setValReg(g.vrm);setValResult(null);openModal("valuation");}},
          {icon:"📊",label:"Costs",action:()=>openModal("costs")},
          {icon:"🔧",label:"Service",action:()=>openModal("service")},
          {icon:"⚠️",label:"Lights",action:()=>openModal("warning")},
          {icon:"📋",label:"MOT History",action:()=>{/* scroll to timeline */}},
          {icon:"🏢",label:"BIK Tax",action:()=>openModal("companycar")},
          {icon:"🚨",label:"Accident",action:()=>openModal("accident")},
          {icon:"🤖",label:"Ask AI",action:()=>{sendChat(`Tell me about my ${g.year} ${g.make} ${g.model}. How is it holding its value?`);}},
        ].map((a,i) => (
          <div key={i} className="garage-action" onClick={a.action}>
            <div className="garage-action-icon">{a.icon}</div>
            <div className="garage-action-label">{a.label}</div>
          </div>
        ))}
      </div>

      {/* Running Costs Summary */}
      <div className="card mb-4">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div className="text-sm font-bold">Running Costs</div>
            <div className="text-xs text-muted">Last 6 months</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="text-lg font-extra" style={{color:"var(--primary)"}}>{fmt(total6m)}</div>
            <div className="text-xs text-muted">~{fmt(monthlyAvg)}/mo</div>
          </div>
        </div>
        {cats.map((c,i) => (
          <div key={i} className="cost-bar-row">
            <div className="cost-bar-label" style={{color:c.col,fontWeight:600}}>{c.l}</div>
            <div className="cost-bar-track">
              <div className="cost-bar-fill" style={{width:`${(c.v/maxCat)*100}%`,background:c.col}}/>
            </div>
            <div className="cost-bar-val">{fmt(c.v)}</div>
          </div>
        ))}
        {/* Monthly sparkline */}
        <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--border-light)"}}>
          <div className="text-xs text-muted mb-2">Monthly spend</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:4,height:48}}>
            {EXPENSES.map((m,i) => {
              const t = m.fuel+m.insurance+m.tax+m.mot+m.service+m.parking+m.tolls+m.other;
              const maxM = 520;
              return (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div style={{
                    width:"100%",height:`${(t/maxM)*40}px`,minHeight:4,
                    background:"var(--primary)",borderRadius:4,opacity:0.15+0.85*(t/maxM)
                  }}/>
                  <div className="text-xs text-muted" style={{fontSize:9}}>{m.month}</div>
                </div>
              );
            })}
          </div>
        </div>
        <button className="btn btn-outline btn-block mt-3" onClick={()=>openModal("costs")} style={{fontSize:13}}>View full breakdown →</button>
      </div>

      {/* Service Timeline */}
      <div className="card mb-4">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div className="text-sm font-bold">Service History</div>
          <button className="btn btn-primary btn-sm" onClick={()=>openModal("service")} style={{fontSize:12}}>Book service</button>
        </div>
        <div className="timeline">
          {g.services.map((s,i) => (
            <div key={i} className="timeline-item">
              <div className={`timeline-dot ${i===0?"":"green"}`}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div className="text-sm font-bold">{s.type}</div>
                  <div className="text-xs text-muted">{s.date} · {s.garage}</div>
                </div>
                <span className="text-sm font-bold">{fmt(s.cost)}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{paddingLeft:28,paddingTop:4}} className="text-xs text-muted">
          Total: <strong>{fmt(g.services.reduce((a,s)=>a+s.cost,0))}</strong> across {g.services.length} services
        </div>
      </div>

      {/* Car Health Check */}
      <div className="card mb-4">
        <div className="text-sm font-bold mb-3">Vehicle Health</div>
        {[
          {label:"HPI Clear",val:"✅ No issues",col:"var(--success)"},
          {label:"Service History",val:"✅ Full history",col:"var(--success)"},
          {label:"Previous Keepers",val:"1",col:"var(--text)"},
          {label:"Euro Emissions",val:"Euro 6d",col:"var(--text)"},
          {label:"ULEZ Compliant",val:"✅ Yes",col:"var(--success)"},
        ].map((h,i) => (
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<4?"1px solid var(--border-light)":"none"}}>
            <span className="text-sm text-muted">{h.label}</span>
            <span className="text-sm font-bold" style={{color:h.col}}>{h.val}</span>
          </div>
        ))}
      </div>

      {/* Add another car */}
      <div className="card" style={{
        textAlign:"center",padding:24,border:"2px dashed var(--border)",
        background:"transparent",cursor:"pointer"
      }} onClick={()=>openModal("valuation")}>
        <div style={{fontSize:28,marginBottom:8}}>➕</div>
        <div className="text-sm font-bold">Add another car</div>
        <div className="text-xs text-muted">Enter a reg to add to your garage</div>
      </div>
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

    const Toggle = ({on, onToggle}) => (
      <button className={`toggle-switch${on?" on":""}`} onClick={onToggle}>
        <div className="toggle-knob"/>
      </button>
    );

    const joined = user.joined ? new Date(user.joined).toLocaleDateString("en-GB",{month:"long",year:"numeric"}) : "February 2026";

    return (
      <div className="section" style={{paddingBottom:80, maxWidth:600}}>
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">{user.name?.charAt(0)?.toUpperCase()||"U"}</div>
          <div style={{fontSize:22,fontWeight:800}}>{user.name}</div>
          <div style={{fontSize:13,opacity:0.6,marginTop:2}}>{user.email}</div>
          <div className="profile-badges">
            <span className="profile-badge">{user.plan==="pro"?"⭐ Pro Member":"Free Plan"}</span>
            <span className="profile-badge">📅 Since {joined}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="profile-stats">
          <div className="profile-stat-cell">
            <div className="profile-stat-val">{favs.length}</div>
            <div className="profile-stat-label">Saved Cars</div>
          </div>
          <div className="profile-stat-cell">
            <div className="profile-stat-val">{savedSearches.length}</div>
            <div className="profile-stat-label">Searches</div>
          </div>
          <div className="profile-stat-cell">
            <div className="profile-stat-val">{GARAGE.length}</div>
            <div className="profile-stat-label">In Garage</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs mb-4">
          {["account","notifications","preferences","about"].map(t =>
            <button key={t} className={`tab-btn ${profTab===t?"active":""}`} onClick={()=>setProfTab(t)} style={{fontSize:12,padding:"8px 12px"}}>
              {{account:"Account",notifications:"Alerts",preferences:"Settings",about:"About"}[t]}
            </button>
          )}
        </div>

        {/* ACCOUNT TAB */}
        {profTab==="account" && <>
          <div className="settings-group">
            <div className="settings-group-title">Personal Information</div>
            <div className="settings-row" style={{borderRadius:"12px 12px 0 0"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#EFF6FF"}}>👤</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Full Name</div>
                  <div className="settings-row-desc">{user.name}</div>
                </div>
              </div>
              <span className="settings-chevron">›</span>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#EFF6FF"}}>✉️</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Email</div>
                  <div className="settings-row-desc">{user.email}</div>
                </div>
              </div>
              <span className="settings-chevron">›</span>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#EFF6FF"}}>📱</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Phone</div>
                  <div className="settings-row-desc">+44 7700 900123</div>
                </div>
              </div>
              <span className="settings-chevron">›</span>
            </div>
            <div className="settings-row" style={{borderRadius:"0 0 12px 12px"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#EFF6FF"}}>📍</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Postcode</div>
                  <div className="settings-row-desc">E14 5AB</div>
                </div>
              </div>
              <span className="settings-chevron">›</span>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Subscription</div>
            <div className="settings-row" style={{borderRadius:12}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:user.plan==="pro"?"#FEF3C7":"#F3F4F6"}}>{user.plan==="pro"?"⭐":"🆓"}</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">{user.plan==="pro"?"CarGPT Pro":"Free Plan"}</div>
                  <div className="settings-row-desc">{user.plan==="pro"?"£9.99/month · Renews 15 Mar 2026":"Upgrade for unlimited AI, alerts & more"}</div>
                </div>
              </div>
              <button className="btn btn-primary btn-sm" style={{fontSize:11,padding:"5px 12px"}}>{user.plan==="pro"?"Manage":"Upgrade"}</button>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Security</div>
            <div className="settings-row" style={{borderRadius:"12px 12px 0 0"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#FEF2F2"}}>🔒</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Change Password</div>
                </div>
              </div>
              <span className="settings-chevron">›</span>
            </div>
            <div className="settings-row" style={{borderRadius:"0 0 12px 12px"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#FEF2F2"}}>🛡️</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Two-Factor Authentication</div>
                  <div className="settings-row-desc">Not enabled</div>
                </div>
              </div>
              <span className="settings-chevron">›</span>
            </div>
          </div>

          <button className="btn btn-outline btn-block" style={{marginBottom:12}} onClick={logout}>Log out</button>
          <button className="btn btn-block" style={{
            background:"none",border:"1px solid #FECACA",color:"#DC2626",
            borderRadius:12,padding:"12px",fontSize:13,fontWeight:600,cursor:"pointer"
          }} onClick={()=>setShowDeleteConfirm(!showDeleteConfirm)}>Delete account</button>
          {showDeleteConfirm && (
            <div className="card mt-3 fade-in" style={{border:"1px solid #FECACA",padding:16}}>
              <div className="text-sm font-bold mb-2" style={{color:"#DC2626"}}>Are you sure?</div>
              <div className="text-xs text-muted mb-3">This will permanently delete your account, saved cars, garage data, and all preferences. This cannot be undone.</div>
              <div className="flex gap-2">
                <button className="btn btn-outline flex-1" onClick={()=>setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn flex-1" style={{background:"#DC2626",color:"white",border:"none",borderRadius:12,padding:10,fontWeight:600,cursor:"pointer"}} onClick={logout}>Delete permanently</button>
              </div>
            </div>
          )}
        </>}

        {/* NOTIFICATIONS TAB */}
        {profTab==="notifications" && <>
          <div className="settings-group">
            <div className="settings-group-title">Push Notifications</div>
            <div className="settings-row" style={{borderRadius:"12px 12px 0 0"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#EFF6FF"}}>🔔</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Push Notifications</div>
                  <div className="settings-row-desc">Alerts on your phone</div>
                </div>
              </div>
              <Toggle on={prefNotifs} onToggle={()=>setPrefNotifs(!prefNotifs)}/>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#F0FDF4"}}>💰</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Price Drop Alerts</div>
                  <div className="settings-row-desc">When saved cars drop in price</div>
                </div>
              </div>
              <Toggle on={prefPriceAlerts} onToggle={()=>setPrefPriceAlerts(!prefPriceAlerts)}/>
            </div>
            <div className="settings-row" style={{borderRadius:"0 0 12px 12px"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#FDF4FF"}}>💬</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Dealer Messages</div>
                  <div className="settings-row-desc">When a dealer replies to you</div>
                </div>
              </div>
              <Toggle on={prefDealerMsgs} onToggle={()=>setPrefDealerMsgs(!prefDealerMsgs)}/>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Email Notifications</div>
            <div className="settings-row" style={{borderRadius:"12px 12px 0 0"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#EFF6FF"}}>📧</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Email Alerts</div>
                  <div className="settings-row-desc">Saved search matches &amp; updates</div>
                </div>
              </div>
              <Toggle on={prefEmails} onToggle={()=>setPrefEmails(!prefEmails)}/>
            </div>
            <div className="settings-row" style={{borderRadius:"0 0 12px 12px"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#EFF6FF"}}>📰</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Newsletter</div>
                  <div className="settings-row-desc">Weekly deals, tips &amp; new features</div>
                </div>
              </div>
              <Toggle on={true} onToggle={()=>{}}/>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Garage Reminders</div>
            <div className="settings-row" style={{borderRadius:"12px 12px 0 0"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#FEF3C7"}}>📋</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">MOT Reminders</div>
                  <div className="settings-row-desc">30 days, 14 days, and 7 days before</div>
                </div>
              </div>
              <Toggle on={true} onToggle={()=>{}}/>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#FEF3C7"}}>💰</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Tax Reminders</div>
                  <div className="settings-row-desc">30 days before expiry</div>
                </div>
              </div>
              <Toggle on={true} onToggle={()=>{}}/>
            </div>
            <div className="settings-row" style={{borderRadius:"0 0 12px 12px"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#FEF3C7"}}>🔧</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Service Reminders</div>
                  <div className="settings-row-desc">Based on mileage estimate</div>
                </div>
              </div>
              <Toggle on={true} onToggle={()=>{}}/>
            </div>
          </div>
        </>}

        {/* PREFERENCES TAB */}
        {profTab==="preferences" && <>
          <div className="settings-group">
            <div className="settings-group-title">Appearance</div>
            <div className="settings-row" style={{borderRadius:12}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#1E293B",color:"white",fontSize:14}}>🌙</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Dark Mode</div>
                  <div className="settings-row-desc">Reduce eye strain at night</div>
                </div>
              </div>
              <Toggle on={prefDarkMode} onToggle={()=>setPrefDarkMode(!prefDarkMode)}/>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Search Preferences</div>
            <div className="settings-row" style={{borderRadius:"12px 12px 0 0"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#EFF6FF"}}>📍</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Location Services</div>
                  <div className="settings-row-desc">Show distance to dealers</div>
                </div>
              </div>
              <Toggle on={prefLocation} onToggle={()=>setPrefLocation(!prefLocation)}/>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#EFF6FF"}}>📏</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Distance Unit</div>
                </div>
              </div>
              <div className="settings-row-right">
                <div style={{display:"flex",background:"var(--skeleton)",borderRadius:8,overflow:"hidden"}}>
                  {["miles","km"].map(u=>(
                    <button key={u} onClick={()=>setPrefDistUnit(u)} style={{
                      padding:"5px 14px",border:"none",fontSize:12,fontWeight:600,cursor:"pointer",
                      background:prefDistUnit===u?"var(--primary)":"transparent",
                      color:prefDistUnit===u?"white":"var(--text-muted)"
                    }}>{u==="miles"?"Miles":"Km"}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="settings-row" style={{borderRadius:"0 0 12px 12px"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#EFF6FF"}}>🔍</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Default Search Radius</div>
                </div>
              </div>
              <div className="settings-row-right">
                <select value={prefSearchRadius} onChange={e=>setPrefSearchRadius(e.target.value)} className="filter-select" style={{padding:"5px 28px 5px 10px",fontSize:12}}>
                  <option value="10">10 miles</option>
                  <option value="25">25 miles</option>
                  <option value="50">50 miles</option>
                  <option value="100">100 miles</option>
                  <option value="national">National</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Data &amp; Privacy</div>
            <div className="settings-row" style={{borderRadius:"12px 12px 0 0"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#F0FDF4"}}>📊</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Analytics &amp; Improvement</div>
                  <div className="settings-row-desc">Help improve CarGPT with usage data</div>
                </div>
              </div>
              <Toggle on={true} onToggle={()=>{}}/>
            </div>
            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#FEF2F2"}}>🗑️</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Clear Search History</div>
                  <div className="settings-row-desc">Remove all recent searches</div>
                </div>
              </div>
              <span className="settings-chevron">›</span>
            </div>
            <div className="settings-row" style={{borderRadius:"0 0 12px 12px"}}>
              <div className="settings-row-left">
                <div className="settings-row-icon" style={{background:"#FEF2F2"}}>📥</div>
                <div className="settings-row-text">
                  <div className="settings-row-label">Download My Data</div>
                  <div className="settings-row-desc">GDPR data export</div>
                </div>
              </div>
              <span className="settings-chevron">›</span>
            </div>
          </div>
        </>}

        {/* ABOUT TAB */}
        {profTab==="about" && <>
          <div className="card mb-4" style={{textAlign:"center",padding:24}}>
            <div style={{fontSize:32,marginBottom:8}}>🚗</div>
            <div className="text-lg font-extra mb-1">CarGPT</div>
            <div className="text-sm text-muted mb-2">Version 2.0.0</div>
            <div className="text-xs text-muted">AI-First Used Car Marketplace</div>
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Platform</div>
            {[
              {icon:"📊",label:"450,000+ vehicles",bg:"#EFF6FF"},
              {icon:"🏪",label:"15,000+ dealers nationwide",bg:"#F0FDF4"},
              {icon:"🤖",label:"Powered by Claude AI",bg:"#FDF4FF"},
              {icon:"🔒",label:"Bank-level encryption",bg:"#FEF2F2"},
            ].map((r,i) => (
              <div key={i} className="settings-row" style={{borderRadius:i===0?"12px 12px 0 0":i===3?"0 0 12px 12px":"0",cursor:"default"}}>
                <div className="settings-row-left">
                  <div className="settings-row-icon" style={{background:r.bg}}>{r.icon}</div>
                  <div className="settings-row-label">{r.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Legal</div>
            {["Terms of Service","Privacy Policy","Cookie Policy","Complaints Procedure"].map((l,i,a) => (
              <div key={i} className="settings-row" style={{borderRadius:i===0?"12px 12px 0 0":i===a.length-1?"0 0 12px 12px":"0"}}>
                <div className="settings-row-left">
                  <div className="settings-row-icon" style={{background:"var(--skeleton)"}}>📄</div>
                  <div className="settings-row-label">{l}</div>
                </div>
                <span className="settings-chevron">›</span>
              </div>
            ))}
          </div>

          <div className="settings-group">
            <div className="settings-group-title">Support</div>
            {[
              {icon:"💬",label:"Help Centre",bg:"#EFF6FF"},
              {icon:"📧",label:"Contact Support",bg:"#FDF4FF"},
              {icon:"⭐",label:"Rate CarGPT",bg:"#FEF3C7"},
            ].map((r,i,a) => (
              <div key={i} className="settings-row" style={{borderRadius:i===0?"12px 12px 0 0":i===a.length-1?"0 0 12px 12px":"0"}}>
                <div className="settings-row-left">
                  <div className="settings-row-icon" style={{background:r.bg}}>{r.icon}</div>
                  <div className="settings-row-label">{r.label}</div>
                </div>
                <span className="settings-chevron">›</span>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-muted" style={{padding:16}}>
            © 2026 CarGPT Holdings Limited. All rights reserved.
          </div>
        </>}
      </div>
    );
  };

  // ═══ RENDER: VEHICLE DETAIL ═══
  const DetailPage = () => {
    if(!sel) return null;
    const v=sel, dl=D.find(d=>d.id===v.dealerId)||D[0], fin=calcFin(v.price);
    const isFav = favs.includes(v.id);
    const angles = [1,5,9,13,17,21,25,29];
    const angleIdx = angles.indexOf(galleryAngle);

    // Compare vehicle — pick best alternative
    const altCar = V.filter(x=>x.id!==v.id).sort((a,b)=>Math.abs(a.price-v.price)-Math.abs(b.price-v.price))[0];

    const CompareRow = ({label, val1, val2, better}) => (
      <tr>
        <td className="text-muted">{label}</td>
        <td className={better==="a"?"compare-highlight":""}>{val1}</td>
        <td className={better==="b"?"compare-highlight":""}>{val2}</td>
      </tr>
    );

    return (
      <div style={{paddingBottom:0}}>
        {/* Back nav */}
        <div style={{padding:"12px 0 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button className="btn btn-secondary btn-sm" onClick={()=>setSel(null)} style={{fontSize:13}}>← Back</button>
          <div className="text-xs text-muted">Listed {v.daysListed} day{v.daysListed!==1?"s":""} ago · {v.location}</div>
        </div>

        <div className="detail-layout">
          {/* ─── LEFT COLUMN ─── */}
          <div>
            {/* Gallery */}
            <div className="detail-hero-img mb-2"
              onTouchStart={e=>{ touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e=>{ if(touchStartX.current===null) return; const diff = touchStartX.current - e.changedTouches[0].clientX; if(Math.abs(diff)>50){ handleGallerySwipe(diff>0?"left":"right"); } touchStartX.current=null; }}
            >
              <img src={carImg(v.make, v.model, v.year, galleryAngle)} alt={`${v.year} ${v.make} ${v.model}`}/>
              <div className="detail-hero-badge">
                <span className={`badge ${v.priceRating.includes("Great")?"badge-green":"badge-green"}`}>{v.priceRating}</span>
                {v.ulezCompliant && <span className="badge badge-blue">ULEZ ✓</span>}
              </div>
              <button className="detail-hero-fav" onClick={()=>toggleFav(v.id)}>
                {isFav ? "❤️" : "🤍"}
              </button>
              <div className="detail-hero-counter">{angleIdx+1} / {angles.length}</div>
              <div className="gallery-dots">
                {angles.map(a=><span key={a} className={`gallery-dot${galleryAngle===a?" active":""}`}/>)}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="gallery-strip">
              {angles.map(a=>(
                <div key={a} className={`gallery-thumb${galleryAngle===a?" active":""}`} onClick={()=>setGalleryAngle(a)}>
                  <img src={carImg(v.make,v.model,v.year,a)} alt={`angle ${a}`} loading="lazy"/>
                </div>
              ))}
            </div>

            {/* Title + key info */}
            <div style={{padding:"16px 0 12px"}}>
              <div style={{fontSize:24,fontWeight:800,lineHeight:1.2,marginBottom:4}}>{v.year} {v.make} {v.model}</div>
              <div className="text-sm text-muted">{v.variant} · {v.vrm}</div>
            </div>

            {/* Spec Grid — Auto Trader style */}
            <div className="specs-grid">
              {[
                {icon:"🛣️",val:fmtMi(v.mileage),label:"Mileage"},
                {icon:"⛽",val:v.fuel,label:"Fuel"},
                {icon:"⚙️",val:v.transmission,label:"Gearbox"},
                {icon:"🏎️",val:v.specs.bhp+"bhp",label:"Power"},
                {icon:"🔧",val:v.engineSize,label:"Engine"},
                {icon:"⏱️",val:v.specs.acceleration+"s",label:"0-62"},
                {icon:"📦",val:v.specs.bootSpace+"L",label:"Boot"},
                {icon:v.fuel==="Electric"?"🔋":"⛽",val:typeof v.specs.fuelEconomy==="number"?v.specs.fuelEconomy+" mpg":v.specs.fuelEconomy,label:v.fuel==="Electric"?"Range":"Economy"},
              ].map((s,i)=>(
                <div key={i} className="spec-cell">
                  <div className="spec-icon">{s.icon}</div>
                  <div className="spec-val">{s.val}</div>
                  <div className="spec-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="tabs mb-4">
              {["details","mot","compare","reviews","ai"].map(t =>
                <button key={t} className={`tab-btn ${detailTab===t?"active":""}`} onClick={()=>setDetailTab(t)} style={{fontSize:12,padding:"8px 12px"}}>
                  {{details:"Trust & Features",mot:"MOT History",compare:"Compare",reviews:"Reviews",ai:"Ask AI"}[t]}
                </button>
              )}
            </div>

            {/* TRUST & FEATURES TAB */}
            {detailTab==="details" && <>
              <div className="card mb-4">
                <div className="text-sm font-bold mb-3">Checks & History</div>
                {[
                  {icon:v.hpiClear?"✅":"⏳",label:"HPI Check",val:v.hpiClear?"Clear — no issues found":"Pending",col:v.hpiClear?"var(--success)":"var(--text)"},
                  {icon:"📋",label:"MOT Valid",val:`Until ${v.motExpiry}`,col:"var(--text)"},
                  {icon:"🔧",label:"Service History",val:v.serviceHistory?"Full service history":"Partial",col:v.serviceHistory?"var(--success)":"var(--warning)"},
                  {icon:"👤",label:"Previous Keepers",val:v.previousKeepers===1?"1 owner":""+v.previousKeepers,col:v.previousKeepers<=2?"var(--success)":"var(--text)"},
                  {icon:"🌍",label:"ULEZ",val:v.ulezCompliant?"Compliant":"Not compliant",col:v.ulezCompliant?"var(--success)":"var(--error)"},
                  {icon:"🛡️",label:"Insurance Group",val:`${v.insuranceGroup} of 50`,col:v.insuranceGroup<=15?"var(--success)":v.insuranceGroup<=25?"var(--warning)":"var(--error)"},
                  {icon:"💰",label:"Road Tax",val:v.taxCost===0?"FREE":"£"+v.taxCost+"/yr",col:v.taxCost===0?"var(--success)":"var(--text)"},
                  {icon:"🏭",label:"Emissions",val:v.euroEmissions+" · "+v.co2+"g/km CO₂",col:"var(--text)"},
                ].map((c,i) =>
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<7?"1px solid var(--border-light)":"none"}}>
                    <span className="text-sm">{c.icon} {c.label}</span>
                    <span className="text-sm font-bold" style={{color:c.col}}>{c.val}</span>
                  </div>
                )}
              </div>

              <div className="card mb-4">
                <div className="text-sm font-bold mb-3">Standard Features</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {v.features.map((f,i) => (
                    <span key={i} style={{
                      display:"inline-flex",alignItems:"center",gap:5,
                      padding:"7px 14px",borderRadius:10,fontSize:12,fontWeight:600,
                      background:"var(--skeleton)",color:"var(--text-secondary)"
                    }}>✓ {f}</span>
                  ))}
                </div>
              </div>

              {/* Vehicle summary */}
              <div className="card mb-4" style={{
                background:"linear-gradient(135deg,#F8FAFC,#EEF2FF)",
                border:"1px solid #E0E7FF"
              }}>
                <div className="text-sm font-bold mb-2">📝 Quick Summary</div>
                <div className="text-sm" style={{lineHeight:1.6,color:"var(--text-secondary)"}}>
                  This {v.year} {v.make} {v.model} {v.variant} has covered {fmtMi(v.mileage)} and comes with{" "}
                  {v.serviceHistory?"full service history":"partial service history"}, {v.hpiClear?"a clear HPI check":"an HPI check pending"},{" "}
                  and is in insurance group {v.insuranceGroup}.{" "}
                  {v.ulezCompliant?"It's ULEZ compliant for London driving. ":""}
                  {v.taxCost===0?"Road tax is FREE. ":`Road tax is £${v.taxCost}/year. `}
                  At {fmt(v.price)}, it's rated as a "{v.priceRating}" by our AI.
                </div>
              </div>
            </>}

            {/* MOT TAB */}
            {detailTab==="mot" && <div>
              <div className="text-sm font-bold mb-3">MOT History — {(v.mot||[]).length} records</div>
              <div className="timeline" style={{paddingLeft:28}}>
                {(v.mot||[]).map((m,i) => (
                  <div key={i} className="timeline-item">
                    <div className={`timeline-dot ${m.result==="Pass"?"green":"red"}`}/>
                    <div className="card mb-2" style={{padding:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <span className="text-sm font-bold">{m.date}</span>
                        <span className={`badge ${m.result==="Pass"?"badge-green":"badge-red"}`}>{m.result==="Pass"?"✅ Pass":"❌ Fail"}</span>
                      </div>
                      <div className="text-xs text-muted mb-2">Mileage: {m.mileage?.toLocaleString()} miles</div>
                      {m.advisories?.length>0 && m.advisories.map((a,j) =>
                        <div key={j} style={{padding:"8px 10px",marginTop:6,background:a.includes("major")?"#FEF2F2":"#FFFBEB",borderRadius:8,border:a.includes("major")?"1px solid #FECACA":"1px solid #FDE68A"}}>
                          <div className="text-xs font-bold">{a.includes("major")?"❌":"⚠️"} {a.split("(")[0].trim()}</div>
                          <div className="text-xs text-muted" style={{marginTop:2}}>{a.includes("minor")?"Minor advisory":"Major — requires repair"}</div>
                        </div>
                      )}
                      {(!m.advisories||m.advisories.length===0) && <div className="text-xs" style={{color:"var(--success)"}}>✅ No advisories</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>}

            {/* COMPARE TAB */}
            {detailTab==="compare" && altCar && <div>
              <div className="text-sm font-bold mb-3">Compare with similar cars</div>
              <div className="card mb-4" style={{overflowX:"auto",padding:0}}>
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th style={{width:"30%"}}></th>
                      <th style={{width:"35%"}}>{v.year} {v.make} {v.model}</th>
                      <th style={{width:"35%"}}>{altCar.year} {altCar.make} {altCar.model}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CompareRow label="Price" val1={fmt(v.price)} val2={fmt(altCar.price)} better={v.price<altCar.price?"a":"b"}/>
                    <CompareRow label="Mileage" val1={fmtMi(v.mileage)} val2={fmtMi(altCar.mileage)} better={v.mileage<altCar.mileage?"a":"b"}/>
                    <CompareRow label="Year" val1={""+v.year} val2={""+altCar.year} better={v.year>altCar.year?"a":"b"}/>
                    <CompareRow label="Fuel" val1={v.fuel} val2={altCar.fuel}/>
                    <CompareRow label="Power" val1={v.specs.bhp+"bhp"} val2={altCar.specs.bhp+"bhp"} better={v.specs.bhp>altCar.specs.bhp?"a":"b"}/>
                    <CompareRow label="0-62mph" val1={v.specs.acceleration+"s"} val2={altCar.specs.acceleration+"s"} better={v.specs.acceleration<altCar.specs.acceleration?"a":"b"}/>
                    <CompareRow label="Economy" val1={typeof v.specs.fuelEconomy==="number"?v.specs.fuelEconomy+" mpg":""+v.specs.fuelEconomy} val2={typeof altCar.specs.fuelEconomy==="number"?altCar.specs.fuelEconomy+" mpg":""+altCar.specs.fuelEconomy} better={typeof v.specs.fuelEconomy==="number"&&typeof altCar.specs.fuelEconomy==="number"?(v.specs.fuelEconomy>altCar.specs.fuelEconomy?"a":"b"):undefined}/>
                    <CompareRow label="Boot" val1={v.specs.bootSpace+"L"} val2={altCar.specs.bootSpace+"L"} better={v.specs.bootSpace>altCar.specs.bootSpace?"a":"b"}/>
                    <CompareRow label="Insurance" val1={"Group "+v.insuranceGroup} val2={"Group "+altCar.insuranceGroup} better={v.insuranceGroup<altCar.insuranceGroup?"a":"b"}/>
                    <CompareRow label="Road Tax" val1={v.taxCost===0?"FREE":"£"+v.taxCost+"/yr"} val2={altCar.taxCost===0?"FREE":"£"+altCar.taxCost+"/yr"} better={v.taxCost<altCar.taxCost?"a":"b"}/>
                    <CompareRow label="Rating" val1={v.priceRating} val2={altCar.priceRating}/>
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-muted mb-3">Green cells show the better value. Tap a car to view it.</div>
              <button className="btn btn-outline btn-block btn-sm" onClick={()=>{setSel(altCar);setGalleryAngle(1);setDetailTab("details");window.scrollTo(0,0);}}>
                View {altCar.year} {altCar.make} {altCar.model} →
              </button>
            </div>}

            {/* REVIEWS TAB */}
            {detailTab==="reviews" && <div>
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
                        <div style={{flex:1,height:6,background:"var(--border)",borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${r.p}%`,height:"100%",background:r.s>=4?"#FBBF24":r.s===3?"#F59E0B":"#EF4444",borderRadius:3}}/>
                        </div>
                        <span style={{fontSize:10,color:"var(--text-muted)",width:28,textAlign:"right"}}>{r.p}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button className="btn btn-outline btn-block btn-sm mb-4" onClick={()=>{
                if(!user){setAuthModal("login");return;}
                setReviewModal(true);setReviewStars(0);setReviewText("");setReviewSubmitted(false);
              }}>✍️ Write a Review</button>
              {reviews.filter(r=>r.dealerId===dl.id).map(r=>(
                <div key={r.id} className="card mb-3 fade-in">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:8}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#E5E7EB,#D1D5DB)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#6B7280"}}>{r.author.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-bold" style={{display:"flex",alignItems:"center",gap:4}}>
                            {r.author}
                            {r.verified && <span style={{background:"#E8F5E9",color:"#2E7D32",fontSize:9,padding:"1px 5px",borderRadius:4,fontWeight:700}}>✓ Verified</span>}
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

            {/* AI TAB */}
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
                <input className={`input${voiceActive==="vehicle"?" voice-listening":""}`} style={{flex:1}} placeholder={voiceActive==="vehicle"?"Listening...":"Ask about this car..."} value={vIn} onChange={e=>setVIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendVMsg(vIn);}}/>
                <button className={`btn-mic${voiceActive==="vehicle"?" active":""}`} onClick={()=>toggleVoice("vehicle",setVIn)} title="Voice input">{voiceActive==="vehicle"?stopSvg:micSvg}</button>
                <button className="btn btn-primary" onClick={()=>sendVMsg(vIn)}>Send</button>
              </div>
            </div>}
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="detail-sidebar">
            <div className="detail-price-card">
              <div className="detail-price">{fmt(v.price)}</div>
              <div className="detail-price-sub">
                or from <strong>£{fin.monthly}/mo</strong> PCP · {fmtMi(v.mileage)} · {v.year}
              </div>
              <div style={{display:"flex",gap:6,marginBottom:16}}>
                <span className={`badge ${v.priceRating.includes("Great")?"badge-green":"badge-green"}`}>{v.priceRating}</span>
                <span className="badge badge-blue">📍 {v.location}</span>
              </div>
              <div className="detail-actions-grid">
                <button className="btn btn-primary" onClick={()=>openDChat(v.id)}>💬 Message</button>
                <button className="btn btn-outline" onClick={()=>openDChat(v.id,"testDrive")}>📅 Test Drive</button>
                <button className="btn btn-outline" onClick={()=>{setHpiReg(v.vrm);setHpiResult(null);setHpiPremium(false);openModal("hpi");}}>🔎 HPI Check</button>
                <button className="btn btn-outline" onClick={()=>openModal("finance")}>💳 Finance</button>
              </div>
            </div>

            <div className="card">
              <div className="text-sm font-bold mb-2">Finance Estimate</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--border-light)"}}>
                <span className="text-sm">PCP</span>
                <span className="text-lg font-extra" style={{color:"var(--primary)"}}>£{fin.monthly}/mo</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",marginBottom:10}}>
                <span className="text-sm">HP</span>
                <span className="text-md font-bold">£{Math.round(fin.monthly*1.15)}/mo</span>
              </div>
              <div className="text-xs text-muted mb-3">Based on £{Math.round(v.price*0.1).toLocaleString()} deposit, 48 months, 6.9% APR representative</div>
              <button className="btn btn-secondary btn-block btn-sm" onClick={()=>openModal("finance")}>Full calculator →</button>
            </div>

            <div className="card">
              <div className="text-sm font-bold mb-3">Dealer</div>
              <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
                <div style={{width:44,height:44,borderRadius:10,background:"linear-gradient(135deg,var(--primary),#1a5cd6)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:16}}>{dl.name.charAt(0)}</div>
                <div>
                  <div className="text-sm font-bold" style={{display:"flex",alignItems:"center",gap:4}}>{dl.name} <span style={{background:"#E8F5E9",color:"#2E7D32",fontSize:9,padding:"1px 5px",borderRadius:4,fontWeight:700}}>✓</span></div>
                  <div className="text-xs text-muted">⭐ {dl.rating} ({dl.reviews}) · 📍 {dl.location}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <div style={{flex:1,background:"var(--badge-muted-bg)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:"var(--text-muted)"}}>Trust</div><div style={{fontWeight:700,fontSize:14,color:dl.trustScore>=90?"#2E7D32":"var(--text)"}}>{dl.trustScore}/100</div></div>
                <div style={{flex:1,background:"var(--badge-muted-bg)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:"var(--text-muted)"}}>Response</div><div style={{fontWeight:700,fontSize:14}}>{dl.responseTime}</div></div>
                <div style={{flex:1,background:"var(--badge-muted-bg)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:"var(--text-muted)"}}>Stock</div><div style={{fontWeight:700,fontSize:14}}>{V.filter(x=>x.dealerId===dl.id).length}</div></div>
              </div>
              <button className="btn btn-primary btn-block btn-sm" onClick={()=>openDChat(v.id)}>Message Dealer</button>
            </div>

            <div className="card">
              <div className="text-sm font-bold mb-2">More Actions</div>
              <div className="flex flex-col gap-2">
                <button className="btn btn-outline btn-sm btn-block" onClick={()=>{setPexResult(null);openModal("partex");}}>🔄 Part Exchange</button>
                <button className="btn btn-outline btn-sm btn-block" onClick={()=>setDetailTab("compare")}>⚖️ Compare Cars</button>
                <button className="btn btn-outline btn-sm btn-block" onClick={()=>openModal("negotiate")}>🤝 Negotiation Coach</button>
                <button className="btn btn-outline btn-sm btn-block" onClick={()=>sendChat(`Tell me about the ${v.year} ${v.make} ${v.model}. Is it worth it?`)}>🤖 AI Deep Analysis</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bottom CTA — mobile & desktop */}
        <div className="detail-sticky-cta">
          <div style={{flex:1}}>
            <div className="detail-sticky-price">{fmt(v.price)}</div>
            <div className="detail-sticky-sub">£{fin.monthly}/mo PCP · {v.priceRating}</div>
          </div>
          <button className="btn btn-outline" style={{flexShrink:0}} onClick={()=>openDChat(v.id,"testDrive")}>📅 Test Drive</button>
          <button className="btn btn-primary" style={{flexShrink:0}} onClick={()=>openDChat(v.id)}>💬 Message</button>
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
          <div className="flex gap-2 mb-4">{compCars.map((c,i)=><div key={i} style={{flex:1,textAlign:"center"}}><div style={{width:"100%",height:80,borderRadius:8,overflow:"hidden",background:"var(--skeleton)",marginBottom:4}}><img src={carImg(c.make,c.model,c.year)} alt={c.make} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div><div className="text-xs font-bold">{c.make} {c.model}</div></div>)}</div>
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
            <div className="text-sm text-muted mb-3">{agentRunning?"Agent working...":"Results"}</div>
            {agentSteps.map((s,i)=><div key={i} className="step-item fade-in"><div className={`step-dot ${i<agentSteps.length-1||!agentRunning?"step-done":"step-active"}`}>{i<agentSteps.length-1||!agentRunning?"✓":"⟳"}</div><div className="text-sm" style={{paddingTop:3,whiteSpace:"pre-line"}}>{s.t}</div></div>)}
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
              Inbox {(conversations||[]).filter(c=>c.user_unread_count>0).length>0 && <span style={{width:8,height:8,borderRadius:"50%",background:"#DC2626",display:"inline-block",marginLeft:4}}/>}
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
                <div style={{display:"flex",gap:10,padding:"10px 12px",background:"var(--badge-muted-bg)",borderRadius:10,marginBottom:12,alignItems:"center"}}>
                  <div style={{width:48,height:36,borderRadius:6,overflow:"hidden",background:"var(--border)",flexShrink:0}}>
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
                      {m.text && <div className="chat-bubble">{m.text}</div>}
                      {msgTime && <div style={{fontSize:10,color:"var(--text-muted)",marginTop:2,textAlign:m.role==="user"?"right":"left",opacity:0.6}}>{msgTime}</div>}

                      {/* Slot Picker Card */}
                      {m.card?.type==="slot-picker" && (
                        <div className="card fade-in" style={{marginTop:8,padding:12}}>
                          <div className="text-xs font-bold mb-2">📅 Available Slots</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                            {m.card.slots.map((s,j)=>(
                              <button key={j} className="btn btn-outline btn-sm" style={{fontSize:12,padding:"8px 14px"}}
                                onClick={()=>sendDMsg(s)}>{s}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Confirmation Card */}
                      {m.card?.type==="confirmation" && (
                        <div className="card fade-in" style={{marginTop:8,padding:14,background:m.card.icon==="🎉"||m.card.icon==="✅"?"var(--success-light)":"var(--primary-light)"}}>
                          <div className="flex items-center gap-2 mb-2">
                            <span style={{fontSize:20}}>{m.card.icon}</span>
                            <div className="text-sm font-bold">{m.card.title}</div>
                          </div>
                          {m.card.lines.map((l,j)=>(
                            <div key={j} className="flex justify-between" style={{padding:"5px 0",borderBottom:j<m.card.lines.length-1?"1px solid rgba(0,0,0,0.06)":"none"}}>
                              <span className="text-xs text-muted">{l.label}</span>
                              <span className={`text-xs font-bold${l.highlight?" text-primary":""}`} style={l.highlight?{fontSize:14}:{}}>{l.value}</span>
                            </div>
                          ))}
                          {m.card.footer && <div className="text-xs text-muted" style={{marginTop:8,paddingTop:8,borderTop:"1px solid rgba(0,0,0,0.06)"}}>{m.card.footer}</div>}
                        </div>
                      )}

                      {/* Finance Card */}
                      {m.card?.type==="finance" && (
                        <div className="card fade-in" style={{marginTop:8,padding:0,overflow:"hidden"}}>
                          {m.card.options.map((opt,j)=>(
                            <div key={j} style={{padding:12,borderBottom:j<m.card.options.length-1?"1px solid var(--border-light)":"none"}}>
                              <div className="flex justify-between items-center mb-1">
                                <div className="text-xs font-bold">{opt.name}</div>
                                <div className="text-md font-bold text-primary">£{opt.monthly}/mo</div>
                              </div>
                              <div className="text-xs text-muted">{opt.desc}</div>
                              <div className="text-xs text-muted" style={{marginTop:4}}>
                                {opt.apr ? `${opt.apr}% APR · ` : ""}{fmt(opt.deposit)} deposit · {opt.term}mo{opt.balloon ? ` · ${fmt(opt.balloon)} balloon` : ""}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {m.quickReplies&&<div className="chat-quick-replies">{m.quickReplies.map((qr,j)=><button key={j} className="chat-qr" onClick={()=>sendDMsg(qr)}>{qr}</button>)}</div>}
                    </div>
                  );
                })}
                {dTyping&&<div className="chat-msg fade-in"><div className="chat-bubble"><div className="typing-dots"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div></div></div>}
                <div ref={dRef}/>
              </div>
              <div className="flex gap-2 mt-3">
                <input className={`input flex-1${voiceActive==="dealer"?" voice-listening":""}`} value={dIn} onChange={e=>setDIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendDMsg(dIn);}} placeholder={voiceActive==="dealer"?"Listening...":"Type a message..."}/>
                <button className={`btn-mic${voiceActive==="dealer"?" active":""}`} onClick={()=>toggleVoice("dealer",setDIn)} title="Voice input">{voiceActive==="dealer"?stopSvg:micSvg}</button>
                <button className="btn btn-primary" onClick={()=>sendDMsg(dIn)}>Send</button>
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
    <div className={prefDarkMode?"dark":""} style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)"}}>
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
                  <div style={{width:48,height:36,borderRadius:6,overflow:"hidden",background:"var(--skeleton)",marginBottom:4}}><img src={carImg(v.make,v.model,v.year)} alt={v.make} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
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
          <input className={`chat-input${voiceActive==="main"?" voice-listening":""}`} placeholder={voiceActive==="main"?"Listening...":"Ask CarGPT anything..."}
            value={chatIn} onChange={e=>setChatIn(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter")sendChat(chatIn);}}/>
          <button className={`btn-mic chat-mic${voiceActive==="main"?" active":""}`} onClick={()=>toggleVoice("main",(t)=>{setChatIn(t);setHeroIn(t);})} title="Voice input">{voiceActive==="main"?stopSvg:micSvg}</button>
          <button className="chat-send" onClick={()=>sendChat(chatIn)}>↑</button>
        </div>
      </div>
      {!chatOpen &&
        <button className="chat-fab" onClick={()=>setChatOpen(true)} title="Ask CarGPT AI">✨</button>
      }

      {/* Active Modal */}
      {renderModalContent()}

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {[
          {key:"home",icon:"🏠",label:"Home"},
          {key:"search",icon:"🔍",label:"Browse"},
          {key:"chat",icon:"✨",label:"AI Chat"},
          {key:"messages",icon:"💬",label:"Messages"},
          {key:"profile",icon:"👤",label:"Profile"},
        ].map(t => (
          <button key={t.key} className={`mob-tab ${(t.key==="chat"?chatOpen:t.key===page&&!sel)?"active":""}`}
            onClick={()=>{
              if(t.key==="chat"){ setChatOpen(!chatOpen); return; }
              if((t.key==="messages") && !user){ setAuthModal("login"); return; }
              if(t.key==="messages") loadConversations();
              if(t.key==="profile" && !user){ setAuthModal("login"); return; }
              setChatOpen(false); setSel(null); setPage(t.key==="profile"?"profile":t.key);
            }}>
            <span className="mob-tab-icon">{t.icon}</span>
            {t.label}
            {t.key==="messages"&&(conversations||[]).some(c=>c.user_unread_count>0)&&<span className="mob-tab-badge"/>}
          </button>
        ))}
      </nav>

      {/* Auth Modal — inlined to prevent re-mount on keystroke */}
      {authModal && (
        <div className="modal-overlay" style={{zIndex:10000}} onClick={()=>{setAuthModal(null);setAuthError("");setAEmail("");setAPass("");setAName("");}}>
          <div style={{
            background:"var(--surface)",borderRadius:20,width:"100%",maxWidth:440,padding:0,
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
                background:"var(--surface)",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",
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
          <div style={{background:"var(--surface)",borderRadius:20,width:"100%",maxWidth:480,padding:32,boxShadow:"0 25px 60px rgba(0,0,0,0.3)",animation:"slideUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
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

      {/* ═══ ONBOARDING FLOW ═══ */}
      {showOnboarding && (
        <div className="onb-overlay">
          <div className="onb-content">
            {/* Progress bar */}
            <div className="onb-progress">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className={`onb-progress-dot${i===onbStep?" active":""}${i<onbStep?" done":""}`}/>
              ))}
            </div>

            {/* STEP 0 — Welcome */}
            {onbStep===0 && (
              <div className="fade-in">
                <div className="onb-emoji">👋</div>
                <div className="onb-title">Welcome to CarGPT, {user?.name?.split(" ")[0]}!</div>
                <div className="onb-subtitle">The UK's AI-first car marketplace. Let's set up your profile in 60 seconds so we can find your perfect car.</div>
                <div className="onb-welcome-cards">
                  {[
                    {icon:"🤖",bg:"#EEF2FF",title:"AI-Powered Search",desc:"Tell us what you want in plain English"},
                    {icon:"💰",bg:"#F0FDF4",title:"Smart Price Ratings",desc:"Know instantly if a car is a good deal"},
                    {icon:"💬",bg:"#FDF4FF",title:"Chat with Dealers",desc:"Message dealers directly, get fast replies"},
                    {icon:"🔔",bg:"#FEF3C7",title:"Price Drop Alerts",desc:"Get notified when saved cars drop in price"},
                  ].map((c,i) => (
                    <div key={i} className="onb-welcome-card">
                      <div className="onb-welcome-card-icon" style={{background:c.bg}}>{c.icon}</div>
                      <div className="onb-welcome-card-text">
                        <div className="onb-welcome-card-title">{c.title}</div>
                        <div className="onb-welcome-card-desc">{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="onb-footer">
                  <button className="btn btn-primary btn-block" onClick={()=>setOnbStep(1)} style={{padding:"14px",fontSize:15,fontWeight:700}}>Let's go →</button>
                </div>
              </div>
            )}

            {/* STEP 1 — Budget */}
            {onbStep===1 && (
              <div className="fade-in">
                <div className="onb-emoji">💷</div>
                <div className="onb-title">What's your budget?</div>
                <div className="onb-subtitle">This helps us show you the most relevant cars first.</div>
                <div className="onb-options">
                  {[
                    {k:"u10",icon:"🪙",label:"Under £10k",desc:"Best value"},
                    {k:"10-20",icon:"💵",label:"£10k – £20k",desc:"Most popular"},
                    {k:"20-30",icon:"💰",label:"£20k – £30k",desc:"Premium range"},
                    {k:"30+",icon:"💎",label:"£30k+",desc:"Luxury & performance"},
                  ].map(o => (
                    <div key={o.k} className={`onb-option${onbBudget===o.k?" selected":""}`} onClick={()=>setOnbBudget(o.k)}>
                      <div className="onb-option-icon">{o.icon}</div>
                      <div className="onb-option-label">{o.label}</div>
                      <div className="onb-option-desc">{o.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="onb-footer">
                  <button className="btn btn-outline" onClick={()=>setOnbStep(0)} style={{flex:1}}>Back</button>
                  <button className="btn btn-primary" onClick={()=>setOnbStep(2)} style={{flex:2}}>Continue</button>
                </div>
              </div>
            )}

            {/* STEP 2 — Fuel preference */}
            {onbStep===2 && (
              <div className="fade-in">
                <div className="onb-emoji">⛽</div>
                <div className="onb-title">Fuel preference?</div>
                <div className="onb-subtitle">Pick all that apply. We'll prioritise these in your results.</div>
                <div className="onb-chips">
                  {[
                    {k:"Petrol",icon:"⛽",label:"Petrol"},
                    {k:"Diesel",icon:"🛢️",label:"Diesel"},
                    {k:"Electric",icon:"⚡",label:"Electric"},
                    {k:"Hybrid",icon:"🔋",label:"Hybrid"},
                    {k:"Any",icon:"🔄",label:"No preference"},
                  ].map(o => (
                    <div key={o.k} className={`onb-chip${onbFuel.includes(o.k)?" selected":""}`}
                      onClick={()=>{
                        if(o.k==="Any") { setOnbFuel(["Any"]); return; }
                        setOnbFuel(p => {
                          const without = p.filter(x=>x!=="Any");
                          return without.includes(o.k) ? without.filter(x=>x!==o.k) : [...without,o.k];
                        });
                      }}>
                      {o.icon} {o.label}
                    </div>
                  ))}
                </div>
                <div className="onb-footer">
                  <button className="btn btn-outline" onClick={()=>setOnbStep(1)} style={{flex:1}}>Back</button>
                  <button className="btn btn-primary" onClick={()=>setOnbStep(3)} style={{flex:2}}>Continue</button>
                </div>
              </div>
            )}

            {/* STEP 3 — Body type */}
            {onbStep===3 && (
              <div className="fade-in">
                <div className="onb-emoji">🚗</div>
                <div className="onb-title">What type of car?</div>
                <div className="onb-subtitle">Pick all that interest you.</div>
                <div className="onb-options">
                  {[
                    {k:"Hatchback",icon:"🚗",label:"Hatchback",desc:"Compact & practical"},
                    {k:"Saloon",icon:"🏎️",label:"Saloon",desc:"Spacious & comfortable"},
                    {k:"SUV",icon:"🚙",label:"SUV / Crossover",desc:"Family & adventure"},
                    {k:"Estate",icon:"🚐",label:"Estate",desc:"Maximum space"},
                    {k:"Coupe",icon:"🏎️",label:"Coupé / Sport",desc:"Style & performance"},
                    {k:"Any",icon:"🔄",label:"No preference",desc:"Show me everything"},
                  ].map(o => (
                    <div key={o.k} className={`onb-option${onbBody.includes(o.k)?" selected":""}`}
                      onClick={()=>{
                        if(o.k==="Any") { setOnbBody(["Any"]); return; }
                        setOnbBody(p => {
                          const without = p.filter(x=>x!=="Any");
                          return without.includes(o.k) ? without.filter(x=>x!==o.k) : [...without,o.k];
                        });
                      }}>
                      <div className="onb-option-icon">{o.icon}</div>
                      <div className="onb-option-label">{o.label}</div>
                      <div className="onb-option-desc">{o.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="onb-footer">
                  <button className="btn btn-outline" onClick={()=>setOnbStep(2)} style={{flex:1}}>Back</button>
                  <button className="btn btn-primary" onClick={()=>setOnbStep(4)} style={{flex:2}}>Continue</button>
                </div>
              </div>
            )}

            {/* STEP 4 — Use case */}
            {onbStep===4 && (
              <div className="fade-in">
                <div className="onb-emoji">🎯</div>
                <div className="onb-title">What matters most?</div>
                <div className="onb-subtitle">We'll tailor your experience based on your priorities.</div>
                <div className="onb-options" style={{gridTemplateColumns:"1fr"}}>
                  {[
                    {k:"commute",icon:"🏙️",label:"Daily Commute",desc:"Low running costs, fuel efficiency, reliability"},
                    {k:"family",icon:"👨‍👩‍👧‍👦",label:"Family Car",desc:"Space, safety, boot capacity, comfort"},
                    {k:"first",icon:"🔰",label:"First Car",desc:"Low insurance, affordable, easy to drive"},
                    {k:"performance",icon:"🏎️",label:"Performance",desc:"Power, handling, driving experience"},
                    {k:"eco",icon:"🌱",label:"Eco / Green",desc:"Low emissions, ULEZ compliant, EV ready"},
                  ].map(o => (
                    <div key={o.k} className={`onb-option${onbUse===o.k?" selected":""}`} onClick={()=>setOnbUse(o.k)}
                      style={{flexDirection:"row",gap:14,padding:"14px 18px",textAlign:"left"}}>
                      <div className="onb-option-icon">{o.icon}</div>
                      <div>
                        <div className="onb-option-label">{o.label}</div>
                        <div className="onb-option-desc">{o.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="onb-footer">
                  <button className="btn btn-outline" onClick={()=>setOnbStep(3)} style={{flex:1}}>Back</button>
                  <button className="btn btn-primary" onClick={()=>setOnbStep(5)} style={{flex:2}}>Continue</button>
                </div>
              </div>
            )}

            {/* STEP 5 — Must-have features */}
            {onbStep===5 && (
              <div className="fade-in">
                <div className="onb-emoji">✨</div>
                <div className="onb-title">Must-have features?</div>
                <div className="onb-subtitle">Select any features you can't live without. Optional!</div>
                <div className="onb-feature-grid">
                  {[
                    {k:"cruise",icon:"🚀",label:"Cruise Control"},
                    {k:"carplay",icon:"📱",label:"Apple CarPlay"},
                    {k:"heated",icon:"🔥",label:"Heated Seats"},
                    {k:"camera",icon:"📷",label:"Reverse Cam"},
                    {k:"nav",icon:"🗺️",label:"Sat Nav"},
                    {k:"parking",icon:"🅿️",label:"Park Sensors"},
                    {k:"sunroof",icon:"☀️",label:"Sunroof"},
                    {k:"leather",icon:"💺",label:"Leather"},
                    {k:"keyless",icon:"🔑",label:"Keyless Entry"},
                  ].map(o => (
                    <div key={o.k} className={`onb-feature${onbFeatures.includes(o.k)?" selected":""}`}
                      onClick={()=>setOnbFeatures(p=>p.includes(o.k)?p.filter(x=>x!==o.k):[...p,o.k])}>
                      <div className="onb-feature-icon">{o.icon}</div>
                      <div className="onb-feature-label">{o.label}</div>
                    </div>
                  ))}
                </div>
                <div className="onb-footer">
                  <button className="btn btn-outline" onClick={()=>setOnbStep(4)} style={{flex:1}}>Back</button>
                  <button className="btn btn-primary" onClick={()=>{
                    // Apply preferences — set filters based on onboarding
                    if(onbBudget==="u10") setFPrice("u15");
                    else if(onbBudget==="10-20") setFPrice("u20");
                    else if(onbBudget==="20-30") setFPrice("u30");
                    else if(onbBudget==="30+") setFPrice("25+");
                    if(onbFuel.length===1 && onbFuel[0]!=="Any") setFFuel(onbFuel[0]);
                    if(onbBody.length===1 && onbBody[0]!=="Any") setFBody(onbBody[0]);
                    if(onbUse==="first"){ setFInsurance("low"); setFSort("insurance"); }
                    if(onbUse==="eco"){ setFUlez("yes"); }
                    if(onbUse==="performance"){ setFSort("match"); }
                    setShowOnboarding(false);
                    setPage("search");
                  }} style={{flex:2,padding:"14px",fontSize:15,fontWeight:700}}>
                    🚗 Find my perfect car
                  </button>
                </div>
                <button onClick={()=>{setShowOnboarding(false);}} style={{
                  background:"none",border:"none",cursor:"pointer",
                  fontSize:13,color:"var(--text-tertiary)",padding:"12px 0",textAlign:"center",width:"100%"
                }}>Skip for now</button>
              </div>
            )}

            {/* Skip link on all steps except last */}
            {onbStep < 5 && (
              <button onClick={()=>setShowOnboarding(false)} style={{
                background:"none",border:"none",cursor:"pointer",
                fontSize:13,color:"var(--text-tertiary)",padding:"12px 0",textAlign:"center",
                marginTop:onbStep===0?0:"auto"
              }}>Skip setup</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
