let ctx=null;
let lastCorrect=-1;
let lastWrong=-1;

function audioContext(){
  if(!ctx) ctx=new (window.AudioContext||window.webkitAudioContext)();
  if(ctx.state==='suspended') ctx.resume();
  return ctx;
}
function tone(freq,start,duration,type='sine',gain=.045){
  const c=audioContext(),o=c.createOscillator(),g=c.createGain();
  o.type=type;o.frequency.setValueAtTime(freq,c.currentTime+start);
  g.gain.setValueAtTime(.0001,c.currentTime+start);
  g.gain.exponentialRampToValueAtTime(gain,c.currentTime+start+.015);
  g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+start+duration);
  o.connect(g);g.connect(c.destination);
  o.start(c.currentTime+start);o.stop(c.currentTime+start+duration+.03);
}
function pattern(notes){
  notes.forEach(([f,s,d,t,g])=>tone(f,s,d,t,g));
}
function pickDifferent(list,last){
  let i=Math.floor(Math.random()*list.length);
  if(list.length>1&&i===last)i=(i+1)%list.length;
  return i;
}
const correctPatterns=[
  [[523,.00,.11,'sine',.038],[659,.09,.12,'sine',.04],[784,.18,.17,'sine',.045]],
  [[587,.00,.12,'triangle',.035],[740,.10,.12,'triangle',.038],[880,.20,.16,'triangle',.042]],
  [[494,.00,.10,'sine',.035],[622,.08,.11,'sine',.038],[740,.17,.15,'sine',.043]],
  [[659,.00,.10,'triangle',.035],[784,.09,.11,'triangle',.04],[988,.19,.16,'sine',.04]]
];
const wrongPatterns=[
  [[220,.00,.10,'sine',.022],[196,.10,.14,'sine',.018]],
  [[247,.00,.09,'triangle',.018],[220,.10,.13,'sine',.016]],
  [[262,.00,.08,'sine',.018],[233,.09,.13,'sine',.016]]
];
export function playCorrect(){
  lastCorrect=pickDifferent(correctPatterns,lastCorrect);
  pattern(correctPatterns[lastCorrect]);
}
export function playWrong(){
  lastWrong=pickDifferent(wrongPatterns,lastWrong);
  pattern(wrongPatterns[lastWrong]);
}
export function playHint(){
  pattern([[392,.00,.09,'sine',.025],[523,.10,.12,'sine',.028]]);
}
export function playStreak(){
  pattern([[523,.00,.09,'triangle',.035],[659,.07,.09,'triangle',.038],[784,.14,.10,'triangle',.04],[1047,.23,.18,'sine',.045]]);
}
export function playUnlock(){
  pattern([[392,.00,.13,'sine',.03],[494,.10,.13,'sine',.034],[587,.20,.13,'sine',.038],[784,.31,.22,'triangle',.045]]);
}
