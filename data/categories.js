import { lengthTasks } from './length.js';
import { areaTasks } from './area.js';
import { volumeTasks } from './volume.js';
import { timeTasks } from './time.js';
import { massTasks } from './mass.js';

export const categories={
  length:{name:'Délka',icon:'📏',desc:'Od mm po km, smíšené zápisy i slovní úlohy.',tasks:lengthTasks},
  area:{name:'Plocha',icon:'🟩',desc:'mm², cm², dm², m², a, ha, km² – bez falešného ×10.',tasks:areaTasks},
  volume:{name:'Objem',icon:'🧪',desc:'cm³, dm³, m³ a vztah objemu ke kapalinám.',tasks:volumeTasks},
  time:{name:'Čas',icon:'⏱️',desc:'Sekundy, minuty, hodiny, intervaly i skutečné situace.',tasks:timeTasks},
  mass:{name:'Hmotnost',icon:'⚖️',desc:'mg, g, kg, t a úlohy, kde je převod jen prostředek.',tasks:massTasks}
};