---
name: high-signal-writing
description: >-
  Quy chuẩn hành văn kỹ thuật mật độ tín hiệu cao nhưng dễ hiểu tuyệt đối (High-Signal,
  Đơn nghĩa, Nén không mất mát, Cấm rút cụt ngủn), 8 bệnh LLM cấm kỵ, bảng ví dụ đối chiếu
  và checklist 6 điểm. Kích hoạt khi biên soạn hoặc kiểm định DOC_MAP.md, CODEBASE_MAP.md,
  ADR, Wiki, Spec, Handoff và các file Rule/Doc.
---

# SKILL: HÀNH VĂN KỸ THUẬT MẬT ĐỘ TÍN HIỆU CAO & DỄ HIỂU (HIGH-SIGNAL WRITING)

> **4 Trụ cột Cân bằng:**
> 1. **Mật độ tín hiệu tối đa:** Cắt 100% lời dẫn xã giao, từ đệm và tính từ quảng cáo.
> 2. **Đơn nghĩa tuyệt đối:** Mỗi câu chỉ có duy nhất 1 cách hiểu; phân tách rõ *Mô tả* và *Mệnh lệnh*.
> 3. **Nén không mất mát:** Giữ nguyên 100% tên hàm, đường dẫn, cờ CLI, mã lỗi, điều kiện biên và `invariants`.
> 4. **Dễ hiểu cho cả Người & Model nhỏ (`Flash`) — Cấm rút cụt ngủn:** Cô đọng là cắt từ thừa, **không phải cắt cụt ngữ cảnh**. Bắt buộc giữ lại **lý do nhân quả ngắn gọn (`Làm X vì Y`)** và tách các quy trình phức tạp thành từng bước đánh số `1, 2, 3` để model nhỏ (`Gemini Flash`) không phải tự suy diễn.

---

## 1. Tám Bệnh Hành Văn Cấm Kỵ Ở LLM (Anti-Patterns)

| Bệnh cấm kỵ | Biểu hiện cụ thể | Hậu quả đối với Agent & Người đọc |
| :--- | :--- | :--- |
| **1. Lời dẫn rào đón** | _"Như chúng ta đã biết...", "Để đảm bảo tính nhất quán..."_ | Đốt token, làm loãng sự chú ý của model. |
| **2. Chỉ thị mơ hồ** | _"Các file trong thư mục này đều ngắn, Agent cần mở ra đọc..."_ | Agent tưởng bị bắt buộc phải mở **toàn bộ file** ra đọc ngay. |
| **3. Trùng lặp nhãn dán** | Tạo tiêu đề trung gian rồi lặp lại y nguyên nội dung dòng trước. | Tăng số dòng giả tạo, che khuất dữ liệu thực. |
| **4. Hành chính lê thê** | Dùng 30–40 từ cho một quy tắc có thể chốt gọn trong 12–15 từ. | Giảm tốc độ quét thông tin (`scanability`). |
| **5. Tính từ quảng cáo** | _"Giải pháp mạnh mẽ, tối ưu vượt trội, toàn diện, thông minh..."_ | Vô nghĩa kỹ thuật, không có giá trị kiểm chứng. |
| **6. Câu ghép nhồi nhét** | Nhét 4–5 mệnh đề/bước xử lý vào 1 câu dài > 30 từ. | Làm model nhỏ (`Flash`) bị rối và bỏ sót vế cuối. |
| **7. Đề mục hình thức rỗng** | Dùng `## Giới thiệu`, `## Tổng quan` không chứa contract mới. | Làm loãng cây cấu trúc tài liệu. |
| **8. Nén cụt ngủn (Cryptic)** | Cắt mất điều kiện kích hoạt hoặc lý do kỹ thuật (`"Cấm X. Dùng Y"` không rõ khi nào). | Làm model nhỏ hiểu máy móc, áp dụng sai hoàn cảnh. |

---

## 2. Tám Nguyên Tắc Viết Chuẩn Mực

1. **Câu đơn trực diện (< 25 từ), tách bước khi có chuỗi hành động:**
   - Mỗi câu viết theo cấu trúc `[Điều kiện / Chủ thể] → [Hành động] → [Mục đích / Kết quả]`.
   - Nếu một quy trình có $\ge 3$ bước liên tiếp, **bắt buộc tách thành danh sách đánh số (`1, 2, 3`)**, cấm dồn thành 1 câu văn xuôi dài.
2. **Bảo toàn Mạch Nhân Quả (`Why` + `How`) cho Model nhỏ:**
   - Khi đặt quy tắc cấm hoặc bắt buộc không hiển nhiên, luôn kèm giải thích nguyên nhân trong 5–10 từ (Ví dụ: *"Khi User chạy `/compact`, phải kill và spawn lại `Debate Auditor` **vì lệnh `/compact` chỉ nén cửa sổ chat của `Lead`, không tự nén subagent chạy ngầm**"*).
