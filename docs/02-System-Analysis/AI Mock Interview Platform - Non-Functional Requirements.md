> [!abstract]  
> Non-Functional Requirements mô tả các tiêu chuẩn chất lượng mà hệ thống phải đáp ứng nhằm đảm bảo độ tin cậy, khả năng sử dụng, bảo mật và trải nghiệm người dùng.

---

# NFR-01 Usability

> [!info]  
> Hệ thống phải dễ sử dụng đối với sinh viên, thực tập sinh và lập trình viên mới đi làm.

### Yêu Cầu

```text
- Giao diện trực quan và dễ sử dụng.
- Luồng thao tác rõ ràng.
- Candidate có thể tạo Interview mà không cần hướng dẫn.
- Candidate có thể dễ dàng truy cập lịch sử phỏng vấn và báo cáo.
```

---

# NFR-02 Interview Quality

> [!success]  
> Hệ thống phải tạo ra trải nghiệm phỏng vấn có giá trị thực tiễn.

### Yêu Cầu

```text
- Câu hỏi phải phù hợp với vị trí ứng tuyển.
- Câu hỏi phải phù hợp với trình độ ứng viên.
- Câu hỏi phải phù hợp với công nghệ được lựa chọn.
- Bộ câu hỏi phải có tính đa dạng.
- Hạn chế lặp lại câu hỏi giữa các phiên phỏng vấn.
```

---

# NFR-03 AI Evaluation Quality

> [!success]  
> Hệ thống phải cung cấp kết quả đánh giá có giá trị tham khảo thực tế.

### Yêu Cầu

```text
- AI phải đưa ra điểm số rõ ràng.
- AI phải giải thích lý do của điểm số.
- AI phải chỉ ra điểm mạnh.
- AI phải chỉ ra điểm yếu.
- AI phải đề xuất hướng cải thiện cụ thể.
```

---

# NFR-04 Learning Support

> [!tip]  
> Hệ thống phải hỗ trợ Candidate cải thiện năng lực theo thời gian.

### Yêu Cầu

```text
- Lưu lịch sử phỏng vấn.
- Lưu lịch sử CV Review.
- Theo dõi sự tiến bộ của Candidate.
- Hiển thị các kỹ năng cần cải thiện.
- Đề xuất lộ trình học tập phù hợp.
```

---

# NFR-05 Job Information Quality

> [!info]  
> Hệ thống phải cung cấp thông tin tuyển dụng có giá trị.

### Yêu Cầu

```text
- Hiển thị việc làm mới nhất.
- Hạn chế hiển thị việc làm đã hết hạn.
- Hỗ trợ phân loại việc làm theo vị trí.
- Hỗ trợ phân loại việc làm theo công nghệ.
- Hỗ trợ tìm kiếm việc làm nhanh chóng.
```

---

# NFR-06 Security & Privacy

> [!warning]  
> Hệ thống phải bảo vệ dữ liệu cá nhân của Candidate.

### Yêu Cầu

```text
- Chỉ chủ sở hữu được truy cập dữ liệu cá nhân.
- CV và lịch sử phỏng vấn phải được bảo mật.
- Thông tin đăng nhập phải được bảo vệ.
- Chỉ Platform Manager được truy cập chức năng quản trị.
```

---

# NFR-07 Reliability

> [!info]  
> Hệ thống phải hoạt động ổn định và đáng tin cậy.

### Yêu Cầu

```text
- Dữ liệu phỏng vấn không bị mất khi người dùng thoát hệ thống.
- Báo cáo đánh giá phải được lưu trữ lâu dài.
- CV đã tạo phải có thể truy cập lại trong tương lai.
- Dữ liệu người dùng phải được sao lưu định kỳ.
```