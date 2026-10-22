"""Render a simple top-down PNG preview from an OBJ (for RoboCup card)."""
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

obj_path = Path(r"C:\Users\Mz Computers\Videos\ai-website\public\pcb\robocup\model.obj")
out_path = Path(r"C:\Users\Mz Computers\Videos\ai-website\public\pcb\robocup\board.png")

verts = []
faces = []
with obj_path.open("r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        if line.startswith("v "):
            parts = line.split()
            verts.append([float(parts[1]), float(parts[2]), float(parts[3])])
        elif line.startswith("f "):
            idxs = []
            for tok in line.split()[1:]:
                idxs.append(int(tok.split("/")[0]) - 1)
            if len(idxs) >= 3:
                faces.append(idxs[:3])

verts = np.asarray(verts, dtype=np.float64)
# subsample faces for speed
step = max(1, len(faces) // 25000)
faces = faces[::step]
mesh = np.asarray([[verts[i] for i in face] for face in faces], dtype=np.float64)

# Determine thinnest axis = board thickness, project other two
mins = verts.min(axis=0)
maxs = verts.max(axis=0)
spans = maxs - mins
thin = int(np.argmin(spans))
axes = [0, 1, 2]
axes.remove(thin)
ax_u, ax_v = axes

fig = plt.figure(figsize=(8, 8), facecolor="#05070d")
ax = fig.add_subplot(111)
ax.set_facecolor("#05070d")

# Draw as filled polys in 2D
from matplotlib.collections import PolyCollection
polys2d = mesh[:, :, [ax_u, ax_v]]
# center
center = polys2d.reshape(-1, 2).mean(axis=0)
polys2d = polys2d - center

coll = PolyCollection(
    polys2d,
    facecolors="#0f766e",
    edgecolors="#2dd4bf",
    linewidths=0.05,
    alpha=0.95,
)
ax.add_collection(coll)
ax.autoscale()
ax.set_aspect("equal")
ax.axis("off")
plt.tight_layout(pad=0.2)
fig.savefig(out_path, dpi=140, facecolor=fig.get_facecolor(), bbox_inches="tight", pad_inches=0.15)
plt.close(fig)
print("wrote", out_path, out_path.stat().st_size)
