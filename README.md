src/
├── delivery/
│ ├── steps/ # Các bước riêng biệt trong flow
│ │ ├── available-driver/
│ │ │ ├── available-driver.service.ts
│ │ │ ├── available-driver.dto.ts
│ │ │ └── available-driver.module.ts
│ │ ├── pending-order/
│ │ │ ├── pending-order.service.ts
│ │ │ ├── pending-order.dto.ts
│ │ │ └── pending-order.module.ts
│ │ ├── constraint-check/
│ │ │ ├── constraint-check.service.ts
│ │ │ ├── constraint-check.types.ts
│ │ │ └── constraint-check.module.ts
│ │ ├── matching/
│ │ │ ├── matching.service.ts
│ │ │ ├── hungarian.ts # Thuật toán Hungarian
│ │ │ ├── matching.types.ts
│ │ │ └── matching.module.ts
│ │ ├── routing/
│ │ │ ├── routing.service.ts
│ │ │ ├── vrp-genetic.ts # Giải thuật VRP
│ │ │ └── routing.module.ts
│ │ └── assign/
│ │ ├── assign.service.ts
│ │ └── assign.module.ts
│
│ ├── delivery.service.ts # Orchestrator chạy từng bước
│ ├── delivery.controller.ts # API endpoint
│ └── delivery.module.ts
│
├── flow/ # Phục vụ visualize flow (real-time UI)
│ ├── flow-state.service.ts # Quản lý trạng thái từng bước
│ ├── flow-gateway.ts # WebSocket đẩy event tới UI
│ └── flow.module.ts
│
├── shared/ # Chia sẻ logic / types dùng chung
│ ├── utils/
│ ├── constants/
│ └── types/
