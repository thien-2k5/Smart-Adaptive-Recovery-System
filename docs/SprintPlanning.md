# Sprint Planning

## Overview
Given the project scope, the development is divided into 4 focused sprints. Each sprint delivers a testable increment of the Smart Adaptive Recovery System (SARS).

---

## Sprint 1: Foundation & Database
**Goal**: Establish the project infrastructure, database schema, and initial backend structure.

### Deliverables
1. Complete system architecture and documentation
2. PostgreSQL database schema and seed data
3. Spring Boot project setup with security and JPA configuration
4. React + Vite project setup with routing and layout

### Tasks
- [x] Phase 1 Documentation (Architecture, DB, API, Flows)
- [ ] DB Schema creation (`init.sql`)
- [ ] DB Seed data (`seed.sql`)
- [ ] Backend: Initialize Spring Boot, entities, repositories
- [ ] Frontend: Initialize Vite, Tailwind, shadcn/ui, Router

---

## Sprint 2: Core APIs & Simulation Engine
**Goal**: Build the core backend logic, including the shipment simulation and abnormal delay detection.

### Deliverables
1. CRUD APIs for Shipments, Customers
2. Scheduled task for shipment progression
3. Delay detection engine
4. SSE Endpoint for real-time alerts

### Tasks
- [ ] Backend: Shipment Service & Controller
- [ ] Backend: Simulation Engine (Scheduler)
- [ ] Backend: Delay Detection Logic
- [ ] Backend: SSE Notification Service
- [ ] Frontend: API client (Axios) setup

---

## Sprint 3: Adaptive Recovery & Frontend Basics
**Goal**: Implement the complex adaptive recovery logic and the main user-facing pages (Landing, Create Shipment, My Shipment).

### Deliverables
1. Adaptive recovery logic engine based on customer/parcel profiles
2. Landing Page with statistics
3. Create Demo Shipment page
4. My Shipment page with live tracking timeline

### Tasks
- [ ] Backend: Recovery Logic Engine & Compensation Service
- [ ] Frontend: Landing Page implementation
- [ ] Frontend: Create Shipment Form with validation
- [ ] Frontend: My Shipment page with real-time SSE connection
- [ ] Frontend: Full-screen alert modal

---

## Sprint 4: Recovery Center, Admin & Docker
**Goal**: Complete the Recovery Center, Admin Dashboard, Localization, and containerize the application.

### Deliverables
1. Full Recovery Center with investigation timeline
2. Admin Dashboard with statistics
3. English/Vietnamese localization
4. Docker Compose deployment

### Tasks
- [ ] Frontend: Recovery Center implementation
- [ ] Frontend: Help Center static pages
- [ ] Backend: Admin Dashboard API
- [ ] Frontend: Admin Dashboard UI
- [ ] Frontend: i18n implementation (vi/en)
- [ ] DevOps: Dockerfiles, Nginx config, `docker-compose.yml`
- [ ] QA: E2E Testing and Bug Fixing
