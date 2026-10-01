import test from 'node:test';
import assert from 'node:assert/strict';
import {createRun,enterBattle,endTurn,continueStage,restore,serialise} from '../engine.js';

test('levelled hero runs survive reload in map, combat and later stages',()=>{
 for(const hero of ['kaerun','ilyra','vaelis'])for(const level of [1,2,10,20]){
  const r=createRun(`SAVE-${hero}-${level}`,hero,{characterLevel:level});
  assert.deepEqual(restore(serialise(r)),r,`${hero} level ${level} at the map`);
  assert.ok(enterBattle(r));
  assert.deepEqual(restore(serialise(r)),r,`${hero} level ${level} in combat`);
  endTurn(r);
  assert.deepEqual(restore(serialise(r)),r,`${hero} level ${level} after a turn`);
  r.phase='stage-complete';r.battle=null;r.current=null;r.visited=[];
  assert.ok(continueStage(r));
  assert.deepEqual(restore(serialise(r)),r,`${hero} level ${level} at Stage 2`);
 }
});

test('restore accepts a legacy level-one checkpoint and rejects inconsistent Vitality',()=>{
 const legacy=createRun('OLD-SAVE');delete legacy.characterLevel;
 assert.equal(restore(serialise(legacy))?.characterLevel,1);
 const r=createRun('CORRUPT-SAVE','ilyra',{characterLevel:2});
 r.hp=r.maxHp+1;assert.equal(restore(serialise(r)),null);
 r.hp=80;r.maxHp=80;assert.equal(restore(serialise(r)),null);
 r.maxHp=82;r.characterLevel=21;assert.equal(restore(serialise(r)),null);
});
