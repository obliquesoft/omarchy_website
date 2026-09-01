#!/usr/bin/env python3
"""Static server for the mock that never lets the browser cache anything."""

import http.server
import os
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8930
    http.server.ThreadingHTTPServer(('', port), NoCacheHandler).serve_forever()
