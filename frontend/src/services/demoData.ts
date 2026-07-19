export interface DemoShipment {
  id: number;
  trackingId: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  customerType: string;
  parcelCategory: string;
  insuranceStatus: string;
  currentStatus: string;
  recoveryMode: string;
  declaredValue: number;
  shippingFee: number;
  estimatedDelivery: string;
  simulationActive: boolean;
  createdAt: string;
}

export interface DemoTimelineItem {
  status: string;
  location: string;
  description: string;
  isCurrent: boolean;
  occurredAt: string;
}

export interface DemoTrackingView {
  trackingId: string;
  currentStatus: string;
  timeline: DemoTimelineItem[];
  abnormalEvent?: {
    eventType: string;
    detectedAtStatus: string;
    delayMinutes: number;
    detectedAt: string;
  };
  recoveryCase?: {
    caseId: string;
    investigationStatus: string;
    recoveryMode: string;
  };
}

export interface DemoRecoveryCase {
  id: number;
  caseId: string;
  trackingId: string;
  customerType: string;
  parcelCategory: string;
  insuranceStatus: string;
  recoveryMode: string;
  investigationStatus: string;
  estimatedResolutionHours: number;
  nextUpdateAt: string;
  selectedOption: string | null;
  investigationTimeline: Array<{
    step: string;
    title: string;
    description: string;
    completedAt: string | null;
    isCompleted: boolean;
  }>;
  notifications: Array<{
    title: string;
    message: string;
    createdAt: string;
  }>;
  availableOptions: string[];
  createdAt: string;
}

export interface DemoHelpArticle {
  id: number;
  slug: string;
  category: string;
  title: string;
  content: string;
  sortOrder: number;
}

export interface DemoAdminStats {
  totalShipments: number;
  activeShipments: number;
  abnormalEvents: number;
  recoveryCases: {
    total: number;
    inProgress: number;
    resolved: number;
  };
  customerStats: {
    totalCustomers: number;
    onlineShoppers: number;
    onlineMerchants: number;
    individualSenders: number;
  };
  notificationsSent: number;
  compensationTotal: number;
}

const now = new Date();
const createdAt = now.toISOString();
const deliveryAt = new Date(now.getTime() + 1000 * 60 * 60 * 12).toISOString();
const nextUpdate = new Date(now.getTime() + 1000 * 60 * 60 * 3).toISOString();

export const buildDemoShipment = (overrides: Partial<DemoShipment> = {}): DemoShipment => ({
  id: 1,
  trackingId: 'VTP240719A1B2C',
  senderName: 'Nguyễn Văn A',
  senderPhone: '0901234567',
  receiverName: 'Trần Thị B',
  receiverPhone: '0909876543',
  customerType: 'ONLINE_SHOPPER',
  parcelCategory: 'COMMERCIAL_GOODS',
  insuranceStatus: 'INSURED',
  currentStatus: 'AT_SORTING_HUB',
  recoveryMode: 'FAST_REPLACEMENT_REFUND',
  declaredValue: 2500000,
  shippingFee: 35000,
  estimatedDelivery: deliveryAt,
  simulationActive: true,
  createdAt,
  ...overrides,
});

export const buildDemoTracking = (trackingId: string): DemoTrackingView => ({
  trackingId,
  currentStatus: 'ABNORMAL_DELAY_DETECTED',
  timeline: [
    {
      status: 'CREATED',
      location: 'Hà Nội',
      description: 'Đơn hàng đã được tạo',
      isCurrent: false,
      occurredAt: createdAt,
    },
    {
      status: 'CONFIRMED',
      location: 'Hà Nội',
      description: 'Đơn hàng đã được xác nhận',
      isCurrent: false,
      occurredAt: new Date(now.getTime() - 1000 * 60 * 2).toISOString(),
    },
    {
      status: 'AT_SORTING_HUB',
      location: 'Bưu cục Cầu Giấy',
      description: 'Đã đến bưu cục phân loại',
      isCurrent: false,
      occurredAt: new Date(now.getTime() - 1000 * 60).toISOString(),
    },
    {
      status: 'ABNORMAL_DELAY_DETECTED',
      location: 'Bưu cục Cầu Giấy',
      description: 'Parcel remained at the sorting hub longer than expected.',
      isCurrent: true,
      occurredAt: new Date(now.getTime() - 1000 * 30).toISOString(),
    },
  ],
  abnormalEvent: {
    eventType: 'ABNORMAL_DELAY',
    detectedAtStatus: 'AT_SORTING_HUB',
    delayMinutes: 3,
    detectedAt: new Date(now.getTime() - 1000 * 30).toISOString(),
  },
  recoveryCase: {
    caseId: 'RC240719X1Y2Z',
    investigationStatus: 'IN_PROGRESS',
    recoveryMode: 'FAST_REPLACEMENT_REFUND',
  },
});

