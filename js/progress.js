const KEY='fajn-jednotky-progress-v2';
const CATEGORIES=['length','area','volume','time','mass'];
const DIFFICULTIES=['easy','medium','hard','challenge'];

function emptyCategory(){
  return {correct:0,attempts:0,hints:0,solutions:0,firstTry:0};
}
function emptyDifficulty(){
  return {correct:0,attempts:0};
}

export function defaults(){
  return {
    xp:0,
    streak:0,
    totalCorrect:0,
    totalAttempts:0,
    hintsUsed:0,
    solutionsShown:0,
    firstTryCorrect:0,
    theme:'day',
    sound:true,
    byCategory:Object.fromEntries(CATEGORIES.map(k=>[k,emptyCategory()])),
    byDifficulty:Object.fromEntries(DIFFICULTIES.map(k=>[k,emptyDifficulty()])),
    byTopic:{}
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
        CATEGORIES.map(k=>[k,{...emptyCategory(),...(saved.byCategory?.[k]||{})}])
      ),
      byDifficulty:Object.fromEntries(
        DIFFICULTIES.map(k=>[k,{...emptyDifficulty(),...(saved.byDifficulty?.[k]||{})}])
      ),
      byTopic:{...(saved.byTopic||{})}
    };
  }catch{
    return defaults();
  }
}

export function ensureTopicStats(progress,categoryKey,topicId){
  if(!progress.byTopic) progress.byTopic={};
  const key=`${categoryKey}:${topicId}`;
  if(!progress.byTopic[key]){
    progress.byTopic[key]={correct:0,attempts:0,hints:0,solutions:0,firstTry:0};
  }
  return progress.byTopic[key];
}

export function saveProgress(p){
  localStorage.setItem(KEY,JSON.stringify(p));
}
