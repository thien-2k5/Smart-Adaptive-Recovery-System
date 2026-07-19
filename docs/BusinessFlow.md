# Business Flow

## Overview

This document describes the complete business flows of the Smart Adaptive Recovery System (SARS), from shipment creation through abnormal detection to recovery resolution.

---

## Main Business Flow

```mermaid
flowchart TD
    A["Customer visits Landing Page"] --> B["Click 'Create Demo Shipment'"]
    B --> C["Fill shipment form"]
    C --> D{"All fields valid?"}
    D -->|No| C
    D -->|Yes| E["System generates Tracking ID"]
    E --> F["Redirect to My Shipment"]
    F --> G["Simulation begins"]
    G --> H["Shipment progresses through stages"]
    H --> I{"Abnormal delay\ndetected?"}
    I -->|"Not yet"| H
    I -->|"Yes"| J["Full-screen alert modal"]
    J --> K["Recovery Case auto-created"]
    K --> L["Customer clicks 'View Recovery Center'"]
    L --> M["Recovery Center page loads"]
    M --> N["Investigation timeline displayed"]
    N --> O{"Customer selects\nrecovery option"}
    O -->|"Continue Investigation"| P["Wait for resolution"]
    O -->|"Refund"| Q["Process compensation"]
    O -->|"Replacement"| R{"Stock available?"}
    R -->|Yes| S["Create replacement shipment"]
    R -->|No| Q
    P --> T{"Investigation result"}
    T -->|"Parcel Found"| U["Resume priority delivery"]
    T -->|"Confirmed Lost"| Q
    Q --> V["Calculate compensation"]
    V --> W["Apply compensation + customer care"]
    W --> X["Close recovery case"]
    U --> X
    S --> X
```

---

## Flow 1: Shipment Creation

```mermaid
sequenceDiagram
    actor Customer
    participant Frontend
    participant Backend
    participant DB as PostgreSQL

    Customer->>Frontend: Click "Create Demo Shipment"
    Frontend->>Frontend: Display shipment form
    Customer->>Frontend: Fill in details
    Note over Customer,Frontend: Sender info, Receiver info,<br/>Customer Type, Parcel Category,<br/>Insurance Status

    Customer->>Frontend: Click "Create Demo Shipment"
    Frontend->>Frontend: Validate form fields
    Frontend->>Backend: POST /api/shipments
    Backend->>Backend: Generate Tracking ID (VTPxxxxxxxxx)
    Backend->>Backend: Determine Recovery Mode from Parcel Category
    Backend->>Backend: Calculate estimated delivery
    Backend->>Backend: Randomly select delay stage index
    Backend->>DB: INSERT into customers
    Backend->>DB: INSERT into shipments
    Backend->>DB: INSERT into tracking_history (CREATED)
    Backend->>DB: INSERT into audit_logs
    Backend-->>Frontend: 201 Created (ShipmentResponse)
    Frontend->>Frontend: Redirect to /my-shipment/{trackingId}
    Frontend->>Frontend: Start simulation polling
```

---

## Flow 2: Shipment Simulation

```mermaid
sequenceDiagram
    participant Scheduler as SimulationScheduler
    participant Service as SimulationService
    participant DB as PostgreSQL
    participant SSE as SSE Emitter

    loop Every N seconds
        Scheduler->>Service: processActiveSimulations()
        Service->>DB: SELECT shipments WHERE simulation_active = true
        loop Each active shipment
            Service->>Service: Check if at delay_stage_index
            alt Not at delay stage yet
                Service->>Service: Advance to next status
                Service->>DB: INSERT tracking_history
                Service->>DB: UPDATE shipment current_status
            else At delay stage - STOP
                Service->>Service: Shipment stalls
                Service->>Service: Wait for threshold to be exceeded
            end
        end
    end

    Note over Service: When delay exceeds threshold...
    Service->>Service: triggerAbnormalDelay()
    Service->>DB: INSERT abnormal_events
    Service->>DB: UPDATE shipment status = ABNORMAL_DELAY_DETECTED
    Service->>DB: UPDATE shipment simulation_active = false
    Service->>Service: createRecoveryCase()
    Service->>DB: INSERT recovery_cases
    Service->>DB: INSERT notifications
    Service->>SSE: Push DELAY_DETECTED event
```

### Shipment Status Progression

```mermaid
stateDiagram-v2
    [*] --> CREATED
    CREATED --> CONFIRMED: ~5s
    CONFIRMED --> PREPARING: ~5s
    PREPARING --> IN_TRANSIT_TO_HUB: ~5s
    IN_TRANSIT_TO_HUB --> AT_SORTING_HUB: ~5s
    AT_SORTING_HUB --> OUT_FOR_DELIVERY: ~5s
    OUT_FOR_DELIVERY --> DELIVERED: ~5s

    IN_TRANSIT_TO_HUB --> ABNORMAL_DELAY_DETECTED: Delay detected
    AT_SORTING_HUB --> ABNORMAL_DELAY_DETECTED: Delay detected

    note right of ABNORMAL_DELAY_DETECTED
        Shipment stops here.
        Recovery Case is created.
        No further progression.
    end note
```

---

