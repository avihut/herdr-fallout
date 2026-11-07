# Source and workflow

This repository is the authoritative Fallout source. Edit `mods/fallout`, `layouts`, and `themes` here; installed config copies are deployment outputs. Use pnpm and the tasks in `mise.toml`. Use daft for branches/worktrees; commit the team `daft.yml`.

- `mise run test`: pure game/telemetry and isolated installer tests.
- `mise run check`: all native roles through the installed `herdr-app check`.
- `mise run install`: guarded initial install. `mise run install-update`: explicit replacement with backups. Never restart Herdr or silently switch its current layout.
- Read the local Herdr config's `AGENTS.md`, then `CLAUDE.md` when available, and [docs/LAYOUT_GUIDE.md](docs/LAYOUT_GUIDE.md) before runtime changes. Those local files are not repository files and must not be published.
- Maintain the portable guide when verified lessons or requirements change. Keep local config references as inline code, not broken relative links.
- Preserve native root layout properties, `place:none` before mod JavaScript, the native switcher, actual names/statuses, honest host telemetry and reduced motion. No animation redraw timers.
- Public previews must use synthetic data or original vectors. Never commit live terminal screenshots, logs, credentials, shared state, settings or personal absolute paths. Coordinate live-window QA and restore the previous layout/appearance.
