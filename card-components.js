// Illustration windows exclude all baked-in labels. Both versions share one source.
export const KAERUN_ART = {
 targetbreaker: 'targetbreaker.png',
 sovereignbrand: 'sovereign_brand.png', markedforruin: 'marked_for_ruin.png',
 unbrokenguard: 'unbroken_guard.png', crushingadvance: 'crushing_advance.png',
 sovereignimpact: 'sovereign_impact.png', relentless: 'relentless.png',
 bloodrush: 'blood_rush.png', shatterarmourkaerun: 'shatter_armour.png',
 execution: 'execution.png', fortressstance: 'fortress.png',
 gauntletsmash: null
};
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function effectMarkup(text) {
 return text.split(/(?<=\.)\s+/).map(line => `<span>${escape(line).replace(/\b(Marked|Mark|Block|Strength|Vulnerable|Core|Exhaust)\b/g, '<b>$1</b>')}</span>`).join('');
}
export function renderKaerunCard(id, cards, cls = '') {
 const card=cards[id], baseId=card.upgradeOf||id;
 if(!Object.hasOwn(KAERUN_ART,baseId)) throw new Error(`Missing Kaerun illustration: ${baseId}`);
 const sheet=baseId==='gauntletsmash';
 const src=sheet?'assets/kaerun-cards.jpg':`assets/card-masks/${KAERUN_ART[baseId]}`;
 const crop=sheet?'982 126 224 194':baseId==='targetbreaker'||baseId==='fortressstance'?'40 118 230 182':'40 108 230 190';
 const illustration=`<svg viewBox="${crop}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${src}" width="${sheet?1536:307}" height="${sheet?1024:490}"/></svg>`;
 return `<span class="ilyra-card component-card component-kaerun ${card.upgradeOf?'component-upgraded':''} ${cls}" role="img" aria-label="${escape(card.name)}, ${card.cost} Core. ${escape(card.text)}"><span class="component-heading"><b class="component-cost">${card.cost}<small>CORE</small></b><strong class="component-name">${escape(card.name)}</strong></span><span class="component-art">${illustration}</span><em class="component-type">${escape(card.type)}${card.upgradeOf?' · UPGRADED':''}</em><span class="component-effect">${effectMarkup(card.text)}</span><span class="component-footer">KAERUN · THE UNBROKEN</span></span>`;
}
const statLabels={cost:'Core cost',damage:'Damage',mark:'Mark',markedDamage:'Damage against Marked',vulnerable:'Vulnerable',block:'Block',markedBonusBlock:'Extra Block against Marked',blockComboDamage:'Damage with 10+ Block',consumeMarkDamage:'Damage per Mark consumed',strength:'Strength',removeBlock:'Block removed',executeBonus:'Extra damage below 50% Health',markedStrength:'Strength against Marked'};
export function renderUpgradeChanges(before,after) {
 if(!before.kaerun)return '';
 const changes=Object.entries(statLabels).filter(([key])=>typeof before[key]==='number'&&before[key]!==after[key]);
 return `<ul class="upgrade-changes" aria-label="Upgrade improvements">${changes.map(([key,label])=>`<li><span>${label}</span><strong>${before[key]} <span aria-hidden="true">→</span><span class="sr-only"> to </span> ${after[key]}</strong></li>`).join('')}</ul>`;
}
