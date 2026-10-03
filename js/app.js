import { categories } from '../data/categories.js';
import { difficultyMeta,pickTask,parseAnswer,equal } from './core.js';
import { loadProgress,saveProgress } from './progress.js';
import { worldState } from './world.js';

let difficulty='easy';
let selected=null;
let task=null;
let progress=loadProgress();

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
  ui.hint.onclick=()=>showFeedback('bad',`Nápověda: ${task.hint||'Zkus převést obě veličiny do stejné jednotky.'}`);
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
function newTask(){
  task=pickTask(categories[selected],difficulty);
  ui.feedback.className='feedback hidden';
  ui.feedback.textContent='';
  ui.meta.textContent=categories[selected].name;
  ui.title.textContent=difficultyMeta[difficulty].desc;
  ui.badge.textContent=difficultyMeta[difficulty].label;
  ui.q.textContent=task.q;
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
  progress.totalAttempts++;
  if(equal(Number(value),Number(task.answer))){
    progress.totalCorrect++;progress.streak++;
    progress.xp+=difficulty==='easy'?10:difficulty==='medium'?18:difficulty==='hard'?28:40;
    showFeedback('good','Správně. Tohle už není tipování, ale práce s jednotkami.');
    saveProgress(progress);refreshStats();renderWorld();setTimeout(newTask,700);
  }else{
    progress.streak=0;saveProgress(progress);refreshStats();
    showFeedback('bad','To nesedí. Zkontroluj převodní vztah a jednotku výsledku.');
  }
}
function showFeedback(kind,text){ui.feedback.className=`feedback ${kind}`;ui.feedback.textContent=text}
function refreshStats(){ui.xp.textContent=progress.xp;ui.streak.textContent=progress.streak}
function renderWorld(){const w=worldState(progress.totalCorrect);ui.worldTitle.textContent=w.title;ui.worldText.textContent=w.text;ui.worldFill.style.width=`${w.pct}%`}

init();