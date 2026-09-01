#!/usr/bin/env python3
"""Build the three redesign mocks from the app's own ERB partials, so the
copy, links, and videos are identical to production by construction.
Run from anywhere: python3 build.py — writes a.html, b.html, c.html here."""

import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../../../../.."))
VIEWS = os.path.join(ROOT, "app/views/homepage")


def partial(name):
    text = open(os.path.join(VIEWS, f"_{name}.html.erb")).read()
    return text.replace("/site/", "/public/site/")


SITE_CSS = ["reset", "root", "fonts", "elements", "button", "footer",
            "header", "main", "nav", "notification", "video"]

MOTTO = '''    <section class="motto">
      <p class="motto__line"><strong>We can fix everything:</strong> <span>every missing app, every incompatibility, every paper cut.</span></p>
    </section>
'''

LOGO_MARK = open(os.path.join(ROOT, "public/site/images/brand/omarchy-logo.svg")).read()
LOGO_MARK = LOGO_MARK.replace('fill="#9ece6a"', 'fill="currentColor"').replace(' height="1200"', '').replace(' width="1200"', '')

DIRECTIONS = {
    "a": {
        "title": "Blockfall",
        "wordmark": '<div class="wordmark" data-intro="fall" aria-hidden="true"></div>',
        "body": ["notification", "logo", "motto", "header", "nav", "main", "footer"],
    },
    "b": {
        "title": "Workbench",
        "wordmark": f'<div class="mark" aria-hidden="true">{LOGO_MARK * 4}</div><div class="wordmark" data-intro="rise" aria-hidden="true"></div>',
        "body": ["notification", "workbench"],
    },
    "c": {
        "title": "Ticker",
        "wordmark": '<div class="wordmark" data-intro="slide" aria-hidden="true"></div>',
        "body": ["ticker", "notification", "logo", "motto", "header", "nav", "main", "footer"],
    },
}

TICKER_ITEM = "We can fix everything: every missing app, every incompatibility, every paper cut."


def logo_block(direction):
    return f'''    <div class="pre pre--blocks">
      <a href="/" aria-label="Omarchy">
        {direction["wordmark"]}
      </a>
    </div>
'''


def ticker_block():
    items = "".join(f"<span>{TICKER_ITEM}</span>" for _ in range(6))
    return f'    <div class="ticker" aria-hidden="true"><div class="ticker__track">{items}</div></div>\n'


def section(key, direction):
    if key == "logo":
        return logo_block(direction)
    if key == "motto":
        return MOTTO
    if key == "ticker":
        return ticker_block()
    if key == "workbench":
        return ('    <div class="workbench">\n      <div class="workbench__bench">\n'
                + logo_block(direction) + MOTTO + partial("header") + partial("nav")
                + '      </div>\n      <div class="workbench__reel">\n' + partial("main")
                + '      </div>\n    </div>\n' + partial("footer"))
    return partial(key)


def build(key, direction):
    css = "".join(f'    <link rel="stylesheet" href="/public/site/css/{name}.css">\n' for name in SITE_CSS)
    body = "\n".join(section(k, direction) for k in direction["body"])
    html = f'''<!doctype html>
<html lang="en">
  <head>
    <title>Omarchy — Beautiful, Fun &amp; Agentic Linux by DHH</title>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, width=device-width">
    <link rel="icon" href="/public/site/images/favicon.png">
{css}    <link rel="stylesheet" href="/public/site/malleable/themes.css">
    <link rel="stylesheet" href="/public/site/malleable/bar.css">
    <link rel="stylesheet" href="./shared.css">
    <link rel="stylesheet" href="./{key}.css">
    <script src="./wordmark.js" type="module"></script>
    <script src="/public/site/malleable/bar.js" type="module"></script>
    <script type="application/json" id="malleable-data">{{"generated": [], "submissions_closed": false}}</script>
  </head>

  <body class="direction-{key}">
{body}  </body>
</html>
'''
    open(os.path.join(HERE, f"{key}.html"), "w").write(html)


for key, direction in DIRECTIONS.items():
    build(key, direction)
print("built a.html b.html c.html")
