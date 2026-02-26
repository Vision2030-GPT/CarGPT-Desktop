import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import * as Papa from "papaparse";
import { Upload, ZoomIn, ZoomOut, RotateCcw, Settings, ChevronDown, ChevronUp, X, Crosshair, List, Maximize2 } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, ComposedChart, Line } from "recharts";

function mulberry32(seed){let s=seed|0;return()=>{s=(s+0x6d2b79f5)|0;let t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
function seededGaussian(rng){let u,v,s;do{u=rng()*2-1;v=rng()*2-1;s=u*u+v*v;}while(s>=1||s===0);return u*Math.sqrt((-2*Math.log(s))/s);}
function generateSampleData(count=500,seed=42){
  const rng=mulberry32(seed);const gauss=()=>seededGaussian(rng);const bars=[];
  const regimes=[{type:"up",dur:45},{type:"down",dur:55},{type:"flat",dur:25},{type:"up",dur:60},{type:"down",dur:35},{type:"up",dur:40},{type:"flat",dur:30},{type:"down",dur:60},{type:"flat",dur:25},{type:"up",dur:70},{type:"down",dur:30},{type:"up",dur:30}];
  let price=100,date=new Date("2023-01-01"),rIdx=0,barInRegime=0;
  for(let i=0;i<count;i++){while(date.getDay()===0||date.getDay()===6)date.setDate(date.getDate()+1);const r=regimes[rIdx%regimes.length];let drift=0,vol=1.5;if(r.type==="up"){drift=0.3+0.2*rng();vol=1.2+rng();}else if(r.type==="down"){drift=-0.35-0.2*rng();vol=1.3+rng();}else{drift=(rng()-0.5)*0.1;vol=0.6+0.5*rng();}const move=drift+gauss()*vol;const open=i===0?price:price+(rng()-0.5)*0.3;const close=open+move;const high=Math.max(open,close)+Math.abs(gauss())*vol*0.5;const low=Math.min(open,close)-Math.abs(gauss())*vol*0.5;bars.push({date:date.toISOString().slice(0,10),open:+open.toFixed(2),high:+high.toFixed(2),low:+Math.max(low,1).toFixed(2),close:+close.toFixed(2)});price=close;barInRegime++;if(barInRegime>=r.dur){barInRegime=0;rIdx++;}date=new Date(date);date.setDate(date.getDate()+1);}
  return bars;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GRID ENGINE (Spec §5.2, eqs 5.8–5.14)
// ═══════════════════════════════════════════════════════════════════════════════
function createGridEngine(P0,PH,PL,params){
  const{phi,theta,u,d,n,alpha}=params;
  const phiR=(phi*Math.PI)/180,thetaR=(theta*Math.PI)/180;
  const dP=PH-PL; if(dP<=0)return null;
  const norm=alpha/(n-1);
  // Slopes: βU and βD include α/(n-1) normalization (spec eqs 5.2, 5.5)
  const betaU=norm*Math.tan(thetaR);
  // D-line angle = (θ-ϕ) from horizontal: negative when ϕ>θ = downward ✓
  const betaD=norm*Math.tan(thetaR-phiR);
  // hU,hD from Appendix A (eqs A.7,A.8) are in chart units where 1 unit = α/(n-1)·ΔP
  // Multiply by norm to convert to ΔP fractions for use in eqs 5.8-5.9
  const hU=(d*Math.sin(phiR))/Math.cos(thetaR)*norm;
  const hD=(u*Math.sin(phiR))/Math.cos(phiR-thetaR)*norm;
  // Spec eqs 5.8-5.9
  const U=(lambda,j)=>P0+(lambda*hU+j*betaU)*dP;
  const D=(lambda,j)=>P0+(lambda*hD+j*betaD)*dP;
  return{U,D,betaU,betaD,hU,hD,dP,P0,PH,PL,n};
}

function getEps(v,e){return e*Math.abs(v);}
function isTouch(bar,gv,ep){const e=getEps(gv,ep);return bar.low-e<=gv&&gv<=bar.high+e;}
function isBreakU(bar,gv){return bar.low>gv;}function isBreakD(bar,gv){return bar.high<gv;}
function isRetraceU(bar,gv){return bar.high>gv;}function isRetraceD(bar,gv){return bar.low<gv;}
function runO1(bars,i,n){const s=Math.max(0,i-n+1);let mL=Infinity,mH=-Infinity;for(let j=s;j<=i;j++){mL=Math.min(mL,bars[j].low);mH=Math.max(mH,bars[j].high);}if(bars[i].low<=mL)return{P0:bars[i].low,PH:mH,PL:bars[i].low,barIndex:i,type:"O1"};return null;}
function runO2(bars,i,n){const s=Math.max(0,i-n+1);let mL=Infinity,mH=-Infinity;for(let j=s;j<=i;j++){mL=Math.min(mL,bars[j].low);mH=Math.max(mH,bars[j].high);}if(bars[i].high>=mH)return{P0:bars[i].high,PH:bars[i].high,PL:mL,barIndex:i,type:"O2"};return null;}

const STRATEGY_DEFS={
  S2:{id:"S2",name:"Buy-and-hold",orig:"O1",dir:"BUY",confirmType:"retrace",confirmLine:{f:"U",l:1},entryLine:{f:"U",l:0},tpLine:{f:"U",l:1},slLine:{f:"U",l:-1},touchNum:1},
  S3:{id:"S3",name:"Buy 2nd touch",orig:"O1",dir:"BUY",confirmType:"retrace",confirmLine:{f:"U",l:1},entryLine:{f:"U",l:0},tpLine:{f:"U",l:1},slLine:{f:"U",l:-1},touchNum:2},
  S4:{id:"S4",name:"Buy 3rd touch",orig:"O1",dir:"BUY",confirmType:"retrace",confirmLine:{f:"U",l:1},entryLine:{f:"U",l:0},tpLine:{f:"U",l:1},slLine:{f:"U",l:-1},touchNum:3},
  S5:{id:"S5",name:"Sell-and-hold",orig:"O2",dir:"SELL",confirmType:"retrace",confirmLine:{f:"D",l:-1},entryLine:{f:"D",l:0},tpLine:{f:"D",l:-1},slLine:{f:"D",l:1},touchNum:1},
  S6:{id:"S6",name:"Sell 2nd touch",orig:"O2",dir:"SELL",confirmType:"retrace",confirmLine:{f:"D",l:-1},entryLine:{f:"D",l:0},tpLine:{f:"D",l:-1},slLine:{f:"D",l:1},touchNum:2},
  S7:{id:"S7",name:"Sell 3rd touch",orig:"O2",dir:"SELL",confirmType:"retrace",confirmLine:{f:"D",l:-1},entryLine:{f:"D",l:0},tpLine:{f:"D",l:-1},slLine:{f:"D",l:1},touchNum:3},
  S8:{id:"S8",name:"Sell ext target",orig:"O2",dir:"SELL",confirmType:"retrace",confirmLine:{f:"D",l:-1},entryLine:{f:"D",l:0},tpLine:{f:"D",l:-2},slLine:{f:"D",l:1},touchNum:1},
  S9:{id:"S9",name:"Sell NO retrace",orig:"O2",dir:"SELL",confirmType:"breaks",confirmLine:{f:"D",l:-1},entryLine:{f:"D",l:-1},tpLine:{f:"D",l:-2},slLine:{f:"D",l:0},touchNum:1},
  S10:{id:"S10",name:"Buy NO retrace",orig:"O1",dir:"BUY",confirmType:"breaks",confirmLine:{f:"U",l:1},entryLine:{f:"U",l:1},tpLine:{f:"U",l:2},slLine:{f:"U",l:0},touchNum:1},
  S11:{id:"S11",name:"Sell ext retrace",orig:"O2",dir:"SELL",confirmType:"retrace",confirmLine:{f:"D",l:-2},entryLine:{f:"D",l:-1},tpLine:{f:"D",l:-2},slLine:{f:"D",l:0},touchNum:1},
  S12:{id:"S12",name:"Buy ext retrace",orig:"O1",dir:"BUY",confirmType:"retrace",confirmLine:{f:"U",l:2},entryLine:{f:"U",l:1},tpLine:{f:"U",l:2},slLine:{f:"U",l:0},touchNum:1},
};
function getGridLineVal(g,ld,j){return ld.f==="U"?g.U(ld.l,j):g.D(ld.l,j);}
function simulateFill(bar,op,dir,mode,nb){if(bar.low<=op&&op<=bar.high){if(mode==="W")return dir==="BUY"?bar.high:bar.low;if(mode==="A")return(bar.high+bar.low)/2;if(mode==="N"&&nb)return nb.open;return dir==="BUY"?bar.high:bar.low;}if((dir==="BUY"&&bar.low>op)||(dir==="SELL"&&bar.high<op))return bar.open;return null;}

function runBacktest(bars,params,enStrats,emsMode){
  const{n,epsilon,nu,kappa,mu}=params;const ops=[],trades=[],events=[];let opC=0,ai=[];
  const addEv=(bar,type,msg)=>events.push({barIdx:bar,date:bars[bar]?.date||"",type,msg});
  addEv(Math.max(0,n-1),"system","Backtest started");
  for(let i=n-1;i<bars.length;i++){const b=bars[i];
    for(const oId of["O1","O2"]){const om=oId==="O1"?runO1(bars,i,n):runO2(bars,i,n);if(!om)continue;for(const op of ops){if(op.originator===oId&&op.state==="PENDING"&&om.P0!==op.P0){op.state="INVALIDATED";op.endBar=i;ai=ai.filter(x=>x.opId!==op.id);}}opC++;const nOp={id:opC,...om,originator:oId,state:"PENDING",detectedBar:i,confirmedBar:null,endBar:null,grid:createGridEngine(om.P0,om.PH,om.PL,params)};ops.push(nOp);addEv(i,"op",`${oId}: OP #${nOp.id} at ${om.P0.toFixed(2)}`);for(const sId of enStrats){const sd=STRATEGY_DEFS[sId];if(sd.orig!==oId)continue;ai.push({id:trades.length+ai.length+1,stratId:sId,opId:nOp.id,op:nOp,state:"WC",tc:0,bc:0,cb:null,eb:null,ep:null,xb:null,xp:null,xt:null,bW:0,bA:0});}}
    const rm=new Set();for(let si=0;si<ai.length;si++){const inst=ai[si];const op=inst.op;const grid=op.grid;if(!grid){rm.add(si);continue;}const sd=STRATEGY_DEFS[inst.stratId];const j=i-op.barIndex;
      if(inst.state==="WC"){inst.bW++;if(inst.bW>(nu||n)){if(op.state==="PENDING"){op.state="CANCELLED";op.endBar=i;}rm.add(si);continue;}const cv=getGridLineVal(grid,sd.confirmLine,j);if(sd.confirmType==="retrace"){if(sd.confirmLine.f==="U"?isRetraceU(b,cv):isRetraceD(b,cv)){inst.state="WE";inst.cb=i;if(op.state==="PENDING"){op.state="CONFIRMED";op.confirmedBar=i;addEv(i,"op",`OP #${op.id}: CONFIRMED`);}}}else{if(sd.confirmLine.f==="U"?isBreakU(b,cv):isBreakD(b,cv))inst.bc++;else inst.bc=0;if(inst.bc>=(mu||2)){inst.state="WE";inst.cb=i;if(op.state==="PENDING"){op.state="CONFIRMED";op.confirmedBar=i;}}}}
      else if(inst.state==="WE"){inst.bA++;if(inst.bA>(kappa||n)){if(op.state==="CONFIRMED"){op.state="EXPIRED";op.endBar=i;}rm.add(si);continue;}const eV=getGridLineVal(grid,sd.entryLine,j),tV=getGridLineVal(grid,sd.tpLine,j),sV=getGridLineVal(grid,sd.slLine,j);if(b.low<=eV&&eV<=b.high&&((b.low<=tV&&tV<=b.high)||(b.low<=sV&&sV<=b.high))){trades.push({...inst,xt:"FAIL",xb:i,eb:i});rm.add(si);continue;}if(isTouch(b,eV,epsilon)){inst.tc++;if(inst.tc>=sd.touchNum){const fill=simulateFill(b,eV,sd.dir,emsMode,bars[i+1]);if(fill!==null){inst.eb=i;inst.ep=+fill.toFixed(2);inst.state="IT";addEv(i,"trade",`${sd.id}: ${sd.dir} ENTRY at ${fill.toFixed(2)}`);}}}}
      else if(inst.state==="IT"){const tV=getGridLineVal(grid,sd.tpLine,j),sV=getGridLineVal(grid,sd.slLine,j);const spTP=b.low<=tV&&tV<=b.high,spSL=b.low<=sV&&sV<=b.high;if(spTP&&spSL){trades.push({...inst,xt:"FAIL",xb:i});rm.add(si);continue;}if(spTP||(sd.dir==="BUY"?b.low>tV:b.high<tV)){const fill=spTP?simulateFill(b,tV,sd.dir==="BUY"?"SELL":"BUY",emsMode,bars[i+1]):b.open;inst.xb=i;inst.xp=+(fill||b.open).toFixed(2);inst.xt="TP";trades.push({...inst});rm.add(si);continue;}if(spSL||(sd.dir==="BUY"?b.high<sV:b.low>sV)){const fill=spSL?simulateFill(b,sV,sd.dir==="BUY"?"SELL":"BUY",emsMode,bars[i+1]):b.open;inst.xb=i;inst.xp=+(fill||b.open).toFixed(2);inst.xt="SL";trades.push({...inst});rm.add(si);continue;}}}
    if(rm.size>0)ai=ai.filter((_,idx)=>!rm.has(idx));}
  addEv(bars.length-1,"system",`Done: ${trades.filter(t=>t.xt!=="FAIL").length} trades`);return{ops,trades,events,activeInstances:ai};
}

function createSimState(p,es,em){return{ops:[],trades:[],events:[],activeInstances:[],opCounter:0,currentBar:p.n-1,params:p,enabledStrategies:es,emsMode:em};}
function simProcessBar(st,bars,ti){const{params,enabledStrategies:es,emsMode:em}=st;const{n,epsilon,nu,kappa,mu}=params;const i=ti;if(i<n-1||i>=bars.length)return st;const b=bars[i];const nE=[];const ae=(t,m)=>nE.push({barIdx:i,date:b.date,type:t,msg:m});let{ops,trades,activeInstances:ai,opCounter:opC}=st;ops=[...ops];trades=[...trades];ai=[...ai];
for(const oId of["O1","O2"]){const om=oId==="O1"?runO1(bars,i,n):runO2(bars,i,n);if(!om)continue;for(let oi=0;oi<ops.length;oi++){if(ops[oi].originator===oId&&ops[oi].state==="PENDING"&&om.P0!==ops[oi].P0){ops[oi]={...ops[oi],state:"INVALIDATED",endBar:i};ai=ai.filter(x=>x.opId!==ops[oi].id);}}opC++;const nOp={id:opC,...om,originator:oId,state:"PENDING",detectedBar:i,confirmedBar:null,endBar:null,grid:createGridEngine(om.P0,om.PH,om.PL,params)};ops.push(nOp);ae("op",`${oId}: OP #${nOp.id}`);for(const sId of es){const sd=STRATEGY_DEFS[sId];if(sd.orig!==oId)continue;ai.push({id:trades.length+ai.length+1,stratId:sId,opId:nOp.id,op:nOp,state:"WC",tc:0,bc:0,cb:null,eb:null,ep:null,xb:null,xp:null,xt:null,bW:0,bA:0});}}
const rm=new Set();for(let si=0;si<ai.length;si++){const inst={...ai[si]};ai[si]=inst;const op=ops.find(o=>o.id===inst.opId);const grid=op?.grid;if(!grid){rm.add(si);continue;}const sd=STRATEGY_DEFS[inst.stratId];const j=i-op.barIndex;
if(inst.state==="WC"){inst.bW++;if(inst.bW>(nu||n)){if(op.state==="PENDING"){const oi=ops.indexOf(op);ops[oi]={...op,state:"CANCELLED",endBar:i};}rm.add(si);continue;}const cv=getGridLineVal(grid,sd.confirmLine,j);if(sd.confirmType==="retrace"){if(sd.confirmLine.f==="U"?isRetraceU(b,cv):isRetraceD(b,cv)){inst.state="WE";inst.cb=i;if(op.state==="PENDING"){const oi=ops.indexOf(op);ops[oi]={...op,state:"CONFIRMED",confirmedBar:i};ae("op",`OP #${op.id}: CONFIRMED`);}}}else{if(sd.confirmLine.f==="U"?isBreakU(b,cv):isBreakD(b,cv))inst.bc++;else inst.bc=0;if(inst.bc>=(mu||2)){inst.state="WE";inst.cb=i;if(op.state==="PENDING"){const oi=ops.indexOf(op);ops[oi]={...op,state:"CONFIRMED",confirmedBar:i};}}}}
else if(inst.state==="WE"){inst.bA++;if(inst.bA>(kappa||n)){if(op.state==="CONFIRMED"){const oi=ops.indexOf(op);ops[oi]={...op,state:"EXPIRED",endBar:i};}rm.add(si);continue;}const eV=getGridLineVal(grid,sd.entryLine,j),tV=getGridLineVal(grid,sd.tpLine,j),sV=getGridLineVal(grid,sd.slLine,j);if(b.low<=eV&&eV<=b.high&&((b.low<=tV&&tV<=b.high)||(b.low<=sV&&sV<=b.high))){trades.push({...inst,xt:"FAIL",xb:i,eb:i});rm.add(si);continue;}if(isTouch(b,eV,epsilon)){inst.tc++;if(inst.tc>=sd.touchNum){const fill=simulateFill(b,eV,sd.dir,em,bars[i+1]);if(fill!==null){inst.eb=i;inst.ep=+fill.toFixed(2);inst.state="IT";ae("trade",`${sd.id}: ${sd.dir} at ${fill.toFixed(2)}`);}}}}
else if(inst.state==="IT"){const tV=getGridLineVal(grid,sd.tpLine,j),sV=getGridLineVal(grid,sd.slLine,j);const spTP=b.low<=tV&&tV<=b.high,spSL=b.low<=sV&&sV<=b.high;if(spTP&&spSL){trades.push({...inst,xt:"FAIL",xb:i});rm.add(si);continue;}if(spTP||(sd.dir==="BUY"?b.low>tV:b.high<tV)){const fill=spTP?simulateFill(b,tV,sd.dir==="BUY"?"SELL":"BUY",em,bars[i+1]):b.open;inst.xb=i;inst.xp=+(fill||b.open).toFixed(2);inst.xt="TP";trades.push({...inst});rm.add(si);continue;}if(spSL||(sd.dir==="BUY"?b.high<sV:b.low>sV)){const fill=spSL?simulateFill(b,sV,sd.dir==="BUY"?"SELL":"BUY",em,bars[i+1]):b.open;inst.xb=i;inst.xp=+(fill||b.open).toFixed(2);inst.xt="SL";trades.push({...inst});rm.add(si);continue;}}}
if(rm.size>0)ai=ai.filter((_,idx)=>!rm.has(idx));return{...st,ops,trades,activeInstances:ai,opCounter:opC,currentBar:i,events:[...st.events,...nE]};}

function computeAnalytics(trades){const c=trades.filter(t=>t.xt==="TP"||t.xt==="SL");const f=trades.filter(t=>t.xt==="FAIL");if(c.length===0)return{totalTrades:0,wins:0,losses:0,winRate:0,totalPnL:0,avgPnL:0,profitFactor:0,maxDD:0,sharpe:0,avgBarsHeld:0,fails:f.length,equityCurve:[]};const pnls=c.map(t=>{const sd=STRATEGY_DEFS[t.stratId];return sd.dir==="BUY"?t.xp-t.ep:t.ep-t.xp;});const w=pnls.filter(p=>p>0),l=pnls.filter(p=>p<=0);const tot=pnls.reduce((a,b)=>a+b,0);const gP=w.reduce((a,b)=>a+b,0),gL=Math.abs(l.reduce((a,b)=>a+b,0));let eq=0,pk=0,mDD=0;const eqC=c.map((_,idx)=>{eq+=pnls[idx];pk=Math.max(pk,eq);mDD=Math.max(mDD,pk-eq);return{idx:idx+1,equity:+eq.toFixed(2),drawdown:+(-(pk-eq)).toFixed(2)};});const mean=tot/pnls.length;const vr=pnls.reduce((s,p)=>s+(p-mean)**2,0)/pnls.length;const bH=c.filter(t=>t.eb!=null&&t.xb!=null).map(t=>t.xb-t.eb);return{totalTrades:c.length,wins:w.length,losses:l.length,winRate:+(w.length/c.length*100).toFixed(1),totalPnL:+tot.toFixed(2),avgPnL:+(tot/c.length).toFixed(2),profitFactor:gL>0?+(gP/gL).toFixed(2):gP>0?Infinity:0,maxDD:+mDD.toFixed(2),sharpe:+(vr>0?mean/Math.sqrt(vr):0).toFixed(3),avgBarsHeld:+(bH.length>0?bH.reduce((a,b)=>a+b,0)/bH.length:0).toFixed(1),fails:f.length,equityCurve:eqC};}
const PRESETS={default:{phi:58,theta:45,u:15.4,d:16.2,n:125,alpha:1.414,epsilon:0.001,nu:125,kappa:125,mu:2},tight:{phi:45,theta:30,u:10,d:10.6,n:80,alpha:1.2,epsilon:0.0005,nu:80,kappa:80,mu:2},wide:{phi:65,theta:35,u:22,d:23.4,n:200,alpha:2.0,epsilon:0.002,nu:200,kappa:200,mu:3}};

// ═══════════════════════════════════════════════════════════════════════════════
// GRID DRAWING — Mathematical bar-by-bar using spec formulas U_λ(j) and D_λ(j)
// Plots the actual grid price values at each bar index — simplest, most reliable
// ═══════════════════════════════════════════════════════════════════════════════
function drawGrid(ctx, grid, opBarIndex, start, end, barWidth, leftPad, yScale, minP, maxP, chartH, topPad, rightEdge) {
  if (!grid) return;
  const dP = grid.dP;
  const priceRange = maxP - minP;
  if (priceRange <= 0 || dP <= 0) return;

  // How many lambda lines needed to fill the visible price range
  const hUprice = Math.abs(grid.hU * dP);
  const hDprice = Math.abs(grid.hD * dP);
  const maxLamU = hUprice > 0.001 ? Math.ceil(priceRange / hUprice) + 8 : 15;
  const maxLamD = hDprice > 0.001 ? Math.ceil(priceRange / hDprice) + 8 : 15;

  const xB = (idx) => leftPad + (idx - start) * barWidth + barWidth / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(leftPad, topPad, rightEdge - leftPad, chartH);
  ctx.clip();

  // U-family lines (blue) — plot U_λ(j) bar by bar
  for (let lam = -maxLamU; lam <= maxLamU; lam++) {
    const isZero = lam === 0;
    ctx.strokeStyle = isZero ? "rgba(70,140,255,0.95)" : "rgba(70,140,255,0.5)";
    ctx.lineWidth = isZero ? 2.5 : 1.0;
    ctx.beginPath();
    let started = false;
    for (let idx = start; idx < end; idx++) {
      const j = idx - opBarIndex;
      const price = grid.U(lam, j);
      const x = xB(idx);
      const y = yScale(price);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // Label
    const jEnd = end - 1 - opBarIndex;
    const pEnd = grid.U(lam, jEnd);
    const yEnd = yScale(pEnd);
    if (yEnd > topPad + 5 && yEnd < topPad + chartH - 5) {
      ctx.fillStyle = "rgba(70,140,255,0.9)";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "right";
      ctx.fillText(isZero ? "U0" : lam > 0 ? `U${lam}+` : `U${Math.abs(lam)}-`, rightEdge - 3, yEnd - 3);
    }
  }

  // D-family lines (orange) — plot D_λ(j) bar by bar
  for (let lam = -maxLamD; lam <= maxLamD; lam++) {
    const isZero = lam === 0;
    ctx.strokeStyle = isZero ? "rgba(255,160,50,0.95)" : "rgba(255,160,50,0.5)";
    ctx.lineWidth = isZero ? 2.5 : 1.0;
    ctx.beginPath();
    let started = false;
    for (let idx = start; idx < end; idx++) {
      const j = idx - opBarIndex;
      const price = grid.D(lam, j);
      const x = xB(idx);
      const y = yScale(price);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    // Label
    const jStart = start - opBarIndex;
    const pStart = grid.D(lam, jStart);
    const yStart = yScale(pStart);
    if (yStart > topPad + 5 && yStart < topPad + chartH - 5) {
      ctx.fillStyle = "rgba(255,160,50,0.9)";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "left";
      ctx.fillText(isZero ? "D0" : lam > 0 ? `D${lam}+` : `D${Math.abs(lam)}-`, leftPad + 3, yStart - 3);
    }
  }

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function NapaCapaApp() {
  const [bars, setBars] = useState(() => generateSampleData());
  const [params, setParams] = useState({...PRESETS.default});
  const [enabledStrats, setEnabledStrats] = useState(["S2","S5"]);
  const [emsMode, setEmsMode] = useState("W");
  const [mode, setMode] = useState("backtest");
  const [manualOP, setManualOP] = useState(null);
  const [clickMode, setClickMode] = useState("manual");
  const [btResult, setBtResult] = useState(null);
  const [simState, setSimState] = useState(null);
  const [simPlaying, setSimPlaying] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const simRef = useRef(null);
  const [showEventLog, setShowEventLog] = useState(false);
  const canvasRef = useRef(null);
  const [chartScroll, setChartScroll] = useState(0);
  const [barWidth, setBarWidth] = useState(8);
  const [bottomTab, setBottomTab] = useState("blotter");
  const [bottomHeight, setBottomHeight] = useState(250);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [blotterSort, setBlotterSort] = useState({col:"xb",asc:false});
  const [fitGrid, setFitGrid] = useState(false);
  const chartLayoutRef = useRef({start:0,end:0,minP:0,maxP:0,leftPad:60,topPad:10,chartW:0,chartH:0});

  const visibleBars = useMemo(() => mode==="simulation"&&simState?bars.slice(0,simState.currentBar+1):bars, [bars,mode,simState]);
  const result = mode==="backtest"?btResult:simState?{ops:simState.ops,trades:simState.trades,events:simState.events,activeInstances:simState.activeInstances}:null;
  const analytics = useMemo(() => result?computeAnalytics(result.trades):null, [result]);
  const displayGrid = useMemo(() => {
    if(manualOP?.grid)return{grid:manualOP.grid,opBarIndex:manualOP.barIndex};
    if(clickMode==="auto"&&result?.ops){const a=result.ops.filter(op=>(op.state==="PENDING"||op.state==="CONFIRMED")&&op.grid).slice(-1)[0];if(a)return{grid:a.grid,opBarIndex:a.barIndex};}
    return null;
  }, [manualOP,clickMode,result]);

  useEffect(()=>{if(manualOP)setManualOP(prev=>prev?{...prev,grid:createGridEngine(prev.P0,prev.PH,prev.PL,params)}:null);},[params.phi,params.theta,params.u,params.d,params.n,params.alpha]);

  // Fit to Grid: set chart proportions to match spec's conceptual chart
  // so visual angles on screen match θ and ϕ exactly
  const doFitToGrid = useCallback(() => {
    if (!manualOP) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const cH = canvas.parentElement.clientHeight - 40;
    // Spec: x-axis = (n-1) units, y-axis = (n-1)/α units
    // For correct visual aspect: barWidth = α * cH / (n-1)
    const newBW = Math.max(2, Math.min(30, Math.round(params.alpha * cH / (params.n - 1))));
    setBarWidth(newBW);
    setChartScroll(Math.max(0, manualOP.barIndex - 5));
    setFitGrid(true);
  }, [manualOP, params]);

  const handleRunBacktest = useCallback(()=>{if(mode==="backtest")setBtResult(runBacktest(bars,params,enabledStrats,emsMode));else{setSimPlaying(false);const s=createSimState(params,enabledStrats,emsMode);s.events.push({barIdx:params.n-1,date:bars[params.n-1]?.date||"",type:"system",msg:"Simulation started"});setSimState(s);}},[bars,params,enabledStrats,emsMode,mode]);
  useEffect(()=>{if(!simPlaying||!simState||mode!=="simulation")return;const speeds={1:500,2:250,5:100,10:50,25:20,50:10,100:5};const iv=speeds[simSpeed]||500;let lt=0,r=true;const step=(t)=>{if(!r)return;if(t-lt>=iv){lt=t;setSimState(p=>{if(!p||p.currentBar>=bars.length-1){setSimPlaying(false);return p;}return simProcessBar(p,bars,p.currentBar+1);});}simRef.current=requestAnimationFrame(step);};simRef.current=requestAnimationFrame(step);return()=>{r=false;if(simRef.current)cancelAnimationFrame(simRef.current);};},[simPlaying,simSpeed,simState,bars,mode]);
  const simStepFwd=useCallback(()=>{if(!simState||simState.currentBar>=bars.length-1)return;setSimState(p=>simProcessBar(p,bars,p.currentBar+1));},[simState,bars]);
  const simStepBack=useCallback(()=>{if(!simState||simState.currentBar<=params.n-1)return;let s=createSimState(params,enabledStrats,emsMode);for(let i=params.n-1;i<=simState.currentBar-1;i++)s=simProcessBar(s,bars,i);setSimState(s);},[simState,bars,params,enabledStrats,emsMode]);
  const simReset=useCallback(()=>{setSimPlaying(false);const s=createSimState(params,enabledStrats,emsMode);s.events.push({barIdx:params.n-1,date:bars[params.n-1]?.date||"",type:"system",msg:"Reset"});setSimState(s);},[params,enabledStrats,emsMode,bars]);
  const simScrub=useCallback((t)=>{setSimPlaying(false);let s=createSimState(params,enabledStrats,emsMode);for(let i=params.n-1;i<=t;i++)s=simProcessBar(s,bars,i);setSimState(s);},[params,enabledStrats,emsMode,bars]);
  useEffect(()=>{if(mode!=="simulation"||!simState)return;const h=(e)=>{if(e.target.tagName==="INPUT"||e.target.tagName==="SELECT")return;const sp=[1,2,5,10,25,50,100];if(e.code==="Space"){e.preventDefault();setSimPlaying(p=>!p);}if(e.code==="ArrowRight"){e.preventDefault();simStepFwd();}if(e.code==="ArrowLeft"){e.preventDefault();simStepBack();}if(e.code==="ArrowUp"){e.preventDefault();setSimSpeed(p=>{const i=sp.indexOf(p);return i<sp.length-1?sp[i+1]:p;});}if(e.code==="ArrowDown"){e.preventDefault();setSimSpeed(p=>{const i=sp.indexOf(p);return i>0?sp[i-1]:p;});}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[mode,simState,simStepFwd,simStepBack]);
  useEffect(()=>{if(mode==="simulation"&&simState){const cW=canvasRef.current?.width||800;setChartScroll(Math.max(0,simState.currentBar-Math.floor(cW/barWidth)+20));}},[simState?.currentBar,mode,barWidth]);
  const handleUpload=(e)=>{const file=e.target.files?.[0];if(!file)return;Papa.parse(file,{header:true,skipEmptyLines:true,dynamicTyping:true,complete:(res)=>{const p=res.data.filter(r=>r.date&&r.open!=null&&r.high!=null&&r.low!=null&&r.close!=null).map(r=>({date:String(r.date),open:+r.open,high:+r.high,low:+r.low,close:+r.close}));if(p.length>0){setBars(p);setBtResult(null);setSimState(null);setManualOP(null);}}});};
  const switchMode=(m)=>{setMode(m);setBtResult(null);setSimState(null);setSimPlaying(false);};

  // ═══ CANVAS ═══
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas||visibleBars.length===0)return;const ctx=canvas.getContext("2d");
    const W=canvas.parentElement.clientWidth;const H=canvas.parentElement.clientHeight;canvas.width=W;canvas.height=H;
    const lP=60,rP=20,tP=10,bP=30;const cW=W-lP-rP;const cH=H-tP-bP;const rE=W-rP;
    ctx.fillStyle="#0f1117";ctx.fillRect(0,0,W,H);
    const bV=Math.floor(cW/barWidth);const start=Math.max(0,chartScroll);const end=Math.min(visibleBars.length,start+bV);
    const slice=visibleBars.slice(start,end);if(slice.length===0)return;
    let minP,maxP;
    if(fitGrid&&manualOP){const pad=(manualOP.PH-manualOP.PL)*0.15;minP=manualOP.PL-pad;maxP=manualOP.PH+pad;}
    else{minP=Infinity;maxP=-Infinity;for(const b of slice){minP=Math.min(minP,b.low);maxP=Math.max(maxP,b.high);}const pad=(maxP-minP)*0.06;minP-=pad;maxP+=pad;}
    const yScale=(p)=>tP+cH*(1-(p-minP)/(maxP-minP));const xBar=(idx)=>lP+(idx-start)*barWidth;
    chartLayoutRef.current={start,end,minP,maxP,leftPad:lP,topPad:tP,chartW:cW,chartH:cH,rightEdge:rE};
    // Price axis
    ctx.strokeStyle="#1a1d24";ctx.lineWidth=1;const pS=Math.pow(10,Math.floor(Math.log10(maxP-minP)-0.5));
    for(let p=Math.floor(minP/pS)*pS;p<=maxP;p+=pS){const y=yScale(p);ctx.beginPath();ctx.moveTo(lP,y);ctx.lineTo(rE,y);ctx.stroke();ctx.fillStyle="#555";ctx.font="10px monospace";ctx.textAlign="right";ctx.fillText(p.toFixed(2),lP-4,y+3);}
    // ═══ GRID OVERLAY ═══
    if(displayGrid) drawGrid(ctx,displayGrid.grid,displayGrid.opBarIndex,start,end,barWidth,lP,yScale,minP,maxP,cH,tP,rE);
    // Dates
    ctx.fillStyle="#444";ctx.font="9px monospace";ctx.textAlign="center";const dS=Math.max(1,Math.floor(30/barWidth));
    for(let idx=start;idx<end;idx+=dS)ctx.fillText(visibleBars[idx].date.slice(5),xBar(idx)+barWidth/2,H-4);
    // Candles
    for(let idx=start;idx<end;idx++){const b=visibleBars[idx];const x=xBar(idx);const bw=Math.max(1,barWidth-2);const up=b.close>=b.open;ctx.fillStyle=ctx.strokeStyle=up?"#22c55e":"#ef4444";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+barWidth/2,yScale(b.high));ctx.lineTo(x+barWidth/2,yScale(b.low));ctx.stroke();const bt=yScale(Math.max(b.open,b.close));const bb=yScale(Math.min(b.open,b.close));if(up)ctx.strokeRect(x+1,bt,bw,Math.max(1,bb-bt));else ctx.fillRect(x+1,bt,bw,Math.max(1,bb-bt));}
    // OP marker
    if(manualOP&&manualOP.barIndex>=start&&manualOP.barIndex<end){const x=xBar(manualOP.barIndex)+barWidth/2;const y=yScale(manualOP.P0);ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fillStyle="#eab308";ctx.fill();ctx.strokeStyle="#000";ctx.lineWidth=1;ctx.stroke();ctx.fillStyle="#000";ctx.font="bold 8px monospace";ctx.textAlign="center";ctx.fillText("OP",x,y+3);}
    if(result?.ops){for(const op of result.ops){if(op.barIndex<start||op.barIndex>=end)continue;const x=xBar(op.barIndex)+barWidth/2;const y=yScale(op.P0);ctx.beginPath();ctx.arc(x,y,op.state==="CONFIRMED"?5:op.state==="PENDING"?5:3,0,Math.PI*2);ctx.fillStyle={PENDING:"#eab308",CONFIRMED:"#f97316",CANCELLED:"#6b7280",INVALIDATED:"#374151",EXPIRED:"#4b5563"}[op.state]||"#eab308";ctx.fill();}}
    if(result?.trades){for(const t of result.trades){const sd=STRATEGY_DEFS[t.stratId];if(t.eb!=null&&t.eb>=start&&t.eb<end){const x=xBar(t.eb)+barWidth/2,y=yScale(t.ep);ctx.fillStyle=sd.dir==="BUY"?"#22c55e":"#ef4444";ctx.beginPath();if(sd.dir==="BUY"){ctx.moveTo(x,y-6);ctx.lineTo(x-4,y+2);ctx.lineTo(x+4,y+2);}else{ctx.moveTo(x,y+6);ctx.lineTo(x-4,y-2);ctx.lineTo(x+4,y-2);}ctx.fill();}if(t.xb!=null&&t.xb>=start&&t.xb<end&&t.xt!=="FAIL"){const x=xBar(t.xb)+barWidth/2,y=yScale(t.xp);ctx.fillStyle=t.xt==="TP"?"#22c55e":"#ef4444";ctx.fillRect(x-4,y-4,8,8);}if(t.xt==="FAIL"&&t.xb>=start&&t.xb<end){const x=xBar(t.xb)+barWidth/2,y=yScale(visibleBars[t.xb]?.close||0);ctx.strokeStyle="#f97316";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-4,y-4);ctx.lineTo(x+4,y+4);ctx.stroke();ctx.beginPath();ctx.moveTo(x+4,y-4);ctx.lineTo(x-4,y+4);ctx.stroke();}}}
  },[visibleBars,barWidth,chartScroll,result,bottomHeight,displayGrid,manualOP,fitGrid,params.theta,params.phi]);

  const handleChartClick=useCallback((e)=>{
    if(clickMode!=="manual")return;const canvas=canvasRef.current;if(!canvas)return;
    const rect=canvas.getBoundingClientRect();const cx=e.clientX-rect.left;const cy=e.clientY-rect.top;
    const{start,minP,maxP,leftPad,topPad,chartH}=chartLayoutRef.current;
    if(cx<leftPad||cy<topPad||cy>topPad+chartH)return;
    const barIdx=start+Math.floor((cx-leftPad)/barWidth);if(barIdx<0||barIdx>=visibleBars.length)return;
    const clickPrice=maxP-((cy-topPad)/chartH)*(maxP-minP);const bar=visibleBars[barIdx];
    const n=params.n;const ls=Math.max(0,barIdx-n+1);let pH=-Infinity,pL=Infinity;
    for(let j=ls;j<=barIdx;j++){pH=Math.max(pH,bars[j].high);pL=Math.min(pL,bars[j].low);}
    const P0=Math.abs(clickPrice-bar.low)<Math.abs(clickPrice-bar.high)?bar.low:bar.high;
    setManualOP({barIndex:barIdx,P0,PH:pH,PL:pL,grid:createGridEngine(P0,pH,pL,params)});
    setFitGrid(true);
  },[clickMode,barWidth,visibleBars,params,bars]);

  const handleWheel=useCallback((e)=>{e.preventDefault();setFitGrid(false);if(e.ctrlKey||e.metaKey)setBarWidth(w=>Math.max(2,Math.min(30,w+(e.deltaY<0?1:-1))));else setChartScroll(s=>Math.max(0,s+Math.round(e.deltaY/30)));},[]);

  const simRunning=mode==="simulation"&&simState;const simBar=simState?.currentBar||params.n-1;
  const cumPnL=result?.trades?.filter(t=>t.xt==="TP"||t.xt==="SL").reduce((s,t)=>{const sd=STRATEGY_DEFS[t.stratId];return s+(sd.dir==="BUY"?t.xp-t.ep:t.ep-t.xp);},0)||0;

  // Check if theta+phi > 90 (D-lines will flip)
  const angleWarning = false; // pixel-space rendering handles all θ+ϕ values

  return(
    <div className="h-screen w-screen bg-gray-950 text-gray-200 flex flex-col overflow-hidden" style={{fontFamily:"'JetBrains Mono','Fira Code',monospace"}}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm tracking-wider text-blue-400">≡ NapaCapa</span>
          <div className="flex bg-gray-800 rounded overflow-hidden text-xs">
            <button onClick={()=>switchMode("backtest")} className={`px-3 py-1 ${mode==="backtest"?"bg-blue-600 text-white":"text-gray-400"}`}>Backtest</button>
            <button onClick={()=>switchMode("simulation")} className={`px-3 py-1 ${mode==="simulation"?"bg-blue-600 text-white":"text-gray-400"}`}>Simulation</button>
          </div>
          <div className="flex bg-gray-800 rounded overflow-hidden text-xs">
            <button onClick={()=>setClickMode("manual")} className={`px-2 py-1 flex items-center gap-1 ${clickMode==="manual"?"bg-yellow-600 text-white":"text-gray-400"}`}><Crosshair size={10}/>Manual OP</button>
            <button onClick={()=>setClickMode("auto")} className={`px-2 py-1 ${clickMode==="auto"?"bg-green-600 text-white":"text-gray-400"}`}>Auto OP</button>
          </div>
          {manualOP&&<button onClick={doFitToGrid} className="px-2 py-1 bg-purple-700 hover:bg-purple-600 rounded text-xs text-white flex items-center gap-1"><Maximize2 size={10}/>Fit to Grid</button>}
        </div>
        <div className="flex items-center gap-2">
          {manualOP&&<span className="text-xs text-yellow-400">OP: Bar {manualOP.barIndex} | P₀={manualOP.P0.toFixed(2)}</span>}
          <button onClick={()=>{setManualOP(null);setFitGrid(false);}} className="text-xs text-gray-500 hover:text-red-400">Clear OP</button>
          <label className="text-xs text-gray-500 hover:text-blue-400 cursor-pointer flex items-center gap-1"><Upload size={12}/>CSV<input type="file" accept=".csv,.tsv,.txt" onChange={handleUpload} className="hidden"/></label>
          <button onClick={()=>{setBars(generateSampleData());setBtResult(null);setSimState(null);setManualOP(null);}} className="text-xs text-gray-500 hover:text-blue-400">Sample</button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen&&(<div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 overflow-y-auto" style={{fontSize:"11px"}}>
          <div className="p-2 border-b border-gray-800">
            <div className="flex justify-between items-center mb-2"><span className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Parameters</span><button onClick={()=>setSidebarOpen(false)} className="text-gray-600 hover:text-gray-300"><X size={12}/></button></div>
            <div className="flex gap-1 mb-2">{Object.keys(PRESETS).map(p=>(<button key={p} onClick={()=>setParams({...PRESETS[p]})} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400 hover:bg-gray-700 capitalize">{p}</button>))}</div>
            <div className="text-xs text-blue-400 mb-1 font-semibold">Grid Shape</div>
            {angleWarning&&<div className="text-xs text-amber-400 mb-1 bg-amber-900/30 rounded px-1 py-0.5">⚠ θ+ϕ={params.theta+params.phi}° &gt; 90° — D-lines flip direction. Keep θ+ϕ &lt; 90° for proper diamonds.</div>}
            <PI label="ϕ Critical Angle" value={params.phi} min={10} max={80} step={1} onChange={v=>setParams(p=>({...p,phi:v}))}/>
            <PI label="θ Setting Angle" value={params.theta} min={1} max={89} step={1} onChange={v=>setParams(p=>({...p,theta:v}))}/>
            <PI label="u (side)" value={params.u} min={1} max={50} step={0.1} onChange={v=>setParams(p=>({...p,u:v}))}/>
            <PI label="d (side)" value={params.d} min={1} max={50} step={0.1} onChange={v=>setParams(p=>({...p,d:v}))}/>
            <PI label="n (bars)" value={params.n} min={10} max={500} step={1} onChange={v=>setParams(p=>({...p,n:v}))}/>
            <PI label="α (aspect)" value={params.alpha} min={0.1} max={5} step={0.1} onChange={v=>setParams(p=>({...p,alpha:v}))}/>
            <div className="text-xs text-gray-500 mb-1 mt-2 font-semibold">Strategy</div>
            <PI label="ε (tolerance)" value={params.epsilon} min={0} max={0.01} step={0.0001} onChange={v=>setParams(p=>({...p,epsilon:v}))}/>
            <PI label="ν (cancel)" value={params.nu} min={1} max={500} step={1} onChange={v=>setParams(p=>({...p,nu:v}))}/>
            <PI label="κ (expire)" value={params.kappa} min={1} max={500} step={1} onChange={v=>setParams(p=>({...p,kappa:v}))}/>
            <PI label="μ (breaks)" value={params.mu} min={1} max={10} step={1} onChange={v=>setParams(p=>({...p,mu:v}))}/>
            <div className="text-xs text-gray-500 mb-1 mt-2 font-semibold">EMS</div>
            <select value={emsMode} onChange={e=>setEmsMode(e.target.value)} className="w-full text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-200 mb-2"><option value="W">W — Worst</option><option value="A">A — Average</option><option value="N">N — Next open</option><option value="F">F — First worse</option></select>
          </div>
          {manualOP?.grid&&(<div className="p-2 border-b border-gray-800 bg-yellow-900/20"><div className="text-xs text-yellow-400 font-semibold mb-1">Grid Info</div><div className="text-xs text-gray-400 space-y-0.5"><div>P₀={manualOP.P0.toFixed(2)} ΔP={manualOP.grid.dP.toFixed(2)}</div><div><span className="text-blue-400">U₀:</span> {params.theta}° up | hᵤ={manualOP.grid.hU.toFixed(4)}</div><div><span className="text-orange-400">D₀:</span> {Math.abs(params.theta-params.phi).toFixed(0)}° {params.theta>=params.phi?"up":"dn"} | h_d={manualOP.grid.hD.toFixed(4)}</div><div>ϕ={params.phi}° between</div></div></div>)}
          <div className="p-2 border-b border-gray-800"><div className="text-xs text-gray-500 mb-1 font-semibold">Strategies</div>{Object.values(STRATEGY_DEFS).map(sd=>(<label key={sd.id} className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer"><input type="checkbox" checked={enabledStrats.includes(sd.id)} onChange={e=>setEnabledStrats(prev=>e.target.checked?[...prev,sd.id]:prev.filter(s=>s!==sd.id))} className="rounded border-gray-600"/><span className={enabledStrats.includes(sd.id)?"text-gray-200":"text-gray-500"}>{sd.id}: {sd.name}</span></label>))}</div>
          <div className="p-2"><button onClick={handleRunBacktest} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded">{mode==="backtest"?"▶ Run Backtest":"▶ Init Simulation"}</button></div>
          <div className="p-2 text-xs text-gray-600"><span className="inline-block w-3 h-1 bg-blue-500 mr-1 rounded"></span>U lines (upward) <span className="inline-block w-3 h-1 bg-orange-400 ml-2 mr-1 rounded"></span>D lines (downward)</div>
        </div>)}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!sidebarOpen&&<button onClick={()=>setSidebarOpen(true)} className="absolute left-1 top-12 z-10 bg-gray-800 rounded p-1 text-gray-400 hover:text-white"><Settings size={14}/></button>}
          <div className="flex-1 relative overflow-hidden" onWheel={handleWheel}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" onClick={handleChartClick}/>
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <button onClick={()=>setBarWidth(w=>Math.min(30,w+2))} className="bg-gray-800/80 rounded p-1 text-gray-400 hover:text-white"><ZoomIn size={14}/></button>
              <button onClick={()=>setBarWidth(w=>Math.max(2,w-2))} className="bg-gray-800/80 rounded p-1 text-gray-400 hover:text-white"><ZoomOut size={14}/></button>
              <button onClick={()=>{setChartScroll(0);setBarWidth(8);setFitGrid(false);}} className="bg-gray-800/80 rounded p-1 text-gray-400 hover:text-white"><RotateCcw size={14}/></button>
            </div>
            {clickMode==="manual"&&<div className="absolute top-2 left-2 bg-yellow-900/60 rounded px-2 py-1 text-xs text-yellow-300 z-10">Click any bar to set Origin Point</div>}
          </div>
          {simRunning&&(<div className="bg-gray-900 border-t border-gray-800 px-3 py-2 shrink-0"><div className="flex items-center gap-2 flex-wrap"><button onClick={simReset} className="px-2 py-1 bg-gray-700 rounded text-xs">|◁</button><button onClick={simStepBack} className="px-2 py-1 bg-gray-700 rounded text-xs">◁</button><button onClick={()=>setSimPlaying(p=>!p)} className={`px-3 py-1 rounded text-xs font-bold ${simPlaying?"bg-amber-600":"bg-green-600"}`}>{simPlaying?"❚❚":"▶"}</button><button onClick={simStepFwd} className="px-2 py-1 bg-gray-700 rounded text-xs">▷</button><select value={simSpeed} onChange={e=>setSimSpeed(+e.target.value)} className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs">{[1,2,5,10,25,50,100].map(s=><option key={s} value={s}>{s}x</option>)}</select><input type="range" min={params.n-1} max={bars.length-1} value={simBar} onChange={e=>simScrub(+e.target.value)} className="flex-1 min-w-24 h-1.5 accent-blue-500"/><span className="text-xs text-gray-400">Bar {simBar}/{bars.length-1} | {bars[simBar]?.date}</span></div><div className="flex gap-4 mt-1 text-xs"><span className="text-gray-400">P&L: <span className={cumPnL>=0?"text-green-400":"text-red-400"}>{cumPnL>=0?"+":""}{cumPnL.toFixed(2)}</span></span></div></div>)}
          <div className="shrink-0 bg-gray-900 border-t border-gray-800 overflow-hidden" style={{height:bottomHeight}}>
            <div className="flex items-center border-b border-gray-800">{["blotter","analytics"].map(tab=>(<button key={tab} onClick={()=>setBottomTab(tab)} className={`px-4 py-1.5 text-xs font-semibold uppercase ${bottomTab===tab?"text-blue-400 border-b-2 border-blue-400":"text-gray-500"}`}>{tab}</button>))}<div className="flex-1"/><button onClick={()=>setBottomHeight(h=>h===40?250:40)} className="px-2 text-gray-500 text-xs">{bottomHeight<=40?<ChevronUp size={12}/>:<ChevronDown size={12}/>}</button></div>
            {bottomHeight>40&&<div className="overflow-auto" style={{height:bottomHeight-32}}>{bottomTab==="blotter"&&<BlotterPanel trades={result?.trades||[]} sort={blotterSort} setSort={setBlotterSort}/>}{bottomTab==="analytics"&&<AnalyticsPanel analytics={analytics}/>}</div>}
          </div>
        </div>
        {showEventLog&&simRunning&&(<div className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0"><div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-800"><span className="text-xs font-semibold text-gray-400 uppercase">Event Log</span><button onClick={()=>setShowEventLog(false)} className="text-gray-600 hover:text-white"><X size={12}/></button></div><EventLogPanel events={result?.events||[]}/></div>)}
        {simRunning&&!showEventLog&&<button onClick={()=>setShowEventLog(true)} className="absolute right-1 top-12 z-10 bg-gray-800 rounded p-1 text-gray-400 hover:text-white"><List size={14}/></button>}
      </div>
      <div className="flex items-center px-3 py-1 bg-gray-900 border-t border-gray-800 shrink-0 text-xs text-gray-500">
        <span>{bars.length} bars</span><span className="mx-2">|</span><span>ϕ={params.phi}° θ={params.theta}° n={params.n} α={params.alpha}</span>
        {fitGrid&&<span className="text-purple-400 mx-2">Grid-locked</span>}
        {manualOP&&<span className="text-yellow-400 mx-2">OP @ bar {manualOP.barIndex}</span>}
      </div>
    </div>
  );
}

function BlotterPanel({trades,sort,setSort}){const c=trades.filter(t=>t.eb!=null);const sorted=useMemo(()=>{const a=[...c];a.sort((a,b)=>{let va=a[sort.col],vb=b[sort.col];return sort.asc?(va||0)-(vb||0):(vb||0)-(va||0);});return a;},[c,sort]);const hdr=(col,l)=>(<th className="px-2 py-1 text-left cursor-pointer hover:text-white whitespace-nowrap" onClick={()=>setSort(s=>({col,asc:s.col===col?!s.asc:false}))}>{l}{sort.col===col?(sort.asc?"↑":"↓"):""}</th>);return(<table className="w-full text-xs"><thead className="text-gray-500 bg-gray-800/50 sticky top-0"><tr>{hdr("stratId","Strat")}{hdr("opId","OP")}{hdr("eb","Entry")}{hdr("ep","Price")}{hdr("xb","Exit")}{hdr("xp","Price")}{hdr("xt","Type")}<th className="px-2 py-1">P&L</th><th className="px-2 py-1">Bars</th></tr></thead><tbody>{sorted.map((t,i)=>{const sd=STRATEGY_DEFS[t.stratId];const pnl=t.xt==="FAIL"?null:sd.dir==="BUY"?t.xp-t.ep:t.ep-t.xp;return(<tr key={i} className={`border-b border-gray-800/30 ${t.xt==="FAIL"?"text-orange-400":pnl>0?"text-green-300":"text-red-300"}`}><td className="px-2 py-1">{t.stratId}</td><td className="px-2 py-1">#{t.opId}</td><td className="px-2 py-1">{t.eb??"-"}</td><td className="px-2 py-1">{t.ep?.toFixed(2)??"-"}</td><td className="px-2 py-1">{t.xb??"-"}</td><td className="px-2 py-1">{t.xp?.toFixed(2)??"-"}</td><td className="px-2 py-1">{t.xt==="TP"?"✓TP":t.xt==="SL"?"✗SL":"⚠"}</td><td className="px-2 py-1">{pnl!=null?`${pnl>=0?"+":""}${pnl.toFixed(2)}`:"-"}</td><td className="px-2 py-1">{t.xb!=null&&t.eb!=null?t.xb-t.eb:"-"}</td></tr>);})}{sorted.length===0&&<tr><td colSpan={9} className="text-center py-4 text-gray-600">No trades</td></tr>}</tbody></table>);}
function AnalyticsPanel({analytics:a}){if(!a||a.totalTrades===0)return<div className="p-4 text-center text-gray-600 text-xs">No trades</div>;return(<div className="p-3"><div className="grid grid-cols-5 gap-2 mb-3"><MC l="Trades" v={a.totalTrades}/><MC l="Win%" v={`${a.winRate}%`} c={a.winRate>=50?"text-green-400":"text-red-400"}/><MC l="P&L" v={a.totalPnL.toFixed(2)} c={a.totalPnL>=0?"text-green-400":"text-red-400"}/><MC l="PF" v={a.profitFactor===Infinity?"∞":a.profitFactor} c={a.profitFactor>=1?"text-green-400":"text-red-400"}/><MC l="MaxDD" v={a.maxDD.toFixed(2)} c="text-red-400"/><MC l="Sharpe" v={a.sharpe}/><MC l="AvgP&L" v={a.avgPnL.toFixed(2)} c={a.avgPnL>=0?"text-green-400":"text-red-400"}/><MC l="W/L" v={`${a.wins}/${a.losses}`}/><MC l="AvgBars" v={a.avgBarsHeld}/><MC l="FAILs" v={a.fails} c={a.fails>0?"text-orange-400":""}/></div>{a.equityCurve.length>0&&<div className="h-40"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={a.equityCurve}><XAxis dataKey="idx" tick={{fontSize:9,fill:"#666"}}/><YAxis tick={{fontSize:9,fill:"#666"}}/><Tooltip contentStyle={{background:"#1f2937",border:"1px solid #374151",fontSize:11}}/><Area type="monotone" dataKey="drawdown" fill="rgba(239,68,68,0.15)" stroke="none"/><Line type="monotone" dataKey="equity" stroke="#3b82f6" strokeWidth={1.5} dot={false}/></ComposedChart></ResponsiveContainer></div>}</div>);}
function EventLogPanel({events}){const ref=useRef(null);const[as,setAs]=useState(true);const[f,setF]=useState("all");useEffect(()=>{if(as&&ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[events.length,as]);const fl=f==="all"?events:events.filter(e=>e.type===f);const d=fl.slice(-500);const cl={op:"text-yellow-400",trade:"text-green-400",fail:"text-orange-400",system:"text-gray-500"};return(<div className="flex flex-col flex-1 overflow-hidden"><div className="flex items-center gap-1 px-2 py-1 border-b border-gray-800">{["all","op","trade","fail","system"].map(x=>(<button key={x} onClick={()=>setF(x)} className={`px-1.5 py-0.5 rounded text-xs ${f===x?"bg-gray-700 text-white":"text-gray-500"}`}>{x}</button>))}<div className="flex-1"/><button onClick={()=>setAs(a=>!a)} className={`text-xs px-1.5 py-0.5 rounded ${as?"bg-blue-600/30 text-blue-400":"text-gray-500"}`}>{as?"⇣":"⇡"}</button></div><div ref={ref} className="flex-1 overflow-y-auto p-1" style={{fontSize:"10px"}}>{d.map((ev,i)=>(<div key={i} className={`py-0.5 leading-tight ${cl[ev.type]||"text-gray-500"}`}><span className="text-gray-600">Bar {ev.barIdx}|{ev.date}|</span>{ev.msg}</div>))}</div></div>);}
function MC({l,v,c}){return<div className="bg-gray-800 rounded p-1.5"><div className="text-xs text-gray-500 truncate">{l}</div><div className={`text-sm font-semibold ${c||"text-white"}`}>{v}</div></div>;}
function PI({label,value,min,max,step,onChange}){const[lc,setLc]=useState(String(value));useEffect(()=>{setLc(String(value));},[value]);const cm=()=>{const v=parseFloat(lc);if(!isNaN(v)&&v>=min&&v<=max)onChange(v);else setLc(String(value));};return(<div className="mb-1.5"><label className="block text-xs text-gray-500 mb-0.5">{label}</label><input type="number" value={lc} min={min} max={max} step={step} onChange={e=>setLc(e.target.value)} onBlur={cm} onKeyDown={e=>e.key==="Enter"&&cm()} className="w-full text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none"/></div>);}
