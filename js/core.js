export const difficultyMeta={
  easy:{label:'Lehká',desc:'Základní vztahy a výběr ze 4 možností.',detail:'Procvičíš si základní převodní vztahy. Tady ještě můžeš vybírat ze čtyř možností.'},
  medium:{label:'Střední',desc:'Bez nabídky. Převody a smíšené zápisy.',detail:'Výsledek už píšeš sám. Objevují se desetinná čísla a smíšené zápisy.'},
  hard:{label:'Těžká',desc:'Převod je součástí více kroků.',detail:'Nestačí znát převod. Musíš zvolit správný postup a často propojit více kroků.'},
  challenge:{label:'Výzva',desc:'Pro dvojkaře, kteří chtějí jedničku.',detail:'Převod jednotek je jen jedna část řešení. Úloha prověří skutečné porozumění.'}
};

export function pickTask(category,difficulty,previousQuestion=''){
  const list=category.tasks[difficulty]||[];
  if(!list.length) throw new Error('Pro zvolenou obtížnost nejsou připravené úlohy.');
  const candidates=list.length>1?list.filter(item=>item.q!==previousQuestion):list;
  return structuredClone(candidates[Math.floor(Math.random()*candidates.length)]);
}
export function parseAnswer(raw){
  return Number(String(raw).trim().replace(',','.').replace(/\s+/g,''));
}
export function equal(a,b){return Number.isFinite(a)&&Math.abs(a-b)<1e-9}