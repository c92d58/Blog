# WAHSUN ｜ Blog

> 思考、書寫、懷疑，然後重新開始。

一個基於 [Astro](https://astro.build) 構建的個人博客站點，部署於 [Cloudflare Pages](https://pages.cloudflare.com)。

## 技術棧

- **框架**：Astro 5.x
- **字體**：Lexend（標題）、Geist（正文）
- **部署**：Cloudflare Pages（自動部署）
- **域名**：`blog.wahsun.org`
- **CDN**：Cloudflare（全球加速）

## 本地開發

```bash
git clone https://github.com/c92d58/Blog.git
cd Blog
npm install
npm run dev
```

構建部署：

```bash
npm run build
npx wrangler pages deploy dist --project-name=blog --branch=master
```

## 目錄結構

```
src/
├── components/       # 布局元件（Layout.astro）
├── content/posts/    # 文章（Markdown）
├── pages/            # 路由
│   ├── index.astro   # 首頁
│   ├── page/         # 分頁
│   └── posts/        # 文章頁
├── styles/           # 樣式（global.css）
└── lib/              # 工具函數
public/
└── hero-bg.jpg       # 首頁背景圖
```

## 版權聲明

**© 2026 WAHSUN（x@wahsun.org）**

本倉庫中的全部源碼、設計、文章內容，包括但不限於 HTML/CSS/JS 代碼、頁面佈局、視覺設計、字體選用方案及所有原創文字，均為作者私有財產。

- **禁止**以任何形式複製、分發、修改或二次開發本項目的設計主題與頁面佈局
- **禁止**將本項目用於商業用途
- **文章內容**未經授權不得轉載、翻譯或重新發佈
- **學習參考**可閱讀源碼，但不得直接抄襲整體設計

> 本主題為個人使用而設計，不對外開源。部分依賴包（npm packages）遵循各自的開源許可證。

---

*WAHSUN · 在伺服器與思緒之間遊走*
