"""講義庫結構檢查（CLAUDE.md 第 6、7、12 節）

用法：在專案根目錄執行
    python tools/check_site.py
只用 Python 標準函式庫，不需要安裝任何套件。
全部通過時結束碼為 0，有錯誤時為 1。
"""
import json
import re
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:  # 舊版 Python 沒有 reconfigure
    pass

ROOT = Path(__file__).resolve().parent.parent
errors, warnings = [], []
checks = 0


def ok(cond, msg):
    global checks
    checks += 1
    if not cond:
        errors.append(msg)
    return cond


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


# 1. 讀取 lessons.js（兩個陣列都必須是合法 JSON）
src = read("assets/js/lessons.js")


def js_array(name):
    m = re.search(r"window\." + name + r"\s*=\s*(\[.*?\]);", src, re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError as e:
        errors.append(f"lessons.js 的 {name} 不是合法 JSON：{e}")
        return None


LESSONS = js_array("AZUL_LESSONS") or []
STAGES = js_array("AZUL_STAGES") or []
ok(len(LESSONS) > 0, "lessons.js 沒有定義 window.AZUL_LESSONS")
ok(len(STAGES) > 0, "lessons.js 沒有定義 window.AZUL_STAGES")

REQUIRED_FIELDS = ["no", "slug", "title", "summary", "stage", "level", "minutes", "tags", "status", "updated"]
REQUIRED_SECTIONS = ["goals", "practice", "checklist", "troubleshoot", "quiz", "sources"]
seen = set()


def section(html, sid):
    parts = html.split(f'<section id="{sid}"', 1)
    return parts[1].split("</section>", 1)[0] if len(parts) == 2 else ""


for i, l in enumerate(LESSONS):
    slug = l.get("slug", f"第 {i + 1} 筆")
    tag = f"[{slug}]"
    for f in REQUIRED_FIELDS:
        ok(l.get(f) not in (None, ""), f"{tag} lessons.js 缺少欄位 {f}")
    ok(re.fullmatch(r"\d{2}-[a-z0-9]+(-[a-z0-9]+)*", slug or "") is not None, f"{tag} slug 格式應為 NN-english-kebab")
    ok(str(slug).startswith(f"{l.get('no')}-"), f"{tag} no（{l.get('no')}）與 slug 開頭不一致")
    ok(str(l.get("no")) == f"{i + 1:02d}", f"{tag} 編號應等於清單順序 {i + 1:02d}")
    ok(slug not in seen, f"{tag} slug 重複")
    seen.add(slug)
    ok(l.get("stage") in STAGES, f"{tag} stage「{l.get('stage')}」不在 AZUL_STAGES")
    ok(l.get("level") in ("入門", "進階"), f"{tag} level 只能是 入門／進階")
    ok(l.get("status") in ("published", "planned"), f"{tag} status 只能是 published／planned")
    ok(re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(l.get("updated"))) is not None, f"{tag} updated 格式應為 YYYY-MM-DD")
    ok(isinstance(l.get("tags"), list) and 2 <= len(l["tags"]) <= 4, f"{tag} tags 需要 2–4 個")
    ok(len(l.get("summary", "")) <= 45, f"{tag} summary 建議 40 字內（目前 {len(l.get('summary', ''))} 字）")

    folder = f"lessons/{slug}"
    if l.get("status") != "published":
        if (ROOT / folder).exists():
            warnings.append(f"{tag} 狀態是 planned，但已經有資料夾；完成後記得改成 published")
        continue

    # 2. 已發布講義：檔案齊全（內容先行）
    if not ok((ROOT / folder / "index.html").exists(), f"{tag} 找不到 {folder}/index.html"):
        continue
    ok((ROOT / "notes" / f"{slug}.md").exists(), f"{tag} 找不到 notes/{slug}.md（內容先行）")
    html = read(f"{folder}/index.html")

    # 3. 頁面與清單一致
    ok(f'data-lesson="{slug}"' in html, f'{tag} <body> 缺少 data-lesson="{slug}"')
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
    ok(h1 and h1.group(1).strip() == l["title"], f"{tag} <h1>（{h1 and h1.group(1).strip()}）與 lessons.js title 不一致")
    title = re.search(r"<title>(.*?)</title>", html, re.S)
    ok(title and title.group(1).startswith(l["title"]), f"{tag} <title> 應以講義標題開頭")
    ok(re.search(r'<meta name="description" content="[^"★]+">', html), f"{tag} 缺少 meta description，或仍是範本內容")
    ok("★" not in html, f"{tag} 仍有範本的 ★ 標記沒改")
    ok(f'data-store="{slug}"' in html, f"{tag} 檢查清單的 data-store 應為 {slug}")

    # 4. 固定段落與順序
    ok('<header class="lesson-hero">' in html, f"{tag} 缺少 header.lesson-hero")
    ids = re.findall(r'<section id="([^"]+)"', html)
    for sid in REQUIRED_SECTIONS:
        ok(sid in ids, f"{tag} 缺少 section#{sid}")
    if all(sid in ids for sid in REQUIRED_SECTIONS):
        order = [ids.index(s) for s in REQUIRED_SECTIONS]
        ok(order == sorted(order), f"{tag} 固定段落順序錯誤（應為 {' → '.join(REQUIRED_SECTIONS)}）")
        concepts = [ids.index(s) for s in re.findall(r'<section id="([^"]+)" class="lesson-section"', html)]
        ok(len(concepts) >= 2, f"{tag} 觀念段落 .lesson-section 至少 2 段（目前 {len(concepts)}）")
        ok(all(ids.index("goals") < c < ids.index("practice") for c in concepts), f"{tag} 觀念段落要放在 #goals 與 #practice 之間")
    ok("data-pager" in html and "data-toc" in html, f"{tag} 缺少 data-pager 或 data-toc")

    # 5. 段落內容基本要求
    n_items = section(html, "checklist").count("<li>")
    ok(4 <= n_items <= 8, f"{tag} 檢查清單需要 4–8 項（目前 {n_items}）")
    ok("<th>症狀</th><th>可能原因</th><th>先試什麼</th>" in section(html, "troubleshoot"), f"{tag} 常見問題表格欄位應為 症狀／可能原因／先試什麼")
    quiz = section(html, "quiz")
    n_quiz, n_correct = quiz.count('data-widget="quiz"'), quiz.count("data-correct")
    ok(1 <= n_quiz <= 3 and n_quiz == n_correct, f"{tag} 自我檢查要 1–3 題，且每題剛好一個 data-correct")
    ok(re.search(r'href="https?://', section(html, "sources")), f"{tag} 來源段落至少要有一個外部連結")
    ok(re.search(r'data-widget=|class="steps"', section(html, "practice")), f"{tag} 動手做需要互動元件或 ol.steps")

    # 6. 技術限制
    ok('href="../../assets/css/style.css"' in html, f"{tag} 沒有引用共用 style.css")
    ok('src="../../assets/js/lessons.js"' in html and 'src="../../assets/js/site.js"' in html, f"{tag} 沒有引用 lessons.js 與 site.js")
    ok(not re.search(r'<script[^>]+src="https?:', html) and not re.search(r'<link[^>]+href="https?:[^"]+\.css', html), f"{tag} 不得載入外部 script 或 CSS")
    ok(not re.search(r'\sstyle="', html), f"{tag} 講義頁不得使用 inline style")
    no_meta = re.sub(r'<meta name="theme-color"[^>]*>', "", html)
    ok(not re.search(r"#[0-9a-fA-F]{6}\b", no_meta), f"{tag} 講義頁不得寫死色碼")
    ok("fetch(" not in html, f"{tag} 不得使用 fetch()")

