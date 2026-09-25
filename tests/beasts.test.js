import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';
import {restoreBestiary,addDiscovery} from '../beasts.js';
function encounter(seed='BEASTS'){
 const r=E.createRun(seed,'kaerun',{beastSystem:1}),node=r.route.find(n=>n.type==='beast'),prev=r.route.find(n=>n.row===0&&n.next.includes(node.id));
 E.chooseNode(r,prev.id);r.battle.enemies[0].hp=1;
 for(let i=0;i<10&&r.phase==='combat';i++){const attack=r.battle.hand.findIndex(id=>E.CARDS[id].damage&&E.CARDS[id].cost<=r.core);if(attack>=0)E.playCard(r,attack);else E.endTurn(r);}
 assert.equal(r.phase,'victory');E.advance(r);assert.ok(E.chooseNode(r,node.id));return r;
}
function next(r){r.block=999;E.endTurn(r);}
test('every new stage has one unavoidable Beast level near the boss, with unchanged rarity odds',()=>{
 const counts={common:0,rare:0,legendary:0},species=new Set(),levels=new Set();
 for(let i=0;i<2000;i++){
  const r=E.createRun('SPAWN'+i);assert.deepEqual(r,E.createRun('SPAWN'+i));const nodes=r.route.filter(n=>n.type==='beast');
  assert.equal(nodes.length,3);const n=nodes[0];assert.ok(n.row===7||n.row===8);assert.ok(nodes.every(x=>x.row===n.row));assert.equal(new Set(nodes.map(x=>x.col)).size,3);levels.add(n.row);species.add(n.enemy.beast);counts[n.enemy.rarity]++;assert.ok(n.next.length);
 }
 assert.equal(levels.size,2);assert.equal(species.size,4);assert.ok(counts.common>1200&&counts.common<1400);assert.ok(counts.rare>480&&counts.rare<640);assert.ok(counts.legendary>80&&counts.legendary<200);
 const later=E.createRun('LATER');later.phase='stage-complete';assert.ok(E.continueStage(later));assert.equal(later.route.filter(n=>n.type==='beast').length,3);
 const saved=E.createRun('OLDER','kaerun',{beastSystem:3});assert.ok(E.restore(E.serialise(saved)));
});
test('new wild beasts are materially tougher even at Common rarity',()=>{
 let e;
 for(let attempt=0;attempt<1000&&!e;attempt++){const r=E.createRun('TOUGH:'+attempt),node=r.route.find(n=>n.type==='beast'&&n.enemy.rarity==='common');if(node)e=node.enemy;}
 assert.ok(e);const base=E.BEASTS[e.beast];assert.ok(e.hp>=Math.round((base.hp+10+7*4)*1.35*1.12));const attacks=e.moves.filter(m=>m.kind==='attack').map(m=>m.value);assert.ok(attacks.length&&Math.max(...attacks)>=18);
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
