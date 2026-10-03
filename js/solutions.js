const n = s => Number(String(s).replace(/\s/g,'').replace(',','.'));
const f = v => new Intl.NumberFormat('cs-CZ',{maximumFractionDigits:6}).format(v);
const answerLine = task => `Výsledek: ${f(task.answer)}.`;

function simpleEquation(task){
  const m=task.q.match(/^([\d\s,.]+)\s*([^=]+?)\s*=\s*\?\s*(.+)$/);
  if(!m) return null;
  const value=n(m[1]), from=m[2].trim(), to=m[3].trim();
  if(!Number.isFinite(value)) return null;

  const relation=task.hint?.trim();
  let operation='';
  if(value!==0){
    const ratio=task.answer/value;
    if(Math.abs(ratio-Math.round(ratio))<1e-9 && ratio>=1){
      operation=`${f(value)} × ${f(ratio)} = ${f(task.answer)}`;
    }else if(Math.abs((value/task.answer)-Math.round(value/task.answer))<1e-9 && task.answer!==0){
      operation=`${f(value)} ÷ ${f(value/task.answer)} = ${f(task.answer)}`;
    }
  }
  return [
    relation || `Nejprve si připomeň vztah mezi ${from} a ${to}.`,
    operation ? `${operation} ${to}` : `Po převodu dostaneme ${f(task.answer)} ${to}.`,
    `Odpověď: ${f(task.answer)} ${to}.`
  ];
}

