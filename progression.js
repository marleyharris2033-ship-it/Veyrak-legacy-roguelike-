export const KAERUN_MAX_LEVEL=20;
export const KAERUN_LEVEL_REWARDS=[
 null,
 'Base Kaerun',
 '+2 Max Vitality',
 '+2 Max Vitality',
 'Start each battle with +1 Core',
 'Veyrakian Guard: gain 5 Block at the start of every turn',
 '+2 Max Vitality',
 '+2 Max Vitality',
 'Draw +1 card on the first turn of battle',
 '+2 Max Vitality',
 'Pressure Training: the first Mark you apply each turn grants 2 Block',
 '+2 Max Vitality',
 'Start each battle with +1 additional Core',
 '+2 Max Vitality',
 'Veyrakian Guard improves to 6 Block each turn',
 'Relentless Pressure: first attack on a Marked enemy each turn grants +2 Block',
 '+2 Max Vitality',
 'Recover 3 Vitality after defeating an Elite',
 '+2 Max Vitality',
 'Veyrakian Guard improves to 7 Block each turn',
 'Sovereign: first Mark applied each battle applies +1 Mark and restores 1 Core'
];
export function xpForNextKaerunLevel(level){return level>=KAERUN_MAX_LEVEL?0:120+(level-1)*35;}
export function kaerunLevelFromXp(xp=0){xp=Math.max(0,Math.floor(Number(xp)||0));let level=1,spent=0;while(level<KAERUN_MAX_LEVEL){const need=xpForNextKaerunLevel(level);if(xp<spent+need)break;spent+=need;level++;}return {level,totalXp:xp,intoLevel:level>=KAERUN_MAX_LEVEL?0:xp-spent,next:xpForNextKaerunLevel(level)};}
export function kaerunBonuses(level=1){level=Math.max(1,Math.min(KAERUN_MAX_LEVEL,Math.floor(level)||1));return {
 maxHp:2*[2,3,6,7,9,11,13,16,18].filter(x=>level>=x).length,
 startingCore:(level>=12?2:level>=4?1:0),
 firstTurnDraw:level>=8?1:0,
 turnBlock:level>=19?7:level>=14?6:level>=5?5:0,
 markBlock:level>=10?2:0,
 markedAttackBlock:level>=15?2:0,
 eliteHeal:level>=17?3:0,
 sovereign:level>=20
};}
export function kaerunXpForEncounter(type,captureRarity=null){let xp=type==='boss'?100:type==='elite'?25:type==='beast'?10:12;if(captureRarity)xp+=captureRarity==='legendary'?40:captureRarity==='rare'?25:15;return xp;}

export const ILYRA_MAX_LEVEL=20;
export const ILYRA_LEVEL_REWARDS=[
 null,'Base Ilyra','+2 Max Vitality','Start battle with 2 Barrier','+2 Max Vitality',
 'Resonant Awakening: start each battle with 1 Resonance',
 '+2 Max Vitality','Start each battle with +1 Core','+2 Max Vitality','Start battle with 3 additional Barrier',
 'Expanded Lattice: maximum Resonance increases to 4',
 '+2 Max Vitality','Draw +1 card on the first turn','+2 Max Vitality','Start each battle with 2 Resonance instead of 1',
 'Resonant Aegis: first time you spend Resonance each turn, gain 3 next-turn Barrier',
 '+2 Max Vitality','Start each battle with +1 additional Core','+2 Max Vitality','Resonant Aegis improves to 4 Barrier',
 'Perfect Resonance: maximum Resonance increases to 5'
];
export function xpForNextIlyraLevel(level){return level>=ILYRA_MAX_LEVEL?0:120+(level-1)*35;}
export function ilyraLevelFromXp(xp=0){xp=Math.max(0,Math.floor(Number(xp)||0));let level=1,spent=0;while(level<ILYRA_MAX_LEVEL){const need=xpForNextIlyraLevel(level);if(xp<spent+need)break;spent+=need;level++;}return {level,totalXp:xp,intoLevel:level>=ILYRA_MAX_LEVEL?0:xp-spent,next:xpForNextIlyraLevel(level)};}
export function ilyraBonuses(level=1){level=Math.max(1,Math.min(ILYRA_MAX_LEVEL,Math.floor(level)||1));return {
 maxHp:2*[2,4,6,8,11,13,16,18].filter(x=>level>=x).length,
 startingBarrier:(level>=9?5:level>=3?2:0),
 startingCore:(level>=17?2:level>=7?1:0),
 firstTurnDraw:level>=12?1:0,
 startingResonance:level>=14?2:level>=5?1:0,
 resonanceCap:level>=20?5:level>=10?4:3,
 spendBarrier:level>=19?4:level>=15?3:0
};}
export function ilyraXpForEncounter(type,captureRarity=null){let xp=type==='boss'?100:type==='elite'?25:type==='beast'?10:12;if(captureRarity)xp+=captureRarity==='legendary'?40:captureRarity==='rare'?25:15;return xp;}
