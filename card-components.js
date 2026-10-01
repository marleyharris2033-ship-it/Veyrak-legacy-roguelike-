import {CARD_ART} from './card-art.js?v=1';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function effectMarkup(text) {
 return text.split(/(?<=\.)\s+/).map(line => `<span>${escape(line).replace(/\b(Marked|Mark|Block|Strength|Vulnerable|Core|Exhaust|Resonance|Barrier|Poison|Weak|Vitality)\b/g, '<b>$1</b>')}</span>`).join('');
}
export function renderCard(id, cards, cls = '') {
 const card=cards[id], baseId=card.upgradeOf||id,art=CARD_ART[baseId];
 if(!art)throw new Error(`Missing card illustration: ${baseId}`);
 const theme=card.kaerun?'kaerun':card.ilyra?'ilyra':card.vaelis?'vaelis':'shared';
 const signature={kaerun:'KAERUN · THE UNBROKEN',ilyra:'ILYRA · THE CRYSTAL SEER',vaelis:'VAELIS · THE RIFTBLADE',shared:'SHARED TECHNIQUE'}[theme];
 const illustration=`<svg viewBox="${art.crop}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${art.src}" width="${art.width}" height="${art.height}"/></svg>`;
 return `<span class="ilyra-card component-card component-${theme} ${card.upgradeOf?'component-upgraded':''} ${cls}" role="img" aria-label="${escape(card.name)}, ${card.cost} Core. ${escape(card.text)}"><span class="component-heading"><b class="component-cost">${card.cost}<small>CORE</small></b><strong class="component-name">${escape(card.name)}</strong></span><span class="component-art">${illustration}</span><em class="component-type">${escape(card.type)}${card.upgradeOf?' · UPGRADED':''}</em><span class="component-effect">${effectMarkup(card.text)}</span><span class="component-footer">${signature}</span></span>`;
}
const statLabels={resonanceGain:'Resonance gained',resonanceDamage:'Damage per Resonance',resonanceBarrier:'Barrier per Resonance',resonanceHeal:'Healing per Resonance',nextBarrier:'Next-turn Barrier',draw:'Cards drawn',coreGain:'Core gained',poison:'Poison',poisonAll:'Poison on all enemies',poisonBonusBlock:'Extra Block against Poisoned',consumePoisonDamage:'Damage per Poison',multiplyPoison:'Poison multiplier',splash:'Damage to other enemies',siphon:'Healing',weaken:'Enemy damage reduction',executeDamage:'Finishing damage',revengeDamage:'Damage after losing Vitality',power:'Battle Strength',weak:'Weak',cost:'Core cost',damage:'Damage',mark:'Mark',markedDamage:'Damage against Marked',vulnerable:'Vulnerable',block:'Block',markedBonusBlock:'Extra Block against Marked',blockComboDamage:'Damage with 10+ Block',consumeMarkDamage:'Damage per Mark consumed',strength:'Strength',removeBlock:'Block removed',executeBonus:'Extra damage below 50% Health',markedStrength:'Strength against Marked'};
export function renderUpgradeChanges(before,after) {
 const changes=Object.entries(statLabels).filter(([key])=>typeof before[key]==='number'&&before[key]!==after[key]);
 if(!changes.length)return '';
 return `<ul class="upgrade-changes" aria-label="Upgrade improvements">${changes.map(([key,label])=>`<li><span>${label}</span><strong>${before[key]} <span aria-hidden="true">→</span><span class="sr-only"> to </span> ${after[key]}</strong></li>`).join('')}</ul>`;
}
