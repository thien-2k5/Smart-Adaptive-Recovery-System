# Task Breakdown

## Overview
This document outlines the detailed breakdown of all development tasks for the Smart Adaptive Recovery System (SARS), structured by project phases.

---

## Phase 1: Document Analysis & Documentation
**Status**: In Progress

| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| DOC-01 | Requirements | Analyze reference PDF documents | 1h |
| DOC-02 | Architecture | Create system architecture, ERD, APIs, Flow diagrams | 2h |
| DOC-03 | Management | Create task breakdown, sprint plan, git strategy | 1h |
| DOC-04 | Technical | Create Docker, deployment, coding convention docs | 1h |

---

## Phase 2: Database Design & Seed Data
**Status**: Pending

| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| DB-01 | Schema | Design PostgreSQL schema (12 tables) | 2h |
| DB-02 | Init Script | Create `init.sql` with tables, indexes, constraints | 2h |
| DB-03 | Seed Data | Create `seed.sql` with demo customers and ~50 shipments | 2h |
| DB-04 | Testing | Verify schema creation and data insertion in PostgreSQL | 1h |

---

## Phase 3: Backend (Spring Boot 3)
**Status**: Pending

### 3.1 Setup & Configuration
| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| BE-01 | Project Setup | Initialize Spring Boot with dependencies | 1h |
| BE-02 | Configuration | Configure application.yml, CORS, Security | 1h |
| BE-03 | Entities | Create JPA Entities with relationships | 2h |
| BE-04 | Repositories | Create Spring Data JPA repositories | 1h |

### 3.2 Core Services (CRUD)
| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| BE-05 | Shipment Service | Implement Shipment CRUD, Timeline retrieval | 2h |
| BE-06 | Customer Service | Implement Customer management | 1h |
| BE-07 | Help Center Svc | Implement Help Center article retrieval | 1h |
| BE-08 | Admin Service | Implement dashboard statistics and filtering | 2h |

### 3.3 Simulation & Recovery Engines
| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| BE-09 | Simulation Engine | `@Scheduled` task to advance shipment stages | 3h |
| BE-10 | Delay Detection | Engine to check thresholds and trigger anomalies | 2h |
| BE-11 | Recovery Logic | Create recovery cases based on customer/parcel profiles | 3h |
| BE-12 | Compensation | Logic for refund/replacement and insurance calculation | 2h |

### 3.4 Notifications & SSE
| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| BE-13 | Notification Svc | Store notifications in database | 1h |
| BE-14 | SSE Endpoint | Implement Server-Sent Events controller | 2h |
| BE-15 | Event Publishing | Publish delay events to SSE clients | 1h |

---

## Phase 4: Frontend (React + Vite)
**Status**: Pending

### 4.1 Setup & Architecture
| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| FE-01 | Project Setup | Initialize Vite, Tailwind, shadcn/ui | 1h |
| FE-02 | Routing | Configure React Router (5 main pages + Admin) | 1h |
| FE-03 | API Layer | Setup Axios instance and API services | 1h |
| FE-04 | i18n | Setup react-i18next with VI/EN translation files | 2h |

### 4.2 Shared Components
| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| FE-05 | Layout | Header (Nav, Lang toggle), Footer | 2h |
| FE-06 | UI Kit | Buttons, Cards, Inputs, Modals, Badges | 2h |
| FE-07 | Notification | Full-screen alert modal component + audio | 2h |
| FE-08 | Timeline | Reusable vertical timeline component | 2h |

### 4.3 Pages
| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| FE-09 | Landing Page | Hero banner, stats, "How it works" steps | 2h |
| FE-10 | Create Shipment | Form with validation, customer/parcel type selection | 3h |
| FE-11 | My Shipment | Shipment summary, live tracking timeline | 3h |
| FE-12 | Recovery Center | Investigation timeline, options selection panel | 4h |
| FE-13 | Help Center | Static content, policies, contact info | 1h |
| FE-14 | Admin Dash | Statistics charts, data tables with filters | 4h |

### 4.4 Real-time Integration
| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| FE-15 | SSE Client | Connect to SSE endpoint, handle incoming events | 2h |
| FE-16 | State Management | Update UI state based on SSE and API responses | 2h |

---

## Phase 5: Docker & Deployment
**Status**: Pending

| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| DO-01 | Dockerfile BE | Multi-stage build for Spring Boot | 1h |
| DO-02 | Dockerfile FE | Multi-stage build for React + Nginx | 1h |
| DO-03 | Nginx Config | Reverse proxy configuration (`default.conf`) | 1h |
| DO-04 | Compose | `docker-compose.yml` for all services | 1h |
| DO-05 | Deployment | Setup script / instructions for Ubuntu Server | 1h |

---

## Phase 6: Verification & Review
**Status**: Pending

| Task ID | Component | Description | Est. Effort |
|---------|-----------|-------------|-------------|
| QA-01 | E2E Testing | Walk through full simulation lifecycle | 2h |
| QA-02 | UI/UX Review | Compare against Hi-Fi design, check responsiveness | 2h |
| QA-03 | Performance | Ensure simulation doesn't block UI | 1h |
| QA-04 | Final Polish | Update README, clean up code | 1h |
