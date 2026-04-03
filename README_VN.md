![BMad Method](banner-bmad-method.png)

[![Version](https://img.shields.io/npm/v/bmad-method?color=blue&label=version)](https://www.npmjs.com/package/bmad-method)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/gk8jAdXWmj)

[English](README.md) | [简体中文](README_CN.md) | Tiếng Việt

**Build More Architect Dreams** - một mô-đun khung phát triển hướng AI trong hệ sinh thái BMad, có khả năng thích ứng theo quy mô từ sửa lỗi nhỏ đến các hệ thống doanh nghiệp.

**100% miễn phí và mã nguồn mở.** Không có tường phí. Không có nội dung bị khóa. Không có Discord giới hạn quyền truy cập. Chúng tôi tin vào việc trao quyền cho mọi người, không chỉ cho những ai có thể trả tiền để vào một cộng đồng hay khóa học khép kín.

## Vì sao chọn BMad Method?

Các công cụ AI truyền thống thường làm thay phần suy nghĩ của bạn và tạo ra kết quả ở mức trung bình. Các agent chuyên biệt và quy trình làm việc có hướng dẫn của BMad hoạt động như những cộng tác viên chuyên gia, dẫn dắt bạn qua một quy trình có cấu trúc để khai mở tư duy tốt nhất của bạn cùng với AI.

- **Trợ giúp AI thông minh** - Gọi skill `bmad-help` bất kỳ lúc nào để biết bước tiếp theo
- **Thích ứng theo quy mô và miền bài toán** - Tự động điều chỉnh độ sâu lập kế hoạch theo độ phức tạp của dự án
- **Quy trình có cấu trúc** - Dựa trên các thực hành tốt nhất của agile xuyên suốt phân tích, lập kế hoạch, kiến trúc và triển khai
- **Agent chuyên biệt** - Hơn 12 chuyên gia theo vai trò như PM, Architect, Developer, UX, Scrum Master và nhiều vai trò khác
- **Party Mode** - Đưa nhiều persona agent vào cùng một phiên để cộng tác và thảo luận
- **Vòng đời hoàn chỉnh** - Từ động não ý tưởng cho đến triển khai

[Tìm hiểu thêm tại **docs.bmad-method.org**](https://docs.bmad-method.org/vi-vn/)

---

## 🚀 Điều gì tiếp theo cho BMad?

**V6 đã có mặt và đây mới chỉ là khởi đầu!** BMad Method đang phát triển rất nhanh với các cải tiến như đội agent đa nền tảng và tích hợp sub-agent, kiến trúc Skills, BMad Builder v1, tự động hóa vòng lặp phát triển và nhiều thứ khác vẫn đang được xây dựng.

**[📍 Xem lộ trình đầy đủ →](https://docs.bmad-method.org/vi-vn/roadmap/)**

---

## Bắt đầu nhanh

**Điều kiện tiên quyết**: [Node.js](https://nodejs.org) v20+

```bash
npx bmad-method install
```

> Muốn dùng bản prerelease mới nhất? Hãy dùng `npx bmad-method@next install`. Hãy kỳ vọng mức độ biến động cao hơn bản cài đặt mặc định.

Làm theo các lời nhắc của trình cài đặt, sau đó mở AI IDE của bạn như Claude Code hoặc Cursor trong thư mục dự án.

**Cài đặt không tương tác** (cho CI/CD):

```bash
npx bmad-method install --directory /path/to/project --modules bmm --tools claude-code --yes
```

[Xem toàn bộ tùy chọn cài đặt](https://docs.bmad-method.org/vi-vn/how-to/non-interactive-installation/)

> **Chưa chắc nên làm gì?** Hãy hỏi `bmad-help` - nó sẽ cho bạn biết chính xác bước nào tiếp theo và bước nào là tùy chọn. Bạn cũng có thể hỏi kiểu như `bmad-help Tôi vừa hoàn thành phần kiến trúc, tiếp theo tôi cần làm gì?`

## Mô-đun

BMad Method có thể được mở rộng bằng các mô-đun chính thức cho những miền chuyên biệt. Chúng có sẵn trong lúc cài đặt hoặc bất kỳ lúc nào sau đó.

| Module                                                                                                            | Mục đích                                           |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **[BMad Method (BMM)](https://github.com/bmad-code-org/BMAD-METHOD)**                                             | Khung lõi với hơn 34 quy trình                     |
| **[BMad Builder (BMB)](https://github.com/bmad-code-org/bmad-builder)**                                           | Tạo agent và quy trình BMad tùy chỉnh             |
| **[Test Architect (TEA)](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise)**             | Chiến lược kiểm thử và tự động hóa dựa trên rủi ro |
| **[Game Dev Studio (BMGD)](https://github.com/bmad-code-org/bmad-module-game-dev-studio)**                        | Quy trình phát triển game (Unity, Unreal, Godot)   |
| **[Creative Intelligence Suite (CIS)](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)** | Đổi mới, động não ý tưởng, tư duy thiết kế         |

## Tài liệu

[Trang tài liệu BMad Method](https://docs.bmad-method.org/vi-vn/) - bài hướng dẫn, hướng dẫn tác vụ, giải thích khái niệm và tài liệu tham chiếu

**Liên kết nhanh:**
- [Hướng dẫn bắt đầu](https://docs.bmad-method.org/vi-vn/tutorials/getting-started/)
- [Nâng cấp từ các phiên bản trước](https://docs.bmad-method.org/vi-vn/how-to/upgrade-to-v6/)
- [Tài liệu Test Architect](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)

## Cộng đồng

- [Discord](https://discord.gg/gk8jAdXWmj) - Nhận trợ giúp, chia sẻ ý tưởng, cộng tác
- [Đăng ký trên YouTube](https://www.youtube.com/@BMadCode) - video hướng dẫn, lớp chuyên sâu và podcast (ra mắt tháng 2 năm 2025)
- [GitHub Issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) - Báo lỗi và yêu cầu tính năng
- [Discussions](https://github.com/bmad-code-org/BMAD-METHOD/discussions) - Trao đổi cộng đồng

## Hỗ trợ BMad

BMad miễn phí cho tất cả mọi người - và sẽ luôn như vậy. Nếu bạn muốn hỗ trợ quá trình phát triển:

- ⭐ Hãy nhấn sao cho dự án ở góc trên bên phải của trang này
- ☕ [Buy Me a Coffee](https://buymeacoffee.com/bmad) - Tiếp thêm năng lượng cho quá trình phát triển
- 🏢 Tài trợ doanh nghiệp - Nhắn riêng trên Discord
- 🎤 Diễn thuyết và truyền thông - Sẵn sàng cho hội nghị, podcast, phỏng vấn (BM trên Discord)

## Đóng góp

Chúng tôi luôn chào đón đóng góp. Xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết hướng dẫn.

## Giấy phép

Giấy phép MIT - xem [LICENSE](LICENSE) để biết chi tiết.

---

**BMad** và **BMAD-METHOD** là các nhãn hiệu của BMad Code, LLC. Xem [TRADEMARK.md](TRADEMARK.md) để biết chi tiết.

[![Contributors](https://contrib.rocks/image?repo=bmad-code-org/BMAD-METHOD)](https://github.com/bmad-code-org/BMAD-METHOD/graphs/contributors)

Xem [CONTRIBUTORS.md](CONTRIBUTORS.md) để biết thông tin về những người đóng góp.