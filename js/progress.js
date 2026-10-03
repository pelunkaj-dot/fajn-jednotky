const KEY='fajn-jednotky-progress-v2';
const CATEGORIES=['length','area','volume','time','mass'];

export function defaults(){
  return {
    xp:0,
    streak:0,
    totalCorrect:0,
    totalAttempts:0,
    theme:'day',
    sound:true,
    byCategory:Object.fromEntries(CATEGORIES.map(k=>[k,{correct:0,attempts:0}]))
  };
}

export function loadProgress(){
  try{
    const saved=JSON.parse(localStorage.getItem(KEY)||'{}');
    const base=defaults();
    return {
      ...base,
      ...saved,
      byCategory:Object.fromEntries(
        CATEGORIES.map(k=>[k,{...base.byCategory[k],...(saved.byCategory?.[k]||{})}])
      )
    };
  }catch{
    return defaults();
  }
}

export function saveProgress(p){
  localStorage.setItem(KEY,JSON.stringify(p));
}
