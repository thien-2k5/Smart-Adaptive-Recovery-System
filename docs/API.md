# REST API Documentation

## Base URL

```
Development:  http://localhost:8080/api
Production:   http://<server-ip>/api
```

## Authentication

Admin endpoints require session-based authentication via Spring Security.
Customer-facing endpoints are public (demo mode).

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-07-19T15:00:00Z"
}
```

Error response:
```json
{
  "success": false,
  "data": null,
  "message": "Shipment not found",
  "errorCode": "SHIPMENT_NOT_FOUND",
  "timestamp": "2024-07-19T15:00:00Z"
}
```

---

## 1. Shipment API

### POST `/api/shipments`

Create a new demo shipment.

**Request Body:**
```json
{
  "senderName": "Nguyễn Văn A",
  "senderPhone": "0901234567",
  "receiverName": "Trần Thị B",
  "receiverPhone": "0909876543",
  "customerType": "ONLINE_SHOPPER",
  "parcelCategory": "COMMERCIAL_GOODS",
  "insuranceStatus": "INSURED",
  "declaredValue": 2500000,
  "shippingFee": 35000
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "trackingId": "VTP240719A1B2C",
    "senderName": "Nguyễn Văn A",
    "senderPhone": "0901234567",
    "receiverName": "Trần Thị B",
    "receiverPhone": "0909876543",
    "customerType": "ONLINE_SHOPPER",
    "parcelCategory": "COMMERCIAL_GOODS",
    "insuranceStatus": "INSURED",
    "currentStatus": "CREATED",
    "recoveryMode": "FAST_REPLACEMENT_REFUND",
    "declaredValue": 2500000,
    "shippingFee": 35000,
    "estimatedDelivery": "2024-07-21T12:00:00Z",
    "simulationActive": true,
    "createdAt": "2024-07-19T15:00:00Z"
  }
}
```

---

### GET `/api/shipments/{trackingId}`

Get shipment details by tracking ID.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "trackingId": "VTP240719A1B2C",
    "customerType": "ONLINE_SHOPPER",
    "parcelCategory": "COMMERCIAL_GOODS",
    "insuranceStatus": "INSURED",
    "currentStatus": "AT_SORTING_HUB",
    "recoveryMode": "FAST_REPLACEMENT_REFUND",
    "estimatedDelivery": "2024-07-21T12:00:00Z",
    "timeline": [
      {
        "status": "CREATED",
        "location": "Hà Nội",
        "description": "Đơn hàng đã được tạo",
        "isCurrent": false,
        "occurredAt": "2024-07-19T15:00:00Z"
      },
      {
        "status": "CONFIRMED",
        "location": "Hà Nội",
        "description": "Đơn hàng đã được xác nhận",
        "isCurrent": false,
        "occurredAt": "2024-07-19T15:00:05Z"
      },
      {
        "status": "AT_SORTING_HUB",
        "location": "Bưu cục Cầu Giấy",
        "description": "Đã đến bưu cục phân loại",
        "isCurrent": true,
        "occurredAt": "2024-07-19T15:00:15Z"
      }
    ],
    "createdAt": "2024-07-19T15:00:00Z"
  }
}
```

---

### GET `/api/shipments/customer/{customerId}`

Get all shipments for a customer.

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | int | No | Page number (default: 0) |
| `size` | int | No | Page size (default: 10) |
| `status` | string | No | Filter by status |

**Response:** `200 OK` — Paginated list of shipments

---

## 2. Tracking API

### GET `/api/tracking/{trackingId}`

Get real-time tracking timeline.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "trackingId": "VTP240719A1B2C",
    "currentStatus": "ABNORMAL_DELAY_DETECTED",
    "timeline": [ ... ],
    "abnormalEvent": {
      "eventType": "ABNORMAL_DELAY",
      "detectedAtStatus": "AT_SORTING_HUB",
      "delayMinutes": 3,
      "detectedAt": "2024-07-19T15:00:30Z"
    },
    "recoveryCase": {
      "caseId": "RC240719X1Y2Z",
      "investigationStatus": "IN_PROGRESS",
      "recoveryMode": "FAST_REPLACEMENT_REFUND"
    }
  }
}
```

---

## 3. Recovery API

### GET `/api/recovery/{caseId}`

Get recovery case details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "caseId": "RC240719X1Y2Z",
    "trackingId": "VTP240719A1B2C",
    "customerType": "ONLINE_SHOPPER",
    "parcelCategory": "COMMERCIAL_GOODS",
    "insuranceStatus": "INSURED",
    "recoveryMode": "FAST_REPLACEMENT_REFUND",
    "investigationStatus": "IN_PROGRESS",
    "estimatedResolutionHours": 7,
    "nextUpdateAt": "2024-07-19T17:00:00Z",
    "selectedOption": null,
    "investigationTimeline": [
      {
        "step": "CASE_CREATED",
        "title": "Recovery Case Created",
        "description": "System automatically created recovery case",
        "completedAt": "2024-07-19T15:00:30Z",
        "isCompleted": true
      },
      {
        "step": "WAREHOUSE_NOTIFIED",
        "title": "Warehouse Manager Notified",
        "description": "Warehouse team has been alerted",
        "completedAt": "2024-07-19T15:01:00Z",
        "isCompleted": true
      },
      {
        "step": "SCANNING_RECORDS",
        "title": "Scanning Records Checked",
        "description": "Reviewing parcel scanning history",
        "completedAt": null,
        "isCompleted": false
      }
    ],
    "notifications": [ ... ],
    "availableOptions": ["CONTINUE_INVESTIGATION", "REFUND", "REPLACEMENT"],
    "createdAt": "2024-07-19T15:00:30Z"
  }
}
```

