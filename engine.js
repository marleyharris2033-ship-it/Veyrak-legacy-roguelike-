export const VERSION=4;
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
const ENEMIES = [
 {id:'shard',name:'Shard Wisp',hp:25,colour:'#91e4e0',moves:[{kind:'attack',value:6},{kind:'attack',value:8},{kind:'guard',value:5}]},
 {id:'ember',name:'Ember Watcher',hp:29,colour:'#ffad66',moves:[{kind:'attack',value:7},{kind:'charge',value:0},{kind:'attack',value:13}]},
 {id:'stone',name:'Ruin Sentinel',hp:32,colour:'#cdbb91',moves:[{kind:'guard',value:7},{kind:'attack',value:9},{kind:'attack',value:7}]},
 {id:'void',name:'Veil Fragment',hp:27,colour:'#c197ff',moves:[{kind:'attack',value:5},{kind:'attack',value:10},{kind:'guard',value:6}]}
];
const ELITES=[
 {id:'crusher',name:'Obsidian Crusher',hp:58,colour:'#e07b4f',elite:true,moves:[{kind:'attack',value:10},{kind:'guard',value:10},{kind:'attack',value:16},{kind:'attack',value:12}]}
];
const BOSS={id:'warden',name:'The Gate Warden',hp:100,colour:'#f4cf79',moves:[{kind:'attack',value:13},{kind:'guard',value:12},{kind:'charge',value:0},{kind:'attack',value:23}]};
export function normaliseSeed(s){return String(s).trim().slice(0,32)||'VEYATHUUN';}
function hash(text){let n=2166136261;for(const c of text){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0;}
function random(state){state.rng=(state.rng+0x6D2B79F5)>>>0;let t=state.rng;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}
function shuffle(a,state){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random(state)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export const CARDS={
 strike:{name:'Strike',cost:1,damage:6,type:'attack',text:'Deal 6 damage.',tile:0},
 guard:{name:'Guard',cost:1,block:6,type:'defence',text:'Gain 6 Block this turn.',tile:1},
 targetbreaker:{name:'Target Breaker',cost:1,mark:2,type:'skill',text:'Apply 2 Mark to target.',tile:2},
 gauntletsmash:{name:'Gauntlet Smash',cost:2,damage:12,markedDamage:18,type:'attack',text:'Deal 12 damage. If the target is Marked, deal 18 instead.',tile:3},
 deflect:{name:'Deflect',cost:0,block:4,type:'defence',text:'Gain 4 Block.',tile:4},
 cleave:{name:'Cleave',cost:2,damage:8,all:true,type:'attack',text:'Deal 8 damage to all enemies.',tile:5},
 focus:{name:'Focus',cost:1,coreGain:1,type:'skill',text:'Gain 1 Core after paying its cost.',tile:6},
 ironskin:{name:'Iron Skin',cost:1,block:8,strength:1,type:'defence',text:'Gain 8 Block. Gain 1 Strength this turn.',tile:7},
 seismicpunch:{name:'Seismic Punch',cost:2,damage:14,stun:true,type:'attack',text:'Deal 14 damage. Stun target if you have 10 or more Block.',tile:8},
 stonebulwark:{name:'Stone Bulwark',cost:2,block:12,type:'defence',text:'Gain 12 Block this turn.',tile:9},
 meteor:{name:'Meteor Fragment',cost:1,damage:10,randomTarget:true,type:'attack',sigil:'☄',text:'Deal 10 damage to a random enemy.'},
 chainlightning:{name:'Chain Lightning',cost:2,damage:6,splash:3,type:'attack',sigil:'ϟ',text:'Deal 6 damage to a target and 3 to every other enemy.'},
 shatterarmour:{name:'Shatter Armour',cost:1,damage:4,shatter:true,type:'attack',sigil:'⟐',text:'Remove all of an enemy’s Block, then deal 4 damage.'},
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
 fortressstance:{name:'Fortress Stance',cost:1,block:10,strength:1,type:'defence',kaerun:true,text:'Gain 10 Block. Gain 1 Strength this turn.'}
};
export const STARTER=['strike','strike','strike','strike','guard','guard','guard','guard','targetbreaker','gauntletsmash'];
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
export function createRun(seed,hero='kaerun'){
 if(!HEROES.some(h=>h.id===hero&&h.available))throw Error('This hero is locked.');
 seed=normaliseSeed(seed);const state={rng:hash(seed+':route')};
 const route=[];const layouts=[['battle','battle','battle'],['battle','mystery','chest'],['shop','battle','mystery'],['battle','elite','battle'],['mystery','battle','chest'],['rest','shop','battle'],['battle','elite','battle'],['chest','mystery','battle'],['battle','elite','battle'],['rest','shop','mystery'],['boss']];
 layouts.forEach((types,row)=>{const ordered=shuffle(types,state);ordered.forEach((type,col)=>{const id=`${row}-${col}`;let enemy=structuredClone(type==='boss'?BOSS:type==='elite'?ELITES[Math.floor(random(state)*ELITES.length)]:ENEMIES[Math.floor(random(state)*4)]);if(!['boss','elite'].includes(type)){enemy.hp+=4+row*3;enemy.moves=enemy.moves.map(m=>({...m,value:m.kind==='attack'?m.value+1+Math.floor(row/3):m.value}));}enemy.boss=type==='boss';route.push({id,row,col,type,enemy,next:[]});});});
 for(const n of route)n.next=route.filter(v=>v.row===n.row+1&&(v.type==='boss'||Math.abs(v.col-n.col)<=1)).map(v=>v.id);
 return {version:VERSION,seed,hero,rng:hash(seed+':combat'),phase:'map',hp:80,maxHp:80,block:0,core:0,index:0,route,current:null,visited:[],deck:[...STARTER],gold:60,relics:[],potions:0,blessing:0,curse:0,battle:null,room:null,rewards:[],turns:0,cardsPlayed:0,log:[]};
}
export function availableNodes(r){return r.current?r.route.find(n=>n.id===r.current).next:r.route.filter(n=>n.row===0).map(n=>n.id);}
function sampleCards(r,n=3){const pool=Object.keys(CARDS).filter(id=>!CARDS[id].kaerun||r.hero==='kaerun');return shuffle(pool,r).slice(0,n);}
export function chooseNode(r,id){
 if(r.phase!=='map'||!availableNodes(r).includes(id))return false;
 const node=r.route.find(n=>n.id===id);r.current=id;r.visited.push(id);r.index=node.row;r.room=null;
 if(['battle','elite','boss'].includes(node.type)){startBattle(r,node);return true;}
 r.phase=node.type;
 if(node.type==='chest')r.room=treasureRoom(r,node);
 if(node.type==='mystery')r.room={kind:['cache','shrine','rift'][Math.floor(random(r)*3)],cards:sampleCards(r)};
 if(node.type==='shop')r.room={stock:sampleCards(r).map(id=>({kind:'card',id,price:35+CARDS[id].cost*10,sold:false})).concat([{kind:'potion',price:25,sold:false},{kind:'relic',id:randomRelic(r),price:85,sold:false}]).filter(x=>x.kind!=='relic'||x.id)};
 return true;
}
export function enterBattle(r){const id=availableNodes(r).find(id=>['battle','elite','boss'].includes(r.route.find(n=>n.id===id).type));return id?chooseNode(r,id):false;}
function startBattle(r,node){
 const enemies=[structuredClone(node.enemy)];if([3,6,8].includes(node.row)&&node.type==='battle'&&node.col===1){const add=structuredClone(ENEMIES[0]);add.hp=16+node.row;enemies.push(add);}
 const es=enemies.map(e=>({...e,maxHp:e.hp,block:0,move:Math.floor(random(r)*e.moves.length),mark:0,weak:0,vulnerable:0,bleed:0,strength:0,stunned:false}));
 r.phase='combat';r.battle={enemies:es,target:0,draw:shuffle(r.deck,r),hand:[],discard:[],exhaust:[],retained:[],turn:0,strength:0,power:0,relentless:0,bloodRush:false,weak:0,vulnerable:0,bleed:0,barrier:0,stunned:false,echo:false,weaken:0,drawPenalty:0,coreDebt:0,hurtLastTurn:false,firstAttack:true,wardUsed:false};r.log=[`${node.enemy.name} bars your path.`];startTurn(r);if(r.relics.includes('aegis'))r.block+=5;
}
function draw(r,n){const b=r.battle;for(let i=0;i<n;i++){if(!b.draw.length){b.draw=shuffle(b.discard,r);b.discard=[];}if(!b.draw.length)break;b.hand.push(b.draw.pop());}}
function startTurn(r){
 const b=r.battle;r.block=b.barrier||0;b.barrier=0;if(b.bleed>0){r.hp=Math.max(0,r.hp-b.bleed);b.bleed=Math.max(0,b.bleed-1);}if(!r.hp){r.phase='lost';r.core=0;return;}if(b.retained?.length){b.hand.push(...b.retained);b.retained=[];}r.core=Math.min(MAX_CORE,(r.core||0)+CORE_REGEN);b.strength=(r.relics.includes('fist')?1:0)+r.blessing+(b.power||0);b.echo=false;b.weaken=0;b.turn++;r.turns++;
 let count=Math.max(0,5-(b.drawPenalty||0));b.drawPenalty=0;
 if(b.turn===1){if(r.relics.includes('wayfarer'))count++;if(r.relics.includes('coreprism'))r.core=Math.min(MAX_CORE,r.core+1);}
 if(r.relics.includes('hourglass')&&b.turn%3===0)r.block+=3;
 r.core=Math.max(0,r.core-(b.coreDebt||0));b.coreDebt=0;
 if(r.curse>0){r.core=Math.max(0,r.core-1);r.curse--;}
 draw(r,count);
}
export function intent(r,index=r.battle?.target??0){
 const e=r.battle?.enemies[index];if(!e)return null;if(e.stunned)return {kind:'stun',value:0};
 const m=e.moves[e.move%e.moves.length];return m.kind==='attack'?{...m,value:Math.max(0,Math.floor((m.value+(e.strength||0)-(r.battle.weaken||0))*(e.weak>0?.75:1)*(r.battle.vulnerable>0?1.5:1)))}:m;
}
function log(r,text){r.log=[...r.log.slice(-5),text];}
export function selectTarget(r,i){if(r.phase!=='combat'||!Number.isInteger(i)||!r.battle.enemies[i]?.hp)return false;r.battle.target=i;return true;}
function victory(r){
 const b=r.battle;if(!b.enemies.every(e=>e.hp===0))return false;
 const node=r.route.find(n=>n.id===r.current),elite=node.type==='elite',gold=(elite?60:30)+(r.relics.includes('gilded')?10:0);r.gold+=gold;r.hp=Math.min(r.maxHp,r.hp+(r.relics.includes('amber')?4:0));r.core=0;
 if(elite){const relic=randomRelic(r);if(relic)r.relics.push(relic);r.eliteReward=relic;}else r.eliteReward=null;r.phase=node.type==='boss'?'won':'victory';r.rewards=sampleCards(r);log(r,`Victory! Gained ${gold} gold${elite&&r.eliteReward?` and ${RELICS[r.eliteReward].name}`:''}.`);return true;
}
function hitEnemy(r,e,base){const b=r.battle,weakMult=b.weak>0?.75:1,vulnMult=e.vulnerable>0?1.5:1,raw=Math.max(0,Math.floor((base+b.strength+(r.relics.includes('hunterlens')&&e.mark>0?2:0))*weakMult*vulnMult)),blocked=Math.min(e.block,raw);e.block-=blocked;const damage=Math.min(e.hp,raw-blocked);e.hp-=damage;return damage;}
export function playCard(r,i){
 if(r.phase!=='combat'||!Number.isInteger(i)||i<0)return false;
 const b=r.battle,id=b.hand[i],c=CARDS[id],selected=b.enemies[b.target];if(!c||c.cost>r.core||!selected?.hp||c.requiresMark&&selected.mark<=0)return false;
 r.core-=c.cost;r.cardsPlayed++;b.hand.splice(i,1);
 if(c.coreGain)r.core=Math.min(MAX_CORE,r.core+c.coreGain);if(c.block)r.block+=c.block;if(c.markedBonusBlock&&selected.mark>0)r.block+=c.markedBonusBlock;if(c.strength)b.strength+=c.strength;if(c.mark&&!c.damage)selected.mark+=c.mark;
 if(c.drawPenalty)b.drawPenalty=(b.drawPenalty||0)+c.drawPenalty;if(c.coreDebt)b.coreDebt=(b.coreDebt||0)+c.coreDebt;
 if(c.power){b.power=(b.power||0)+c.power;b.strength+=c.power;}if(c.echo)b.echo=true;if(c.weaken)b.weaken=(b.weaken||0)+c.weaken;if(c.relentless)b.relentless=(b.relentless||0)+1;if(c.bloodRush)b.bloodRush=true;
 let detail='';if(c.fortune){const roll=Math.floor(random(r)*3);if(roll===0){r.block+=10;detail='Gained 10 Block.';}else if(roll===1){r.core=Math.min(MAX_CORE,r.core+2);detail='Gained 2 Core.';}else{draw(r,3);detail='Drew 3 cards.';}}
 if(c.damage){
  const markedBefore=selected.mark>0,selectedAliveBefore=selected.hp>0,repetitions=b.echo?2:1;b.echo=false;const firstBonus=b.firstAttack&&r.relics.includes('emberstone')?3:0;b.firstAttack=false;
  for(let n=0;n<repetitions;n++){
   const living=b.enemies.filter(e=>e.hp>0);if(!living.length)break;const target=c.randomTarget?living[Math.floor(random(r)*living.length)]:selected;if(!target?.hp&&!c.all&&!c.splash)break;
   for(const e of c.all?living:c.splash?living:[target]){
    let base=c.splash&&e!==target?c.splash:c.damage;if(c.blockComboDamage&&r.block>=10)base=c.blockComboDamage;if(c.executeBonus&&e.hp<e.maxHp/2)base+=c.executeBonus;if(c.consumeMarkDamage&&e===target){base+=c.consumeMarkDamage*(e.mark||0);e.mark=0;}if(c.removeBlock)e.block=Math.max(0,e.block-c.removeBlock);if(c.markedDamage&&e.mark>0)base=c.markedDamage;if(c.executeDamage&&e.hp<=e.maxHp/2)base=c.executeDamage;if(c.revengeDamage&&b.hurtLastTurn)base=c.revengeDamage;if(c.shatter)e.block=0;
    const damage=hitEnemy(r,e,base+firstBonus);if(c.siphon&&damage>0)r.hp=Math.min(r.maxHp,r.hp+c.siphon);if(c.stun&&r.block>=10)e.stunned=true;
   }
  }
  if(c.mark)selected.mark+=c.mark;if(c.blockComboVulnerable&&r.block>=10)selected.vulnerable=(selected.vulnerable||0)+c.blockComboVulnerable;if(markedBefore&&b.relentless>0){draw(r,b.relentless);b.relentless=0;}if(selectedAliveBefore&&!selected.hp&&b.bloodRush){r.core=Math.min(MAX_CORE,r.core+1);b.bloodRush=false;}
 }
 if(c.weak)selected.weak=(selected.weak||0)+c.weak;if(c.vulnerable)selected.vulnerable=(selected.vulnerable||0)+c.vulnerable;if(c.bleed)selected.bleed=(selected.bleed||0)+c.bleed;if(c.barrier)b.barrier=(b.barrier||0)+c.barrier;if(c.retain)b.retained.push(id);else if(c.exhaust)b.exhaust.push(id);else b.discard.push(id);log(r,`${c.name}: ${detail||c.text}`);if(!selected.hp)b.target=b.enemies.findIndex(e=>e.hp>0);victory(r);return true;
}
export function endTurn(r){
 if(r.phase!=='combat')return false;const b=r.battle;const keep=b.hand.filter(id=>CARDS[id]?.retain),toss=b.hand.filter(id=>!CARDS[id]?.retain&&!CARDS[id]?.exhaust),burn=b.hand.filter(id=>CARDS[id]?.exhaust);b.retained.push(...keep);b.discard.push(...toss);b.exhaust.push(...burn);b.hand=[];b.hurtLastTurn=false;if(b.stunned){b.stunned=false;startTurn(r);log(r,'Stunned — enemy turn skipped.');return true;}
 for(const e of b.enemies.filter(e=>e.hp>0)){
  e.block=0;if(e.bleed>0){e.hp=Math.max(0,e.hp-e.bleed);e.bleed=Math.max(0,e.bleed-1);if(!e.hp)continue;}if(e.stunned){e.stunned=false;continue;}const m=e.moves[e.move%e.moves.length];
  if(m.kind==='attack'){const incoming=Math.max(0,Math.floor((m.value+(e.strength||0)-(b.weaken||0))*(e.weak>0?.75:1)*(b.vulnerable>0?1.5:1))),blocked=Math.min(r.block,incoming);r.block-=blocked;let damage=incoming-blocked;if(damage>0&&r.relics.includes('wardstone')&&!b.wardUsed){damage=Math.max(0,damage-3);b.wardUsed=true;}if(damage>0)b.hurtLastTurn=true;r.hp=Math.max(0,r.hp-damage);if(r.relics.includes('thorncrown')){const thornBlocked=Math.min(e.block,2);e.block-=thornBlocked;e.hp=Math.max(0,e.hp-2+thornBlocked);}}
  if(m.kind==='guard')e.block=m.value;e.move=(e.move+1)%e.moves.length;e.mark=Math.max(0,e.mark-1);e.weak=Math.max(0,(e.weak||0)-1);e.vulnerable=Math.max(0,(e.vulnerable||0)-1);if(!r.hp){r.phase='lost';r.core=0;return true;}
 }
 b.weak=Math.max(0,(b.weak||0)-1);b.vulnerable=Math.max(0,(b.vulnerable||0)-1);if(victory(r))return true;if(!b.enemies[b.target]?.hp)b.target=b.enemies.findIndex(e=>e.hp>0);startTurn(r);log(r,'Your turn. Choose a card.');return true;
}
function leave(r){r.phase='map';r.battle=null;r.room=null;r.block=0;r.rewards=[];r.eliteReward=null;return true;}
export function advance(r,card=null){if(r.phase!=='victory'||(card!==null&&!r.rewards.includes(card)))return false;if(card)r.deck.push(card);return leave(r);}
export function resolveRoom(r,choice){
 if(r.phase==='chest'){
  if(choice==='leave'&&r.room.revealed)return leave(r);if(!['open','claim'].includes(choice)||r.room.revealed)return false;const t=r.room;t.revealed=true;
  if(t.bad){if(t.kind==='trap'){const loss=Math.min(8,Math.max(0,r.hp-1));r.hp-=loss;t.result=`A concealed trap! Lost ${loss} Vitality. The chest is empty.`;}if(t.kind==='drain'){r.curse+=2;t.result='A cursed crystal drains your Core. Start your next two turns with 1 less Core. No treasure.';}if(t.kind==='theft'){const loss=Math.min(25,r.gold);r.gold-=loss;t.result=`A void snare swallowed ${loss} gold. No treasure.`;}}
  else{if(t.relic)r.relics.push(t.relic);r.gold+=t.gold;r.potions++;t.result=`Gained ${t.gold} gold, a healing potion${t.relic?' and '+RELICS[t.relic].name:''}.`;}return true;
 }
 if(r.phase==='rest'&&choice==='rest'){r.hp=Math.min(r.maxHp,r.hp+24);return leave(r);}if(r.phase==='shop'&&choice==='leave')return leave(r);if(r.phase!=='mystery')return false;if(choice==='leave')return leave(r);
 if(r.room.kind==='cache'&&r.room.cards.includes(choice)){r.deck.push(choice);return leave(r);}if(r.room.kind==='shrine'&&choice==='accept'&&r.hp>8){r.hp-=8;r.blessing++;return leave(r);}if(r.room.kind==='rift'&&choice==='accept'){r.deck.push(r.room.cards[0]);r.gold+=45;r.curse+=2;return leave(r);}return false;
}
export function buy(r,i){if(r.phase!=='shop'||!Number.isInteger(i))return false;const x=r.room.stock[i];if(!x||x.sold||r.gold<x.price)return false;r.gold-=x.price;x.sold=true;if(x.kind==='card')r.deck.push(x.id);if(x.kind==='potion')r.potions++;if(x.kind==='relic')r.relics.push(x.id);return true;}
export function sell(r,kind,i){if(r.phase!=='shop')return false;if(kind==='potion'&&r.potions>0){r.potions--;r.gold+=12;return true;}if(kind==='card'&&Number.isInteger(i)&&r.deck[i]&&r.deck.length>5){r.deck.splice(i,1);r.gold+=10;return true;}return false;}
export function usePotion(r){if(!['combat','map'].includes(r.phase)||r.potions<1||r.hp>=r.maxHp)return false;r.potions--;r.hp=Math.min(r.maxHp,r.hp+(r.relics.includes('moonchalice')?28:20));return true;}
export function serialise(r){return JSON.stringify(r);}
export function restore(raw){try{
 const r=JSON.parse(raw),int=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
 if(!r||r.version!==VERSION||typeof r.seed!=='string'||r.seed!==normaliseSeed(r.seed)||!HEROES.some(h=>h.id===r.hero&&h.available))return null;
 if(!['map','combat','victory','won','lost','shop','chest','mystery','rest'].includes(r.phase)||!int(r.rng,0,4294967295)||!int(r.hp,0,80)||r.maxHp!==80||!int(r.gold,0,100000)||!int(r.potions,0,1000)||!int(r.core,0,MAX_CORE)||!int(r.block,0,999)||!int(r.blessing,0,20)||!int(r.curse,0,20))return null;
 if(JSON.stringify(r.route)!==JSON.stringify(createRun(r.seed,r.hero).route)||!Array.isArray(r.deck)||r.deck.length<5||r.deck.length>100||r.deck.some(c=>!Object.hasOwn(CARDS,c))||!Array.isArray(r.relics)||r.relics.some(id=>!Object.hasOwn(RELICS,id)))return null;
 if(!Array.isArray(r.visited)||r.visited.length>11)return null;let prev=null;for(const id of r.visited){const n=r.route.find(n=>n.id===id);if(!n||(prev?!prev.next.includes(id):n.row!==0))return null;prev=n;}if(r.current!==(prev?.id??null))return null;
 if(!Array.isArray(r.log)||r.log.some(x=>typeof x!=='string'||x.length>300)||!Array.isArray(r.rewards)||r.rewards.some(x=>!CARDS[x]))return null;
 if(['combat','victory','won','lost'].includes(r.phase)){const b=r.battle;if(!b||!Array.isArray(b.enemies)||!b.enemies.length||b.enemies.some(e=>!int(e.hp,0,e.maxHp)||!Array.isArray(e.moves))||!['draw','hand','discard'].every(k=>Array.isArray(b[k])&&b[k].every(c=>Object.hasOwn(CARDS,c))))return null;b.exhaust??=[];b.retained??=[];if(JSON.stringify([...b.draw,...b.hand,...b.discard,...b.exhaust,...b.retained].sort())!==JSON.stringify([...r.deck].sort()))return null;if(r.phase==='combat'&&(!r.hp||!b.enemies[b.target]?.hp))return null;}
 if(['shop','chest','mystery'].includes(r.phase)&&!r.room)return null;if(r.phase==='shop'&&(!Array.isArray(r.room.stock)||r.room.stock.some(x=>!int(x.price,0,1000)||!['card','potion','relic'].includes(x.kind)||(x.kind==='card'&&!CARDS[x.id])||(x.kind==='relic'&&!RELICS[x.id]))))return null;
 if(r.battle){const b=r.battle;b.exhaust??=[];b.retained??=[];b.relentless??=0;b.bloodRush??=false;b.weak??=0;b.vulnerable??=0;b.bleed??=0;b.barrier??=0;b.stunned??=false;b.enemies.forEach(e=>{e.weak??=0;e.vulnerable??=0;e.bleed??=0;e.strength??=0;});b.power??=0;b.echo??=false;b.weaken??=0;b.drawPenalty??=0;b.coreDebt??=0;b.hurtLastTurn??=false;b.firstAttack??=false;b.wardUsed??=false;}
 return r;
 }catch{return null;}}
