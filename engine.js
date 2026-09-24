export const VERSION = 2;
export const HEROES = [
 {id:'kaerun',name:'Kaerun',title:'The Unbroken',weapon:'Gauntlets',signature:'Sovereign Impact',available:true,portrait:16.64},
 {id:'ilyra',name:'Ilyra',title:'The Crystal Seer',weapon:'Staff & catalyst',signature:'Violet Core',available:true,portrait:29.49},
 {id:'vaelis',name:'Vaelis',weapon:'Dual blades',portrait:43.14},
 {id:'dhoran',name:'Dhoran',weapon:'Heavy cannon',portrait:56.92},
 {id:'saevra',name:'Saevra',weapon:'Polearm',portrait:70.9},
 {id:'nyvara',name:'Nyvara',weapon:'Rifle',portrait:84.28}
];
export const CARDS = {
 strike:{name:'Strike',cost:1,damage:6,icon:'strike',type:'attack',art:'strike',text:'Deal 6 damage.'},
 guard:{name:'Guard',cost:1,block:6,icon:'guard',type:'defence',art:'guard',text:'Gain 6 Block this turn.'},
 cleave:{name:'Cleave',cost:2,damage:8,icon:'strike',type:'attack',art:'cleave',text:'Deal 8 damage to all enemies.'},
 focus:{name:'Focus',cost:1,coreGain:1,icon:'core',type:'skill',art:'focus',text:'Gain 1 Core.'},
 reinforce:{name:'Reinforce',cost:2,block:12,icon:'guard',type:'defence',art:'reinforce',text:'Gain 12 Block this turn.'},
 precision:{name:'Precision Strike',cost:1,damage:8,mark:1,icon:'strike',type:'attack',art:'precision',text:'Deal 8 damage. Apply 1 Mark.'},
 quickstep:{name:'Quick Step',cost:1,agility:2,icon:'surge',type:'skill',art:'quickstep',text:'Gain 2 Agility this turn.'},
 powerslam:{name:'Power Slam',cost:2,damage:12,conditionalDamage:18,blockThreshold:6,icon:'strike',type:'attack',art:'powerslam',text:'Deal 12 damage. If you have 6+ Block, deal 18.'},
 deflect:{name:'Deflect',cost:0,block:4,icon:'guard',type:'defence',art:'deflect',text:'Gain 4 Block.'},
 resolve:{name:'Inner Resolve',cost:1,strength:3,icon:'surge',type:'skill',art:'resolve',text:'Gain 3 Strength this turn.'}
};
const DECK=['strike','strike','guard','guard','cleave','focus','reinforce','precision','quickstep','powerslam','deflect','resolve'];
const ENEMIES = [
 {id:'shard',name:'Shard Wisp',hp:25,colour:'#91e4e0',moves:[{kind:'attack',value:6},{kind:'attack',value:8},{kind:'guard',value:5}]},
 {id:'ember',name:'Ember Watcher',hp:29,colour:'#ffad66',moves:[{kind:'attack',value:7},{kind:'charge',value:0},{kind:'attack',value:13}]},
 {id:'stone',name:'Ruin Sentinel',hp:32,colour:'#cdbb91',moves:[{kind:'guard',value:7},{kind:'attack',value:9},{kind:'attack',value:7}]},
 {id:'void',name:'Veil Fragment',hp:27,colour:'#c197ff',moves:[{kind:'attack',value:5},{kind:'attack',value:10},{kind:'guard',value:6}]}
];
const BOSS={id:'warden',name:'The Gate Warden',hp:62,colour:'#f4cf79',moves:[{kind:'attack',value:10},{kind:'guard',value:10},{kind:'charge',value:0},{kind:'attack',value:19}]};
export function normaliseSeed(s){return String(s).trim().slice(0,32)||'VEYATHUUN';}
function hash(text){let n=2166136261;for(const c of text){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0;}
function random(state){state.rng=(state.rng+0x6D2B79F5)>>>0;let t=state.rng;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}
function shuffle(a,state){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random(state)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createRun(seed,hero='kaerun'){
 if(!HEROES.some(h=>h.id===hero&&h.available))throw Error('This hero is locked.');
 seed=normaliseSeed(seed);const map={rng:hash(seed+':route')};
 const encounters=shuffle(ENEMIES,map).map((e,i)=>({...structuredClone(e),hp:e.hp+Math.floor(random(map)*4)+i*2,boss:false}));
 encounters.push({...structuredClone(BOSS),boss:true});
 return {version:VERSION,seed,hero,rng:hash(seed+':combat'),phase:'map',hp:80,maxHp:80,block:0,core:0,index:0,encounters,battle:null,turns:0,cardsPlayed:0,log:[]};
}
export function enterBattle(run){
 if(run.phase!=='map')return false;
 const e=structuredClone(run.encounters[run.index]);
 run.phase='combat';run.block=0;
 run.battle={enemy:{...e,maxHp:e.hp,block:0,move:Math.floor(random(run)*e.moves.length),mark:0},draw:shuffle(DECK,run),hand:[],discard:[],turn:0,strength:0,agility:0};
 run.log=[`${e.name} bars your path.`];startTurn(run);return true;
}
function draw(run,n){const b=run.battle;for(let i=0;i<n;i++){if(!b.draw.length){b.draw=shuffle(b.discard,run);b.discard=[];}if(!b.draw.length)break;b.hand.push(b.draw.pop());}}
function startTurn(run){run.block=0;run.core=3;run.battle.strength=0;run.battle.agility=0;run.battle.turn++;run.turns++;draw(run,5);}
export function intent(run){if(!run.battle)return null;const e=run.battle.enemy;return e.moves[e.move%e.moves.length];}
function log(run,text){run.log=[...run.log.slice(-5),text];}
export function playCard(run,index){
 if(run.phase!=='combat'||!Number.isInteger(index))return false;
 const b=run.battle;const card=CARDS[b.hand[index]];
 if(!card||card.cost>run.core)return false;
 run.core-=card.cost;run.cardsPlayed++;
 if(card.coreGain){run.core=Math.min(3,run.core+card.coreGain);log(run,`${card.name} restores ${card.coreGain} Core.`);}
 if(card.block){const amount=card.block+(b.agility||0);run.block+=amount;log(run,`${card.name} grants ${amount} Block.`);}
 if(card.strength){b.strength=(b.strength||0)+card.strength;log(run,`${card.name} grants ${card.strength} Strength this turn.`);}
 if(card.agility){b.agility=(b.agility||0)+card.agility;log(run,`${card.name} grants ${card.agility} Agility this turn.`);}
 if(card.mark){b.enemy.mark=(b.enemy.mark||0)+card.mark;}
 if(card.damage){let base=card.blockThreshold&&run.block>=card.blockThreshold?card.conditionalDamage:card.damage;let raw=base+(b.strength||0)+(b.enemy.mark||0);const blocked=Math.min(b.enemy.block,raw);b.enemy.block-=blocked;const damage=raw-blocked;b.enemy.hp=Math.max(0,b.enemy.hp-damage);log(run,`${card.name} deals ${damage} damage${blocked?` (${blocked} blocked)`:''}.`);}
 b.discard.push(b.hand.splice(index,1)[0]);
 if(b.enemy.hp===0){run.phase=run.index===run.encounters.length-1?'won':'victory';run.core=0;log(run,`${b.enemy.name} defeated.`);}
 return true;
}
export function endTurn(run){
 if(run.phase!=='combat')return false;
 const b=run.battle;const move=intent(run);b.discard.push(...b.hand);b.hand=[];b.enemy.block=0;
 if(move.kind==='attack'){const blocked=Math.min(run.block,move.value);const damage=move.value-blocked;run.block-=blocked;run.hp=Math.max(0,run.hp-damage);log(run,`${b.enemy.name} deals ${damage} damage${blocked?` (${blocked} blocked)`:''}.`);}
 if(move.kind==='guard'){b.enemy.block=move.value;log(run,`${b.enemy.name} gains ${move.value} Block.`);}
 if(move.kind==='charge')log(run,`${b.enemy.name} gathers power.`);
 b.enemy.move=(b.enemy.move+1)%b.enemy.moves.length;
 if(run.hp===0){run.phase='lost';run.core=0;return true;}
 startTurn(run);return true;
}
export function advance(run){if(run.phase!=='victory')return false;run.index++;run.phase='map';run.battle=null;run.block=0;return true;}
export function serialise(run){return JSON.stringify(run);}
export function restore(raw){
 try{
 const r=JSON.parse(raw);const int=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
 if(!r||r.version!==VERSION||typeof r.seed!=='string'||r.seed!==normaliseSeed(r.seed)||!HEROES.some(h=>h.id===r.hero&&h.available))return null;
 if(!['map','combat','victory','won','lost'].includes(r.phase)||!int(r.rng,0,4294967295)||!int(r.hp,0,80)||r.maxHp!==80||!int(r.block,0,60)||!int(r.core,0,3)||!int(r.index,0,4)||!int(r.turns,0,100000)||!int(r.cardsPlayed,0,1000000))return null;
 if(JSON.stringify(r.encounters)!==JSON.stringify(createRun(r.seed,r.hero).encounters)||!Array.isArray(r.log)||r.log.length>6||r.log.some(t=>typeof t!=='string'||t.length>200))return null;
 if(r.phase==='map'){if(r.battle!==null||r.hp===0)return null;}
 else{
 const b=r.battle,e=b?.enemy,base=r.encounters[r.index];
 if(!b||!e||e.id!==base.id||e.name!==base.name||e.colour!==base.colour||e.maxHp!==base.hp||e.boss!==base.boss||!int(e.hp,0,e.maxHp)||!int(e.block,0,10)||!int(e.move,0,base.moves.length-1)||!int(e.mark??0,0,99)||!int(b.strength??0,0,99)||!int(b.agility??0,0,99)||JSON.stringify(e.moves)!==JSON.stringify(base.moves)||!int(b.turn,1,100000))return null;
 if(!['draw','hand','discard'].every(k=>Array.isArray(b[k])&&b[k].every(c=>Object.hasOwn(CARDS,c)))||b.hand.length>5)return null;
 if(JSON.stringify([...b.draw,...b.hand,...b.discard].sort())!==JSON.stringify([...DECK].sort()))return null;
 if(r.phase==='combat'&&(r.hp===0||e.hp===0))return null;
 if(r.phase==='lost'&&r.hp!==0)return null;
 if(['victory','won'].includes(r.phase)&&(e.hp!==0||r.hp===0))return null;
 if(r.phase==='won'&&r.index!==4||r.phase==='victory'&&r.index===4)return null;
 }
 return r;
 }catch{return null;}
}
