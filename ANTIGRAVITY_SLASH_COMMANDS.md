# ⚡ HƯỚNG DẪN TỔNG HỢP CÁC LỆNH SLASH (`/`) TRONG GOOGLE ANTIGRAVITY

Tài liệu tóm lược toàn bộ các lệnh Slash (`/`) chính thức trong Google Antigravity (Antigravity IDE, Desktop 2.0 và CLI). Các lệnh này dùng để kích hoạt các chế độ tư duy, điều phối multi-agent hoặc gọi các workflow tự động.

---

## 📌 BẢNG TRA CỨU NHANH (QUICK CHEAT-SHEET)

| Lệnh | Nhóm chức năng | Tác dụng cốt lõi | Khi nào nên dùng? |
| :--- | :--- | :--- | :--- |
| **`/boost`** | Suy luận & Phản biện | Suy luận sâu (Deep Thinking), lập chiến lược, đa góc nhìn, kiểm chứng khắt khe. | Task kiến trúc lớn, bug hóc búa, audit repo. |
| **`/plan`** | Lập kế hoạch | Tạo lộ trình triển khai chi tiết từng bước trước khi viết code. | Dự án phức tạp, cần rà soát rủi ro trước khi làm. |
| **`/teamwork`** | Multi-Agent | Kích hoạt nhóm nhiều Agent tự chủ cùng phối hợp làm việc. | Project lớn, phân rã công việc cho nhiều vai trò. |
| **`/goal`** | Chạy bền bỉ (Overnight) | Tự chạy độc lập, tự sửa lỗi, không dừng lại tới khi đạt 100% mục tiêu. | Task dài hạn, crawl dữ liệu lớn, refactor hàng loạt. |
| **`/grill-me`** | Phỏng vấn ngược | Agent đặt câu hỏi dồn dập để bóc tách giả định thiết kế của người dùng. | Ý tưởng còn mơ hồ, cần chốt yêu cầu kỹ thuật. |
| **`/compact`** | Quản lý Ngữ cảnh | Tóm tắt và nén lịch sử chat để giải phóng dung lượng Context Window. | Hội thoại kéo dài, agent bắt đầu chậm hoặc đầy token. |
| **`/learn`** | Ghi nhớ Tri thức | Lưu các bài học, quy ước hoặc fix phức tạp vào bộ nhớ dài hạn. | Sau khi fix xong một case khó, muốn agent nhớ vĩnh viễn. |
| **`/browser`** | Tự động hóa Web | Kích hoạt trình duyệt tương tác/headless để duyệt web, test UI, crawl. | Cần tương tác web động, xác thực UI, tra cứu sâu. |
| **`/automation`** | Tự động hóa | Hướng dẫn tạo và thiết lập các tác vụ tự động chạy ngầm. | Cần tạo luồng tự động hóa tương tác. |
| **`/schedule`** | Hẹn giờ & Cron | Thiết lập lịch chạy định kỳ (cron) hoặc hẹn giờ một lần (timer). | Báo cáo định kỳ mỗi sáng, chạy test đêm. |
| **`/plugin`** | Quản lý Tiện ích | Cài đặt, bật/tắt, đóng gói các plugin (skills, rules, MCP, hooks). | Mở rộng tính năng và công cụ cho Antigravity. |
| **`/help`** | Hỗ trợ CLI | Hiển thị trợ giúp và danh sách lệnh hỗ trợ trong phiên CLI. | Tra cứu nhanh khi dùng terminal `agy`. |
| **`/clear`** | Phiên làm việc | Xóa sạch màn hình và làm mới ngữ cảnh hiện tại. | Bắt đầu một nhiệm vụ hoàn toàn mới. |
| **`/exit`** | Điều khiển CLI | Thoát khỏi giao diện dòng lệnh `agy` (hoặc `Ctrl+D Ctrl+D`). | Đóng terminal CLI. |

---

## 🛠️ CHI TIẾT TỪNG LỆNH & KỊCH BẢN ỨNG DỤNG

### 1. Nhóm Điều phối & Tư duy Agent (Agent Orchestration & Reasoning)

