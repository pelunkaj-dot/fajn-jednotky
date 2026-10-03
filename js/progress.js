const KEY='fajn-jednotky-progress-v2';
const CATEGORIES=['length','area','volume','time','mass'];
const DIFFICULTIES=['easy','medium','hard','challenge'];

function emptyCategory(){
  return {correct:0,attempts:0,hints:0,solutions:0,firstTry:0};
}
function emptyDifficulty(){
  return {correct:0,attempts:0};
}
function emptyMissionRun(target=10){
  return {
    target,
    correct:0,
    attempts:0,
    firstTry:0,
    hints:0,
    solutions:0,
    byDifficulty:{},
    byTopic:{}
  };
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
    byTopic:{},
    missionRuns:{},
    missionHistory:[]
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
      byTopic:{...(saved.byTopic||{})},
      missionRuns:{...(saved.missionRuns||{})},
      missionHistory:Array.isArray(saved.missionHistory)?saved.missionHistory:[]
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

export function ensureMissionRun(progress,categoryKey,target){
  if(!progress.missionRuns) progress.missionRuns={};
  const current=progress.missionRuns[categoryKey];
  if(!current || current.target!==target){
    progress.missionRuns[categoryKey]=emptyMissionRun(target);
  }
  return progress.missionRuns[categoryKey];
}

export function completeMissionRun(progress,categoryKey,meta={}){
  if(!progress.missionRuns) progress.missionRuns={};
  if(!progress.missionHistory) progress.missionHistory=[];
  const run=progress.missionRuns[categoryKey]||emptyMissionRun(meta.target||10);
  const snapshot={
    ...structuredClone(run),
    categoryKey,
    completedAt:new Date().toISOString(),
    ...meta
  };
  progress.missionHistory.unshift(snapshot);
  progress.missionHistory=progress.missionHistory.slice(0,30);
  delete progress.missionRuns[categoryKey];
  return snapshot;
}

export function saveProgress(p){
  localStorage.setItem(KEY,JSON.stringify(p));
}