---

### POST `/api/recovery/{caseId}/action`

Submit a customer action on a recovery case.

**Request Body:**
```json
{
  "actionType": "SELECT_REFUND",
  "details": "Customer chose refund option"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "caseId": "RC240719X1Y2Z",
    "selectedOption": "REFUND",
    "investigationStatus": "IN_PROGRESS",
    "compensation": {
      "type": "FULL_VALUE",
      "amount": 2500000,
      "currency": "VND",
      "status": "PENDING"
    }
  }
}
```

---

### GET `/api/recovery/{caseId}/options`

Get available recovery options based on customer type, parcel category, and insurance.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "options": [
      {
        "type": "CONTINUE_INVESTIGATION",
        "label": "Continue Investigation",
        "description": "Wait for investigation to complete",
        "available": true
      },
      {
        "type": "REFUND",
        "label": "Refund",
        "description": "Request a full refund",
        "available": true,
        "compensation": {
          "type": "FULL_VALUE",
          "amount": 2500000,
          "currency": "VND"
        }
      },
      {
        "type": "REPLACEMENT",
        "label": "Replacement",
        "description": "Request a replacement shipment",
        "available": true,
        "note": "Only available for Online Shoppers"
      }
    ]
  }
}
```

---

## 4. Notification API

### GET `/api/notifications/stream/{customerId}`

SSE (Server-Sent Events) endpoint for real-time notifications.

**Response:** `text/event-stream`
```
event: DELAY_DETECTED
data: {"caseId":"RC240719X1Y2Z","title":"Abnormal Delay Detected","message":"Your parcel has remained at the current logistics stage longer than expected.","createdAt":"2024-07-19T15:00:30Z"}

event: INVESTIGATION_UPDATE
data: {"caseId":"RC240719X1Y2Z","title":"Investigation Progress","message":"Scanning records have been checked.","createdAt":"2024-07-19T15:02:00Z"}
```

---

### GET `/api/notifications/{customerId}`

Get notification history.

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | int | No | Page number (default: 0) |
| `size` | int | No | Page size (default: 20) |
| `unreadOnly` | boolean | No | Filter unread only |

**Response:** `200 OK` — Paginated list of notifications

---

### PATCH `/api/notifications/{notificationId}/read`

Mark a notification as read.

**Response:** `200 OK`

---

## 5. Help Center API

### GET `/api/help-center/articles`

Get all published help center articles.

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `category` | string | No | Filter by category: `FAQ`, `POLICY`, `GUIDE` |
| `lang` | string | No | Language: `vi` or `en` (default: `vi`) |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "compensation-policy",
      "category": "POLICY",
      "title": "Chính sách bồi thường",
      "content": "...",
      "sortOrder": 1
    }
  ]
}
```

---

### GET `/api/help-center/articles/{slug}`

Get a single article by slug.

---

## 6. Admin API

All admin endpoints require authentication with `ADMIN` role.

### GET `/api/admin/dashboard/stats`

Get dashboard statistics.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalShipments": 156,
    "activeShipments": 23,
    "abnormalEvents": 12,
    "recoveryCases": {
      "total": 12,
      "inProgress": 5,
      "resolved": 7
    },
    "customerStats": {
      "totalCustomers": 45,
      "onlineShoppers": 20,
      "onlineMerchants": 15,
      "individualSenders": 10
    },
    "notificationsSent": 89,
    "compensationTotal": 15000000
  }
}
```

---

### GET `/api/admin/shipments`

Get all shipments with filtering.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number |
| `size` | int | Page size |
| `status` | string | Filter by status |
| `customerType` | string | Filter by customer type |
| `search` | string | Search by tracking ID or customer name |
| `dateFrom` | string | Start date filter |
| `dateTo` | string | End date filter |

---

### GET `/api/admin/recovery-cases`

Get all recovery cases with filtering.

**Query Parameters:** Same pattern as shipments, plus:
| Param | Type | Description |
|-------|------|-------------|
| `investigationStatus` | string | Filter by investigation status |
| `recoveryMode` | string | Filter by recovery mode |

---

### GET `/api/admin/notifications`

Get all notifications with filtering.

---

### GET `/api/admin/audit-logs`

Get audit log entries.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `entityType` | string | Filter by entity type |
| `action` | string | Filter by action |
| `dateFrom` | string | Start date |
| `dateTo` | string | End date |

---

## 7. Customer API

### POST `/api/customers`

Create or get existing customer (upsert by phone).

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0901234567",
  "customerType": "ONLINE_SHOPPER"
}
```

---

## 8. Simulation API (Internal / Admin)

### POST `/api/admin/simulation/trigger-delay/{trackingId}`

Manually trigger an abnormal delay for a specific shipment (admin/testing).

### POST `/api/admin/simulation/resolve/{caseId}`

Manually resolve a recovery case (admin/testing).

**Request Body:**
```json
{
  "resolutionType": "PARCEL_FOUND"
}
```

---

## HTTP Status Codes

| Code | Usage |
|------|-------|
| `200 OK` | Successful GET, PATCH |
| `201 Created` | Successful POST |
| `400 Bad Request` | Validation errors |
| `401 Unauthorized` | Authentication required |
| `403 Forbidden` | Insufficient permissions |
| `404 Not Found` | Resource not found |
| `500 Internal Server Error` | Server error |
