---
title: "Bắt đầu"
description: Cài đặt BMad và xây dựng dự án đầu tiên của bạn
---

Xây dựng phần mềm nhanh hơn bằng các workflow vận hành bởi AI, với những agent chuyên biệt hướng dẫn bạn qua các bước lập kế hoạch, kiến trúc và triển khai.

## Bạn Sẽ Học Được Gì

- Cài đặt và khởi tạo BMad Method cho một dự án mới
- Dùng **BMad-Help** — trợ lý thông minh biết bước tiếp theo bạn nên làm gì
- Chọn nhánh lập kế hoạch phù hợp với quy mô dự án
- Đi qua các phase từ yêu cầu đến code chạy được
- Sử dụng agent và workflow hiệu quả

:::note[Điều kiện tiên quyết]
- **Node.js 20+** — Bắt buộc cho trình cài đặt
- **Git** — Khuyến nghị để quản lý phiên bản
- **IDE có AI** — Claude Code, Cursor hoặc công cụ tương tự
- **Một ý tưởng dự án** — Chỉ cần đơn giản cũng đủ để học
:::

:::tip[Cách Dễ Nhất]
**Cài đặt** → `npx bmad-method install`
**Hỏi** → `bmad-help what should I do first?`
**Xây dựng** → Để BMad-Help dẫn bạn qua từng workflow
:::

## Làm Quen Với BMad-Help: Người Dẫn Đường Thông Minh Của Bạn

**BMad-Help là cách nhanh nhất để bắt đầu với BMad.** Bạn không cần phải nhớ workflow hay phase nào cả, chỉ cần hỏi, và BMad-Help sẽ:

- **Kiểm tra dự án của bạn** để xem những gì đã hoàn thành
- **Hiển thị các lựa chọn** dựa trên những module bạn đã cài
- **Đề xuất bước tiếp theo** — bao gồm cả tác vụ bắt buộc đầu tiên
- **Trả lời câu hỏi** như “Tôi có ý tưởng cho một sản phẩm SaaS, tôi nên bắt đầu từ đâu?”

### Cách Dùng BMad-Help

Chạy trong AI IDE của bạn bằng cách gọi skill:

```text
bmad-help
```

Hoặc ghép cùng câu hỏi để nhận hướng dẫn có ngữ cảnh:

```text
bmad-help I have an idea for a SaaS product, I already know all the features I want. where do I get started?
```

BMad-Help sẽ trả lời:
- Điều gì được khuyến nghị trong tình huống của bạn
- Tác vụ bắt buộc đầu tiên là gì
- Phần còn lại của quy trình sẽ trông như thế nào

### Nó Cũng Điều Khiển Workflow

BMad-Help không chỉ trả lời câu hỏi — **nó còn tự động chạy ở cuối mỗi workflow** để cho bạn biết chính xác bước tiếp theo cần làm là gì. Không phải đoán, không phải lục tài liệu, chỉ có chỉ dẫn rõ ràng về workflow bắt buộc tiếp theo.

:::tip[Bắt Đầu Từ Đây]
Sau khi cài BMad, hãy gọi skill `bmad-help` ngay. Nó sẽ nhận biết các module bạn đã cài và hướng bạn đến điểm bắt đầu phù hợp cho dự án.
:::

## Hiểu Về BMad

BMad giúp bạn xây dựng phần mềm thông qua các workflow có hướng dẫn với những AI agent chuyên biệt. Quy trình gồm bốn phase:

| Phase | Tên | Điều xảy ra |
| ----- | -------------- | --------------------------------------------------- |
| 1 | Analysis | Brainstorming, nghiên cứu, product brief hoặc PRFAQ *(tùy chọn)* |
| 2 | Planning | Tạo tài liệu yêu cầu (PRD hoặc spec) |
| 3 | Solutioning | Thiết kế kiến trúc *(chỉ dành cho BMad Method/Enterprise)* |
| 4 | Implementation | Xây dựng theo từng epic, từng story |

**[Mở Workflow Map](../reference/workflow-map.md)** để khám phá các phase, workflow và cách quản lý context.

