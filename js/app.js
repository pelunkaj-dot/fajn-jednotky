import { categories } from '../data/categories.js';
import { difficultyMeta,pickTask,parseAnswer,equal } from './core.js';
import { loadProgress,saveProgress } from './progress.js';
import { worldState } from './world.js';

let difficulty='easy';
let selected=null;
let task=null;
let progress=loadProgress();

let attempts=0;
let hintUsed=false;
let solutionOffered=false;
let solutionShown=false;

const $=s=>document.querySelector(s);
const ui={
  switch:$('#difficultySwitch'),grid:$('#categoryGrid'),panel:$('#exercisePanel'),back:$('#backBtn'),
  meta:$('#exerciseMeta'),title:$('#exerciseTitle'),badge:$('#difficultyBadge'),q:$('#questionText'),answer:$('#answerArea'),
  feedback:$('#feedback'),hint:$('#hintBtn'),next:$('#newBtn'),xp:$('#xp'),streak:$('#streak'),
  worldTitle:$('#worldTitle'),worldText:$('#worldText'),worldFill:$('#worldFill')
};

function init(){renderDifficulties();renderCategories();bind();refreshStats();renderWorld()}
function bind(){
  ui.back.onclick=()=>{ui.panel.classList.add('hidden');selected=null};
  ui.hint.onclick=()=>handleHelpAction();
  ui.next.onclick=()=>newTask();
}
function renderDifficulties(){
  ui.switch.innerHTML='';
  Object.entries(difficultyMeta).forEach(([key,m])=>{
    const b=document.createElement('button');
    b.textContent=m.label;b.title=m.desc;b.classList.toggle('active',key===difficulty);
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

  if(equal(Number(value),Number(task.answer))){
    progress.totalCorrect++;
    progress.streak++;
    progress.xp+=difficulty==='easy'?10:difficulty==='medium'?18:difficulty==='hard'?28:40;
    showFeedback('good',attempts===0
      ? 'Správně!'
      : 'Správně. Teď už to sedí.');
    ui.hint.hidden=true;
    saveProgress(progress);refreshStats();renderWorld();
    setTimeout(newTask,900);
    return;
  }

  attempts++;
  progress.streak=0;
  saveProgress(progress);
  refreshStats();

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
function refreshStats(){ui.xp.textContent=progress.xp;ui.streak.textContent=progress.streak}
function renderWorld(){
  const w=worldState(progress.totalCorrect);
  ui.worldTitle.textContent=w.title;
  ui.worldText.textContent=w.text;
  ui.worldFill.style.width=`${w.pct}%`;
}

init();