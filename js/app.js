import { categories } from '../data/categories.js';
import { difficultyMeta,pickTask,parseAnswer,equal } from './core.js';
import { loadProgress,saveProgress,ensureTopicStats,ensureMissionRun,completeMissionRun } from './progress.js';
import { worldState, missionState } from './world.js';
import { playCorrect,playWrong,playHint,playStreak,playUnlock } from './audio.js';
import { solutionSteps } from './solutions.js';

let difficulty='easy';
let selected=null;
let selectedTopic='all';
let task=null;
let progress=loadProgress();

let attempts=0;
let hintUsed=false;
let solutionOffered=false;
let solutionShown=false;

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

const ui={
  switch:$('#difficultySwitch'),grid:$('#categoryGrid'),panel:$('#exercisePanel'),back:$('#backBtn'),topics:$('#topicFilters'),
  meta:$('#exerciseMeta'),title:$('#exerciseTitle'),badge:$('#difficultyBadge'),q:$('#questionText'),answer:$('#answerArea'),
  feedback:$('#feedback'),hint:$('#hintBtn'),next:$('#newBtn'),xp:$('#xp'),streak:$('#streak'),
  worldPanel:$('#worldPanel'),worldTitle:$('#worldTitle'),worldText:$('#worldText'),worldFill:$('#worldFill'),
  worldPct:$('#worldPct'),sound:$('#soundToggle'),
  missionBar:$('#missionBar'),missionTitle:$('#missionTitle'),missionProgressText:$('#missionProgressText'),
  missionProgressFill:$('#missionProgressFill'),missionComplete:$('#missionComplete'),
  missionCompleteTitle:$('#missionCompleteTitle'),missionCompleteText:$('#missionCompleteText'),
  missionResultGrid:$('#missionResultGrid'),missionResultNote:$('#missionResultNote'),missionReward:$('#missionReward'),
  missionWorldBtn:$('#missionWorldBtn'),missionAgainBtn:$('#missionAgainBtn'),
  parentBtn:$('#parentBtn'),parentPanel:$('#parentPanel'),parentCloseBtn:$('#parentCloseBtn'),parentChangePinBtn:$('#parentChangePinBtn'),
  parentAuth:$('#parentAuth'),parentAuthTitle:$('#parentAuthTitle'),parentAuthText:$('#parentAuthText'),parentPinInput:$('#parentPinInput'),
  parentPinConfirmInput:$('#parentPinConfirmInput'),parentAuthError:$('#parentAuthError'),parentAuthCancelBtn:$('#parentAuthCancelBtn'),parentAuthSubmitBtn:$('#parentAuthSubmitBtn'),
  parentSummary:$('#parentSummary'),parentCategories:$('#parentCategories'),
  parentDifficulties:$('#parentDifficulties'),parentTopics:$('#parentTopics'),parentMissions:$('#parentMissions'),parentWorld:$('#parentWorld')
};

