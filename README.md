# omarchy_website — the malleable homepage

A design pitch for [omarchy.org](https://omarchy.org): the homepage stays
exactly what it is — same copy, same videos, same structure — but it can
wear community-made themes. A dismissible bar at the top names the current
theme, credits its maker, carries the motto ("we can fix everything"), and
lets anyone describe a brand-new theme in one sentence. Claude builds the
palette live, names it, and the page puts it on. Identity is asked only
after the theme exists; "anonymous" is a first-class answer.

The point of the site is Omarchy, not the themes: the page content never
changes. Themes may only add CSS custom properties, scenery artwork, and
the bar itself. A generated theme is validated palette values only — the
model's output never reaches a stylesheet as raw CSS.

## Running it

```
bin/setup
bin/rails server
```

Or the containerized loop: `bin/up`. Theme generation needs an
`ANTHROPIC_API_KEY` in the environment; without one, everything works
except live generation. Tests: `bin/rails test`.

## Guard rails in production

- Generation is capped at 100 themes total, and rate-limited per IP.
- The model returns a name, a nod line, and eight RGB triplets; every
  triplet is validated server-side before it is stored or served.
- No secrets live in this repository. Keys and configuration are
  provided through the deployment environment.

## License

MIT, like Omarchy itself — see [LICENSE.md](LICENSE.md).