function length(task,q){
  let m;
  if((m=q.match(/^(\d+) m (\d+) cm = \? cm$/))){
    const M=n(m[1]),cm=n(m[2]);
    return [`${M} m = ${M*100} cm.`,`${M*100} + ${cm} = ${task.answer} cm.`,`Odpověď: ${task.answer} cm.`];
  }
  if((m=q.match(/^(\d+) km (\d+) m = \? m$/))){
    const km=n(m[1]),met=n(m[2]);
    return [`${km} km = ${f(km*1000)} m.`,`${f(km*1000)} + ${met} = ${f(task.answer)} m.`,`Odpověď: ${f(task.answer)} m.`];
  }
  if((m=q.match(/Jedna délka je ([\d,]+) m, druhá (\d+) cm/))){
    const a=n(m[1]),b=n(m[2]),acm=a*100;
    return [`${f(a)} m = ${f(acm)} cm.`,`Rozdíl: ${f(Math.max(acm,b))} − ${f(Math.min(acm,b))} = ${f(task.answer)} cm.`,`Odpověď: délky se liší o ${f(task.answer)} cm.`];
  }
  if((m=q.match(/Trasa měří ([\d,]+) km\. Ušel jsi ([\d\s]+) m/))){
    const total=n(m[1]),walk=n(m[2]),tm=total*1000;
    return [`${f(total)} km = ${f(tm)} m.`,`${f(tm)} − ${f(walk)} = ${f(task.answer)} m.`,`Odpověď: zbývá ${f(task.answer)} m.`];
  }
  if((m=q.match(/Provaz dlouhý ([\d,]+) m rozdělíme na (\d+) stejně dlouhých částí/))){
    const total=n(m[1]),parts=n(m[2]),cm=total*100;
    return [`${f(total)} m = ${f(cm)} cm.`,`${f(cm)} ÷ ${parts} = ${f(task.answer)} cm.`,`Odpověď: jedna část měří ${f(task.answer)} cm.`];
  }
  if((m=q.match(/Obdélník má obvod ([\d,]+) m\. Jedna strana měří (\d+) cm/))){
    const p=n(m[1])*100,a=n(m[2]),half=p/2;
    return [`Obvod: ${f(p)} cm.`,`a + b = ${f(p)} ÷ 2 = ${f(half)} cm.`,`b = ${f(half)} − ${a} = ${f(task.answer)} cm.`];
  }
  if((m=q.match(/Mapa má měřítko 1 : ([\d\s]+).*?([\d,]+) cm/))){
    const scale=n(m[1]),cm=n(m[2]),real=cm*scale;
    return [`${f(cm)} × ${f(scale)} = ${f(real)} cm ve skutečnosti.`,`${f(real)} cm = ${f(real/100000)} km.`,`Odpověď: ${f(task.answer)} km.`];
  }
  if((m=q.match(/Na plánu v měřítku 1 : (\d+) měří stěna ([\d,]+) cm/))){
    const scale=n(m[1]),cm=n(m[2]),real=cm*scale;
    return [`${f(cm)} × ${scale} = ${f(real)} cm.`,`${f(real)} cm = ${f(real/100)} m.`,`Odpověď: ${f(task.answer)} m.`];
  }
  if((m=q.match(/První 1\/(\d+) trasy dlouhé ([\d,]+) km/))){
    const div=n(m[1]),total=n(m[2]),part=total/div;
    return [`${f(total)} ÷ ${div} = ${f(part)} km.`,`${f(part)} km = ${f(part*1000)} m.`,`Odpověď: ${f(task.answer)} m.`];
  }
  if((m=q.match(/Místnost je dlouhá ([\d,]+) m\. Koberec je o (\d+) cm kratší/))){
    const room=n(m[1])*100,short=n(m[2]);
    return [`${f(room/100)} m = ${f(room)} cm.`,`${f(room)} − ${short} = ${f(task.answer)} cm.`,`Odpověď: koberec měří ${f(task.answer)} cm.`];
  }
  if((m=q.match(/(\d+) stejných tyčí má dohromady délku ([\d,]+) m/))){
    const count=n(m[1]),total=n(m[2])*100;
    return [`${f(total/100)} m = ${f(total)} cm.`,`${f(total)} ÷ ${count} = ${f(task.answer)} cm.`,`Odpověď: jedna tyč měří ${f(task.answer)} cm.`];
  }
  if((m=q.match(/První úsek měří ([\d,]+) km a druhý (\d+) m/))){
    const a=n(m[1])*1000,b=n(m[2]);
    return [`${f(a/1000)} km = ${f(a)} m.`,`${f(a)} + ${b} = ${f(task.answer)} m.`,`Odpověď: oba úseky měří ${f(task.answer)} m.`];
  }
  if((m=q.match(/Cyklista ujede za (\d+) minut (\d+) km/))){
    const min=n(m[1]),km=n(m[2]),met=km*1000;
    return [`${km} km = ${f(met)} m.`,`${f(met)} ÷ ${min} = ${f(task.answer)} m.`,`Odpověď: za 1 minutu ujede ${f(task.answer)} m.`];
  }
  if((m=q.match(/První trasa měří ([\d,]+) km, druhá ([\d\s]+) m/))){
    const first=n(m[1])*1000,second=n(m[2]);
    return [`${f(first/1000)} km = ${f(first)} m.`,`${f(first)} − ${f(second)} = ${f(task.answer)} m.`,`Odpověď: první trasa je delší o ${f(task.answer)} m.`];
  }
  return null;
}

