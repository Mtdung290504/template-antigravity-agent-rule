---
name: high-signal-writing
description: >-
  Quy chuẩn hành văn kỹ thuật mật độ tín hiệu cao (High-Signal, Đơn nghĩa tuyệt đối,
  Nén không mất mát), 7 bệnh LLM cấm kỵ, bảng ví dụ đối chiếu và checklist 5 điểm.
  Kích hoạt khi biên soạn hoặc kiểm định DOC_MAP.md, CODEBASE_MAP.md, ADR, Wiki, Spec và Handoff.
---

# SKILL: HÀNH VĂN KỸ THUẬT MẬT ĐỘ TÍN HIỆU CAO (HIGH-SIGNAL WRITING)

> **3 Trụ cột:** (1) **Mật độ tín hiệu tối đa** (cắt 100% từ đệm/xã giao) | (2) **Đơn nghĩa tuyệt đối** (chỉ có 1 cách hiểu duy nhất) | (3) **Nén không mất mát** (giữ nguyên 100% tên hàm, đường dẫn, cờ CLI, mã lỗi, điều kiện biên và `invariants`).

---

## 1. Bảy Bệnh Hành Văn Cấm Kỵ Ở LLM (Anti-Patterns)

| Bệnh cấm kỵ | Biểu hiện cụ thể | Hậu quả đối với Agent |
| :--- | :--- | :--- |
| **1. Lời dẫn rào đón** | *"Như chúng ta đã biết...", "Để đảm bảo tính nhất quán..."* | Đốt token, làm loãng sự chú ý của model. |
| **2. Chỉ thị mơ hồ** | *"Các file trong thư mục này đều ngắn, Agent cần mở ra đọc..."* | Agent tưởng bị bắt buộc phải mở **toàn bộ file** ra đọc ngay. |
| **3. Trùng lặp nhãn dán** | Tạo tiêu đề trung gian rồi lặp lại y nguyên nội dung dòng trước. | Tăng số dòng giả tạo, che khuất dữ liệu thực. |
| **4. Hành chính lê thê** | Dùng 30–40 từ cho một quy tắc có thể chốt gọn trong 10 từ. | Giảm tốc độ quét thông tin (`scanability`). |
| **5. Tính từ quảng cáo** | *"Giải pháp mạnh mẽ, tối ưu vượt trội, toàn diện, thông minh..."* | Vô nghĩa kỹ thuật, không có giá trị kiểm chứng. |
| **6. Câu ghép nhiều tầng** | Nối 3–4 mệnh đề bằng *"nhằm mục đích"*, *"thông qua việc"*. | Làm model nhỏ (`flash`) hiểu sai quan hệ nhân quả. |
| **7. Đề mục hình thức rỗng**| Dùng `## Giới thiệu`, `## Tổng quan` không chứa contract mới. | Làm loãng cây cấu trúc tài liệu. |

---

## 2. Sáu Nguyên Tắc Viết Chuẩn Mực

1. **Chủ - Vị trực diện, câu ngắn (< 20 từ):** Viết `[Chủ thể] [Hành động / Ràng buộc] [Đối tượng / Thông số]`; ngắt vế bằng `;` hoặc `.`.
   - *Sai:* `Hàm này được thiết kế nhằm mục đích kiểm tra xem token có hết hạn hay chưa và nếu hết hạn thì trả về lỗi.`
   - *Đúng:* `Kiểm tra hạn dùng JWT; trả về mã lỗi AUTH_TOKEN_EXPIRED nếu quá hạn.`
2. **Tách bạch Mô tả và Chỉ thị:** Mô tả dữ liệu bằng câu trần thuật khách quan. Mọi chỉ thị hành động bắt buộc gắn **điều kiện kích hoạt rõ ràng (`Khi X → Thực hiện Y`)**.
3. **Đanh thép & Định lượng hóa:** Dùng **"Cấm X"**, **"Bắt buộc Y"**, **"Fail-fast khi Z"** kèm con số cụ thể (`< 120 dòng`, `timeout 5000ms`, `limit 1 MiB`, `O(N)`).
4. **Quy tắc dùng dấu `|` (Phân biệt Map vs Form điền):**
   - **Trong tài liệu tra cứu (`DOC_MAP.md`):** Gom thuộc tính của 1 file trên cùng 1 dòng bằng dấu `|` để tiết kiệm dòng.
   - **Trong Biểu mẫu bắt Agent điền (Handoff, Verdict, Manifest):** **Mỗi trường phải nằm trên 1 dòng riêng biệt** để tránh việc model nhỏ điền vế đầu mà bỏ quên vế sau.
