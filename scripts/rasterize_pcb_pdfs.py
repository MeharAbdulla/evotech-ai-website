import os
import sys

try:
    import fitz
except ImportError:
    os.system(f'"{sys.executable}" -m pip install pymupdf -q')
    import fitz

root = r"C:\Users\Mz Computers\Videos\ai-website\public\pcb"
jobs = [
    ("esp32-xiao-fc", "spec.pdf", "preview.png"),
    ("simon-esp32", "spec.pdf", "preview.png"),
    ("pool-monitor", "spec.pdf", "preview.png"),
    ("stm32h750-fc", "spec.pdf", "preview.png"),
    ("robocup", "spec.pdf", "preview.png"),
    ("tortubot", "spec.pdf", "preview-from-pdf.png"),
]

for folder, pdf, out in jobs:
    path = os.path.join(root, folder, pdf)
    if not os.path.exists(path):
        print("missing", path)
        continue
    doc = fitz.open(path)
    page = doc[0]
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    out_path = os.path.join(root, folder, out)
    pix.save(out_path)
    print("wrote", out_path, pix.width, pix.height)
    doc.close()
