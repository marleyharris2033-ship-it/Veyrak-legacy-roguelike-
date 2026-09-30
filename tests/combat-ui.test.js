import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as E from '../engine.js';
import {captureFeedback} from '../combat-feedback.js?v=1';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const actionSource=app.slice(app.indexOf('async function performCombatAction'),app.indexOf('function title()'));
function harness(r,presentFeedback){
 const states=[],saved=[];const ctx={run:r,feedbackBusy:false,feedbackVisible:new Set(),screen:'combat',settings:{motion:true},endTurn:E.endTurn,captureFeedback,presentFeedback,matchMedia:()=>({matches:false}),sound(){},persistAction(fn,...args){const ok=fn(r,...args);if(ok)saved.push(E.serialise(r));return ok;},render(){states.push({busy:ctx.feedbackBusy,visible:[...ctx.feedbackVisible],screen:ctx.screen});},navigate(next){ctx.screen=next;},Set};
 vm.createContext(ctx);vm.runInContext(actionSource,ctx);return {ctx,states,saved};
}
test('card actions lock duplicate inputs, retain defeated targets, save immediately and then show rewards',async()=>{
 const r=E.createRun('FINISH');E.enterBattle(r);r.battle.enemies.forEach(e=>e.hp=1);r.battle.hand=['cleave'];r.core=3;
 let finish,events;const h=harness(r,x=>{events=x;return new Promise(resolve=>finish=resolve);});
 const first=h.ctx.performCombatAction(E.playCard,0);
 assert.equal(r.phase,'victory');assert.equal(h.saved.length,1);assert.equal(h.ctx.feedbackBusy,true);
 assert.ok(h.states[0].visible.length>0);assert.ok(events.some(e=>e.damage===1));
 assert.equal(await h.ctx.performCombatAction(E.playCard,0),false);assert.equal(h.saved.length,1);
 finish();assert.equal(await first,true);assert.equal(h.ctx.feedbackBusy,false);assert.equal(h.ctx.screen,'victory');assert.equal(h.ctx.feedbackVisible.size,0);
});
test('presentation errors release combat inputs and return to the saved battle',async()=>{
 const r=E.createRun('SAFE');E.enterBattle(r);r.battle.hand=['guard'];r.core=3;
 const h=harness(r,()=>Promise.reject(Error('animation unavailable')));
 await assert.rejects(h.ctx.performCombatAction(E.playCard,0));assert.equal(h.ctx.feedbackBusy,false);assert.equal(h.ctx.screen,'combat');assert.equal(h.saved.length,1);
});
test('tap and drag share the same feedback action and both input paths honour the lock',()=>{
 assert.ok(app.includes('performCombatAction(playCard,d.index)'));
 assert.ok(app.includes("case 'play':modal.close();performCombatAction(playCard,Number(el.dataset.index))"));
 assert.ok(app.includes('if(feedbackBusy||Date.now()<suppressClickUntil)return'));
 assert.ok(app.includes("if(!el||feedbackBusy||run?.phase!=='combat'"));
});
