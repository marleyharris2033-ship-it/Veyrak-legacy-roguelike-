import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';

test('Ilyra starts with her own ten-card staff deck; Kaerun keeps his deck',()=>{
 const i=E.createRun('ILYRA','ilyra'),k=E.createRun('ILYRA','kaerun');
 assert.deepEqual(i.deck,E.ILYRA_STARTER);
 assert.equal(i.deck.length,10);
 assert.ok(i.deck.every(id=>E.CARDS[id].ilyra));
 assert.deepEqual(k.deck,E.STARTER);
 assert.ok(E.restore(E.serialise(i)));
});

test('Resonance builds to three, powers Ilyra’s strike and lasts until spent',()=>{
 const r=E.createRun('CHARGE','ilyra');E.enterBattle(r);
 const b=r.battle,e=b.enemies[0];e.hp=e.maxHp=100;e.block=0;
 b.hand=['arcbolt','arcbolt','arcbolt','corespark','resonantstrike'];r.core=10;
 for(let n=0;n<3;n++)assert.ok(E.playCard(r,0));
 assert.equal(b.resonance,3);assert.equal(e.hp,85);
 const before=r.core;assert.ok(E.playCard(r,0));assert.equal(r.core,before+1);assert.equal(b.resonance,3);
 assert.ok(E.playCard(r,0));assert.equal(e.hp,66);assert.equal(b.resonance,0);
});

test('Prism Ward consumes Resonance for next-turn protection and saves correctly',()=>{
 const r=E.createRun('WARD','ilyra');E.enterBattle(r);
 const b=r.battle;b.resonance=3;
 const saved=E.restore(E.serialise(r));assert.ok(saved);assert.equal(saved.battle.resonance,3);
 b.hand=['prismward'];r.core=3;
 b.enemies.forEach(e=>{e.moves=[{kind:'guard',value:0}];e.move=0;});
 assert.ok(E.playCard(r,0));assert.equal(b.resonance,0);assert.equal(r.block,7);assert.equal(b.barrier,6);
 E.endTurn(r);assert.equal(r.block,6);assert.equal(b.barrier,0);
});

test('card rewards respect each character’s signature cards',()=>{
 for(const hero of ['kaerun','ilyra'])for(let n=0;n<60;n++){
  const r=E.createRun('REWARD:'+n,hero);E.enterBattle(r);
  r.battle.enemies.forEach(e=>{e.hp=1;e.block=0;});r.battle.hand=['cleave'];r.core=3;
  assert.ok(E.playCard(r,0));assert.equal(r.phase,'victory');
  assert.ok(r.rewards.every(id=>hero==='ilyra'?!E.CARDS[id].kaerun:!E.CARDS[id].ilyra));
 }
});