function init(){
  applyTheme(progress.theme||'day');
  renderDifficulties();
  renderCategories();
  bind();
  refreshStats();
  renderWorld();
  refreshSoundButton();
}
function bind(){
  ui.back.onclick=()=>{ui.panel.classList.add('hidden');selected=null;selectedTopic='all';renderWorld()};
  ui.hint.onclick=()=>handleHelpAction();
  ui.next.onclick=()=>newTask();
  ui.sound.onclick=()=>{
    progress.sound=!progress.sound;
    saveProgress(progress);
    refreshSoundButton();
    if(progress.sound) playHint();
  };
  $$('[data-theme-btn]').forEach(btn=>btn.onclick=()=>setTheme(btn.dataset.themeBtn));
  $$('[data-world-category]').forEach(btn=>btn.onclick=()=>openCategory(btn.dataset.worldCategory));
  ui.missionWorldBtn.onclick=()=>closeMissionComplete(true);
  ui.missionAgainBtn.onclick=()=>closeMissionComplete(false);
  ui.parentBtn.onclick=beginParentAccess;
  ui.parentCloseBtn.onclick=closeParentPanel;
  ui.parentChangePinBtn.onclick=()=>openParentAuth('change');
  ui.parentPanel.addEventListener('click',e=>{if(e.target===ui.parentPanel) closeParentPanel()});
  ui.parentAuthCancelBtn.onclick=closeParentAuth;
  ui.parentAuthSubmitBtn.onclick=submitParentAuth;
  ui.parentAuth.addEventListener('click',e=>{if(e.target===ui.parentAuth) closeParentAuth()});
  ui.parentPinInput.addEventListener('input',cleanPinInput);
  ui.parentPinConfirmInput.addEventListener('input',cleanPinInput);
  ui.parentPinInput.addEventListener('keydown',e=>{if(e.key==='Enter')submitParentAuth()});
  ui.parentPinConfirmInput.addEventListener('keydown',e=>{if(e.key==='Enter')submitParentAuth()});
}
function setTheme(theme){
  progress.theme=theme;
  saveProgress(progress);
  applyTheme(theme);
}
function applyTheme(theme){
  document.body.dataset.theme=theme;
  $$('[data-theme-btn]').forEach(b=>b.classList.toggle('active',b.dataset.themeBtn===theme));
}
function refreshSoundButton(){
  ui.sound.textContent=progress.sound?'🔊':'🔇';
  ui.sound.title=progress.sound?'Zvuky jsou zapnuté':'Zvuky jsou vypnuté';
}
function sound(fn){
  if(progress.sound) fn();
}
function renderDifficulties(){
  ui.switch.innerHTML='';
  Object.entries(difficultyMeta).forEach(([key,m])=>{
    const b=document.createElement('button');
    b.textContent=m.label;b.title=m.detail;b.classList.toggle('active',key===difficulty);
    b.onclick=()=>{difficulty=key;renderDifficulties();if(selected){ensureTopicAllowed();renderTopicFilters();newTask()}};
    ui.switch.appendChild(b);
  });
}
function renderCategories(){
  ui.grid.innerHTML='';
  Object.entries(categories).forEach(([key,c])=>{
    const el=document.createElement('article');
    el.className='category card';
    el.innerHTML=`<div class="icon">${c.icon}</div><h3>${c.name}</h3><p>${c.desc}</p>`;
    el.onclick=()=>openCategory(key);
    ui.grid.appendChild(el);
  });
}
function openCategory(key){
  selected=key;
  selectedTopic='all';
  ui.panel.classList.remove('hidden');
  renderTopicFilters();
  newTask();
  renderWorld();
  renderMission();
  ui.panel.scrollIntoView({behavior:'smooth',block:'start'});
}
function allowedTopics(){
  if(!selected) return [];
  return (categories[selected].subtopics||[]).filter(t=>t.id==='all'||!t.levels||t.levels.includes(difficulty));
}
function ensureTopicAllowed(){
  if(!allowedTopics().some(t=>t.id===selectedTopic)) selectedTopic='all';
}
function renderTopicFilters(){
  if(!selected){ui.topics.innerHTML='';return}
  ensureTopicAllowed();
  ui.topics.innerHTML='';
  allowedTopics().forEach(item=>{
    const b=document.createElement('button');
    b.className='topic-chip';
    b.textContent=item.label;
    b.classList.toggle('active',item.id===selectedTopic);
    b.onclick=()=>{
      selectedTopic=item.id;
      renderTopicFilters();
      newTask();
    };
    ui.topics.appendChild(b);
  });
}
function topicLabel(){
  return categories[selected]?.subtopics?.find(t=>t.id===selectedTopic)?.label || 'Vše';
}
function resetAttemptState(){
  attempts=0;
  hintUsed=false;
  solutionOffered=false;
  solutionShown=false;
  ui.hint.hidden=true;
  ui.hint.textContent='Nápověda';
}
function newTask(){
  const previousQuestion=task?.q||'';
  try{
    task=pickTask(categories[selected],difficulty,previousQuestion,selectedTopic);
  }catch(err){
    selectedTopic='all';
    renderTopicFilters();
    task=pickTask(categories[selected],difficulty,previousQuestion,'all');
  }
  resetAttemptState();
  ui.feedback.className='feedback hidden';
  ui.feedback.textContent='';
  ui.meta.textContent=categories[selected].name+' · '+topicLabel();
  ui.title.textContent=difficultyMeta[difficulty].desc;
  ui.badge.textContent=difficultyMeta[difficulty].label;
  ui.q.textContent=task.q;
  ui.q.title=difficultyMeta[difficulty].detail;
  renderAnswer();
  renderMission();
}
function renderAnswer(){
  ui.answer.innerHTML='';
  if(difficulty==='easy'&&task.choices){
    const g=document.createElement('div');
    g.className='choice-grid';
    task.choices.forEach(v=>{
      const b=document.createElement('button');
      b.textContent=String(v).replace('.',',');
      b.onclick=()=>check(v);
      g.appendChild(b);
    });
    ui.answer.appendChild(g);
    return;
  }
  const row=document.createElement('div');
  row.className='answer-row';
  row.innerHTML='<input id="answerInput" inputmode="decimal" autocomplete="off" placeholder="Napiš výsledek"><button class="primary" id="answerSubmit">Potvrdit</button>';
  ui.answer.appendChild(row);
  const inp=$('#answerInput');
  $('#answerSubmit').onclick=()=>check(parseAnswer(inp.value));
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')check(parseAnswer(inp.value))});
  setTimeout(()=>inp.focus(),30);
}
function currentTopicStats(){
  return selected?ensureTopicStats(progress,selected,selectedTopic):null;
}
function currentMissionRun(){
  if(!selected) return null;
  const m=missionState(selected,progress.byCategory[selected].correct);
  return ensureMissionRun(progress,selected,m.target);
}
function registerAttempt(run){
  progress.totalAttempts++;
  if(selected) progress.byCategory[selected].attempts++;
  progress.byDifficulty[difficulty].attempts++;
  const topic=currentTopicStats();
  if(topic) topic.attempts++;

  if(run){
    run.attempts++;
    run.byDifficulty[difficulty]=(run.byDifficulty[difficulty]||0)+1;
    const topicKey=selectedTopic||'all';
    run.byTopic[topicKey]=(run.byTopic[topicKey]||0)+1;
  }
}
function registerCorrect(firstTry,run){
  progress.totalCorrect++;
  progress.streak++;
  if(selected) progress.byCategory[selected].correct++;
  progress.byDifficulty[difficulty].correct++;
  const topic=currentTopicStats();
  if(topic) topic.correct++;

  if(run){
    run.correct++;
    if(firstTry) run.firstTry++;
  }

  if(firstTry){
    progress.firstTryCorrect++;
    if(selected) progress.byCategory[selected].firstTry++;
    if(topic) topic.firstTry++;
  }
}
function check(value){
  if(solutionShown) return;
  const missionRun=currentMissionRun();
  registerAttempt(missionRun);

  if(equal(Number(value),Number(task.answer))){
    const before=worldState(progress);
    const beforeMission=selected?missionState(selected,progress.byCategory[selected].correct):null;
    const firstTry=attempts===0;
    registerCorrect(firstTry,missionRun);
    progress.xp+=difficulty==='easy'?10:difficulty==='medium'?18:difficulty==='hard'?28:40;
    const after=worldState(progress);
    const afterMission=selected?missionState(selected,progress.byCategory[selected].correct):null;

    const phaseBefore=selected?before.states[selected].phase:0;
    const phaseAfter=selected?after.states[selected].phase:0;
    const unlocked=phaseAfter>phaseBefore;

    showFeedback('good',firstTry?'Správně!':'Správně. Teď už to sedí.');
    ui.hint.hidden=true;
    saveProgress(progress);
    refreshStats();
    renderWorld();
    renderMission();

    const missionCompleted = beforeMission && afterMission && !beforeMission.complete && afterMission.start > beforeMission.start;

    if(unlocked){
      sound(playUnlock);
      animateWorld('flash-unlock');
    }else if(progress.streak>0 && progress.streak%5===0){
      sound(playStreak);
      animateWorld('flash-unlock');
    }else{
      sound(playCorrect);
      animateWorld('flash-good');
    }

    if(missionCompleted){
      const completedRun=completeMissionRun(progress,selected,{
        target:beforeMission.target,
        categoryName:categories[selected].name,
        unlockLabel:after.states[selected].label
      });
      progress.xp+=50;
      saveProgress(progress);
      refreshStats();
      setTimeout(()=>showMissionComplete(after.states[selected],completedRun),850);
    }else{
      setTimeout(newTask,unlocked?1300:900);
    }
    return;
  }

  attempts++;
  progress.streak=0;
  saveProgress(progress);
  refreshStats();
  sound(playWrong);

  if(attempts===1){
    ui.hint.hidden=true;
    showFeedback('bad','Není to správně. Zkus to ještě jednou.');
    return;
  }

  if(!hintUsed){
    ui.hint.hidden=false;
    ui.hint.textContent='Nápověda';
    showFeedback('bad','Ještě to není správně. Můžeš si vzít nápovědu.');
    return;
  }

  solutionOffered=true;
  ui.hint.hidden=false;
  ui.hint.textContent='Ukázat řešení';
  showFeedback('bad','Ani s nápovědou to zatím nevyšlo. Můžeš to zkusit znovu, nebo si zobrazit řešení.');
}
function handleHelpAction(){
  if(solutionShown) return;

  if(solutionOffered){
    revealSolution();
    return;
  }
  if(attempts<2 || hintUsed) return;

  hintUsed=true;
  progress.hintsUsed++;
  const run=currentMissionRun();
  if(run) run.hints++;
  if(selected) progress.byCategory[selected].hints++;
  const topic=currentTopicStats();
  if(topic) topic.hints++;
  saveProgress(progress);

  ui.hint.hidden=true;
  sound(playHint);
  showFeedback('bad',`Nápověda: ${task.hint||'Převeď veličiny do stejných jednotek a zkontroluj vztah mezi nimi.'}`);
  focusAnswer();
}
function revealSolution(){
  solutionShown=true;
  progress.solutionsShown++;
  const run=currentMissionRun();
  if(run) run.solutions++;
  if(selected) progress.byCategory[selected].solutions++;
  const topic=currentTopicStats();
  if(topic) topic.solutions++;
  saveProgress(progress);

  ui.hint.hidden=true;
  disableAnswer();

  const answerText=String(task.answer).replace('.',',');
  const steps=solutionSteps(task);
  showSolutionFeedback(answerText,steps);
}
function disableAnswer(){
  ui.answer.querySelectorAll('button,input').forEach(el=>el.disabled=true);
}
function focusAnswer(){
  const inp=$('#answerInput');
  if(inp) setTimeout(()=>inp.focus(),30);
}
function showFeedback(kind,text){
  ui.feedback.className=`feedback ${kind}`;
  ui.feedback.textContent=text;
}
function showSolutionFeedback(answerText,steps){
  ui.feedback.className='feedback solution';
  ui.feedback.innerHTML=`
    <div class="solution-title">Správná odpověď: <strong>${answerText}</strong></div>
    <ol class="solution-steps">${steps.map(step=>`<li>${safeText(step)}</li>`).join('')}</ol>
  `;
}
function refreshStats(){
  ui.xp.textContent=progress.xp;
  ui.streak.textContent=progress.streak;
}
function renderMission(){
  if(!selected){
    ui.missionBar.classList.add('hidden');
    return;
  }
  ui.missionBar.classList.remove('hidden');
  const m=missionState(selected,progress.byCategory[selected].correct);
  ui.missionTitle.textContent=m.complete?'Čtvrť je dokončená':m.title;
  ui.missionProgressText.textContent=m.complete?'Hotovo':`${m.done} / 10`;
  ui.missionProgressFill.style.width=`${m.pct}%`;
}
function dominantKey(map={}){
  return Object.entries(map).sort((a,b)=>b[1]-a[1])[0]?.[0] || '';
}
function showMissionComplete(state,run){
  ui.missionCompleteTitle.textContent=`${state.label} je hotovo!`;
  ui.missionCompleteText.textContent=`Čtvrť ${state.name} právě získala novou stavbu.`;

  const firstTryPct=run?.correct?Math.round((run.firstTry||0)/run.correct*100):0;
  const dominantDifficulty=dominantKey(run?.byDifficulty);
  const dominantTopic=dominantKey(run?.byTopic);
  const diffLabel=difficultyMeta[dominantDifficulty]?.label || '—';
  const topicName=categories[selected]?.subtopics?.find(t=>t.id===dominantTopic)?.label || 'Vše';

  ui.missionResultGrid.innerHTML=[
    ['Správné úlohy',run?.correct ?? 0],
    ['Na první pokus',`${run?.firstTry ?? 0} (${firstTryPct} %)`],
    ['Pokusů celkem',run?.attempts ?? 0],
    ['Nápověda',run?.hints ?? 0],
    ['Zobrazené řešení',run?.solutions ?? 0],
    ['Nejčastější úroveň',diffLabel]
  ].map(([label,value])=>`<div class="mission-result-stat"><strong>${value}</strong><span>${label}</span></div>`).join('');

  ui.missionResultNote.textContent=`Nejčastěji procvičováno: ${topicName}.`;
  ui.missionReward.textContent='+50 XP za dokončenou misi';
  ui.missionComplete.classList.remove('hidden');
}
function closeMissionComplete(showWorld){
  ui.missionComplete.classList.add('hidden');
  if(showWorld){
    ui.worldPanel.scrollIntoView({behavior:'smooth',block:'start'});
  }else if(selected){
    newTask();
  }
}
function renderWorld(){
  const w=worldState(progress);
  ui.worldTitle.textContent=w.title;
  ui.worldText.textContent=w.text;
  ui.worldFill.style.width=`${w.pct}%`;
  ui.worldPct.textContent=`${w.pct} %`;

  Object.entries(w.states).forEach(([key,state])=>{
    const el=document.querySelector(`[data-world-category="${key}"]`);
    if(!el) return;
    el.classList.remove('phase-0','phase-1','phase-2','phase-3','phase-4','phase-5','phase-6','active');
    el.classList.add(`phase-${state.phase}`);
    el.classList.toggle('active',selected===key);
    const status=el.querySelector('.district-status');
    status.textContent=state.phase===6
      ? `${state.label} • dokončeno`
      : `${state.label} • další: ${state.nextLabel} při ${state.nextAt}`;
  });
}
function animateWorld(cls){
  ui.worldPanel.classList.remove('flash-good','flash-unlock');
  void ui.worldPanel.offsetWidth;
  ui.worldPanel.classList.add(cls);
  setTimeout(()=>ui.worldPanel.classList.remove(cls),1000);
}
function pct(correct,attempts){
  return attempts?Math.round(correct/attempts*100):0;
}
function safeText(value){
  return String(value).replace(/[&<>"']/g,ch=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[ch]));
}
let parentAuthMode='login';

function cleanPinInput(e){
  e.target.value=e.target.value.replace(/\D/g,'').slice(0,4);
}
async function hashPin(pin){
  const bytes=new TextEncoder().encode(pin);
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
function beginParentAccess(){
  if(progress.parentPinHash){
    openParentAuth('login');
  }else{
    openParentAuth('setup');
  }
}
function openParentAuth(mode){
  parentAuthMode=mode;
  ui.parentPinInput.value='';
  ui.parentPinConfirmInput.value='';
  ui.parentAuthError.classList.add('hidden');
  ui.parentAuthError.textContent='';

  if(mode==='setup'){
    ui.parentAuthTitle.textContent='Nastav rodičovský PIN';
    ui.parentAuthText.textContent='Zvol 4 číslice. Tento PIN bude chránit rodičovský přehled.';
    ui.parentPinConfirmInput.classList.remove('hidden');
    ui.parentAuthSubmitBtn.textContent='Nastavit PIN';
  }else if(mode==='change'){
    ui.parentAuthTitle.textContent='Změnit rodičovský PIN';
    ui.parentAuthText.textContent='Zadej nový 4místný PIN a potvrď ho podruhé.';
    ui.parentPinConfirmInput.classList.remove('hidden');
    ui.parentAuthSubmitBtn.textContent='Uložit nový PIN';
  }else{
    ui.parentAuthTitle.textContent='Zadej rodičovský PIN';
    ui.parentAuthText.textContent='Rodičovský přehled je chráněný.';
    ui.parentPinConfirmInput.classList.add('hidden');
    ui.parentAuthSubmitBtn.textContent='Odemknout';
  }

  ui.parentPanel.classList.add('hidden');
  ui.parentAuth.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setTimeout(()=>ui.parentPinInput.focus(),50);
}
function closeParentAuth(){
  ui.parentAuth.classList.add('hidden');
  document.body.classList.remove('modal-open');
}
function showParentAuthError(message){
  ui.parentAuthError.textContent=message;
  ui.parentAuthError.classList.remove('hidden');
}
async function submitParentAuth(){
  const pin=ui.parentPinInput.value.trim();
  const confirm=ui.parentPinConfirmInput.value.trim();

  if(!/^\d{4}$/.test(pin)){
    showParentAuthError('PIN musí mít přesně 4 číslice.');
    return;
  }

  if(parentAuthMode==='login'){
    const hash=await hashPin(pin);
    if(hash!==progress.parentPinHash){
      showParentAuthError('PIN není správný.');
      ui.parentPinInput.select();
      return;
    }
    ui.parentAuth.classList.add('hidden');
    openParentPanel();
    return;
  }

  if(pin!==confirm){
    showParentAuthError('Oba zadané PINy musí být stejné.');
    return;
  }

  progress.parentPinHash=await hashPin(pin);
  saveProgress(progress);
  ui.parentAuth.classList.add('hidden');

  if(parentAuthMode==='change'){
    openParentPanel();
  }else{
    openParentPanel();
  }
}
function openParentPanel(){
  renderParentPanel();
  ui.parentPanel.classList.remove('hidden');
  document.body.classList.add('modal-open');
}
function closeParentPanel(){
  ui.parentPanel.classList.add('hidden');
  document.body.classList.remove('modal-open');
}
function renderParentPanel(){
  const accuracy=pct(progress.totalCorrect,progress.totalAttempts);
  const firstTry=pct(progress.firstTryCorrect,progress.totalCorrect);
  ui.parentSummary.innerHTML=[
    ['Vyřešeno správně',progress.totalCorrect],
    ['Úspěšnost pokusů',progress.totalAttempts?`${accuracy} %`:'—'],
    ['Na první pokus',progress.totalCorrect?`${firstTry} %`:'—'],
    ['Nápověda',progress.hintsUsed],
    ['Zobrazené řešení',progress.solutionsShown]
  ].map(([label,value])=>`<div class="parent-stat"><strong>${value}</strong><span>${label}</span></div>`).join('');

  ui.parentCategories.innerHTML=Object.entries(categories).map(([key,cat])=>{
    const s=progress.byCategory[key];
    const a=pct(s.correct,s.attempts);
    const confidence=s.attempts<5?'Málo dat':a>=75?'Daří se':a>=55?'Ještě procvičit':'Potřebuje pozornost';
    return `<div class="parent-row">
      <div class="parent-row-title"><span>${cat.icon}</span><strong>${safeText(cat.name)}</strong><small>${confidence}</small></div>
      <div class="parent-row-bar"><i style="width:${Math.min(100,a)}%"></i></div>
      <div class="parent-row-meta"><span>${s.correct} správně</span><span>${s.attempts} pokusů</span><span>${s.hints}× nápověda</span></div>
    </div>`;
  }).join('');

  ui.parentDifficulties.innerHTML=Object.entries(difficultyMeta).map(([key,meta])=>{
    const s=progress.byDifficulty[key];
    return `<div class="parent-mini-row"><span>${safeText(meta.label)}</span><strong>${s.correct}</strong><small>správně z ${s.attempts} pokusů</small></div>`;
  }).join('');

  const topicRows=Object.entries(progress.byTopic||{})
    .filter(([,s])=>s.attempts>=3)
    .map(([compound,s])=>{
      const [catKey,topicId]=compound.split(':');
      if(topicId==='all') return null;
      const cat=categories[catKey];
      const topic=cat?.subtopics?.find(t=>t.id===topicId);
      if(!cat||!topic) return null;
      return {catKey,cat,topic,s,accuracy:pct(s.correct,s.attempts)};
    })
    .filter(Boolean)
    .sort((a,b)=>a.accuracy-b.accuracy || b.s.attempts-a.s.attempts)
    .slice(0,5);

  ui.parentTopics.innerHTML=topicRows.length
    ? topicRows.map(row=>`<div class="parent-topic"><strong>${row.cat.icon} ${safeText(row.topic.label)}</strong><span>${row.accuracy} % úspěšnost</span><small>${safeText(row.cat.name)} · ${row.s.attempts} pokusů</small></div>`).join('')
    : '<p class="parent-empty">Zatím není dost údajů o jednotlivých podokruzích. Přehled se zpřesní po několika cílených cvičeních.</p>';

  const recentMissions=(progress.missionHistory||[]).slice(0,5);
  ui.parentMissions.innerHTML=recentMissions.length
    ? recentMissions.map(run=>{
        const firstTryPct=run.correct?Math.round((run.firstTry||0)/run.correct*100):0;
        const diffKey=dominantKey(run.byDifficulty);
        const diffLabel=difficultyMeta[diffKey]?.label || '—';
        const date=run.completedAt?new Date(run.completedAt).toLocaleDateString('cs-CZ'):'';
        return `<div class="parent-mission">
          <div><strong>${safeText(run.categoryName||categories[run.categoryKey]?.name||'Mise')}</strong><small>${safeText(run.unlockLabel||'Dokončená mise')} · ${date}</small></div>
          <span>${run.correct||0} správně</span>
          <span>${firstTryPct} % na první pokus</span>
          <span>${run.hints||0}× nápověda</span>
          <span>${safeText(diffLabel)}</span>
        </div>`;
      }).join('')
    : '<p class="parent-empty">Zatím není dokončená žádná nová mise. Po dokončení série se její výsledek uloží sem.</p>';

  const w=worldState(progress);
  ui.parentWorld.innerHTML=Object.entries(w.states).map(([key,state])=>`
    <div class="parent-world-row">
      <span>${state.icon} ${safeText(state.name)}</span>
      <div class="parent-world-bar"><i style="width:${Math.round(state.capped/state.max*100)}%"></i></div>
      <strong>${state.capped}/${state.max}</strong>
    </div>`
  ).join('');
}

init();