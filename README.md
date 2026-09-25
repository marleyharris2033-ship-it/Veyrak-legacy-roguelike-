# Veyrak: Ascension

A browser roguelike set on Veyathuun. Choose Kaerun or Ilyra, cross the ten branching levels of Stage 1 and challenge the Gate Warden. Includes draggable cards, treasure, relics, merchants and capturable beast companions.

## Play locally

Run `npm start`, then open `http://localhost:4173`. Python 3 and Node 20+ are used for local serving and tests. No build step or third-party game dependencies. Serve over HTTP because the game uses JavaScript modules.

GitHub Pages publishes from `main` at the repository root. Asset/module paths support the repository subpath.

## First invasion

Stage 1 is the full ten-level ascent before the Gate Warden. Its enemy pool uses eight aliens from a single distant ecosystem: Rift Skitter, Mawback, Sable Spore, Gravetusk, Vesperwing, Hollowmaw, Thorncoil and Duskcaller. Four smaller species can spawn as pairs of distinct invaders; four larger species fight solo with greater health and damage. Any species may appear as a solo elite with the same portrait enlarged by 20%, 40% more health and 25% stronger attacks. Future stages can introduce different ecosystems and encounter mixes. Existing saves continue their original seeded route; begin a new ascent to use the latest Stage 1 generation.

Every new stage includes a visible **✧ Beast** encounter at level 8 or 9 on every path; species and rarity stay hidden until entered. The Stage 1 Beast is always Common. Later stages gradually favour Rare and Legendary variants, reaching 28% Common / 52% Rare / 20% Legendary in Stage 10. Existing saved runs retain their original seeded route. Beasts have more Vitality and stronger attacks than normal invaders; capture odds by rarity remain unchanged.

## Beastbound update

- Beast encounters are marked on the route map; their identity, rarity and role are revealed when entered.
- Rhazek attacks a chosen enemy; Dhoruun grants Block; Vaelith grants Core and boosts the next attack card; Syluun heals at most twice each battle.
- Beast rarity changes with stage: Stage 1 is 100% Common, while Stage 10 is 28% Common, 52% Rare and 20% Legendary. Rarer beasts have higher health, stronger attacks, better companion abilities and lower capture odds.
- Each new ascent starts with five Basic Shards. Merchants sell 3 Basic for 18 gold, 2 Refined for 36 gold and 1 Prismatic for 65 gold. Each pack can be purchased once per shop.
- Capture costs one Core and one shard. Odds increase down to 25% beast health. At that threshold Basic odds are 65% / 35% / 15% by rarity. Refined multiplies odds by 1.55; Prismatic by 2.3; all odds cap at 90%. The exact rounded chance is shown and used by the seeded roll.
- Failure gives the beast +2 Strength. Catching ends the encounter and awards its normal gold/card reward. Defeating a beast also earns the normal reward, but does not unlock it.
- Caught variants remain in the device-local bestiary, including after defeat or abandoning a run. Select one to start a new ascent, or swap between encounters. Swapping during combat is disabled. Duplicate catches do not create duplicate entries.
- Companion abilities are free, manual and have three-turn cooldowns (four for Vaelith). Cooldowns and uses reset at the next battle. Support's attack bonus expires at the end of the turn. Enemy artwork is horizontally mirrored to face the player; companions face enemies.
- Old v4 checkpoints preserve their existing routes; **start a new ascent for beast nodes**. Existing saves receive default shard/companion fields on restore.

## Ilyra starter deck

Ilyra uses her own ten-card staff deck: three Arc Bolts, three Crystal Guards, two Core Sparks, Resonant Strike and Prism Ward. Arc Bolt and Crystal Guard build Resonance (up to three); Core Spark adds one Core and one Resonance. Resonant Strike spends it for extra damage, while Prism Ward spends it on protection that carries into the next turn. Ilyra's five cards have matching violet card art and appear only in her reward pool. Kaerun's unique cards remain exclusive to him. Existing saved decks remain playable.

## Code and verification

- `engine.js`: DOM-free seeded gameplay and checkpoint validation.
- `beasts.js`: shared species, rarity, shard and bestiary definitions.
- `app.js`: menus, combat controls, autosave, bestiary and effects.
- `styles.css`: portrait/landscape layouts.
- `assets/beasts/`: the four approved creature illustrations, reused across rarity variants with UI rarity colours.
- `tests/`: combat, replay, routing, legacy saves, capture economy, rarity distribution and companion-limit checks.

Run `npm test`. All saves are local to this browser/device; clearing browser storage removes them. The run key remains `veyrak.ascension.run.v4` for compatibility. The permanent collection uses `veyrak.ascension.bestiary.v1`.
