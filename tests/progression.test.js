import test from 'node:test';
import assert from 'node:assert/strict';
import {kaerunLevelFromXp,kaerunBonuses,xpForNextKaerunLevel,ilyraLevelFromXp,ilyraBonuses} from '../progression.js';

test('Kaerun begins at level 1 and caps at 20',()=>{
 assert.equal(kaerunLevelFromXp(0).level,1);
 assert.equal(kaerunLevelFromXp(1_000_000).level,20);
});

test('Kaerun XP curve rises each level',()=>{
 assert.ok(xpForNextKaerunLevel(2)>xpForNextKaerunLevel(1));
 assert.ok(xpForNextKaerunLevel(10)>xpForNextKaerunLevel(5));
 assert.equal(xpForNextKaerunLevel(20),0);
});

test('level 5 grants resetting guard without changing Core regeneration',()=>{
 const b=kaerunBonuses(5);
 assert.equal(b.turnBlock,5);
 assert.equal(b.startingCore,1);
});

test('milestone passives scale without damage inflation',()=>{
 const l10=kaerunBonuses(10),l15=kaerunBonuses(15),l20=kaerunBonuses(20);
 assert.equal(l10.markBlock,2);
 assert.equal(l15.markedAttackBlock,2);
 assert.equal(l20.turnBlock,7);
 assert.equal(l20.sovereign,true);
 assert.equal('damage' in l20,false);
});

test('Ilyra progression expands Resonance without direct damage inflation',()=>{assert.equal(ilyraLevelFromXp(0).level,1);assert.equal(ilyraBonuses(1).resonanceCap,3);assert.equal(ilyraBonuses(10).resonanceCap,4);assert.equal(ilyraBonuses(20).resonanceCap,5);assert.equal(ilyraBonuses(5).startingResonance,1);assert.equal(ilyraBonuses(15).spendBarrier,3);assert.equal('damage' in ilyraBonuses(20),false);});
