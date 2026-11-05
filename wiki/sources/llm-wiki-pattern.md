---
title: "LLM Wiki 方法說明"
type: source
status: reviewed
created: 2026-11-05
updated: 2026-11-05
tags: [方法, 知識管理]
sources: []
---

# LLM Wiki 方法說明

## 來源資訊

- 原始資料：[使用者貼上版本](../../raw/reference/llm-wiki-pattern.txt)
- 原文標題：LLM Wiki — A pattern for building personal knowledge bases using LLMs.
- 作者、發布日期、原始網址與授權：未知。
- 取得日期：2026-11-05。
- 來源類型：使用者提供的方法文件；使用者要求參考 Karpathy LLM Wiki，但本次未獨立核實文件歸屬。
- 閱讀範圍：完整貼上文字。`reviewed` 僅表示摘要已對照此版本。

## 核心內容

1. **Core idea**：讓 LLM 持續編纂與維護 Wiki，把閱讀與綜合分析的成果保存下來，供後續問題重用。
2. **Architecture**：分為不可變原始資料、LLM 維護的 Wiki 與規範代理行為的 schema。
3. **Operations**：匯入資料時更新相關頁面；問答的有價值結果可存回 Wiki；定期維護矛盾、過時資訊與缺漏。
4. **Indexing and logging**：索引負責內容導覽，日誌按時間記錄操作，兩者目的不同。
5. **Optional / Tips**：搜尋工具、Obsidian、附件、圖表與版本控制等依需求選用。

以上為原始文件相應章節的摘要，不是領域研究證據。

## 本庫的應用與推論

把方法套用至 [AI Reels](../topics/ai-reels.md) 與 [美髮知識](../topics/hair-knowledge.md)，以 [知識轉腳本流程](../syntheses/hair-to-reels.md) 連接。專案、模板、狀態欄位與領域證據規則是本庫的設計選擇，不宣稱是原文強制規格。
