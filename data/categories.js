import { lengthTasks } from './length.js';
import { areaTasks } from './area.js';
import { volumeTasks } from './volume.js';
import { timeTasks } from './time.js';
import { massTasks } from './mass.js';

const simpleEquation = task => /^[\d\s,.]+\s*(mm²|cm²|dm²|m²|km²|mm³|cm³|dm³|m³|mm|cm|dm|m|km|mg|g|dag|kg|t|ml|cl|dl|l|hl|min|h|s)\s*=\s*\?/.test(task.q);
const has = (task,re) => re.test(task.q);

export const categories={
  length:{
    name:'Délka',icon:'📏',desc:'Od mm po km, smíšené zápisy, slovní úlohy i měřítko.',tasks:lengthTasks,
    subtopics:[
      {id:'all',label:'Vše'},
      {id:'basic',label:'Základní převody',levels:['easy','medium'],match:t=>simpleEquation(t)},
      {id:'mixed',label:'Smíšené jednotky',levels:['medium'],match:t=>/^\d+\s*(m|km)\s+\d+\s*(cm|m)/.test(t.q)},
      {id:'word',label:'Slovní úlohy',levels:['hard','challenge'],match:t=>!simpleEquation(t)&&!has(t,/měřítko|mapě|plánu/i)},
      {id:'scale',label:'Měřítko',levels:['challenge'],match:t=>has(t,/měřítko|mapě|plánu/i)}
    ]
  },
  area:{
    name:'Plocha',icon:'🟩',desc:'Čtvereční jednotky, ary, hektary a obsah útvarů.',tasks:areaTasks,
    subtopics:[
      {id:'all',label:'Vše'},
      {id:'basic',label:'Základní převody',levels:['easy','medium'],match:t=>simpleEquation(t)&&!has(t,/ha|km²|\sa\s/ )},
      {id:'land',label:'Ary a hektary',levels:['easy','medium','hard','challenge'],match:t=>has(t,/ha|hektar|\ba\b|km²/i)},
      {id:'word',label:'Obsah útvarů',levels:['hard','challenge'],match:t=>has(t,/obdéln|čtver|pozem|podlah|pole|deska|plocha/i)}
    ]
  },
  volume:{
    name:'Objem',icon:'🧪',desc:'Krychlové jednotky, litry a praktické nádoby.',tasks:volumeTasks,
    subtopics:[
      {id:'all',label:'Vše'},
      {id:'liquids',label:'Litry a kapaliny',levels:['easy','medium','hard','challenge'],match:t=>has(t,/\b(ml|cl|dl|l|hl)\b|litr/i)&&!has(t,/akvári|nádrž|nádob|bazén|krabic|sud|láhev/i)},
      {id:'cubic',label:'Krychlové jednotky',levels:['easy','medium','hard'],match:t=>has(t,/cm³|dm³|m³/)&&!has(t,/akvári|nádrž|nádob|bazén|krabic/i)},
      {id:'containers',label:'Nádoby a akvária',levels:['hard','challenge'],match:t=>has(t,/akvári|nádrž|nádob|bazén|krabic|sud|láhev/i)}
    ]
  },
  time:{
    name:'Čas',icon:'⏱️',desc:'Převody času, intervaly i úlohy přes půlnoc.',tasks:timeTasks,
    subtopics:[
      {id:'all',label:'Vše'},
      {id:'basic',label:'Základní převody',levels:['easy','medium'],match:t=>simpleEquation(t)},
      {id:'intervals',label:'Časové intervaly',levels:['hard','challenge'],match:t=>has(t,/začal|skončil|trvá|cesta|směna|úsek|odlet|přistane/i)&&!has(t,/půlnoc|následující den|23:/i)},
      {id:'midnight',label:'Přes půlnoc',levels:['challenge'],match:t=>has(t,/půlnoc|následující den|23:/i)}
    ]
  },
  mass:{
    name:'Hmotnost',icon:'⚖️',desc:'Základní převody, praktické úlohy a procenta.',tasks:massTasks,
    subtopics:[
      {id:'all',label:'Vše'},
      {id:'basic',label:'Základní převody',levels:['easy','medium'],match:t=>simpleEquation(t)},
      {id:'practical',label:'Praktické úlohy',levels:['hard','challenge'],match:t=>has(t,/balík|náklad|balení|vozidlo|zásilk|bedn|palet|výrob|směs/i)&&!has(t,/%|procent/i)},
      {id:'percent',label:'Procenta a celek',levels:['challenge'],match:t=>has(t,/%|procent|osmin|čtvrtin/i)}
    ]
  }
};