Dựa trên độ phức tạp của dự án, BMad cung cấp ba nhánh lập kế hoạch:

| Nhánh | Phù hợp nhất với | Tài liệu được tạo |
| --------------- | ------------------------------------------------------ | -------------------------------------- |
| **Quick Flow** | Sửa lỗi, tính năng đơn giản, phạm vi rõ ràng (1-15 story) | Chỉ spec |
| **BMad Method** | Sản phẩm, nền tảng, tính năng phức tạp (10-50+ story) | PRD + Architecture + UX |
| **Enterprise** | Yêu cầu tuân thủ, hệ thống đa tenant (30+ story) | PRD + Architecture + Security + DevOps |

:::note
Số lượng story chỉ là gợi ý, không phải định nghĩa cứng. Hãy chọn nhánh dựa trên nhu cầu lập kế hoạch, không phải phép đếm story.
:::

## Cài Đặt

Mở terminal trong thư mục dự án và chạy:

```bash
npx bmad-method install
```

Nếu bạn muốn dùng bản prerelease mới nhất thay vì kênh release mặc định, hãy dùng `npx bmad-method@next install`.

Khi được hỏi chọn module, hãy chọn **BMad Method**.

Trình cài đặt sẽ tạo hai thư mục:
- `_bmad/` — agents, workflows, tasks và cấu hình
- `_bmad-output/` — hiện tại để trống, nhưng đây là nơi các artifact của bạn sẽ được lưu

:::tip[Bước Tiếp Theo Của Bạn]
Mở AI IDE trong thư mục dự án rồi chạy:

```text
bmad-help
```

BMad-Help sẽ nhận biết bạn đã làm đến đâu và đề xuất chính xác bước tiếp theo. Bạn cũng có thể hỏi những câu như “Tôi có những lựa chọn nào?” hoặc “Tôi có ý tưởng SaaS, nên bắt đầu từ đâu?”
:::

:::note[Cách Nạp Agent Và Chạy Workflow]
Mỗi workflow có một **skill** được gọi bằng tên trong IDE của bạn, ví dụ `bmad-create-prd`. Công cụ AI sẽ nhận diện tên `bmad-*` và chạy nó, bạn không cần nạp agent riêng. Bạn cũng có thể gọi trực tiếp skill của agent để trò chuyện tổng quát, ví dụ `bmad-agent-pm` cho PM agent.
:::

:::caution[Chat Mới]
Luôn bắt đầu một chat mới cho mỗi workflow. Điều này tránh các vấn đề do giới hạn context gây ra.
:::

## Bước 1: Tạo Kế Hoạch

Đi qua các phase 1-3. **Dùng chat mới cho từng workflow.**

:::tip[Project Context (Tùy chọn)]
Trước khi bắt đầu, hãy cân nhắc tạo `project-context.md` để ghi lại các ưu tiên kỹ thuật và quy tắc triển khai. Nhờ vậy mọi AI agent sẽ tuân theo cùng một quy ước trong suốt dự án.

Bạn có thể tạo thủ công tại `_bmad-output/project-context.md` hoặc sinh ra sau phần kiến trúc bằng `bmad-generate-project-context`. [Xem thêm](../explanation/project-context.md).
:::

### Phase 1: Analysis (Tùy chọn)

Tất cả workflow trong phase này đều là tùy chọn. [**Chưa chắc nên dùng cái nào?**](../explanation/analysis-phase.md)
- **brainstorming** (`bmad-brainstorming`) — Gợi ý ý tưởng có hướng dẫn
- **research** (`bmad-market-research` / `bmad-domain-research` / `bmad-technical-research`) — Nghiên cứu thị trường, miền nghiệp vụ và kỹ thuật
- **product-brief** (`bmad-product-brief`) — Tài liệu nền tảng được khuyến nghị khi concept của bạn đã rõ
- **prfaq** (`bmad-prfaq`) — Bài kiểm tra Working Backwards để stress-test và rèn sắc concept sản phẩm của bạn

### Phase 2: Planning (Bắt buộc)