function area(task,q){
  let m;
  if((m=q.match(/Obdélník má rozměry ([\d,]+) m a (\d+) cm/))){
    const a=n(m[1]),b=n(m[2])/100;
    return [`${m[2]} cm = ${f(b)} m.`,`S = ${f(a)} × ${f(b)} = ${f(task.answer)} m².`,`Odpověď: obsah je ${f(task.answer)} m².`];
  }
  if((m=q.match(/Čtvercový pozemek má stranu (\d+) m/))){
    const side=n(m[1]),m2=side*side;
    return [`S = ${side} × ${side} = ${f(m2)} m².`,`${f(m2)} m² ÷ 100 = ${f(task.answer)} a.`,`Odpověď: ${f(task.answer)} a.`];
  }
  if((m=q.match(/Pozemek má rozlohu ([\d,]+) ha\. Zastavěno je ([\d\s]+) m²/))){
    const total=n(m[1])*10000,used=n(m[2]);
    return [`${m[1]} ha = ${f(total)} m².`,`${f(total)} − ${f(used)} = ${f(task.answer)} m².`,`Odpověď: zbývá ${f(task.answer)} m².`];
  }
  if((m=q.match(/Pole má ([\d,]+) ha\. (\d+)\/(\d+) plochy zůstává neoseto/))){
    const ha=n(m[1]),part=n(m[2]),den=n(m[3]),m2=ha*10000,seeded=den-part;
    return [`${f(ha)} ha = ${f(m2)} m².`,`Oseto je ${seeded}/${den} plochy.`,`${f(m2)} × ${seeded}/${den} = ${f(task.answer)} m².`];
  }
  if((m=q.match(/Čtvercový pozemek má rozlohu ([\d,]+) ha/))){
    const m2=n(m[1])*10000;
    return [`${m[1]} ha = ${f(m2)} m².`,`Strana čtverce je √${f(m2)} = ${f(task.answer)} m.`,`Odpověď: strana měří ${f(task.answer)} m.`];
  }
  if((m=q.match(/Obdélníkový pozemek má rozlohu ([\d,]+) ha a délku (\d+) m/))){
    const area=n(m[1])*10000,len=n(m[2]);
    return [`${m[1]} ha = ${f(area)} m².`,`Šířka = ${f(area)} ÷ ${len} = ${f(task.answer)} m.`,`Odpověď: šířka měří ${f(task.answer)} m.`];
  }
  if((m=q.match(/Na plánku v měřítku 1 : (\d+).*?([\d,]+) cm a ([\d,]+) cm/))){
    const scale=n(m[1]),a=n(m[2])*scale/100,b=n(m[3])*scale/100;
    return [`Skutečné rozměry: ${f(a)} m a ${f(b)} m.`,`S = ${f(a)} × ${f(b)} = ${f(task.answer)} m².`,`Odpověď: plocha je ${f(task.answer)} m².`];
  }
  if((m=q.match(/Deska má rozměry (\d+) cm a (\d+) cm/))){
    const a=n(m[1])/10,b=n(m[2])/10;
    return [`${m[1]} cm = ${f(a)} dm, ${m[2]} cm = ${f(b)} dm.`,`S = ${f(a)} × ${f(b)} = ${f(task.answer)} dm².`,`Odpověď: ${f(task.answer)} dm².`];
  }
  if((m=q.match(/Obdélník má obsah ([\d,]+) m² a šířku ([\d,]+) m/))){
    const area=n(m[1]),width=n(m[2]);
    return [`Délka = obsah ÷ šířka.`,`${f(area)} ÷ ${f(width)} = ${f(task.answer)} m.`,`Odpověď: délka měří ${f(task.answer)} m.`];
  }
  if((m=q.match(/Pozemek o rozloze ([\d,]+) ha se rozdělí na (\d+) stejně velkých parcel/))){
    const total=n(m[1])*10000,count=n(m[2]);
    return [`${m[1]} ha = ${f(total)} m².`,`${f(total)} ÷ ${count} = ${f(task.answer)} m².`,`Odpověď: jedna parcela má ${f(task.answer)} m².`];
  }
  if((m=q.match(/Čtverec má obvod (\d+) m/))){
    const p=n(m[1]),side=p/4,area=side*side;
    return [`Strana: ${p} ÷ 4 = ${f(side)} m.`,`S = ${f(side)} × ${f(side)} = ${f(area)} m².`,`${f(area)} m² = ${f(task.answer)} ha.`];
  }
  if((m=q.match(/První pozemek má ([\d,]+) ha, druhý ([\d\s]+) m²/))){
    const first=n(m[1])*10000,second=n(m[2]);
    return [`${m[1]} ha = ${f(first)} m².`,`${f(first)} − ${f(second)} = ${f(task.answer)} m².`,`Odpověď: první je větší o ${f(task.answer)} m².`];
  }
  return null;
}

