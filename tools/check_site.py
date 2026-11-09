"""講義結構檢查（CLAUDE.md 第 5、7、8、12 節）

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
MAX_CHARS = 400        # 每頁正文（不含資料來源）最多幾個中文字（CLAUDE.md 第 8.1 節）

MAX_SUMMARY = 30       # lessons.js summary 最多幾個字
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


def block(html, pattern):
    """取出第一個符合 pattern 開頭的 <section>…</section> 內容"""
    m = re.search(pattern + r"(.*?)</section>", html, re.S)
    return m.group(1) if m else ""


def han(text):
    return len(re.findall(r"[一-鿿]", text))


def length(text):
    """字數：去掉 HTML 和空白，一個英文單字或數字算 1 個字"""
    text = re.sub(r"<[^>]+>|\s", "", text)
    return len(re.sub(r"[A-Za-z0-9.]+", "X", text))


# 1. 讀取 lessons.js（陣列必須是合法 JSON）
src = read("assets/js/lessons.js")
m = re.search(r"window\.AZUL_LESSONS\s*=\s*(\[.*?\]);", src, re.S)
LESSONS = []
if ok(m is not None, "lessons.js 沒有定義 window.AZUL_LESSONS"):
    try:
        LESSONS = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        errors.append(f"lessons.js 的 AZUL_LESSONS 不是合法 JSON：{e}")

# site.js 裡實際存在的元件名稱（講義只能用這些）
site_js = read("assets/js/site.js")
widgets_src = site_js.split("var WIDGETS = {", 1)[-1].split("function initWidgets", 1)[0]
WIDGETS = set(re.findall(r'^\s{4}"?([a-z][a-z-]*)"?\s*:\s*function', widgets_src, re.M))
ok(len(WIDGETS) > 0, "site.js 找不到 WIDGETS 元件清單")

REQUIRED_FIELDS = ["no", "slug", "title", "summary", "minutes", "status", "updated"]
SECTIONS = ["idea", "points", "quiz", "sources"]
seen = set()

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
    ok(str(l.get("title", "")).endswith("？"), f"{tag} 標題要用問句，以全形「？」結尾")
    ok(length(l.get("summary", "")) <= MAX_SUMMARY, f"{tag} summary 要在 {MAX_SUMMARY} 字內（目前 {length(l.get('summary', ''))} 字）")
    ok(isinstance(l.get("minutes"), int) and 1 <= l["minutes"] <= 5, f"{tag} minutes 要是 1–5 的整數（一頁 5 分鐘內看完）")
    ok(l.get("status") in ("published", "planned"), f"{tag} status 只能是 published／planned")
    ok(re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(l.get("updated"))) is not None, f"{tag} updated 格式應為 YYYY-MM-DD")

    folder = f"lessons/{slug}"
    if l.get("status") != "published":
        if (ROOT / folder).exists():
            warnings.append(f"{tag} 狀態是 planned，但已經有資料夾；完成後記得改成 published")
        continue

    # 2. 已完成的講義：檔案齊全（內容先行）
    if not ok((ROOT / folder / "index.html").exists(), f"{tag} 找不到 {folder}/index.html"):
        continue
    ok((ROOT / "notes" / f"{slug}.md").exists(), f"{tag} 找不到 notes/{slug}.md（內容先行）")
    html = read(f"{folder}/index.html")

    # 3. 頁面與清單一致
    ok(f'data-lesson="{slug}"' in html, f'{tag} <body> 缺少 data-lesson="{slug}"')
    # 首頁縮圖 thumb：用這一頁 #idea 右邊的同一個元件；雷達圖的資料要和頁面完全一樣
    th = l.get("thumb") or {}
    page_widget = re.search(r'<div class="split-visual">\s*<div class="widget[^"]*" data-widget="([^"]+)"', html)
    ok(page_widget and th.get("widget") == page_widget.group(1), f"{tag} lessons.js 的 thumb.widget 要等於頁面 #idea 右邊的元件（{page_widget and page_widget.group(1)}）")
    if th.get("widget") == "radar":
        axes = re.search(r'data-widget="radar" data-axes="([^"]+)"', html)
        ok(axes and axes.group(1) == th.get("axes"), f"{tag} thumb.axes 和頁面的 data-axes 不一樣")
        page_series = ";".join(f"{n}={v}" for n, v in re.findall(r'data-series="([^"]+)" data-values="([^"]+)"', html))
        ok(page_series == th.get("series"), f"{tag} thumb.series 和頁面的雷達圖分數不一樣，改分數時兩邊都要改")
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
    ok(h1 and h1.group(1).strip() == l["title"], f"{tag} <h1>（{h1 and h1.group(1).strip()}）與 lessons.js title 不一致")
    title = re.search(r"<title>(.*?)</title>", html, re.S)
    ok(title and title.group(1).startswith(l["title"]), f"{tag} <title> 應以講義標題開頭")
    desc = re.search(r'<meta name="description" content="([^"]*)">', html)
    ok(desc and desc.group(1) == l["summary"], f"{tag} meta description 要和 lessons.js summary 完全相同")
    ok("★" not in html, f"{tag} 仍有範本的 ★ 標記沒改")

    # 4. 五個固定區塊與順序
    ok('<header class="lesson-hero">' in html, f"{tag} 缺少 header.lesson-hero")
    # 像簡報一樣：畫面自己說話，不加副標、元件標題或說明小字（CLAUDE.md 8.1）
    for cls, name in [("lesson-lead", "副標 .lesson-lead"), ("widget-title", "元件標題 .widget-title"), ("note", "說明小字 .note")]:
        ok(f'class="{cls}"' not in html, f"{tag} 不要加{name}，讓畫面自己說明")
    ids = re.findall(r'<section id="([^"]+)"', html)
    ok(ids == SECTIONS, f"{tag} 區塊應剛好是 {' → '.join(SECTIONS)}（目前 {' → '.join(ids)}）")

    idea = block(html, r'<section id="idea" class="split">')
    ok(idea != "", f"{tag} #idea 要加 class=\"split\"（左文右圖）")
    ok("<h2" not in idea, f"{tag} #idea 不要加小標題，<h1> 問句就是這一頁的標題")
    steps = re.search(r'<ol class="steps"[^>]*>(.*?)</ol>', idea, re.S)
    n_steps = steps.group(1).count("<li>") if steps else 0
    ok(3 <= n_steps <= 5, f"{tag} #idea 左邊的 ol.steps 要有 3–5 步（目前 {n_steps}）")
    visual = idea.split('class="split-visual"', 1)[1] if 'class="split-visual"' in idea else ""
    ok(re.search(r"data-widget=|<svg|<figure", visual), f"{tag} #idea 右邊 .split-visual 一定要有互動元件或圖")

    points = block(html, r'<section id="points"')
    n_cards = points.count('class="card"')
    ok(2 <= n_cards <= 4 or "<table" in points, f"{tag} #points 要有 2–4 張 .card 或一張比較表（目前 {n_cards} 張卡片）")

    quiz = block(html, r'<section id="quiz"')
    ok(quiz.count('data-widget="quiz"') == 1 and quiz.count("data-correct") == 1, f"{tag} #quiz 要剛好一題，且只有一個 data-correct")

    sources = block(html, r'<section id="sources"')
    ok('<details class="sources">' in sources, f"{tag} 資料來源要放在 <details class=\"sources\"> 裡")
    ok(re.search(r'href="https?://', sources), f"{tag} 資料來源至少要有一個外部連結")
    ok("data-pager" in html, f"{tag} 缺少 data-pager（上一頁／下一頁）")

    # 5. 字少圖多
    main = re.search(r"<main[^>]*>(.*?)</main>", html, re.S)
    body = main.group(1) if main else ""
    body = re.sub(r'<section id="sources".*?</section>', "", body, flags=re.S)
    body = re.sub(r"<!--.*?-->|<svg.*?</svg>|<script.*?</script>", "", body, flags=re.S)
    n_han = han(re.sub(r"<[^>]+>", "", body))
    ok(n_han <= MAX_CHARS, f"{tag} 正文 {n_han} 字，超過 {MAX_CHARS} 字上限；請刪字或改用圖表達")
    for w in re.findall(r'data-widget="([^"]+)"', html):
        ok(w in WIDGETS, f"{tag} 用了不存在的元件 data-widget=\"{w}\"（可用：{'、'.join(sorted(WIDGETS))}）")

    # 6. 技術限制
    ok('href="../../assets/css/style.css"' in html, f"{tag} 沒有引用共用 style.css")
    ok('src="../../assets/js/lessons.js"' in html and 'src="../../assets/js/site.js"' in html, f"{tag} 沒有引用 lessons.js 與 site.js")
    ok(not re.search(r'<script[^>]+src="https?:', html) and not re.search(r'<link[^>]+href="https?:[^"]+\.css', html), f"{tag} 不得載入外部 script 或 CSS")
    ok(not re.search(r"<script(?![^>]*\bsrc=)", html), f"{tag} 講義頁不得寫自己的 <script>，互動請用 site.js 的元件")
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
for f in ["CLAUDE.md", "AGENTS.md", "README.md", "NOTES.md", "log.md", "index.html", ".nojekyll",
          "lessons/_template/index.html", "notes/_template.md", "sources/official-sources.md"]:
    ok((ROOT / f).exists(), f"缺少必要檔案 {f}")
ok('id="lesson-grid"' in read("index.html"), "首頁缺少 #lesson-grid")

# 結果
pub = sum(1 for l in LESSONS if l.get("status") == "published")
print(f"講義：已完成 {pub} 頁、準備中 {len(LESSONS) - pub} 頁；可用元件：{'、'.join(sorted(WIDGETS))}")
print(f"共執行 {checks} 項檢查")
for w in warnings:
    print("⚠ " + w)
if errors:
    for e in errors:
        print("✗ " + e)
    print(f"\n未通過：{len(errors)} 項錯誤")
    sys.exit(1)
print("✓ 全部通過")
