export const timeTasks={
  easy:[
    {q:'3 min = ? s',answer:180,choices:[30,180,300,360],hint:'1 min = 60 s.'},
    {q:'2 h = ? min',answer:120,choices:[20,60,120,200],hint:'1 h = 60 min.'},
    {q:'240 s = ? min',answer:4,choices:[2.4,4,24,40],hint:'60 s = 1 min.'},
    {q:'3 dny = ? h',answer:72,choices:[24,48,72,96],hint:'1 den = 24 h.'},
    {q:'2 týdny = ? dní',answer:14,choices:[7,12,14,20],hint:'1 týden = 7 dní.'},
    {q:'90 min = ? h',answer:1.5,choices:[.9,1.5,9,15],hint:'90 ÷ 60 = 1,5.'},
    {q:'1,25 h = ? min',answer:75,choices:[65,70,75,125],hint:'1,25 × 60 = 75.'},
    {q:'3 600 s = ? h',answer:1,choices:[.1,1,6,60],hint:'1 h = 3 600 s.'}
  ],
  medium:[
    {q:'150 min = ? h',answer:2.5,hint:'150 ÷ 60 = 2,5.'},
    {q:'1,75 h = ? min',answer:105,hint:'1,75 × 60 = 105.'},
    {q:'2 h 35 min = ? min',answer:155,hint:'2 h = 120 min, potom přičti 35 min.'},
    {q:'195 min = ? h',answer:3.25,hint:'195 ÷ 60 = 3,25.'},
    {q:'2,4 h = ? min',answer:144,hint:'2,4 × 60 = 144.'},
    {q:'5 400 s = ? min',answer:90,hint:'Děl 60.'},
    {q:'1 den 6 h = ? h',answer:30,hint:'1 den = 24 h.'},
    {q:'3 týdny 2 dny = ? dní',answer:23,hint:'3 týdny = 21 dní.'}
  ],
  hard:[
    {q:'Film začal v 18:47 a skončil ve 21:13. Kolik minut trval?',answer:146,hint:'Od 18:47 do 19:00 je 13 minut, potom pokračuj po celých hodinách.'},
    {q:'Vlak jede 2 h 38 min. Kolik je to minut?',answer:158,hint:'2 × 60 + 38.'},
    {q:'Výuka začíná v 8:15 a končí v 13:40. Přestávky trvají dohromady 55 minut. Kolik minut trvá samotná výuka?',answer:270,hint:'Od 8:15 do 13:40 je 325 minut. Odečti přestávky.'},
    {q:'Autobus vyjel v 14:28 a cesta trvala 1 h 47 min. V kolik hodin přijel? Zapiš čas jako číslo ve tvaru HHMM, například 1635.',answer:1615,hint:'14:28 + 1 h = 15:28, + 47 min = 16:15.'},
    {q:'Běžec uběhl první úsek za 18 min 45 s a druhý za 22 min 35 s. Kolik sekund běžel celkem?',answer:2480,hint:'Převeď oba časy na sekundy a sečti je.'},
    {q:'Pracovní směna trvá 7,5 h. Kolik minut je to po odečtení 30minutové přestávky?',answer:420,hint:'7,5 h = 450 min.'},
    {q:'Let trvá 2 h 55 min. Odlet je v 9:35. V kolik hodin letadlo přistane? Zapiš čas jako číslo ve tvaru HHMM.',answer:1230,hint:'9:35 + 2 h 55 min = 12:30.'},
    {q:'Čas 2 h 24 min vyjádři v hodinách desetinným číslem.',answer:2.4,hint:'24 min = 24/60 h = 0,4 h.'}
  ],
  challenge:[
    {q:'Závod začal ve 23:48 a skončil následující den v 1:17. Kolik minut trval?',answer:89,hint:'Do půlnoci zbývá 12 minut a po půlnoci uplyne ještě 77 minut.'},
    {q:'Vlak vyjel v 22:36. Cesta trvala 3 h 52 min. V kolik hodin přijel následující den? Zapiš čas jako číslo ve tvaru HHMM.',answer:228,hint:'22:36 + 3 h 52 min = 2:28 následujícího dne.'},
    {q:'Stroj pracoval 2 h 18 min, měl 37 min odstávku a potom pracoval ještě 1 h 46 min. Kolik minut od začátku do konce celkem uplynulo?',answer:281,hint:'Sečti oba pracovní úseky i odstávku.'},
    {q:'Cyklista ujel trasu za 1 h 36 min. Druhý den zkrátil svůj čas o 12,5 %. O kolik minut jel druhý den kratší dobu?',answer:12,hint:'1 h 36 min = 96 min. Vypočítej 12,5 % z 96.'},
    {q:'Dvě třetiny pracovního dne dlouhého 7 h 30 min už uplynuly. Kolik minut zbývá?',answer:150,hint:'7 h 30 min = 450 min. Jedna třetina je 150 min.'},
    {q:'Časový interval trvá 2,75 h. Kolik je to sekund?',answer:9900,hint:'2,75 h = 165 min = 9 900 s.'}
  ]
};