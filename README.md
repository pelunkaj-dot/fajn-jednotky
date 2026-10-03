# FajnJednotky

Nový samostatný modul FajnCvičebny pro převody jednotek.

## Didaktická koncepce

Modul je od začátku stavěný pro široké rozpětí žáků:

- **Lehká** – základní vztahy a výběr ze 4 možností.
- **Střední** – bez nabídky odpovědí, desetinná čísla a smíšené zápisy.
- **Těžká** – více kroků; převod jednotek je prostředek k řešení problému.
- **Výzva** – úlohy pro lepší žáky a přípravu na jedničku.

Oblasti:

- délka,
- plocha,
- objem a kapaliny,
- čas,
- hmotnost.

## Architektura

Projekt není jeden obří HTML soubor.

- `index.html` – aplikace
- `css/styles.css` – vzhled
- `js/app.js` – UI a řízení aplikace
- `js/core.js` – společná logika úloh
- `js/progress.js` – lokální pokrok
- `js/world.js` – model herního světa
- `data/*.js` – samostatné banky úloh podle oblastí

## Stav

První funkční základ obsahuje všech 5 oblastí a všechny 4 obtížnosti. Lehká úroveň nabízí 4 možnosti, vyšší úrovně vyžadují vlastní výsledek. Herní svět je zatím připravený architektonicky; jeho vizuální podoba bude další velká etapa.

Původní modul `prevody_jednotek.html` v repozitáři `fdc-plugin` zůstává beze změn a slouží jen jako zdroj osvědčených nápadů a logiky.
