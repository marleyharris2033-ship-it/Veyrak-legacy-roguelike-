import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';

// Execute the actual app handlers against a minimal DOM to verify the menu/save flow.
function appHarness(initial={}){
 const data=new Map(Object.entries(initial)),app={innerHTML:'',addEventListener(){}},notice={textContent:''},modal={innerHTML:'',open:false,addEventListener(){},showModal(){this.open=true;},close(){this.open=false;}},seed={value:'DECK-UI'};
 const context=vm.createContext({console,structuredClone,crypto:webcrypto,localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)},matchMedia:()=>({matches:false}),setTimeout:()=>0,clearTimeout(){},requestAnimationFrame(){},Image:class{},window:{addEventListener(){},scrollTo(){}},document:{title:'',querySelector:s=>({'#app':app,'#modal':modal,'#notice':notice,'#seed':seed}[s]||null),addEventListener(){},body:{classList:{toggle(){}}}}});
 const files=['progression.js','beasts.js','combat-feedback.js','starter-decks.js','engine.js','deck-builder.js','app.js'];
 const source=files.map(file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8').replace(/^import .*;$/gm,'').replace(/^export \{.*;$/gm,'').replace(/\bexport (?=(?:const|function|async function|class))/g,'')).join('\n');
 vm.runInContext(source,context);
 return {data,app,modal,eval:code=>vm.runInContext(code,context),click:(action,extras={})=>{context.nextAction={action,...extras};vm.runInContext('handle({target:{closest:()=>({dataset:nextAction,disabled:false})}})',context);}};
}
test('main menu opens Deck Builder with ten labelled slots and four editable slots',()=>{const h=appHarness();assert.match(h.app.innerHTML,/Deck Builder/);h.click('deck-builder');assert.equal((h.app.innerHTML.match(/class="starter-slot /g)||[]).length,10);assert.equal((h.app.innerHTML.match(/data-action="deck-slot"/g)||[]).length,4);assert.match(h.app.innerHTML,/Fixed · Hero foundation/);});
test('unlock, swap, save, reload and new ascent use the saved deck',()=>{const h=appHarness({'veyrak.ascension.progression.v1':JSON.stringify({kaerunXp:120,ilyraXp:0})});h.click('deck-builder');h.click('deck-unlock',{level:'2',id:'scout'});h.click('deck-pick',{id:'scout'});assert.match(h.app.innerHTML,/Unsaved changes/);h.click('deck-save');assert.match(h.app.innerHTML,/Saved starter deck/);const saved=h.data.get('veyrak.ascension.starter.v1');assert.equal(JSON.parse(saved).heroes.kaerun.loadout[0],'scout');const reloaded=appHarness(Object.fromEntries(h.data));reloaded.click('select');reloaded.click('start');assert.equal(reloaded.eval('run.deck[2]'),'scout');assert.equal(reloaded.eval('run.deck.length'),10);});
test('unsaved edits prompt before switching heroes and defaults do not change active runs',()=>{const h=appHarness();h.click('deck-builder');h.click('deck-pick',{id:'targetbreaker'});assert.match(h.app.innerHTML,/Unsaved changes/);h.click('deck-hero',{hero:'ilyra'});assert.equal(h.modal.open,true);h.click('deck-discard',{kind:'deck-hero',destination:'ilyra'});assert.match(h.app.innerHTML,/Ilyra · Level 1/);assert.equal(h.eval('deckDraft[0]'),'arcbolt');h.click('deck-back');h.click('select');h.click('start');const before=h.eval('JSON.stringify(run.deck)');h.click('title');h.click('deck-builder');h.click('deck-reset');h.click('deck-save');assert.equal(h.eval('JSON.stringify(run.deck)'),before);});
test('failed permanent save leaves collection and draft state uncommitted',()=>{const h=appHarness();h.click('deck-builder');h.click('deck-pick',{id:'targetbreaker'});h.eval('localStorage.setItem=()=>{throw Error("quota")};');h.click('deck-save');assert.equal(h.eval('starterCollection.heroes.kaerun.loadout[0]'),'strike');assert.equal(h.eval('deckDirty()'),true);});
