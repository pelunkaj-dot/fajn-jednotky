import { categories } from '../data/categories.js';
import { difficultyMeta,pickTask,parseAnswer,equal } from './core.js';
import { loadProgress,saveProgress } from './progress.js';
import { worldState } from './world.js';
import { playCorrect,playWrong,playHint,playStreak,playUnlock } from './audio.js';

let difficulty='easy';
let selected=null;
let task=null;
let progress=loadProgress();

let attempts=0;
let hintUsed=false;
let solutionOffered=false;
let solutionShown=false;

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

const ui={
  switch:$('#difficultySwitch'),grid:$('#categoryGrid'),panel:$('#exercisePanel'),back:$('#backBtn'),
  meta:$('#exerciseMeta'),title:$('#exerciseTitle'),badge:$('#difficultyBadge'),q:$('#questionText'),answer:$('#answerArea'),
  feedback:$('#feedback'),hint:$('#hintBtn'),next:$('#newBtn'),xp:$('#xp'),streak:$('#streak'),
  worldPanel:$('#worldPanel'),worldTitle:$('#worldTitle'),worldText:$('#worldText'),worldFill:$('#worldFill'),
  worldPct:$('#worldPct'),sound:$('#soundToggle')
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
  ui.back.onclick=()=>{ui.panel.classList.add('hidden');selected=null;renderWorld()};
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
    b.onclick=()=>{difficulty=key;renderDifficulties();if(selected)newTask()};
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
  ui.panel.classList.remove('hidden');
  newTask();
  renderWorld();
  ui.panel.scrollIntoView({behavior:'smooth',block:'start'});
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
  task=pickTask(categories[selected],difficulty,previousQuestion);
  resetAttemptState();
  ui.feedback.className='feedback hidden';
  ui.feedback.textContent='';
  ui.meta.textContent=categories[selected].name;
  ui.title.textContent=difficultyMeta[difficulty].desc;
  ui.badge.textContent=difficultyMeta[difficulty].label;
  ui.q.textContent=task.q;
  ui.q.title=difficultyMeta[difficulty].detail;
  renderAnswer();
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
function check(value){
  if(solutionShown) return;
  progress.totalAttempts++;
  if(selected) progress.byCategory[selected].attempts++;

  if(equal(Number(value),Number(task.answer))){
    const before=worldState(progress);
    progress.totalCorrect++;
    progress.streak++;
    if(selected) progress.byCategory[selected].correct++;
    progress.xp+=difficulty==='easy'?10:difficulty==='medium'?18:difficulty==='hard'?28:40;
    const after=worldState(progress);

    const phaseBefore=selected?before.states[selected].phase:0;
    const phaseAfter=selected?after.states[selected].phase:0;
    const unlocked=phaseAfter>phaseBefore;

    showFeedback('good',attempts===0?'Správně!':'Správně. Teď už to sedí.');
    ui.hint.hidden=true;
    saveProgress(progress);
    refreshStats();
    renderWorld();

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

    setTimeout(newTask,unlocked?1300:900);
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
  ui.hint.hidden=true;
  sound(playHint);
  showFeedback('bad',`Nápověda: ${task.hint||'Převeď veličiny do stejných jednotek a zkontroluj vztah mezi nimi.'}`);
  focusAnswer();
}
function revealSolution(){
  solutionShown=true;
  ui.hint.hidden=true;
  disableAnswer();

  const answerText=String(task.answer).replace('.',',');
  const explanation=task.explanation || task.hint || 'Převeď veličiny do stejných jednotek a postupuj po jednotlivých krocích.';
  showFeedback('bad',`Správná odpověď je ${answerText}. Postup: ${explanation}`);
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
function refreshStats(){
  ui.xp.textContent=progress.xp;
  ui.streak.textContent=progress.streak;
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
    el.classList.remove('phase-0','phase-1','phase-2','phase-3','phase-4','phase-5','active');
    el.classList.add(`phase-${state.phase}`);
    el.classList.toggle('active',selected===key);
    const status=el.querySelector('.district-status');
    const nextAt=Math.min(state.max,(state.phase+1)*10);
    status.textContent=state.phase===5
      ? `${state.label} • dokončeno`
      : `${state.label} • ${state.correct}/${nextAt}`;
  });
}
function animateWorld(cls){
  ui.worldPanel.classList.remove('flash-good','flash-unlock');
  void ui.worldPanel.offsetWidth;
  ui.worldPanel.classList.add(cls);
  setTimeout(()=>ui.worldPanel.classList.remove(cls),1000);
}

init();