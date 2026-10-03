import { pick, ri, round, choiceSet, spaced } from './helpers.js';

const simple = (from,to,factor,down=true) => () => {
  const base=down?pick([1.2,1.5,2.4,2.75,3.6,4.25,5.8,7.5]):pick([120,250,480,750,1250,2400,3750,8500]);
  const answer=down?round(base*factor,6):round(base/factor,6);
  return {q:`${String(base).replace('.',',')} ${from} = ? ${to}`,answer,choices:choiceSet(answer,[answer*10,answer/10,answer*100]),hint:`Mezi ${from} a ${to} je převodní poměr ${factor}:1.`};
};
const rectArea = () => {
  const a=pick([2.4,3.2,3.6,4.5,5.2]), bCm=pick([180,240,250,320,350]);
  const b=bCm/100;
  return {q:`Obdélník má rozměry ${String(a).replace('.',',')} m a ${bCm} cm. Jaký má obsah v m²?`,answer:round(a*b,4),hint:'Centimetry převeď na metry a potom vypočítej obsah obdélníku.'};
};
const squareToAres = () => {
  const side=pick([20,25,30,35,40,45,50]);
  return {q:`Čtvercový pozemek má stranu ${side} m. Kolik arů má jeho plocha?`,answer:round(side*side/100,4),hint:'Vypočítej obsah v m² a potom děl 100.'};
};
const remainingLand = () => {
  const totalHa=pick([.12,.18,.24,.35,.48]);
  const used=pick([350,650,850,1200,1750,2400]);
  const total=Math.round(totalHa*10000);
  if(used>=total) return remainingLand();
  return {q:`Pozemek má rozlohu ${String(totalHa).replace('.',',')} ha. Zastavěno je ${spaced(used)} m². Kolik metrů čtverečních zbývá?`,answer:total-used,hint:'Nejdřív převeď hektary na metry čtvereční.'};
};
const fractionField = () => {
  const ha=pick([1.2,1.5,1.8,2.4,3.2]), denom=pick([4,5,6,8]);
  const part=pick([1,2,3]);
  if(part>=denom) return fractionField();
  const m2=Math.round(ha*10000);
  const answer=round(m2*(denom-part)/denom,4);
  return {q:`Pole má ${String(ha).replace('.',',')} ha. ${part}/${denom} plochy zůstává neoseto. Kolik m² je oseto?`,answer,hint:'Převeď hektary na m² a vypočítej osetou část.'};
};
const sideFromArea = () => {
  const side=pick([40,50,60,75,80,90,100,120]);
  const areaHa=round(side*side/10000,4);
  return {q:`Čtvercový pozemek má rozlohu ${String(areaHa).replace('.',',')} ha. Kolik metrů měří jedna strana?`,answer:side,hint:'Převeď hektary na m² a odmocni obsah čtverce.'};
};
const rectangleMissingSide = () => {
  const length=pick([30,40,50,60,75,80]), width=pick([20,25,32,40,45,50]);
  const ha=round(length*width/10000,4);
  return {q:`Obdélníkový pozemek má rozlohu ${String(ha).replace('.',',')} ha a délku ${length} m. Kolik metrů měří jeho šířka?`,answer:width,hint:'Převeď obsah na m² a vyděl délkou.'};
};
const mapRoom = () => {
  const scale=pick([50,100,200]);
  const a=pick([2.1,2.4,2.8,3.2,3.6]), b=pick([1.5,1.8,2.2,2.5,3.1]);
  const am=a*scale/100, bm=b*scale/100;
  return {q:`Na plánku v měřítku 1 : ${scale} má obdélníková místnost rozměry ${String(a).replace('.',',')} cm a ${String(b).replace('.',',')} cm. Jakou má skutečnou plochu v m²?`,answer:round(am*bm,4),hint:'Nejdřív zjisti skutečné rozměry obou stran.'};
};

export const areaTasks={
  easy:[
    simple('m²','dm²',100,true),simple('dm²','cm²',100,true),simple('cm²','mm²',100,true),
    simple('ha','m²',10000,true),simple('km²','ha',100,true),simple('a','m²',100,true),
    simple('m²','cm²',10000,true),simple('m²','ha',10000,false)
  ],
  medium:[
    simple('m²','cm²',10000,true),simple('cm²','m²',10000,false),simple('ha','m²',10000,true),
    simple('m²','ha',10000,false),simple('km²','ha',100,true),simple('a','m²',100,true),
    simple('dm²','cm²',100,true),simple('mm²','m²',1000000,false)
  ],
  hard:[rectArea,squareToAres,remainingLand,fractionField,
    () => {
      const a=pick([80,100,120,150]), b=pick([60,75,80,90]);
      return {q:`Deska má rozměry ${a} cm a ${b} cm. Kolik dm² má její plocha?`,answer:round((a/10)*(b/10),4),hint:'Převeď obě délky na decimetry.'};
    },
    () => {
      const width=pick([1.8,2.4,3.2,4]), area=pick([14.4,18,24,28.8,36]);
      const length=round(area/width,4);
      return {q:`Obdélník má obsah ${String(area).replace('.',',')} m² a šířku ${String(width).replace('.',',')} m. Kolik metrů měří jeho délka?`,answer:length,hint:'Délka = obsah ÷ šířka.'};
    }
  ],
  challenge:[sideFromArea,rectangleMissingSide,mapRoom,
    () => {
      const totalHa=pick([1.2,1.5,1.8,2.4,3]), parcels=pick([12,16,20,24,30]);
      return {q:`Pozemek o rozloze ${String(totalHa).replace('.',',')} ha se rozdělí na ${parcels} stejně velkých parcel. Kolik m² má jedna parcela?`,answer:round(totalHa*10000/parcels,4),hint:'Hektary převeď na m² a vyděl počtem parcel.'};
    },
    () => {
      const side=pick([60,80,90,100,120]);
      const perimeter=side*4;
      return {q:`Čtverec má obvod ${perimeter} m. Kolik hektarů má jeho plocha?`,answer:round(side*side/10000,4),hint:'Z obvodu urči stranu, vypočítej obsah a převeď na hektary.'};
    },
    () => {
      const a=pick([.24,.32,.45,.6]), diff=pick([150,250,500,750]);
      const first=Math.round(a*10000), second=first-diff;
      return {q:`První pozemek má ${String(a).replace('.',',')} ha, druhý ${spaced(second)} m². O kolik m² je první větší?`,answer:diff,hint:'První pozemek převeď na m².'};
    }
  ]
};