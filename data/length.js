import { pick, ri, round, choiceSet, spaced } from './helpers.js';

const conv = (from,to,factor,down=true) => () => {
  const base = down ? pick([1.2,1.5,2.4,2.75,3.6,4.25,5.8,7.05,8.4]) : pick([12,25,48,75,125,240,375,680,925]);
  const answer = down ? round(base*factor,6) : round(base/factor,6);
  return {
    q:`${String(base).replace('.',',')} ${from} = ? ${to}`,
    answer,
    choices:choiceSet(answer,[answer*10,answer/10,answer*100]),
    hint:`Převod mezi ${from} a ${to} má poměr ${factor}:1.`
  };
};

const mixedMcm = () => {
  const m=ri(1,9), cm=pick([5,12,25,38,46,65,72,84,95]);
  return {q:`${m} m ${cm} cm = ? cm`,answer:m*100+cm,hint:'Každý metr má 100 centimetrů.'};
};
const mixedKmM = () => {
  const km=ri(1,8), m=pick([50,125,240,375,480,650,725,900]);
  return {q:`${km} km ${m} m = ? m`,answer:km*1000+m,hint:'Každý kilometr má 1 000 metrů.'};
};
const compareDifference = () => {
  const a=pick([1.25,1.48,1.72,1.85,2.05,2.4,2.75]);
  const b=pick([85,110,135,160,190,225]);
  const acm=Math.round(a*100);
  const hi=Math.max(acm,b), lo=Math.min(acm,b);
  return {q:`Jedna délka je ${String(a).replace('.',',')} m, druhá ${b} cm. O kolik centimetrů se liší?`,answer:hi-lo,hint:'Převeď obě délky na centimetry.'};
};
const remainingRoute = () => {
  const total=pick([2.4,3.2,4.75,5.6,6.25]);
  const walked=pick([650,875,1200,1450,1850]);
  const totalM=Math.round(total*1000);
  if(walked>=totalM) return remainingRoute();
  return {q:`Trasa měří ${String(total).replace('.',',')} km. Ušel jsi ${spaced(walked)} m. Kolik metrů ještě zbývá?`,answer:totalM-walked,hint:'Nejdřív převeď celou trasu na metry.'};
};
const equalParts = () => {
  const parts=pick([3,4,5,6,8]);
  const one=pick([120,150,180,225,240,275,320]);
  const totalM=round(parts*one/100,2);
  return {q:`Provaz dlouhý ${String(totalM).replace('.',',')} m rozdělíme na ${parts} stejně dlouhých částí. Kolik centimetrů měří jedna část?`,answer:one,hint:'Převeď celkovou délku na centimetry a vyděl počtem částí.'};
};
const perimeterSide = () => {
  const a=pick([120,150,175,185,220,240]);
  const b=pick([90,125,160,185,210]);
  const perimeter=2*(a+b);
  return {q:`Obdélník má obvod ${String(perimeter/100).replace('.',',')} m. Jedna strana měří ${a} cm. Kolik centimetrů měří druhá strana?`,answer:b,hint:'Převeď obvod na centimetry a použij vztah 2(a + b).'};
};
const mapScale = () => {
  const scale=pick([10000,25000,50000]);
  const cm=pick([2.4,3.2,4.8,5.6,7.2,7.6,8.4]);
  const km=round(cm*scale/100000,4);
  return {q:`Mapa má měřítko 1 : ${spaced(scale)}. Vzdálenost na mapě je ${String(cm).replace('.',',')} cm. Kolik kilometrů je to ve skutečnosti?`,answer:km,hint:'Vzdálenost na mapě vynásob měřítkem a centimetry převeď na kilometry.'};
};
const planScale = () => {
  const scale=pick([20,25,50,100]);
  const cm=pick([3.2,4.6,5.4,6.8,7.5,9.4]);
  return {q:`Na plánu v měřítku 1 : ${scale} měří stěna ${String(cm).replace('.',',')} cm. Kolik metrů měří ve skutečnosti?`,answer:round(cm*scale/100,4),hint:'Vynásob délku na plánu měřítkem a centimetry převeď na metry.'};
};
const fractionRoute = () => {
  const total=pick([12.6,18.9,24.6,27.3,32.4]);
  const div=pick([2,3,4,6]);
  const meters=round(total/div*1000,4);
  return {q:`První 1/${div} trasy dlouhé ${String(total).replace('.',',')} km vede lesem. Kolik metrů vede lesem?`,answer:meters,hint:`Vypočítej 1/${div} z celé délky a výsledek převeď na metry.`};
};

export const lengthTasks={
  easy:[
    conv('m','cm',100,true),conv('cm','m',100,false),
    conv('cm','mm',10,true),conv('mm','cm',10,false),
    conv('km','m',1000,true),conv('m','km',1000,false),
    conv('m','mm',1000,true),conv('dm','cm',10,true)
  ],
  medium:[
    mixedMcm,mixedKmM,
    conv('km','m',1000,true),conv('m','km',1000,false),
    conv('m','mm',1000,true),conv('mm','m',1000,false),
    conv('m','cm',100,true),conv('cm','m',100,false)
  ],
  hard:[
    compareDifference,remainingRoute,equalParts,
    () => {
      const room=pick([3.8,4.2,4.8,5.1]), shorter=pick([20,25,35,45,60]);
      return {q:`Místnost je dlouhá ${String(room).replace('.',',')} m. Koberec je o ${shorter} cm kratší. Kolik centimetrů měří koberec?`,answer:Math.round(room*100-shorter),hint:'Převeď délku místnosti na centimetry a odečti rozdíl.'};
    },
    () => {
      const pieces=pick([4,5,6,8]), each=pick([125,160,175,225,250]);
      return {q:`${pieces} stejných tyčí má dohromady délku ${String(pieces*each/100).replace('.',',')} m. Kolik centimetrů měří jedna tyč?`,answer:each,hint:'Převeď celkovou délku na centimetry a vyděl počtem tyčí.'};
    },
    () => {
      const a=pick([1.25,1.5,1.75,2.2]), b=pick([65,80,95,120]);
      return {q:`První úsek měří ${String(a).replace('.',',')} km a druhý ${b} m. Kolik metrů měří oba úseky dohromady?`,answer:Math.round(a*1000+b),hint:'Kilometry nejprve převeď na metry.'};
    }
  ],
  challenge:[
    mapScale,planScale,perimeterSide,fractionRoute,
    () => {
      const total=pick([18,24,30,36]), minutes=pick([9,12,15,18]);
      return {q:`Cyklista ujede za ${minutes} minut ${total} km. Kolik metrů ujede za 1 minutu při stejné rychlosti?`,answer:total*1000/minutes,hint:'Kilometry převeď na metry a vyděl počtem minut.'};
    },
    () => {
      const a=pick([2.75,3.2,3.75,4.05,4.6]), diff=pick([35,50,70,125,180]);
      const b=Math.round(a*1000-diff);
      return {q:`První trasa měří ${String(a).replace('.',',')} km, druhá ${spaced(b)} m. O kolik metrů je první trasa delší?`,answer:diff,hint:'První trasu převeď na metry.'};
    }
  ]
};