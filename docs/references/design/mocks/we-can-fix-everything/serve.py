#!/usr/bin/env python3
"""Serve the redesign mocks from the repository root (so /public/site/... and
these mock files both resolve), with caching disabled."""

import http.server
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../../../../.."))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    os.chdir(ROOT)
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8931
    print(f"mocks at http://localhost:{port}/docs/references/design/mocks/we-can-fix-everything/a.html")
    http.server.ThreadingHTTPServer(('', port), NoCacheHandler).serve_forever()
