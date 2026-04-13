---
title: "Hướng dẫn chia nhỏ tài liệu"
description: Tách các tệp markdown lớn thành nhiều tệp nhỏ có tổ chức để quản lý context tốt hơn
sidebar:
       order: 9
---

Sử dụng công cụ `bmad-shard-doc` nếu bạn cần tách các tệp markdown lớn thành nhiều tệp nhỏ có tổ chức để quản lý context tốt hơn.

:::caution[Đã ngừng khuyến nghị]
Đây không còn là cách được khuyến nghị, và trong thời gian tới khi workflow được cập nhật và đa số LLM/công cụ lớn hỗ trợ subprocesses, việc này sẽ không còn cần thiết.
:::

## Khi nào nên dùng

Chỉ dùng cách này nếu bạn nhận thấy tổ hợp công cụ / model bạn đang dùng không thể nạp và đọc đầy đủ tất cả tài liệu đầu vào khi cần.

## Chia nhỏ tài liệu là gì?

Chia nhỏ tài liệu là việc tách các tệp markdown lớn thành nhiều tệp nhỏ có tổ chức dựa trên các tiêu đề cấp 2 (`## Tiêu đề`).

### Kiến trúc

```text
Trước khi chia nhỏ:
_bmad-output/planning-artifacts/
└── PRD.md (tệp lớn 50k token)

Sau khi chia nhỏ:
_bmad-output/planning-artifacts/
└── prd/
       ├── index.md                    # Mục lục kèm mô tả
       ├── overview.md                 # Phần 1
       ├── user-requirements.md        # Phần 2
       ├── technical-requirements.md   # Phần 3
       └── ...                         # Các phần bổ sung
```

## Các bước thực hiện

### 1. Chạy công cụ Shard-Doc

```bash
/bmad-shard-doc
```

### 2. Làm theo quy trình tương tác

```text
Agent: Bạn muốn chia nhỏ tài liệu nào?
User: docs/PRD.md

Agent: Thư mục đích mặc định: docs/prd/
       Chấp nhận mặc định? [y/n]
User: y

Agent: Đang chia nhỏ PRD.md...
       ✓ Đã tạo 12 tệp theo từng phần
       ✓ Đã tạo index.md
       ✓ Hoàn tất!
```

## Cơ chế workflow tìm tài liệu

Workflow của BMad dùng **hệ thống phát hiện kép**:

1. **Thử tài liệu nguyên khối trước** - Tìm `document-name.md`
2. **Kiểm tra bản đã chia nhỏ** - Tìm `document-name/index.md`
3. **Quy tắc ưu tiên** - Bản nguyên khối được ưu tiên nếu cả hai cùng tồn tại; hãy xóa bản nguyên khối nếu bạn muốn workflow dùng bản đã chia nhỏ

## Hỗ trợ trong workflow

Tất cả workflow BMM đều hỗ trợ cả hai định dạng:

- Tài liệu nguyên khối
- Tài liệu đã chia nhỏ
- Tự động nhận diện
- Trong suốt với người dùng
