---
description: 自動推送至 GitHub 的工作流程規範
---

# 自動推送規範 (Auto-Push Workflow)

## 觸發條件

當用戶確認以下情況時，主動執行 git push：

- ✅ 完整功能開發完成（經 Review 通過）
- ✅ 重大修正完成（經 Review 通過）
- ✅ 用戶明確要求推送

## 執行步驟

### 1. 推送前檢查

// turbo

```bash
# 確認 Vite base 路徑正確
grep -q "base: '/YOTA-Backstage-Prototype/'" vite.config.ts && echo "✓ Base path correct" || echo "✗ Base path ERROR"
```

### 2. 查看變更狀態

// turbo

```bash
git status
```

### 3. 暫存所有變更

```bash
git add -A
```

### 4. 提交變更（繁體中文訊息）

```bash
git commit -m "<根據修改內容生成的繁體中文說明>"
```

**Commit Message 規範：**

- 語言：繁體中文
- 格式：簡潔描述主要變更
- 範例：
  - `新增財務總覽頁面與趨勢圖表`
  - `修正會員列表搜尋與分頁功能`
  - `優化側邊欄選中樣式與路由導航`

### 5. 推送至 GitHub

```bash
git push origin main
```

### 6. 確認結果

推送完成後，回報以下資訊：

- ✅ 推送成功 / ❌ 推送失敗
- 變更的檔案數量
- Commit hash（簡短版）

## 注意事項

- 推送前務必確認 `vite.config.ts` 的 `base` 設定為 `/YOTA-Backstage-Prototype/`
- 若 base path 錯誤，GitHub Pages 部署將會失敗
- 所有 Commit Message 必須使用繁體中文
