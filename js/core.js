export const difficultyMeta={
  easy:{label:'Lehká',desc:'Základní vztahy a výběr ze 4 možností.'},
  medium:{label:'Střední',desc:'Bez nabídky. Převody a smíšené zápisy.'},
  hard:{label:'Těžká',desc:'Převod je součástí více kroků.'},
  challenge:{label:'Výzva',desc:'Pro dvojkaře, kteří chtějí jedničku.'}
};

export function pickTask(category,difficulty){
  const list=category.tasks[difficulty]||[];
  return structuredClone(list[Math.floor(Math.random()*list.length)]);
}
export function parseAnswer(raw){
  return Number(String(raw).trim().replace(',','.').replace(/\s+/g,''));
}
export function equal(a,b){return Number.isFinite(a)&&Math.abs(a-b)<1e-9}