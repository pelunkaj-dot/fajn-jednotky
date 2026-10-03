export const difficultyMeta={
  easy:{label:'Lehká',desc:'Základní vztahy a výběr ze 4 možností.',detail:'Procvičíš si základní převodní vztahy. Tady ještě můžeš vybírat ze čtyř možností.'},
  medium:{label:'Střední',desc:'Bez nabídky. Převody a smíšené zápisy.',detail:'Výsledek už píšeš sám. Objevují se desetinná čísla a smíšené zápisy.'},
  hard:{label:'Těžká',desc:'Převod je součástí více kroků.',detail:'Nestačí znát převod. Musíš zvolit správný postup a často propojit více kroků.'},
  challenge:{label:'Výzva',desc:'Pro dvojkaře, kteří chtějí jedničku.',detail:'Převod jednotek je jen jedna část řešení. Úloha prověří skutečné porozumění.'}
};

function materialize(item){
  return typeof item==='function' ? item() : structuredClone(item);
}

export function pickTask(category,difficulty,previousQuestion='',topicId='all'){
  const list=category.tasks[difficulty]||[];
  if(!list.length) throw new Error('Pro zvolenou obtížnost nejsou připravené úlohy.');

  const topic=topicId==='all' ? null : category.subtopics?.find(t=>t.id===topicId);
  let fallback=null;

  for(let attempt=0;attempt<120;attempt++){
    const candidate=materialize(list[Math.floor(Math.random()*list.length)]);
    if(!candidate?.q) continue;
    if(!fallback) fallback=candidate;
    if(candidate.q===previousQuestion) continue;
    if(topic?.match && !topic.match(candidate)) continue;
    return candidate;
  }

  if(topic?.match) throw new Error('Pro tento podokruh zatím není v této obtížnosti vhodná úloha.');
  return fallback || materialize(list[0]);
}

export function parseAnswer(raw){
  return Number(String(raw).trim().replace(',','.').replace(/\s+/g,''));
}
export function equal(a,b){return Number.isFinite(a)&&Math.abs(a-b)<1e-9}