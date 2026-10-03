import { categories } from '../data/categories.js';
import { pickTask, equal } from '../js/core.js';

const RUNS_PER_LEVEL = 1500;
const errors = [];
const warnings = [];
let generated = 0;

const levels = ['easy','medium','hard','challenge'];

function fail(scope, message, task) {
  errors.push({ scope, message, q: task?.q ?? '' });
}

function warn(scope, message, task) {
  warnings.push({ scope, message, q: task?.q ?? '' });
}

function validateCzech(scope, task) {
  const q = task.q || '';
  const suspicious = [
    [/\b[2-4]\s+den\b/i, 'Po číslovkách 2–4 má být „dny“, ne „den“.'],
    [/\b1\s+dny\b/i, 'Po čísle 1 má být „den“.'],
    [/\b([2-4])\s+týden\b/i, 'Po číslovkách 2–4 má být „týdny“.'],
    [/\b1\s+týdny\b/i, 'Po čísle 1 má být „týden“.'],
    [/\bkolik\s+kg\b/i, 'V souvislé otázce je vhodnější „kolik kilogramů“ než „kolik kg“.'],
    [/\bkolik\s+m²\b/i, 'V souvislé otázce je vhodnější „kolik metrů čtverečních“ než „kolik m²“.'],
    [/\bkolik\s+dm³\b/i, 'V souvislé otázce je vhodnější „kolik decimetrů krychlových“ nebo přirozenější přeformulování.']
  ];
  for (const [re,msg] of suspicious) {
    if (re.test(q)) warn(scope,msg,task);
  }
}

function validateTask(scope, level, task) {
  generated++;

  if (!task || typeof task !== 'object') return fail(scope,'Generátor nevrátil objekt.',task);
  if (typeof task.q !== 'string' || !task.q.trim()) fail(scope,'Chybí text zadání.',task);
  if (typeof task.hint !== 'string' || !task.hint.trim()) fail(scope,'Chybí nápověda.',task);
  if (typeof task.answer !== 'number' || !Number.isFinite(task.answer)) fail(scope,'Odpověď není konečné číslo.',task);
  if (Math.abs(task.answer) > 1e12) warn(scope,'Výsledek je neobvykle velký; zkontroluj didaktickou vhodnost.',task);

  if (level === 'easy') {
    if (!Array.isArray(task.choices)) fail(scope,'Lehká úroveň musí mít čtyři možnosti.',task);
    else {
      if (task.choices.length !== 4) fail(scope,`Lehká úroveň má ${task.choices.length} možností místo 4.`,task);
      const nums = task.choices.map(Number);
      if (nums.some(v => !Number.isFinite(v))) fail(scope,'Některá možnost není číslo.',task);
      const unique = nums.filter((v,i,a)=>a.findIndex(x=>equal(x,v))===i);
      if (unique.length !== nums.length) fail(scope,'Nabídka obsahuje duplicitní možnosti.',task);
      if (!nums.some(v=>equal(v,task.answer))) fail(scope,'Správná odpověď není mezi možnostmi.',task);
    }
  } else if (task.choices) {
    warn(scope,'Vyšší obtížnost obsahuje nabídku odpovědí.',task);
  }

  validateCzech(scope, task);
}

for (const [catKey, category] of Object.entries(categories)) {
  for (const level of levels) {
    if (!Array.isArray(category.tasks?.[level]) || category.tasks[level].length === 0) {
      fail(`${catKey}/${level}`,'Chybí banka úloh.');
      continue;
    }

    let previous = '';
    let repeatedImmediately = 0;

    for (let i=0;i<RUNS_PER_LEVEL;i++) {
      let task;
      try {
        task = pickTask(category, level, previous);
      } catch (err) {
        fail(`${catKey}/${level}`,`Výjimka generátoru: ${err.message}`);
        continue;
      }

      validateTask(`${catKey}/${level}`, level, task);

      if (task?.q === previous) repeatedImmediately++;
      previous = task?.q ?? '';
    }

    if (repeatedImmediately > 0) {
      warn(`${catKey}/${level}`,`Bezprostřední opakování stejného zadání nastalo ${repeatedImmediately}×.`);
    }
  }
}

console.log(`FajnJednotky validator: vygenerováno ${generated.toLocaleString('cs-CZ')} úloh.`);
console.log(`Chyby: ${errors.length}, upozornění: ${warnings.length}`);

if (warnings.length) {
  console.log('\nUPOZORNĚNÍ:');
  warnings.slice(0,80).forEach((w,i)=>console.log(`${i+1}. [${w.scope}] ${w.message}${w.q ? ` — ${w.q}` : ''}`));
  if (warnings.length > 80) console.log(`… a dalších ${warnings.length-80}`);
}

if (errors.length) {
  console.error('\nCHYBY:');
  errors.slice(0,100).forEach((e,i)=>console.error(`${i+1}. [${e.scope}] ${e.message}${e.q ? ` — ${e.q}` : ''}`));
  if (errors.length > 100) console.error(`… a dalších ${errors.length-100}`);
  process.exit(1);
}

console.log('\nOK: nebyla nalezena žádná blokující chyba.');


console.log('\nDidaktická sekvence odpovědí je řízena v js/app.js:');
console.log('1. chyba -> pouze upozornění');
console.log('2. chyba -> nabídka nápovědy');
console.log('po nápovědě + další chyba -> nabídka zobrazení řešení');


console.log('\nSUBTOPIC TESTS');
for (const [catKey, category] of Object.entries(categories)) {
  for (const topic of (category.subtopics || [])) {
    if (topic.id === 'all') continue;
    const levels = topic.levels || levels;
    for (const level of levels) {
      try {
        const sample = pickTask(category, level, '', topic.id);
        if (!sample?.q) {
          fail(`${catKey}/${topic.id}/${level}`, 'Podokruh nevygeneroval zadání.');
        }
        if (topic.match && !topic.match(sample)) {
          fail(`${catKey}/${topic.id}/${level}`, 'Vygenerovaná úloha neodpovídá filtru podokruhu.', sample);
        }
      } catch (err) {
        fail(`${catKey}/${topic.id}/${level}`, `Podokruh selhal: ${err.message}`);
      }
    }
  }
}
