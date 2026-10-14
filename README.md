# Glyph QR Studio

A bright, private QR-code studio you run on your own computer. Create codes for websites, Wi-Fi, email, phone numbers, contact cards, plain text, and payment or financial links. Expand your library to reopen saved codes, download high-resolution PNGs, or copy an image to your clipboard.

## Run locally

1. Install [Python 3](https://www.python.org/downloads/).
2. From this folder, run `python -m pip install -r requirements.txt`.
3. Start the studio with `python app.py`.
4. Visit [http://127.0.0.1:8000](http://127.0.0.1:8000).
5. Press `Ctrl+C` in the terminal when you want to close the studio.

Glyph only listens on your own computer (`127.0.0.1`). QR codes are generated locally; saved codes stay in this browser's local storage. Nothing is uploaded to an account or third-party service, and the app does not need an internet connection once its one-time Python dependency is installed.
