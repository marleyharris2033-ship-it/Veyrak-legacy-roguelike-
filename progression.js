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
