# UI/UX Pro Max Knowledge Base

此資料夾包含 Design System Generator 使用的 UI/UX 知識庫。

## 路徑設定

- **預設**: `{project-root}/resources/ui-ux-pro-max`
- **可覆蓋**: 在 `_bmad/bmm/config.yaml` 設定 `kb_path`

```yaml
# config.yaml - 使用預設路徑
kb_path: "{project-root}/resources/ui-ux-pro-max"

# config.yaml - 使用外部路徑
kb_path: "D:/Shared/ui-ux-pro-max"
```

## 用途

- 補完 UX 設計規範中缺失的 Design Tokens
- 提供 UI 元件規格建議
- 支援 `generate-design-system` workflow

## 查詢範例

```bash
python scripts/search.py "color palette" --domain color --json
python scripts/search.py "typography" --domain typography --json
```

## 版本

- 來源：UI/UX Pro Max Knowledge Base
- 整合日期：2025-12-21
