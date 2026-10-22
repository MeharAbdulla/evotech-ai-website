from pathlib import Path
import re

IMPORT = "from app.auth.deps import require_admin\n"

def ensure_import(path: Path):
    text = path.read_text(encoding="utf-8")
    if "require_admin" in text:
        return
    needle = "from app.database import get_database\n"
    if needle in text:
        text = text.replace(needle, needle + IMPORT, 1)
    else:
        text = IMPORT + text
    path.write_text(text, encoding="utf-8")
    print("import", path)


def protect_mutations(path: Path):
    text = path.read_text(encoding="utf-8")
    # Split by async def and protect post/put/delete function signatures that have db Depends
    parts = re.split(r"(async def )", text)
    out = []
    i = 0
    while i < len(parts):
        chunk = parts[i]
        if chunk == "async def " and i + 1 < len(parts):
            rest = parts[i + 1]
            name = rest.split("(", 1)[0].strip()
            is_mutation = any(
                name.startswith(p)
                for p in (
                    "create_",
                    "update_",
                    "delete_",
                    "upload_",
                )
            )
            if is_mutation and "_admin" not in rest.split("):", 1)[0]:
                # inject before closing ):
                rest = re.sub(
                    r"(db:\s*AsyncIOMotorDatabase\s*=\s*Depends\(get_database\))\s*\)\s*:",
                    r"\1,\n    _admin: dict = Depends(require_admin),\n):",
                    rest,
                    count=1,
                )
                print("protected", path.name, name)
            out.append(chunk)
            out.append(rest)
            i += 2
        else:
            out.append(chunk)
            i += 1
    path.write_text("".join(out), encoding="utf-8")


for rel in [
    "backend/app/routes/services.py",
    "backend/app/routes/gigs.py",
    "backend/app/routes/developers.py",
]:
    p = Path(rel)
    ensure_import(p)
    protect_mutations(p)
print("done")
