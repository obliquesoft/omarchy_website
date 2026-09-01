# omarchy_website

The malleable homepage: a design pitch for omarchy.org. The page is a
byte-faithful copy of the live omarchy.org homepage that can wear
community themes. A dismissible bar at the top names the theme, credits
its maker, and lets anyone describe a new theme in one sentence — Claude
builds the palette live. Open source (MIT), like Omarchy itself.

## Hard boundaries

- **Secrets**: never open, edit, or script against `config/master.key`,
  `config/credentials.yml.enc`, or `config/credentials/`. Lee runs every
  credential edit himself. Secret values never enter a conversation
  transcript. This is a public repo: the Anthropic key and all other
  secrets live only in the production box's environment — never in any
  file here.
- **No infrastructure addresses in the repo**: no server IPs, no box
  hostnames. Deploy targets are given on the command line at deploy time.
- **Operations**: `git push` never deploys. Deploys are explicit
  (`bin/ship`, then the ONCE update).
- **Locked decisions stay locked** — see
  `docs/plans/active/2026-09-01-vision-and-foundation.md`.

## The one rule of the product

**The page content never changes.** Copy, links, and video embeds are
verbatim omarchy.org. Themes may only add CSS custom properties, scenery
artwork, and the malleable bar. A generated theme is validated palette
values only — never raw CSS or markup from a model.

## Stack and layout

- Rails 8, SQLite + Solid trio + Thruster, ONCE class. Dev port base
  3060 (`bin/up`). `bin/prod-run` = local production parity check.
- The captured omarchy.org page lives in ERB partials under
  `app/views/homepage/`; its stylesheet/font/image/wasm assets are
  static files under `public/site/` (`/assets` belongs to Propshaft).
- The malleable layer (bar, themes, scenery) is in `public/site/malleable/`.
- Seed themes are static code + artwork. The database stores only
  generated themes (capped at 100, rate-limited per IP).
- The original design mock this app grew from is preserved under
  `docs/references/design/mocks/omarchy-malleable-homepage/`.

## Development loop

TDD, always: First run the tests → Specify → Red → Green → Refactor.
Minitest. `bin/rails test` must be green and `bin/rubocop` clean before
any commit. Commit messages are one plain line.

## Writing style

Simplified Technical English everywhere Lee reads: full names, no
invented abbreviations, plain words.
