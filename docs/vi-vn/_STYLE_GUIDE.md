---
title: "Hướng Dẫn Phong Cách Tài Liệu"
description: Các quy ước tài liệu dành riêng cho dự án, dựa trên phong cách tài liệu của Google và cấu trúc Diataxis
---

Dự án này tuân theo [Google Developer Documentation Style Guide](https://developers.google.com/style) và dùng [Diataxis](https://diataxis.fr/) để tổ chức nội dung. Phần dưới đây chỉ nêu các quy ước dành riêng cho dự án.

## Quy tắc riêng của dự án

| Quy tắc | Quy định |
| --- | --- |
| Không dùng đường kẻ ngang (`---`) | Làm gián đoạn dòng đọc |
| Không dùng tiêu đề `####` | Dùng chữ in đậm hoặc admonition thay thế |
| Không có mục "Related" hoặc "Next:" | Sidebar đã xử lý điều hướng |
| Không dùng danh sách lồng quá sâu | Tách thành các mục riêng |
| Không dùng code block cho nội dung không phải code | Dùng admonition cho ví dụ hội thoại |
| Không dùng cả đoạn in đậm để làm callout | Dùng admonition thay thế |
| Mỗi mục tối đa 1-2 admonition | Tutorial có thể dùng 3-4 admonition cho mỗi phần lớn |
| Ô bảng / mục danh sách | Tối đa 1-2 câu |
| Ngân sách tiêu đề | 8-12 `##` cho mỗi tài liệu; 2-3 `###` cho mỗi phần |

## Admonition (cú pháp Starlight)

```md
:::tip[Tiêu đề]
Lối tắt, best practice
:::

:::note[Tiêu đề]
Ngữ cảnh, định nghĩa, ví dụ, điều kiện tiên quyết
:::

:::caution[Tiêu đề]
Lưu ý, vấn đề có thể xảy ra
:::

:::danger[Tiêu đề]
Chỉ dùng cho cảnh báo nghiêm trọng — mất dữ liệu, vấn đề bảo mật
:::
```

### Cách dùng chuẩn

| Admonition | Dùng cho |
| --- | --- |
| `:::note[Điều kiện tiên quyết]` | Các phụ thuộc trước khi bắt đầu |
| `:::tip[Lối đi nhanh]` | Tóm tắt TL;DR ở đầu tài liệu |
| `:::caution[Quan trọng]` | Cảnh báo quan trọng |
| `:::note[Ví dụ]` | Ví dụ lệnh / phản hồi |

## Mẫu bảng chuẩn

**Phase:**

```md
| Phase | Tên | Điều xảy ra |
| ----- | --- | ------------ |
| 1     | Analysis | Brainstorm, nghiên cứu *(tùy chọn)* |
| 2     | Planning | Yêu cầu — PRD hoặc spec *(bắt buộc)* |
```

**Skill:**

```md
| Skill | Agent | Mục đích |
| ----- | ----- | -------- |
| `bmad-brainstorming` | Analyst | Brainstorm cho dự án mới |
| `bmad-create-prd` | PM | Tạo tài liệu yêu cầu sản phẩm |
```

## Khối cấu trúc thư mục

Hiển thị trong phần "Bạn đã hoàn thành những gì":

````md
```
your-project/
├── _bmad/                                   # Cấu hình BMad
├── _bmad-output/
│   ├── planning-artifacts/
│   │   └── PRD.md                           # Tài liệu yêu cầu của bạn
│   ├── implementation-artifacts/
│   └── project-context.md                   # Quy tắc triển khai (tùy chọn)
└── ...
```
````

## Cấu trúc Tutorial

```text
1. Tiêu đề + Hook (1-2 câu mô tả kết quả)
2. Thông báo phiên bản/module (admonition info hoặc warning) (tùy chọn)
3. Bạn sẽ học được gì (danh sách kết quả)
4. Điều kiện tiên quyết (admonition info)
5. Lối đi nhanh (admonition tip - tóm tắt TL;DR)
6. Hiểu về [Chủ đề] (ngữ cảnh trước các bước - bảng cho phase/agent)
7. Cài đặt (tùy chọn)
8. Bước 1: [Nhiệm vụ lớn đầu tiên]
9. Bước 2: [Nhiệm vụ lớn thứ hai]
10. Bước 3: [Nhiệm vụ lớn thứ ba]
11. Bạn đã hoàn thành những gì (tóm tắt + cấu trúc thư mục)
12. Tra cứu nhanh (bảng skill)
13. Câu hỏi thường gặp (định dạng FAQ)
14. Nhận hỗ trợ (liên kết cộng đồng)
15. Điểm chính cần nhớ (admonition tip)
```

### Checklist cho Tutorial

- [ ] Hook mô tả kết quả trong 1-2 câu
- [ ] Có phần "Bạn sẽ học được gì"
- [ ] Điều kiện tiên quyết nằm trong admonition
- [ ] Có admonition TL;DR ở đầu trang
- [ ] Có bảng cho phase, skill, agent
- [ ] Có phần "Bạn đã hoàn thành những gì"
- [ ] Có bảng tra cứu nhanh
- [ ] Có phần câu hỏi thường gặp
- [ ] Có phần nhận hỗ trợ
- [ ] Có admonition điểm chính ở cuối

## Cấu trúc How-To

```text
1. Tiêu đề + Hook (một câu: "Sử dụng workflow `X` để...")
2. Khi nào nên dùng (danh sách kịch bản)
3. Khi nào nên bỏ qua (tùy chọn)
4. Điều kiện tiên quyết (admonition note)
5. Các bước (mục con `###` có đánh số)
6. Bạn sẽ nhận được gì (output / artifact)
7. Ví dụ (tùy chọn)
8. Mẹo (tùy chọn)
9. Bước tiếp theo (tùy chọn)
```

### Checklist cho How-To

- [ ] Hook bắt đầu bằng "Sử dụng workflow `X` để..."
- [ ] Phần "Khi nào nên dùng" có 3-5 gạch đầu dòng
- [ ] Có liệt kê điều kiện tiên quyết
- [ ] Các bước là mục `###` có đánh số và bắt đầu bằng động từ
- [ ] Phần "Bạn sẽ nhận được gì" mô tả artifact đầu ra

## Cấu trúc Explanation

### Các loại

| Loại | Ví dụ |
| --- | --- |
| **Trang chỉ mục / landing** | `core-concepts/index.md` |
| **Khái niệm** | `what-are-agents.md` |
| **Tính năng** | `quick-dev.md` |
| **Triết lý** | `why-solutioning-matters.md` |
| **FAQ** | `established-projects-faq.md` |

### Mẫu tổng quát

```text
1. Tiêu đề + Hook (1-2 câu)
2. Tổng quan / định nghĩa (nó là gì, vì sao quan trọng)
3. Khái niệm chính (các mục `###`)
4. Bảng so sánh (tùy chọn)
5. Khi nào nên dùng / không nên dùng (tùy chọn)
6. Sơ đồ (tùy chọn - mermaid, tối đa 1 sơ đồ mỗi tài liệu)
7. Bước tiếp theo (tùy chọn)
```

### Trang chỉ mục / landing

```text
1. Tiêu đề + Hook (một câu)
2. Bảng nội dung (liên kết kèm mô tả)
3. Bắt đầu từ đâu (danh sách có đánh số)
4. Chọn hướng đi của bạn (tùy chọn - cây quyết định)
```

### Trang giải thích khái niệm

```text
1. Tiêu đề + Hook (nó là gì)
2. Loại / nhóm (các mục `###`) (tùy chọn)
3. Bảng khác biệt chính
4. Thành phần / bộ phận
5. Nên chọn cái nào?
6. Cách tạo / tùy chỉnh (trỏ sang how-to)
```

### Trang giải thích tính năng

```text
1. Tiêu đề + Hook (nó làm gì)
2. Thông tin nhanh (tùy chọn - "Phù hợp với:", "Mất bao lâu:")
3. Khi nào nên dùng / không nên dùng
4. Cách nó hoạt động (mermaid tùy chọn)
5. Lợi ích chính
6. Bảng so sánh (tùy chọn)
7. Khi nào nên nâng cấp / chuyển hướng (tùy chọn)
```

### Tài liệu về triết lý / lý do

```text
1. Tiêu đề + Hook (nguyên tắc)
2. Vấn đề
3. Giải pháp
4. Nguyên tắc chính (các mục `###`)
5. Lợi ích
6. Khi nào áp dụng
```

### Checklist cho Explanation

- [ ] Hook nêu rõ tài liệu giải thích điều gì
- [ ] Nội dung được chia thành các phần `##` dễ quét
- [ ] Có bảng so sánh khi có từ 3 lựa chọn trở lên
- [ ] Sơ đồ có nhãn rõ ràng
- [ ] Có liên kết sang how-to cho câu hỏi mang tính thủ tục
- [ ] Mỗi tài liệu tối đa 2-3 admonition

## Cấu trúc Reference

### Các loại

| Loại | Ví dụ |
| --- | --- |
| **Trang chỉ mục / landing** | `workflows/index.md` |
| **Danh mục** | `agents/index.md` |
| **Đào sâu** | `document-project.md` |
| **Cấu hình** | `core-tasks.md` |
| **Bảng thuật ngữ** | `glossary/index.md` |
| **Tổng hợp đầy đủ** | `bmgd-workflows.md` |

### Trang chỉ mục của Reference

```text
1. Tiêu đề + Hook (một câu)
2. Các phần nội dung (`##` cho từng nhóm)
   - Danh sách gạch đầu dòng với liên kết và mô tả
```

### Reference dạng danh mục

```text
1. Tiêu đề + Hook
2. Các mục (`##` cho từng mục)
   - Mô tả ngắn (một câu)
   - **Skills:** hoặc **Thông tin chính:** ở dạng danh sách phẳng
3. Phần dùng chung / toàn cục (`##`) (tùy chọn)
```

### Reference đào sâu theo mục

```text
1. Tiêu đề + Hook (một câu nêu mục đích)
2. Thông tin nhanh (admonition note, tùy chọn)
   - Module, Skill, Input, Output dưới dạng danh sách
3. Mục đích / tổng quan (`##`)
4. Cách gọi (code block)
5. Các phần chính (`##` cho từng khía cạnh)
   - Dùng `###` cho các tùy chọn con
6. Ghi chú / lưu ý (admonition tip hoặc caution)
```

### Reference về cấu hình

```text
1. Tiêu đề + Hook
2. Mục lục (jump link nếu có từ 4 mục trở lên)
3. Các mục (`##` cho từng config / task)
   - **Tóm tắt in đậm** — một câu
   - **Dùng khi:** danh sách gạch đầu dòng
   - **Cách hoạt động:** các bước đánh số (tối đa 3-5 bước)
   - **Output:** kết quả mong đợi (tùy chọn)
```

### Hướng dẫn reference tổng hợp

```text
1. Tiêu đề + Hook
2. Tổng quan (`##`)
   - Sơ đồ hoặc bảng mô tả cách tổ chức
3. Các phần lớn (`##` cho từng phase / nhóm)
   - Các mục (`###` cho từng mục)
   - Các trường chuẩn hóa: Skill, Agent, Input, Output, Description
4. Bước tiếp theo (tùy chọn)
```

### Checklist cho Reference

- [ ] Hook nêu rõ tài liệu đang tham chiếu điều gì
- [ ] Cấu trúc phù hợp với loại reference
- [ ] Các mục dùng cấu trúc nhất quán xuyên suốt
- [ ] Có bảng cho dữ liệu có cấu trúc / so sánh
- [ ] Có liên kết sang tài liệu explanation cho chiều sâu khái niệm
- [ ] Tối đa 1-2 admonition

## Cấu trúc Glossary

Starlight tạo phần điều hướng "On this page" từ các tiêu đề:

- Dùng `##` cho các nhóm — sẽ hiện ở thanh điều hướng bên phải
- Đặt thuật ngữ trong bảng — gọn hơn so với tạo tiêu đề riêng cho từng thuật ngữ
- Không chèn TOC nội tuyến — sidebar bên phải đã xử lý điều hướng

### Định dạng bảng

```md
## Tên nhóm

| Thuật ngữ | Định nghĩa |
| --------- | ---------- |
| **Agent** | AI persona chuyên biệt với chuyên môn cụ thể để dẫn dắt người dùng qua workflow. |
| **Workflow** | Quy trình nhiều bước có hướng dẫn, điều phối hoạt động của agent AI để tạo deliverable. |
```

### Quy tắc viết định nghĩa

| Nên làm | Không nên làm |
| --- | --- |
| Bắt đầu bằng việc nó LÀ gì hoặc LÀM gì | Bắt đầu bằng "Đây là..." hoặc "Một [thuật ngữ] là..." |
| Giữ trong 1-2 câu | Viết thành nhiều đoạn dài |
| Bôi đậm tên thuật ngữ trong ô | Để thuật ngữ ở dạng chữ thường |

### Dấu hiệu ngữ cảnh

Thêm ngữ cảnh in nghiêng ở đầu định nghĩa với các thuật ngữ có phạm vi hẹp:

- `*Chỉ dành cho Quick Flow.*`
- `*BMad Method/Enterprise.*`
- `*Phase N.*`
- `*BMGD.*`
- `*Dự án hiện có.*`

### Checklist cho Glossary

- [ ] Thuật ngữ nằm trong bảng, không dùng tiêu đề riêng
- [ ] Thuật ngữ được sắp theo thứ tự chữ cái trong từng nhóm
- [ ] Định nghĩa dài 1-2 câu
- [ ] Dấu hiệu ngữ cảnh được in nghiêng
- [ ] Tên thuật ngữ được bôi đậm trong ô
- [ ] Không dùng kiểu định nghĩa "Một [thuật ngữ] là..."

## Phần FAQ

```md
## Các câu hỏi

- [Lúc nào cũng cần kiến trúc à?](#luc-nao-cung-can-kien-truc-a)
- [Tôi có thể đổi kế hoạch về sau không?](#toi-co-the-doi-ke-hoach-ve-sau-khong)

### Lúc nào cũng cần kiến trúc à?

Chỉ với nhánh BMad Method và Enterprise. Quick Flow bỏ qua để đi thẳng vào triển khai.

### Tôi có thể đổi kế hoạch về sau không?

Có. Workflow `bmad-correct-course` xử lý thay đổi phạm vi giữa chừng.

**Có câu hỏi chưa được trả lời ở đây?** [Mở issue](...) hoặc hỏi trên [Discord](...).
```

## Các Lệnh Kiểm Tra

Trước khi gửi thay đổi tài liệu:

```bash
npm run docs:fix-links            # Xem trước các sửa định dạng link
npm run docs:fix-links -- --write # Áp dụng các sửa
npm run docs:validate-links       # Kiểm tra link tồn tại
npm run docs:build                # Xác minh không có lỗi build
```