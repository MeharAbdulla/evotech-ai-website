"""Aggressive black-background removal + flood fill from edges."""
from pathlib import Path
from collections import deque
from PIL import Image

src = Path(r"C:\Users\Mz Computers\Videos\ai-website\public\logo.jpeg")
out = Path(r"C:\Users\Mz Computers\Videos\ai-website\public\logo-transparent.png")
logo_png = Path(r"C:\Users\Mz Computers\Videos\ai-website\public\logo.png")

img = Image.open(src).convert("RGBA")
w, h = img.size
px = img.load()

def is_bg(r, g, b):
    # Near-black and very low saturation dark pixels
    brightness = (r + g + b) / 3
    mx = max(r, g, b)
    mn = min(r, g, b)
    sat = 0 if mx == 0 else (mx - mn) / mx
    return brightness < 40 and sat < 0.35

# Flood-fill from edges so only connected bg is removed
visited = [[False] * w for _ in range(h)]
q = deque()
for x in range(w):
    q.append((x, 0))
    q.append((x, h - 1))
for y in range(h):
    q.append((0, y))
    q.append((w - 1, y))

while q:
    x, y = q.popleft()
    if x < 0 or y < 0 or x >= w or y >= h or visited[y][x]:
        continue
    visited[y][x] = True
    r, g, b, a = px[x, y]
    if not is_bg(r, g, b):
        continue
    brightness = (r + g + b) / 3
    if brightness < 22:
        alpha = 0
    else:
        alpha = int(255 * (brightness - 22) / 18)
        alpha = max(0, min(255, alpha))
    px[x, y] = (r, g, b, alpha)
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
            q.append((nx, ny))

# Also clear remaining near-black that are clearly bg (second pass soft)
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        brightness = (r + g + b) / 3
        if brightness < 12:
            px[x, y] = (r, g, b, 0)

bbox = img.getbbox()
if bbox:
    left, top, right, bottom = bbox
    pad = 16
    img = img.crop((
        max(0, left - pad),
        max(0, top - pad),
        min(w, right + pad),
        min(h, bottom + pad),
    ))

img.save(out, "PNG", optimize=True)
img.save(logo_png, "PNG", optimize=True)
print("wrote", out, "size", img.size, "bytes", out.stat().st_size)