function volume(task,q){
  let m;
  if((m=q.match(/Krabice má rozměry (\d+) cm × (\d+) cm × (\d+) cm/))){
    const a=n(m[1]),b=n(m[2]),c=n(m[3]),cm3=a*b*c;
    return [`V = ${a} × ${b} × ${c} = ${f(cm3)} cm³.`,`${f(cm3)} cm³ ÷ 1 000 = ${f(task.answer)} dm³.`,`Odpověď: ${f(task.answer)} dm³.`];
  }
  if((m=q.match(/Akvárium má vnitřní rozměry (\d+) cm × (\d+) cm × (\d+) cm/))){
    const a=n(m[1]),b=n(m[2]),h=n(m[3]),cm3=a*b*h;
    return [`V = ${a} × ${b} × ${h} = ${f(cm3)} cm³.`,`${f(cm3)} cm³ = ${f(cm3/1000)} l.`,`Odpověď: ${f(task.answer)} l.`];
  }
  if((m=q.match(/Nádrž o objemu ([\d,]+) m³ je naplněná z ([\d,]+) %/))){
    const m3=n(m[1]),pct=n(m[2]),liters=m3*1000;
    return [`${f(m3)} m³ = ${f(liters)} l.`,`${f(pct)} % z ${f(liters)} l = ${f(task.answer)} l.`,`Odpověď: ${f(task.answer)} l.`];
  }
  if((m=q.match(/dno (\d+) cm × (\d+) cm.*?obsahuje ([\d,]+) l/))){
    const a=n(m[1]),b=n(m[2]),lit=n(m[3]),cm3=lit*1000,base=a*b;
    return [`${f(lit)} l = ${f(cm3)} cm³.`,`Obsah dna: ${a} × ${b} = ${f(base)} cm².`,`Výška = ${f(cm3)} ÷ ${f(base)} = ${f(task.answer)} cm.`];
  }
  if((m=q.match(/přitéká (\d+) l vody za minutu.*?objem ([\d,]+) m³/))){
    const rate=n(m[1]),lit=n(m[2])*1000;
    return [`${m[2]} m³ = ${f(lit)} l.`,`Čas = ${f(lit)} ÷ ${rate} = ${f(task.answer)} min.`,`Odpověď: ${f(task.answer)} minut.`];
  }
  if((m=q.match(/Krychlová nádoba.*?hranu (\d+) cm.*?(\d+) %/))){
    const edge=n(m[1]),pct=n(m[2]),full=edge**3/1000;
    return [`Plný objem: ${edge}³ = ${f(edge**3)} cm³ = ${f(full)} l.`,`${pct} % z ${f(full)} l = ${f(task.answer)} l.`,`Odpověď: ${f(task.answer)} l.`];
  }
  if((m=q.match(/V nádobě je (\d+) l.*?Odlijeme ([\d,]+) %/))){
    const total=n(m[1]),pct=n(m[2]),remain=100-pct;
    return [`Zůstává ${f(remain)} % původního množství.`,`${f(total)} × ${f(remain)} / 100 = ${f(task.answer)} l.`,`Odpověď: ${f(task.answer)} l.`];
  }
  if((m=q.match(/Sud obsahuje ([\d,]+) hl.*?Odlijeme (\d+) l/))){
    const hl=n(m[1]),out=n(m[2]),lit=hl*100;
    return [`${f(hl)} hl = ${f(lit)} l.`,`${f(lit)} − ${out} = ${f(task.answer)} l.`,`Odpověď: ${f(task.answer)} l.`];
  }
  if((m=q.match(/Nádoba má objem (\d+) dm³.*?(\d+)\/(\d+)/))){
    const total=n(m[1]),num=n(m[2]),den=n(m[3]);
    return [`${total} dm³ = ${total} l.`,`${total} × ${num}/${den} = ${f(task.answer)} l.`,`Odpověď: ${f(task.answer)} l.`];
  }
  if((m=q.match(/Bazének má dno ([\d,]+) m × ([\d,]+) m.*?výšky (\d+) cm/))){
    const a=n(m[1]),b=n(m[2]),h=n(m[3])/100,m3=a*b*h;
    return [`${m[3]} cm = ${f(h)} m.`,`V = ${f(a)} × ${f(b)} × ${f(h)} = ${f(m3)} m³.`,`${f(m3)} m³ = ${f(task.answer)} l.`];
  }
  if((m=q.match(/lahví o objemu ([\d,]+) l.*?z ([\d,]+) l/))){
    const bottle=n(m[1]),total=n(m[2]);
    return [`Počet lahví = celkový objem ÷ objem jedné lahve.`,`${f(total)} ÷ ${f(bottle)} = ${f(task.answer)}.`,`Odpověď: naplníš ${f(task.answer)} lahví.`];
  }
  if((m=q.match(/Akvárium má rozměry (\d+) cm × (\d+) cm × (\d+) cm.*?(\d+) % výšky/))){
    const a=n(m[1]),b=n(m[2]),h=n(m[3]),pct=n(m[4]),water=h*pct/100,cm3=a*b*water;
    return [`Výška vody: ${h} × ${pct}/100 = ${f(water)} cm.`,`Objem vody: ${a} × ${b} × ${f(water)} = ${f(cm3)} cm³.`,`${f(cm3)} cm³ = ${f(task.answer)} l.`];
  }
  return null;
}

