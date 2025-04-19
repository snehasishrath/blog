from http.server import SimpleHTTPRequestHandler, HTTPServer
import mimetypes

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    def guess_type(self, path):
        # Add MIME type for .md files
        if path.endswith('.md'):
            return 'text/markdown'
        return super().guess_type(path)

if __name__ == '__main__':
    PORT = 8000
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, CustomHTTPRequestHandler)
    print(f"Serving on port {PORT}")
    httpd.serve_forever()