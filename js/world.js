export function worldState(totalCorrect){
  const phases=[0,5,12,25,45,70];
  let phase=0;phases.forEach((v,i)=>{if(totalCorrect>=v)phase=i});
  const titles=['Zatím jen základna','První měřicí stanice','Město dostává rozměry','Vodárna a sklady fungují','Časová věž je online','Svět měření žije naplno'];
  const texts=['První správné úlohy odemknou stavbu.','Délka už dostává pevné body.','Plocha a objem začínají měnit mapu.','Jednotky už nejsou jen čísla – svět je používá.','Čas, vzdálenost i hmotnost se propojují.','Teď už nejde o převádění zpaměti, ale o skutečné porozumění.'];
  const next=phases[Math.min(phase+1,phases.length-1)];
  const cur=phases[phase];
  const pct=phase===5?100:Math.round(((totalCorrect-cur)/(next-cur))*100);
  return {phase,title:titles[phase],text:texts[phase],pct:Math.max(0,Math.min(100,pct))};
}