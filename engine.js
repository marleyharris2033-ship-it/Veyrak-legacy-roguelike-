export const VERSION=3;
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
const BOSS={id:'warden',name:'The Gate Warden',hp:62,colour:'#f4cf79',moves:[{kind:'attack',value:10},{kind:'guard',value:10},{kind:'charge',value:0},{kind:'attack',value:19}]};
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
 stonebulwark:{name:'Stone Bulwark',cost:2,block:12,type:'defence',text:'Gain 12 Block this turn.',tile:9}
};
export const STARTER=['strike','strike','strike','strike','guard','guard','guard','guard','targetbreaker','gauntletsmash'];
export const RELICS={amber:{name:'Amber Heart',text:'Heal 4 Vitality after combat.'},aegis:{name:'Ivory Aegis',text:'Start each battle with 5 Block.'},fist:{name:'Sovereign Seal',text:'+1 Strength every turn.'}};
export function createRun(seed,hero='kaerun'){
 if(!HEROES.some(h=>h.id===hero&&h.available))throw Error('This hero is locked.');
 seed=normaliseSeed(seed);const state={rng:hash(seed+':route')};
 const route=[];const layouts=[['battle'],['battle','mystery','chest'],['shop','battle','mystery'],['battle','chest','battle'],['mystery','battle','shop'],['rest','mystery','chest'],['boss']];
 layouts.forEach((types,row)=>{const ordered=row===0||row===6?types:shuffle(types,state);ordered.forEach((type,col)=>{const id=`${row}-${col}`;let enemy=structuredClone(type==='boss'?BOSS:ENEMIES[Math.floor(random(state)*4)]);enemy.hp+=type==='boss'?0:row*2;enemy.boss=type==='boss';route.push({id,row,col,type,enemy,next:[]});});});
 for(const n of route)n.next=route.filter(v=>v.row===n.row+1&&(n.row===0||v.row===6||Math.abs(v.col-n.col)<=1)).map(v=>v.id);
 return {version:VERSION,seed,hero,rng:hash(seed+':combat'),phase:'map',hp:80,maxHp:80,block:0,core:0,index:0,route,current:null,visited:[],deck:[...STARTER],gold:60,relics:[],potions:0,blessing:0,curse:0,battle:null,room:null,rewards:[],turns:0,cardsPlayed:0,log:[]};
}
export function availableNodes(r){return r.current?r.route.find(n=>n.id===r.current).next:r.route.filter(n=>n.row===0).map(n=>n.id);}
function sampleCards(r,n=3){return shuffle(Object.keys(CARDS),r).slice(0,n);}
export function chooseNode(r,id){
 if(r.phase!=='map'||!availableNodes(r).includes(id))return false;
 const node=r.route.find(n=>n.id===id);r.current=id;r.visited.push(id);r.index=node.row;r.room=null;
 if(['battle','boss'].includes(node.type)){startBattle(r,node);return true;}
 r.phase=node.type;
 if(node.type==='chest'){const pool=Object.keys(RELICS).filter(id=>!r.relics.includes(id));r.room={relic:pool.length?pool[Math.floor(random(r)*pool.length)]:null,gold:25+Math.floor(random(r)*21)};}
 if(node.type==='mystery')r.room={kind:['cache','shrine','rift'][Math.floor(random(r)*3)],cards:sampleCards(r)};
 if(node.type==='shop')r.room={stock:sampleCards(r).map(id=>({kind:'card',id,price:35+CARDS[id].cost*10,sold:false})).concat([{kind:'potion',price:25,sold:false},{kind:'relic',id:Object.keys(RELICS).find(id=>!r.relics.includes(id)),price:85,sold:false}]).filter(x=>x.kind!=='relic'||x.id)};
 return true;
}
export function enterBattle(r){const id=availableNodes(r).find(id=>['battle','boss'].includes(r.route.find(n=>n.id===id).type));return id?chooseNode(r,id):false;}
function startBattle(r,node){
 const enemies=[structuredClone(node.enemy)];if(node.row===3&&node.type==='battle'){const add=structuredClone(ENEMIES[0]);add.hp=18;enemies.push(add);}
 const es=enemies.map(e=>({...e,maxHp:e.hp,block:0,move:Math.floor(random(r)*e.moves.length),mark:0,stunned:false}));
 r.phase='combat';r.battle={enemies:es,target:0,draw:shuffle(r.deck,r),hand:[],discard:[],turn:0,strength:0};r.log=[`${node.enemy.name} bars your path.`];startTurn(r);if(r.relics.includes('aegis'))r.block+=5;
}
function draw(r,n){const b=r.battle;for(let i=0;i<n;i++){if(!b.draw.length){b.draw=shuffle(b.discard,r);b.discard=[];}if(!b.draw.length)break;b.hand.push(b.draw.pop());}}
function startTurn(r){r.block=0;r.core=3;r.battle.strength=(r.relics.includes('fist')?1:0)+r.blessing;r.battle.turn++;r.turns++;draw(r,5);if(r.curse>0){r.core=2;r.curse--;}}
export function intent(r,index=r.battle?.target??0){const e=r.battle?.enemies[index];return e?.stunned?{kind:'stun',value:0}:e?.moves[e.move%e.moves.length];}
function log(r,text){r.log=[...r.log.slice(-5),text];}
export function selectTarget(r,i){if(r.phase!=='combat'||!Number.isInteger(i)||!r.battle.enemies[i]?.hp)return false;r.battle.target=i;return true;}
export function playCard(r,i){
 if(r.phase!=='combat'||!Number.isInteger(i)||i<0)return false;const b=r.battle,c=CARDS[b.hand[i]],target=b.enemies[b.target];if(!c||c.cost>r.core||!target?.hp)return false;
 r.core-=c.cost;r.cardsPlayed++;if(c.coreGain)r.core+=c.coreGain;if(c.block)r.block+=c.block;if(c.strength)b.strength+=c.strength;if(c.mark)target.mark+=c.mark;
 if(c.damage)for(const e of c.all?b.enemies.filter(e=>e.hp>0):[target]){const raw=(c.markedDamage&&e.mark>0?c.markedDamage:c.damage)+b.strength;const blocked=Math.min(e.block,raw);e.block-=blocked;e.hp=Math.max(0,e.hp-raw+blocked);if(c.stun&&r.block>=10)e.stunned=true;}
 log(r,`${c.name}: ${c.text}`);b.discard.push(b.hand.splice(i,1)[0]);
 if(!target.hp)b.target=b.enemies.findIndex(e=>e.hp>0);
 if(b.enemies.every(e=>e.hp===0)){r.gold+=30;r.hp=Math.min(r.maxHp,r.hp+(r.relics.includes('amber')?4:0));r.core=0;r.phase=r.route.find(n=>n.id===r.current).type==='boss'?'won':'victory';r.rewards=sampleCards(r);log(r,'Victory! Gained 30 gold.');}
 return true;
}
export function endTurn(r){
 if(r.phase!=='combat')return false;const b=r.battle;b.discard.push(...b.hand);b.hand=[];
 for(const e of b.enemies.filter(e=>e.hp>0)){e.block=0;if(e.stunned){e.stunned=false;continue;}const m=e.moves[e.move%e.moves.length];if(m.kind==='attack'){const blocked=Math.min(r.block,m.value);r.block-=blocked;r.hp=Math.max(0,r.hp-m.value+blocked);}if(m.kind==='guard')e.block=m.value;e.move=(e.move+1)%e.moves.length;e.mark=Math.max(0,e.mark-1);}
 if(!r.hp){r.phase='lost';r.core=0;return true;}startTurn(r);log(r,'Your turn. Choose a card.');return true;
}
function leave(r){r.phase='map';r.battle=null;r.room=null;r.block=0;r.rewards=[];return true;}
export function advance(r,card=null){if(r.phase!=='victory'||(card!==null&&!r.rewards.includes(card)))return false;if(card)r.deck.push(card);return leave(r);}
export function resolveRoom(r,choice){
 if(r.phase==='chest'&&choice==='claim'){if(r.room.relic)r.relics.push(r.room.relic);r.gold+=r.room.gold;r.potions++;return leave(r);}
 if(r.phase==='rest'&&choice==='rest'){r.hp=Math.min(r.maxHp,r.hp+24);return leave(r);}
 if(r.phase==='shop'&&choice==='leave')return leave(r);
 if(r.phase!=='mystery')return false;
 if(choice==='leave')return leave(r);
 if(r.room.kind==='cache'&&r.room.cards.includes(choice)){r.deck.push(choice);return leave(r);}
 if(r.room.kind==='shrine'&&choice==='accept'&&r.hp>8){r.hp-=8;r.blessing++;return leave(r);}
 if(r.room.kind==='rift'&&choice==='accept'){r.deck.push(r.room.cards[0]);r.gold+=45;r.curse+=2;return leave(r);}
 return false;
}
export function buy(r,i){if(r.phase!=='shop'||!Number.isInteger(i))return false;const x=r.room.stock[i];if(!x||x.sold||r.gold<x.price)return false;r.gold-=x.price;x.sold=true;if(x.kind==='card')r.deck.push(x.id);if(x.kind==='potion')r.potions++;if(x.kind==='relic')r.relics.push(x.id);return true;}
export function sell(r,kind,i){if(r.phase!=='shop')return false;if(kind==='potion'&&r.potions>0){r.potions--;r.gold+=12;return true;}if(kind==='card'&&Number.isInteger(i)&&r.deck[i]&&r.deck.length>5){r.deck.splice(i,1);r.gold+=10;return true;}return false;}
export function usePotion(r){if(!['combat','map'].includes(r.phase)||r.potions<1||r.hp>=r.maxHp)return false;r.potions--;r.hp=Math.min(r.maxHp,r.hp+20);return true;}
export function serialise(r){return JSON.stringify(r);}
export function restore(raw){try{
 const r=JSON.parse(raw),int=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
 if(!r||r.version!==VERSION||typeof r.seed!=='string'||r.seed!==normaliseSeed(r.seed)||!HEROES.some(h=>h.id===r.hero&&h.available))return null;
 if(!['map','combat','victory','won','lost','shop','chest','mystery','rest'].includes(r.phase)||!int(r.rng,0,4294967295)||!int(r.hp,0,80)||r.maxHp!==80||!int(r.gold,0,100000)||!int(r.potions,0,1000)||!int(r.core,0,99)||!int(r.block,0,999)||!int(r.blessing,0,20)||!int(r.curse,0,20))return null;
 if(JSON.stringify(r.route)!==JSON.stringify(createRun(r.seed,r.hero).route)||!Array.isArray(r.deck)||r.deck.length<5||r.deck.length>100||r.deck.some(c=>!Object.hasOwn(CARDS,c))||!Array.isArray(r.relics)||r.relics.some(id=>!Object.hasOwn(RELICS,id)))return null;
 if(!Array.isArray(r.visited)||r.visited.length>7)return null;let prev=null;for(const id of r.visited){const n=r.route.find(n=>n.id===id);if(!n||(prev?!prev.next.includes(id):n.row!==0))return null;prev=n;}if(r.current!==(prev?.id??null))return null;
 if(!Array.isArray(r.log)||r.log.some(x=>typeof x!=='string'||x.length>300)||!Array.isArray(r.rewards)||r.rewards.some(x=>!CARDS[x]))return null;
 if(['combat','victory','won','lost'].includes(r.phase)){const b=r.battle;if(!b||!Array.isArray(b.enemies)||!b.enemies.length||b.enemies.some(e=>!int(e.hp,0,e.maxHp)||!Array.isArray(e.moves))||!['draw','hand','discard'].every(k=>Array.isArray(b[k])&&b[k].every(c=>Object.hasOwn(CARDS,c))))return null;if(JSON.stringify([...b.draw,...b.hand,...b.discard].sort())!==JSON.stringify([...r.deck].sort()))return null;if(r.phase==='combat'&&(!r.hp||!b.enemies[b.target]?.hp))return null;}
 if(['shop','chest','mystery'].includes(r.phase)&&!r.room)return null;if(r.phase==='shop'&&(!Array.isArray(r.room.stock)||r.room.stock.some(x=>!int(x.price,0,1000)||!['card','potion','relic'].includes(x.kind)||(x.kind==='card'&&!CARDS[x.id])||(x.kind==='relic'&&!RELICS[x.id]))))return null;
 return r;
 }catch{return null;}}