**Với nhánh BMad Method và Enterprise:**
1. Gọi **PM agent** (`bmad-agent-pm`) trong một chat mới
2. Chạy workflow `bmad-create-prd` (`bmad-create-prd`)
3. Kết quả: `PRD.md`

**Với nhánh Quick Flow:**
- Chạy `bmad-quick-dev` — workflow này gộp cả planning và implementation trong một lần, nên bạn có thể chuyển thẳng sang triển khai

:::note[Thiết kế UX (Tùy chọn)]
Nếu dự án của bạn có giao diện người dùng, hãy gọi **UX-Designer agent** (`bmad-agent-ux-designer`) và chạy workflow thiết kế UX (`bmad-create-ux-design`) sau khi tạo PRD.
:::

### Phase 3: Solutioning (BMad Method/Enterprise)

**Tạo Architecture**
1. Gọi **Architect agent** (`bmad-agent-architect`) trong một chat mới
2. Chạy `bmad-create-architecture` (`bmad-create-architecture`)
3. Kết quả: tài liệu kiến trúc chứa các quyết định kỹ thuật

**Tạo Epics và Stories**

:::tip[Cải tiến trong V6]
Epics và stories giờ được tạo *sau* kiến trúc. Điều này giúp story có chất lượng tốt hơn vì các quyết định kiến trúc như database, API pattern và tech stack ảnh hưởng trực tiếp đến cách chia nhỏ công việc.
:::

1. Gọi **PM agent** (`bmad-agent-pm`) trong một chat mới
2. Chạy `bmad-create-epics-and-stories` (`bmad-create-epics-and-stories`)
3. Workflow sẽ dùng cả PRD lẫn Architecture để tạo story có đủ ngữ cảnh kỹ thuật

**Kiểm tra mức sẵn sàng để triển khai** *(Rất nên dùng)*
1. Gọi **Architect agent** (`bmad-agent-architect`) trong một chat mới
2. Chạy `bmad-check-implementation-readiness` (`bmad-check-implementation-readiness`)
3. Xác nhận tính nhất quán giữa toàn bộ tài liệu lập kế hoạch

## Bước 2: Xây Dựng Dự Án

Sau khi lập kế hoạch xong, chuyển sang implementation. **Mỗi workflow nên chạy trong một chat mới.**

### Khởi Tạo Sprint Planning

Gọi **Developer agent** (`bmad-agent-dev`) và chạy `bmad-sprint-planning` (`bmad-sprint-planning`). Workflow này sẽ tạo `sprint-status.yaml` để theo dõi toàn bộ epic và story.

### Chu Trình Xây Dựng

Với mỗi story, lặp lại chu trình này trong chat mới:

| Bước | Agent | Workflow | Lệnh | Mục đích |
| ---- | ----- | -------------- | -------------------------- | ---------------------------------- |
| 1 | DEV | `bmad-create-story` | `bmad-create-story` | Tạo file story từ epic |
| 2 | DEV | `bmad-dev-story` | `bmad-dev-story` | Triển khai story |
| 3 | DEV | `bmad-code-review` | `bmad-code-review` | Kiểm tra chất lượng *(khuyến nghị)* |

Sau khi hoàn tất tất cả story trong một epic, hãy gọi **Developer agent** (`bmad-agent-dev`) và chạy `bmad-retrospective` (`bmad-retrospective`).

## Bạn Đã Hoàn Thành Những Gì

Bạn đã nắm được nền tảng để xây dựng với BMad:

- Đã cài BMad và cấu hình cho IDE của bạn
- Đã khởi tạo dự án theo nhánh lập kế hoạch phù hợp
- Đã tạo các tài liệu lập kế hoạch (PRD, Architecture, Epics và Stories)
- Đã hiểu chu trình triển khai trong implementation

Dự án của bạn bây giờ sẽ có dạng:

```text
your-project/
├── _bmad/                                   # Cấu hình BMad
├── _bmad-output/
│   ├── planning-artifacts/
│   │   ├── PRD.md                           # Tài liệu yêu cầu của bạn
│   │   ├── architecture.md                  # Các quyết định kỹ thuật
│   │   └── epics/                           # Các file epic và story
│   ├── implementation-artifacts/
│   │   └── sprint-status.yaml               # Theo dõi sprint
│   └── project-context.md                   # Quy tắc triển khai (tùy chọn)
└── ...
```

