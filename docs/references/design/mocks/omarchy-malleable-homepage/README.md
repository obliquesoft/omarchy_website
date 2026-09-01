# Omarchy malleable homepage — malleable bar mock

A design mock for omarchy.org built on a verbatim capture of the live site
(captured 2026-09-01 from https://omarchy.org, including its CSS, fonts,
JetBrains Mono files, the laser-etch WASM logo animation runtime, and the
official SVG logo from /brand/). The page content, copy, and video embeds are
byte-identical to the live site — index.html only adds two stylesheets and one
script in the head.

Everything new lives in `malleable/`:

- `themes.css` — fourteen seed themes plus the Tokyo Night default (all
  seeded from 80s ideas: Keith Haring, Epcot, Mexico 86, Memphis Milano,
  the NES, Depeche Mode, MacGyver, the Commodore 64, Doogie Howser, the
  Grateful Dead, the 1988 Patagonia catalog baby toss, 80s ski, Stand by
  Me, and a Nantahala canoe run), each a set of CSS custom-property
  overrides on `html[data-theme]` plus its own animated scenery artwork
  layered behind the content. No content changes.
- `themes.html` — a QA index: one link per theme, each opening the page
  already wearing that look (`/?theme=<id>`).
- `bar.css` — the malleable bar, the loading chip, and the submit drawer,
  all styled from the site's own variables so they re-skin with every theme.
- `bar.js` — injects the whole layer: the five-second dissolve into a
  random theme (announced by a "loading malleable homepage..." terminal
  chip), the StumbleUpon-inspired bar (theme name, nod line, attribution, the
  "we can fix everything" motto as a diff, try-a-new-theme/submit/dismiss), and the
  canned submit flow (describe a theme in a sentence, watch it build, get a
  named theme, then claim it or stay anonymous). Dismiss the bar and clicking
  the ASCII mark brings it back.

Serve the folder with any static server, for example:

    python3 -m http.server 8930 -d .

Attribution handles on the seed themes are fictional placeholder data.
