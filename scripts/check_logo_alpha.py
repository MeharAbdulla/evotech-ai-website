from PIL import Image

img = Image.open(r"C:\Users\Mz Computers\Videos\ai-website\public\logo-transparent.png").convert("RGBA")
w, h = img.size
px = img.load()
samples = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 5), (5, h // 2)]
for s in samples:
    print(s, px[s])
trans = sum(1 for y in range(h) for x in range(w) if px[x, y][3] == 0)
print("transparent ratio", round(trans / (w * h), 3), "size", w, h)
