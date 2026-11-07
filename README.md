# Fallout — a Pip-Boy field console for Herdr

**Your settlements. Your companions. One more holotape before the next quest.**

An independent Fallout-inspired layout that turns Herdr's native interface into a field console: olive instrument panels, green or amber phosphor, a companion ledger, a RobCo-style password trainer, and an original courier puzzle. Your terminals remain the main work surface, with real workspace names and agent reports throughout.

![Original schematic of the Fallout layout, showing the five Pip-Boy sections, settlement and companion lists, quest tabs, and a terminal](layouts/fallout.svg)

*Original SVG showcase with synthetic content. This is a schematic preview; no private terminal output is pictured.*

[Install](#install-your-field-console) · [Console tour](#tour-the-console) · [Play the holotapes](#two-playable-holotapes) · [Discoveries](#maintenance-records-and-discoveries) · [Build and verify](#source-and-development)

## At a glance

- **Five Pip-Boy sections:** STAT, INV, DATA, MAP and RADIO, each with a useful role in daily work.
- **Native Herdr controls:** workspace and tab navigation, agent focus, contextual menus, pane splits, zoom and an integrated layout switcher.
- **Two complete games:** positional-likeness password training and a turn-based route puzzle, with restart, victory, loss and saved achievements.
- **Six discovery badges:** maintenance records, a friendly service robot, a bottle cap, a lost transmission and two game rewards.
- **A configurable field console:** green or amber controls, deliberate light/dark appearances, reduced motion and optional reward chimes.
- **Measured host status:** local network and hardware-aware battery readings on macOS, with explicit unknown states.

The layout uses native GPUI controls and original vector artwork. It ships no extracted game graphics, fonts or soundtrack.

## Tour the console

Start in **DATA** to find your existing work. The top bar changes the sidebar's field screen while your terminals stay in place. Quest tabs sit above the terminal area; the bottom status strip keeps attention objectives and local host readings within reach.

| Section | What you find | What you can do |
| --- | --- | --- |
| **STAT** | Live workspace and companion counts, exact agent statuses, and attention objectives | Focus an agent that needs input or has finished unseen; meet the field service robot |
| **DATA** | Your actual settlements/workspaces and companions/agents | Select a workspace, focus an agent, create a workspace, or right-click a row for targeted actions |
| **MAP** | Machines, their reported layout readiness, and their workspaces | Travel to a workspace or open machine settings; the map is a schematic, not a physical location display |
| **INV** | Two holotapes, collected badges, hacking wins and the courier best score | Launch a game, revisit your collection, or inspect a pre-war keepsake |
| **RADIO** | An explicitly fictional visual station and a tuning record | Watch the native signal animation, inspect 101.1, or enable optional reward chimes |

### The world maps to your work

| Fallout label | Herdr reality |
| --- | --- |
| Settlement | A workspace, with its original name and machine |
| Quest | A tab, with its actual name, selection and parked state |
| Companion | An agent, with its actual title, address and status |
| Console | A terminal pane with normal focus and terminal interaction |
| Attention objective | An agent reporting `blocked` or `done` |
| Relay map | Machines and their real workspace/layout availability |

`working`, `blocked`, `done` and `idle` retain Herdr's meanings. **Blocked** means the agent needs your input; **done** means it finished unseen. There are no invented health meters or progress percentages for your agents.

### Everyday controls

| Control | Action |
| --- | --- |
| **Fallout ▾** | Open the native layout menu, see the active layout and switch layouts |
| **Quest strip / +** | Select a tab or create a new one |
| **Right-click a settlement, quest or companion** | Open actions for that specific object |
| **Pane ··· / zoom button** | Split, zoom, close or peek at the targeted pane/terminal |
| **OBJECTIVES** in the bottom bar | Focus the first agent needing attention, or open STAT when none is pending |
| **? / MANUAL** | Read the in-app field manual, discover hints and launch either game |
| **EJECT ×** in a game or record | Close that overlay and return to work |

The layout menu follows Herdr's replacement conventions, hides replaced built-ins, marks the active layout and uses titles such as **Windows 98** and **Windows XP**. Terminal keys and text selection remain native; the layout does not add global key bindings.

## Two playable holotapes

Open **INV**, choose a tape and take a short detour. Both games are local simulations: no terminal credentials, agent work or real resources are involved. Game boards start fresh when reopened; earned badges and records persist.

### Holotape 01 — Password Trainer

A compact RobCo-style deduction game, inspired by Fallout's positional-likeness hacking mechanic.

1. Pick a password from **12 four-letter candidates**.
2. Read the **likeness**: the number of letters matching the secret in the same position.
3. Use the feedback to narrow the candidates before your **four attempts** run out.
4. Explore the paired bracket tokens for assistance, or choose **NEW SEED** to begin a fresh round.

```text
C O L D
C O R D
✓ ✓ · ✓    LIKENESS 3/4
```

A correct letter in the wrong position does not count. Repeating a guess, choosing a removed word or clicking after the round ends costs no extra attempt. Each bracket token is usable once per board: two remove a dud without removing the answer, and one restores four attempts. A training lockout stays inside the game; bracket bonuses cannot unlock a lost round.

**Win:** solve the password to earn **Hacker** and increase your solved-hack count. **Lose:** exhaust your attempts; the answer is revealed and NEW SEED is available.

### Holotape 02 — Wasteland Courier

An original **7×7 route puzzle** with a deliberately tight fuel budget. Collect all three caches, then reach the vault exit in **22 moves or fewer**.

| Symbol | Meaning |
| --- | --- |
| `@` | You, the courier |
| `·` | Open ground |
| `#` | An obstruction |
| `C` | A cache to collect |
| `V` | The vault exit |

Move with **arrow keys**, **WASD**, the on-screen direction buttons, or by clicking an adjacent tile. Keyboard movement applies while the courier dialog has focus. Each valid orthogonal move costs one fuel; walls, out-of-bounds moves and diagonal jumps cost nothing. A collected cache is counted once.

Plan the whole delivery: reaching V without all three caches is not a win. The shortest complete route is **exactly 22 moves**, verified by breadth-first search. Delivering the last cache load on your final fuel unit wins; running out elsewhere loses.

**Win:** earn **Pathfinder** and record your best move count. **REWIND** restarts the entire board. There is no clock, so you can study the route at your own pace.

## Maintenance records and discoveries

Some controls carry a little more history than their labels suggest. The field manual offers gentle hints; INV keeps the badges you collect. The fictional memos and jokes are original Herdr adaptations inspired by Fallout lore.

<details>
<summary><strong>Open the maintenance archive — six discovery spoilers</strong></summary>

| Badge | How to discover it | What opens |
| --- | --- | --- |
| **Overseer** | Tap the vault iris in the header three times | A vault-door maintenance memo and a very patient committee |
| **Good Neighbor** | Pet the service robot in STAT | A greeting from the keeper of the spare screws |
| **Cap Collector** | Inspect the bottle cap in INV | A pre-war refreshment keepsake |
| **Lone Wanderer** | Inspect frequency 101.1 in RADIO | A fictional maintenance transmission with a Vault 13 reference |
| **Hacker** | Win Password Trainer | A recorded training achievement and win counter |
| **Pathfinder** | Complete Wasteland Courier | A delivery badge and best-move record |

The discoveries open local lore cards or award badges. They never type into terminals, close workspaces, change agent permissions or send messages. Preferences, records and discoveries use the layout-specific `fallout.*` shared-state namespace.

</details>

## Tune the display

| Preference | Where | Behavior |
| --- | --- | --- |
| **PHOSPHOR: GREEN / AMBER** | Bottom of the sidebar | Changes the console's accent palette while preserving the terminal ANSI palette |
| **MOTION: ON / REDUCED** | Bottom of the sidebar | Enables or stops the working-dot pulse and simulated radio-bar motion |
| **REWARD CHIME: MUTED / ON** | RADIO | Opts into Herdr's local `done` chime when a new badge is awarded; muted by default |
| **Light / dark appearance** | Herdr's appearance setting | Selects the layout's corresponding console theme |

Dark mode uses olive metal and pale phosphor. Light mode uses lighter instrument panels and deeper green or amber lettering. **Both keep a dark CRT terminal surface.** Running terminal applications can retain explicit dark backgrounds and pale text; keeping the terminal dark preserves readable prompts, code and diffs when the surrounding console changes appearance.

Motion uses GPUI's native renderer. There are no JavaScript animation redraw timers. RADIO is a fictional visual signal: no station is streamed, and no music is bundled.

## Local network and battery status

The bottom bar reads the **local computer**, separately from the remote machines shown in MAP. On macOS it runs two read-only commands every 30 seconds: `/usr/sbin/scutil --nwi` and `/usr/bin/pmset -g batt`. An in-flight guard prevents overlapping probes. No external telemetry service or Internet connectivity probe is used.

| Display | Meaning |
| --- | --- |
| **LINK UP** | At least one active local interface was reported; this is **not proof of Internet access** |
| **LINK DOWN** | The probe reported no active local network interfaces |
| **LINK ?** | The probe failed, returned an unrecognized result, or the platform is unsupported |
| **Battery icon + percentage** | Battery hardware was detected and a recognized reading is available |
| **CHARGING / AC / BAT** | Charging, AC power or battery power, as reported by the host |
| **BAT ?** | Battery hardware is known, but its current reading failed or is unrecognized |
| **No battery icon** | No battery hardware was reported, or none has yet been detected |

Hover for interface details and sampling time, or battery detail. On platforms other than macOS, host network status is unknown and the battery icon is omitted; no Windows or Linux probe is implemented.

## Install your field console

You need **Herdr.app with native GPUI mod support**, **Node.js 22+** and **pnpm** for the development/installation scripts. The setup below uses **daft** and **mise**; mise selects Node 24 and the pinned pnpm version. The installed layout itself runs inside Herdr and has no Node.js runtime dependency or third-party package dependencies.

```sh
daft clone https://github.com/avihut/herdr-fallout.git --layout contained
cd herdr-fallout/main
mise trust
mise install
mise run test
mise run check     # requires herdr-app on PATH
mise run install   # installs this layout into the local Herdr config
```

Then select **Fallout** in Herdr's layout settings or an existing native layout menu. Its layout identifier is `fallout`.

**`mise install` installs developer tools. `mise run install` installs the layout.** Installation leaves the current layout, appearance and shared state unchanged and does not restart Herdr. No node_modules directory is required to run the tests or scripts.

### Update an existing installation

```sh
mise run install-update
```

The initial installer refuses any existing Fallout target before replacing files. The update task explicitly permits replacement and first backs up the prior Fallout paths under:

```text
~/.config/herdr-app/backups/fallout/<timestamp>/
```

The installer writes `mod.json` with `place: none` before executable JavaScript, then installs themes and the preview, and writes the layout last. It preserves unrelated settings, key bindings, layouts and mods; refuses symlinked targets; and rolls back its own paths if installation fails. Updates preserve extra files in the existing Fallout mod directory and include them in the backup.

Keep the backup if you may want to revert. Select another layout before manually restoring only the backed-up Fallout paths.

For an alternate config directory or a disposable installation:

```sh
pnpm run install:layout --config-dir /path/to/herdr-config
pnpm run install:layout --config-dir /path/to/herdr-config --update
```

## Source and development

**This repository is the authoritative source.** Edit here and deploy through the installer rather than changing installed copies.

| Command | Purpose |
| --- | --- |
| `mise run test` | Run game, telemetry and isolated installer tests through pnpm |
| `mise run check` | Materialize and check all ten native roles with `herdr-app check` |
| `mise run install` | Perform a guarded first installation |
| `mise run install-update` | Back up and explicitly update Fallout's installed files |

| Source | Responsibility |
| --- | --- |
| [`layouts/fallout.json`](layouts/fallout.json) | Native layout tree, terminal framing and root look properties |
| [`themes/`](themes/) | Light and dark themes with readable terminal colors |
| [`mods/fallout/main.js`](mods/fallout/main.js) | Console screens, pane/tab controls, menus, help, lore and live footer |
| [`mods/fallout/kit.js`](mods/fallout/kit.js) | Native controls, palette, overlays and badge rewards |
| [`mods/fallout/games.js`](mods/fallout/games.js) / [`game.js`](mods/fallout/game.js) | Game interfaces and independently testable rules |
| [`mods/fallout/telemetry.js`](mods/fallout/telemetry.js) | Pure parsing of local host readings |
| [`mods/fallout/assets/`](mods/fallout/assets/) | Original iris, robot and relay SVG artwork |
| [`scripts/`](scripts/) / [`tests/`](tests/) | Installer, native role checks and automated tests |

Read [RECIPE.md](RECIPE.md) for the reconstruction recipe and acceptance checks, and [docs/LAYOUT_GUIDE.md](docs/LAYOUT_GUIDE.md) for the portable research, design and validation workflow. [AGENTS.md](AGENTS.md) records repository maintenance rules.

### Validation and current limits

- **16 automated tests** cover likeness, attempts, bracket behavior, game outcomes, the courier's 22-move solution, telemetry states, and isolated installation/conflict/update/backup/symlink/rollback behavior.
- **All ten native roles** pass the standalone checker: top, sidebar, tabs, pane, footer, menu, help, hack, salvage and dossier.
- **Live UI validation** exercised light and dark appearances, the native menu and actual layout switching, both game victories, agent navigation/context actions, a hidden record, green/amber controls and reduced motion. The prior layout and appearance were restored afterward.
- **Telemetry limits:** failure, disconnected and alternate battery states are covered by parser fixtures; they were not all physically reproduced on hardware. Non-macOS host probes are not implemented.
- **Coverage limits:** native initial-render checks do not prove every window geometry or interaction state. The source's overlapping-probe guard and stricter unknown parsing were checked and fixture-tested after live visual QA, without reinstalling during publication.

Only the original SVG schematic is published. Live QA screenshots remain private because they contain terminal conversations.

## Research and credits

The visual language and interactions were researched before choosing the Herdr mappings. Canonical inspiration and original adaptations are kept distinct:

| Reference | What it informed |
| --- | --- |
| Bethesda's [Fallout 3 PC manual](https://cdn.akamai.steamstatic.com/steam/apps/22300/manuals/fallout3_us_pc_manual.pdf), printed pp. 12–13 and 35 | DATA navigation, quest objectives, positional-likeness hacking, limited attempts and paired-bracket assistance |
| [Pip-Boy Operational Instructions](https://fallout.fandom.com/wiki/Pip-Boy_Operational_Instructions), a community-hosted transcript of Bethesda's booklet | The STAT / INV / DATA / MAP / RADIO section vocabulary |
| Bethesda's [Nuka Tapper holotape description](https://gear.bethesda.net/products/fallout-nuka-tapper-holotape-replica-satin-nickel-bethesda-gear-exclusive) | Game-bearing holotapes as a natural home for optional playable features |
| [Prima's Fallout 4 Pip-Boy guide](https://primagames.com/eguides/fallout-4-eguide/stat/status/the-pip-boy-a-robco-industries-technological-wonder) | DATA's Quests and Workshops, supporting the settlement/workspace metaphor |

Wasteland Courier, the three SVG emblems and the maintenance-card writing are original work. Settlements, quests and companions are interface metaphors; they do not rename your agents after fictional characters or change Herdr's underlying model. Existing Windows 98 and XP layouts were studied for native integration and discoverability; their assets and gameplay code were not copied.

Typography uses **Geist Mono**, supplied by Herdr. No font files are redistributed here. Original code, documentation and SVG artwork are covered by the [MIT license](LICENSE); [NOTICE.md](NOTICE.md) records font attribution and third-party trademark scope. This is an unofficial fan interface, with no affiliation or endorsement implied.

## Another console to explore

For a different command-center atmosphere, visit the sibling **[Herdr Evangelion layout](https://github.com/avihut/herdr-evangelion)**. Both projects share an emphasis on native controls, real workspace data, playable diversions and documented installation.
