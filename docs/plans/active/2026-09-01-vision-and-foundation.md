# omarchy_website — vision and foundation

## What it is

A design pitch for omarchy.org, submitted to DHH: the homepage stays
exactly what it is — same copy, same videos, same structure — but it can
wear community-made themes. A dismissible "malleable bar" at the top
carries everything new: the current theme's name and credit, the motto
"we can fix everything", a button to try another theme, and a one-sentence
box that asks Claude to build a brand-new theme live. The site is the
demo of Omarchy's own promise: the malleable homepage.

## Pillars

1. **The content never changes.** Only CSS, scenery artwork, and the bar
   are added. The page copy is byte-faithful to the live omarchy.org.
2. **Theme switching is playful and obvious** — the five-second dissolve,
   the loading chip, seed themes with overt 80s illustrations and
   animations.
3. **Submitting a theme is frictionless**: one sentence, no sign-up.
   Identity is asked only after the theme exists, and "anonymous" is a
   first-class answer.
4. **Open source, like its subject.** MIT license, mirroring Omarchy's
   own. No secrets and no infrastructure addresses in the repo — the
   Anthropic key and every other secret live only in the production
   box's environment.

## Locked decisions

- Repo: `obliquesoft/omarchy_website`, public, MIT.
- Class: ONCE (SQLite + Solid trio + Thruster) on the work `once-prod`
  box. Dev port base 3060.
- **No auth, no voting, no admin in v1.** Submissions are rate-limited
  per IP, and generation is capped at **100 generated themes total** so
  production can never burn unbounded tokens. When the cap is reached,
  the submit flow says so kindly and keeps the seed themes playable.
- Seed themes (the fifteen from the approved mock) are static code and
  artwork, not database rows. The database stores only generated themes.
- A generated theme is **palette values only** — the model returns a
  name, a nod line, and eight RGB triplets; the server validates each
  triplet strictly before anything reaches a stylesheet. Raw CSS or
  markup from the model is never rendered.
- The frontend intentionally skips the house Tailwind/ViewComponent
  system: the design IS omarchy.org's own stylesheet, captured verbatim,
  plus the malleable layer. This deviation is the point of the app.
- Captured site assets are served from `public/site/` (not `/assets`,
  which belongs to Propshaft).

## Phases

1. Scaffold + ONCE kit + docs + config safety. (this document's commit)
2. Backend TDD: Theme model, palette validation, submission endpoint
   with the Claude API behind a stubbed service object, claim endpoint,
   per-IP rate limit, the 100-theme cap.
3. Frontend port: the captured page as ERB partials, the malleable bar
   reading seed + generated themes from the page's embedded JSON.
4. GitHub + ghcr + MIT license + README.
5. Deploy to the work ONCE box; DNS; Anthropic key into the box
   environment (Lee's hands); prove a live generation end to end.

## Definition of done

The site is live on its hostname, byte-faithful to omarchy.org, the
dissolve and bar work, a stranger can describe a theme in a sentence and
watch the page wear a Claude-built palette within seconds, claim it or
stay anonymous, and the 101st generation request is politely refused.
