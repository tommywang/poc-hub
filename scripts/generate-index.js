#!/usr/bin/env node
/**
 * Regenerates the hub index.html listing all deployed POC apps.
 * Called by GitHub Actions after each deployment.
 * Usage: node generate-index.js "app1 app2 app3"
 */
const fs = require('fs');
const path = require('path');

const appsArg = process.argv[2] || '';
const apps = appsArg.split(/\s+/).filter(Boolean);
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'poc-hub';
const owner = process.env.GITHUB_REPOSITORY_OWNER || '';

// Try to read poc-meta.json for richer info
let meta = {};
try {
  meta = JSON.parse(fs.readFileSync('main-repo/poc-meta.json', 'utf8'));
} catch (e) {}

const cards = apps.map(app => {
  const info = meta[app] || {};
  const url = `/${repoName}/${app}/`;
  const desc = info.description || 'Angular POC';
  const date = info.createdAt ? new Date(info.createdAt).toLocaleDateString('zh-CN') : '';
  const tags = (info.tags || ['angular']).map(t => `<span class="tag">${t}</span>`).join('');
  return `
    <a class="card" href="${url}" target="_blank">
      <div class="card-icon">⚡</div>
      <div class="card-body">
        <h3>${app}</h3>
        <p>${desc}</p>
        <div class="card-footer">
          <div class="tags">${tags}</div>
          ${date ? `<span class="date">${date}</span>` : ''}
        </div>
      </div>
    </a>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>POC Hub</title>
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #f7f6f2; --surface: #f9f8f5; --border: #d4d1ca;
      --text: #28251d; --muted: #7a7974;
      --primary: #01696f; --primary-hover: #0c4e54;
      --radius: 0.75rem; --shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    @media (prefers-color-scheme: dark) {
      :root { --bg: #171614; --surface: #1c1b19; --border: #393836;
              --text: #cdccca; --muted: #797876; --primary: #4f98a3; }
    }
    body { font-family: 'Satoshi', sans-serif; background: var(--bg); color: var(--text);
           min-height: 100vh; padding: 3rem 1.5rem; }
    header { max-width: 1100px; margin: 0 auto 3rem; }
    h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; letter-spacing: -0.03em; }
    h1 span { color: var(--primary); }
    .subtitle { color: var(--muted); margin-top: 0.5rem; font-size: 1.1rem; }
    .count { display: inline-block; background: var(--primary); color: white;
             font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 999px;
             margin-left: 0.5rem; vertical-align: middle; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem; max-width: 1100px; margin: 0 auto; }
    .card { display: flex; gap: 1rem; padding: 1.25rem; background: var(--surface);
            border: 1px solid var(--border); border-radius: var(--radius);
            text-decoration: none; color: inherit; transition: box-shadow 0.18s, transform 0.18s; }
    .card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
    .card-icon { font-size: 1.5rem; flex-shrink: 0; }
    .card-body { flex: 1; min-width: 0; }
    .card-body h3 { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.25rem;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .card-body p { color: var(--muted); font-size: 0.82rem; line-height: 1.4;
                   display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-footer { display: flex; justify-content: space-between; align-items: center;
                   margin-top: 0.75rem; }
    .tags { display: flex; gap: 0.35rem; flex-wrap: wrap; }
    .tag { background: color-mix(in oklch, var(--primary) 12%, var(--surface));
           color: var(--primary); font-size: 0.7rem; padding: 2px 7px;
           border-radius: 999px; font-weight: 500; }
    .date { color: var(--muted); font-size: 0.72rem; }
    .empty { text-align: center; color: var(--muted); padding: 4rem; max-width: 1100px; margin: 0 auto; }
    footer { text-align: center; color: var(--muted); font-size: 0.8rem;
             margin-top: 4rem; max-width: 1100px; margin-inline: auto; padding-top: 2rem;
             border-top: 1px solid var(--border); }
  </style>
</head>
<body>
  <header>
    <h1>POC <span>Hub</span> <span class="count">${apps.length}</span></h1>
    <p class="subtitle">Angular POC 实验室 — 由 Telegram Bot + Gemini AI 自动生成</p>
  </header>

  ${apps.length > 0
    ? `<div class="grid">${cards}</div>`
    : `<div class="empty"><p>暂无 POC，发送 Telegram 指令开始创建第一个 👆</p></div>`
  }

  <footer>
    <p>Powered by Gemini AI · GitHub Actions · Angular · 🤖</p>
  </footer>
</body>
</html>`;

process.stdout.write(html);
