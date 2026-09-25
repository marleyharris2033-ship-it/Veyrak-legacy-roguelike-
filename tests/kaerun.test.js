import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';

test('Kaerun gains Block once per turn by hitting a Marked foe',()=>{
 const r=E.createRun('PRESSURE','kaerun');E.enterBattle(r);
 const b=r.battle,e=b.enemies[0];e.hp=e.maxHp=100;e.block=0;
 e.moves=[{kind:'guard',value:0}];e.move=0;
 b.hand=['targetbreaker','strike','strike'];r.core=10;
 assert.ok(E.playCard(r,0));assert.equal(e.mark,3);
 assert.ok(E.playCard(r,0));assert.equal(r.block,3);assert.equal(b.pressureUsed,true);
 assert.ok(E.playCard(r,0));assert.equal(r.block,3);
 E.endTurn(r);assert.equal(e.mark,2);assert.equal(b.pressureUsed,false);
 b.hand=['strike'];r.core=10;assert.ok(E.playCard(r,0));assert.equal(r.block,3);
 E.endTurn(r);assert.equal(e.mark,1);
 E.endTurn(r);assert.equal(e.mark,0);
 b.hand=['strike'];r.core=10;assert.ok(E.playCard(r,0));assert.equal(r.block,0);
});

test('Gauntlet Pressure survives a save and belongs only to Kaerun',()=>{
 const r=E.createRun('SAVE-PRESSURE');E.enterBattle(r);
 assert.equal(E.restore(E.serialise(r)).battle.pressureUsed,false);
 r.battle.pressureUsed=true;
 assert.equal(E.restore(E.serialise(r)).battle.pressureUsed,true);
 const i=E.createRun('NO-PRESSURE','ilyra');E.enterBattle(i);
 i.battle.enemies[0].mark=2;i.battle.hand=['arcbolt'];i.core=3;
 assert.ok(E.playCard(i,0));assert.equal(i.block,0);assert.equal(i.battle.pressureUsed,false);
});
