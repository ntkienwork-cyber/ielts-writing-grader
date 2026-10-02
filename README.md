# IELTS Writing Practice & AI Grading

Website luyện thi IELTS Writing (Task 1, Task 2, hoặc Full Test) với chấm điểm tự động bằng Claude API.

## Cấu trúc

- `index.html`, `css/`, `js/` — frontend tĩnh (HTML/CSS/JS thuần, không cần build).
- `server/` — backend Node/Express tối giản, chỉ dùng để gọi Claude API chấm bài (giữ API key bí mật, không lộ ra trình duyệt).

## Chạy thử

1. Cài dependency cho server:
   ```bash
   cd server
   npm install
   ```
2. Tạo file cấu hình key:
   ```bash
   cp .env.example .env
   ```
   Mở `.env` và điền `ANTHROPIC_API_KEY=` bằng API key thật của bạn (lấy tại https://console.anthropic.com).
3. Chạy server:
   ```bash
   npm start
   ```
4. Mở trình duyệt tại `http://localhost:3000`.

## Cơ chế hoạt động

- Trang chủ cho chọn 1 trong 3 chế độ: Task 1 (20 phút), Task 2 (40 phút), Full Test (60 phút, cả hai task).
- Bấm **"Bắt đầu làm bài"** → đề hiện ra ngay lập tức và đồng hồ đếm ngược bắt đầu chạy ngay (không có bước xác nhận trung gian).
- Ở chế độ Full Test, người dùng có thể chuyển qua lại giữa 2 tab Task 1 / Task 2 trong cùng một đồng hồ đếm ngược 60 phút — giống bài thi thật.
- Hết giờ → bài tự động được nộp. Người dùng cũng có thể bấm "Nộp bài" bất cứ lúc nào.
- Khi nộp bài, frontend gọi `/api/grade` (backend), backend gọi Claude API để chấm theo đúng 4 tiêu chí chính thức (Task Achievement/Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy — mỗi tiêu chí 25%), trả về band điểm + giải thích cụ thể cho từng tiêu chí, điểm mạnh/yếu, gợi ý cải thiện, và danh sách lỗi có trích dẫn nguyên văn để highlight.
- Band điểm tổng của mỗi bài và điểm Writing tổng của Mock Test được server tự tính (không tin vào phép tính của AI) — xem chi tiết thuật toán bên dưới.
- Màn điểm số có nút **"Xem chi tiết"** → mở màn hiển thị lại bài làm với các lỗi được tô màu theo từng tiêu chí (vàng = Task, xanh dương = Coherence, tím = Lexical, cam = Grammar, xanh lá = điểm hay), kèm thẻ giải thích vì sao sai và gợi ý sửa — bấm vào chỗ tô màu sẽ nhảy tới thẻ giải thích tương ứng và ngược lại.

### Hệ thống chấm điểm được xây dựng dựa trên

- Bộ **Writing Band Descriptors** chính thức của IELTS (bản cập nhật 05/2023), được tách riêng thành **điều kiện tích cực (positive)** và **điều kiện tiêu cực/giới hạn (negative — in đậm trong tài liệu gốc)** cho từng band 2-9, trên cả 4 tiêu chí (`server/server.js`, các hằng số `TASK1_TA_BANDS`, `TASK2_TR_BANDS`, `SHARED_CC_BANDS`, `SHARED_LR_BANDS`, `SHARED_GRA_BANDS`).
- Quy trình sửa bài thực tế theo 3 bước trước khi chấm: (1) quét ý tưởng/số từ — Task 1 kiểm tra mở bài có paraphrase + năm/đơn vị, overview có xu hướng + số liệu lớn/nhỏ nhất; Task 2 kiểm tra mở bài có 2 ý chính, thân bài có lập luận liên kết, kết luận không thêm ý mới; (2) quét lỗi ngữ pháp; (3) quét từ vựng/chính tả.
- Nguyên tắc phản hồi: luôn khen điểm hay song song với sửa lỗi, hiệu chỉnh gợi ý theo đúng trình độ hiện tại của học viên, và cân nhắc việc 4 tiêu chí ảnh hưởng lẫn nhau khi chấm.

### Thuật toán chấm điểm từng cấu phần (Task Achievement/Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy)

Với mỗi cấu phần, AI được yêu cầu áp dụng đúng quy trình sau (mô tả trong `SCORING_ALGORITHM` ở `server/server.js`):

1. Từ band 9 trở xuống, tìm band **cao nhất** mà bài viết thoả mãn **toàn bộ điều kiện tích cực** — gọi là "band trần" (ceiling band).
2. Quét **tất cả** các band thấp hơn band trần (không chỉ band liền kề) để tìm xem bài viết có vướng **điều kiện tiêu cực** nào không.
3. Nếu vướng ≥ 1 điều kiện tiêu cực ở một hoặc nhiều band bên dưới → điểm cấu phần = band **thấp nhất** trong số các band có điều kiện tiêu cực bị vướng (đúng theo VD2 trong yêu cầu: vướng tiêu cực ở band 5 và band 4 → lấy band 4).
4. Nếu không vướng điều kiện tiêu cực nào → điểm cấu phần = band trần.
5. **Mỗi cấu phần luôn là số nguyên** (4, 5, 6, 7, 8...), không có số thập phân — server tự làm tròn về số nguyên gần nhất (`clampBandInteger`) để đảm bảo điều này ngay cả khi AI trả về sai định dạng.

### Thuật toán tính điểm tổng

- **Điểm tổng của 1 bài** (Task 1 hoặc Task 2 riêng lẻ) = trung bình cộng của 4 cấu phần (đều là số nguyên), sau đó áp dụng quy tắc làm tròn **xuống** đặc biệt (`floorToHalfBand`): phần dư `.25` → bỏ xuống `.0`; phần dư `.75` → bỏ xuống `.5` (ví dụ: 5.25 → 5, 5.75 → 5.5). Quy tắc này **ngược với** cách làm tròn thông thường của IELTS (vốn làm tròn lên) — áp dụng đúng theo yêu cầu.
- **Điểm Writing tổng của Mock Test** (gộp Task 1 + Task 2) vẫn dùng công thức trọng số gấp đôi cho Task 2 — `(Task1 + Task2×2) / 3` — và làm tròn theo quy ước IELTS chính thức (làm tròn **lên**: .25 → lên nửa band, .75 → lên nguyên band), vì đây là phép gộp khác (chia cho 3, không phải chia cho 4) và yêu cầu không đề cập thay đổi công thức này.

### Kiểm thử

Bộ test tự động (`node_test`/`child_process`, không cần API key thật) kiểm tra toàn bộ phần tính toán tất định: `floorToHalfBand`, `roundIELTS`, `clampBandInteger`, `countWords`, lọc annotation theo trích dẫn nguyên văn, và các luồng lỗi (thiếu API key, lỗi từ Anthropic, JSON không hợp lệ, bài nộp rỗng) bằng cách giả lập `fetch`. Phần suy luận chấm điểm thực tế (AI đọc bài và áp dụng thuật toán) chỉ kiểm chứng được đầy đủ khi có `ANTHROPIC_API_KEY` thật.

## Thêm đề bài mới

Sửa file `js/questions.js`:
- `TASK1_QUESTIONS`: thêm object mới với `instruction` và hàm `render()` (dùng các hàm dựng sẵn trong `js/charts.js`: `groupedBarChart`, `multiLineChart`, `pieChartPair`, `dataTable`, `processFlow`).
- `TASK2_QUESTIONS`: thêm object mới với `type` và `instruction`.

Mỗi lần bắt đầu làm bài, hệ thống chọn ngẫu nhiên 1 đề trong ngân hàng đề tương ứng.

## Lưu ý triển khai thật

- Không commit file `.env` (đã có trong `.gitignore`).
- Nếu deploy production, nên giới hạn rate limit cho `/api/grade` để tránh bị lạm dụng API key.
