import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';
import {captureFeedback,presentFeedback} from '../combat-feedback.js?v=1';
function battle(){const r=E.createRun('FEEDBACK');E.enterBattle(r);r.battle.enemies=r.battle.enemies.slice(0,1);return r;}
test('hero feedback reports health damage, absorbed damage and broken Block exactly',()=>{
 const r=battle(),e=r.battle.enemies[0];r.battle.hand=['strike'];r.core=3;e.block=4;const hp=e.hp;
 const x=captureFeedback(r,()=>E.playCard(r,0));assert.ok(x.ok);assert.equal(x.events.length,1);
 assert.deepEqual(x.events[0],{kind:'hit',source:'player',target:'enemy:0',damage:2,blocked:4,blockBreak:true,heavy:false});assert.equal(e.hp,hp-2);
 assert.ok(!E.serialise(r).includes('feedback'));assert.ok(!E.serialise(r).includes('events'));
});
test('fully blocked attacks and Echo area attacks produce individual accurate hits',()=>{
 const r=battle(),e=r.battle.enemies[0];e.hp=e.maxHp=100;e.block=20;r.battle.hand=['strike'];r.core=3;
 let x=captureFeedback(r,()=>E.playCard(r,0));assert.equal(x.events[0].damage,0);assert.equal(x.events[0].blocked,6);assert.equal(x.events[0].blockBreak,false);
 r.battle.enemies.push({...structuredClone(e),block:0});e.block=0;r.battle.echo=true;r.battle.hand=['cleave'];r.core=3;
 x=captureFeedback(r,()=>E.playCard(r,0));assert.equal(x.events.length,4);assert.deepEqual(x.events.map(e=>e.target),['enemy:0','enemy:1','enemy:0','enemy:1']);assert.ok(x.events.every(e=>e.damage===8));
});
test('enemy multi-hit feedback resolves Block per hit and does not treat guarding as damage',()=>{
 const r=battle(),e=r.battle.enemies[0];e.moves=[{kind:'attack',value:7,hits:2},{kind:'guard',value:9}];e.move=0;r.block=10;const hp=r.hp;
 let x=captureFeedback(r,()=>E.endTurn(r));assert.deepEqual(x.events.map(e=>[e.damage,e.blocked]),[[0,7],[4,3]]);assert.equal(r.hp,hp-4);assert.equal(x.events[1].blockBreak,true);
 x=captureFeedback(r,()=>E.endTurn(r));assert.deepEqual(x.events,[{kind:'guard',target:'enemy:0',text:'+9 Block'}]);
});
test('failed actions leave no feedback and capture listeners are always removed',()=>{
 const r=battle();r.core=0;const x=captureFeedback(r,()=>E.playCard(r,99));assert.equal(x.ok,false);assert.deepEqual(x.events,[]);
 assert.throws(()=>captureFeedback(r,()=>{throw Error('test');}));r.core=3;r.battle.hand=['strike'];E.playCard(r,0);assert.deepEqual(x.events,[]);
});
test('companion attack works without mastery and reports its actual hit',()=>{
 const r=battle();r.companion={id:'rhazek',rarity:'common'};const e=r.battle.enemies[0];e.hp=e.maxHp=100;e.block=2;
 const x=captureFeedback(r,()=>E.useCompanion(r));assert.ok(x.ok);assert.equal(x.events[0].source,'companion');assert.equal(x.events[0].blocked,2);assert.equal(x.events[0].damage,100-e.hp);assert.ok(x.events[0].damage>0);
});

test('presentation cleans up overlays, preserves sprite flips and suppresses motion when disabled',async t=>{
 const calls=[],nodes=[];
 const node=()=>({style:{},isConnected:true,children:[],setAttribute(){},appendChild(n){this.children.push(n);},remove(){this.removed=true;},getBoundingClientRect(){return {left:150,top:100,width:100,height:200};},animate(frames,options){calls.push({frames,options});return {cancel(){}};}});
 const player=node(),enemy=node(),arena=node(),body=node();
 t.mock.method(globalThis,'setTimeout',fn=>{queueMicrotask(fn);return 0;});
 t.mock.method(globalThis,'clearTimeout',()=>{});
 const doc={body,createElement(){const n=node();nodes.push(n);return n;},querySelector(s){return s==='.combat-hero'?player:s==='.arena'?arena:enemy;}};
 const previousDocument=globalThis.document,previousStyle=globalThis.getComputedStyle;
 globalThis.document=doc;globalThis.getComputedStyle=()=>({filter:'none'});
 try{
  const events=[{kind:'hit',source:'player',target:'enemy:0',damage:18,blocked:3,blockBreak:true,heavy:true}];
  await presentFeedback(events,{motion:true,hero:'ilyra'});
  assert.ok(nodes.some(n=>n.className==='combat-fx-trail crystal-bolt'));
  assert.ok(nodes.some(n=>n.textContent==='−18'));assert.ok(nodes.some(n=>n.textContent==='BLOCK BROKEN'));
  assert.ok(calls.some(c=>c.frames.some(f=>f.translate)));assert.ok(calls.every(c=>c.frames.every(f=>!Object.hasOwn(f,'transform'))));
  assert.ok(body.children.every(n=>n.removed));
  calls.length=0;nodes.length=0;await presentFeedback(events,{motion:false});
  assert.equal(calls.length,0);assert.ok(nodes.some(n=>n.textContent==='−18'));assert.ok(!nodes.some(n=>n.className?.includes('trail')));assert.ok(body.children.every(n=>n.removed));
 }finally{globalThis.document=previousDocument;globalThis.getComputedStyle=previousStyle;}
});
