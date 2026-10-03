export const difficultyMeta={
  easy:{label:'Lehká',desc:'Základní vztahy a výběr ze 4 možností.',detail:'Procvičíš si základní převodní vztahy. Tady ještě můžeš vybírat ze čtyř možností.'},
  medium:{label:'Střední',desc:'Bez nabídky. Převody a smíšené zápisy.',detail:'Výsledek už píšeš sám. Objevují se desetinná čísla a smíšené zápisy.'},
  hard:{label:'Těžká',desc:'Převod je součástí více kroků.',detail:'Nestačí znát převod. Musíš zvolit správný postup a často propojit více kroků.'},
  challenge:{label:'Výzva',desc:'Pro dvojkaře, kteří chtějí jedničku.',detail:'Převod jednotek je jen jedna část řešení. Úloha prověří skutečné porozumění.'}
};

function materialize(item){
  return typeof item==='function' ? item() : structuredClone(item);
}

export function pickTask(category,difficulty,previousQuestion=''){
  const list=category.tasks[difficulty]||[];
  if(!list.length) throw new Error('Pro zvolenou obtížnost nejsou připravené úlohy.');

  let candidate=null;
  for(let attempt=0;attempt<24;attempt++){
    candidate=materialize(list[Math.floor(Math.random()*list.length)]);
    if(candidate && candidate.q && candidate.q!==previousQuestion) return candidate;
  }
  return candidate || materialize(list[0]);
}

export function parseAnswer(raw){
  return Number(String(raw).trim().replace(',','.').replace(/\s+/g,''));
}
export function equal(a,b){return Number.isFinite(a)&&Math.abs(a-b)<1e-9}