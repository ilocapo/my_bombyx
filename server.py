#!/usr/bin/env python3
"""
Simple web server for Bombyx Population Model interface.

Usage: python3 server.py [port]
Author: Ilona Emefa
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

def find_free_port(start_port=8000, max_attempts=10):
    """Find available port."""
    import socket
    
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    
    raise OSError(f"No free port found between {start_port} and {start_port + max_attempts}")

def main():
    """Start web server."""
    web_dir = Path(__file__).parent / "web"
    if not web_dir.exists():
        print("Error: 'web' directory not found!")
        sys.exit(1)
    
    os.chdir(web_dir)
    
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Error: Port must be an integer.")
            sys.exit(1)
    
    try:
        port = find_free_port(port)
    except OSError as e:
        print(f"Error: {e}")
        sys.exit(1)
    
    handler = http.server.SimpleHTTPRequestHandler
    httpd = socketserver.TCPServer(("", port), handler)
    
    print(f"Bombyx Population Model - Web Interface")
    print(f"Server started on port {port}")
    print(f"URL: http://localhost:{port}")
    print("Press Ctrl+C to stop")
    
    try:
        webbrowser.open(f"http://localhost:{port}")
    except Exception:
        pass
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.shutdown()

if __name__ == "__main__":
    main()
