---
title: 'Cài đặt module tùy chỉnh và module cộng đồng'
description: Cài các module bên thứ ba từ kho cộng đồng (community registry), kho Git hoặc đường dẫn cục bộ
sidebar:
  order: 3
---

Sử dụng trình cài đặt BMad để thêm module từ kho cộng đồng (community registry), kho Git của bên thứ ba hoặc đường dẫn file cục bộ.

## Khi nào nên dùng

- Cài một module do cộng đồng đóng góp từ BMad registry
- Cài module từ kho Git của bên thứ ba như GitHub, GitLab, Bitbucket hoặc máy chủ tự host
- Kiểm thử một module bạn đang phát triển cục bộ với BMad Builder
- Cài module từ máy chủ Git riêng tư hoặc tự host

:::note[Điều kiện tiên quyết]
Yêu cầu [Node.js](https://nodejs.org) v20+ và `npx` đi kèm npm. Bạn có thể chọn module tùy chỉnh và module cộng đồng trong lúc cài mới, hoặc thêm chúng vào một bản cài hiện có.
:::

## Module cộng đồng

Các module cộng đồng được tuyển chọn trong [BMad plugins marketplace](https://github.com/bmad-code-org/bmad-plugins-marketplace). Chúng được sắp theo danh mục và được ghim vào commit đã được phê duyệt để tăng độ an toàn.

### 1. Chạy trình cài đặt

```bash
npx bmad-method install
```

### 2. Duyệt danh mục (catalog) cộng đồng

Sau khi chọn module chính thức, trình cài đặt sẽ hỏi:

```
Would you like to browse community modules?
```

Chọn **Yes** để vào màn hình duyệt catalog. Tại đây bạn có thể:

- Duyệt theo danh mục
- Xem các module nổi bật
- Xem toàn bộ module khả dụng
- Tìm kiếm theo từ khóa

### 3. Chọn module

Chọn module từ bất kỳ danh mục nào. Trình cài đặt sẽ hiển thị mô tả, phiên bản và mức độ tin cậy (trust tier). Những module đã cài sẽ được tick sẵn để tiện cập nhật.

### 4. Tiếp tục quá trình cài đặt

Sau khi chọn xong module cộng đồng, trình cài đặt sẽ chuyển sang bước nguồn tùy chỉnh (custom source), rồi tới cấu hình tool/IDE và phần còn lại của luồng cài đặt.

## Nguồn tùy chỉnh: Git URL và đường dẫn cục bộ

Module tùy chỉnh có thể đến từ bất kỳ kho Git nào hoặc từ một thư mục cục bộ trên máy bạn. Trình cài đặt sẽ resolve nguồn, phân tích cấu trúc module rồi cài nó song song với các module khác.

### Cài đặt tương tác

Trong quá trình cài, sau bước chọn community module, trình cài đặt sẽ hỏi:

```
Would you like to install from a custom source (Git URL or local path)?
```

Chọn **Yes**, rồi nhập nguồn:

| Loại đầu vào | Ví dụ |
| --------------------- | ------------------------------------------------- |
| HTTPS URL trên bất kỳ host nào | `https://github.com/org/repo` |
| HTTPS URL trỏ vào một thư mục con | `https://github.com/org/repo/tree/main/my-module` |
| SSH URL | `git@github.com:org/repo.git` |
| Đường dẫn cục bộ | `/Users/me/projects/my-module` |
| Đường dẫn cục bộ dùng `~` | `~/projects/my-module` |

Với URL, trình cài đặt sẽ clone repository. Với đường dẫn cục bộ, nó sẽ đọc trực tiếp từ đĩa. Sau đó nó sẽ hiển thị các module tìm thấy để bạn chọn cài.

### Cài đặt không tương tác

Dùng cờ `--custom-source` để cài module tùy chỉnh từ dòng lệnh:

```bash
npx bmad-method install \
  --directory . \
  --custom-source /path/to/my-module \
  --tools claude-code \
  --yes
```

Khi cung cấp `--custom-source` mà không kèm `--modules`, hệ thống chỉ cài core và các module tùy chỉnh. Nếu muốn cài cả module chính thức, hãy thêm `--modules`:

```bash
npx bmad-method install \
  --directory . \
  --modules bmm \
  --custom-source https://gitlab.com/myorg/my-module \
  --tools claude-code \
  --yes
```

Bạn có thể truyền nhiều nguồn bằng cách ngăn cách chúng bằng dấu phẩy:

```bash
--custom-source /path/one,https://github.com/org/repo,/path/two
```

## Cơ chế phát hiện module

Trình cài đặt dùng hai chế độ để tìm module có thể cài trong một nguồn:

| Chế độ | Điều kiện kích hoạt | Hành vi |
| --------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Discovery | Nguồn chứa `.claude-plugin/marketplace.json` | Liệt kê toàn bộ plugin trong manifest để bạn chọn cái nào cần cài |
| Direct | Không tìm thấy `marketplace.json` | Quét thư mục để tìm các skill, tức các thư mục con chứa `SKILL.md`, rồi coi toàn bộ như một module duy nhất |

Discovery là chế độ phát hiện qua manifest. Direct là chế độ quét trực tiếp thư mục. Discovery phù hợp với module đã publish, còn Direct thuận tiện khi bạn đang trỏ vào một thư mục skills trong quá trình phát triển cục bộ.

:::note[Về thư mục `.claude-plugin/`]
Đường dẫn `.claude-plugin/marketplace.json` là một quy ước tiêu chuẩn được nhiều trình cài đặt AI tool cùng dùng để hỗ trợ khả năng khám phá plugin. Nó không đòi hỏi Claude, không dùng Claude API và cũng không ảnh hưởng tới việc bạn đang dùng công cụ AI nào. Bất kỳ module nào có file này đều có thể được khám phá bởi những trình cài đặt tuân theo cùng quy ước.
:::

## Quy trình phát triển cục bộ

Nếu bạn đang xây một module bằng [BMad Builder](https://github.com/bmad-code-org/bmad-builder), bạn có thể cài trực tiếp từ thư mục đang làm việc:

```bash
npx bmad-method install \
  --directory ~/my-project \
  --custom-source ~/my-module-repo/skills \
  --tools claude-code \
  --yes
```

Nguồn cục bộ được tham chiếu theo đường dẫn, không bị copy vào cache. Khi bạn sửa source của module rồi cài lại, trình cài đặt sẽ lấy đúng các thay đổi mới nhất.

:::caution[Xóa nguồn sau khi cài]
Nếu bạn xóa thư mục nguồn cục bộ sau khi cài, các file module đã được cài bên trong `_bmad/` vẫn được giữ nguyên. Tuy vậy, module đó sẽ bị bỏ qua trong các lần cập nhật cho tới khi đường dẫn nguồn được khôi phục.
:::

## Bạn sẽ nhận được gì

Sau khi cài, các module tùy chỉnh sẽ xuất hiện trong `_bmad/` cùng với module chính thức:

```text
your-project/
├── _bmad/
│   ├── core/              # Module core tích hợp
│   ├── bmm/               # Module chính thức, nếu bạn chọn
│   ├── my-module/         # Module tùy chỉnh của bạn
│   │   ├── my-skill/
│   │   │   └── SKILL.md
│   │   └── module-help.csv
│   └── _config/
│       └── manifest.yaml  # Theo dõi mọi module, phiên bản và nguồn
└── ...
```

Manifest sẽ ghi lại nguồn của từng module tùy chỉnh, dùng `repoUrl` cho nguồn Git và `localPath` cho nguồn cục bộ, để quá trình cập nhật nhanh (quick update) sau này có thể tìm lại nguồn chính xác.

## Cập nhật module tùy chỉnh

Module tùy chỉnh tham gia vào luồng cập nhật bình thường:

- **Cập nhật nhanh (quick update)** với `--action quick-update`: làm mới mọi module từ đúng nguồn ban đầu. Module dựa trên Git sẽ được fetch lại, còn module cục bộ sẽ được đọc lại từ đường dẫn nguồn
- **Cập nhật đầy đủ (full update)**: chạy lại bước chọn module để bạn có thể thêm hoặc gỡ module tùy chỉnh

## Tạo module của riêng bạn

Hãy dùng [BMad Builder](https://github.com/bmad-code-org/bmad-builder) để tạo module mà người khác có thể cài:

1. Chạy `bmad-module-builder` để sinh skeleton cho module
2. Thêm skill, agent và workflow bằng các công cụ builder tương ứng
3. Publish lên một kho Git hoặc chia sẻ cả thư mục
4. Người khác có thể cài bằng `--custom-source <url-kho-cua-ban>`

Nếu muốn module hỗ trợ chế độ Discovery, hãy thêm `.claude-plugin/marketplace.json` ở root repository. Đây là quy ước chung giữa nhiều công cụ, không dành riêng cho Claude. Hãy xem [tài liệu của BMad Builder](https://github.com/bmad-code-org/bmad-builder) để biết định dạng của `marketplace.json`.

:::tip[Hãy thử cục bộ trước]
Trong quá trình phát triển, hãy cài module bằng đường dẫn cục bộ để lặp nhanh trước khi publish lên kho Git.
:::
