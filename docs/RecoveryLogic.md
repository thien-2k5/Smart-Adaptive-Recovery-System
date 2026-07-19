# Adaptive Recovery Logic

## Overview
The "Smart Adaptive" part of SARS means that the system does not apply a one-size-fits-all approach to delays. The recovery mode, investigation timeline, and available customer options dynamically change based on three variables: **Customer Type**, **Parcel Category**, and **Insurance Status**.

---

## 1. Parcel Category Determines Recovery Mode

The system assigns a base **Recovery Mode** based on what is being shipped:

| Parcel Category | Recovery Mode | Characteristics |
|-----------------|---------------|-----------------|
| `COMMERCIAL_GOODS` | Fast Replacement / Refund | Focus on rapid financial resolution. |
| `PERSONAL_ITEMS` | Standard Recovery | Standard investigation process. |
| `FRAGILE` | Standard Recovery | Standard investigation process. |
| `IMPORTANT_DOCUMENTS`| Priority Recovery | Dedicated case manager, priority investigation, updates every 2-4 hours, official confirmation docs if lost. |
| `ONE_OF_A_KIND` | Intensive Search | Dedicated case manager, manager-level escalation, updates every 2-4 hours. |

---

## 2. Customer Type Determines Options & Dashboard

The UI and available actions in the Recovery Center adapt based on the Customer Type.

### Online Shopper
*Focus: Fast updates, transparency, convenient resolution.*
- **UI**: Real-time investigation timeline, live status notifications.
- **Immediate Options**:
  - `Continue Investigation`
  - `Refund`
  - `Replacement` (Checks virtual stock; creates new shipment if available).
- **Post-Resolution Care**: Free shipping voucher, loyalty points, or delivery coupon.

### Online Merchant
*Focus: Business reputation, reducing complaints.*
- **UI**: Merchant Recovery Dashboard.
- **Features**:
  - Delay reason and estimated resolution time.
  - **Suggested Customer Response Templates** (to copy/paste to their buyers).
  - Delayed order performance report.
- **Resolution**: Automatic shipping fee compensation.

### Individual Sender
*Focus: Personalized support, recovering original parcel.*
- **UI**: Critical Parcel Recovery Dashboard.
- **Features**:
  - Name and contact of **Dedicated Case Manager**.
  - Priority warehouse investigation tracking.
- **Options**: `Continue Investigation` is the primary path until resolved or confirmed lost.

---

## 3. Insurance Status Determines Compensation

If a parcel is confirmed lost (or if an Online Shopper chooses 'Refund' and it's approved):

| Insurance Status | Compensation Amount | Limit |
|------------------|---------------------|-------|
| `INSURED` | 100% of Declared Value | Max 100,000,000 VND |
| `NOT_INSURED` | 4 × Shipping Fee | Domestic shipments only |

*(Note: COD collection amounts are also compensated up to 30,000,000 VND for insured items).*
