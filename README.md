# 🤖 POC Hub

> Angular POC 实验室 — 通过 Telegram Bot 下指令，Gemini AI 自动生成代码，GitHub Actions 自动部署。

**预览地址：** `https://<your-github-username>.github.io/poc-hub/`

---

## 架构总览

```
Telegram 指令
     │
     ▼
Bot 服务 (Cloud Run)
     │  ├─ 解析指令
     │  ├─ 调用 Gemini 2.5 Pro 生成 Angular 代码
     │  └─ 调用 GitHub API 创建 PR
     ▼
GitHub Repo (this)
     │  apps/<poc-name>/   ← 生成的 Angular 项目
     │  poc-meta.json      ← POC 元数据
     ▼
GitHub Actions
     │  ├─ PR 检查 (pr-check.yml)   → 验证构建
     │  └─ 部署 (deploy.yml)         → merge 后部署
     ▼
GitHub Pages
     https://<owner>.github.io/poc-hub/<poc-name>/
     │
     ▼
Telegram Bot 回复预览链接
```

---

## 目录结构

```
poc-hub/
├── apps/                          # 所有 POC 项目
│   └── example-counter/           # 示例 POC（Angular 17 standalone）
├── scripts/
│   └── generate-index.js          # 自动生成 Hub 首页
├── .github/
│   └── workflows/
│       ├── deploy.yml             # 主部署 workflow（push to main）
│       └── pr-check.yml           # PR 验证 workflow
├── poc-meta.json                  # POC 元数据（Bot 自动维护）
├── index-template.html            # Hub 首页模板
└── .env.example                   # 环境变量说明
```

---

## 快速开始

### 1. Fork / Clone 本 Repo

```bash
git clone https://github.com/<you>/poc-hub.git
cd poc-hub
```

### 2. 开启 GitHub Pages

- Repo Settings → Pages → Source: **Deploy from a branch** → Branch: `gh-pages` / `/ (root)`
- 或者让 `peaceiris/actions-gh-pages` 自动创建 `gh-pages` 分支（首次 push 到 main 后自动触发）

### 3. 配置 GitHub Secrets

进入 **Settings → Secrets and variables → Actions → New repository secret**：

| Secret 名称 | 说明 |
|---|---|
| `TELEGRAM_BOT_TOKEN` | BotFather 给的 Token |
| `TELEGRAM_CHAT_ID` | 你的 Telegram Chat ID（向 @userinfobot 发消息获取）|

### 4. 部署 Bot 服务

参见 `../poc-bot/` 目录（Bot 服务独立 repo，部署到 Google Cloud Run）。

---

## 手动添加 POC（不用 Bot）

```bash
# 1. 创建新分支
git checkout -b poc/my-new-feature

# 2. 用 Angular CLI 生成项目
cd apps
ng new my-new-feature --standalone --routing=false --style=css
cd my-new-feature

# 3. 确保 angular.json 的 outputPath 正确
# "outputPath": "dist/my-new-feature"

# 4. 提交并推送
git add .
git commit -m "feat: add my-new-feature POC"
git push origin poc/my-new-feature

# 5. 在 GitHub 创建 PR → merge 后自动部署
```

---

## 强制重新部署某个 POC

在 GitHub Actions → deploy workflow → Run workflow → 输入 `app_name` 即可。

---

## Angular 项目规范

每个 `apps/<name>/` 下的 Angular 项目需要满足：

- ✅ 使用 Angular 17+ **standalone components**
- ✅ `angular.json` 中 `outputPath` 为 `dist/<name>`
- ✅ 不依赖本地外部服务（纯前端 POC）
- ✅ `package.json` 包含完整依赖（不依赖 monorepo 共享）
- ⚠️ `base-href` 由 CI 自动注入，**不要硬编码**

---

## Workflow 说明

### `deploy.yml` — 主部署流程

触发条件：`push` 到 `main`，且 `apps/**` 有变更

1. **detect-changes** — 用 `git diff` 找出变更的 app 目录
2. **build** — matrix 并行构建所有变更的 app
3. **deploy** — 下载 artifacts，更新 `gh-pages` 分支对应子目录
4. **notify** — 向 Telegram 发送部署结果和预览链接

### `pr-check.yml` — PR 验证

触发条件：PR 指向 `main`，且 `apps/**` 有变更

1. 检测变更 app
2. 以 development 模式构建（速度更快）
3. 在 PR 评论中贴出预览链接（merge 后生效）

---

## 常见问题

**Q: Angular build 报 base-href 404？**
A: 确认 `angular.json` 的 `outputPath` 没有带多余的 `browser/` 子目录，或检查 CI 的 dist 路径收集逻辑。

**Q: gh-pages 部署后旧 POC 消失了？**
A: `peaceiris/actions-gh-pages` 设置了 `keep_files: true`，旧文件会保留。首次部署后确认 gh-pages 分支结构正确。

**Q: 如何本地预览某个 POC？**
```bash
cd apps/example-counter
npm install
npx ng serve
```

---

*Powered by Gemini AI · GitHub Actions · Angular 17*
