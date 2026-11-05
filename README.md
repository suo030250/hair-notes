# Hair Notes｜美髮知識與 AI Reels Wiki

Hair Notes 是給客人閱讀的美髮知識網站，隸屬 Hair × AI Studio。以白話文章整理頭皮、洗髮與日常照顧資訊，保留原始來源與適用限制，幫助客人和設計師溝通。

## 目前成果

- 網站已完成：首頁、共用文章頁、關於頁。
- 已整理兩篇文章：頭皮健康、洗頭頻率，均顯示閱讀草稿狀態。
- 支援全文搜尋、分類、清空篩選、文章目錄、來源跳轉與延伸閱讀。
- 使用原生 HTML／CSS／JavaScript，不需安裝套件或執行建置。
- GitHub Repository：[suo030250/hair-notes](https://github.com/suo030250/hair-notes)。
- 公開網站：[Hair Notes](https://suo030250.github.io/hair-notes/)，已使用 GitHub Pages 發布（main 分支的 /docs）。

## 本機瀏覽

在專案根目錄執行：

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory docs
```

開啟 [網站首頁](http://127.0.0.1:8000/)、[頭皮健康](http://127.0.0.1:8000/article.html?id=scalp-health)、[洗頭頻率](http://127.0.0.1:8000/article.html?id=shampoo-frequency) 或 [關於頁](http://127.0.0.1:8000/about.html)。預覽期間保留伺服器終端，結束時按 Ctrl+C。

文章使用 fetch 載入 JSON，請使用 HTTP 網址；直接雙擊 HTML 以 file:// 開啟可能無法讀取文章資料。

## 專案結構

```text
AGENTS.md               唯一完整的中文 AI 協作與開發規範
raw/                    原始資料與快照，僅本機研究保存
wiki/                   來源摘要、主題、問題、索引與日誌
projects/reels/         短影音企劃與成效實驗
templates/              知識與企劃模板
docs/                   GitHub Pages 公開網站
  index.html            首頁
  article.html          共用文章頁
  about.html            關於頁
  data/articles.json    公開文章唯一內容來源
  assets/css/           共用樣式
  assets/js/            搜尋、分類與文章渲染
  assets/images/        本專案繪製的抽象 SVG
  .nojekyll             靜態檔案直接發布
tools/check_site.py     文章資料、引用與網站連結檢查
```

## 如何持續新增內容

依 [AGENTS.md](AGENTS.md) 操作：

1. 使用者提供文章、連結或附件後，先在 `raw/` 保存原始資料、網址、日期與取得狀態。
2. 建立來源摘要，更新相關 Wiki、[索引](wiki/index.md) 與[日誌](wiki/log.md)。
3. 將適合給客人閱讀的內容編輯成 `docs/data/articles.json` 的一筆資料，保留對應 `wikiPath`、來源及限制。
4. 卡片、分類、搜尋及文章目錄會沿用共用程式顯示，不必另外複製一份 HTML。
5. 執行資料檢查，並在瀏覽器實測新文章、搜尋及手機排版。

例如可以說：「請匯入這份資料，再依 AGENTS.md 整理成客人可閱讀的文章，更新網站資料、Wiki、索引與日誌。」

知識入口：[美髮知識](wiki/topics/hair-knowledge.md)、[頭皮健康](wiki/topics/scalp-health.md)、[洗頭頻率](wiki/topics/shampoo-frequency.md)。內部製作參考：[Reels 專案](projects/reels/README.md)、[模板](templates/README.md)。

## 驗證

```powershell
python tools/check_site.py
node --check docs/assets/js/app.js
```

資料檢查包含必要欄位、唯一 ID、文章日期、來源編號、對應 Wiki 檔、HTML 本機連結、錨點、資源路徑與公開目錄範圍。仍須實際瀏覽確認視覺與互動。

本次已在瀏覽器確認：首頁與兩篇文章、關於頁、搜尋、分類、清空篩選、無結果、無效文章 ID、來源錨點、鍵盤焦點、資料載入失敗提示及模擬 Pages 子路徑。320px 手機寬度的首頁、文章與關於頁沒有水平溢出，另檢視 1280px 桌面版。目前已完成 GitHub Pages 部署；公開首頁、資料及文章連結會在發布時另行確認。

## GitHub Pages 發布方式

1. 建立 GitHub Repository 並上傳可公開的專案檔案。
2. 在 Repository 的 Pages 設定選擇從分支發布，以實際預設分支的 `/docs` 作為目錄。
3. 發布後開啟 GitHub 提供的真實網址，檢查文章 JSON、樣式、分類與來源連結。
4. 將已確認的 Repository 與公開網站連結更新在本頁。

所有網站資源使用相對路徑，以支援 Repository 子路徑。公開網站只需要 `docs/` 內的內容。

## 原始資料與公開範圍

原始資料詳見 [raw 保存清單](raw/README.md)。本專案參考使用者提供的 LLM Wiki 方法，採原始資料、累積 Wiki、代理規範三層架構。

`raw/` 的既有來源保持不變；未確認再散布授權的全文不隨網站或公開 Repository 發布。`.gitignore` 排除原始全文、暫存、環境檔及本機截圖，只保留 raw 說明檔。這不會刪除本機資料；公開版本中的原始檔連結可能僅能在本機使用。

公開網站以自行編寫的摘要及原始網址呈現，不包含顧客個資、諮詢紀錄、原始 PDF 或下載的完整網頁。


