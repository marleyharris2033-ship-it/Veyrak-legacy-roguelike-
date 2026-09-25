# Veyrak: Ascension

A browser roguelike set on Veyathuun. Choose Kaerun or Ilyra, follow ten branching stages and challenge the Gate Warden. Includes draggable cards, treasure, relics, merchants and capturable beast companions.

## Play locally

Run `npm start`, then open `http://localhost:4173`. Python 3 and Node 20+ are used for local serving and tests. No build step or third-party game dependencies. Serve over HTTP because the game uses JavaScript modules.

GitHub Pages publishes from `main` at the repository root. Asset/module paths support the repository subpath.

## First invasion

The first zone (stages 1–4) now uses eight aliens from a single distant ecosystem: Rift Skitter, Mawback, Sable Spore, Gravetusk, Vesperwing, Hollowmaw, Thorncoil and Duskcaller. Each seed offers three different species at stage one. Four smaller species spawn as pairs of distinct invaders; four larger species fight solo with greater health and damage. Any species may appear as a solo elite with the same portrait enlarged by 20%, 40% more health and 25% stronger attacks. Later zones retain their earlier encounters while their own creature sets are developed. Existing saves continue their original seeded route; begin a new ascent to see the invaders.

Unvisited combat nodes are deliberately anonymous on the map: normal battles, elites and wild-beast encounters all appear as **Encounter** until entered. On new ascents, each of the ten pre-boss stages independently has a 40% chance to contain one hidden wild-beast node, with a maximum of one beast node in that stage. Beast rolls replace ordinary battle nodes where possible so shops, treasure, sanctuaries and elites stay available. Beast species are shuffled across a run to reduce immediate repetition. New-system wild beasts have substantially more Vitality and stronger attacks even at Common rarity; capture odds are unchanged.

## Beastbound update

- Beast nodes appear at stages 2, 5 and 8 as optional branches. The map reveals rarity and role; the creature is revealed in combat.
- Rhazek attacks a chosen enemy; Dhoruun grants Block; Vaelith grants Core and boosts the next attack card; Syluun heals at most twice each battle.
- Each encounter rolls Common (65%), Rare (28%) or Legendary (7%). Rarer beasts have higher health, stronger attacks, better companion abilities and lower capture odds.
- Each new ascent starts with five Basic Shards. Merchants sell 3 Basic for 18 gold, 2 Refined for 36 gold and 1 Prismatic for 65 gold. Each pack can be purchased once per shop.
- Capture costs one Core and one shard. Odds increase down to 25% beast health. At that threshold Basic odds are 65% / 35% / 15% by rarity. Refined multiplies odds by 1.55; Prismatic by 2.3; all odds cap at 90%. The exact rounded chance is shown and used by the seeded roll.
- Failure gives the beast +2 Strength. Catching ends the encounter and awards its normal gold/card reward. Defeating a beast also earns the normal reward, but does not unlock it.
- Caught variants remain in the device-local bestiary, including after defeat or abandoning a run. Select one to start a new ascent, or swap between encounters. Swapping during combat is disabled. Duplicate catches do not create duplicate entries.
- Companion abilities are free, manual and have three-turn cooldowns (four for Vaelith). Cooldowns and uses reset at the next battle. Support's attack bonus expires at the end of the turn. Enemy artwork is horizontally mirrored to face the player; companions face enemies.
- Old v4 checkpoints preserve their existing routes; **start a new ascent for beast nodes**. Existing saves receive default shard/companion fields on restore.

## Code and verification

- `engine.js`: DOM-free seeded gameplay and checkpoint validation.
- `beasts.js`: shared species, rarity, shard and bestiary definitions.
- `app.js`: menus, combat controls, autosave, bestiary and effects.
- `styles.css`: portrait/landscape layouts.
- `assets/beasts/`: the four approved creature illustrations, reused across rarity variants with UI rarity colours.
- `tests/`: combat, replay, routing, legacy saves, capture economy, rarity distribution and companion-limit checks.

Run `npm test`. All saves are local to this browser/device; clearing browser storage removes them. The run key remains `veyrak.ascension.run.v4` for compatibility. The permanent collection uses `veyrak.ascension.bestiary.v1`.
