import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';

function stage2(seed='STAGE2',hero='kaerun'){
 const r=E.createRun(seed,hero);r.phase='stage-complete';assert.ok(E.continueStage(r));return r;
}
function reach(r,node){
 const path=[];let n=node;
 while(n.row>0){n=r.route.find(p=>p.next.includes(n.id));path.unshift(n.id);}
 r.visited=path;r.current=path.at(-1)??null;assert.ok(E.chooseNode(r,node.id));return r;
}
function bossRun(hero='kaerun'){
 const r=stage2('BOSS',hero);return reach(r,r.route.find(n=>n.type==='boss'));
}

test('Stage 2 scaling stays stronger late in the stage and preserves encounter sizes',()=>{
 const seen=new Set();
 for(let seed=0;seed<100;seed++){
  const r=stage2('SCALE'+seed);
  assert.deepEqual(r.route,stage2('SCALE'+seed).route);
  for(const n of r.route.filter(n=>['battle','elite'].includes(n.type))){
   const s=E.STAGE2_INVADERS.find(s=>s.id===n.enemy.id);seen.add(s.id);
   const oldHp=Math.round((s.hp+n.row*2)*(n.type==='elite'?1.35:1));
   assert.ok(n.enemy.hp>oldHp);
   assert.ok(n.enemy.hp<=Math.ceil(oldHp*1.23));
   const attacks=n.enemy.moves.filter(m=>m.kind==='attack');
   assert.ok(attacks.every(m=>m.value>s.moves.find(x=>x.name===m.name).value));
   if(n.type==='elite'||s.size==='large')assert.equal(n.pack,undefined);
   else{assert.equal(n.pack.size,'small');assert.notEqual(n.pack.id,s.id);}
  }
  assert.deepEqual(E.restore(E.serialise(r)),r);
 }
 assert.equal(seen.size,8);
});

test('boss heavy strike opens a full recovery turn, then vulnerability expires',()=>{
 const r=bossRun(),e=r.battle.enemies[0];assert.equal(e.maxHp,305);
 r.block=100;E.endTurn(r);assert.equal(e.block,24);assert.equal(E.intent(r).value,28);
 r.block=100;E.endTurn(r);assert.equal(e.block,0);assert.equal(e.vulnerable,1);assert.equal(E.intent(r).kind,'recover');
 r.battle.hand=['strike'];r.core=3;const hp=e.hp;assert.ok(E.playCard(r,0));assert.equal(hp-e.hp,9);
 const playerHp=r.hp;E.endTurn(r);assert.equal(r.hp,playerHp);assert.equal(e.vulnerable,0);
 assert.equal(E.intent(r).hits,2);assert.equal(E.intent(r).value,12);
 r.block=5;E.endTurn(r);assert.equal(playerHp-r.hp,19);
});

test('half-health enrage preserves the announced attack and survives save/reload',()=>{
 for(const hero of ['kaerun','ilyra']){
  const r=bossRun(hero),e=r.battle.enemies[0];r.block=100;E.endTurn(r);
  e.hp=153;e.block=0;e.vulnerable=0;r.battle.hand=['strike'];r.core=3;
  // Keep card zones consistent for a genuine saved combat checkpoint.
  r.deck=['strike','strike','strike','strike','strike'];r.battle.draw=['strike','strike','strike','strike'];r.battle.discard=[];
  const announced=E.intent(r);E.playCard(r,0);assert.equal(e.phase,2);assert.deepEqual(E.intent(r),announced);
  const loaded=E.restore(E.serialise(r));assert.ok(loaded);assert.deepEqual(loaded,r);
  r.block=100;loaded.block=100;E.endTurn(r);E.endTurn(loaded);assert.deepEqual(r,loaded);
  assert.equal(E.intent(r).kind,'recover');E.endTurn(r);assert.equal(E.intent(r).value,13);assert.equal(E.intent(r).hits,2);
  r.block=100;E.endTurn(r);assert.equal(E.intent(r).value,18);E.endTurn(r);assert.equal(E.intent(r).value,32);
 }
});

test('existing Stage 2 saves update future fights without healing active monsters',()=>{
 const r=stage2('OLD');const first=r.route.find(n=>n.row===0&&n.type==='battle');reach(r,first);
 const active=r.battle.enemies[0];delete active.balanceRevision;active.hp-=5;
 for(const n of r.route){delete n.enemy.balanceRevision;if(n.pack)delete n.pack.balanceRevision;}
 const before=structuredClone(active),loaded=E.restore(E.serialise(r));assert.ok(loaded);
 assert.deepEqual(loaded.battle.enemies[0],before);
 assert.equal(loaded.route.find(n=>n.type==='boss').enemy.hp,305);
 assert.ok(loaded.route.filter(n=>n.row>0&&['battle','elite'].includes(n.type)).every(n=>n.enemy.balanceRevision===2));
 assert.deepEqual(E.restore(E.serialise(loaded)),loaded);
});

test('legacy active boss keeps health and its announced move before switching to new cycle',()=>{
 const r=bossRun(),e=r.battle.enemies[0];delete e.balanceRevision;e.maxHp=285;e.hp=240;
 e.moves=[{kind:'guard',value:20},{kind:'charge',value:0},{kind:'attack',value:24},{kind:'attack',value:11,hits:2}];e.move=2;
 const announced=E.intent(r),loaded=E.restore(E.serialise(r));assert.ok(loaded);
 assert.equal(loaded.battle.enemies[0].hp,240);assert.deepEqual(E.intent(loaded),announced);
 const savedAgain=E.restore(E.serialise(loaded));assert.deepEqual(savedAgain,loaded);
 loaded.block=100;E.endTurn(loaded);assert.equal(E.intent(loaded).kind,'guard');assert.equal(E.intent(loaded).value,24);
});