# 7. 所有 HTML 的相對連結都要存在
for f in ROOT.rglob("*.html"):
    rel = f.relative_to(ROOT).as_posix()
    if rel.startswith(".") or "_template" in rel:
        continue
    for url in re.findall(r'(?:href|src)="([^"]+)"', f.read_text(encoding="utf-8")):
        if re.match(r"(https?:|mailto:|#|data:)", url):
            continue
        clean = url.split("#")[0].split("?")[0]
        if not clean:
            continue
        target = (f.parent / clean).resolve()
        if clean.endswith("/") or target.is_dir():
            target = target / "index.html"
        ok(target.exists(), f"[{rel}] 連結不存在：{url}")

# 8. 必要的根目錄檔案
for f in ["CLAUDE.md", "AGENTS.md", "README.md", "index.html", ".nojekyll", "log.md",
          "lessons/_template/index.html", "notes/_template.md", "sources/official-sources.md"]:
    ok((ROOT / f).exists(), f"缺少必要檔案 {f}")
ok('id="lesson-grid"' in read("index.html"), "首頁缺少 #lesson-grid")

# 結果
pub = sum(1 for l in LESSONS if l.get("status") == "published")
print(f"講義：已發布 {pub} 篇、規劃中 {len(LESSONS) - pub} 篇；共執行 {checks} 項檢查")
for w in warnings:
    print("⚠ " + w)
if errors:
    for e in errors:
        print("✗ " + e)
    print(f"\n未通過：{len(errors)} 項錯誤")
    sys.exit(1)
print("✓ 全部通過")
