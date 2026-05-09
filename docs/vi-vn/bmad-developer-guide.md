---
title: Hướng dẫn BMAD cho Developer
description: Tài liệu tổng quan bằng tiếng Việt dành cho developer muốn áp dụng BMAD Method từ ý tưởng đến triển khai
---

# BMAD Method — Hướng dẫn toàn diện cho Developer

> **BMAD** (Build More Architect Dreams) là framework phát triển phần mềm hỗ trợ bởi AI, giúp team đi từ ý tưởng đến sản phẩm một cách có cấu trúc, nhất quán và hiệu quả.

---

## Mục lục

1. [BMAD là gì?](#1-bmad-là-gì)
2. [Nguyên lý cốt lõi](#2-nguyên-lý-cốt-lõi)
3. [Kiến trúc hệ thống — Các Agent](#3-kiến-trúc-hệ-thống--các-agent)
4. [Quy trình làm việc — 4 Giai đoạn](#4-quy-trình-làm-việc--4-giai-đoạn)
5. [Chọn nhánh phù hợp](#5-chọn-nhánh-phù-hợp)
6. [Hướng dẫn từng bước áp dụng BMAD](#6-hướng-dẫn-từng-bước-áp-dụng-bmad)
7. [Kiểm thử với BMAD — Hướng dẫn cho QC](#7-kiểm-thử-với-bmad--hướng-dẫn-cho-qc)
8. [Các công cụ hỗ trợ](#8-các-công-cụ-hỗ-trợ)
9. [Cấu trúc thư mục dự án](#9-cấu-trúc-thư-mục-dự-án)
10. [Mẹo và Best Practices](#10-mẹo-và-best-practices)

---

## 1. BMAD là gì?

**BMAD Method** là một hệ thống phối hợp nhiều AI agent chuyên biệt để hỗ trợ toàn bộ vòng đời phát triển phần mềm — từ phân tích ý tưởng, lập kế hoạch, thiết kế kiến trúc, đến triển khai code và kiểm thử.

### Điểm khác biệt so với cách dùng AI thông thường

| Cách thông thường | BMAD Method |
|---|---|
| Hỏi AI từng câu rời rạc | Workflow có cấu trúc, mỗi bước tạo đầu ra cho bước kế tiếp |
| Một AI làm tất cả | Nhiều agent chuyên biệt, mỗi agent hiểu sâu vai trò của mình |
| Không có tài liệu hóa | Mỗi giai đoạn sinh ra tài liệu chuẩn (PRD, Architecture, Stories) |
| Developer phải giám sát liên tục | Agent tự chủ dài hơn, chỉ cần con người tại các điểm kiểm tra quan trọng |

### BMAD phù hợp với ai?

- **Developer** cần xây dựng tính năng nhanh, chất lượng cao
- **Tech Lead / Architect** cần thiết kế hệ thống và phân rã công việc
- **Product Manager** cần định nghĩa yêu cầu rõ ràng
- **QC/Tester** cần sinh test case có truy vết yêu cầu
- **Team nhỏ** muốn áp dụng quy trình chuẩn không cần nhiều overhead

---

## 2. Nguyên lý cốt lõi

### 2.1. Tài liệu là "ngôn ngữ chung" giữa con người và AI

Mỗi giai đoạn trong BMAD sinh ra một tài liệu chuẩn. Tài liệu đó trở thành **đầu vào** cho giai đoạn kế tiếp. Agent AI đọc tài liệu để hiểu context, thay vì phụ thuộc vào lịch sử hội thoại có thể bị mất.

```
Ý tưởng → [Brief/PRFAQ] → PRD → Architecture → Epics/Stories → Code → Tests
```

### 2.2. Phân tách "XÂY GÌ" và "XÂY NHƯ THẾ NÀO"

BMAD tách bạch rõ ràng hai câu hỏi quan trọng nhất:

- **Planning (Giai đoạn 2)**: Trả lời **"XÂY GÌ và vì sao?"** → Đầu ra: PRD
- **Solutioning (Giai đoạn 3)**: Trả lời **"XÂY NHƯ THẾ NÀO?"** → Đầu ra: Architecture + Epics/Stories

> Đây là nguyên lý quan trọng nhất. Nhiều dự án thất bại vì triển khai khi chưa thống nhất được "XÂY GÌ", hoặc bắt đầu code mà chưa quyết định "XÂY NHƯ THẾ NÀO".

### 2.3. Agent chuyên biệt — mỗi vai trò một chuyên gia

BMAD không dùng một AI đa năng mà dùng các agent được cấu hình để đóng vai chuyên gia cụ thể: PM, Architect, Developer, UX Designer, Technical Writer. Mỗi agent có phong cách tư duy, ưu tiên, và workflow riêng.

### 2.4. Con người chỉ tham gia tại các điểm kiểm tra quan trọng

BMAD được thiết kế để AI tự chủ trong phạm vi đã định nghĩa, chỉ đưa con người vào:

- Phê duyệt chuyển giai đoạn (PRD xong → Architect làm việc)
- Review kết quả tổng thể (sau Dev Story, sau epic)
- Quyết định thay đổi hướng (Correct Course)

### 2.5. Có thể mở rộng theo nhu cầu

Ba nhánh lập kế hoạch với độ phức tạp tăng dần:

| Nhánh | Phù hợp với | Story ước tính |
|---|---|---|
| **Quick Flow** | Bug fix, tính năng nhỏ, phạm vi rõ | 1–15 stories |
| **BMad Method** | Sản phẩm, nền tảng, tính năng phức tạp | 10–50+ stories |
| **Enterprise** | Hệ thống tuân thủ, đa tenant, đa team | 30+ stories |

---

## 3. Kiến trúc hệ thống — Các Agent

### 3.1. Các Agent chính

| Agent | Tên nhân vật | Skill ID | Vai trò |
|---|---|---|---|
| **Analyst** | Mary | `bmad-analyst` | Brainstorm, nghiên cứu thị trường/kỹ thuật, tạo Product Brief và PRFAQ |
| **Product Manager** | John | `bmad-pm` | Tạo và quản lý PRD, Epics, Stories, kiểm tra Implementation Readiness |
| **Architect** | Winston | `bmad-architect` | Thiết kế Architecture, ADR, kiểm tra Implementation Readiness |
| **Developer** | Amelia | `bmad-agent-dev` | Triển khai story, tạo test, code review, sprint planning |
| **UX Designer** | Sally | `bmad-ux-designer` | Thiết kế UX specification |
| **Technical Writer** | Paige | `bmad-tech-writer` | Viết tài liệu, cập nhật standards, giải thích khái niệm |

### 3.2. Cách gọi Agent

**Qua Skill** (Claude Code / Cursor):
```
bmad-analyst
bmad-pm
bmad-architect
bmad-agent-dev
```

**Qua Trigger** (sau khi đã nạp agent, gõ mã ngắn trong hội thoại):

| Trigger | Agent | Workflow |
|---|---|---|
| `BP` | Analyst | Brainstorm |
| `CB` | Analyst | Create Brief |
| `CP` | PM | Create PRD |
| `VP` | PM | Validate PRD |
| `EP` | PM | Create Epics & Stories |
| `CA` | Architect | Create Architecture |
| `IR` | PM / Architect | Implementation Readiness |
| `SP` | Developer | Sprint Planning |
| `DS` | Developer | Dev Story |
| `QA` | Developer | QA Test Generation |
| `CR` | Developer | Code Review |

---

## 4. Quy trình làm việc — 4 Giai đoạn

```
┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Giai đoạn 1   │    │   Giai đoạn 2   │    │   Giai đoạn 3    │    │   Giai đoạn 4   │
│   PHÂN TÍCH     │───▶│   LẬP KẾ HOẠCH  │───▶│  ĐỊNH HÌNH GIẢI  │───▶│   TRIỂN KHAI    │
│  (Tùy chọn)     │    │  (Bắt buộc)     │    │  PHÁP (BMad/Ent) │    │  (Bắt buộc)     │
│                 │    │                 │    │                  │    │                 │
│ Brief, PRFAQ    │    │ PRD, UX Spec    │    │ Architecture,    │    │ Sprint, Stories, │
│ Research        │    │                 │    │ Epics, Stories   │    │ Code, Test, QA   │
└─────────────────┘    └─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Giai đoạn 1: Phân tích (Tùy chọn)

Giai đoạn này giúp khám phá và xác nhận ý tưởng **trước khi** cam kết lập kế hoạch chi tiết. Bỏ qua nếu yêu cầu đã rõ.

**Các công cụ:**

**Brainstorming** — Khi cần khai phá ý tưởng
```
Trigger: BP (trong agent Analyst)
Đầu ra: brainstorming-report.md
```
Sử dụng 60+ kỹ thuật brainstorming, tạo 100+ ý tưởng đa dạng, sau đó phân tích, lọc và đề xuất hướng tiếp cận.

**Product Brief** — Khi concept đã tương đối rõ
```
Trigger: CB (trong agent Analyst)
Đầu ra: product-brief.md
```
Tóm tắt điều hành 1–2 trang: vấn đề, giải pháp, đối tượng, lợi thế cạnh tranh, rủi ro.

**PRFAQ** — Khi cần stress-test concept
```
Trigger: (hỏi Analyst về PRFAQ)
Đầu ra: prfaq.md
```
Phương pháp "Working Backwards" của Amazon: viết thông cáo báo chí như thể sản phẩm đã tồn tại, sau đó trả lời các câu hỏi khó nhất từ khách hàng. Buộc phải rõ ràng theo hướng lấy khách hàng làm trung tâm.

**Nghiên cứu** — Xác thực giả định
```
Trigger: MR (Market Research), DR (Domain Research), TR (Technical Research)
```

---

### Giai đoạn 2: Lập kế hoạch (Bắt buộc)

Xác định rõ **cần xây gì** và **cho ai**.

**Tạo PRD** — PM Agent
```
Trigger: CP
Đầu ra: PRD.md
```
PRD bao gồm: mục tiêu sản phẩm, functional requirements (FR), non-functional requirements (NFR), user stories cấp cao, acceptance criteria.

**Thiết kế UX** — UX Designer Agent (Tùy chọn)
```
Trigger: CU
Đầu ra: ux-spec.md
```
Dùng khi UX/UI là yếu tố quan trọng. Bao gồm user flows, component specs, interaction patterns.

**Validate PRD** — PM Agent
```
Trigger: VP
```
Kiểm tra tính đầy đủ, nhất quán, và khả năng triển khai của PRD trước khi chuyển sang giai đoạn 3.

---

### Giai đoạn 3: Định hình giải pháp (Bắt buộc với BMad Method / Enterprise)

Quyết định **xây như thế nào** và phân rã công việc.

**Tạo Architecture** — Architect Agent
```
Trigger: CA
Đầu ra: architecture.md + ADR (Architecture Decision Records)
```
Bao gồm: tech stack, component design, data models, API contracts, deployment strategy, ADR cho các quyết định quan trọng.

**Tạo Epics & Stories** — PM Agent
```
Trigger: EP
Đầu ra: epics/ thư mục với các file story
```
Phân rã PRD và Architecture thành Epics (nhóm tính năng) và Stories (đơn vị công việc cụ thể). Mỗi story có: mô tả, acceptance criteria, technical notes.

**Implementation Readiness Check** — Architect Agent
```
Trigger: IR
Kết quả: PASS / CONCERNS / FAIL
```
Cổng kiểm tra trước khi bắt đầu triển khai. Đảm bảo mọi thứ đã đủ rõ ràng để developer có thể làm việc độc lập.

---

### Giai đoạn 4: Triển khai (Bắt buộc)

Xây dựng từng story một theo thứ tự ưu tiên.

**Sprint Planning** — Developer Agent
```
Trigger: SP
Đầu ra: sprint-status.yaml
```
Xác định stories sẽ làm trong sprint, thứ tự ưu tiên và tracking.

**Dev Story** — Developer Agent
```
Trigger: DS
Đầu ra: Code chạy được + unit/integration tests
```
Agent tự chủ triển khai story theo acceptance criteria. Đọc architecture và project-context để đảm bảo nhất quán.

**Code Review** — Developer Agent
```
Trigger: CR
Kết quả: Approved / Changes Requested
```
Review tự động: correctness, style, security, performance, test coverage.

**QA Test Generation** — Developer Agent
```
Trigger: QA
Đầu ra: API tests + E2E tests
```
Sinh test case cho API và E2E sau khi epic hoàn tất. Chi tiết ở [Mục 7](#7-kiểm-thử-với-bmad--hướng-dẫn-cho-qc).

**Correct Course** — PM Agent
```
Trigger: CC
```
Xử lý thay đổi yêu cầu lớn giữa sprint mà không phá vỡ quy trình.

**Retrospective** — Developer Agent
```
Trigger: ER (Epic Retrospective)
```
Review sau khi hoàn tất một epic. Ghi lại bài học, pattern tốt, vấn đề gặp phải.

---

## 5. Chọn nhánh phù hợp

### Quick Flow — Nhánh nhanh

**Khi nào dùng:**
- Bug fix
- Tính năng nhỏ, phạm vi rõ ràng
- Cập nhật đơn lẻ (1–15 stories)
- Bạn đã hiểu đầy đủ yêu cầu

**Bỏ qua:** Giai đoạn 1, 2, 3 hoàn toàn

**Dùng:** Quick Dev (`bmad-quick-dev`)

```
Mô tả yêu cầu → Làm rõ ý định → Sinh spec → Triển khai → Review → Done
```

Quick Dev gộp tất cả vào một workflow: làm rõ yêu cầu, lập kế hoạch mini, triển khai, code review, và trình bày kết quả.

---

### BMad Method — Nhánh đầy đủ

**Khi nào dùng:**
- Sản phẩm mới hoặc nền tảng
- Tính năng phức tạp với nhiều dependencies
- 10–50+ stories cần phối hợp nhiều developer

**Đi qua:** Giai đoạn 1 (tùy chọn) → 2 → 3 → 4

---

### Enterprise — Nhánh mở rộng

**Khi nào dùng:**
- Hệ thống đa tenant
- Yêu cầu tuân thủ (compliance), security audit
- 30+ stories, nhiều team
- Cần truy vết yêu cầu đầy đủ

**Thêm vào:** Security review, DevOps pipeline, NFR assessment, Test Architect Module (TEA)

---

## 6. Hướng dẫn từng bước áp dụng BMAD

### 6.1. Dự án mới

#### Bước 1: Cài đặt BMAD

```bash
# Yêu cầu: Node.js 20+, Git
npx bmad-method install
```

Trình cài đặt sẽ hỏi:
- IDE đang dùng (Claude Code, Cursor, hoặc tương tự)
- Modules muốn cài (core bắt buộc, thêm TEA nếu cần test nâng cao)
- Nhánh lập kế hoạch (Quick Flow / BMad Method / Enterprise)

#### Bước 2: Khởi động với bmad-help

```
bmad-help
```

Đây là điểm bắt đầu thông minh. Agent sẽ hỏi về dự án của bạn và dẫn bạn đến đúng workflow.

```
bmad-help Tôi có ý tưởng về ứng dụng SaaS quản lý task, bắt đầu từ đâu?
bmad-help Tôi cần thêm tính năng export PDF, dùng quick flow hay đầy đủ?
```

#### Bước 3: Tạo Project Context (khuyến nghị mạnh)

```bash
# Tạo tự động sau khi có architecture
bmad-generate-project-context

# Hoặc tạo thủ công
touch _bmad-output/project-context.md
```

File `project-context.md` là "bản hiến pháp" kỹ thuật của dự án — được tất cả agent tự động nạp:

```markdown
# Project Context

## Technology Stack
- Node.js 20.x, TypeScript 5.3
- React 18.2, Zustand (không dùng Redux)
- PostgreSQL 15, Prisma ORM
- Testing: Vitest, Playwright, MSW

## Critical Implementation Rules
- Bật strict mode — không dùng `any`
- Dùng `interface` cho public API, `type` cho union/intersection
- API calls phải qua `apiClient` singleton
- Components đặt trong `/src/components/` với co-located tests
```

#### Bước 4: Chạy Analysis (nếu cần)

```bash
# Mở agent Analyst
bmad-analyst

# Trong hội thoại, gõ trigger:
BP    # Brainstorm ý tưởng
CB    # Tạo Product Brief
MR    # Research thị trường
```

#### Bước 5: Tạo PRD

```bash
# Mở agent PM
bmad-pm

# Trigger tạo PRD
CP    # Create PRD (có hướng dẫn từng bước)
VP    # Validate PRD sau khi hoàn thiện
```

#### Bước 6: Tạo Architecture (BMad Method / Enterprise)

```bash
# Mở agent Architect
bmad-architect

# Trigger
CA    # Create Architecture
IR    # Implementation Readiness Check
```

#### Bước 7: Tạo Epics & Stories

```bash
# Mở agent PM
bmad-pm

# Trigger
EP    # Create Epics and Stories
```

#### Bước 8: Triển khai theo Stories

```bash
# Mở agent Developer
bmad-agent-dev

# Mỗi sprint
SP    # Sprint Planning
DS    # Dev Story (làm từng story)
CR    # Code Review
QA    # Tạo tests (sau khi epic hoàn tất)
ER    # Epic Retrospective
```

---

### 6.2. Dự án đã tồn tại

#### Bước 1: Tạo Project Context từ codebase hiện tại

```bash
# Chạy trong agent Developer hoặc Architect
bmad-generate-project-context
```

Agent sẽ khám phá codebase và tạo `project-context.md` từ:
- `package.json`, `pyproject.toml`, hoặc build files
- Cấu trúc thư mục
- Conventions hiện có trong code

#### Bước 2: Tạo tài liệu index

Tạo hoặc cập nhật `docs/index.md` với:
- Mục tiêu kinh doanh của dự án
- Architecture overview
- Các quy tắc quan trọng cần giữ

#### Bước 3: Chọn cách tiếp cận phù hợp

- **Thay đổi nhỏ** (bug fix, tính năng nhỏ): Dùng `bmad-quick-dev` trực tiếp
- **Thay đổi lớn** (module mới, refactor lớn): Dùng BMad Method đầy đủ từ Giai đoạn 2

#### Bước 4: Quick Dev cho việc nhỏ

```bash
# Mở skill Quick Dev
bmad-quick-dev

# Mô tả yêu cầu, agent sẽ:
# 1. Làm rõ ý định (có người trong vòng lặp)
# 2. Tạo mini-spec nếu cần
# 3. Triển khai tự động
# 4. Code review
# 5. Trình bày kết quả để bạn approve
```

---

### 6.3. Luồng làm việc mẫu — Tính năng mới (BMad Method)

```
Ngày 1-2: Analysis
  ├── bmad-analyst → CB → product-brief.md
  └── (tùy chọn) bmad-analyst → MR → market-research.md

Ngày 2-3: Planning  
  ├── bmad-pm → CP → PRD.md
  ├── bmad-pm → VP (validate)
  └── (nếu có UI) bmad-ux-designer → CU → ux-spec.md

Ngày 3-4: Solutioning
  ├── bmad-architect → CA → architecture.md
  ├── bmad-pm → EP → epics/ (stories)
  └── bmad-architect → IR → PASS ✓

Ngày 5+: Implementation (lặp lại cho mỗi story)
  ├── bmad-agent-dev → SP → sprint-status.yaml
  ├── bmad-agent-dev → DS → code + tests
  ├── bmad-agent-dev → CR → approved
  └── (sau epic) bmad-agent-dev → QA → e2e tests
```

---

## 7. Kiểm thử với BMAD — Hướng dẫn cho QC

BMAD cung cấp hai hướng tiếp cận kiểm thử:

### 7.1. QA tích hợp sẵn — Nhẹ nhàng (Developer Agent)

**Phù hợp với:** Dự án nhỏ–trung bình, cần bao phủ test nhanh

**Kích hoạt:**
```bash
# Trong agent Developer
bmad-agent-dev

# Sau khi hoàn tất một epic (tất cả stories đã dev + review xong)
QA    # QA Test Generation
```

**5 bước workflow QA:**

1. **Phát hiện framework**: Agent tự nhận diện Jest, Vitest, Playwright, Cypress từ codebase
2. **Xác định tính năng cần test**: Dựa vào stories và acceptance criteria của epic vừa hoàn tất
3. **Tạo API tests**: Status codes, cấu trúc response, happy path, edge cases
4. **Tạo E2E tests**: User workflows, semantic locators (role/label/text — không dùng CSS selector)
5. **Chạy và xác minh**: Tự chạy tests, phát hiện và sửa lỗi ngay

**Các nguyên tắc khi sinh test:**

```typescript
// ✅ Dùng semantic locator
await page.getByRole('button', { name: 'Đăng nhập' }).click()
await page.getByLabel('Email').fill('user@example.com')

// ❌ Không dùng CSS selector cứng
await page.locator('.btn-primary#login').click()

// ✅ Test độc lập, không phụ thuộc thứ tự
test('create task', async () => {
  // setup riêng cho test này
})

// ❌ Không hardcode wait/sleep
await page.waitForTimeout(3000) // Không làm thế này
```

**Khi nào dùng:**
- Cần bao phủ test nhanh cho tính năng mới
- Dự án nhỏ–trung bình không cần chiến lược kiểm thử nâng cao
- Muốn tự động hóa kiểm thử mà không cần thiết lập phức tạp

---

### 7.2. Module Test Architect (TEA) — Nâng cao

**Phù hợp với:** Dự án lớn, miền nghiệp vụ phức tạp, cần truy vết yêu cầu

**Cài đặt:**
```bash
npx bmad-method install
# Chọn thêm module: TEA (Test Architect)
```

**Agent TEA:** Murat (Master Test Architect)

**9 workflow của TEA:**

| # | Workflow | Mục đích |
|---|---|---|
| 1 | **Test Design** | Tạo chiến lược kiểm thử gắn với yêu cầu (PRD/AC) |
| 2 | **ATDD** | Phát triển hướng Acceptance Test — viết test trước khi code |
| 3 | **Automate** | Tạo automated test với pattern nâng cao |
| 4 | **Test Review** | Kiểm tra chất lượng và độ bao phủ của bộ test |
| 5 | **Traceability** | Liên kết test ngược về yêu cầu trong PRD |
| 6 | **NFR Assessment** | Đánh giá yêu cầu phi chức năng (performance, security, reliability) |
| 7 | **CI Setup** | Cấu hình thực thi test trong CI/CD pipeline |
| 8 | **Framework Scaffolding** | Dựng hạ tầng test cho dự án mới |
| 9 | **Release Gate** | Ra quyết định go/no-go dựa trên chất lượng |

**Hệ thống ưu tiên P0–P3:**

| Mức | Ý nghĩa | Ví dụ |
|---|---|---|
| **P0** | Critical — phải pass 100% | Thanh toán, xác thực, bảo mật |
| **P1** | High — phải pass cho release | Core business flow |
| **P2** | Medium — nên pass | Tính năng phụ, edge cases |
| **P3** | Low — test khi có thể | UI detail, minor UX |

**Luồng ATDD với TEA:**

```
QC viết Acceptance Criteria (AC) → 
TEA tạo test từ AC (trước khi code) → 
Developer implement để test pass → 
TEA verify traceability (AC ↔ test ↔ requirement) → 
Release Gate go/no-go
```

---

### 7.3. So sánh hai hướng tiếp cận

| Yếu tố | QA tích hợp sẵn | Module TEA |
|---|---|---|
| Thời điểm test | Sau khi epic hoàn tất | Có thể trước khi code (ATDD) |
| Thiết lập | Không cần cài thêm | Cài module riêng |
| Loại test | API + E2E | API, E2E, ATDD, NFR, Performance |
| Truy vết yêu cầu | Không | Có (Traceability workflow) |
| Release gate | Không | Có (go/no-go) |
| Phù hợp nhất | Dự án nhỏ–trung bình | Dự án lớn, có compliance |

---

### 7.4. Vị trí kiểm thử trong vòng đời dự án

```
Story 1: Dev → Code Review → ✓
Story 2: Dev → Code Review → ✓
Story 3: Dev → Code Review → ✓
...
Epic hoàn tất → QA Test Generation → Tests pass → Epic Retrospective
```

> **Lưu ý:** QA Test Generation chạy **sau khi toàn bộ epic hoàn tất**, không phải sau từng story. Mục đích là kiểm thử tích hợp các stories với nhau.

---

### 7.5. Edge Case Hunter — Công cụ tìm trường hợp biên

Ngoài QA workflow, Developer Agent còn hỗ trợ:

```bash
# Trong hội thoại với Developer Agent
bmad-review-edge-case-hunter
```

Phân tích toàn bộ nhánh điều kiện trong code để tìm:
- Trường hợp biên chưa được xử lý
- Null/undefined checks bị thiếu
- Điều kiện race condition
- Input validation gaps

---

## 8. Các công cụ hỗ trợ

### 8.1. Party Mode — Thảo luận đa agent

```bash
bmad-party-mode
```

Triệu tập nhiều agent vào cùng một hội thoại để thảo luận các quyết định quan trọng:

- **Kiến trúc**: PM + Architect + Developer cùng đánh giá trade-off
- **Tính năng phức tạp**: UX Designer + Architect + PM
- **Post-mortem**: Tất cả agent cùng phân tích sự cố
- **Sprint retrospective**: PM + Developer + QC

### 8.2. Advanced Elicitation — Tinh luyện đầu ra

```bash
bmad-advanced-elicitation
```

Buộc AI xem xét lại đầu ra bằng các phương pháp:

| Phương pháp | Mục đích |
|---|---|
| **Pre-mortem** | Giả sử thất bại → lần ngược nguyên nhân |
| **First Principles** | Loại bỏ giả định, bắt đầu từ sự thật cơ bản |
| **Red Team / Blue Team** | Tự tấn công, tự bảo vệ |
| **Socratic Questioning** | Chất vấn mọi khẳng định |
| **Constraint Removal** | Bỏ ràng buộc → thấy giải pháp khác |
| **Stakeholder Mapping** | Đánh giá từ góc nhìn từng bên liên quan |

Dùng sau khi có một tài liệu quan trọng (PRD, Architecture) để tìm điểm yếu trước khi tiếp tục.

### 8.3. Adversarial Review — Review hoài nghi

```bash
bmad-review-adversarial-general
```

Review kiểu "devil's advocate" — giả định vấn đề luôn tồn tại:
- Phải tìm được tối thiểu 10 vấn đề
- Tìm những gì **còn thiếu**, không chỉ những gì sai
- Trực giao với Edge Case Hunter

### 8.4. Distillator — Nén tài liệu cho LLM

```bash
bmad-distillator
```

Khi tài liệu quá lớn (PRD dài, Architecture phức tạp), Distillator nén nội dung tối ưu cho LLM mà không mất thông tin quan trọng.

### 8.5. Shard Large Documents — Tách file lớn

```bash
bmad-shard-doc
```

Tách file markdown lớn thành các file phần nhỏ hơn, với index tự động.

---

## 9. Cấu trúc thư mục dự án

Sau khi cài BMAD và chạy qua các giai đoạn, dự án sẽ có cấu trúc:

```
your-project/
├── _bmad/                              # Cấu hình BMAD (không chỉnh sửa thủ công)
│   ├── core/                           # Module core
│   └── bmm/                            # Modules đã cài (TEA, v.v.)
│
├── _bmad-output/                       # Tất cả artifacts sinh ra
│   ├── project-context.md              # Bản hiến pháp kỹ thuật của dự án
│   ├── planning-artifacts/
│   │   ├── product-brief.md            # Giai đoạn 1 output
│   │   ├── PRD.md                      # Giai đoạn 2 output
│   │   ├── ux-spec.md                  # Giai đoạn 2 output (nếu có)
│   │   ├── architecture.md             # Giai đoạn 3 output
│   │   └── epics/                      # Giai đoạn 3 output
│   │       ├── epic-1-auth/
│   │       │   ├── story-1-login.md
│   │       │   ├── story-2-register.md
│   │       │   └── story-3-reset-password.md
│   │       └── epic-2-dashboard/
│   └── implementation-artifacts/
│       └── sprint-status.yaml          # Tracking sprint
│
├── .claude/skills/                     # Skills cho Claude Code
│   ├── bmad-pm.md
│   ├── bmad-architect.md
│   └── ...
│
├── docs/                               # Tài liệu dự án
│   └── index.md                        # Overview, goals, architecture notes
│
└── src/                                # Source code dự án
```

---

## 10. Mẹo và Best Practices

### Chat mới cho mỗi workflow

> Luôn bắt đầu một hội thoại mới khi chuyển sang workflow khác.

Mỗi workflow của BMAD thiết kế để chạy trong context rõ ràng. Việc tiếp tục hội thoại cũ có thể gây ra nhiễu context, đặc biệt với các workflow dài.

### Đọc kỹ `project-context.md` trước khi bắt đầu sprint

Tất cả agent developer tự động nạp `project-context.md`. Đảm bảo file này luôn cập nhật với:
- Tech stack và phiên bản chính xác
- Quy tắc implementation quan trọng
- Patterns đang dùng trong codebase

### Kiến trúc là bắt buộc khi có nhiều developer

Nếu nhiều agent (hoặc developer) làm việc song song trên các stories khác nhau, kiến trúc phải được định nghĩa trước. Thiếu kiến trúc → các agent tạo ra code xung đột nhau.

### Dùng bmad-help khi không chắc

```
bmad-help Tôi đang ở đâu trong workflow?
bmad-help Story này nên dùng Quick Flow hay Dev Story?
bmad-help Implementation Readiness check thất bại, làm gì tiếp?
```

### Quick Flow không có nghĩa là không có chất lượng

Quick Dev vẫn có code review, vẫn tạo spec (mini), vẫn yêu cầu người approve kết quả. "Nhanh" ở đây là bỏ overhead lập kế hoạch không cần thiết, không phải bỏ qua chất lượng.

### Customize agent theo nhu cầu team

```yaml
# .customize.yaml
agents:
  bmad-agent-dev:
    persona: "Senior developer theo hướng TDD, luôn viết test trước"
    rules:
      - "Mọi function public phải có unit test"
      - "Không dùng any trong TypeScript"
```

### Vị trí QA trong workflow

```
❌ Sai: Test sau mỗi story ngay lập tức
✅ Đúng: Test sau khi toàn bộ epic hoàn tất (Dev + Code Review cho tất cả stories)
```

E2E test cần toàn bộ tính năng của epic để test integration. Test sớm hơn sẽ gặp dependency chưa sẵn sàng.

---

## Tài liệu tham khảo

| Tài liệu | Đường dẫn |
|---|---|
| Getting Started | [tutorials/getting-started.md](tutorials/getting-started.md) |
| Danh sách Agents | [reference/agents.md](reference/agents.md) |
| Workflow Map | [reference/workflow-map.md](reference/workflow-map.md) |
| Testing Reference | [reference/testing.md](reference/testing.md) |
| Core Tools | [reference/core-tools.md](reference/core-tools.md) |
| Modules | [reference/modules.md](reference/modules.md) |
| Dự án đã tồn tại | [how-to/established-projects.md](how-to/established-projects.md) |
| Project Context | [explanation/project-context.md](explanation/project-context.md) |
| Quick Dev | [explanation/quick-dev.md](explanation/quick-dev.md) |
| Why Solutioning Matters | [explanation/why-solutioning-matters.md](explanation/why-solutioning-matters.md) |
| Cài đặt BMAD | [how-to/install-bmad.md](how-to/install-bmad.md) |

---

*Tài liệu này được tổng hợp từ bản dịch tiếng Việt của BMAD Method Documentation. Cập nhật lần cuối: 2026-04-15.*
