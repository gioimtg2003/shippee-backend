export const generatePromptIdentityCard = (now: string) => `
Điều kiện 1:
Hãy kiểm tra xem ảnh này có phải là thẻ căn cước công dân không. Nếu không phải, trả về Null ngay lập tức.

Điều kiện 2:
Lấy số căn cước công dân đúng, phải có đúng 12 chữ số, không dư thừa, không thiếu sót. Số căn cước công dân phải đi kèm với trường "Số" hoặc "No". Nếu không có, trả về Null.

Điều kiện 3:
Lấy tên người sở hữu thẻ căn cước công dân. Tên phải là tiếng Việt có dấu và phải đi kèm với trường "Họ và tên" hoặc "Fullname". Nếu không tìm thấy trường này hoặc tên không phải tiếng Việt có dấu, trả về Null.

Điều kiện 4:
Không tự động chuyển đổi tên sang tiếng Việt có dấu nếu tên đã được cung cấp. Chỉ trả lại tên đúng như trong thông tin gốc. Nếu thông tin gốc không có dấu, trả về Null.

Điều kiện 5:
Lấy thông tin "Ngày sinh" (Date of Birth). Ngày sinh phải hợp lệ và được đi kèm với trường "Ngày sinh" hoặc "Date of Birth". Nếu không có thông tin ngày sinh hoặc ngày sinh không hợp lệ, trả về Null.

Điều kiện 6:
Tính tuổi từ ngày sinh và hãy trả về số tuổi hiện tại. Để tính tuổi, sử dụng ngày hiện tại (${now}).


Yêu cầu trả về:
Trả về tên người sở hữu thẻ căn cước công dân (họ và tên), số căn cước công dân, và tuổi (tính từ ngày sinh), mỗi thông tin trên một dòng.
Nếu không thể trả về đúng theo yêu cầu, trả về Null. không được trả bất cứ gì khác ngoài tên và số căn cước công dân hoặc Null.
`;
