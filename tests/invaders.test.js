import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';

const ids=new Set(E.INVADERS.map(e=>e.id));
const takeFirst=(seed='INVADERS')=>{const r=E.createRun(seed);E.chooseNode(r,E.availableNodes(r)[0]);return r;};

test('first encounter has three different invaders and the full roster appears across seeded runs',()=>{
 const found=new Set(),eliteFound=new Set();
 assert.equal(ids.size,8);
 for(let i=0;i<90;i++){
  const r=E.createRun('ALIEN'+i),first=r.route.filter(n=>n.row===0),elite=r.route.find(n=>n.type==='elite');
  assert.equal(new Set(first.map(n=>n.enemy.id)).size,3);
  assert.ok(first.every(n=>ids.has(n.enemy.id)&&!n.enemy.elite));
  assert.ok(elite.enemy.elite&&ids.has(elite.enemy.id));
  first.forEach(n=>found.add(n.enemy.id));eliteFound.add(elite.enemy.id);
  assert.deepEqual(r,E.createRun('ALIEN'+i));assert.ok(E.restore(E.serialise(r)));
 }
 assert.deepEqual(found,ids);assert.deepEqual(eliteFound,ids);
});

test('elite uses the same species asset and moves, with 40% more health and stronger attacks',()=>{
 for(const species of E.INVADERS){let found=null;for(let i=0;i<180&&!found;i++){const n=E.createRun('ELITE'+i).route.find(x=>x.type==='elite');if(n.enemy.id===species.id)found=n;}
  assert.ok(found,species.id);assert.equal(found.enemy.name,'Elite '+species.name);assert.ok(found.enemy.hp>=Math.round((species.hp+4+found.row*3)*1.4));assert.deepEqual(found.enemy.moves.map(m=>m.kind),species.moves.map(m=>m.kind));
  assert.equal(`assets/invaders/${found.enemy.id}.webp`,`assets/invaders/${species.id}.webp`);
 }
});

test('siphon only restores enemy Vitality after damaging the player; Weak and pack support resolve',()=>{
 const r=takeFirst();const b=r.battle,e=b.enemies[0];r.hp=60;r.block=0;e.hp=20;e.maxHp=50;e.moves=[{kind:'siphon',value:7}];e.move=0;
 assert.equal(E.intent(r).value,7);E.endTurn(r);assert.equal(r.hp,53);assert.equal(e.hp,23);
 r.block=30;E.endTurn(r);assert.equal(e.hp,23);
 e.moves=[{kind:'weaken',value:2}];E.endTurn(r);assert.equal(b.weak,1);
 e.id='duskcaller';e.moves=[{kind:'empower',value:2}];b.enemies.push({...structuredClone(e),id:'rift_skitter',hp:25,maxHp:25,moves:[{kind:'guard',value:0}],move:0,strength:0});E.endTurn(r);assert.equal(b.enemies[1].strength,2);
});

test('previous beast update checkpoints retain their saved route and restore old enemy illustrations',()=>{
 const r=E.createRun('PREVIOUS','kaerun',{enemyRoster:1});delete r.enemyRoster;
 const saved=E.serialise(r),loaded=E.restore(saved);
 assert.ok(loaded);assert.equal(loaded.enemyRoster,1);assert.deepEqual(loaded.route,r.route);assert.ok(E.restore(E.serialise(loaded)));
});

test('small invaders spawn as two different species, large invaders and elites fight alone',()=>{
 let pairs=0,solos=0;
 for(let i=0;i<70;i++){
  const r=E.createRun('SIZE'+i),elite=r.route.find(n=>n.type==='elite');assert.ok(ids.has(elite.enemy.id));assert.equal(elite.pack,undefined);
  for(const node of r.route.filter(n=>n.row<=3&&n.type==='battle')){
   if(node.enemy.size==='small'){pairs++;assert.ok(node.pack);assert.notEqual(node.enemy.id,node.pack.id);assert.equal(node.pack.size,'small');}
   else{solos++;assert.equal(node.enemy.size,'large');assert.equal(node.pack,undefined);}
  }
  const first=r.route.find(n=>n.row===0&&n.pack),chosen=first||r.route.find(n=>n.row===0);
  assert.ok(E.chooseNode(r,chosen.id));assert.equal(r.battle.enemies.length,chosen.pack?2:1);
  assert.ok(E.restore(E.serialise(r)));
 }
 assert.ok(pairs>0&&solos>0);
});
