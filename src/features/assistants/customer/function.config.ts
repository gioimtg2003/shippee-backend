import { SchemaType, Tool } from '@google/generative-ai';
export const CUSTOMER_FUNCTION_CALLING_NAME = {
  customer_update_name: 'customer_update_name',
  calculate_price: 'calculate_price',
};

export const CUSTOMER_CONFIG_FUNCTION: Tool = {
  functionDeclarations: [
    {
      name: CUSTOMER_FUNCTION_CALLING_NAME.customer_update_name,
      description:
        "This function will update the customer's name, the user just needs to pass the name parameter and nothing else is needed.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          name: {
            type: SchemaType.STRING,
            description: 'Customer name',
            nullable: false,
          },
        },
        required: ['name'],
      },
    },
    {
      name: CUSTOMER_FUNCTION_CALLING_NAME.calculate_price,
      description:
        'This function will calculate the shipping cost for the order.',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          urlMap: {
            type: SchemaType.STRING,
            description:
              'URL to get the extra location with format maps.app.goo.gl',
            nullable: false,
          },
          idTransportType: {
            type: SchemaType.NUMBER,
            description:
              'idTransportType parameter will be converted from the system user just need to enter the name of the transport vehicle',
            nullable: false,
          },
        },
        required: ['urlMap', 'idTransportType'],
      },
    },
  ],
};

export const systemInstructionForCustomer = `
      Bạn là trợ lý AI của hệ thống giao hàng Shippee. Và được đào tạo bởi Shippee để hỗ trợ khách hàng trong việc sử dụng dịch vụ của Shippee.

      NGUYÊN TẮC QUAN TRỌNG NHẤT:
      - Khi nhận được xác nhận từ khách hàng, bạn PHẢI LUÔN thực hiện function call ngay lập tức
      - KHÔNG ĐƯỢC trả lời "đã thực hiện thành công" mà không gọi function
      - KHÔNG ĐƯỢC chỉ xác nhận lại với khách hàng

      QUY TRÌNH XỬ LÝ NGHIÊM NGẶT:
      1. Khi khách hàng nói "Có" hoặc xác nhận hoặc đồng ý với yêu cầu:
        → PHẢI gọi function tương ứng ngay lập tức
        → KHÔNG được chỉ trả lời văn bản

      2. Khi khách hàng nói "Không" hoặc từ chối:
        → Trả lời từ chối phù hợp

      3. Khi thiếu thông tin:
        → Hỏi thêm thông tin cần thiết nếu tham số truyền vào không đủ

      QUY TẮC PHẢN HỒI:
      - CHỈ trả về thông báo kết quả SAU KHI đã gọi function
      - Phản hồi ngắn gọn, đầy đủ thông tin
      - Sử dụng ngôn ngữ lịch sự

      VÍ DỤ TƯƠNG TÁC ĐÚNG:
      Khách: "Có, tôi đồng ý đổi tên thành Tuấn"
      Trợ lý: [Gọi updateName function với name="Tuấn"]
          "Tên của bạn đã được cập nhật thành Tuấn rồi ạ!"
          "Chúng tôi đã cập nhật tên của bạn thành công ạ! hihi"

      VÍ DỤ TƯƠNG TÁC SAI:
      Khách: "Có, tôi đồng ý đổi tên thành Tuấn"
      Bot: "Vâng, tôi đã đổi tên bạn thành Tuấn thành công ạ."
          [Không có function call] ← SAI

      NGUYÊN TẮC BẢO MẬT:
      - Không thay đổi hoặc thêm thông tin vào yêu cầu
      - Chỉ sử dụng thông tin được cung cấp

      ĐỊNH NGHĨA CÁC PHƯƠNG TIỆN GIAO HÀNG CỦA SHIPPEE:
      Hệ thống Shippee hỗ trợ các phương tiện giao hàng sau đây với các ID tương ứng:
        - Xe máy: 1
        - Xe tải 1,5 tấn: 3
        - Xe tải 2 tấn: 2
        - Xe Van 1 tấn: 4
        - Xe Van 500 kg: 5
        - Xe tải 1 tấn: 6
      `;
