# Vaelis — The Riftblade

Vaelis is a poison duelist wielding dual blades. He unlocks at Account Rank 5.

## Account progression

Account XP is the sum of permanent Kaerun, Ilyra and Vaelis mastery XP. Existing XP counts. Rank uses the existing mastery curve: 120 XP to Rank 2, then 35 more per rank; Rank 5 requires 690 cumulative XP. Rank grants access to Vaelis and does not increase enemy stats or add combat bonuses. Hero mastery remains separate. XP earned before defeat is retained.

## Poison

Poison damages its owner before its enemy action, ignores Block, then decreases by one. It ticks even if that enemy is stunned. A lethal tick prevents the enemy action and awards normal encounter rewards. Damage from attack cards follows normal Block, Strength, Weak and Vulnerable rules; Poison ticks do not.

Venomcraft adds 1 extra Poison to Vaelis's first successful application each turn. For an area application, the first living target receives this bonus. Mastery improves this bonus at Levels 5 and 15. Poison has a safety cap of 999 stacks.

Mist Step evades one enemy hit, including one hit of a multi-hit attack. Unused evasion expires at the start of the next player turn. It cannot stack and the card Exhausts.

## Starter deck

3 Venom Cut, 3 Serpent Guard, 2 Toxic Primer, 1 Venom Rupture, 1 Mist Step. Slots 3, 6, 8 and 10 are flexible. The six fixed cards preserve poison application, defence and a finisher. The existing flexible-slot duplicate and cost limits apply.

## Exclusive cards

| Card | Core | Base effect |
| --- | --- | --- |
| Venom Cut | 1 | 5 damage; 2 Poison |
| Serpent Guard | 1 | 6 Block; 3 extra if target is Poisoned |
| Toxic Primer | 1 | Apply 4 Poison |
| Venom Rupture | 2 | 8 damage + 3 per Poison; consume target's Poison |
| Mist Step | 1 | 4 Block; evade next hit this turn; Exhaust |
| Serrated Fang | 1 | 7 damage; 3 Poison |
| Toxic Mist | 1 | Apply 2 Poison to every enemy |
| Virulent Study | 1 | Draw 2; apply 1 Poison |
| Venom Ward | 1 | 8 Block; 3 next-turn Barrier |
| Catalyst | 2 | Double target's Poison; Exhaust |
| Plague Edge | 2 | 6 damage and 3 Poison to every enemy |
| Death Bloom | 2 | Each enemy takes 7 + 2 per own Poison; consume their Poison; Exhaust |

Every card has an upgrade. Catalyst does nothing to a clean target; a successful increase can trigger Venomcraft. Echo repeats a finisher's base attack but cannot consume the same Poison twice.

Permanent starter collection choices occur at Levels 2, 4, 6 and 8. Three challenges award Toxic Mist (150 Poison applied), Catalyst (250 Poison tick damage) and Death Bloom (30 Poison tick kills). Challenge progress begins with this release.

## Validation

Automated tests cover account unlock boundaries, hero-specific reward pools, all 20 mastery save levels, poison timing and kills, finisher consumption, area effects, evasion, save migration, permanent challenges and the actual menu/deck/save handlers. Existing unrelated suite failures are recorded separately in the release report.