5. **Đề mục mang tải trọng kỹ thuật:** Heading phải nêu đích danh tên module, thuật toán hoặc cơ chế (`## Khóa file nguyên tử`, `## Xác thực 2 pha IPC`).
6. **Bảo tồn thực thể định tuyến:** Mọi tên hàm, class, đường dẫn file, cờ CLI, mã lỗi dùng để `grep` bắt buộc bọc trong backticks (`` `code` ``). Cấm dịch nghĩa hoặc viết tắt.

---

## 3. Bảng Ví Dụ Đối Chiếu Thực Chiến (Few-Shot Examples)

| Tình huống | ❌ Văn phong LLM lê thê / Dễ gây hiểu lầm | ✅ Văn phong Chuẩn Kỹ thuật (High-Signal, Đơn nghĩa) |
| :--- | :--- | :--- |
| **Chỉ định mở file** | `Agent BẮT BUỘC phải mở file này ra đọc trước khi có ý định refactor hoặc thay đổi bất kỳ logic cốt lõi nào của hệ thống...` | `**Mở khi:** Refactor, sửa logic lõi hoặc đề xuất kiến trúc mới (tránh vi phạm invariant).` |
| **Hướng dẫn đọc thư mục** | `Toàn bộ các file trong thư mục này đều là micro-specs ngắn (< 150 dòng). Agent chỉ cần mở trực tiếp file để đọc trọn vẹn...` | `Micro-spec ngắn (< 150 dòng). Chỉ mở đúng 1 file khi cần xử lý module tương ứng; cấm đọc trước hàng loạt.` |
| **Quy định cấm** | `Chúng ta tuyệt đối không được phép tự tiện tắt các chế độ kiểm tra kiểu dữ liệu nghiêm ngặt của trình biên dịch...` | `Cấm tắt cờ `--strict` hoặc dùng `any` / `@ts-ignore` để lách lỗi biên dịch.` |
| **Cơ chế lưu trữ** | `Hệ thống sẽ không lưu lại các file tạm trên ổ đĩa mà sẽ tính toán trực tiếp ngay trong bộ nhớ RAM để đảm bảo ổ đĩa luôn sạch sẽ...` | `Tính toán on-demand trong RAM (Zero Disk Junk); cấm ghi file tạm ra đĩa.` |
| **Xử lý lỗi** | `Nếu có bất kỳ lỗi định dạng cấu hình nào xảy ra trong quá trình khởi động thì hệ thống sẽ dừng lại và báo lỗi ngay chứ không tự đoán...` | `Lỗi cấu hình lúc khởi động: fail-fast ngay lập tức; cấm tự động sửa (no auto-repair).` |

---

## 4. Checklist Kiểm Duyệt Trước Khi Lưu (5-Point Gate)

1. **Đơn nghĩa chỉ thị:** Có câu mô tả nào dễ bị AI hiểu nhầm thành lệnh bắt buộc mở/sửa file hàng loạt không?
2. **Zero Fluff:** Đã xóa sạch câu mở bài, giải thích lý thuyết thừa và tính từ quảng cáo chưa?
3. **Độ dài câu:** Các câu trên 25 từ đã được cắt ngắn bằng `;` hoặc `.` chưa?
4. **Bảo toàn thực thể:** Toàn bộ tên hàm, đường dẫn, mã lỗi dùng để `grep` đã nằm trong backtick (`` ` ``) chưa?
5. **Không dùng số dòng trong Map:** `DOC_MAP.md` và `CODEBASE_MAP.md` đã neo theo Heading (`##`) và Tên hàm/Class thay vì số dòng chưa?
