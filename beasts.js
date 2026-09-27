// Shared catalogue for encounters, companions and the device-local bestiary.
export const BEASTS = {
 rhazek: {name:'Rhazek',title:'The Amber Predator',role:'Attacker',ability:'Sundering Pounce',colour:'#ffbd58',cooldown:3,hp:40,moves:[{kind:'attack',value:9},{kind:'guard',value:5},{kind:'attack',value:14}]},
 dhoruun: {name:'Dhoruun',title:'The Ivory Bastion',role:'Protector',ability:'Aegis Carapace',colour:'#79d9d0',cooldown:3,hp:48,moves:[{kind:'guard',value:14},{kind:'attack',value:10},{kind:'attack',value:8}]},
 vaelith: {name:'Vaelith',title:'The Crystalwing',role:'Support',ability:'Resonance Cry',colour:'#bb90ff',cooldown:4,hp:38,moves:[{kind:'empower',value:2},{kind:'attack',value:9},{kind:'attack',value:11}]},
 syluun: {name:'Syluun',title:'The Jade Guardian',role:'Healer',ability:'Renewal Pulse',colour:'#8be2b3',cooldown:3,hp:42,moves:[{kind:'attack',value:9},{kind:'heal',value:6},{kind:'attack',value:11}]}
};
export const RARITIES = {
 common:{name:'Common',weight:65,hp:1,attack:1,damage:12,block:14,energy:1,boost:25,heal:6,capture:.65,floor:.18},
 rare:{name:'Rare',weight:28,hp:1.25,attack:1.18,damage:15,block:18,energy:1,boost:40,heal:8,capture:.35,floor:.08},
 legendary:{name:'Legendary',weight:7,hp:1.55,attack:1.38,damage:18,block:22,energy:2,boost:50,heal:10,capture:.15,floor:.025}
};
export const SHARDS = {
 basic:{name:'Basic Shard',multiplier:1,price:18,quantity:3,description:'Standard capture odds.'},
 refined:{name:'Refined Shard',multiplier:1.55,price:36,quantity:2,description:'1.55× basic capture odds.'},
 prismatic:{name:'Prismatic Shard',multiplier:2.3,price:65,quantity:1,description:'2.3× basic capture odds.'}
};
export function validBeast(x){return !!x&&Object.hasOwn(BEASTS,x.id)&&Object.hasOwn(RARITIES,x.rarity);}
export function beastKey(x){return `${x.id}:${x.rarity}`;}
export function addDiscovery(list,x){if(validBeast(x)&&!list.some(b=>beastKey(b)===beastKey(x)))list.push({id:x.id,rarity:x.rarity});}
export const BEAST_MAX_LEVEL=10;
export const BEAST_XP_REWARDS={battle:10,elite:18,beast:20,boss:35};
export function beastXpForLevel(level){return level>=BEAST_MAX_LEVEL?0:40+(level-1)*20;}
export function beastLevelFromXp(xp){xp=Math.max(0,Math.floor(xp)||0);let level=1,spent=0;while(level<BEAST_MAX_LEVEL){const need=beastXpForLevel(level);if(xp-spent<need)break;spent+=need;level++;}return {level,xpInto:level>=BEAST_MAX_LEVEL?0:xp-spent,xpNeeded:beastXpForLevel(level)};}
export function beastBonuses(level){level=Math.max(1,Math.min(BEAST_MAX_LEVEL,Math.floor(level)||1));return {multiplier:1+Math.min(6,Math.max(0,level-1))*.05+Math.max(0,level-7)*.05,minor:level>=4,enhanced:level>=7,mastery:level>=10};}
export function companionDescription(x,level=1){if(!validBeast(x))return '';const s=RARITIES[x.rarity],m=beastBonuses(level).multiplier,scale=n=>Math.max(1,Math.round(n*m));return x.id==='rhazek'?`Deal ${scale(s.damage)} damage to the chosen enemy.`:x.id==='dhoruun'?`Gain ${scale(s.block)} Block this turn.`:x.id==='vaelith'?`Gain ${s.energy} Core. Your next attack card this turn deals ${scale(s.boost)}% more damage.`:`Restore ${scale(s.heal)} Vitality. Usable every 3 turns for the whole battle.`;}
export function restoreBestiary(raw){const empty={seen:[],caught:[],selected:null,xp:{}};try{const data=JSON.parse(raw);if(!data)return empty;for(const key of ['seen','caught'])for(const x of Array.isArray(data[key])?data[key]:[])addDiscovery(empty[key],x);for(const x of empty.caught)addDiscovery(empty.seen,x);if(data.xp&&typeof data.xp==='object')for(const id of Object.keys(BEASTS)){const v=data.xp[id];if(Number.isFinite(v)&&v>=0)empty.xp[id]=Math.floor(v);}if(validBeast(data.selected)&&empty.caught.some(x=>beastKey(x)===beastKey(data.selected)))empty.selected={id:data.selected.id,rarity:data.selected.rarity};return empty;}catch{return empty;}}