#### 🥊 `/boost`
* **Mục đích:** Kích hoạt chế độ tư duy mở rộng (Deep Reasoning) và cơ chế tự phản biện khắt khe.
* **Cơ chế:** Agent không trả lời ngay mà dành ngân sách suy luận lớn để đánh giá các phương án kỹ thuật, phân tích đánh đổi (trade-offs), tự đóng vai Audit Agent để bóc trần rủi ro và xây dựng kịch bản kiểm thử biên (edge cases).

#### 🗺️ `/plan`
* **Mục đích:** Tách biệt rõ ràng giữa giai đoạn lập kế hoạch và giai đoạn thực thi.
* **Cơ chế:** Agent sẽ khảo sát mã nguồn, phân tích tác động và xuất bản một kế hoạch hành động chi tiết (Step-by-step Execution Plan). Agent sẽ dừng lại đợi bạn phê duyệt trước khi đụng vào bất kỳ dòng code nào.

#### 👥 `/teamwork`
* **Mục đích:** Khởi tạo một đội ngũ Subagent chuyên biệt chạy song song.
* **Cơ chế:** Phân bổ các vai trò khác nhau (như Coder, Reviewer, Tester) trên các không gian làm việc cô lập (git branches/worktrees) để xử lý các phần việc độc lập và đồng bộ lại.

#### 🎯 `/goal`
* **Mục đích:** Giao phó nhiệm vụ dài hạn chạy nền tự chủ không cần giám sát liên tục (Overnight mode).
* **Cơ chế:** Agent tự quản lý vòng lặp thử - sai - sửa, tự chạy lại test khi gặp lỗi, kiên trì theo đuổi tiêu chí nghiệm thu cho đến khi hoàn thành triệt để mục tiêu.

#### 🎙️ `/grill-me`
* **Mục đích:** Đóng vai "người phỏng vấn khó tính" để thử thách kiến trúc của bạn.
* **Cơ chế:** Thay vì vâng dạ làm theo yêu cầu, Agent sẽ hỏi ngược lại bạn từng ngóc ngách: *"Tại sao dùng Redis mà không dùng In-memory?", "Trường hợp mất mạng giữa chừng xử lý thế nào?"* Giúp thiết kế vững chắc trước khi code.

---

### 2. Nhóm Quản trị Ngữ cảnh & Bộ nhớ (Context & Memory Management)

#### 🗜️ `/compact`
* **Mục đích:** Dọn rác và nén context window của cuộc hội thoại.
* **Cơ chế:** Tóm lược toàn bộ lịch sử trao đổi, quyết định kiến trúc và trạng thái hiện tại thành một bản ghi cô đọng, xóa bỏ các log terminal rác để Agent lấy lại độ nhạy bén và tiết kiệm token.

#### 🧠 `/learn`
* **Mục đích:** Lưu trữ kinh nghiệm vào tri thức dự án.
* **Cơ chế:** Đóng gói giải pháp vừa tìm được thành file quy chuẩn (trong `.agents/` hoặc rules) để mọi phiên làm việc sau này của Agent đều tự động tuân thủ mà không cần nhắc lại.

---

### 3. Nhóm Tác vụ Chuyên biệt & Tự động hóa (Specialized Automation)

#### 🌐 `/browser`
* **Mục đích:** Điều khiển trình duyệt web thực tế.
* **Cơ chế:** Cho phép Agent mở trình duyệt, click, điền form, chụp ảnh màn hình, vượt qua các trang Single Page App (SPA) có nhiều JavaScript để lấy dữ liệu hoặc test E2E.

#### ⏰ `/schedule` & `/automation`
* **Mục đích:** Lên lịch chạy tác vụ tự động.
* **Cơ chế:** 
  * Hẹn giờ 1 lần: Đợi $N$ phút/giờ rồi thực hiện lệnh.
  * Lịch định kỳ (Cron): Ví dụ mỗi 8:00 AM hàng ngày quét repository và gửi email báo cáo tình trạng build.

#### 🧩 `/plugin`
* **Mục đích:** Quản lý mở rộng môi trường Antigravity.
* **Cơ chế:** Giao diện một cửa để quản lý bộ công cụ tích hợp (MCP Servers, Custom Skills, Agent Personas, Event Hooks).