export const buildDemoRecoveryCase = (caseId = 'RC240719X1Y2Z', trackingId = 'VTP240719A1B2C'): DemoRecoveryCase => ({
  id: 1,
  caseId,
  trackingId,
  customerType: 'ONLINE_SHOPPER',
  parcelCategory: 'COMMERCIAL_GOODS',
  insuranceStatus: 'INSURED',
  recoveryMode: 'FAST_REPLACEMENT_REFUND',
  investigationStatus: 'IN_PROGRESS',
  estimatedResolutionHours: 7,
  nextUpdateAt: nextUpdate,
  selectedOption: null,
  investigationTimeline: [
    {
      step: 'CASE_CREATED',
      title: 'Recovery case created',
      description: 'System automatically created the recovery case after detecting delay.',
      completedAt: createdAt,
      isCompleted: true,
    },
    {
      step: 'WAREHOUSE_NOTIFIED',
      title: 'Warehouse notified',
      description: 'Warehouse team has been notified and is preparing an investigation.',
      completedAt: new Date(now.getTime() - 1000 * 60 * 2).toISOString(),
      isCompleted: true,
    },
    {
      step: 'SCANNING_RECORDS',
      title: 'Scanning records checked',
      description: 'The latest scan logs are being reviewed for the missing parcel.',
      completedAt: null,
      isCompleted: false,
    },
  ],
  notifications: [
    {
      title: 'Delay detected',
      message: 'Your parcel is currently delayed at the sorting hub.',
      createdAt: new Date(now.getTime() - 1000 * 60 * 3).toISOString(),
    },
    {
      title: 'Investigation update',
      message: 'Warehouse has started scanning the parcel history.',
      createdAt: new Date(now.getTime() - 1000 * 60).toISOString(),
    },
  ],
  availableOptions: ['CONTINUE_INVESTIGATION', 'REFUND', 'REPLACEMENT'],
  createdAt,
});

export const buildDemoHelpArticles = (): DemoHelpArticle[] => [
  {
    id: 1,
    slug: 'compensation-policy',
    category: 'POLICY',
    title: 'Compensation policy',
    content: 'Customers with insured parcels can receive full refund or replacement according to the declared value.',
    sortOrder: 1,
  },
  {
    id: 2,
    slug: 'tracking-issues',
    category: 'FAQ',
    title: 'What to do when tracking is stalled?',
    content: 'If the parcel has been inactive for more than 24 hours, the system generates a recovery case automatically.',
    sortOrder: 2,
  },
  {
    id: 3,
    slug: 'recovery-options',
    category: 'GUIDE',
    title: 'How recovery options work',
    content: 'You can continue investigation, request refund, or ask for a replacement based on your shipment profile.',
    sortOrder: 3,
  },
];

export const buildDemoAdminStats = (): DemoAdminStats => ({
  totalShipments: 156,
  activeShipments: 23,
  abnormalEvents: 12,
  recoveryCases: {
    total: 12,
    inProgress: 5,
    resolved: 7,
  },
  customerStats: {
    totalCustomers: 45,
    onlineShoppers: 20,
    onlineMerchants: 15,
    individualSenders: 10,
  },
  notificationsSent: 89,
  compensationTotal: 15000000,
});
