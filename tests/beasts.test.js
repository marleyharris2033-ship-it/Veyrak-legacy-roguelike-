import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';
import {restoreBestiary,addDiscovery} from '../beasts.js';
function encounter(seed='BEASTS'){
 for(let attempt=0;attempt<500;attempt++){
  const r=E.createRun(seed+':'+attempt),node=r.route.find(n=>n.row===0&&n.type==='beast');
  if(node){assert.ok(E.chooseNode(r,node.id));return r;}
 }
 assert.fail('Could not find a seeded opening beast encounter.');
}
function next(r){r.block=999;E.endTurn(r);}
test('beasts have a 20% seeded chance per stage, never occupy two nodes in one stage, and all variants appear',()=>{
 const counts={common:0,rare:0,legendary:0},species=new Set(),stageHits=Array(10).fill(0);let zeroRuns=0,multiRuns=0;
 for(let i=0;i<1000;i++){
  const r=E.createRun('SPAWN'+i);assert.deepEqual(r,E.createRun('SPAWN'+i));const nodes=r.route.filter(n=>n.type==='beast');
  if(nodes.length===0)zeroRuns++;if(nodes.length>1)multiRuns++;
  for(let row=0;row<10;row++){const rowNodes=nodes.filter(n=>n.row===row);assert.ok(rowNodes.length<=1);if(rowNodes.length)stageHits[row]++;}
  for(const n of nodes){species.add(n.enemy.beast);counts[n.enemy.rarity]++;assert.ok(n.next.length);}
 }
 assert.equal(species.size,4);for(const hits of stageHits)assert.ok(hits>150&&hits<260,`stage beast rate out of range: ${hits}`);
 assert.ok(zeroRuns>0&&multiRuns>0);assert.ok(counts.common>counts.rare&&counts.rare>counts.legendary);
});
test('new wild beasts are materially tougher even at Common rarity',()=>{
 let r,e;
 for(let attempt=0;attempt<500;attempt++){r=E.createRun('TOUGH:'+attempt);const node=r.route.find(n=>n.row===0&&n.type==='beast'&&n.enemy.rarity==='common');if(node){E.chooseNode(r,node.id);e=r.battle.enemies[0];break;}}
 assert.ok(e);const base=E.BEASTS[e.beast];assert.ok(e.maxHp>=Math.round((base.hp+10)*1.35));const attacks=e.moves.filter(m=>m.kind==='attack').map(m=>m.value);assert.ok(attacks.length&&Math.max(...attacks)>=14);
});
test('capture odds improve with weakening and shard quality; rarity lowers them',()=>{
 const r=encounter(),e=r.battle.enemies[0];
 for(const rarity of Object.keys(E.RARITIES)){e.rarity=rarity;e.hp=e.maxHp;const full=E.captureChance(r);e.hp=1;assert.ok(E.captureChance(r)>full);assert.ok(E.captureChance(r,'refined')>E.captureChance(r));assert.ok(E.captureChance(r,'prismatic')>=E.captureChance(r,'refined'));assert.ok(E.captureChance(r,'prismatic')<=90);}
 e.rarity='common';assert.equal(E.captureChance(r),65);e.rarity='rare';assert.equal(E.captureChance(r),35);e.rarity='legendary';assert.equal(E.captureChance(r),15);
 assert.equal(E.captureChance(r,'invalid'),0);
});
test('capture consumes exactly one shard/Core; failures enrage, successes persist and reward once',()=>{
 let successes=0,failures=0;
 for(let i=0;i<40;i++){const r=encounter('CATCH'+i),e=r.battle.enemies[0];e.hp=1;const core=r.core,gold=r.gold;assert.ok(E.captureBeast(r));assert.equal(r.shards.basic,4);assert.ok(E.restore(E.serialise(r)));if(r.captureResult.caught){successes++;assert.equal(r.phase,'victory');assert.equal(r.capturedBeasts.length,1);assert.equal(r.companion.id,e.beast);assert.equal(r.gold,gold+30);assert.equal(E.captureBeast(r),false);assert.equal(r.shards.basic,4);}else{failures++;assert.equal(r.core,core-1);assert.equal(e.strength,2);assert.equal(r.gold,gold);}}
 assert.ok(successes>0&&failures>0);
});
test('ordinary enemies cannot be captured; empty shards and insufficient Core do not spend RNG',()=>{
 const r=encounter(),before=E.serialise(r);r.core=0;const rng=r.rng;assert.equal(E.captureBeast(r),false);assert.equal(r.rng,rng);assert.equal(r.shards.basic,5);r.core=3;r.shards.basic=0;assert.equal(E.captureBeast(r),false);assert.equal(r.rng,rng);
 const ordinary=E.createRun('A');E.enterBattle(ordinary);assert.equal(E.captureChance(ordinary),0);assert.equal(E.captureBeast(ordinary),false);assert.notEqual(before,'');
});
test('checkpoint preserves capture rolls, discovered variants and companion cooldowns',()=>{
 const r=encounter(),loaded=E.restore(E.serialise(r));assert.deepEqual(r,loaded);E.captureBeast(r);E.captureBeast(loaded);assert.deepEqual(r,loaded);
});
test('companion attacks selected enemy independently, with cooldown; cannot swap during combat',()=>{
 const r=encounter();r.companion={id:'rhazek',rarity:'rare'};const e=r.battle.enemies[0];e.hp=e.maxHp=100;e.block=3;r.battle.strength=20;r.battle.enemies.push({...structuredClone(e),block:0});E.selectTarget(r,1);const core=r.core;assert.ok(E.useCompanion(r));assert.equal(e.hp,100);assert.equal(r.battle.enemies[1].hp,85);assert.equal(r.core,core);assert.equal(E.useCompanion(r),false);assert.equal(E.equipCompanion(r,{id:'syluun',rarity:'common'},[{id:'syluun',rarity:'common'}]),false);
 next(r);next(r);assert.equal(E.companionReady(r),false);next(r);assert.equal(E.companionReady(r),true);
});
test('protector gives temporary Block, support grants capped Core and boosts only next attack card',()=>{
 const r=encounter();r.companion={id:'dhoruun',rarity:'legendary'};r.block=0;assert.ok(E.useCompanion(r));assert.equal(r.block,22);next(r);assert.equal(r.block,0);
 r.companion={id:'vaelith',rarity:'legendary'};r.battle.companionCooldown=0;r.core=9;assert.ok(E.useCompanion(r));assert.equal(r.core,10);assert.equal(r.battle.companionBoost,50);
 const e=r.battle.enemies[0];e.hp=e.maxHp=100;e.block=0;r.battle.strength=0;r.battle.hand=['strike','strike'];E.playCard(r,0);assert.equal(e.hp,91);assert.equal(r.battle.companionBoost,0);E.playCard(r,0);assert.equal(e.hp,85);
});
test('healer cannot stall for unlimited healing; full health does not spend a use',()=>{
 const r=encounter();r.companion={id:'syluun',rarity:'common'};r.hp=80;assert.equal(E.useCompanion(r),false);assert.equal(r.battle.companionUses,0);r.hp=40;assert.ok(E.useCompanion(r));assert.equal(r.hp,46);assert.equal(E.useCompanion(r),false);next(r);next(r);next(r);assert.ok(E.useCompanion(r));assert.equal(r.hp,52);next(r);next(r);next(r);assert.equal(E.useCompanion(r),false);assert.equal(r.battle.companionUses,2);
});
test('shops sell shard packs once, require coins and persist remaining stock',()=>{
 const r=E.createRun('SHOP');r.phase='shop';r.room={stock:[{kind:'shard',id:'refined',quantity:2,price:36,sold:false}]};assert.ok(E.buy(r,0));assert.equal(r.gold,24);assert.equal(r.shards.refined,2);assert.equal(E.buy(r,0),false);assert.ok(E.restore(E.serialise(r)));r.room.stock.push({kind:'shard',id:'prismatic',quantity:1,price:65,sold:false});assert.equal(E.buy(r,1),false);
});
test('legacy checkpoints retain routes and receive safe beast defaults',()=>{
 const r=E.createRun('LEGACY','kaerun',{legacy:true,beastSystem:1});for(const key of ['beastSystem','beastRoutes','shards','seenBeasts','capturedBeasts','companion','captureResult'])delete r[key];const loaded=E.restore(E.serialise(r));assert.ok(loaded);assert.deepEqual(loaded.route,r.route);assert.equal(loaded.shards.basic,5);assert.equal(loaded.beastRoutes,false);assert.ok(E.restore(E.serialise(loaded)));
});
test('bestiary removes corrupt entries, deduplicates variants and locks uncaught selections',()=>{
 const data=restoreBestiary(JSON.stringify({caught:[{id:'rhazek',rarity:'rare'},{id:'rhazek',rarity:'rare'},{id:'evil',rarity:'rare'}],selected:{id:'syluun',rarity:'legendary'}}));assert.equal(data.caught.length,1);assert.equal(data.seen.length,1);assert.equal(data.selected,null);addDiscovery(data.caught,{id:'rhazek',rarity:'legendary'});assert.equal(data.caught.length,2);
 const r=E.createRun('SELECT');assert.equal(E.equipCompanion(r,{id:'syluun',rarity:'legendary'},data.caught),false);assert.ok(E.equipCompanion(r,data.caught[0],data.caught));assert.equal(r.companion.rarity,'rare');assert.ok(E.equipCompanion(r,null,data.caught));assert.equal(r.companion,null);
});
