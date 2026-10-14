from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
import json
from pathlib import Path
import qrcode
from qrcode.exceptions import DataOverflowError
import sys


HOST = "127.0.0.1"
PORT = 8000
ROOT = Path(__file__).resolve().parent
MAX_BYTES = 5000
MAX_DATA_BYTES = 1800
STATIC_FILES = {
    "/": ("index.html", "text/html; charset=utf-8"),
    "/index.html": ("index.html", "text/html; charset=utf-8"),
    "/styles.css": ("styles.css", "text/css; charset=utf-8"),
    "/app.js": ("app.js", "text/javascript; charset=utf-8"),
}


class LocalAppHandler(BaseHTTPRequestHandler):
    server_version = "GlyphLocal/1.0"

    def do_GET(self):
        resource = STATIC_FILES.get(self.path)
        if resource is None:
            self.send_error(404, "This local resource does not exist.")
            return
        filename, content_type = resource
        try:
            contents = (ROOT / filename).read_bytes()
        except OSError:
            self.send_error(500, "A local application file could not be read.")
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(contents)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.end_headers()
        self.wfile.write(contents)

    def do_POST(self):
        if self.path != "/api/qr":
            self.send_error(404, "This local resource does not exist.")
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.send_json_error(400, "A valid request size is required.")
            return
        if length <= 0 or length > MAX_BYTES:
            self.send_json_error(413, "The request is empty or too large.")
            return

        try:
            request = json.loads(self.rfile.read(length))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_json_error(400, "The request must contain valid JSON.")
            return
        if not isinstance(request, dict) or not isinstance(request.get("data"), str):
            self.send_json_error(400, "QR code data must be a string.")
            return

        data = request["data"]
        if not data.strip():
            self.send_json_error(400, "QR code data cannot be empty.")
            return
        if len(data.encode("utf-8")) > MAX_DATA_BYTES:
            self.send_json_error(413, "This QR code is too long. Try shortening it to 1,800 characters or fewer.")
            return

        code = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=12,
            border=4,
        )
        code.add_data(data, optimize=10)
        try:
            code.make(fit=True)
        except DataOverflowError:
            self.send_json_error(422, "This information is too long to fit in a scannable QR code. Try shortening it.")
            return

        image = code.make_image(fill_color="#211C36", back_color="#FFFFFF")
        output = BytesIO()
        image.save(output, format="PNG", optimize=True)
        body = output.getvalue()
        self.send_response(200)
        self.send_header("Content-Type", "image/png")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)

    def send_json_error(self, status, message):
        body = json.dumps({"error": message}).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format_string, *args):
        print(f"[{self.log_date_time_string()}] {format_string % args}", file=sys.stderr)


def main():
    try:
        server = ThreadingHTTPServer((HOST, PORT), LocalAppHandler)
    except OSError as error:
        print(f"Could not start Glyph on http://{HOST}:{PORT}: {error}", file=sys.stderr)
        raise SystemExit(1) from error
    print(f"Glyph QR Studio is running locally at http://{HOST}:{PORT}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Glyph QR Studio.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
