import test from 'node:test';
import assert from 'node:assert/strict';
import {createRun,upgradeCard,shopUpgradeCard,restore,serialise,CARDS} from '../engine.js';

test('Sanctuary upgrades one copy and the upgraded effect survives reload',()=>{
 const r=createRun('SANCTUARY');r.phase='rest';
 assert.ok(upgradeCard(r,0));
 assert.equal(r.phase,'map');assert.equal(r.deck.filter(id=>id==='strike_up').length,1);
 assert.equal(r.deck.filter(id=>id==='strike').length,3);
 assert.equal(CARDS[r.deck[0]].damage,9);
 assert.deepEqual(restore(serialise(r)),r);
 assert.equal(upgradeCard(r,0),false);
});

test('Merchant upgrade charges once, changes only the chosen copy and persists',()=>{
 const r=createRun('MERCHANT','ilyra');r.phase='shop';r.room={stock:[]};r.gold=75;
 const index=r.deck.indexOf('arcbolt');
 assert.ok(shopUpgradeCard(r,index));
 assert.equal(r.gold,0);assert.equal(r.deck[index],'arcbolt_up');
 assert.equal(r.deck.filter(id=>id==='arcbolt').length,2);
 assert.equal(CARDS[r.deck[index]].damage,8);
 assert.equal(shopUpgradeCard(r,index),false);
 assert.deepEqual(restore(serialise(r)),r);
});
