---
title: '為什麼我在自己伺服器上跑 Hermes Agent'
pubDate: 2026-05-31
description: '從 ChatGPT 訂閱到自架 AI 代理的旅程——為什麼我選擇在自己的 VPS 上跑 Hermes Agent，以及這段經歷教會我的事'
author: 'WAHSUN'
image:
  url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2574&auto=format&fit=crop'
  alt: 'Server rack with blinking LED lights in a dark data center'
tags: ['AI', 'Hermes Agent', '自架部署', '開源']
---

## 從 ChatGPT Plus 開始

像很多人一樣，我的 AI 旅程從 ChatGPT Plus 開始。每月 $20，換來 GPT-4 的存取權、一點點 DALL-E 生成額度，以及一個還算好用的網頁介面。

問題是：**我越來越不喜歡把所有的對話都放在別人的伺服器上。**

不是說 OpenAI 不安全——他們的 infra 很強。但當我開始把 AI 整合進日常工作流程——監控伺服器、自動回覆郵件、排程任務——我需要一個能真正**屬於我**的系統。

## 尋找替代方案

我試過幾條路：

- **Llama.cpp + 本地模型** — 在自己的機器上推理很酷，但 MacBook 的散熱風扇轉起來像要起飛。而且我需要一個能一直跑著的服務，不是偶爾開一下的玩具。

- **OpenAI API + 自寫腳本** — 技術上可行，但很快就變成了一堆散亂的 Python 腳本，沒有統一的狀態管理、沒有排程系統、沒有工具生態系。

- **其他開源 agent 框架** — 有些太實驗室，文檔寫得像論文摘要；有些太重量級，光設定就要開一堆 Docker container。

直到我找到 **Hermes Agent**。

## 為什麼是 Hermes Agent？

Hermes Agent 打中我的痛點，因為它不做過多假設：

1. **它不是一個平台，是一個代理** — 不需要開帳號、不需要 dashboard、不需要 SaaS 綁定。`pip install` 然後 `hermes run`，就這麼簡單。

2. **工具即能力** — 它不強迫你用特定的 LLM、特定的平台。我可以接不同的模型（OpenAI、Anthropic、本地模型混搭），可以把自己的 shell script 註冊成 skill。**擴展性來自工具，而不是來自 API。**

3. **cron 是第一公民** — 這是 killer feature。我可以說「每天九點檢查磁碟用量，超過 85% 發警報給我」，Hermes 會自動排程並在 Telegram 上通知我。不需要寫 systemd timer、不需要設定 healthchecks.io、不需要另外開一個 cron container。

## 設定過程

在一台 Debian VPS 上設定 Hermes Agent 大概花了 15 分鐘：

```bash
# 安裝
pip install hermes-agent

# 初始化
hermes init

# 啟動
hermes chat
```

然後連上 Telegram gateway，設定 model provider，裝上需要的 skill pack。從零到第一次對話，**不到半小時**。

最驚喜的是 skill 系統。它不像 plugin 那樣需要寫程式碼——你可以用自然語言定義一個 skill，Hermes 會記住流程。下次遇到同樣類型的任務，它自動套用。這讓重複性工作（伺服器健檢、備份確認、log 分析）變得幾乎零成本。

## 實際跑了什麼

目前我的 Hermes Agent 在處理這些事情：

- **系統監控** — 每天健康報告、磁碟用量告警、自動封鎖掃描 IP
- **部落格管理** — 這篇文章就是透過 Hermes 寫的，它會自動 build 並 deploy 到 GitHub Pages
- **郵件通知** — 緊急事件透過 Gmail SMTP 發送警報
- **排程任務** — 定時腳本執行、輸出彙整、異常通報

全部透過 Telegram 對話管理。我不用 SSH 進去檢查狀態——直接問 Hermes 就好了。

## 學到的教訓

自架 AI 代理不是沒有代價：

- **模型成本照付** — 你自己接 API key，該花的錢還是要花。但因為你不是買 subscription，用量決定價格，輕度使用反而更便宜。
- **你需要一台 24/7 的伺服器** — VPS 最低配就夠了（我跑在 1GB RAM 的機器上），但你不能沒有。
- **除錯靠自己** — 遇到問題沒有 customer support，你要讀 log、看 GitHub issues、自己 patch。不過這也是 open source 的樂趣。

## 結語

如果你已經在用 AI 輔助工作，花一個下午設定自己的 Hermes Agent，我覺得是值得的投資。不是因為它比 ChatGPT 更強——在很多任務上它差不多——而是因為**它是你的**。

你的對話在你的伺服器上。你的工具鏈由你決定。你的排程任務不會因為 OpenAI 改了 policy 就不能跑。

在這個 AI 服務越來越多、但控制權越來越少的時代，**自架是一種選擇，也是一種態度。**

---

*這篇文章完全由 Hermes Agent 的 blogging skill 協助產生、透過 GitHub Actions 自動部署到 blog.wahsun.org。關於 Hermes Agent 的詳細資訊，請參考 [Hermes Agent 官方文件](https://hermes-agent.nousresearch.com/docs)。*
