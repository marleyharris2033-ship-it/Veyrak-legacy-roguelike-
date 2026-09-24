# Veyrak: Ascension

Stage-one playable foundation. A static browser game with the approved Veyathuun title and Council selection artwork, real responsive controls, and a short deterministic combat run.

## Play locally

Run `npm start` (Python 3 required), then open `http://localhost:4173`. No build step or third-party JavaScript dependencies. Serve over HTTP rather than opening `index.html` directly, because the game uses JavaScript modules.

For GitHub Pages, select **Settings → Pages → Deploy from a branch → main → /(root)**. All asset and module paths are relative and support the repository subpath.

## This stage

- Usable title menu, selection, archive, settings and pause dialog.
- Kaerun and Ilyra available; four other heroes visibly locked.
- Optional 32-character seed. Same seed and decisions reproduce enemy order, draws, and outcomes.
- Five linear encounters: four varied crystal guardians and a Gate Warden boss.
- Shared starter deck: five Strikes, four Guards and one Core surge. Draw five; three Core per turn; discard and reshuffle.
- Visible enemy intentions, Block, health, victory/defeat and an end-of-run summary.
- Browser-local autosave after every action; exact mid-battle resumption including RNG state and all piles.
- Archive of the last 30 ended runs, sound and reduced-motion settings.
- Responsive landscape and portrait layouts with keyboard-focusable controls and labelled health meters.

Stage two adds distinct hero mechanics, signature skills and hero-specific cards. The current two heroes intentionally share combat rules. Stage three adds branching events, rewards, relics and upgrades. Capture, companions and progression unlocks are not implemented in this stage. The current five encounters have no healing or rewards between battles.

## Code

- `engine.js`: DOM-free deterministic state machine and save validation.
- `app.js`: menu flow, accessible DOM controls, autosave, archive and effects.
- `styles.css`: responsive layout and visual styling.
- `assets/`: generated artwork derived from approved concepts and supplied character references. The approved selection sheet is displayed through CSS for the roster thumbnails; controls remain actual HTML buttons.
- `tests/engine.test.js`: deterministic replay, checkpoint restoration, action rules, damage, terminal states, corrupt saves and a 30-seed playthrough sample.

Run `npm test` with Node 20+. Save keys are namespaced and versioned (`veyrak.ascension.*.v1`) to avoid touching Veyrak: Legacy saves. Saves are local to each browser/device; clearing browser data removes them. This is a prototype foundation, not a content-complete release.
