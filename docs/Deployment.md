# Deployment Guide

## Overview
This guide provides instructions for deploying the Smart Adaptive Recovery System (SARS) to the target Ubuntu Server 24.04 LTS environment using Docker Compose.

---

## Environment Requirements
- **OS**: Ubuntu Server 24.04 LTS
- **Tools**: Docker, Docker Compose, Git
- **Ports**: 80 (HTTP), 443 (HTTPS - optional), 5432 (PostgreSQL - optional for external access), 3000 (Frontend - internal), 8080 (Backend - internal)

---

## Pre-requisites Setup

Ensure Docker and Docker Compose are installed on the Ubuntu VM:

```bash
# Update package index
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y

# Enable and start Docker service
sudo systemctl enable --now docker

# Add current user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose plugin
sudo apt install docker-compose-v2 -y
```

---

## Deployment Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Smart-Adaptive-Recovery-System
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (if needed for sensitive configurations). For this demo, defaults in `docker-compose.yml` and `application.yml` are sufficient.

Ensure the `application.yml` has the correct database connection pointing to the `postgres` service hostname.

### 3. Build and Start Services
Run Docker Compose to build the images and start the containers in detached mode:

```bash
docker compose up -d --build
```

### 4. Verify Deployment
Check the status of the containers:
```bash
docker compose ps
```
You should see 4 services running: `sars-frontend`, `sars-backend`, `sars-postgres`, and `sars-nginx`.

Check the logs to ensure no startup errors:
```bash
docker compose logs -f
```

---

## Accessing the Application
Once deployed, access the application via the VM's IP address or domain name:

- **Frontend Application**: `http://<vm-ip>/`
- **Backend API**: `http://<vm-ip>/api/`

---

## Database Management

### Connecting to PostgreSQL
If you need to connect to the database directly (e.g., using pgAdmin or DBeaver), use the VM's IP and port `5432` (ensure firewall allows this port if accessing remotely).
- **Host**: `<vm-ip>`
- **Port**: `5432`
- **User**: `postgres` (or as configured)
- **Password**: `postgres` (or as configured)
- **Database**: `sars_db`

### Resetting the Database
To reset the database and re-run seed data:
```bash
docker compose down -v
docker compose up -d
```
*(Warning: This deletes all data volumes)*

---

## Updating the Deployment
To pull latest changes and update the deployment:
```bash
git pull origin main
docker compose up -d --build
```
Docker will only rebuild changed images and recreate necessary containers.
