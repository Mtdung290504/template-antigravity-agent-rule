---
name: high-signal-writing
description: >-
  Quy chuẩn hành văn kỹ thuật mật độ tín hiệu cao nhưng dễ hiểu từng câu chữ (High-Signal,
  Đơn nghĩa, Nén không mất mát, Cấm từ ngữ marketing tối nghĩa, Cấm rút cụt ngủn), 8 bệnh LLM
  cấm kỵ, bảng ví dụ đối chiếu và checklist 6 điểm. Bắt buộc áp dụng làm văn phong chuẩn trong
  MỌI phản hồi chat với User, mọi tin nhắn giữa các Agent và mọi file tài liệu/báo cáo.
---

# SKILL: HÀNH VĂN KỸ THUẬT MẬT ĐỘ TÍN HIỆU CAO & DỄ HIỂU

> **Phạm vi bắt buộc:** Áp dụng làm **văn phong mặc định trong mọi câu trả lời trực tiếp cho User trên khung chat**, mọi tin nhắn trao đổi giữa các Agent (`send_message`), và mọi file tài liệu (`DOC_MAP.md`, `CODEBASE_MAP.md`, ADR, Wiki, Handoff, Rule).
>
> **4 Trụ cột Cân bằng:**
>
> 1. **Mật độ tín hiệu tối đa:** Cắt 100% lời dẫn xã giao, từ đệm và tính từ quảng cáo.
> 2. **Đơn nghĩa tuyệt đối:** Mỗi câu chỉ có duy nhất 1 cách hiểu; phân tách rõ _Mô tả_ và _Mệnh lệnh_.
> 3. **Nén không mất mát:** Giữ nguyên 100% dữ kiện, thiết kế, mô tả, thông tin và `invariants`.
> 4. **Từng câu chữ dễ hiểu ngay — Cấm từ marketing tối nghĩa & Cấm rút cụt ngủn:** Dùng từ ngữ bình dân, chỉ thẳng hành động cụ thể (`mở file X`, `chạy lệnh Y`, `hỏi User`). Chi tiết tại Bệnh 5, Bệnh 8 và Nguyên tắc 1–3.

---

## 1. Tám Bệnh Hành Văn Cấm Kỵ Ở LLM

| Bệnh cấm kỵ | Biểu hiện cụ thể | Hậu quả đối với Agent & Người đọc |
| :--- | :--- | :--- |
| **1. Lời dẫn rào đón** | _"Như chúng ta đã biết...", "Để đảm bảo tính nhất quán..."_ | Đốt token, làm loãng sự chú ý của model. |
| **2. Chỉ thị mơ hồ** | _"Các file trong thư mục này đều ngắn, Agent cần mở ra đọc..."_ | Agent tưởng bị bắt buộc phải mở **toàn bộ file** ra đọc ngay. |
| **3. Trùng lặp nhãn dán** | Tạo tiêu đề trung gian rồi lặp lại y nguyên nội dung dòng trước. | Tăng số dòng giả tạo, che khuất dữ liệu thực. |
| **4. Hành chính lê thê** | Dùng 30–40 từ cho một quy tắc có thể chốt gọn trong 12–15 từ. | Giảm tốc độ quét thông tin. |
| **5. Từ marketing & Khẩu hiệu tối nghĩa** | Dùng tính từ quảng cáo (_"mạnh mẽ, tối ưu vượt trội"_) hoặc tự chế cụm từ bóng bẩy nhưng trừu tượng (_"Single Invariant Trigger"_, _"điều phối tri thức đa chiều"_). | Người đọc và model nhỏ phải mất công đoán xem hành động thực tế là gì; vô nghĩa kỹ thuật. |
| **6. Câu ghép nhồi nhét** | Nhét 4–5 mệnh đề/bước xử lý vào 1 câu dài > 30 từ. | Làm model nhỏ (`Flash`) bị rối và bỏ sót vế cuối. |
| **7. Đề mục hình thức rỗng** | Dùng `## Giới thiệu`, `## Tổng quan` không chứa contract mới. | Làm loãng cây cấu trúc tài liệu. |
| **8. Nén cụt ngủn** | Cắt mất điều kiện kích hoạt hoặc lý do kỹ thuật (`"Cấm X. Dùng Y"` không rõ khi nào). | Làm model nhỏ hiểu máy móc, áp dụng sai hoàn cảnh. |

---

## 2. Tám Nguyên Tắc Viết Chuẩn Mực

1. **Từ ngữ bình dân, chỉ thẳng hành động (Cấm chữ nghĩa bóng bẩy tối nghĩa):**
   - Dùng động từ và danh từ cụ thể gắn với công cụ thật (`gọi read_file`, `tra bằng search_web`, `bật ask_question`).
   - Không đặt tên tiêu đề hoặc quy tắc bằng các khẩu hiệu tiếng Anh tự chế hay từ Hán-Việt trừu tượng nếu có thể diễn đạt bằng câu tiếng Việt đời thường, rõ nghĩa ngay lập tức.
2. **Câu đơn trực diện (< 25 từ), tách bước khi có chuỗi hành động:**
   - Mỗi câu viết theo cấu trúc `[Khi gặp điều kiện X] → [Chủ thể làm hành động Y] → [Để đạt kết quả Z]`.
   - Nếu một quy trình có $\ge 3$ bước liên tiếp, **bắt buộc tách thành danh sách đánh số (`1, 2, 3`)**, cấm dồn thành 1 câu văn xuôi dài.
3. **Bảo toàn Mạch Nhân Quả (`Why` + `How`) cho Model nhỏ:**
   - Khi đặt quy tắc cấm hoặc bắt buộc không hiển nhiên, luôn kèm giải thích nguyên nhân trong 5–10 từ (Ví dụ: _"Khi User chạy `/compact`, phải kill và spawn lại `Debate Auditor` **vì lệnh `/compact` chỉ nén cửa sổ chat của `Lead`, không tự nén subagent chạy ngầm**"_).
