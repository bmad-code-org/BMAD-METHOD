---
title: Cài đặt không tương tác
description: Cài đặt BMad bằng các cờ dòng lệnh cho pipeline CI/CD và triển khai tự động
sidebar:
  order: 2
---

Sử dụng các cờ dòng lệnh để cài đặt BMad mà không cần tương tác. Cách này hữu ích cho:

## Khi nào nên dùng

- Triển khai tự động và pipeline CI/CD
- Cài đặt bằng script
- Cài đặt hàng loạt trên nhiều dự án
- Cài đặt nhanh với cấu hình đã biết trước

:::note[Điều kiện tiên quyết]
Yêu cầu [Node.js](https://nodejs.org) v20+ và `npx` (đi kèm với npm).
:::

## Các cờ khả dụng

### Tùy chọn cài đặt

| Cờ | Mô tả | Ví dụ |
|------|-------------|---------|
| `--directory <path>` | Thư mục cài đặt | `--directory ~/projects/myapp` |
| `--modules <modules>` | Danh sách ID module, cách nhau bởi dấu phẩy | `--modules bmm,bmb` |
| `--tools <tools>` | Danh sách ID công cụ/IDE, cách nhau bởi dấu phẩy (dùng `none` để bỏ qua) | `--tools claude-code,cursor` hoặc `--tools none` |
| `--action <type>` | Hành động cho bản cài đặt hiện có: `install` (mặc định), `update`, hoặc `quick-update` | `--action quick-update` |
| `--custom-source <sources>` | Danh sách Git URL hoặc đường dẫn cục bộ cho module tùy chỉnh, cách nhau bởi dấu phẩy | `--custom-source /path/to/module` |

### Cấu hình cốt lõi

| Cờ | Mô tả | Mặc định |
|------|-------------|---------|
| `--user-name <name>` | Tên để agent sử dụng | Tên người dùng hệ thống |
| `--communication-language <lang>` | Ngôn ngữ giao tiếp của agent | Tiếng Anh |
| `--document-output-language <lang>` | Ngôn ngữ đầu ra tài liệu | Tiếng Anh |
| `--output-folder <path>` | Đường dẫn thư mục output (xem quy tắc resolve bên dưới) | `_bmad-output` |

#### Quy tắc resolve đường dẫn output folder

Giá trị truyền vào `--output-folder` (hoặc nhập ở chế độ tương tác) sẽ được resolve theo các quy tắc sau:

| Loại đầu vào | Ví dụ | Được resolve thành |
|------|-------------|---------|
| Đường dẫn tương đối (mặc định) | `_bmad-output` | `<project-root>/_bmad-output` |
| Đường dẫn tương đối có traversal | `../../shared-outputs` | Đường dẫn tuyệt đối đã được chuẩn hóa, ví dụ `/Users/me/shared-outputs` |
| Đường dẫn tuyệt đối | `/Users/me/shared-outputs` | Giữ nguyên như đã nhập, **không** thêm project root vào trước |

Đường dẫn sau khi resolve là đường dẫn mà agent và workflow sẽ dùng lúc runtime để ghi file đầu ra. Việc dùng đường dẫn tuyệt đối hoặc đường dẫn tương đối có traversal cho phép bạn chuyển toàn bộ artifact sinh ra sang một thư mục nằm ngoài cây dự án, hữu ích với thư mục dùng chung hoặc cấu trúc monorepo.

### Tùy chọn khác

| Cờ | Mô tả |
|------|-------------|
| `-y, --yes` | Chấp nhận toàn bộ mặc định và bỏ qua prompt |
| `-d, --debug` | Bật output debug cho quá trình tạo manifest |

## ID module

Những ID module có thể dùng với cờ `--modules`:

- `bmm` - BMad Method Master
- `bmb` - BMad Builder

Kiểm tra [BMad registry](https://github.com/bmad-code-org) để xem các module ngoài được hỗ trợ.

## ID công cụ/IDE

Những ID công cụ có thể dùng với cờ `--tools`:

**Khuyến dùng:** `claude-code`, `cursor`

Chạy `npx bmad-method install` một lần ở chế độ tương tác để xem danh sách đầy đủ hiện tại của các công cụ được hỗ trợ, hoặc xem [cấu hình platform codes](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/tools/installer/ide/platform-codes.yaml).

## Các chế độ cài đặt

| Chế độ | Mô tả | Ví dụ |
|------|-------------|---------|
| Hoàn toàn không tương tác | Cung cấp đầy đủ cờ để bỏ qua tất cả prompt | `npx bmad-method install --directory . --modules bmm --tools claude-code --yes` |
| Bán tương tác | Cung cấp một số cờ, BMad hỏi thêm phần còn lại | `npx bmad-method install --directory . --modules bmm` |
| Chỉ dùng mặc định | Chấp nhận tất cả giá trị mặc định với `-y` | `npx bmad-method install --yes` |
| Chỉ dùng custom source | Chỉ cài core và module tùy chỉnh | `npx bmad-method install --directory . --custom-source /path/to/module --tools claude-code --yes` |
| Không cấu hình công cụ | Bỏ qua cấu hình công cụ/IDE | `npx bmad-method install --modules bmm --tools none` |

## Ví dụ

### Cài đặt cho pipeline CI/CD

```bash
#!/bin/bash
# install-bmad.sh

npx bmad-method install \
  --directory "${GITHUB_WORKSPACE}" \
  --modules bmm \
  --tools claude-code \
  --user-name "CI Bot" \
  --communication-language English \
  --document-output-language English \
  --output-folder _bmad-output \
  --yes
```

### Cập nhật bản cài đặt hiện có

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --action update \
  --modules bmm,bmb,custom-module
```

### Quick Update (giữ nguyên cài đặt)

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --action quick-update
```

### Cài từ custom source

Cài một module từ đường dẫn cục bộ hoặc từ bất kỳ Git host nào:

```bash
npx bmad-method install \
  --directory . \
  --custom-source /path/to/my-module \
  --tools claude-code \
  --yes
```

Kết hợp cùng module chính thức:

```bash
npx bmad-method install \
  --directory . \
  --modules bmm \
  --custom-source https://gitlab.com/myorg/my-module \
  --tools claude-code \
  --yes
```

:::note[Hành vi của `custom-source`]
Khi dùng `--custom-source` mà không kèm `--modules`, hệ thống chỉ cài core và các module tùy chỉnh. Nếu muốn cài cả module chính thức, hãy thêm `--modules`. Xem thêm [Cài đặt module tùy chỉnh và module cộng đồng](./install-custom-modules.md) để biết chi tiết.
:::

## Bạn nhận được gì

- Thư mục `_bmad/` đã được cấu hình đầy đủ trong dự án của bạn
- Agent và workflow đã được cấu hình theo module và công cụ bạn chọn
- Thư mục `_bmad-output/` để lưu các artifact được tạo

## Kiểm tra và xử lý lỗi

BMad sẽ kiểm tra tất cả các cờ được cung cấp:

- **Directory** - Phải là đường dẫn hợp lệ và có quyền ghi
- **Modules** - Cảnh báo nếu ID module không hợp lệ (nhưng không thất bại)
- **Tools** - Cảnh báo nếu ID công cụ không hợp lệ (nhưng không thất bại)
- **Action** - Phải là một trong: `install`, `update`, `quick-update`

Giá trị không hợp lệ sẽ dẫn đến một trong các trường hợp sau:
1. Hiện lỗi và thoát (với các tùy chọn quan trọng như directory)
2. Hiện cảnh báo và bỏ qua (với mục tùy chọn)
3. Quay lại hỏi interactive (với giá trị bắt buộc bị thiếu)

:::tip[Thực hành tốt]
- Dùng đường dẫn tuyệt đối cho `--directory` để tránh nhầm lẫn
- Dùng đường dẫn tuyệt đối cho `--output-folder` khi bạn muốn ghi artifact ra ngoài cây dự án, ví dụ vào một thư mục output dùng chung trong monorepo
- Thử nghiệm cờ ở máy local trước khi đưa vào pipeline CI/CD
- Kết hợp với `-y` nếu bạn muốn cài đặt hoàn toàn không cần can thiệp
- Dùng `--debug` nếu gặp vấn đề trong quá trình cài đặt
:::

## Khắc phục sự cố

### Cài đặt thất bại với lỗi "Invalid directory"

- Thư mục đích phải tồn tại (hoặc thư mục cha của nó phải tồn tại)
- Bạn cần quyền ghi
- Đường dẫn phải là tuyệt đối, hoặc tương đối đúng với thư mục hiện tại

### Không tìm thấy module

- Xác minh ID module có đúng không
- Module bên ngoài phải có sẵn trong registry

:::note[Vẫn bị mắc?]
Chạy với `--debug` để xem output chi tiết, thử chế độ interactive để cô lập vấn đề, hoặc báo cáo tại <https://github.com/bmad-code-org/BMAD-METHOD/issues>.
:::
