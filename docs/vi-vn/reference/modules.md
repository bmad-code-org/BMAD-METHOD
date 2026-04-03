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

## Community Modules

Các module cộng đồng và một chợ module đang được chuẩn bị. Hãy theo dõi [tổ chức BMad trên GitHub](https://github.com/bmad-code-org) để cập nhật.
