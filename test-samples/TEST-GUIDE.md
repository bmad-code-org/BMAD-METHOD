# 整合測試操作指南 (Story 2.8)

**日期:** 2025-12-23  
**目的:** 驗證 Design System Generator Workflow 端到端功能

---

## 測試環境

| 項目 | 路徑 |
|------|------|
| KB 路徑 | `d:\Bmad\azuma520-BMAD-METHOD\resources\ui-ux-pro-max` |
| Workflow | `d:\Bmad\azuma520-BMAD-METHOD\src\modules\bmm\workflows\4-implementation\generate-design-system\` |
| 樣本 A | `d:\Bmad\work\output-bmm\test-samples\sample-a\` |
| 樣本 B | `d:\Bmad\work\output-bmm\test-samples\sample-b\` |

---

## 測試流程

### 步驟 1：執行樣本 A 測試

**測試目標:** KB 有命中情境 — 驗證 KB 參考率 > 70%

1. **開啟新 Chat 視窗** (確保乾淨的 context)
2. **啟動 Dev Agent:**
   ```
   /bmad-bmm-agents-dev
   ```
3. **觸發 workflow:**
   ```
   generate-design-system
   ```
4. **當系統詢問 UX Spec 位置時，指定:**
   ```
   d:\Bmad\work\output-bmm\test-samples\sample-a\ux-design-specification.md
   ```
5. **記錄以下指標:**
   - [ ] Step 4 的 Source Distribution 表格
   - [ ] KB Reference Rate (%)
   - [ ] Step 7 的 Completeness Rate
   - [ ] 生成的 4 個輸出檔案

---

### 步驟 2：執行樣本 B 測試

**測試目標:** KB 無命中情境 — 驗證 fallback 機制

1. **開啟新 Chat 視窗** (確保乾淨的 context)
2. **啟動 Dev Agent:**
   ```
   /bmad-bmm-agents-dev
   ```
3. **觸發 workflow:**
   ```
   generate-design-system
   ```
4. **當系統詢問 UX Spec 位置時，指定:**
   ```
   d:\Bmad\work\output-bmm\test-samples\sample-b\ux-design-specification.md
   ```
5. **當提示輸入缺失值時:**
   - 輸入 `d-all` 使用全部預設值 (測試 fallback)
   - 或依提示逐一輸入
6. **記錄以下指標:**
   - [ ] Step 4 的 Source Distribution 表格
   - [ ] Fallback 觸發次數
   - [ ] Step 7 的 Completeness Rate
   - [ ] 生成的 4 個輸出檔案

---

### 步驟 3：驗證輸出檔案

**在每個樣本目錄中檢查:**

```
sample-a/
├── architecture.md          (輸入)
├── ux-design-specification.md (輸入)
├── design-tokens.json       (輸出 - 驗證)
├── theme.css                (輸出 - 驗證)
├── globals.css              (輸出 - 驗證)
└── component-specs.json     (輸出 - 驗證)
```

**驗證清單:**
- [ ] JSON 檔案可正確解析 (無語法錯誤)
- [ ] CSS 檔案可被瀏覽器解析
- [ ] design-tokens.json 包含 source 欄位
- [ ] theme.css 包含所有必要 CSS 變數

---

## 成功標準

| 指標 | 樣本 A 目標 | 樣本 B 目標 |
|------|------------|------------|
| KB 參考率 | > 70% | N/A (預期無命中) |
| 完整度 | 100% | 100% |
| 格式正確率 | 100% | 100% |
| 輸出檔案數 | 4 | 4 |

---

## 記錄測試結果

測試完成後，請將結果填入：
`d:\Bmad\work\output-bmm\test-samples\integration-test-report.md`

---

## 故障排除

| 問題 | 解決方案 |
|------|----------|
| KB 找不到 | 確認路徑 `resources/ui-ux-pro-max` 存在 |
| UX Spec 找不到 | 使用完整絕對路徑 |
| JSON 解析失敗 | 檢查生成檔案的語法 |
| Workflow 中斷 | 查看錯誤訊息，可能是輸入格式問題 |
