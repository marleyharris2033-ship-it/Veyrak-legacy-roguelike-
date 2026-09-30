import {buildStarterDeck,emptyStarterStats,STARTER_STAT_KEYS} from './starter-decks.js?v=1';
import {emitFeedback} from './combat-feedback.js?v=1';
import {kaerunBonuses,kaerunXpForEncounter,ilyraBonuses,ilyraXpForEncounter} from './progression.js?v=2';
import {BEASTS,RARITIES,SHARDS,validBeast,beastKey,addDiscovery, beastBonuses, BEAST_XP_REWARDS} from './beasts.js?v=15';
export {BEASTS,RARITIES,SHARDS} from './beasts.js?v=13';
export const VERSION=4;
const COMPATIBLE_VERSIONS=new Set([4]);
export const MAX_CORE=10;
export const CORE_REGEN=3;
export const HEROES = [
 {id:'kaerun',name:'Kaerun',title:'The Unbroken',weapon:'Gauntlets',signature:'Sovereign Impact',available:true,portrait:16.64},
 {id:'ilyra',name:'Ilyra',title:'The Crystal Seer',weapon:'Staff & catalyst',signature:'Violet Core',available:true,portrait:29.49},
 {id:'vaelis',name:'Vaelis',weapon:'Dual blades',portrait:43.14},
 {id:'dhoran',name:'Dhoran',weapon:'Heavy cannon',portrait:56.92},
 {id:'saevra',name:'Saevra',weapon:'Polearm',portrait:70.9},
 {id:'nyvara',name:'Nyvara',weapon:'Rifle',portrait:84.28}
];
const LEGACY_ENEMIES = [
 {id:'shard',name:'Shard Wisp',hp:25,colour:'#91e4e0',moves:[{kind:'attack',value:6},{kind:'attack',value:8},{kind:'guard',value:5}]},
 {id:'ember',name:'Ember Watcher',hp:29,colour:'#ffad66',moves:[{kind:'attack',value:7},{kind:'charge',value:0},{kind:'attack',value:13}]},
 {id:'stone',name:'Ruin Sentinel',hp:32,colour:'#cdbb91',moves:[{kind:'guard',value:7},{kind:'attack',value:9},{kind:'attack',value:7}]},
 {id:'void',name:'Veil Fragment',hp:27,colour:'#c197ff',moves:[{kind:'attack',value:5},{kind:'attack',value:10},{kind:'guard',value:6}]}
];
const LEGACY_ELITES=[
 {id:'crusher',name:'Obsidian Crusher',hp:58,colour:'#e07b4f',elite:true,moves:[{kind:'attack',value:10},{kind:'guard',value:10},{kind:'attack',value:16},{kind:'attack',value:12}]}
];
// Eight species from the first invading ecosystem. Elites reuse the same species and artwork.
export const INVADERS=[
 {id:'rift_skitter',name:'Rift Skitter',size:'small',hp:22,colour:'#9d5457',moves:[{kind:'attack',value:4},{kind:'attack',value:5},{kind:'attack',value:7}]},
 {id:'mawback',name:'Mawback',size:'large',hp:38,colour:'#9b7970',moves:[{kind:'guard',value:9},{kind:'attack',value:10},{kind:'attack',value:7}]},
 {id:'sable_spore',name:'Sable Spore',size:'small',hp:24,colour:'#77b7b3',moves:[{kind:'weaken',value:2},{kind:'attack',value:8},{kind:'attack',value:6}]},
 {id:'gravetusk',name:'Gravetusk',size:'large',hp:36,colour:'#ad807a',moves:[{kind:'charge',value:0},{kind:'attack',value:14},{kind:'attack',value:7}]},
 {id:'vesperwing',name:'Vesperwing',size:'small',hp:24,colour:'#b66877',moves:[{kind:'guard',value:6},{kind:'attack',value:9},{kind:'attack',value:7}]},
 {id:'hollowmaw',name:'Hollowmaw',size:'large',hp:36,colour:'#99b2aa',moves:[{kind:'siphon',value:7},{kind:'attack',value:8},{kind:'guard',value:5}]},
 {id:'thorncoil',name:'Thorncoil',size:'large',hp:35,colour:'#b46a67',moves:[{kind:'empower',value:1},{kind:'attack',value:8},{kind:'attack',value:9}]},
 {id:'duskcaller',name:'Duskcaller',size:'small',hp:24,colour:'#70aca6',moves:[{kind:'empower',value:2},{kind:'attack',value:7},{kind:'attack',value:8}]}
];
// Stage 2: tougher subterranean excavation ecosystem. Uses only combat mechanics already supported by the engine.
export const STAGE2_INVADERS=[
 {id:'riftclaw',name:'Azurax',size:'small',art:'azurax.png',hp:31,colour:'#9f55ff',moves:[{kind:'attack',value:7,name:'Raking Claw'},{kind:'guard',value:7,name:'Crystal Carapace'},{kind:'attack',value:11,name:'Azure Pincer'}]},
 {id:'kharvex',name:'Cindervex',size:'large',art:'cindervex.png',hp:52,colour:'#ff7a2d',moves:[{kind:'guard',value:13,name:'Brace'},{kind:'charge',value:0,name:'Blade Charge'},{kind:'attack',value:18,name:'Molten Cleave'}]},
 {id:'lithophage',name:'Pyrotharn',size:'large',art:'pyrotharn.png',hp:48,colour:'#46bfff',moves:[{kind:'empower',value:1,name:'Harden'},{kind:'attack',value:12,name:'Lava Ram'},{kind:'guard',value:10,name:'Cinder Plating'}]},
 {id:'veylisk',name:'Vaelith',size:'small',art:'vaelith.png',hp:30,colour:'#5ee5a0',moves:[{kind:'weaken',value:2,name:'Prism Haze'},{kind:'attack',value:10,name:'Crystal Lash'},{kind:'attack',value:8,name:'Tentacle Flurry'}]},
 {id:'tremor_stalker',name:'Skyrend',size:'small',art:'skyrend.png',hp:32,colour:'#e7b743',moves:[{kind:'attack',value:9,name:'Shard Bite'},{kind:'guard',value:8,name:'Crystal Scales'},{kind:'attack',value:12,name:'Raptor Lunge'}]},
 {id:'grindscale',name:'Emberwing',size:'large',art:'emberwing.png',hp:56,colour:'#e24c43',moves:[{kind:'guard',value:15,name:'Ember Veil'},{kind:'attack',value:13,name:'Wing Scythe'},{kind:'attack',value:15,name:'Flame Dive'}]},
 {id:'shardburrower',name:'Cryolith',size:'small',art:'cryolith.png',hp:29,colour:'#35d6d0',moves:[{kind:'empower',value:1,name:'Crystal Surge'},{kind:'guard',value:8,name:'Boulder Guard'},{kind:'attack',value:9,name:'Stone Fist'}]},
 {id:'voruun',name:'Volkrin',size:'large',art:'volkrin.png',hp:61,colour:'#e14b9b',moves:[{kind:'attack',value:13,name:'Tunnel Crush'},{kind:'empower',value:2,name:'Molten Coil'},{kind:'attack',value:17,name:'Volcanic Eruption'}]}
];
function stage2Partner(seed,nodeId,row,excluded){const pool=STAGE2_INVADERS.filter(x=>x.size==='small'&&x.id!==excluded),state={rng:hash(seed+':stage2-pack:'+nodeId)};return stage2Variant(pool[Math.floor(random(state)*pool.length)],row);}
function stage2Variant(species,row,elite=false){
 const enemy=structuredClone(species);enemy.elite=elite;enemy.stage2=true;enemy.balanceRevision=2;
 enemy.hp=Math.round((enemy.hp+row*2.5)*1.10*(elite?1.35:1));
 enemy.moves=enemy.moves.map(m=>({...m,value:Math.round((m.value+(['attack','siphon'].includes(m.kind)?1+Math.floor(row/3):m.kind==='guard'?1+Math.floor(row/4):0))*(elite&&['attack','siphon','guard'].includes(m.kind)?1.2:1))}));
 if(elite)enemy.name=`Elite ${enemy.name}`;
 return enemy;
}
const KHARVEX_MOVES=[{kind:'guard',value:24,name:'Anchor Plating'},{kind:'attack',value:28,expose:true,name:'Drill Impact'},{kind:'recover',value:0,name:'Exposed Recovery'},{kind:'attack',value:12,hits:2,name:'Twin Bore'}];
const KHARVEX_ENRAGED_MOVES=[{kind:'guard',value:18,name:'Cracked Plating'},{kind:'attack',value:32,expose:true,name:'Molten Impact'},{kind:'recover',value:0,name:'Exposed Recovery'},{kind:'attack',value:13,hits:2,name:'Frenzied Bore'}];
const STAGE2_BOSS={id:'kharvex_prime',name:'Kharvex Prime',hp:305,colour:'#e3ad4e',boss:true,stage2:true,balanceRevision:2,art:'EF449213-4894-48F5-9B22-E53CA59C4318.png',phase:1,moves:KHARVEX_MOVES};
function packPartner(seed,nodeId,row,excluded){const pool=INVADERS.filter(x=>x.size==='small'&&x.id!==excluded),state={rng:hash(seed+':pack:'+nodeId)};return invaderVariant(pool[Math.floor(random(state)*pool.length)],row);}
function invaderVariant(species,row,elite=false){
 const enemy=structuredClone(species);enemy.elite=elite;
 enemy.hp=Math.round((enemy.hp+4+row*3)*(elite?1.4:1));
 enemy.moves=enemy.moves.map(m=>({...m,value:Math.round((m.value+(m.kind==='attack'||m.kind==='siphon'?1+Math.floor(row/3):0))*(elite&&(m.kind==='attack'||m.kind==='siphon'||m.kind==='guard')?1.25:1))}));
 if(elite)enemy.name=`Elite ${enemy.name}`;
 return enemy;
}
const BOSS={id:'warden',name:'The Gate Warden',hp:210,colour:'#b05cff',boss:true,phase:1,moves:[{kind:'attack',value:13,name:'Void Claw'},{kind:'guard',value:16,name:'Rift Shield'},{kind:'attack',value:7,hits:2,name:'Twin Slash'},{kind:'charge',value:0,name:'Rift Charge'},{kind:'attack',value:24,name:'Rift Breaker'}]};
export function normaliseSeed(s){return String(s).trim().slice(0,32)||'VEYATHUUN';}
function hash(text){let n=2166136261;for(const c of text){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0;}
function random(state){state.rng=(state.rng+0x6D2B79F5)>>>0;let t=state.rng;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}
function shuffle(a,state){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random(state)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export const CARDS={
 strike:{name:'Strike',cost:1,damage:6,type:'attack',text:'Deal 6 damage.',tile:0},
 guard:{name:'Guard',cost:1,block:6,type:'defence',text:'Gain 6 Block this turn.',tile:1},
 targetbreaker:{name:'Target Breaker',cost:1,mark:3,type:'skill',kaerun:true,modernArt:'mark',text:'Apply 3 Mark to target.',tile:2},
 gauntletsmash:{name:'Gauntlet Smash',cost:2,damage:12,markedDamage:18,type:'attack',kaerun:true,text:'Deal 12 damage. If the target is Marked, deal 18 instead.',tile:3},
 deflect:{name:'Deflect',cost:0,block:4,type:'defence',text:'Gain 4 Block.',tile:4},
 cleave:{name:'Cleave',cost:2,damage:8,all:true,type:'attack',text:'Deal 8 damage to all enemies.',tile:5},
 focus:{name:'Focus',cost:1,coreGain:1,draw:1,type:'skill',modernArt:'core',text:'Gain 1 Core and draw 1 card.',tile:6},
 ironskin:{name:'Iron Skin',cost:1,block:8,strength:1,type:'defence',text:'Gain 8 Block. Gain 1 Strength this turn.',tile:7},
 seismicpunch:{name:'Seismic Punch',cost:2,damage:14,stun:true,type:'attack',text:'Deal 14 damage. Stun target if you have 10 or more Block.',tile:8},
 stonebulwark:{name:'Stone Bulwark',cost:2,block:12,type:'defence',text:'Gain 12 Block this turn.',tile:9},
 meteor:{name:'Meteor Fragment',cost:1,damage:10,randomTarget:true,type:'attack',sigil:'☄',text:'Deal 10 damage to a random enemy.'},
 chainlightning:{name:'Chain Lightning',cost:2,damage:6,splash:3,type:'attack',sigil:'ϟ',text:'Deal 6 damage to a target and 3 to every other enemy.'},
 shatterarmour:{name:'Armour Break',cost:1,damage:4,shatter:true,type:'attack',modernArt:'shatter',text:'Remove all of an enemy’s Block, then deal 4 damage.'},
 lifesiphon:{name:'Life Siphon',cost:2,damage:8,siphon:3,type:'attack',sigil:'✥',text:'Deal 8 damage. Heal 3 Vitality if it damages enemy health.'},
 crystalbarrier:{name:'Crystal Barrier',cost:2,block:15,drawPenalty:1,type:'defence',sigil:'⬡',text:'Gain 15 Block. Draw 1 fewer card next turn.'},
 echocrystal:{name:'Echo Crystal',cost:1,echo:true,type:'skill',sigil:'◇',text:'Your next attack card this turn activates twice. Does not stack.'},
 gravitywell:{name:'Gravity Well',cost:1,weaken:3,type:'skill',sigil:'◎',text:'All enemies deal 3 less attack damage this turn.'},
 finishingblow:{name:'Finishing Blow',cost:2,damage:10,executeDamage:20,type:'attack',sigil:'✧',text:'Deal 10 damage, or 20 if the target has half its health or less.'},
 unstablecore:{name:'Unstable Core',cost:0,coreGain:1,coreDebt:1,type:'skill',sigil:'◈',text:'Gain 1 Core now. Have 1 less Core next turn.'},
 vengefulspirit:{name:'Vengeful Spirit',cost:1,damage:5,revengeDamage:12,type:'attack',sigil:'◉',text:'Deal 5 damage, or 12 if you lost Vitality during the previous enemy turn.'},
 warcry:{name:'War Cry',cost:1,power:2,type:'skill',sigil:'✹',text:'Gain 2 Strength for the rest of the battle.'},
 ancientrelic:{name:'Ancient Relic',cost:1,fortune:true,type:'skill',sigil:'⚱',text:'Randomly gain 10 Block, gain 2 Core, or draw 3 cards.'},
 sovereignbrand:{name:'Sovereign Brand',cost:1,damage:5,mark:2,type:'attack',kaerun:true,text:'Deal 5 damage. Apply 2 Mark to target.'},
 markedforruin:{name:'Marked for Ruin',cost:1,requiresMark:true,vulnerable:2,type:'skill',kaerun:true,text:'If the target is Marked, apply 2 Vulnerable.'},
 unbrokenguard:{name:'Unbroken Guard',cost:1,block:7,markedBonusBlock:4,type:'defence',kaerun:true,text:'Gain 7 Block. If the target is Marked, gain 4 additional Block.'},
 crushingadvance:{name:'Crushing Advance',cost:2,damage:10,blockComboDamage:16,blockComboVulnerable:2,type:'attack',kaerun:true,text:'Deal 10 damage. If you have 10 or more Block, deal 16 damage and apply 2 Vulnerable.'},
 sovereignimpact:{name:'Sovereign Impact',cost:3,damage:18,consumeMarkDamage:4,exhaust:true,type:'attack',kaerun:true,text:'Deal 18 damage. Consume all Mark and deal +4 damage per Mark consumed. Exhaust.'},
 relentless:{name:'Relentless',cost:1,relentless:true,type:'skill',kaerun:true,text:'If you attack a Marked enemy this turn, draw 1 card.'},
 bloodrush:{name:'Blood Rush',cost:1,strength:2,bloodRush:true,type:'skill',kaerun:true,text:'Gain 2 Strength this turn. If you defeat an enemy this turn, gain 1 Core.'},
 shatterarmourkaerun:{name:'Shatter Armour',cost:2,damage:8,removeBlock:2,vulnerable:2,type:'attack',kaerun:true,text:'Deal 8 damage. Remove 2 Block from target. Apply 2 Vulnerable.'},
 execution:{name:'Execution',cost:2,damage:14,executeBonus:10,type:'attack',kaerun:true,text:'Deal 14 damage. If target is below 50% Health, deal an additional 10 damage.'},
 fortressstance:{name:'Fortress Stance',cost:1,block:10,markedStrength:1,type:'defence',kaerun:true,modernArt:'fortress',text:'Gain 10 Block. If target is Marked, gain 1 Strength this turn.'},
 arcbolt:{name:'Arc Bolt',cost:1,damage:5,resonanceGain:1,type:'attack',ilyra:true,text:'Deal 5 damage. Gain 1 Resonance.'},
 crystalguard:{name:'Crystal Guard',cost:1,block:6,resonanceGain:1,type:'defence',ilyra:true,text:'Gain 6 Block. Gain 1 Resonance.'},
 corespark:{name:'Core Spark',cost:0,coreGain:1,resonanceGain:1,type:'skill',ilyra:true,text:'Gain 1 Core and 1 Resonance.'},
 resonantstrike:{name:'Resonant Strike',cost:2,damage:10,resonanceDamage:3,type:'attack',ilyra:true,text:'Deal 10 damage, plus 3 per Resonance. Spend all Resonance.'},
 prismward:{name:'Prism Ward',cost:1,block:7,resonanceBarrier:2,type:'defence',ilyra:true,text:'Gain 7 Block. Gain 2 next-turn Barrier per Resonance spent.'},
 arcsplit:{name:'Arc Split',cost:1,damage:4,all:true,resonanceGain:1,type:'attack',ilyra:true,modernArt:'arc',text:'Deal 4 damage to all enemies. Gain 1 Resonance.'},
 prismstudy:{name:'Prism Study',cost:1,draw:2,resonanceGain:1,type:'skill',ilyra:true,modernArt:'prism',text:'Draw 2 cards. Gain 1 Resonance.'},
 latticeward:{name:'Lattice Ward',cost:1,block:4,nextBarrier:4,resonanceGain:1,type:'defence',ilyra:true,modernArt:'ward',text:'Gain 4 Block and 4 next-turn Barrier. Gain 1 Resonance.'},
 crystallance:{name:'Crystal Lance',cost:2,damage:7,resonanceDamage:5,type:'attack',ilyra:true,modernArt:'lance',text:'Deal 7 damage, plus 5 per Resonance. Spend all Resonance.'},
 fracturefield:{name:'Fracture Field',cost:2,damage:6,all:true,resonanceDamage:2,type:'attack',ilyra:true,modernArt:'fracture',text:'Deal 6 damage to all enemies, plus 2 per Resonance. Spend all Resonance.'},
 corechannel:{name:'Core Channel',cost:1,draw:1,resonanceGain:2,type:'skill',ilyra:true,modernArt:'channel',text:'Draw 1 card. Gain 2 Resonance.'},
 resonantmend:{name:'Resonant Mend',cost:2,block:6,resonanceHeal:2,exhaust:true,type:'defence',ilyra:true,modernArt:'mend',text:'Gain 6 Block. Heal 2 Vitality per Resonance spent. Exhaust.'},
 shieldbash:{name:'Shield Bash',cost:1,damage:5,block:4,type:'attack',modernArt:'shield',text:'Deal 5 damage and gain 4 Block.'},
 starfall:{name:'Starfall',cost:3,damage:15,all:true,type:'attack',modernArt:'star',text:'Deal 15 damage to all enemies.'},
 fortify:{name:'Fortify',cost:1,block:5,nextBarrier:3,type:'defence',modernArt:'fortify',text:'Gain 5 Block and 3 next-turn Barrier.'},
 piercingray:{name:'Piercing Ray',cost:2,damage:10,shatter:true,type:'attack',modernArt:'ray',text:'Remove all of an enemy’s Block, then deal 10 damage.'},
 suppress:{name:'Suppress',cost:1,weak:2,type:'skill',modernArt:'suppress',text:'Apply 2 Weak to target.'},
 scout:{name:'Scout',cost:1,draw:2,type:'skill',modernArt:'scout',text:'Draw 2 cards.'},
 ricochet:{name:'Ricochet',cost:1,damage:5,splash:3,type:'attack',modernArt:'ricochet',text:'Deal 5 damage to target and 3 to all other enemies.'},
 sundering:{name:'Sundering',cost:2,damage:9,vulnerable:2,type:'attack',modernArt:'sunder',text:'Deal 9 damage. Apply 2 Vulnerable to target.'}
};
export const CARD_UPGRADES={
 strike:'strike_up',guard:'guard_up',targetbreaker:'targetbreaker_up',gauntletsmash:'gauntletsmash_up',
 deflect:'deflect_up',cleave:'cleave_up',focus:'focus_up',ironskin:'ironskin_up',seismicpunch:'seismicpunch_up',stonebulwark:'stonebulwark_up',
 meteor:'meteor_up',chainlightning:'chainlightning_up',shatterarmour:'shatterarmour_up',lifesiphon:'lifesiphon_up',crystalbarrier:'crystalbarrier_up',
 echocrystal:'echocrystal_up',gravitywell:'gravitywell_up',finishingblow:'finishingblow_up',unstablecore:'unstablecore_up',vengefulspirit:'vengefulspirit_up',
 warcry:'warcry_up',ancientrelic:'ancientrelic_up',sovereignbrand:'sovereignbrand_up',markedforruin:'markedforruin_up',unbrokenguard:'unbrokenguard_up',
 crushingadvance:'crushingadvance_up',sovereignimpact:'sovereignimpact_up',relentless:'relentless_up',bloodrush:'bloodrush_up',
 shatterarmourkaerun:'shatterarmourkaerun_up',execution:'execution_up',fortressstance:'fortressstance_up',
 arcbolt:'arcbolt_up',crystalguard:'crystalguard_up',corespark:'corespark_up',resonantstrike:'resonantstrike_up',prismward:'prismward_up',
 arcsplit:'arcsplit_up',prismstudy:'prismstudy_up',latticeward:'latticeward_up',crystallance:'crystallance_up',fracturefield:'fracturefield_up',
 corechannel:'corechannel_up',resonantmend:'resonantmend_up',shieldbash:'shieldbash_up',starfall:'starfall_up',fortify:'fortify_up',
 piercingray:'piercingray_up',suppress:'suppress_up',scout:'scout_up',ricochet:'ricochet_up',sundering:'sundering_up'
};
Object.assign(CARDS,{
 strike_up:{...CARDS.strike,name:'Strike+',damage:9,text:'Deal 9 damage.',upgradeOf:'strike'},
 guard_up:{...CARDS.guard,name:'Guard+',block:9,text:'Gain 9 Block this turn.',upgradeOf:'guard'},
 targetbreaker_up:{...CARDS.targetbreaker,name:'Target Breaker+',mark:4,text:'Apply 4 Mark to target.',upgradeOf:'targetbreaker'},
 gauntletsmash_up:{...CARDS.gauntletsmash,name:'Gauntlet Smash+',damage:15,markedDamage:22,text:'Deal 15 damage. If the target is Marked, deal 22 instead.',upgradeOf:'gauntletsmash'},
 deflect_up:{...CARDS.deflect,name:'Deflect+',block:6,text:'Gain 6 Block.',upgradeOf:'deflect'},
 cleave_up:{...CARDS.cleave,name:'Cleave+',damage:11,text:'Deal 11 damage to all enemies.',upgradeOf:'cleave'},
 focus_up:{...CARDS.focus,name:'Focus+',draw:2,text:'Gain 1 Core and draw 2 cards.',upgradeOf:'focus'},
 ironskin_up:{...CARDS.ironskin,name:'Iron Skin+',block:11,text:'Gain 11 Block. Gain 1 Strength this turn.',upgradeOf:'ironskin'},
 seismicpunch_up:{...CARDS.seismicpunch,name:'Seismic Punch+',damage:18,text:'Deal 18 damage. Stun target if you have 10 or more Block.',upgradeOf:'seismicpunch'},
 stonebulwark_up:{...CARDS.stonebulwark,name:'Stone Bulwark+',block:17,text:'Gain 17 Block this turn.',upgradeOf:'stonebulwark'},
 meteor_up:{...CARDS.meteor,name:'Meteor Fragment+',damage:14,text:'Deal 14 damage to a random enemy.',upgradeOf:'meteor'},
 chainlightning_up:{...CARDS.chainlightning,name:'Chain Lightning+',damage:8,splash:5,text:'Deal 8 damage to a target and 5 to every other enemy.',upgradeOf:'chainlightning'},
 shatterarmour_up:{...CARDS.shatterarmour,name:'Armour Break+',damage:7,text:'Remove all of an enemy’s Block, then deal 7 damage.',upgradeOf:'shatterarmour'},
 lifesiphon_up:{...CARDS.lifesiphon,name:'Life Siphon+',damage:11,siphon:4,text:'Deal 11 damage. Heal 4 Vitality if it damages enemy health.',upgradeOf:'lifesiphon'},
 crystalbarrier_up:{...CARDS.crystalbarrier,name:'Crystal Barrier+',block:20,text:'Gain 20 Block. Draw 1 fewer card next turn.',upgradeOf:'crystalbarrier'},
 echocrystal_up:{...CARDS.echocrystal,name:'Echo Crystal+',cost:0,text:'Your next attack card this turn activates twice. Does not stack.',upgradeOf:'echocrystal'},
 gravitywell_up:{...CARDS.gravitywell,name:'Gravity Well+',weaken:4,text:'All enemies deal 4 less attack damage this turn.',upgradeOf:'gravitywell'},
 finishingblow_up:{...CARDS.finishingblow,name:'Finishing Blow+',damage:13,executeDamage:25,text:'Deal 13 damage, or 25 if the target has half its health or less.',upgradeOf:'finishingblow'},
 unstablecore_up:{...CARDS.unstablecore,name:'Unstable Core+',coreDebt:0,text:'Gain 1 Core now with no Core debt next turn.',upgradeOf:'unstablecore'},
 vengefulspirit_up:{...CARDS.vengefulspirit,name:'Vengeful Spirit+',damage:7,revengeDamage:16,text:'Deal 7 damage, or 16 if you lost Vitality during the previous enemy turn.',upgradeOf:'vengefulspirit'},
 warcry_up:{...CARDS.warcry,name:'War Cry+',power:3,text:'Gain 3 Strength for the rest of the battle.',upgradeOf:'warcry'},
 ancientrelic_up:{...CARDS.ancientrelic,name:'Ancient Relic+',cost:0,text:'Randomly gain 10 Block, gain 2 Core, or draw 3 cards.',upgradeOf:'ancientrelic'},
 sovereignbrand_up:{...CARDS.sovereignbrand,name:'Sovereign Brand+',damage:7,mark:3,text:'Deal 7 damage. Apply 3 Mark to target.',upgradeOf:'sovereignbrand'},
 markedforruin_up:{...CARDS.markedforruin,name:'Marked for Ruin+',vulnerable:3,text:'If the target is Marked, apply 3 Vulnerable.',upgradeOf:'markedforruin'},
 unbrokenguard_up:{...CARDS.unbrokenguard,name:'Unbroken Guard+',block:9,markedBonusBlock:5,text:'Gain 9 Block. If the target is Marked, gain 5 additional Block.',upgradeOf:'unbrokenguard'},
 crushingadvance_up:{...CARDS.crushingadvance,name:'Crushing Advance+',damage:13,blockComboDamage:20,text:'Deal 13 damage. If you have 10 or more Block, deal 20 damage and apply 2 Vulnerable.',upgradeOf:'crushingadvance'},
 sovereignimpact_up:{...CARDS.sovereignimpact,name:'Sovereign Impact+',damage:22,consumeMarkDamage:5,text:'Deal 22 damage. Consume all Mark and deal +5 damage per Mark consumed. Exhaust.',upgradeOf:'sovereignimpact'},
 relentless_up:{...CARDS.relentless,name:'Relentless+',cost:0,text:'If you attack a Marked enemy this turn, draw 1 card.',upgradeOf:'relentless'},
 bloodrush_up:{...CARDS.bloodrush,name:'Blood Rush+',strength:3,text:'Gain 3 Strength this turn. If you defeat an enemy this turn, gain 1 Core.',upgradeOf:'bloodrush'},
 shatterarmourkaerun_up:{...CARDS.shatterarmourkaerun,name:'Shatter Armour+',damage:11,removeBlock:4,text:'Deal 11 damage. Remove 4 Block from target. Apply 2 Vulnerable.',upgradeOf:'shatterarmourkaerun'},
 execution_up:{...CARDS.execution,name:'Execution+',damage:18,executeBonus:12,text:'Deal 18 damage. If target is below 50% Health, deal an additional 12 damage.',upgradeOf:'execution'},
 fortressstance_up:{...CARDS.fortressstance,name:'Fortress Stance+',block:13,markedStrength:2,text:'Gain 13 Block. If target is Marked, gain 2 Strength this turn.',upgradeOf:'fortressstance'},
 arcbolt_up:{...CARDS.arcbolt,name:'Arc Bolt+',damage:8,text:'Deal 8 damage. Gain 1 Resonance.',upgradeOf:'arcbolt'},
 crystalguard_up:{...CARDS.crystalguard,name:'Crystal Guard+',block:9,text:'Gain 9 Block. Gain 1 Resonance.',upgradeOf:'crystalguard'},
 corespark_up:{...CARDS.corespark,name:'Core Spark+',resonanceGain:2,text:'Gain 1 Core and 2 Resonance.',upgradeOf:'corespark'},
 resonantstrike_up:{...CARDS.resonantstrike,name:'Resonant Strike+',damage:12,resonanceDamage:4,text:'Deal 12 damage, plus 4 per Resonance. Spend all Resonance.',upgradeOf:'resonantstrike'},
 prismward_up:{...CARDS.prismward,name:'Prism Ward+',block:9,resonanceBarrier:3,text:'Gain 9 Block. Gain 3 next-turn Barrier per Resonance spent.',upgradeOf:'prismward'},
 arcsplit_up:{...CARDS.arcsplit,name:'Arc Split+',damage:6,text:'Deal 6 damage to all enemies. Gain 1 Resonance.',upgradeOf:'arcsplit'},
 prismstudy_up:{...CARDS.prismstudy,name:'Prism Study+',cost:0,text:'Draw 2 cards. Gain 1 Resonance.',upgradeOf:'prismstudy'},
 latticeward_up:{...CARDS.latticeward,name:'Lattice Ward+',block:6,nextBarrier:6,text:'Gain 6 Block and 6 next-turn Barrier. Gain 1 Resonance.',upgradeOf:'latticeward'},
 crystallance_up:{...CARDS.crystallance,name:'Crystal Lance+',damage:9,resonanceDamage:6,text:'Deal 9 damage, plus 6 per Resonance. Spend all Resonance.',upgradeOf:'crystallance'},
 fracturefield_up:{...CARDS.fracturefield,name:'Fracture Field+',damage:8,resonanceDamage:3,text:'Deal 8 damage to all enemies, plus 3 per Resonance. Spend all Resonance.',upgradeOf:'fracturefield'},
 corechannel_up:{...CARDS.corechannel,name:'Core Channel+',draw:2,text:'Draw 2 cards. Gain 2 Resonance.',upgradeOf:'corechannel'},
 resonantmend_up:{...CARDS.resonantmend,name:'Resonant Mend+',block:9,resonanceHeal:3,text:'Gain 9 Block. Heal 3 Vitality per Resonance spent. Exhaust.',upgradeOf:'resonantmend'},
 shieldbash_up:{...CARDS.shieldbash,name:'Shield Bash+',damage:7,block:6,text:'Deal 7 damage and gain 6 Block.',upgradeOf:'shieldbash'},
 starfall_up:{...CARDS.starfall,name:'Starfall+',damage:20,text:'Deal 20 damage to all enemies.',upgradeOf:'starfall'},
 fortify_up:{...CARDS.fortify,name:'Fortify+',block:7,nextBarrier:5,text:'Gain 7 Block and 5 next-turn Barrier.',upgradeOf:'fortify'},
 piercingray_up:{...CARDS.piercingray,name:'Piercing Ray+',damage:14,text:'Remove all of an enemy’s Block, then deal 14 damage.',upgradeOf:'piercingray'},
 suppress_up:{...CARDS.suppress,name:'Suppress+',weak:3,text:'Apply 3 Weak to target.',upgradeOf:'suppress'},
 scout_up:{...CARDS.scout,name:'Scout+',cost:0,text:'Draw 2 cards.',upgradeOf:'scout'},
 ricochet_up:{...CARDS.ricochet,name:'Ricochet+',damage:7,splash:5,text:'Deal 7 damage to target and 5 to all other enemies.',upgradeOf:'ricochet'},
 sundering_up:{...CARDS.sundering,name:'Sundering+',damage:12,vulnerable:3,text:'Deal 12 damage. Apply 3 Vulnerable to target.',upgradeOf:'sundering'}
});
export function upgradeCard(r,i){
 if(r.phase!=='rest'||!Number.isInteger(i)||i<0||i>=r.deck.length)return false;
 const next=CARD_UPGRADES[r.deck[i]];if(!next)return false;
 r.deck[i]=next;return leave(r);
}

export const STARTER=['strike','strike','strike','strike','guard','guard','guard','guard','targetbreaker','gauntletsmash'];
export const ILYRA_STARTER=['arcbolt','arcbolt','arcbolt','crystalguard','crystalguard','crystalguard','corespark','corespark','resonantstrike','prismward'];
export const RELICS={
 amber:{name:'Amber Heart',text:'Heal 4 Vitality after combat.'},
 aegis:{name:'Ivory Aegis',text:'Start each battle with 5 Block.'},
 fist:{name:'Sovereign Seal',text:'+1 Strength every turn.'},
 emberstone:{name:'Emberstone',text:'Your first attack card each battle deals +3 damage.'},
 wayfarer:{name:'Wayfarer’s Compass',text:'Draw 1 extra card on the first turn of each battle.'},
 coreprism:{name:'Core Prism',text:'Start the first turn of each battle with 1 extra Core.'},
 thorncrown:{name:'Crown of Thorns',text:'Deal 2 damage back to each enemy that attacks.'},
 gilded:{name:'Gilded Scarab',text:'Earn 10 extra gold after each battle.'},
 moonchalice:{name:'Moon Chalice',text:'Healing potions restore 28 Vitality instead of 20.'},
 wardstone:{name:'Wardstone',text:'Reduce the first unblocked enemy hit each battle by 3.'},
 hunterlens:{name:'Hunter’s Lens',text:'Your attacks deal +2 damage to Marked enemies.'},
 hourglass:{name:'Dusk Hourglass',text:'Gain 3 Block at the start of every third turn.'}
};
function treasureRoom(r,node){
 const rng={rng:hash(r.seed+':treasure:'+node.id)},bad=random(rng)<0.2;
 if(bad)return {bad:true,kind:['trap','drain','theft'][Math.floor(random(rng)*3)],revealed:false};
 const pool=Object.keys(RELICS).filter(id=>!r.relics.includes(id));
 return {bad:false,relic:pool.length?pool[Math.floor(random(rng)*pool.length)]:null,gold:25+Math.floor(random(rng)*21),revealed:false};
}
function randomRelic(r){const pool=Object.keys(RELICS).filter(id=>!r.relics.includes(id));return pool.length?pool[Math.floor(random(r)*pool.length)]:null;}
function buildRoute(seed,enemyRoster,beastSystem,legacy=false,stage=1){
 seed=normaliseSeed(seed);const state={rng:hash(seed+':route:'+stage)};
 const firstThree=enemyRoster===2?shuffle(INVADERS,state).slice(0,3):null;
 const route=[];const layouts=[['battle','battle','battle'],['battle','mystery','chest'],['shop','battle','mystery'],['battle','elite','battle'],['mystery','battle','chest'],['rest','shop','battle'],['battle','elite','battle'],['chest','mystery','battle'],['battle','elite','battle'],['rest','shop','mystery'],['boss']];
 if(!legacy){
  if(beastSystem===1){layouts[1]=['battle','beast','chest'];layouts[4]=['mystery','beast','battle'];layouts[7]=['chest','beast','battle'];}
  else if(beastSystem===2){const beastRouteState={rng:hash(seed+':beast-route:'+stage)};for(let row=0;row<layouts.length-1;row++){if(random(beastRouteState)<.2){let choices=layouts[row].map((type,col)=>({type,col})).filter(x=>x.type==='battle');if(!choices.length)choices=layouts[row].map((type,col)=>({type,col})).filter(x=>x.type==='mystery');if(!choices.length)choices=layouts[row].map((type,col)=>({type,col}));const pick=choices[Math.floor(random(beastRouteState)*choices.length)];layouts[row][pick.col]='beast';}}}
  else if(beastSystem===3){const beastRouteState={rng:hash(seed+':beast-stage:'+stage)};if(random(beastRouteState)<.6){const row=1+Math.floor(random(beastRouteState)*8);layouts[row]=['beast','beast','beast'];}}
  else{const beastRouteState={rng:hash(seed+':beast-stage:'+stage)};const row=7+Math.floor(random(beastRouteState)*2);const candidates=layouts[row].map((type,col)=>({type,col})).filter(x=>x.type==='battle');const pool=candidates.length?candidates:layouts[row].map((type,col)=>({type,col}));const pick=pool[Math.floor(random(beastRouteState)*pool.length)];layouts[row][pick.col]='beast';}
 }
const beastSpecies=beastSystem>=2?shuffle(Object.keys(BEASTS),{rng:hash(seed+':beast-species:'+stage)}):null;let beastEncounter=0;
 layouts.forEach((types,row)=>{const ordered=shuffle(types,state);ordered.forEach((type,col)=>{const id=`${stage}-${row}-${col}`;let enemy,pack=null;
 if(stage===2&&type==='boss')enemy=structuredClone(STAGE2_BOSS);
 else if(stage===2&&row<10&&['battle','elite'].includes(type)){const species=row===0?STAGE2_INVADERS[col%STAGE2_INVADERS.length]:STAGE2_INVADERS[Math.floor(random(state)*STAGE2_INVADERS.length)];enemy=stage2Variant(species,row,type==='elite');if(type==='battle'&&enemy.size==='small')pack=stage2Partner(seed,id,row,enemy.id);}
 else if(enemyRoster===2&&row<10&&['battle','elite'].includes(type)){const species=row===0?firstThree[col]:INVADERS[Math.floor(random(state)*INVADERS.length)];enemy=invaderVariant(species,row,type==='elite');}
 else{enemy=structuredClone(type==='boss'?BOSS:type==='elite'?LEGACY_ELITES[Math.floor(random(state)*LEGACY_ELITES.length)]:LEGACY_ENEMIES[Math.floor(random(state)*4)]);if(!['boss','elite'].includes(type)){enemy.hp+=4+row*3;enemy.moves=enemy.moves.map(m=>({...m,value:m.kind==='attack'?m.value+1+Math.floor(row/3):m.value}));}}
 if(type==='beast')enemy=createBeastEnemy(seed,id,row,beastSystem>=2?beastSpecies[beastEncounter++%beastSpecies.length]:null,beastSystem>=2,beastSystem>=4,beastSystem>=5?stage:null);enemy.boss=type==='boss';
 if(!pack&&enemyRoster===2&&stage!==2&&type==='battle'&&row<10&&enemy.size==='small')pack=packPartner(seed,id,row,enemy.id);
 route.push(pack?{id,row,col,type,enemy,pack,next:[]}:{id,row,col,type,enemy,next:[]});});});
 for(const n of route)n.next=route.filter(v=>v.row===n.row+1&&(v.type==='boss'||Math.abs(v.col-n.col)<=1)).map(v=>v.id);
 return route;
}
export function createRun(seed,hero='kaerun',options={}){
 if(!HEROES.some(h=>h.id===hero&&h.available))throw Error('This hero is locked.');
 seed=normaliseSeed(seed);const enemyRoster=options.enemyRoster??2,beastSystem=options.beastSystem??5,stage=1;
 const route=buildRoute(seed,enemyRoster,beastSystem,!!options.legacy,stage);const characterLevel=['kaerun','ilyra'].includes(hero)?Math.max(1,Math.min(20,Math.floor(options.characterLevel)||1)):1,levelBonuses=hero==='kaerun'?kaerunBonuses(characterLevel):hero==='ilyra'?ilyraBonuses(characterLevel):{};
 return {starterStats:emptyStarterStats(),eventCorePenalty:0,characterLevel,characterXpEarned:0,characterXpBanked:0,levelBonuses,enemyRoster,beastSystem,beastRoutes:!options.legacy,legacy:!!options.legacy,stage,maxStage:10,stagesCleared:0,shards:{basic:5,refined:0,prismatic:0},seenBeasts:[],capturedBeasts:[],companion:validBeast(options.companion)?{id:options.companion.id,rarity:options.companion.rarity}:null,companionLevel:Math.max(1,Math.min(10,Math.floor(options.companionLevel)||1)),beastXpEarned:0,beastXpBanked:0,captureResult:null,version:VERSION,seed,hero,rng:hash(seed+':combat'),phase:'map',hp:80+(levelBonuses.maxHp||0),maxHp:80+(levelBonuses.maxHp||0),block:0,core:0,index:0,route,current:null,visited:[],deck:options.starterCollection?buildStarterDeck(hero,options.starterLoadout,options.starterCollection,characterLevel,CARDS):[...(hero==='ilyra'?ILYRA_STARTER:STARTER)],gold:60,relics:[],potions:0,blessing:0,curse:0,battle:null,room:null,rewards:[],turns:0,cardsPlayed:0,log:[]};
}
export function continueStage(r){
 if(r.phase!=='stage-complete'||(r.stage||1)>=10)return false;
 r.stage=(r.stage||1)+1;r.stagesCleared=r.stage-1;r.route=buildRoute(r.seed,r.enemyRoster??2,r.beastSystem??5,!!r.legacy,r.stage);r.current=null;r.visited=[];r.index=0;r.phase='map';r.battle=null;r.room=null;r.block=0;r.core=0;r.rewards=[];r.eliteReward=null;r.eliteShardReward=null;r.captureResult=null;return true;
}
export function availableNodes(r){return r.current?r.route.find(n=>n.id===r.current).next:r.route.filter(n=>n.row===0).map(n=>n.id);}
function sampleCards(r,n=3,upgradeChance=0){
 const pool=Object.keys(CARDS).filter(id=>!CARDS[id].upgradeOf&&!['strike','guard'].includes(id)&&(!CARDS[id].kaerun||r.hero==='kaerun')&&(!CARDS[id].ilyra||r.hero==='ilyra'));
 return shuffle(pool,r).slice(0,n).map(id=>CARD_UPGRADES[id]&&random(r)<upgradeChance?CARD_UPGRADES[id]:id);
}
export function chooseNode(r,id){
 if(r.phase!=='map'||(!r.debugUnlockAll&&!availableNodes(r).includes(id)))return false;
 const node=r.route.find(n=>n.id===id);r.current=id;r.visited.push(id);r.index=node.row;r.room=null;
 if(['battle','elite','boss','beast'].includes(node.type)){startBattle(r,node);return true;}
 r.phase=node.type;
 if(node.type==='chest')r.room=treasureRoom(r,node);
 if(node.type==='mystery')r.room=mysteryRoom(r,node);
 if(node.type==='shop')r.room={stock:sampleCards(r).map(id=>({kind:'card',id,price:35+CARDS[id].cost*10,sold:false})).concat([{kind:'potion',price:25,sold:false},{kind:'relic',id:randomRelic(r),price:85,sold:false},...Object.entries(SHARDS).map(([id,s])=>({kind:'shard',id,price:s.price,quantity:s.quantity,sold:false}))]).filter(x=>x.kind!=='relic'||x.id)};
 return true;
}
export function enterBattle(r){const id=availableNodes(r).find(id=>['battle','elite','boss'].includes(r.route.find(n=>n.id===id).type));return id?chooseNode(r,id):false;}
function bossPhase(r){
 const prime=r.battle?.enemies.find(e=>e.id==='kharvex_prime'&&e.hp>0);
 if(prime&&prime.phase!==2&&prime.hp<=prime.maxHp/2){prime.phase=2;prime.pendingMoves=structuredClone(KHARVEX_ENRAGED_MOVES);log(r,'Kharvex Prime enrages! Stronger attacks begin after its announced action; its plating weakens.');return true;}
 const b=r.battle,boss=b?.enemies.find(e=>e.boss&&e.hp>0);if(!boss||boss.id!=='warden'||boss.phase===2||boss.hp>boss.maxHp/2)return false;
 boss.phase=2;boss.moves=[{kind:'attack',value:15,name:'Void Claw'},{kind:'guard',value:14,name:'Rift Shield'},{kind:'attack',value:8,hits:2,name:'Twin Slash'},{kind:'charge',value:0,name:'Rift Charge'},{kind:'attack',value:28,name:'Rift Breaker'}];boss.move=0;boss.block=Math.max(boss.block||0,12);
 const species=INVADERS.find(x=>x.id==='rift_skitter'),minion=invaderVariant(species,4);minion.hp=minion.maxHp=18;minion.name='Riftbound Skitter';minion.riftBond=true;minion.block=0;minion.move=0;minion.mark=0;minion.weak=0;minion.vulnerable=0;minion.bleed=0;minion.strength=0;minion.stunned=false;b.enemies.push(minion);log(r,'The Gate Warden tears open the rift! A Riftbound Skitter emerges. Rift Bond empowers the Warden while it lives.');return true;
}
function startBattle(r,node){
 r.captureResult=null;if(node.enemy.beast)addDiscovery(r.seenBeasts,{id:node.enemy.beast,rarity:node.enemy.rarity});
 const enemies=[structuredClone(node.enemy)];if(node.pack)enemies.push(structuredClone(node.pack));if(r.enemyRoster!==2&&[3,6,8].includes(node.row)&&node.type==='battle'&&node.col===1){const add=structuredClone(LEGACY_ENEMIES[0]);add.hp=16+node.row;enemies.push(add);}
 const es=enemies.map(e=>({...e,maxHp:e.hp,block:0,move:e.boss?0:Math.floor(random(r)*e.moves.length),mark:0,weak:0,vulnerable:0,bleed:0,strength:0,stunned:false,stunGuard:0}));
 r.phase='combat';r.battle={enemies:es,target:0,draw:shuffle(r.deck,r),hand:[],discard:[],exhaust:[],retained:[],turn:0,strength:0,power:0,relentless:0,bloodRush:false,weak:0,vulnerable:0,bleed:0,barrier:0,resonance:r.hero==='ilyra'?(r.levelBonuses?.startingResonance||0):0,pressureUsed:false,markAppliedThisTurn:false,sovereignUsed:false,resonanceSpentThisTurn:false,stunned:false,echo:false,weaken:0,drawPenalty:0,coreDebt:0,hurtLastTurn:false,firstAttack:true,wardUsed:false,companionCooldown:0,companionUses:0,companionBoost:0};r.log=[`${node.enemy.name} bars your path.`];startTurn(r);if(r.relics.includes('aegis'))r.block+=5;
}
function draw(r,n){const b=r.battle;for(let i=0;i<n;i++){if(!b.draw.length){b.draw=shuffle(b.discard,r);b.discard=[];}if(!b.draw.length)break;b.hand.push(b.draw.pop());}}
function startTurn(r){
 const b=r.battle;b.companionCooldown=Math.max(0,(b.companionCooldown||0)-1);b.companionBoost=0;r.block=b.barrier||0;b.barrier=0;if(b.bleed>0){emitFeedback(r,{kind:'hit',source:'player',target:'player',damage:Math.min(r.hp,b.bleed),blocked:0});r.hp=Math.max(0,r.hp-b.bleed);b.bleed=Math.max(0,b.bleed-1);}if(!r.hp){r.phase='lost';r.core=0;return;}if(b.retained?.length){b.hand.push(...b.retained);b.retained=[];}r.core=Math.min(MAX_CORE,(r.core||0)+CORE_REGEN);b.strength=(r.relics.includes('fist')?1:0)+r.blessing+(b.power||0);b.echo=false;b.weaken=0;b.pressureUsed=false;b.markAppliedThisTurn=false;b.resonanceSpentThisTurn=false;b.turn++;r.turns++;
 let count=Math.max(0,5-(b.drawPenalty||0));b.drawPenalty=0;
 if(b.turn===1){if(r.eventCorePenalty>0){b.eventCoreDrain=1;r.eventCorePenalty--;}if(r.relics.includes('wayfarer'))count++;if(r.relics.includes('coreprism'))r.core=Math.min(MAX_CORE,r.core+1);if(['kaerun','ilyra'].includes(r.hero)){r.core=Math.min(MAX_CORE,r.core+(r.levelBonuses?.startingCore||0));count+=r.levelBonuses?.firstTurnDraw||0;if(r.hero==='ilyra')b.barrier=(b.barrier||0)+(r.levelBonuses?.startingBarrier||0);}}
 if(r.relics.includes('hourglass')&&b.turn%3===0)r.block+=3;if(r.hero==='kaerun')r.block+=r.levelBonuses?.turnBlock||0;
 r.core=Math.max(0,r.core-(b.coreDebt||0)-(b.turn===1?(b.eventCoreDrain||0):0));b.coreDebt=0;
 if(r.curse>0){r.core=Math.max(0,r.core-1);r.curse--;}
 draw(r,count);
}
export function intent(r,index=r.battle?.target??0){
 const e=r.battle?.enemies[index];if(!e)return null;if(e.stunned)return {kind:'stun',value:0};
 const m=e.moves[e.move%e.moves.length];if(m.kind==='heal'&&(e.healUses||0)>=2)return {kind:'charge',value:0};const bond=e.boss&&r.battle.enemies.some(x=>x.riftBond&&x.hp>0)?3:0;return ['attack','siphon'].includes(m.kind)?{...m,value:Math.max(0,Math.floor((m.value+(e.strength||0)+bond-(r.battle.weaken||0))*(e.weak>0?.75:1)*(r.battle.vulnerable>0?1.5:1)))}:m;
}
function log(r,text){r.log=[...r.log.slice(-5),text];}
export function selectTarget(r,i){if(r.phase!=='combat'||!Number.isInteger(i)||!r.battle.enemies[i]?.hp)return false;r.battle.target=i;return true;}
function victory(r){
 const b=r.battle;if(!b.enemies.every(e=>e.hp===0))return false;
 const node=r.route.find(n=>n.id===r.current),elite=node.type==='elite'||!!b.eventTrial,boss=node.type==='boss';if(validBeast(r.companion))r.beastXpEarned=(r.beastXpEarned||0)+(BEAST_XP_REWARDS[b.eventTrial?'elite':node.type]||0);const gold=(boss?90:elite?60:30)+(b.eventTrial?25:0)+(r.relics.includes('gilded')?10:0);r.gold+=gold;r.lastCombatGold=gold;r.trialUpgradePending=!!b.eventTrial;if(r.hero==='kaerun'){r.characterXpEarned=(r.characterXpEarned||0)+kaerunXpForEncounter(b.eventTrial?'elite':node.type);if(elite)r.hp=Math.min(r.maxHp,r.hp+(r.levelBonuses?.eliteHeal||0));}else if(r.hero==='ilyra')r.characterXpEarned=(r.characterXpEarned||0)+ilyraXpForEncounter(b.eventTrial?'elite':node.type);r.hp=Math.min(r.maxHp,r.hp+(r.relics.includes('amber')?4:0));r.core=0;if(boss)r.hp=Math.min(r.maxHp,r.hp+Math.round(r.maxHp*.25));
 if(elite){const relic=randomRelic(r);if(relic)r.relics.push(relic);r.eliteReward=relic;const shardRoll=random(r);const shard=shardRoll<.10?'prismatic':shardRoll<.35?'refined':shardRoll<.85?'basic':null;if(shard)r.shards[shard]++;r.eliteShardReward=shard;}else{r.eliteReward=null;r.eliteShardReward=null;}r.phase=node.type==='boss'?((r.stage||1)>=10?'won':'stage-complete'):'victory';r.rewards=sampleCards(r,3,elite?.20:.10);log(r,`Victory! Gained ${gold} gold${elite&&r.eliteReward?` and ${RELICS[r.eliteReward].name}`:''}${elite&&r.eliteShardReward?`, plus 1 ${SHARDS[r.eliteShardReward].name}`:''}.`);return true;
}
function hitEnemy(r,e,base,multiplier=1){const b=r.battle,weakMult=b.weak>0?.75:1,vulnMult=e.vulnerable>0?1.5:1,raw=Math.max(0,Math.floor((base+b.strength+(r.relics.includes('hunterlens')&&e.mark>0?2:0))*multiplier*weakMult*vulnMult)),blocked=Math.min(e.block,raw);e.block-=blocked;const damage=Math.min(e.hp,raw-blocked);e.hp-=damage;emitFeedback(r,{kind:'hit',source:'player',target:'enemy:'+b.enemies.indexOf(e),damage,blocked,blockBreak:blocked>0&&e.block===0,heavy:raw>=18});return damage;}
export function playCard(r,i){
 if(r.phase!=='combat'||!Number.isInteger(i)||i<0)return false;
 const b=r.battle,id=b.hand[i],c=CARDS[id],selected=b.enemies[b.target];
 if(!c||c.cost>r.core||!selected?.hp||(c.requiresMark&&(selected.mark||0)<=0))return false;
 const markedBefore=(selected.mark||0)>0,selectedAliveBefore=selected.hp>0;
 const challengeBefore=b.enemies.map(e=>({hp:e.hp,mark:e.mark||0})),barrierBefore=b.barrier||0;
 r.core-=c.cost;r.cardsPlayed++;b.hand.splice(i,1);
 if(c.coreGain)r.core=Math.min(MAX_CORE,r.core+c.coreGain);if(c.block)r.block+=c.block;if(c.nextBarrier)b.barrier=(b.barrier||0)+c.nextBarrier;if(c.markedBonusBlock&&(selected.mark||0)>0)r.block+=c.markedBonusBlock;if(c.strength)b.strength+=c.strength;if(c.markedStrength&&(selected.mark||0)>0)b.strength+=c.markedStrength;if(c.draw)draw(r,c.draw);
 if(c.resonanceGain)b.resonance=Math.min(r.hero==='ilyra'?(r.levelBonuses?.resonanceCap||3):3,(b.resonance||0)+c.resonanceGain);
 const spentResonance=c.resonanceDamage||c.resonanceBarrier||c.resonanceHeal?b.resonance||0:0;if(spentResonance){b.resonance=0;if(r.hero==='ilyra'&&!b.resonanceSpentThisTurn){b.barrier=(b.barrier||0)+(r.levelBonuses?.spendBarrier||0);b.resonanceSpentThisTurn=true;}}
 if(c.resonanceBarrier)b.barrier=(b.barrier||0)+spentResonance*c.resonanceBarrier;if(c.resonanceHeal)r.hp=Math.min(r.maxHp,r.hp+spentResonance*c.resonanceHeal);
 if(c.drawPenalty)b.drawPenalty=(b.drawPenalty||0)+c.drawPenalty;if(c.coreDebt)b.coreDebt=(b.coreDebt||0)+c.coreDebt;if(c.power){b.power=(b.power||0)+c.power;b.strength+=c.power;}if(c.echo)b.echo=true;if(c.weaken)b.weaken=(b.weaken||0)+c.weaken;if(c.relentless)b.relentless=(b.relentless||0)+1;if(c.bloodRush)b.bloodRush=true;
 let detail='';if(c.fortune){const roll=Math.floor(random(r)*3);if(roll===0){r.block+=10;detail='Gained 10 Block.';}else if(roll===1){r.core=Math.min(MAX_CORE,r.core+2);detail='Gained 2 Core.';}else{draw(r,3);detail='Drew 3 cards.';}}
 if(c.damage){
  const companionMultiplier=1+(b.companionBoost||0)/100;b.companionBoost=0;const repetitions=b.echo?2:1;b.echo=false;const firstBonus=b.firstAttack&&r.relics.includes('emberstone')?3:0;b.firstAttack=false;
  for(let n=0;n<repetitions;n++){const living=b.enemies.filter(e=>e.hp>0);if(!living.length)break;const target=c.randomTarget?living[Math.floor(random(r)*living.length)]:selected;if(!target?.hp&&!c.all&&!c.splash)break;
   for(const foe of c.all?living:c.splash?living:[target]){if(r.hero==='kaerun'&&(foe.mark||0)>0&&!b.pressureUsed){r.block+=3+(r.levelBonuses?.markedAttackBlock||0);b.pressureUsed=true;}
    let base=c.splash&&foe!==target?c.splash:c.damage;if(c.resonanceDamage)base+=spentResonance*c.resonanceDamage;if(c.blockComboDamage&&r.block>=10)base=c.blockComboDamage;if(c.executeBonus&&foe.hp<foe.maxHp/2)base+=c.executeBonus;if(c.consumeMarkDamage&&foe===target){base+=c.consumeMarkDamage*(foe.mark||0);foe.mark=0;}if(c.removeBlock)foe.block=Math.max(0,foe.block-c.removeBlock);if(c.markedDamage&&(foe.mark||0)>0)base=c.markedDamage;if(c.executeDamage&&foe.hp<=foe.maxHp/2)base=c.executeDamage;if(c.revengeDamage&&b.hurtLastTurn)base=c.revengeDamage;if(c.shatter)foe.block=0;
    const damage=hitEnemy(r,foe,base+firstBonus,companionMultiplier);if(c.siphon&&damage>0)r.hp=Math.min(r.maxHp,r.hp+c.siphon);if(c.stun&&r.block>=10){if(!foe.boss||!foe.stunGuard){foe.stunned=true;if(foe.boss)foe.stunGuard=1;}}
   }
  }
 }
 if(c.mark){let mark=c.mark;if(r.hero==='kaerun'){if(!b.markAppliedThisTurn){r.block+=r.levelBonuses?.markBlock||0;b.markAppliedThisTurn=true;}if(r.levelBonuses?.sovereign&&!b.sovereignUsed){mark++;r.core=Math.min(MAX_CORE,r.core+1);b.sovereignUsed=true;}}selected.mark=(selected.mark||0)+mark;}
 if(c.blockComboVulnerable&&r.block>=10)selected.vulnerable=(selected.vulnerable||0)+c.blockComboVulnerable;if(markedBefore&&b.relentless>0){draw(r,b.relentless);b.relentless=0;}if(selectedAliveBefore&&!selected.hp&&b.bloodRush){r.core=Math.min(MAX_CORE,r.core+1);b.bloodRush=false;}
 if(!r.starterStats)r.starterStats=emptyStarterStats();
 if(r.hero==='kaerun'){if(c.mark&&selected.hp>0)r.starterStats.marksApplied++;r.starterStats.markedKills+=b.enemies.filter((e,index)=>challengeBefore[index]?.hp>0&&challengeBefore[index].mark>0&&e.hp===0).length;}
 if(r.hero==='ilyra'){r.starterStats.resonanceSpent+=spentResonance;r.starterStats.barrierCreated+=Math.max(0,(b.barrier||0)-barrierBefore)+(c.barrier||0);if(spentResonance&&c.damage)r.starterStats.resonanceKills+=b.enemies.filter((e,index)=>challengeBefore[index]?.hp>0&&e.hp===0).length;}
 bossPhase(r);if(c.weak)selected.weak=(selected.weak||0)+c.weak;if(c.vulnerable)selected.vulnerable=(selected.vulnerable||0)+c.vulnerable;if(c.bleed)selected.bleed=(selected.bleed||0)+c.bleed;if(c.barrier)b.barrier=(b.barrier||0)+c.barrier;if(c.retain)b.retained.push(id);else if(c.exhaust)b.exhaust.push(id);else b.discard.push(id);log(r,`${c.name}: ${detail||c.text}`);if(!selected.hp)b.target=b.enemies.findIndex(e=>e.hp>0);victory(r);return true;
}
export function endTurn(r){
 if(r.phase!=='combat')return false;const b=r.battle;const keep=b.hand.filter(id=>CARDS[id]?.retain),toss=b.hand.filter(id=>!CARDS[id]?.retain);b.retained.push(...keep);b.discard.push(...toss);b.hand=[];b.hurtLastTurn=false;if(b.stunned){b.stunned=false;startTurn(r);log(r,'Stunned — enemy turn skipped.');return true;}
 for(const e of b.enemies.filter(e=>e.hp>0)){
  e.block=0;if(e.bleed>0){emitFeedback(r,{kind:'hit',source:'enemy:'+b.enemies.indexOf(e),target:'enemy:'+b.enemies.indexOf(e),damage:Math.min(e.hp,e.bleed),blocked:0});e.hp=Math.max(0,e.hp-e.bleed);e.bleed=Math.max(0,e.bleed-1);if(!e.hp)continue;}if(e.stunned){e.stunned=false;continue;}if(e.boss&&e.stunGuard)e.stunGuard=Math.max(0,e.stunGuard-1);const m=e.moves[e.move%e.moves.length];
  if(['attack','siphon'].includes(m.kind)){const bond=e.boss&&b.enemies.some(x=>x.riftBond&&x.hp>0)?3:0,hits=m.hits||1;for(let h=0;h<hits;h++){const incoming=Math.max(0,Math.floor((m.value+(e.strength||0)+bond-(b.weaken||0))*(e.weak>0?.75:1)*(b.vulnerable>0?1.5:1))),blocked=Math.min(r.block,incoming);r.block-=blocked;if(r.hero==='kaerun'){r.starterStats??=emptyStarterStats();r.starterStats.blockedDamage+=blocked;}let damage=incoming-blocked;if(damage>0&&r.relics.includes('wardstone')&&!b.wardUsed){damage=Math.max(0,damage-3);b.wardUsed=true;}if(damage>0)b.hurtLastTurn=true;const dealt=Math.min(r.hp,damage);r.hp=Math.max(0,r.hp-damage);emitFeedback(r,{kind:'hit',source:'enemy:'+b.enemies.indexOf(e),target:'player',damage:dealt,blocked,blockBreak:blocked>0&&r.block===0,heavy:incoming>=18});if(m.kind==='siphon'&&damage>0)e.hp=Math.min(e.maxHp,e.hp+3);if(r.relics.includes('thorncrown')){const thornBlocked=Math.min(e.block,2);e.block-=thornBlocked;e.hp=Math.max(0,e.hp-2+thornBlocked);}if(!r.hp)break;}}
  if(m.kind==='empower'){const ally=e.id==='duskcaller'?b.enemies.find(other=>other!==e&&other.hp>0):null;(ally||e).strength=((ally||e).strength||0)+m.value;}if(m.kind==='weaken')b.weak=(b.weak||0)+m.value;if(m.kind==='heal'&&(e.healUses||0)<2){e.hp=Math.min(e.maxHp,e.hp+m.value);e.healUses=(e.healUses||0)+1;}if(m.kind==='guard'){e.block=m.value;emitFeedback(r,{kind:'guard',target:'enemy:'+b.enemies.indexOf(e),text:'+'+m.value+' Block'});}
  if(m.expose&&e.hp>0){e.block=0;e.vulnerable=Math.max(e.vulnerable||0,2);log(r,'Kharvex Prime is exposed! Deal 50% more damage during its recovery turn.');}
  if(e.pendingMoves){e.moves=e.pendingMoves;delete e.pendingMoves;}
  e.move=e.balanceLegacyAction?0:(e.move+1)%e.moves.length;delete e.balanceLegacyAction;e.mark=Math.max(0,e.mark-1);e.weak=Math.max(0,(e.weak||0)-1);e.vulnerable=Math.max(0,(e.vulnerable||0)-1);if(!r.hp){r.phase='lost';r.core=0;return true;}
 }
 b.weak=Math.max(0,(b.weak||0)-1);b.vulnerable=Math.max(0,(b.vulnerable||0)-1);if(victory(r))return true;if(b.enemies.some(e=>e.id==='kharvex_prime'))bossPhase(r);if(!b.enemies[b.target]?.hp)b.target=b.enemies.findIndex(e=>e.hp>0);startTurn(r);log(r,'Your turn. Choose a card.');return true;
}
function leave(r){r.phase='map';r.battle=null;r.room=null;r.block=0;r.rewards=[];r.eliteReward=null;return true;}
export function advance(r,card=null){
 if(r.phase!=='victory'||(card!==null&&!r.rewards.includes(card)))return false;
 if(card)r.deck.push(card);
 if(r.trialUpgradePending&&r.deck.some(id=>CARD_UPGRADES[id])){
  r.trialUpgradePending=false;r.phase='mystery';r.battle=null;r.block=0;r.rewards=[];r.room={eventVersion:1,eventId:'trial',kind:'trial',step:'upgrade',cards:[],result:null};return true;
 }
 delete r.trialUpgradePending;return leave(r);
}
export function resolveRoom(r,choice){
 if(r.phase==='mystery'&&r.room?.eventVersion===1)return resolveMystery(r,choice);
 if(r.phase==='chest'){
  if(choice==='leave'&&r.room.revealed)return leave(r);if(!['open','claim'].includes(choice)||r.room.revealed)return false;const t=r.room;t.revealed=true;
  if(t.bad){if(t.kind==='trap'){const loss=Math.min(8,Math.max(0,r.hp-1));r.hp-=loss;t.result=`A concealed trap! Lost ${loss} Vitality. The chest is empty.`;}if(t.kind==='drain'){r.curse+=2;t.result='A cursed crystal drains your Core. Start your next two turns with 1 less Core. No treasure.';}if(t.kind==='theft'){const loss=Math.min(25,r.gold);r.gold-=loss;t.result=`A void snare swallowed ${loss} gold. No treasure.`;}}
  else{if(t.relic)r.relics.push(t.relic);r.gold+=t.gold;r.potions++;t.result=`Gained ${t.gold} gold, a healing potion${t.relic?' and '+RELICS[t.relic].name:''}.`;}return true;
 }
 if(r.phase==='rest'&&choice==='rest'){r.hp=Math.min(r.maxHp,r.hp+24);return leave(r);}if(r.phase==='shop'&&choice==='leave')return leave(r);if(r.phase!=='mystery')return false;if(choice==='leave')return leave(r);
 if(r.room.kind==='cache'&&r.room.cards.includes(choice)){r.deck.push(choice);return leave(r);}if(r.room.kind==='shrine'&&choice==='accept'&&r.hp>8){r.hp-=8;r.blessing++;return leave(r);}if(r.room.kind==='rift'&&choice==='accept'){r.deck.push(r.room.cards[0]);r.gold+=45;r.curse+=2;return leave(r);}return false;
}
export function shopUpgradeCard(r,i,price=75){
 if(r.phase!=='shop'||!Number.isInteger(i)||i<0||i>=r.deck.length||r.gold<price)return false;
 const next=CARD_UPGRADES[r.deck[i]];if(!next)return false;
 r.gold-=price;r.deck[i]=next;return true;
}
export function buy(r,i){if(r.phase!=='shop'||!Number.isInteger(i))return false;const x=r.room.stock[i];if(!x||x.sold||r.gold<x.price)return false;r.gold-=x.price;x.sold=true;if(x.kind==='card')r.deck.push(x.id);if(x.kind==='potion')r.potions++;if(x.kind==='shard')r.shards[x.id]+=x.quantity;if(x.kind==='relic')r.relics.push(x.id);return true;}
export function sell(r,kind,i){if(r.phase!=='shop')return false;if(kind==='potion'&&r.potions>0){r.potions--;r.gold+=12;return true;}if(kind==='card'&&Number.isInteger(i)&&r.deck[i]&&r.deck.length>5){r.deck.splice(i,1);r.gold+=10;return true;}return false;}
export function usePotion(r){if(!['combat','map'].includes(r.phase)||r.potions<1||r.hp>=r.maxHp)return false;r.potions--;r.hp=Math.min(r.maxHp,r.hp+(r.relics.includes('moonchalice')?28:20));return true;}
export function serialise(r){return JSON.stringify(r);}
export function restore(raw){try{
 const r=JSON.parse(raw),int=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
 if(!r||!COMPATIBLE_VERSIONS.has(r.version)||typeof r.seed!=='string'||r.seed!==normaliseSeed(r.seed)||!HEROES.some(h=>h.id===r.hero&&h.available))return null;
 // Preserve active ascents across content updates. Missing additive fields are migrated below instead of invalidating the whole run.
 r.version=VERSION;
 const characterLevel=r.characterLevel??1;
 if(!int(characterLevel,1,20))return null;
 const expectedMaxHp=80+(r.hero==='ilyra'?ilyraBonuses(characterLevel):kaerunBonuses(characterLevel)).maxHp;
 if(!['map','combat','victory','stage-complete','won','lost','shop','chest','mystery','rest'].includes(r.phase)||!int(r.rng,0,4294967295)||!int(r.hp,0,expectedMaxHp)||r.maxHp!==expectedMaxHp||!int(r.gold,0,100000)||!int(r.potions,0,1000)||!int(r.core,0,MAX_CORE)||!int(r.block,0,999)||!int(r.blessing,0,20)||!int(r.curse,0,20))return null;
 r.characterLevel=characterLevel;
 r.starterStats??=emptyStarterStats();if(!STARTER_STAT_KEYS.every(k=>int(r.starterStats[k],0,100000000)))return null;
 if(r.starterRunId!==undefined&&(typeof r.starterRunId!=='string'||r.starterRunId.length>100))return null;
 r.eventCorePenalty??=0;if(!int(r.eventCorePenalty,0,100))return null;
 if(r.room?.eventVersion===1&&(!Object.hasOwn(MYSTERY_EVENTS,r.room.eventId)||!['offer','upgrade'].includes(r.room.step)||!Array.isArray(r.room.cards)||r.room.cards.some(id=>!CARDS[id])||(r.room.relic&&!RELICS[r.room.relic])))return null;
 const stage=r.stage??1;if(!int(stage,1,10))return null;r.stage=stage;r.maxStage=10;r.stagesCleared??=Math.max(0,stage-1);const expectedRoute=buildRoute(r.seed,r.enemyRoster??1,r.beastSystem??1,!r.beastRoutes,stage);const staleStage2=stage===2&&Array.isArray(r.route)&&r.route.some(n=>['battle','elite','boss'].includes(n?.type)&&n?.enemy&&!n.enemy.stage2&&!n.enemy.beast);if(staleStage2){r.route=expectedRoute;r.visited=[];r.current=null;r.index=0;r.phase='map';r.battle=null;r.room=null;r.block=0;r.core=0;r.rewards=[];r.eliteReward=null;r.eliteShardReward=null;r.captureResult=null;}if(!Array.isArray(r.route)||!r.route.length||!Array.isArray(r.deck)||r.deck.length<5||r.deck.length>100||r.deck.some(c=>!Object.hasOwn(CARDS,c))||!Array.isArray(r.relics)||r.relics.some(id=>!Object.hasOwn(RELICS,id)))return null;
 if(!Array.isArray(r.visited)||r.visited.length>11)return null;let prev=null;for(const id of r.visited){const n=r.route.find(n=>n.id===id);if(!n||(prev?!prev.next.includes(id):n.row!==0))return null;prev=n;}if(r.current!==(prev?.id??null))return null;
 if(!Array.isArray(r.log)||r.log.some(x=>typeof x!=='string'||x.length>300)||!Array.isArray(r.rewards)||r.rewards.some(x=>!CARDS[x]))return null;
 if(['combat','victory','stage-complete','won','lost'].includes(r.phase)){const b=r.battle;if(!b||!Array.isArray(b.enemies)||!b.enemies.length||b.enemies.some(e=>!int(e.hp,0,e.maxHp)||!Array.isArray(e.moves))||!['draw','hand','discard'].every(k=>Array.isArray(b[k])&&b[k].every(c=>Object.hasOwn(CARDS,c))))return null;b.exhaust??=[];b.retained??=[];if(JSON.stringify([...b.draw,...b.hand,...b.discard,...b.exhaust,...b.retained].sort())!==JSON.stringify([...r.deck].sort()))return null;if(r.phase==='combat'&&(!r.hp||!b.enemies[b.target]?.hp))return null;}
 if(['shop','chest','mystery'].includes(r.phase)&&!r.room)return null;if(r.phase==='shop'&&(!Array.isArray(r.room.stock)||r.room.stock.some(x=>!int(x.price,0,1000)||!['card','potion','relic','shard'].includes(x.kind)||(x.kind==='card'&&!CARDS[x.id])||(x.kind==='relic'&&!RELICS[x.id])||(x.kind==='shard'&&(!Object.hasOwn(SHARDS,x.id)||x.quantity!==SHARDS[x.id].quantity)))))return null;
 if(r.battle){const b=r.battle;b.exhaust??=[];b.retained??=[];b.relentless??=0;b.bloodRush??=false;b.weak??=0;b.vulnerable??=0;b.bleed??=0;b.barrier??=0;b.resonance??=0;if(!int(b.resonance,0,r.hero==='ilyra'?(r.levelBonuses?.resonanceCap||3):3))return null;b.pressureUsed??=false;if(typeof b.pressureUsed!=='boolean')return null;b.stunned??=false;b.enemies.forEach(e=>{e.weak??=0;e.vulnerable??=0;e.bleed??=0;e.strength??=0;});b.power??=0;b.echo??=false;b.weaken??=0;b.drawPenalty??=0;b.coreDebt??=0;b.hurtLastTurn??=false;b.firstAttack??=false;b.wardUsed??=false;}
 r.enemyRoster??=1;if(![1,2].includes(r.enemyRoster))return null;r.beastSystem??=1;if(![1,2,3,4,5].includes(r.beastSystem))return null;
 r.shards??={basic:5,refined:0,prismatic:0};r.seenBeasts??=[];r.capturedBeasts??=[];r.companion??=null;r.captureResult??=null;r.beastRoutes??=false;
 if(!Object.keys(SHARDS).every(id=>int(r.shards[id],0,1000))||![r.seenBeasts,r.capturedBeasts].every(a=>Array.isArray(a)&&a.length<=12&&a.every(validBeast))||(r.companion!==null&&!validBeast(r.companion)))return null;
 if(r.battle){const b=r.battle;b.companionCooldown??=0;b.companionUses??=0;b.companionBoost??=0;if(!int(b.companionCooldown,0,4)||!int(b.companionUses,0,10000)||![0,25,40,50].includes(b.companionBoost))return null;
 for(const e of b.enemies)if(e.beast&&(!validBeast({id:e.beast,rarity:e.rarity})||!int(e.healUses||0,0,2)))return null;}
 const refreshStage2Art=e=>{if(!e?.stage2||e.boss||e.beast)return;const species=STAGE2_INVADERS.find(x=>x.id===e.id);if(!species)return;e.name=(e.elite?'Elite ':'')+species.name;e.art=species.art;e.colour=species.colour;e.moves?.forEach((m,i)=>{if(species.moves[i])m.name=species.moves[i].name;});};
 r.route.forEach(n=>{refreshStage2Art(n.enemy);refreshStage2Art(n.pack);});r.battle?.enemies?.forEach(refreshStage2Art);
 // Update upcoming encounters without healing enemies or changing announced actions in an active battle.
 if(r.stage===2)for(const node of r.route){if(r.visited.includes(node.id)||node.enemy?.balanceRevision===2)continue;if(node.type==='boss')node.enemy=structuredClone(STAGE2_BOSS);else if(['battle','elite'].includes(node.type)){const species=STAGE2_INVADERS.find(s=>s.id===node.enemy?.id);if(species)node.enemy=stage2Variant(species,node.row,node.type==='elite');if(node.pack){const partner=STAGE2_INVADERS.find(s=>s.id===node.pack.id);if(partner)node.pack=stage2Variant(partner,node.row);}}}
 const prime=r.battle?.enemies.find(e=>e.id==='kharvex_prime'&&e.hp>0);
 if(prime&&prime.balanceRevision!==2){prime.balanceRevision=2;const next=structuredClone(prime.phase===2?KHARVEX_ENRAGED_MOVES:KHARVEX_MOVES),announced=prime.moves[prime.move%prime.moves.length];prime.moves=[structuredClone(announced),...next];prime.move=0;prime.pendingMoves=next;prime.balanceLegacyAction=true;}
 return r;
 }catch{return null;}}

// Use an independent seeded stream so ordinary encounters retain their established randomness.
const STAGE_BEAST_RARITY=[[100,0,0],[88,12,0],[78,20,2],[70,26,4],[62,32,6],[54,38,8],[47,43,10],[40,47,13],[34,50,16],[28,52,20]];
function createBeastEnemy(seed,nodeId,row,forcedId=null,tough=false,stronger=false,stage=null){
 const state={rng:hash(seed+':beast:'+nodeId)},ids=Object.keys(BEASTS),rolledId=ids[Math.floor(random(state)*ids.length)],id=forcedId||rolledId,roll=random(state)*100;
 const [common,rare]=stage===null?[65,28]:STAGE_BEAST_RARITY[stage-1];
 const rarity=roll<common?'common':roll<common+rare?'rare':'legendary',b=BEASTS[id],s=RARITIES[rarity];
 if(!tough)return {id,beast:id,rarity,name:b.name,hp:Math.round((b.hp+row*3)*s.hp),colour:b.colour,healUses:0,moves:b.moves.map(m=>({...m,value:Math.round((m.value+(m.kind==='attack'?Math.floor(row/3):0))*(m.kind==='attack'?s.attack:m.kind==='heal'?s.heal/6:1))}))};
 const harder=stronger?1.12:1;
 const hp=Math.round((b.hp+10+row*4)*s.hp*1.35*harder);
 const moves=b.moves.map(m=>{let value=m.value;if(m.kind==='attack')value=Math.round((m.value+3+Math.floor(row/2))*s.attack*1.25*harder);else if(m.kind==='guard')value=Math.round(m.value*1.3*harder);else if(m.kind==='heal')value=Math.round(m.value*(s.heal/6)*1.25);else if(m.kind==='empower')value=m.value+1;return {...m,value};});
 return {id,beast:id,rarity,name:b.name,hp,colour:b.colour,healUses:0,moves};
}
export function captureChance(r,shard='basic',index=r.battle?.target??0){
 const e=r.battle?.enemies[index];if(r.phase!=='combat'||!e?.hp||!e.beast||!Object.hasOwn(SHARDS,shard)||!Object.hasOwn(RARITIES,e.rarity))return 0;
 const s=RARITIES[e.rarity],weakening=Math.min(1,Math.max(0,(1-e.hp/e.maxHp)/.75));
 return Math.round(Math.min(.9,(s.floor+(s.capture-s.floor)*weakening)*SHARDS[shard].multiplier)*100);
}
export function captureBeast(r,shard='basic'){
 const chance=captureChance(r,shard);if(!chance||r.core<1||!(r.shards?.[shard]>0))return false;
 const e=r.battle.enemies[r.battle.target];r.core--;r.shards[shard]--;
 const caught=random(r)*100<chance;
 const duplicate=!!r.capturedBeasts?.some(x=>beastKey(x)===beastKey({id:e.beast,rarity:e.rarity})),duplicateXp=duplicate?(e.rarity==='legendary'?100:e.rarity==='rare'?65:40):0;r.captureResult={id:e.beast,rarity:e.rarity,caught,chance,duplicate,duplicateXp};if(caught&&duplicateXp)r.beastDuplicateXp=(r.beastDuplicateXp||0)+duplicateXp;
 if(caught){if(['kaerun','ilyra'].includes(r.hero))r.characterXpEarned=(r.characterXpEarned||0)+(e.rarity==='legendary'?40:e.rarity==='rare'?25:15);const companion={id:e.beast,rarity:e.rarity};addDiscovery(r.capturedBeasts,companion);if(!r.companion)r.companion={...companion};e.hp=0;e.captured=true;victory(r);log(r,`${RARITIES[e.rarity].name} ${e.name} captured! Added to your bestiary.`);}
 else{e.strength=(e.strength||0)+2;log(r,`${e.name} broke free! The shard is spent. Rage: +2 attack damage.`);}
 return true;
}
export function companionReady(r){return r.phase==='combat'&&validBeast(r.companion)&&!r.battle.companionCooldown&&(r.companion.id!=='syluun'||r.hp<r.maxHp);}
export function useCompanion(r){
 if(!companionReady(r))return false;
 const {id,rarity}=r.companion,b=r.battle,s=RARITIES[rarity],target=b.enemies[b.target],bonuses=beastBonuses(r.companionLevel||1),scale=n=>Math.max(1,Math.round(n*bonuses.multiplier));
 if(id==='rhazek'){
  if(!target?.hp)return false;
  // Companion attacks are independent of the hero's Strength and next-card bonuses.
  let damage=Math.floor(scale(s.damage)*(target.vulnerable>0?1.5:1));if(bonuses.minor&&b.companionUses===0)damage=Math.floor(damage*1.2);const blocked=Math.min(target.block,damage),dealt=Math.min(target.hp,damage-blocked);target.block-=blocked;target.hp=Math.max(0,target.hp-damage+blocked);emitFeedback(r,{kind:'hit',source:'companion',target:'enemy:'+b.target,damage:dealt,blocked,blockBreak:blocked>0&&target.block===0,heavy:damage>=18});
  if(!target.hp)b.target=b.enemies.findIndex(e=>e.hp>0);
 }
 if(id==='dhoruun')r.block+=scale(s.block)+(bonuses.minor?2:0);
 if(id==='vaelith'){r.core=Math.min(MAX_CORE,r.core+s.energy+(bonuses.mastery?1:0));b.companionBoost=scale(s.boost);}
 if(id==='syluun')r.hp=Math.min(r.maxHp,r.hp+scale(s.heal)+(bonuses.minor?1:0));
 bossPhase(r);b.companionCooldown=Math.max(1,BEASTS[id].cooldown-(bonuses.enhanced?1:0));b.companionUses++;log(r,`${BEASTS[id].name} used ${BEASTS[id].ability}.`);victory(r);return true;
}
export function equipCompanion(r,companion,collection){
 if(!['map','victory','shop','rest','chest','mystery'].includes(r.phase))return false;
 if(companion!==null&&(!validBeast(companion)||!collection.some(x=>validBeast(x)&&beastKey(x)===beastKey(companion))))return false;
 r.companion=companion?{id:companion.id,rarity:companion.rarity}:null;return true;
}


export const MYSTERY_EVENTS={
 forge:{name:'Abandoned Forge',cavern:'Excavation Furnace'},
 exchange:{name:'Memory Exchange',cavern:'Buried Memory Vault'},
 crystal:{name:'Unstable Crystal',cavern:'Molten Crystal Seam'},
 explorer:{name:'Stranded Explorer',cavern:'Trapped Excavator'},
 armoury:{name:'Sealed Armoury',cavern:'Buried Council Armoury'},
 remains:{name:'Beastkeeper’s Remains',cavern:'Beastkeeper’s Lost Camp'},
 whisper:{name:'Whispering Relic',cavern:'Echoing Relic'},
 trial:{name:'Veyrakian Trial',cavern:'Trial of the Deep'}
};
const RARE_EVENT_CARDS=['starfall','echocrystal','warcry','ancientrelic','sovereignimpact','crystallance','fracturefield','resonantmend'];
function mysteryRoom(r,node){
 const state={...r,rng:hash(r.seed+':event:'+node.id)};
 const order=shuffle(Object.keys(MYSTERY_EVENTS),{rng:hash(r.seed+':events:'+r.stage)});
 const nodes=r.route.filter(n=>n.type==='mystery'),eventId=order[nodes.findIndex(n=>n.id===node.id)%order.length];
 const cards=sampleCards(state),rare=shuffle(RARE_EVENT_CARDS.filter(id=>(!CARDS[id].kaerun||r.hero==='kaerun')&&(!CARDS[id].ilyra||r.hero==='ilyra')),state).slice(0,3);
 const relic=randomRelic(state),success=random(state)<.7;
 const elite=r.route.find(n=>n.type==='elite'),trialEnemy=elite?structuredClone(elite.enemy):null;
 return {eventVersion:1,eventId,kind:eventId,cards,rare,relic,success,trialEnemy,step:'offer',result:null};
}
function eventUpgrade(r,i){
 if(!Number.isInteger(i)||i<0||i>=r.deck.length||!CARD_UPGRADES[r.deck[i]])return false;
 r.deck[i]=CARD_UPGRADES[r.deck[i]];return leave(r);
}
function resolveMystery(r,choice){
 const t=r.room;
 if(choice==='leave'){delete r.trialUpgradePending;return leave(r);}
 if(t.result)return false;
 const [action,arg,arg2]=String(choice).split(':');
 const i=Number(arg),eligible=Number.isInteger(i)&&i>=0&&i<r.deck.length;
 if(t.step==='upgrade'&&t.eventId==='trial')return action==='upgrade'&&eventUpgrade(r,i);
 if(t.eventId==='forge'&&action==='forge'&&eligible&&CARD_UPGRADES[r.deck[i]]){
  if(arg2==='gold'&&r.gold>=50){r.gold-=50;return eventUpgrade(r,i);}
  if(arg2==='health'&&r.hp>10){r.hp-=10;return eventUpgrade(r,i);}return false;
 }
 if(t.eventId==='exchange'&&action==='exchange'&&eligible&&t.cards.includes(arg2)){r.deck[i]=arg2;return leave(r);}
 if(t.eventId==='crystal'){
  if(choice==='safe'){r.gold+=40;t.result='You collected 40 gold safely.';return true;}
  if(choice==='risk'){
   if(t.success){if(t.relic&&!r.relics.includes(t.relic)){r.relics.push(t.relic);t.result='The crystal revealed '+RELICS[t.relic].name+'.';}else{r.gold+=70;t.result='Your relic collection is complete. The crystal yielded 70 gold.';}}
   else{const loss=Math.min(12,Math.max(0,r.hp-1));r.hp-=loss;t.result='The crystal shattered. Lost '+loss+' Vitality.';}return true;
  }
 }
 if(t.eventId==='explorer'){
  if(action==='potion'&&r.potions>0&&t.rare.includes(arg)){r.potions--;r.deck.push(arg);return leave(r);}
  if(choice==='gold'&&r.gold>=25){r.gold-=25;r.deck.push(t.cards[0]);t.result='The explorer gave you '+CARDS[t.cards[0]].name+'.';return true;}
 }
 if(t.eventId==='armoury'&&action==='armoury'&&r.hp>12&&t.cards.includes(arg)&&CARD_UPGRADES[arg]){r.hp-=12;r.deck.push(CARD_UPGRADES[arg]);return leave(r);}
 if(t.eventId==='remains'){
  if(choice==='basic'){r.shards.basic+=3;return leave(r);}
  if(choice==='refined'){r.shards.refined++;return leave(r);}
  if(choice==='gold'){r.gold+=20;return leave(r);}
 }
 if(t.eventId==='whisper'&&choice==='accept'&&t.relic&&!r.relics.includes(t.relic)){r.relics.push(t.relic);r.eventCorePenalty=(r.eventCorePenalty||0)+2;return leave(r);}
 if(t.eventId==='trial'&&choice==='fight'&&t.trialEnemy){
  const enemy=structuredClone(t.trialEnemy);startBattle(r,{...r.route.find(n=>n.id===r.current),type:'elite',enemy,pack:null});r.battle.eventTrial=true;return true;
 }
 return false;
}

