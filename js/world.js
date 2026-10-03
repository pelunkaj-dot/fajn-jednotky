export const DISTRICTS={
  length:{
    name:'Čtvrť délek',icon:'📏',max:60,
    stages:['Prázdné staveniště','Silnice','Most přes řeku','Nádraží','Měřicí věž','Světelný bulvár','Městská dráha']
  },
  area:{
    name:'Čtvrť plochy',icon:'🌳',max:60,
    stages:['Prázdné staveniště','Záhony','Městský park','Hřiště','Zahradní čtvrť','Velké náměstí','Skleník a arboretum']
  },
  volume:{
    name:'Vodní čtvrť',icon:'💧',max:60,
    stages:['Prázdné staveniště','Studna','Vodojem','Potrubní síť','Městský bazén','Vodárna','Fontánové náměstí']
  },
  time:{
    name:'Časová čtvrť',icon:'🕰️',max:60,
    stages:['Prázdné staveniště','Pouliční hodiny','Zastávka','Nádražní hodiny','Časová věž','Světelná signalizace','Chronopolis']
  },
  mass:{
    name:'Přístav a sklady',icon:'⚖️',max:60,
    stages:['Prázdné staveniště','Malý sklad','Velká váha','Nakládací rampa','Přístavní jeřáb','Hlavní hala','Logistické centrum']
  }
};

export function districtState(key,correct=0){
  const meta=DISTRICTS[key];
  const capped=Math.min(Math.max(0,correct),meta.max);
  const phase=Math.min(6,Math.floor(capped/10));
  const nextAt=phase>=6?meta.max:(phase+1)*10;
  const within=phase>=6?10:capped-phase*10;
  const pct=phase>=6?100:within*10;
  return {
    ...meta,key,correct,capped,phase,pct,
    label:meta.stages[phase],
    nextLabel:phase>=6?'Čtvrť je dokončená':meta.stages[phase+1],
    nextAt
  };
}

export function worldState(progress){
  const states=Object.fromEntries(
    Object.keys(DISTRICTS).map(k=>[k,districtState(k,progress.byCategory?.[k]?.correct||0)])
  );
  const built=Object.values(states).reduce((sum,s)=>sum+s.phase,0);
  const total=Object.values(states).reduce((sum,s)=>sum+s.capped,0);
  const max=Object.values(states).reduce((sum,s)=>sum+s.max,0);

  let title='Základna měření';
  let text='Pět čtvrtí je zatím téměř prázdných. Každých 10 správných odpovědí postaví něco nového.';
  if(built>=5){title='Město se probouzí';text='Ve všech čtvrtích už se něco děje. Pokračuj a propoj je.'}
  if(built>=12){title='Město už funguje';text='Doprava, voda, čas i sklady začínají tvořit jeden živý celek.'}
  if(built>=20){title='Velké město měření';text='Ulice svítí, voda proudí a většina čtvrtí už žije vlastním životem.'}
  if(built>=27){title='Mistrovský svět jednotek';text='Celé město je téměř hotové. Zbývají poslední velké stavby.'}
  if(built>=30){title='Svět jednotek je dokončen';text='Všech pět čtvrtí je plně vybudovaných a propojených.'}

  return {states,total,pct:Math.round(total/max*100),built,title,text};
}
