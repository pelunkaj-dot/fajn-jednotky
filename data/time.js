import { pick, round, choiceSet } from './helpers.js';

const minutesSeconds = () => {
  const min=pick([2,3,4,5,6,8,10,12]);
  return {q:`${min} min = ? s`,answer:min*60,choices:choiceSet(min*60,[min*10,min*100,min*30]),hint:'1 min = 60 s.'};
};
const hoursMinutes = () => {
  const h=pick([1.5,1.75,2,2.25,2.5,3,3.5,4]);
  return {q:`${String(h).replace('.',',')} h = ? min`,answer:h*60,choices:choiceSet(h*60,[h*100,h*10,h*6]),hint:'1 h = 60 min.'};
};
const mixedToMinutes = () => {
  const h=pick([1,2,3,4,5]),m=pick([10,15,20,25,30,35,40,45,50,55]);
  return {q:`${h} h ${m} min = ? min`,answer:h*60+m,hint:'Hodiny převeď na minuty a přičti zbývající minuty.'};
};
const intervalSameDay = () => {
  const startH=pick([7,8,9,10,13,14,15,17,18]), startM=pick([5,12,18,25,33,40,47]);
  const duration=pick([65,78,95,112,146,158,175]);
  const start=startH*60+startM,end=start+duration;
  if(end>=24*60) return intervalSameDay();
  const eh=Math.floor(end/60), em=end%60;
  return {q:`Událost začala v ${startH}:${String(startM).padStart(2,'0')} a skončila v ${eh}:${String(em).padStart(2,'0')}. Kolik minut trvala?`,answer:duration,hint:'Časový rozdíl počítej po minutách nebo přes celé hodiny.'};
};
const arrival = () => {
  const sh=pick([7,9,11,13,14,16,18]),sm=pick([5,15,25,35,45]),dur=pick([75,95,125,155,175]);
  const end=sh*60+sm+dur,eh=Math.floor(end/60)%24,em=end%60;
  return {q:`Cesta začala v ${sh}:${String(sm).padStart(2,'0')} a trvala ${Math.floor(dur/60)} h ${dur%60} min. V kolik hodin skončila? Zapiš čas jako číslo ve tvaru HHMM, například 1635.`,answer:eh*100+em,hint:'Přičti dobu cesty k času odjezdu.'};
};
const overnight = () => {
  const sh=pick([21,22,23]),sm=pick([10,25,36,48,55]);
  const start=sh*60+sm;
  const minDuration=24*60-start+15;
  const dur=pick([minDuration,minDuration+25,minDuration+50,minDuration+85,minDuration+120]);
  const end=(start+dur)%(24*60),eh=Math.floor(end/60),em=end%60;
  return {q:`Cesta začala ve ${sh}:${String(sm).padStart(2,'0')} a skončila po půlnoci po ${dur} minutách. V kolik hodin skončila? Zapiš čas jako číslo ve tvaru HHMM.`,answer:eh*100+em,hint:'Přičti délku cesty a správně přejdi přes půlnoc.'};
};
const decimalHours = () => {
  const minutes=pick([6,12,15,18,24,30,36,42,45,48,54]);
  const h=pick([1,2,3,4]);
  return {q:`Čas ${h} h ${minutes} min vyjádři v hodinách desetinným číslem.`,answer:round(h+minutes/60,4),hint:'Minuty vyděl 60 a přičti celé hodiny.'};
};
const percentTime = () => {
  const total=pick([80,90,96,120,144,160]),pct=pick([10,12.5,20,25,30]);
  const reduction=round(total*pct/100,4);
  return {q:`Původní čas byl ${total} minut. Nový čas je o ${String(pct).replace('.',',')} % kratší. O kolik minut se čas zkrátil?`,answer:reduction,hint:'Vypočítej uvedené procento z původního času.'};
};

export const timeTasks={
  easy:[minutesSeconds,hoursMinutes,
    () => {const s=pick([120,180,240,300,360,480,600]);return {q:`${s} s = ? min`,answer:s/60,choices:choiceSet(s/60,[s/10,s/100,s/30]),hint:'60 s = 1 min.'}},
    () => {const d=pick([2,3,4,5,7,10]);return {q:`${d} dny = ? h`,answer:d*24,choices:choiceSet(d*24,[d*12,d*10,d*100]),hint:'1 den = 24 h.'}},
    () => {const w=pick([2,3,4,5,6]);return {q:`${w} týdny = ? dní`,answer:w*7,choices:choiceSet(w*7,[w*5,w*10,w*12]),hint:'1 týden = 7 dní.'}}
  ],
  medium:[mixedToMinutes,hoursMinutes,
    () => {const min=pick([75,90,105,135,150,165,195,210]);return {q:`${min} min = ? h`,answer:round(min/60,4),hint:'Minuty vyděl 60.'}},
    () => {const s=pick([3600,4500,5400,7200,9000]);return {q:`${s} s = ? min`,answer:s/60,hint:'Sekundy vyděl 60.'}},
    () => {const d=pick([1,2,3]),h=pick([3,6,9,12,18]);const dayWord=d===1?'den':'dny';return {q:`${d} ${dayWord} ${h} h = ? h`,answer:d*24+h,hint:'Každý den má 24 hodin.'}},
    () => {const w=pick([1,2,3,4]),d=pick([1,2,3,4,5,6]);return {q:`${w} týdny ${d} dny = ? dní`,answer:w*7+d,hint:'Každý týden má 7 dní.'}}
  ],
  hard:[intervalSameDay,arrival,decimalHours,
    () => {const a=pick([18,22,26,35]),as=pick([15,25,35,45]),b=pick([20,24,28,32]),bs=pick([10,20,30,40]);return {q:`První úsek trval ${a} min ${as} s a druhý ${b} min ${bs} s. Kolik sekund trvaly oba úseky dohromady?`,answer:(a+b)*60+as+bs,hint:'Oba časy převeď na sekundy a sečti.'}},
    () => {const shift=pick([6.5,7,7.5,8]),breakM=pick([20,30,40,45]);return {q:`Směna trvá ${String(shift).replace('.',',')} h. Přestávka trvá ${breakM} min. Kolik minut zbývá na práci?`,answer:shift*60-breakM,hint:'Hodiny převeď na minuty a odečti přestávku.'}}
  ],
  challenge:[overnight,percentTime,
    () => {const work1=pick([95,110,138]),pause=pick([25,37,45]),work2=pick([82,106,125]);return {q:`První pracovní úsek trval ${work1} min, odstávka ${pause} min a druhý pracovní úsek ${work2} min. Kolik minut od začátku do konce celkem uplynulo?`,answer:work1+pause+work2,hint:'Do celkového času patří i odstávka.'}},
    () => {const total=pick([360,420,450,480,540]),denom=pick([3,4,5]);const left=round(total/denom,4);return {q:`${denom-1}/${denom} pracovního času dlouhého ${total} minut už uplynulo. Kolik minut zbývá?`,answer:left,hint:'Zbývá jedna část z uvedeného počtu stejných částí.'}},
    () => {const h=pick([1.25,1.5,1.75,2.25,2.5,2.75,3.5]);return {q:`Časový interval trvá ${String(h).replace('.',',')} h. Kolik je to sekund?`,answer:h*3600,hint:'Hodiny násob 3 600.'}}
  ]
};