## Flow 3: Abnormal Delay Detection

```mermaid
flowchart TD
    A["Shipment stalls at stage"] --> B{"Time since last update\n> threshold?"}
    B -->|"No (< 2 min demo)"| A
    B -->|"Yes (≥ 2 min demo)"| C["Create AbnormalEvent"]
    C --> D["Update shipment status\nto ABNORMAL_DELAY_DETECTED"]
    D --> E["Stop simulation"]
    E --> F["Create RecoveryCase"]
    F --> G["Determine Recovery Mode"]
    G --> H["Send SSE notification"]
    H --> I["Store notification in DB"]
    I --> J["Frontend displays\nfull-screen alert modal"]
    J --> K["Notification badge updated"]
```

---

## Flow 4: Recovery Process

```mermaid
flowchart TD
    A["Recovery Case Created"] --> B["Determine Recovery Mode"]
    B --> C{"Customer Type?"}

    C -->|"Online Shopper"| D["Fast Resolution Mode"]
    D --> D1["Show real-time timeline"]
    D --> D2["Show estimated resolution (7h)"]
    D --> D3["Allow immediate option selection"]
    D3 --> D31["Continue Investigation"]
    D3 --> D32["Refund"]
    D3 --> D33["Replacement (if available)"]

    C -->|"Online Merchant"| E["Merchant Recovery Dashboard"]
    E --> E1["Show delay reason"]
    E --> E2["Provide customer response templates"]
    E --> E3["Priority investigation"]
    E --> E4["Auto shipping fee compensation"]
    E --> E5["Delayed order report"]

    C -->|"Individual Sender"| F["Critical Parcel Recovery"]
    F --> F1["Dedicated case manager"]
    F --> F2["Priority warehouse investigation"]
    F --> F3["Updates every 2-4 hours"]
    F --> F4["Manager escalation if unresolved"]
    F --> F5["Official confirmation if lost"]

    D31 --> G["Investigation continues"]
    D32 --> H["Calculate compensation"]
    D33 --> I{"Stock check"}
    I -->|"Available"| J["Create replacement shipment"]
    I -->|"Unavailable"| H

    G --> K{"Resolution"}
    K -->|"Parcel Found"| L["Resume priority delivery"]
    K -->|"Confirmed Lost"| H

    H --> M{"Has Insurance?"}
    M -->|"Yes"| N["100% declared value"]
    M -->|"No"| O["4× shipping fee"]

    N --> P["Apply customer care"]
    O --> P
    L --> P
    J --> P

    P --> Q["Close recovery case"]
```

---

## Flow 5: Investigation Timeline

The investigation progresses through these stages automatically:

```mermaid
gantt
    title Investigation Timeline Progression
    dateFormat HH:mm
    section Investigation Steps
    Recovery Case Created           :done, a1, 00:00, 1min
    Warehouse Manager Notified      :done, a2, after a1, 2min
    Scanning Records Checked        :active, a3, after a2, 3min
    Storage Location Verified       :a4, after a3, 3min
    CCTV Review (if needed)         :a5, after a4, 5min
    Staff Handling History Reviewed  :a6, after a5, 3min
    Transportation Records Reviewed :a7, after a6, 3min
    Investigation Result            :milestone, after a7, 0min
```

---

## Flow 6: Compensation

```mermaid
flowchart TD
    A["Parcel Confirmed Lost"] --> B{"Has Insurance?"}

    B -->|"Yes"| C["100% Declared Value"]
    C --> C1["Max: 100,000,000 VND"]
    C --> C2["COD: 100% collection amount"]
    C2 --> C3["Max COD: 30,000,000 VND"]

    B -->|"No"| D["4× Shipping Fee"]
    D --> D1["Domestic shipments only"]

    C1 --> E["Process Compensation"]
    C3 --> E
    D1 --> E

    E --> F["Additional Customer Care"]
    F --> F1["Free Shipping Voucher"]
    F --> F2["Loyalty Points"]
    F --> F3["Delivery Coupon"]

    F1 --> G["Notify Customer"]
    F2 --> G
    F3 --> G
```

### No Compensation Applies When:
- Damage caused by the sender
- Cannot prove shipment or damage
- Parcel delivered successfully without complaints
- Parcel confiscated or destroyed by law
- Complaint procedures not followed
- Force majeure events

---

## Flow 7: Customer Journey (End-to-End)

```mermaid
journey
    title Customer Journey — Online Shopper
    section Create Shipment
      Visit Landing Page: 5: Customer
      Click "Create Demo": 5: Customer
      Fill form details: 3: Customer
      Submit shipment: 5: Customer
    section Track Shipment
      View shipment timeline: 5: Customer
      Watch status updates: 4: Customer
      See stages progressing: 4: Customer
    section Abnormal Detection
      Full-screen alert appears: 2: Customer, System
      View recovery case ID: 3: Customer
      Click "View Recovery Center": 4: Customer
    section Recovery
      View investigation timeline: 4: Customer
      See estimated resolution: 4: Customer
      Select recovery option: 5: Customer
    section Resolution
      Receive compensation: 5: Customer, System
      Get customer care benefits: 5: Customer, System
      Case closed: 5: Customer, System
```
