import { pick, round, choiceSet } from './helpers.js';

const simple = (from,to,factor,down=true) => () => {
  const base=down?pick([1.2,1.5,2.4,2.75,3.6,4.25,5.8,7.5]):pick([120,250,480,750,1250,2400,3750,8500]);
  const answer=down?round(base*factor,6):round(base/factor,6);
  return {q:`${String(base).replace('.',',')} ${from} = ? ${to}`,answer,choices:choiceSet(answer,[answer*10,answer/10,answer*100]),hint:`Mezi ${from} a ${to} je převodní poměr ${factor}:1.`};
};
const box = () => {
  const a=pick([20,30,40,50,60]), b=pick([20,25,30,35,40]), c=pick([20,25,30,40,50]);
  return {q:`Krabice má rozměry ${a} cm × ${b} cm × ${c} cm. Jaký má objem v dm³?`,answer:round(a*b*c/1000,4),hint:'Vypočítej cm³ a vyděl 1 000.'};
};
const aquarium = () => {
  const a=pick([50,60,80,100]), b=pick([25,30,35,40]), h=pick([30,40,50]);
  return {q:`Akvárium má vnitřní rozměry ${a} cm × ${b} cm × ${h} cm. Kolik litrů pojme po okraj?`,answer:round(a*b*h/1000,4),hint:'1 000 cm³ = 1 l.'};
};
const percentageTank = () => {
  const m3=pick([.24,.3,.36,.45,.5,.6]), pct=pick([40,50,60,68,75,80]);
  return {q:`Nádrž o objemu ${String(m3).replace('.',',')} m³ je naplněná z ${pct} %. Kolik litrů kapaliny obsahuje?`,answer:round(m3*1000*pct/100,4),hint:'Nejdřív převeď m³ na litry a pak vypočítej procenta.'};
};
const levelHeight = () => {
  const a=pick([30,40,50,60]), b=pick([20,25,30,40]), h=pick([10,15,20,25,30]);
  const liters=a*b*h/1000;
  return {q:`Obdélníková nádoba má dno ${a} cm × ${b} cm. Do jaké výšky v centimetrech sahá hladina, jestliže nádoba obsahuje ${String(liters).replace('.',',')} l vody?`,answer:h,hint:'Litry převeď na cm³ a objem vyděl obsahem dna.'};
};
const flow = () => {
  const rate=pick([8,10,12,15,18,20]), minutes=pick([12,18,24,30,40]);
  const liters=rate*minutes;
  return {q:`Do prázdné nádrže přitéká ${rate} l vody za minutu. Nádrž má objem ${String(liters/1000).replace('.',',')} m³. Za kolik minut se naplní?`,answer:minutes,hint:'Objem nádrže převeď na litry a vyděl průtokem.'};
};
const cubePercent = () => {
  const edge=pick([30,40,50,60]), pct=pick([50,60,75,80]);
  const full=edge**3/1000;
  return {q:`Krychlová nádoba má vnitřní hranu ${edge} cm a je naplněná do ${pct} % objemu. Kolik litrů kapaliny obsahuje?`,answer:round(full*pct/100,4),hint:'Nejdřív vypočítej objem celé krychle.'};
};
const removePercent = () => {
  const liters=pick([12,18,24,32,40,48]), pct=pick([20,25,35,40,50]);
  return {q:`V nádobě je ${liters} l kapaliny. Odlijeme ${pct} % původního množství. Kolik litrů zůstane?`,answer:round(liters*(100-pct)/100,4),hint:'Zůstane 100 % minus odlité procento.'};
};

export const volumeTasks={
  easy:[
    simple('l','ml',1000,true),simple('ml','l',1000,false),simple('l','dl',10,true),simple('dl','l',10,false),
    simple('dm³','cm³',1000,true),simple('cm³','dm³',1000,false),simple('m³','l',1000,true),
    () => ({q:'750 cm³ = ? ml',answer:750,choices:[75,750,7500,.75],hint:'1 cm³ = 1 ml.'})
  ],
  medium:[
    simple('m³','dm³',1000,true),simple('dm³','m³',1000,false),simple('l','ml',1000,true),simple('ml','l',1000,false),
    simple('dm³','cm³',1000,true),simple('cm³','dm³',1000,false),simple('hl','l',100,true),
    () => {const v=pick([.8,1.25,2.4,3.75,4.7]); return {q:`${String(v).replace('.',',')} dm³ = ? l`,answer:v,hint:'1 dm³ = 1 l.'}}
  ],
  hard:[box,aquarium,
    () => {const hl=pick([1.2,1.5,1.8,2.4]), out=pick([25,35,45,60]);return {q:`Sud obsahuje ${String(hl).replace('.',',')} hl vody. Odlijeme ${out} l. Kolik litrů zůstane?`,answer:hl*100-out,hint:'Hektolitry převeď na litry.'}},
    () => {const liters=pick([9,12,15,18,24]), denom=pick([2,3,4]);return {q:`Nádoba má objem ${liters} dm³ a je naplněná do ${denom-1}/${denom}. Kolik litrů kapaliny obsahuje?`,answer:round(liters*(denom-1)/denom,4),hint:'1 dm³ = 1 l.'}},
    () => {const a=pick([1.5,2,2.5,3]),b=pick([1.2,1.5,1.8,2]),h=pick([.3,.4,.5]);return {q:`Bazének má dno ${String(a).replace('.',',')} m × ${String(b).replace('.',',')} m a voda sahá do výšky ${Math.round(h*100)} cm. Kolik litrů vody obsahuje?`,answer:round(a*b*h*1000,4),hint:'Výšku převeď na metry, vypočítej m³ a potom litry.'}},
    () => {const bottle=pick([.5,.75,1,1.5,2]), count=pick([8,10,12,16,20]);return {q:`Kolik lahví o objemu ${String(bottle).replace('.',',')} l naplníš z ${String(bottle*count).replace('.',',')} l nápoje?`,answer:count,hint:'Celkový objem vyděl objemem jedné lahve.'}}
  ],
  challenge:[percentageTank,levelHeight,flow,cubePercent,removePercent,
    () => {const a=pick([60,80,100]),b=pick([30,35,40]),h=pick([40,50,60]),pct=pick([60,70,75,80]);return {q:`Akvárium má rozměry ${a} cm × ${b} cm × ${h} cm. Voda sahá do ${pct} % výšky. Kolik litrů vody obsahuje?`,answer:round(a*b*h*pct/100/1000,4),hint:'Vypočítej skutečnou výšku vody a potom objem.'}}
  ]
};