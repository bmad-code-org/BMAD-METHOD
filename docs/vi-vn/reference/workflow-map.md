---
title: "Sơ đồ workflow"
description: Tài liệu trực quan về các giai đoạn, quy trình và đầu ra của BMad Method
sidebar:
  order: 1
---

BMad Method (BMM) là một module trong hệ sinh thái BMad, tập trung vào các thực hành tốt nhất của kỹ nghệ ngữ cảnh và lập kế hoạch. AI agent hoạt động hiệu quả nhất khi có ngữ cảnh rõ ràng và có cấu trúc. Hệ thống BMM xây dựng ngữ cảnh đó theo tiến trình qua 4 giai đoạn riêng biệt. Mỗi giai đoạn, cùng với nhiều quy trình tùy chọn bên trong nó, tạo ra các tài liệu làm đầu vào cho giai đoạn kế tiếp, nhờ vậy agent luôn biết phải xây gì và vì sao.

Lý do và các khái niệm nền tảng ở đây đến từ các phương pháp Agile đã được áp dụng rất thành công trong toàn ngành như một khung tư duy.

Nếu có lúc nào bạn không chắc nên làm gì, skill `bmad-help` sẽ giúp bạn giữ đúng hướng hoặc biết bước tiếp theo. Bạn vẫn có thể dùng trang này để tham chiếu, nhưng `bmad-help` mang tính tương tác đầy đủ và nhanh hơn nhiều nếu bạn đã cài BMad Method. Ngoài ra, nếu bạn đang dùng thêm các module mở rộng BMad Method hoặc các module bổ sung khác, `bmad-help` cũng sẽ mở rộng theo để biết mọi thứ đang có sẵn và đưa ra lời khuyên tốt nhất tại thời điểm đó.

Lưu ý quan trọng cuối cùng: mọi quy trình dưới đây đều có thể chạy trực tiếp bằng công cụ bạn chọn thông qua skill, hoặc bằng cách nạp agent trước rồi chọn mục tương ứng trong menu agent.

<iframe src="/workflow-map-diagram.html" title="Sơ đồ Workflow Map của BMad Method" width="100%" height="100%" style="border-radius: 8px; border: 1px solid #334155; min-height: 900px;"></iframe>

<p style="font-size: 0.8rem; text-align: right; margin-top: -0.5rem; margin-bottom: 1rem;">
  <a href="/workflow-map-diagram.html" target="_blank" rel="noopener noreferrer">Mở sơ đồ trong tab mới ↗</a>
</p>

## Giai đoạn 1: Phân tích (tùy chọn)

Khám phá không gian vấn đề và xác nhận ý tưởng trước khi cam kết đi vào lập kế hoạch. [**Tìm hiểu từng công cụ làm gì và nên dùng khi nào**](../explanation/analysis-phase.md).

| Quy trình | Mục đích | Tạo ra |
| ------------------------------- | -------------------------------------------------------------------------- | ------------------------- |
| `bmad-brainstorming` | Động não ý tưởng dự án với sự điều phối của người dẫn dắt brainstorming | `brainstorming-report.md` |
| `bmad-domain-research`, `bmad-market-research`, `bmad-technical-research` | Xác thực giả định về thị trường, kỹ thuật hoặc miền nghiệp vụ | Kết quả nghiên cứu |
| `bmad-product-brief` | Ghi lại tầm nhìn chiến lược — phù hợp nhất khi concept của bạn đã rõ | `product-brief.md` |
| `bmad-prfaq` | Working Backwards — stress-test và rèn sắc concept sản phẩm của bạn | `prfaq-{project}.md` |

## Giai đoạn 2: Lập kế hoạch

Xác định cần xây gì và xây cho ai.

| Quy trình | Mục đích | Tạo ra |
| --------------------------- | ---------------------------------------- | ------------ |
| `bmad-create-prd` | Xác định yêu cầu (FR/NFR) | `PRD.md` |
| `bmad-create-ux-design` | Thiết kế trải nghiệm người dùng khi UX là yếu tố quan trọng | `ux-spec.md` |

## Giai đoạn 3: Định hình giải pháp

Quyết định cách xây và chia nhỏ công việc thành các story.

| Quy trình | Mục đích | Tạo ra |
| ----------------------------------------- | ------------------------------------------ | --------------------------- |
| `bmad-create-architecture` | Làm rõ các quyết định kỹ thuật | `architecture.md` kèm ADR |
| `bmad-create-epics-and-stories` | Phân rã yêu cầu thành các phần việc có thể triển khai | Các file epic chứa các story |
| `bmad-check-implementation-readiness` | Cổng kiểm tra trước khi triển khai | Quyết định PASS/CONCERNS/FAIL |

## Giai đoạn 4: Triển khai

Xây dựng từng story một. Tự động hóa toàn bộ giai đoạn 4 sẽ sớm ra mắt.

| Quy trình | Mục đích | Tạo ra |
| -------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| `bmad-sprint-planning` | Khởi tạo theo dõi, thường chạy một lần mỗi dự án để sắp thứ tự chu trình phát triển | `sprint-status.yaml` |
| `bmad-create-story` | Chuẩn bị story tiếp theo cho implementation | `story-[slug].md` |
| `bmad-dev-story` | Triển khai story | Code chạy được + tests |
| `bmad-code-review` | Kiểm tra chất lượng phần triển khai | Được duyệt hoặc yêu cầu thay đổi |
| `bmad-correct-course` | Xử lý thay đổi lớn giữa sprint | Kế hoạch cập nhật hoặc định tuyến lại |
| `bmad-sprint-status` | Theo dõi tiến độ sprint và trạng thái story | Cập nhật trạng thái sprint |
| `bmad-retrospective` | Review sau khi hoàn tất epic | Bài học rút ra |

## Luồng nhanh (nhánh song song)

Bỏ qua giai đoạn 1-3 đối với những việc nhỏ, rõ và đã hiểu đầy đủ.

| Quy trình | Mục đích | Tạo ra |
| ------------------ | --------------------------------------------------------------------------- | ---------------------- |
| `bmad-quick-dev` | Luồng nhanh hợp nhất — làm rõ yêu cầu, lập kế hoạch, triển khai, review và trình bày | `spec-*.md` + mã nguồn |

## Quản lý ngữ cảnh

Mỗi tài liệu sẽ trở thành ngữ cảnh cho giai đoạn tiếp theo. PRD cho architect biết những ràng buộc nào quan trọng. Tài liệu kiến trúc chỉ cho dev agent những mẫu cần tuân theo. File story cung cấp ngữ cảnh tập trung và đầy đủ cho việc triển khai. Nếu không có cấu trúc này, agent sẽ đưa ra quyết định thiếu nhất quán.

### Bối cảnh dự án

:::tip[Khuyến nghị]
Hãy tạo `project-context.md` để bảo đảm AI agent tuân theo quy tắc và sở thích của dự án. File này hoạt động như một bản hiến pháp cho dự án của bạn, nó dẫn dắt các quyết định triển khai xuyên suốt mọi quy trình. File tùy chọn này có thể được tạo ở cuối bước tạo kiến trúc, hoặc cũng có thể được sinh trong dự án hiện hữu để ghi lại những điều quan trọng cần giữ đồng bộ với quy ước đang có.
:::

**Cách tạo:**

- **Thủ công** — Tạo `_bmad-output/project-context.md` với stack công nghệ và các quy tắc triển khai của bạn
- **Tự sinh** — Chạy `bmad-generate-project-context` để sinh tự động từ architecture hoặc codebase

[**Tìm hiểu thêm về project-context.md**](../explanation/project-context.md)
