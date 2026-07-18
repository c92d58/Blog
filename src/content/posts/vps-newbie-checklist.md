---
title: "VPS 新手必做的十件事：從開機到安心睡覺"
description: "剛買了一台 VPS 不知道從何下手？從 SSH 設定、防火牆、自動更新到備份策略，這篇文章帶你一步步把一台裸機變成可以安心放著過夜的伺服器。"
date: 2026-07-08
tags:
  - 伺服器
  - 教學
---

拿到一台全新的 VPS 的感覺很像搬進一間空房子——自由，但也空曠得讓人有點不安。你擁有 root 權限，可以做任何事，但同時也意味著任何錯誤都可能需要重裝系統。

這篇文章假設你剛買了一台 VPS（Debian 或 Ubuntu），手上只有一個 IP 位址和 root 密碼。我們的目標不是把它變成一個高併發的生產環境，而是讓它**安全、穩定、可控**——你可以在上面放心地跑一些小服務，然後安心去睡覺。

以下按照優先級排列，每一項都附帶可直接複製貼上的命令。

## 一、更新系統

拿到新機器後的第一件事：把系統更新到最新。

```bash
apt update && apt upgrade -y
```

這一步通常在幾分鐘內完成。如果 kernel 有更新，建議順手重啟一下：

```bash
reboot
```

養成習慣，之後每隔一段時間回來跑一次。你也可以設定自動更新（見第九條）。

## 二、創建普通用戶，不要一直用 root

用 root 帳號做所有事情是一個經典的新手錯誤。一旦某個服務被入侵，攻擊者就直接拿到了整台機器的最高權限。

建立一個普通用戶並賦予 sudo 權限：

```bash
adduser ws
usermod -aG sudo ws
```

之後的日常操作都用這個帳號，只有在真正需要的時候才 `sudo`。

## 三、設定 SSH 金鑰登入，關閉密碼登入

密碼登入是 VPS 安全中最薄弱的環節。暴力破解機器人無時無刻不在掃描 22 端口，嘗試各種常見密碼組合。

**在本地電腦上生成 SSH 金鑰：**

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

**把公鑰複製到伺服器：**

```bash
ssh-copy-id ws@你的伺服器IP
```

**登入伺服器後，編輯 SSH 設定：**

```bash
sudo nano /etc/ssh/sshd_config
```

找到並修改以下幾行：

```
Port 2222                    # 改成非標準端口
PermitRootLogin no           # 禁止 root 直接登入
PasswordAuthentication no    # 禁止密碼登入
PubkeyAuthentication yes     # 只允許金鑰登入
```

重啟 SSH 服務：

```bash
sudo systemctl restart sshd
```

**⚠️ 重要：在關閉密碼登入之前，先開一個新的終端窗口測試金鑰登入是否正常。** 如果你把自己鎖在外面，就需要透過 VPS 供應商的控制台（VNC）來恢復。

## 四、設定防火牆

UFW 是 Linux 上最簡單的防火牆工具，幾條命令就能讓你的 VPS 只開放需要的端口。

```bash
sudo apt install ufw -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp     # SSH 端口
sudo ufw allow 80/tcp       # HTTP
sudo ufw allow 443/tcp      # HTTPS
sudo ufw enable
sudo ufw status verbose
```

不要開放任何你不認識的端口。每多一個開放的端口，就多一條潛在的攻擊路徑。

## 五、設定 fail2ban，防止暴力破解

即使你把 SSH 端口改成了 2222，攻擊者仍然可能掃描到它。fail2ban 會自動封鎖那些反覆嘗試登入失敗的 IP 位址。

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

查看目前有沒有被封鎖的 IP：

```bash
sudo fail2ban-client status sshd
```

預設情況下，10 分鐘內失敗 5 次就會被禁 10 分鐘。你可以根據需要調整 `/etc/fail2ban/jail.local`。

## 六、更改主機名稱

預設的主機名稱通常是 VPS 供應商隨機生成的一串字符，既不美觀也難以辨識。

```bash
sudo hostnamectl set-hostname myserver
```

同時更新 `/etc/hosts`，把新主機名稱加進去：

```
127.0.1.1 myserver
```

如果你有多台機器，建議用一套統一的命名規則，例如用 IP 尾數：`103`、`185`。

## 七、設定時區

預設時區通常是 UTC。對中文用戶來說，改成亞洲時區會讓排程任務和日誌時間更好讀。

```bash
sudo timedatectl set-timezone Asia/Taipei
timedatectl status
```

## 八、設定 Swap 空間

小記憶體的 VPS（1GB 或以下）在記憶體耗盡時會直接殺掉進程。設定 Swap 可以讓系統在緊急情況下有一定的緩衝空間。

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

你不希望頻繁使用 Swap（那會極大拖慢性能），但作為一層安全網，它值得擁有。

## 九、啟用自動安全更新

你不會每天登入伺服器手動更新。讓系統自動安裝安全補丁，可以大幅減少因為已知漏洞被攻擊的風險。

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

選擇「Yes」即可。之後系統會自動安裝安全更新，不需要人為干預。

## 十、設定備份策略

這是最容易被跳過的一步，卻是最重要的。

你不需要一個複雜的備份方案。對於個人 VPS 來說，最低限度的備份就是：**定期把關鍵的設定檔備份到本地或 GitHub。**

```bash
# 備份關鍵目錄到本地
tar czf /tmp/vps-backup-$(date +%Y%m%d).tar.gz /etc /home/ws/.ssh
scp /tmp/vps-backup-*.tar.gz 你的本地電腦:~/backups/
```

如果你用 GitHub，也可以寫一個簡單的腳本，每天把設定檔推到一個私人 repo。

## 寫在最後

以上十步做完之後，你的 VPS 就從一台裸機變成了一個可以安心使用的環境。它不會防止所有攻擊，但應對常見威脅已經足夠。之後你可以開始在上面跑你真正想做的事情——架網站、掛腳本、搭代理、做實驗。

記住一個原則：**每多裝一個服務，就多一份維護成本。** 只裝你真正需要的。

---

*「一台好伺服器，是你忘記它存在時，它還在那裡安靜地運轉。」*
