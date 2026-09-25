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
export function companionDescription(x){if(!validBeast(x))return '';const s=RARITIES[x.rarity];return x.id==='rhazek'?`Deal ${s.damage} damage to the chosen enemy.`:x.id==='dhoruun'?`Gain ${s.block} Block this turn.`:x.id==='vaelith'?`Gain ${s.energy} Core. Your next attack card this turn deals ${s.boost}% more damage.`:`Restore ${s.heal} Vitality. Maximum twice per battle.`;}
export function restoreBestiary(raw){const empty={seen:[],caught:[],selected:null};try{const data=JSON.parse(raw);if(!data)return empty;for(const key of ['seen','caught'])for(const x of Array.isArray(data[key])?data[key]:[])addDiscovery(empty[key],x);for(const x of empty.caught)addDiscovery(empty.seen,x);if(validBeast(data.selected)&&empty.caught.some(x=>beastKey(x)===beastKey(data.selected)))empty.selected={id:data.selected.id,rarity:data.selected.rarity};return empty;}catch{return empty;}}