3. **Tách bạch Mô tả và Chỉ thị:** Mô tả dữ liệu bằng câu trần thuật. Mọi chỉ thị hành động phải gắn **điều kiện kích hoạt rõ ràng (`Khi X → Thực hiện Y`)**.
4. **Đanh thép & Định lượng hóa:** Dùng **"Cấm X"**, **"Bắt buộc Y"**, **"Fail-fast khi Z"** kèm con số cụ thể (`< 120 dòng`, `3–6 files`, `O(N)`).
5. **Quy tắc dùng dấu `|` (Phân biệt Map tra cứu vs Biểu mẫu điền):**
   - **Trong tài liệu tra cứu (`DOC_MAP.md`):** Được gom thuộc tính của 1 file trên cùng 1 dòng bằng dấu `|` để tiết kiệm dòng.
   - **Trong Biểu mẫu bắt Agent điền (`Handoff`, `Verdict`, `Init Manifest`, `ADR`, `SESSION_STATE`):** **Mỗi trường bắt buộc nằm trên 1 dòng riêng biệt** để model nhỏ (`Flash`) không bỏ sót trường bên phải dấu `|`.
6. **Đề mục mang tải trọng kỹ thuật:** Heading phải nêu đích danh tên module, thuật toán hoặc cơ chế.
7. **Bảo tồn thực thể định tuyến:** Mọi tên hàm, class, đường dẫn file, cờ CLI, mã lỗi dùng để `grep` bắt buộc bọc trong backticks (`` `code` ``).
8. **Định tuyến Đầu trang & Đẩy Ngoại lệ Xuống Đáy (`Decision-Tree TOC & Happy-Path First`):** Với tài liệu hướng dẫn có nhánh chuẩn (80% trường hợp) và nhánh ngoại lệ/xung đột (20%):
   - Đặt **Mục lục định tuyến theo điều kiện (`Nếu trạng thái A → Xem #Mục-X`)** ngay đầu file.
   - Đặt **Luồng thực thi chuẩn (`Happy Path`)** ở Mục 1 ngay sau mục lục; đẩy bảng xử lý ngoại lệ/xung đột xuống cuối file.

---

## 3. Bảng Ví Dụ Đối Chiếu Thực Chiến (Few-Shot Examples)

| Tình huống | ❌ Lê thê (Fluff) hoặc Cụt ngủn (Cryptic) | ✅ Chuẩn High-Signal & Dễ Hiểu (Đủ Điều kiện + Nhân quả) |
| :--- | :--- | :--- |
| **Chỉ định mở file** | *Lê thê:* `Agent BẮT BUỘC phải mở file này ra đọc trước khi có ý định refactor...`<br>*Cụt ngủn:* `Đọc khi refactor.` | `**Mở khi:** Refactor, sửa logic lõi hoặc đề xuất kiến trúc mới (để tránh làm vỡ invariant đã khóa).` |
| **Hướng dẫn đọc thư mục** | `Toàn bộ các file trong thư mục này đều là micro-specs ngắn. Agent cần mở trực tiếp file để đọc...` | `Micro-spec ngắn (< 150 dòng). Chỉ mở đúng 1 file khi xử lý module tương ứng; cấm đọc trước hàng loạt gây tràn context.` |
| **Quy trình nhiều bước** | `Khi thiếu GitNexus thì Lead phải hướng dẫn cài rồi phân tích quy trình tĩnh 3 bước kèm rủi ro rồi dùng ask_question hỏi User.` *(Nhồi 1 câu)* | `Khi thiếu GitNexus, Lead thực hiện 3 bước: (1) Hướng dẫn cài npm i -g gitnexus; (2) Nêu rõ phương án đọc tĩnh dự phòng và rủi ro sót đa hình; (3) Gọi ask_question để User chọn.` |

---

## 4. Checklist Kiểm Duyệt Trước Khi Lưu (6-Point Gate)

1. **Đơn nghĩa chỉ thị:** Có câu mô tả nào dễ bị AI hiểu nhầm thành lệnh bắt buộc mở/sửa file hàng loạt không?
2. **Zero Fluff:** Đã xóa sạch câu mở bài xã giao, lý thuyết thừa và tính từ quảng cáo chưa?
3. **Không nhồi câu (> 25–30 từ):** Các câu ghép dài hoặc quy trình $\ge 3$ bước đã được tách bằng `;` hoặc tách thành danh sách `1, 2, 3` chưa?
4. **Không rút cụt ngủn:** Các quy tắc quan trọng đã có đủ **Điều kiện kích hoạt (`Khi nào`)** và **Lý do kỹ thuật ngắn (`Tại sao`)** để model `Flash` hiểu đúng bản chất chưa?
5. **Một trường một dòng trong Form:** Các biểu mẫu điền (`Manifest`, `Handoff`, `Verdict`, `ADR`) đã tách mỗi trường cần điền ra 1 dòng riêng (không nối bằng `|`) chưa?
6. **Bảo toàn thực thể & Không ghi số dòng trong Map:** Tên hàm, đường dẫn, mã lỗi đã bọc trong `` ` `` và `DOC_MAP.md` / `CODEBASE_MAP.md` đã neo theo Heading/Symbol thay vì số dòng chưa?