## Tra Cứu Nhanh

| Workflow | Lệnh | Agent | Mục đích |
| ------------------------------------- | ------------------------------------------ | --------- | ----------------------------------------------- |
| **`bmad-help`** ⭐ | `bmad-help` | Bất kỳ | **Người dẫn đường thông minh của bạn — hỏi gì cũng được!** |
| `bmad-create-prd` | `bmad-create-prd` | PM | Tạo tài liệu yêu cầu sản phẩm |
| `bmad-create-architecture` | `bmad-create-architecture` | Architect | Tạo tài liệu kiến trúc |
| `bmad-generate-project-context` | `bmad-generate-project-context` | Analyst | Tạo file project context |
| `bmad-create-epics-and-stories` | `bmad-create-epics-and-stories` | PM | Phân rã PRD thành epics |
| `bmad-check-implementation-readiness` | `bmad-check-implementation-readiness` | Architect | Kiểm tra độ nhất quán của kế hoạch |
| `bmad-sprint-planning` | `bmad-sprint-planning` | DEV | Khởi tạo theo dõi sprint |
| `bmad-create-story` | `bmad-create-story` | DEV | Tạo file story |
| `bmad-dev-story` | `bmad-dev-story` | DEV | Triển khai một story |
| `bmad-code-review` | `bmad-code-review` | DEV | Review phần code đã triển khai |

## Câu Hỏi Thường Gặp

**Lúc nào cũng cần kiến trúc à?**
Chỉ với nhánh BMad Method và Enterprise. Quick Flow bỏ qua bước kiến trúc và chuyển thẳng từ spec sang implementation.

**Tôi có thể đổi kế hoạch về sau không?**
Có. Workflow `bmad-correct-course` (`bmad-correct-course`) xử lý thay đổi phạm vi giữa chừng.

**Nếu tôi muốn brainstorming trước thì sao?**
Gọi Analyst agent (`bmad-agent-analyst`) và chạy `bmad-brainstorming` (`bmad-brainstorming`) trước khi bắt đầu PRD.

**Tôi có cần tuân theo đúng thứ tự tuyệt đối không?**
Không hẳn. Khi đã quen flow, bạn có thể chạy workflow trực tiếp bằng bảng Tra Cứu Nhanh ở trên.

## Nhận Hỗ Trợ

:::tip[Điểm Dừng Đầu Tiên: BMad-Help]
**Hãy gọi `bmad-help` bất cứ lúc nào** — đây là cách nhanh nhất để gỡ vướng. Bạn có thể hỏi:
- "Tôi nên làm gì sau khi cài đặt?"
- "Tôi đang kẹt ở workflow X"
- "Tôi có những lựa chọn nào cho Y?"
- "Cho tôi xem đến giờ đã làm được gì"

BMad-Help sẽ kiểm tra dự án, phát hiện những gì bạn đã hoàn thành và chỉ cho bạn chính xác bước cần làm tiếp theo.
:::

- **Trong workflow** — Các agent sẽ hướng dẫn bạn bằng câu hỏi và giải thích
- **Cộng đồng** — [Discord](https://discord.gg/gk8jAdXWmj) (#bmad-method-help, #report-bugs-and-issues)

## Những Điểm Cần Ghi Nhớ

:::tip[Hãy Nhớ Các Điểm Này]
- **Bắt đầu với `bmad-help`** — Trợ lý thông minh hiểu dự án và các lựa chọn của bạn
- **Luôn dùng chat mới** — Mỗi workflow nên bắt đầu trong một chat riêng
- **Nhánh rất quan trọng** — Quick Flow dùng `bmad-quick-dev`; Method/Enterprise cần PRD và kiến trúc
- **BMad-Help chạy tự động** — Mỗi workflow đều kết thúc bằng hướng dẫn về bước tiếp theo
:::

Sẵn sàng bắt đầu chưa? Hãy cài BMad, gọi `bmad-help`, và để người dẫn đường thông minh của bạn đưa bạn đi tiếp.
