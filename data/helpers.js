export const pick = arr => arr[Math.floor(Math.random()*arr.length)];
export const ri = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
export const round = (value,places=6) => {
  const f=10**places;
  return Math.round((value+Number.EPSILON)*f)/f;
};
export const cz = value => String(round(value,6)).replace('.',',');
export const spaced = value => new Intl.NumberFormat('cs-CZ',{maximumFractionDigits:6}).format(value);

export function choiceSet(answer, distractors){
  const vals=[answer,...distractors]
    .filter(v=>Number.isFinite(v))
    .filter((v,i,a)=>a.findIndex(x=>Math.abs(x-v)<1e-9)===i);
  while(vals.length<4){
    const k=pick([.1,10,100,1000]);
    const v=round(answer*k,6);
    if(!vals.some(x=>Math.abs(x-v)<1e-9)) vals.push(v);
  }
  return vals.slice(0,4).sort(()=>Math.random()-.5);
}

export function cleanPositive(value){
  return round(Math.max(0,value),6);
}