function time(task,q){
  let m;
  if((m=q.match(/^(\d+) h (\d+) min = \? min$/))){
    const h=n(m[1]),min=n(m[2]);
    return [`${h} h = ${h*60} min.`,`${h*60} + ${min} = ${f(task.answer)} min.`,`Odpověď: ${f(task.answer)} min.`];
  }
  if((m=q.match(/Událost začala v (\d+):(\d+) a skončila v (\d+):(\d+)/))){
    const sh=n(m[1]),sm=n(m[2]),eh=n(m[3]),em=n(m[4]),start=sh*60+sm,end=eh*60+em;
    return [`Začátek: ${start} minut od půlnoci.`,`Konec: ${end} minut od půlnoci.`,`${end} − ${start} = ${f(task.answer)} minut.`];
  }
  if((m=q.match(/Cesta začala v (\d+):(\d+) a trvala (\d+) h (\d+) min/))){
    const sh=n(m[1]),sm=n(m[2]),h=n(m[3]),min=n(m[4]),total=sh*60+sm+h*60+min,eh=Math.floor(total/60)%24,em=total%60;
    return [`Doba cesty: ${h*60} + ${min} = ${h*60+min} min.`,`K času ${sh}:${String(sm).padStart(2,'0')} přičteme ${h*60+min} minut.`,`Příjezd: ${eh}:${String(em).padStart(2,'0')}.`];
  }
  if((m=q.match(/Cesta začala ve (\d+):(\d+).*?po (\d+) minutách/))){
    const sh=n(m[1]),sm=n(m[2]),dur=n(m[3]),toMidnight=1440-(sh*60+sm),after=dur-toMidnight;
    return [`Do půlnoci zbývá ${toMidnight} minut.`,`Po půlnoci zbývá z cesty ${dur} − ${toMidnight} = ${after} minut.`,`Konec cesty: ${Math.floor(after/60)}:${String(after%60).padStart(2,'0')}.`];
  }
  if((m=q.match(/Čas (\d+) h (\d+) min vyjádři/))){
    const h=n(m[1]),min=n(m[2]),frac=min/60;
    return [`${min} min = ${min}/60 h = ${f(frac)} h.`,`${h} + ${f(frac)} = ${f(task.answer)} h.`,`Odpověď: ${f(task.answer)} h.`];
  }
  if((m=q.match(/Původní čas byl (\d+) minut.*?([\d,]+) % kratší/))){
    const total=n(m[1]),pct=n(m[2]);
    return [`Počítáme ${f(pct)} % z ${total} minut.`,`${total} × ${f(pct)} / 100 = ${f(task.answer)} minut.`,`Odpověď: čas se zkrátil o ${f(task.answer)} minut.`];
  }
  if((m=q.match(/První úsek trval (\d+) min (\d+) s a druhý (\d+) min (\d+) s/))){
    const a=n(m[1])*60+n(m[2]),b=n(m[3])*60+n(m[4]);
    return [`První úsek: ${m[1]}×60 + ${m[2]} = ${a} s.`,`Druhý úsek: ${m[3]}×60 + ${m[4]} = ${b} s.`,`${a} + ${b} = ${f(task.answer)} s.`];
  }
  if((m=q.match(/Směna trvá ([\d,]+) h.*?Přestávka trvá (\d+) min/))){
    const h=n(m[1]),br=n(m[2]),total=h*60;
    return [`${f(h)} h = ${f(total)} min.`,`${f(total)} − ${br} = ${f(task.answer)} min.`,`Odpověď: na práci zbývá ${f(task.answer)} min.`];
  }
  if((m=q.match(/První pracovní úsek trval (\d+) min, odstávka (\d+) min a druhý pracovní úsek (\d+) min/))){
    const a=n(m[1]),p=n(m[2]),b=n(m[3]);
    return [`Sečteme oba pracovní úseky i odstávku.`,`${a} + ${p} + ${b} = ${f(task.answer)} min.`,`Odpověď: celkem uplynulo ${f(task.answer)} min.`];
  }
  if((m=q.match(/(\d+)\/(\d+) pracovního času dlouhého (\d+) minut už uplynulo/))){
    const num=n(m[1]),den=n(m[2]),total=n(m[3]);
    return [`Zbývá 1/${den} celkového času.`,`${total} ÷ ${den} = ${f(task.answer)} min.`,`Odpověď: zbývá ${f(task.answer)} min.`];
  }
  if((m=q.match(/Časový interval trvá ([\d,]+) h\. Kolik je to sekund/))){
    const h=n(m[1]);
    return [`1 h = 3 600 s.`,`${f(h)} × 3 600 = ${f(task.answer)} s.`,`Odpověď: ${f(task.answer)} s.`];
  }
  return null;
}

