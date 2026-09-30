import {kaerunLevelFromXp,ilyraLevelFromXp} from './progression.js?v=2';

export const DEFAULT_STARTERS={
 kaerun:['strike','strike','strike','strike','guard','guard','guard','guard','targetbreaker','gauntletsmash'],
 ilyra:['arcbolt','arcbolt','arcbolt','crystalguard','crystalguard','crystalguard','corespark','corespark','resonantstrike','prismward']
};
export const FLEX_SLOTS={kaerun:[2,3,6,7],ilyra:[2,5,7,9]};
export const LEVEL_UNLOCKS={
 kaerun:{2:['deflect','shieldbash','scout'],4:['fortify','suppress','sovereignbrand'],6:['unbrokenguard','relentless','bloodrush'],8:['cleave','shatterarmourkaerun','crushingadvance']},
 ilyra:{2:['deflect','shieldbash','scout'],4:['fortify','suppress','arcsplit'],6:['prismstudy','latticeward','corechannel'],8:['cleave','crystallance','resonantmend']}
};
export const STARTER_CHALLENGES={
 kaerun:[{stat:'markedKills',goal:30,card:'markedforruin',name:'Marked for defeat',text:'Defeat 30 Marked enemies with cards.'},{stat:'marksApplied',goal:60,card:'unbrokenguard',name:'Sovereign discipline',text:'Apply Mark with cards 60 times.'},{stat:'blockedDamage',goal:150,card:'fortressstance',name:'The unbroken',text:'Absorb 150 incoming damage with Block.'}],
 ilyra:[{stat:'resonanceSpent',goal:50,card:'corechannel',name:'Crystal attunement',text:'Spend 50 Resonance.'},{stat:'barrierCreated',goal:150,card:'latticeward',name:'Lasting protection',text:'Create 150 next-turn Barrier with cards.'},{stat:'resonanceKills',goal:30,card:'fracturefield',name:'Resonant finisher',text:'Defeat 30 enemies with Resonance-spending attacks.'}]
};
export const STARTER_STAT_KEYS=['markedKills','marksApplied','blockedDamage','resonanceSpent','barrierCreated','resonanceKills'];
export function emptyStarterStats(){return Object.fromEntries(STARTER_STAT_KEYS.map(k=>[k,0]));}
const count=n=>Number.isFinite(n)&&n>=0?Math.min(100000000,Math.floor(n)):0;
export function heroLevel(hero,progression={}){return (hero==='ilyra'?ilyraLevelFromXp:kaerunLevelFromXp)(progression[hero+'Xp']||0).level;}
export function defaultLoadout(hero){return FLEX_SLOTS[hero].map(i=>DEFAULT_STARTERS[hero][i]);}
export function starterCatalog(hero){return [...new Set([...DEFAULT_STARTERS[hero],...Object.values(LEVEL_UNLOCKS[hero]).flat(),...STARTER_CHALLENGES[hero].map(c=>c.card)])];}
export function restoreStarterCollection(raw){
 let parsed;try{parsed=typeof raw==='string'?JSON.parse(raw):raw;}catch{}
 const out={version:1,heroes:{},checkpoint:null};
 for(const hero of Object.keys(DEFAULT_STARTERS)){
  const h=parsed?.heroes?.[hero];out.heroes[hero]={stats:emptyStarterStats(),choices:{},loadout:defaultLoadout(hero),seen:[]};
  for(const key of STARTER_STAT_KEYS)out.heroes[hero].stats[key]=count(h?.stats?.[key]);
  for(const [level,cards] of Object.entries(LEVEL_UNLOCKS[hero]))if(cards.includes(h?.choices?.[level]))out.heroes[hero].choices[level]=h.choices[level];
  if(Array.isArray(h?.loadout)&&h.loadout.length===4&&h.loadout.every(id=>starterCatalog(hero).includes(id)))out.heroes[hero].loadout=[...h.loadout];
  if(Array.isArray(h?.seen))out.heroes[hero].seen=[...new Set(h.seen.filter(id=>typeof id==='string'))].slice(0,200);
 }
 const p=parsed?.checkpoint;if(p&&typeof p.id==='string'&&p.id.length<=100&&DEFAULT_STARTERS[p.hero])out.checkpoint={id:p.id,hero:p.hero,stats:Object.fromEntries(STARTER_STAT_KEYS.map(k=>[k,count(p.stats?.[k])]))};
 return out;
}
export function unlockedStarterCards(hero,collection,level=1){
 const h=collection.heroes[hero],ids=new Set(DEFAULT_STARTERS[hero]);
 for(const [threshold,id] of Object.entries(h.choices))if(level>=Number(threshold)&&LEVEL_UNLOCKS[hero][threshold]?.includes(id))ids.add(id);
 for(const c of STARTER_CHALLENGES[hero])if(h.stats[c.stat]>=c.goal)ids.add(c.card);
 return [...ids];
}
export function validateLoadout(hero,loadout,collection,level,cards){
 if(!DEFAULT_STARTERS[hero]||!Array.isArray(loadout)||loadout.length!==4)return 'Choose exactly four flexible cards.';
 const unlocked=unlockedStarterCards(hero,collection,level);
 if(loadout.some(id=>!unlocked.includes(id)||!cards[id]||cards[id].upgradeOf||(cards[id].kaerun&&hero!=='kaerun')||(cards[id].ilyra&&hero!=='ilyra')))return 'Choose unlocked, unupgraded cards for this hero.';
 if(loadout.some(id=>loadout.filter(x=>x===id).length>2))return 'Use at most two copies of a card in the flexible slots.';
 if(loadout.some(id=>cards[id].cost>2)||loadout.filter(id=>cards[id].cost===2).length>2)return 'Use at most two cards costing 2 Core; higher-cost cards stay in run rewards.';
 if(loadout.reduce((n,id)=>n+cards[id].cost,0)>6)return 'The four flexible cards can cost at most 6 Core in total.';
 return null;
}
export function buildStarterDeck(hero,loadout,collection,level,cards){
 const deck=[...DEFAULT_STARTERS[hero]],safe=validateLoadout(hero,loadout,collection,level,cards)?defaultLoadout(hero):loadout;
 FLEX_SLOTS[hero].forEach((index,i)=>deck[index]=safe[i]);return deck;
}
export function chooseLevelUnlock(collection,hero,level,id,currentLevel){
 if(!LEVEL_UNLOCKS[hero]?.[level]?.includes(id)||currentLevel<Number(level)||collection.heroes[hero].choices[level])return false;
 collection.heroes[hero].choices[level]=id;return true;
}
// A per-run checkpoint in the same saved collection makes repeated saves/reloads idempotent.
export function bankStarterProgress(collection,run){
 if(!run?.starterRunId||!DEFAULT_STARTERS[run.hero])return false;
 const h=collection.heroes[run.hero],prev=collection.checkpoint?.id===run.starterRunId&&collection.checkpoint.hero===run.hero?collection.checkpoint.stats:emptyStarterStats();
 let changed=false;const totals=emptyStarterStats();
 for(const key of STARTER_STAT_KEYS){totals[key]=Math.max(count(run.starterStats?.[key]),prev[key]);const delta=totals[key]-prev[key];if(delta){h.stats[key]=count(h.stats[key]+delta);changed=true;}}
 for(const id of [...(run.deck||[]),...(run.rewards||[]),...(run.room?.cards||[]),...(run.room?.rare||[]),...(run.room?.stock||[]).filter(x=>x.kind==='card').map(x=>x.id)]){const base=id.replace(/_up$/,'');if(!h.seen.includes(base)&&h.seen.length<200){h.seen.push(base);changed=true;}}
 if(collection.checkpoint?.id!==run.starterRunId)changed=true;
 collection.checkpoint={id:run.starterRunId,hero:run.hero,stats:totals};return changed;
}
