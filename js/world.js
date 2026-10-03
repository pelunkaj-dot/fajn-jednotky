export const DISTRICTS={
  length:{name:'Čtvrť délek',icon:'📏',max:60,stages:['První cesta','Most přes řeku','Nádraží','Měřicí věž','Dopravní síť','Světelný bulvár']},
  area:{name:'Čtvrť plochy',icon:'🌳',max:60,stages:['První záhon','Městský park','Hřiště','Zahradní čtvrť','Velké náměstí','Zelené centrum']},
  volume:{name:'Vodní čtvrť',icon:'💧',max:60,stages:['Studna','Vodojem','Potrubí','Bazén','Vodárna','Fontánové náměstí']},
  time:{name:'Časová čtvrť',icon:'🕰️',max:60,stages:['Pouliční hodiny','Zastávka','Nádražní hodiny','Časová věž','Světelná signalizace','Chronopolis']},
  mass:{name:'Přístav a sklady',icon:'⚖️',max:60,stages:['Malý sklad','Váha','Nakládací rampa','Jeřáb','Přístavní hala','Logistické centrum']}
};

export function districtState(key,correct=0){
  const meta=DISTRICTS[key];
  const capped=Math.min(correct,meta.max);
  const phase=Math.min(5,Math.floor(capped/(meta.max/6)));
  const within=capped%(meta.max/6);
  const pct=phase===5?100:Math.round(within/(meta.max/6)*100);
  return {...meta,key,correct,phase,pct,label:meta.stages[phase]};
}

export function worldState(progress){
  const states=Object.fromEntries(Object.keys(DISTRICTS).map(k=>[k,districtState(k,progress.byCategory?.[k]?.correct||0)]));
  const built=Object.values(states).reduce((sum,s)=>sum+s.phase,0);
  const total=Object.values(states).reduce((sum,s)=>sum+Math.min(s.correct,s.max),0);
  const max=Object.values(states).reduce((sum,s)=>sum+s.max,0);
  let title='Základna měření';
  let text='Pět čtvrtí čeká, až je postupně postavíš.';
  if(built>=5){title='Město se probouzí';text='V každé čtvrti už je něco vidět.'}
  if(built>=12){title='Město už funguje';text='Jednotky propojují dopravu, vodu, čas i sklady.'}
  if(built>=20){title='Velké město měření';text='Většina čtvrtí už žije vlastním životem.'}
  if(built>=25){title='Mistrovský svět jednotek';text='Celý svět je rozsvícený a propojený.'}
  return {states,total,pct:Math.round(total/max*100),built,title,text};
}
