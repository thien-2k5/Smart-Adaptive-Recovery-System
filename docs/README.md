# Smart Adaptive Recovery System (SARS)

> A proactive parcel abnormal detection & recovery simulation platform for Viettel Post.

---

## Purpose

This project is **for research, demonstration, and educational purposes only**.

SARS simulates a logistics recovery system that:

1. **Proactively detects** shipment abnormal delays before customers file complaints
2. **Automatically creates** recovery cases with investigation timelines
3. **Adapts recovery** strategies based on customer type, parcel category, and insurance status
4. **Provides transparent** real-time updates throughout the investigation process

> **Important**: This is NOT an official Viettel Post system. No external APIs are integrated. Everything is simulated using our own backend and PostgreSQL database.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Demo Shipment Creation** | Create simulated shipments with configurable customer profiles |
| **Real-time Tracking** | Live shipment timeline with stage-by-stage progression |
| **Abnormal Delay Detection** | Automatic detection when shipment exceeds threshold (configurable: 2 min demo / 48h production) |
| **Adaptive Recovery** | Recovery mode changes based on customer type × parcel category × insurance |
| **Full-Screen Alerts** | Prominent notification modal when anomaly is detected |
| **Recovery Center** | Complete investigation timeline with resolution options |
| **Help Center** | Compensation policy, FAQ, contact information |
| **Admin Dashboard** | Statistics, case management, search & filter |
| **Bilingual UI** | Full Vietnamese / English localization |
| **Responsive Design** | Desktop-first with mobile support |

---

## Tech Stack

### Frontend
- React 18+
- Vite 5+
- TailwindCSS 3+
- shadcn/ui
- React Router 6+
- Axios
- i18next (localization)

### Backend
- Spring Boot 3.x
- Java 21
- Spring Data JPA
- Spring Security (admin authentication)
- Lombok
- SSE (Server-Sent Events) for real-time notifications

### Database
- PostgreSQL 16

### Deployment
- Docker & Docker Compose
- Nginx (reverse proxy)
- Ubuntu Server 24.04 LTS

---

## Project Structure

```
Smart-Adaptive-Recovery-System/
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── contexts/          # React Context providers
│   │   ├── services/          # API service layer
│   │   ├── i18n/              # Translation files (vi.json, en.json)
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   └── package.json
├── backend/                   # Spring Boot application
│   ├── src/main/java/
│   │   └── com/viettelpost/sars/
│   │       ├── config/        # Configuration classes
│   │       ├── controller/    # REST controllers
│   │       ├── service/       # Business logic
│   │       ├── repository/    # JPA repositories
│   │       ├── model/         # Entity classes
│   │       ├── dto/           # Data transfer objects
│   │       ├── enums/         # Enum types
│   │       ├── scheduler/     # Scheduled tasks (simulation)
│   │       ├── exception/     # Custom exceptions
│   │       └── security/      # Security configuration
│   ├── src/main/resources/
│   │   ├── application.yml    # Application configuration
│   │   └── db/migration/      # Database migration scripts
│   └── pom.xml
├── database/                  # Database scripts
│   ├── init.sql               # Schema DDL
│   └── seed.sql               # Demo seed data
├── nginx/                     # Nginx configuration
│   └── default.conf
├── docs/                      # Project documentation
├── docker-compose.yml         # Multi-service orchestration
└── README.md                  # Root-level README
```

---

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Ports 80, 3000, 8080, 5432 available

### Run with Docker Compose

```bash
git clone <repository-url>
cd Smart-Adaptive-Recovery-System
docker compose up -d
```

Access the application:
- **Frontend**: http://localhost (via Nginx)
- **Backend API**: http://localhost/api
- **PostgreSQL**: localhost:5432

### Run for Development

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Demo Workflow

1. Visit the **Landing Page** → Click "Tạo đơn hàng Demo"
2. Fill in the **Create Shipment** form (sender, receiver, customer type, parcel category, insurance)
3. Watch the **Shipment Timeline** progress in real-time
4. After ~30 seconds, an **Abnormal Delay** is detected → Full-screen alert appears
5. Navigate to the **Recovery Center** to view investigation progress
6. Select a **Recovery Option** (Continue Investigation / Refund / Replacement)
7. View the **Help Center** for compensation policies

---

## Configuration

Key configuration in `backend/src/main/resources/application.yml`:

```yaml
sars:
  simulation:
    # Delay detection threshold (minutes)
    # Demo: 2 minutes | Production: 2880 minutes (48 hours)
    alert-threshold-minutes: 2
    
    # Time between shipment stage progressions (seconds)
    stage-progression-interval: 5
    
    # Total simulation duration before delay triggers (seconds)
    delay-trigger-after-seconds: 30
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture.md](./Architecture.md) | System architecture & diagrams |
| [Database.md](./Database.md) | ERD, table descriptions, relationships |
| [API.md](./API.md) | REST API specification |
| [BusinessFlow.md](./BusinessFlow.md) | Business flow diagrams |
| [UseCase.md](./UseCase.md) | Use case specifications |
| [NotificationFlow.md](./NotificationFlow.md) | Abnormal detection & notification flow |
| [RecoveryLogic.md](./RecoveryLogic.md) | Adaptive recovery logic matrix |
| [Localization.md](./Localization.md) | i18n implementation guide |
| [Docker.md](./Docker.md) | Docker architecture |
| [Deployment.md](./Deployment.md) | Deployment guide |
| [TaskBreakdown.md](./TaskBreakdown.md) | Development roadmap |
| [SprintPlanning.md](./SprintPlanning.md) | Sprint planning |
| [CodingConvention.md](./CodingConvention.md) | Naming & coding conventions |
| [GitStrategy.md](./GitStrategy.md) | Git branch strategy |
| [FutureImprovements.md](./FutureImprovements.md) | Future roadmap |

---

## License

This project is for **research and educational purposes only**.

© Viettel Post — Smart Adaptive Recovery System (SARS) Demo
