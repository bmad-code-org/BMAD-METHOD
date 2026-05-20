---
title: Các Module Chính Thức
description: Các module bổ sung để xây agent tùy chỉnh, tăng cường sáng tạo, phát triển game và kiểm thử
sidebar:
  order: 4
---

BMad được mở rộng thông qua các module chính thức mà bạn chọn trong quá trình cài đặt. Những module bổ sung này cung cấp agent, workflow và task chuyên biệt cho các lĩnh vực cụ thể, vượt ra ngoài phần lõi tích hợp sẵn và BMM (Agile suite).

:::tip[Cài đặt module]
Chạy `npx bmad-method install` rồi chọn những module bạn muốn. Trình cài đặt sẽ tự xử lý phần tải về, cấu hình và tích hợp vào IDE.
:::

## BMad Builder

Tạo agent tùy chỉnh, workflow tùy chỉnh và module chuyên biệt theo lĩnh vực với sự hỗ trợ có hướng dẫn. BMad Builder là meta-module để mở rộng chính framework này.

- **Mã:** `bmb`
- **npm:** [`bmad-builder`](https://www.npmjs.com/package/bmad-builder)
- **GitHub:** [bmad-code-org/bmad-builder](https://github.com/bmad-code-org/bmad-builder)

**Cung cấp:**

- Agent Builder — tạo AI agent chuyên biệt với chuyên môn và quyền truy cập công cụ tùy chỉnh
- Workflow Builder — thiết kế quy trình có cấu trúc với các bước và điểm quyết định
- Module Builder — đóng gói agent và workflow thành các module có thể chia sẻ và phát hành
- Thiết lập có tương tác bằng YAML cùng hỗ trợ publish lên npm

## Creative Intelligence Suite

Bộ công cụ vận hành bởi AI dành cho sáng tạo có cấu trúc, phát ý tưởng và đổi mới trong giai đoạn đầu phát triển. Bộ này cung cấp nhiều agent giúp brainstorming, design thinking và giải quyết vấn đề bằng các framework đã được kiểm chứng.

- **Mã:** `cis`
- **npm:** [`bmad-creative-intelligence-suite`](https://www.npmjs.com/package/bmad-creative-intelligence-suite)
- **GitHub:** [bmad-code-org/bmad-module-creative-intelligence-suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)

**Cung cấp:**

- Các agent Innovation Strategist, Design Thinking Coach và Brainstorming Coach
- Problem Solver và Creative Problem Solver cho tư duy hệ thống và tư duy bên lề
- Storyteller và Presentation Master cho kể chuyện và pitching
- Các framework phát ý tưởng như SCAMPER, Reverse Brainstorming và problem reframing

## BMad Automator

Module tự động hóa thử nghiệm để tạo epic/story sẵn sàng cho triển khai và chạy các workflow BMAD được hỗ trợ với ít thao tác thủ công hơn. Hiện module này tập trung vào Claude và Codex.

- **Mã:** `automator`
- **npm:** [`bmad-story-automator`](https://www.npmjs.com/package/bmad-story-automator)
- **GitHub:** [bmad-code-org/bmad-automator](https://github.com/bmad-code-org/bmad-automator)
- **Kênh mặc định:** `next`

**Cung cấp:**

- Tự động hóa xây epic cho quy trình giao hàng theo story
- Hỗ trợ workflow thử nghiệm cho người dùng Claude và Codex
- Đường tắt từ artifact kế hoạch sang công việc triển khai cụ thể
- Tính năng early-access có thể thay đổi nhanh hơn các module stable

## Game Dev Studio

Các workflow phát triển game có cấu trúc, được điều chỉnh cho Unity, Unreal, Godot và các engine tùy chỉnh. Hỗ trợ làm prototype nhanh qua Quick Flow và sản xuất toàn diện bằng sprint theo epic.

- **Mã:** `gds`
- **npm:** [`bmad-game-dev-studio`](https://www.npmjs.com/package/bmad-game-dev-studio)
- **GitHub:** [bmad-code-org/bmad-module-game-dev-studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio)

**Cung cấp:**

- Workflow tạo Game Design Document (GDD)
- Chế độ Quick Dev cho làm prototype nhanh
- Hỗ trợ thiết kế narrative cho nhân vật, hội thoại và world-building
- Bao phủ hơn 21 thể loại game cùng hướng dẫn kiến trúc theo engine

## Whiteport Design Studio

Module UX chiến lược và design-first planning cho các nhóm cần định hình trải nghiệm sản phẩm chắc hơn trước khi triển khai. WDS mở rộng BMAD bằng discovery UX và workflow lập kế hoạch thiết kế có cấu trúc.

- **Mã:** `wds`
- **npm:** [`bmad-wds`](https://www.npmjs.com/package/bmad-wds)
- **GitHub:** [bmad-code-org/bmad-method-wds-expansion](https://github.com/bmad-code-org/bmad-method-wds-expansion)

**Cung cấp:**

- Phương pháp design-first planning cho sản phẩm và UX
- Discovery UX có cấu trúc trước solutioning và implementation
- Workflow thiết kế chiến lược bổ trợ luồng product planning của BMAD
- Các skill Whiteport Design Studio được hiển thị qua module picker của installer

## Test Architect (TEA)

Chiến lược kiểm thử cấp doanh nghiệp, hướng dẫn tự động hóa và quyết định release gate thông qua một agent chuyên gia cùng chín workflow có cấu trúc. TEA vượt xa QA agent tích hợp sẵn nhờ ưu tiên theo rủi ro và truy vết yêu cầu.

- **Mã:** `tea`
- **npm:** [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)
- **GitHub:** [bmad-code-org/bmad-method-test-architecture-enterprise](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise)

**Cung cấp:**

- Agent Murat (Master Test Architect and Quality Advisor)
- Các workflow cho test design, ATDD, automation, test review và traceability
- Đánh giá NFR, thiết lập CI và dựng sườn framework kiểm thử
- Ưu tiên P0-P3 cùng tích hợp tùy chọn với Playwright Utils và MCP

## Module cộng đồng và tùy chỉnh

Module picker cho community module trong luồng tương tác đã được gỡ. Hãy cài module cộng đồng hoặc bên thứ ba bằng `--custom-source <git-url-or-path>` từ Git repository hoặc đường dẫn cục bộ. Xem [Cài đặt module tùy chỉnh và module cộng đồng](../how-to/install-custom-modules.md).
