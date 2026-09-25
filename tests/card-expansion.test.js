import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';

function fight(hero='kaerun'){
 const r=E.createRun('CARD-EXPANSION',hero);E.enterBattle(r);
 for(const e of r.battle.enemies){e.hp=e.maxHp=100;e.block=0;e.moves=[{kind:'guard',value:0}];e.move=0;}
 r.core=10;return r;
}

test('both heroes have twelve exclusive cards and a substantial shared reward pool',()=>{
 const cards=Object.entries(E.CARDS);
 assert.equal(cards.filter(([,c])=>c.kaerun).length,12);
 assert.equal(cards.filter(([,c])=>c.ilyra).length,12);
 assert.equal(cards.filter(([,c])=>!c.kaerun&&!c.ilyra).length,28);
 assert.ok(cards.filter(([,c])=>c.modernArt).every(([,c])=>c.text&&Number.isInteger(c.cost)));
 for(const hero of ['kaerun','ilyra']){
  const seen=new Set();
  for(let n=0;n<120;n++){
   const r=E.createRun(`REWARD-PARITY-${n}`,hero);E.enterBattle(r);
   for(const e of r.battle.enemies){e.hp=1;e.block=0;}
   r.battle.hand=['cleave'];r.core=10;E.playCard(r,0);
   assert.equal(r.phase,'victory');
   for(const id of r.rewards){seen.add(id);assert.ok(!['strike','guard'].includes(id));assert.ok(hero==='ilyra'?!E.CARDS[id].kaerun:!E.CARDS[id].ilyra);}
  }
  assert.ok([...seen].some(id=>E.CARDS[id][hero]),`${hero} class card offered`);
  assert.ok([...seen].some(id=>!E.CARDS[id].kaerun&&!E.CARDS[id].ilyra),`${hero} shared card offered`);
 }
});

test('Focus cycles, Mark setup has a distinct payoff and Fortress needs Mark for Strength',()=>{
 const r=fight(),b=r.battle,e=b.enemies[0];b.hand=['focus','targetbreaker','fortressstance'];b.draw=['strike'];
 E.playCard(r,0);assert.equal(r.core,10);assert.ok(b.hand.includes('strike'));
 E.playCard(r,0);assert.equal(e.mark,3);
 E.playCard(r,0);assert.equal(r.block,10);assert.equal(b.strength,1);
 const other=fight();other.battle.hand=['fortressstance'];E.playCard(other,0);assert.equal(other.battle.strength,0);
});

test('unplayed Exhaust card discards; played card Exhausts exactly once',()=>{
 const r=fight(),b=r.battle;b.hand=['sovereignimpact'];
 E.endTurn(r);assert.ok(b.discard.includes('sovereignimpact'));assert.ok(!b.exhaust.includes('sovereignimpact'));
 b.hand=['sovereignimpact'];r.core=10;E.playCard(r,0);
 assert.ok(b.exhaust.includes('sovereignimpact'));
});

test('Ilyra rewards build and spend Resonance on area damage, wards and one-use healing',()=>{
 const r=fight('ilyra'),b=r.battle,e=b.enemies[0];
 b.hand=['arcsplit','prismstudy','corechannel','latticeward'];b.draw=['arcbolt','guard'];
 E.playCard(r,0);assert.equal(e.hp,96);assert.equal(b.resonance,1);
 E.playCard(r,0);assert.equal(b.resonance,2);
 E.playCard(r,0);assert.equal(b.resonance,3);
 E.playCard(r,0);assert.equal(r.block,4);assert.equal(b.barrier,4);assert.equal(b.resonance,3);
 b.hand=['crystallance'];E.playCard(r,0);assert.equal(e.hp,74);assert.equal(b.resonance,0);
 r.hp=60;b.resonance=2;b.hand=['resonantmend'];E.playCard(r,0);
 assert.equal(r.hp,64);assert.equal(b.resonance,0);assert.equal(r.block,10);assert.ok(b.exhaust.includes('resonantmend'));
 const aoe=fight('ilyra');aoe.battle.enemies.push(structuredClone(aoe.battle.enemies[0]));aoe.battle.resonance=3;aoe.battle.hand=['fracturefield'];
 E.playCard(aoe,0);assert.deepEqual(aoe.battle.enemies.map(x=>x.hp),[88,88]);assert.equal(aoe.battle.resonance,0);
});

test('new shared cards cover attack, protection, draw and debuffs for both heroes',()=>{
 for(const hero of ['kaerun','ilyra']){
  const r=fight(hero),b=r.battle,e=b.enemies[0];
  b.hand=['shieldbash','fortify','suppress','scout','piercingray'];b.draw=['strike','guard'];
  E.playCard(r,0);assert.equal(e.hp,95);assert.equal(r.block,4);
  E.playCard(r,0);assert.equal(r.block,9);assert.equal(b.barrier,3);
  E.playCard(r,0);assert.equal(e.weak,2);
  E.playCard(r,0);assert.ok(b.hand.includes('strike'));
  e.block=20;E.playCard(r,0);assert.equal(e.block,0);assert.equal(e.hp,85);
  E.endTurn(r);assert.equal(r.block,3);
 }
});