4. **Đanh thép & Định lượng hóa:** Dùng **"Cấm X"**, **"Bắt buộc Y"**, **"Dừng và báo lỗi ngay khi Z"** kèm con số cụ thể (`< 120 dòng`, `3–6 files`, `O(N)`).
5. **Quy tắc dùng dấu `|` (Phân biệt Map tra cứu vs Biểu mẫu điền):**
   - **Trong tài liệu tra cứu (`DOC_MAP.md`):** Được gom thuộc tính của 1 file trên cùng 1 dòng bằng dấu `|` để tiết kiệm dòng.
   - **Trong Biểu mẫu bắt Agent điền (`Handoff`, `Verdict`, `Init Manifest`, `ADR`, `SESSION_STATE`):** **Mỗi trường bắt buộc nằm trên 1 dòng riêng biệt** để model nhỏ (`Flash`) không bỏ sót trường bên phải dấu `|`.
6. **Đề mục nói thẳng nội dung bên dưới:** Heading phải nêu đúng việc cần làm hoặc tên cơ chế cụ thể (`## Khi nào bắt buộc gọi Debate Auditor?`, `## Khóa file nguyên tử`).
7. **Bảo tồn thực thể định tuyến:** Mọi tên hàm, class, đường dẫn file, cờ CLI, mã lỗi dùng để `grep` bắt buộc bọc trong backticks (`` `code` ``).
8. **Định tuyến Đầu trang & Đẩy Ngoại lệ Xuống Đáy:** Với tài liệu hướng dẫn có nhánh chuẩn (80% trường hợp) và nhánh ngoại lệ/xung đột (20%):
   - Đặt **Mục lục định tuyến theo điều kiện (`Nếu trạng thái A → Xem #Mục-X`)** ngay đầu file.
   - Đặt **Luồng thực thi chuẩn** ở Mục 1 ngay sau mục lục; đẩy bảng xử lý ngoại lệ/xung đột xuống cuối file.

---

## 3. Bảng Ví Dụ Đối Chiếu Thực Chiến

| Tình huống | ❌ Lê thê, Cụt ngủn hoặc Từ Marketing Tối nghĩa | ✅ Chuẩn High-Signal & Dễ Hiểu Từng Chữ |
| :--- | :--- | :--- |
| **Đặt tên quy tắc** | _Từ marketing tối nghĩa:_ `Áp dụng cơ chế Single Invariant Trigger Threshold và đồng bộ Context-First, Disk-on-Anomaly.` | `**Khi nào bắt buộc gọi Debate Auditor?** Đọc trực tiếp gói tin nhắn Lead gửi sang; chỉ mở file trên đĩa khi thấy thông tin mâu thuẫn.` |
| **Chỉ định mở file** | _Lê thê:_ `Agent BẮT BUỘC phải mở file này ra đọc trước khi có ý định refactor...`<br>_Cụt ngủn:_ `Đọc khi refactor.` | `**Mở khi:** Refactor, sửa logic lõi hoặc đề xuất kiến trúc mới (để tránh làm vỡ invariant đã khóa).` |
| **Hướng dẫn đọc thư mục** | `Toàn bộ các file trong thư mục này đều là micro-specs ngắn. Agent cần mở trực tiếp file để đọc...` | `Các file spec ngắn (< 150 dòng). Chỉ mở đúng 1 file khi xử lý module tương ứng; cấm mở đọc hàng loạt gây tràn context.` |
| **Quy trình nhiều bước** | `Khi thiếu GitNexus thì Lead phải hướng dẫn cài rồi phân tích quy trình tĩnh 3 bước kèm rủi ro rồi dùng ask_question hỏi User.` _(Nhồi 1 câu)_ | `Khi thiếu GitNexus, Lead thực hiện 3 bước: (1) Hướng dẫn cài npm i -g gitnexus; (2) Nêu rõ phương án đọc tĩnh dự phòng và rủi ro sót đa hình; (3) Gọi ask_question để User chọn.` |

---

## 4. Checklist 6 Điểm Kiểm Duyệt Trước Khi Lưu

1. **Dễ hiểu từng chữ:** Đã thay toàn bộ từ ngữ quảng cáo, khẩu hiệu tự chế bóng bẩy nhưng tối nghĩa bằng từ ngữ bình dân chỉ thẳng hành động chưa?
2. **Đơn nghĩa chỉ thị:** Có câu mô tả nào dễ bị AI hiểu nhầm thành lệnh bắt buộc mở/sửa file hàng loạt không?
3. **Không nhồi câu (> 25–30 từ):** Các câu ghép dài hoặc quy trình $\ge 3$ bước đã được tách bằng `;` hoặc tách thành danh sách `1, 2, 3` chưa?
4. **Không rút cụt ngủn:** Các quy tắc quan trọng đã có đủ **Điều kiện kích hoạt (`Khi nào`)** và **Lý do kỹ thuật ngắn (`Tại sao`)** để model `Flash` hiểu đúng bản chất chưa?
5. **Một trường một dòng trong Form:** Các biểu mẫu điền (`Manifest`, `Handoff`, `Verdict`, `ADR`) đã tách mỗi trường cần điền ra 1 dòng riêng (không nối bằng `|`) chưa?
6. **Bảo toàn thực thể & Không ghi số dòng trong Map:** Tên hàm, đường dẫn, mã lỗi đã bọc trong `` ` `` và `DOC_MAP.md` / `CODEBASE_MAP.md` đã neo theo Heading/Symbol thay vì số dòng chưa?