function mass(task,q){
  let m;
  if((m=q.match(/Balík váží ([\d,]+) kg a obal (\d+) g/))){
    const gross=n(m[1])*1000,pack=n(m[2]);
    return [`${m[1]} kg = ${f(gross)} g.`,`${f(gross)} − ${pack} = ${f(task.answer)} g.`,`Odpověď: obsah váží ${f(task.answer)} g.`];
  }
  if((m=q.match(/Náklad má ([\d,]+) t\. Vyloží se (\d+) kg/))){
    const total=n(m[1])*1000,out=n(m[2]);
    return [`${m[1]} t = ${f(total)} kg.`,`${f(total)} − ${out} = ${f(task.answer)} kg.`,`Odpověď: zůstane ${f(task.answer)} kg.`];
  }
  if((m=q.match(/(\d+) stejných balíčků váží dohromady ([\d,]+) kg/))){
    const count=n(m[1]),grams=n(m[2])*1000;
    return [`${m[2]} kg = ${f(grams)} g.`,`${f(grams)} ÷ ${count} = ${f(task.answer)} g.`,`Odpověď: jeden balíček váží ${f(task.answer)} g.`];
  }
  if((m=q.match(/Nosnost je ([\d,]+) t.*?naloženo ([\d\s]+) kg/))){
    const limit=n(m[1])*1000,loaded=n(m[2]);
    return [`${m[1]} t = ${f(limit)} kg.`,`${f(limit)} − ${f(loaded)} = ${f(task.answer)} kg.`,`Odpověď: lze přidat ${f(task.answer)} kg.`];
  }
  if((m=q.match(/Směs má hmotnost ([\d,]+) kg a (\d+) %/))){
    const kg=n(m[1]),pct=n(m[2]),g=kg*1000;
    return [`${m[1]} kg = ${f(g)} g.`,`${pct} % z ${f(g)} g = ${f(task.answer)} g.`,`Odpověď: látky A je ${f(task.answer)} g.`];
  }
  if((m=q.match(/(\d+) stejných beden.*?dohromady ([\d,]+) kg.*?prázdná bedna váží ([\d,]+) kg/))){
    const count=n(m[1]),total=n(m[2]),box=n(m[3]),empty=count*box;
    return [`Prázdné bedny: ${count} × ${f(box)} = ${f(empty)} kg.`,`${f(total)} − ${f(empty)} = ${f(task.answer)} kg.`,`Odpověď: zboží váží ${f(task.answer)} kg.`];
  }
  if((m=q.match(/Zásilka má hmotnost ([\d,]+) kg\. (\d+) stejných předmětů tvoří (\d+) %/))){
    const total=n(m[1]),count=n(m[2]),pct=n(m[3]),all=total*pct/100;
    return [`${pct} % z ${f(total)} kg = ${f(all)} kg.`,`${f(all)} kg ÷ ${count} = ${f(all/count)} kg.`,`${f(all/count)} kg = ${f(task.answer)} g.`];
  }
  if((m=q.match(/(\d+) kg (\d+) g = \? g/))){
    const kg=n(m[1]),g=n(m[2]);
    return [`${kg} kg = ${kg*1000} g.`,`${kg*1000} + ${g} = ${f(task.answer)} g.`,`Odpověď: ${f(task.answer)} g.`];
  }
  if((m=q.match(/Balení obsahuje (\d+) kusů po (\d+) g/))){
    const count=n(m[1]),each=n(m[2]),g=count*each;
    return [`${count} × ${each} = ${f(g)} g.`,`${f(g)} g = ${f(g/1000)} kg.`,`Odpověď: ${f(task.answer)} kg.`];
  }
  if((m=q.match(/Náklad má ([\d,]+) t\. Zůstane 1\/(\d+)/))){
    const total=n(m[1])*1000,den=n(m[2]);
    return [`${m[1]} t = ${f(total)} kg.`,`${f(total)} ÷ ${den} = ${f(task.answer)} kg.`,`Odpověď: zůstane ${f(task.answer)} kg.`];
  }
  if((m=q.match(/Vozidlo může vézt nejvýše ([\d,]+) t\. Naloženo je (\d+) palet po ([\d\s]+) kg/))){
    const max=n(m[1])*1000,count=n(m[2]),each=n(m[3]),loaded=count*each;
    return [`Limit: ${m[1]} t = ${f(max)} kg.`,`Naloženo: ${count} × ${f(each)} = ${f(loaded)} kg.`,`${f(max)} − ${f(loaded)} = ${f(task.answer)} kg.`];
  }
  if((m=q.match(/Zásoba má hmotnost ([\d,]+) t\. Odebere se ([\d,]+) %/))){
    const total=n(m[1])*1000,pct=n(m[2]),remain=100-pct;
    return [`${m[1]} t = ${f(total)} kg.`,`Zůstává ${f(remain)} %.`,`${f(total)} × ${f(remain)} / 100 = ${f(task.answer)} kg.`];
  }
  return null;
}

export function solutionSteps(task){
  const q=task.q||'';
  const simple=simpleEquation(task);
  if(simple) return simple;

  const specific =
    length(task,q) ||
    area(task,q) ||
    volume(task,q) ||
    time(task,q) ||
    mass(task,q);

  if(specific) return specific;

  return [
    task.hint || 'Nejprve si zapiš vztah mezi jednotkami a veličinami v zadání.',
    `Po správném dosazení a výpočtu vyjde ${f(task.answer)}.`,
    answerLine(task)
  ];
}
