# 操作日誌

只附加新紀錄。日期採使用者時區 Asia/Taipei。

## [2026-11-05] init | 建立中文雙主題 LLM Wiki

- 來源：使用者貼上的方法文件，原樣保存至 [原始檔](../raw/reference/llm-wiki-pattern.txt)。
- 建立：根目錄代理規範與入口、使用說明、三層目錄、頁面模板及 Reels 專案入口。
- Wiki 頁面：[方法摘要](sources/llm-wiki-pattern.md)、[AI Reels](topics/ai-reels.md)、[美髮知識](topics/hair-knowledge.md)、[知識轉腳本流程](syntheses/hair-to-reels.md)、[研究待辦](questions/research-backlog.md)。
- 限制：未核實方法文件作者與原始發布網址；未匯入領域資料，研究入口不包含專業結論。

## [2026-11-05] schema | 依課堂作業統一規範

- 將完整規範統一到根目錄 `AGENTS.md`，移除多餘的單數檔名版本，並修正 README。
- 新增網站風格、靜態技術方案、文章資料格式、可重複新增流程、驗證、GitHub Pages 與繳交說明規則。
- 規範已完成；網站、GitHub 上傳與公開網址尚未完成，規劃路徑不代表已建立。

## [2026-11-05] schema | 調整為客人導向的專案規範

- 統一公開網站的服務對象為客人，調整文章分類、首頁與關於頁定位。
- 移除 AGENTS.md 與 README 中的外部行政要求，保留內容格式、來源管理與網站開發部署規則。
- 移除重複規範段落；既有歷史日誌保持不變。

## [2026-11-05] ingest | 頭皮健康與洗髮頻率的第一批來源

- 使用者提供：[USTI 頭皮文章](sources/usti-scalp-health.md)、[2021 洗髮頻率 PDF](sources/shampoo-wash-frequency-2021.md)。另回查並保存 [AAD 原頁](sources/aad-healthy-hair.md)，用於核對被引用的洗護建議。
- 保存：[raw 清單](../raw/README.md) 包含 HTML 快照、PDF 原樣副本、擷取文字及 SHA-256 清單；PDF 與使用者原檔校驗一致。快照不含另外下載的外部資源。
- 新增：[頭皮健康閱讀草稿](topics/scalp-health.md)、[洗頭頻率](topics/shampoo-frequency.md)。更新美髮入口、研究待辦、索引與 README。
- 規範：在 AGENTS.md 記錄後續文章／連結／附件預設先存 raw 再匯入 Wiki；來源內的指令不視為使用者要求。
- 證據限制：無法將特定產品、短期循序研究外推為所有客人的每日洗髮處方；已揭露資助與族群條件。線上補充材料未讀，其他機轉未全數查核。未製作或公開網站、短片。
- 權利：原始全文僅供內部研究保存，尚未確認公開再散布授權。

## [2026-11-05] create | 建立 Hair Notes 客人知識網站

- 完成 docs/ 首頁、共用文章頁、關於頁與兩篇 JSON 文章；使用米白、深綠與自製 SVG 抽象圖形。
- 搜尋、分類、來源引用、目錄與延伸閱讀共用程式；加入無結果、無效 ID 與資料錯誤提示。
- 新增 tools/check_site.py，更新 AGENTS.md、README、索引與頭皮頁狀態；移除規範內重複的匯入段落。
- .gitignore 排除未授權原始全文與本機暫存，原始資料保持不變。
- 驗證：資料／路徑檢查及 JavaScript 語法通過；瀏覽器實測互動、錯誤狀態、來源錨點、鍵盤焦點、320px 手機及 1280px 桌面版。模擬 GitHub Pages 子路徑載入正常。
- 狀態：本機網站完成；未建立 GitHub Repository，尚未公開部署。

## [2026-11-05] create | 調整網站為石墨灰專業配色

- 依使用者回饋，將網站背景、品牌、導覽、按鈕、卡片、提示及 SVG 插圖統一為冷白、石墨灰與銀灰，深色區塊搭配淺色文字。
- CSS 色彩變數改為語意化命名 accent 與 surface-soft，並同步更新 AGENTS.md 的色彩規範與各頁 theme-color。
- 文章內容、資料結構與既有互動維持原樣。

## [2026-11-05] create | 調整全站為現代無襯線字體

- 依使用者回饋，移除明體與裝飾斜體，統一標題、卡片、內文、英文圖說及品牌字樣的無襯線字型。
- 調整標題字重、字距與行高，並同步更新 AGENTS.md 字體規範及 favicon。

## [2026-11-05] create | 建立 GitHub 儲存庫

- 使用者授權上傳專案至其 GitHub，建立 suo030250/hair-notes 公開儲存庫。
- 上傳前網站資料與語法檢查通過，常見憑證模式掃描未發現項目；原始全文、截圖與暫存不加入版本。
- 網站部署狀態在完成後另行記錄。

## [2026-11-05] create | 上傳 GitHub 並啟用公開網站

- 專案已上傳 https://github.com/suo030250/hair-notes，33 個專案檔案與本機內容比對一致。
- 使用 GitHub 網頁提交一次性 Actions 匯入，完成後已刪除匯入工作流程；未變更本機其他 GitHub 帳號憑證。
- GitHub Pages 設定為 main 分支 /docs，公開網址 https://suo030250.github.io/hair-notes/ 已回傳 HTTP 200。
- 原始 PDF、完整網頁、暫存與本機截圖未上傳；僅 raw/README.md 隨專案公開。
- 更新 README、Wiki 索引及頭皮頁的網站狀態。

## [2026-11-10] schema | 建立四大支柱每日文章排程

- 保存使用者提供的題庫與候選書目至 raw/reference/daily-pillars-2026-11-10.md，尚未查核其書目或研究結論。
- 新增 projects/editorial/daily-plan.md 與 daily-state.json，定義輪播、當日去重、證據檢查及發布完成判準。
- 更新 AGENTS.md，授權流程為來源保存、Wiki／索引／日誌更新、網站資料更新、檢查及發布。
- 建立 App 每日 09:00（Asia/Taipei）排程 hair-notes；尚未執行首篇，也未驗證無人值守 GitHub 發布。

## [2026-11-11] ingest | 首篇每日文章：頭髮生長週期

- 支柱：頭皮生理與科學。查重後選定 hair-growth-cycle，尚未記為發布成功。
- raw 保存三個來源頁面及作者機構摘要；PubMed 直接下載為 Cookie 檢查頁，另記限制，未改寫原始快照。
- 核實 Schneider 等 2009 正式篇名為 The Hair Follicle as a Dynamic Miniorgan，文獻類型為綜述，僅讀摘要；全文、資助及利益關係仍待查核。
- 新增三份來源摘要、毛囊週期主題及公開文章；更新索引與 Q008／Q009，保留日常掉髮數值範圍差異，不作診斷門檻。
- 等待內容檢查與公開網址驗證；只有成功後推進輪播。
