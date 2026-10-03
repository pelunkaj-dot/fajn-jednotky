const KEY='fajn-jednotky-progress-v1';
export function loadProgress(){try{return {...defaults(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return defaults()}}
export function saveProgress(p){localStorage.setItem(KEY,JSON.stringify(p))}
export function defaults(){return {xp:0,streak:0,totalCorrect:0,totalAttempts:0,byCategory:{}}}