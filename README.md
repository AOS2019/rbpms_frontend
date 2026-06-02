# RBPMS – Road & Bridge Project Management System

## Overview

RBPMS (Road & Bridge Project Management System) is a web-based construction project management platform designed to monitor, track, and report the progress of road and bridge construction projects.

The system provides role-based access control, project administration tools, bridge and section management, daily reporting, weekly planning, progress visualization, and construction activity tracking.

RBPMS is built using modern web technologies including Next.js, TypeScript, Prisma ORM, PostgreSQL, Tailwind CSS, JWT Authentication, and Vercel deployment.

---

## Features

### Authentication & Authorization

* Secure JWT-based authentication
* Role-based access control (RBAC)
* Protected routes using middleware/proxy
* Session-based login persistence
* Secure logout functionality

### User Roles

#### SUPER_ADMIN

* Full system access
* Manage administrators
* Manage all project data
* Configure system settings

#### ADMIN

* Manage users
* Manage project sections
* Manage bridges
* Manage reports
* Access administrative dashboard

#### TECHNICIAN

* Submit daily reports
* Update progress records
* Access project dashboards

#### VIEWER

* Read-only access
* View project progress
* Access visualizations and reports

---

## Core Modules

### Dashboard

Provides project-level insights including:

* Total Sections
* Total Bridges
* Progress Tracking
* Project Statistics
* Activity Summaries

---

### Section Management

Create and manage project sections.

Example:

* Section 01
* Section 02
* Section 02

Each section can contain multiple bridges.

---

### Bridge Management

Manage bridge records including:

* PK Code
* Location
* Bridge Type
* Progress Information

Supported bridge types:

* Bridge
* Overbridge

---

### Pier Management

Manage bridge pier information.

Each bridge can contain:

* Multiple piers
* Varying heights
* Different column configurations

Example:

* Pier P1
* Pier P2
* Pier P3

---

### Column Management

Track structural columns within each pier.

Column information includes:

* Column Number
* Shape
* Height

Supported configurations:

* Circular Columns
* Octagonal Columns
* Combined Configurations

---

### Daily Reporting

Capture daily construction activities including:

* Site Engineer
* Project Manager
* Weather
* Working Hours
* Team Activities
* Quantities Completed

Activities include:

* Concrete Works
* Reinforcement Works
* Formwork Works

---

### Weekly Planning

Generate and manage weekly construction plans.

Features:

* Planned Activities
* Team Allocation
* Progress Monitoring
* Work Scheduling

---

### Progress Visualization

Provides graphical project progress monitoring and reporting.

Supports:

* Completion Tracking
* Planned vs Actual Progress
* Bridge-Level Performance Analysis

---

## Technology Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Prisma ORM

### Database

* PostgreSQL
* Neon Database

### Authentication

* JWT
* JOSE

### Deployment

* Vercel

---

## Project Structure

```text
src/
│
├── app/
│   ├── admin/
│   │   ├── cpanel/
│   │   ├── dashboard/
│   │   └── users/
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── bridges/
│   │   ├── sections/
│   │   ├── users/
│   │   ├── piers/
│   │   ├── daily-reports/
│   │   └── weekly-plans/
│   │
│   ├── dashboard/
│   ├── daily-report/
│   ├── weekly-plan/
│   └── visualization/
│
├── components/
├── lib/
├── middleware.ts
└── prisma/
```

---

## Database Schema Overview

### User

Stores system users and roles.

### Section

Represents project sections.

### Bridge

Represents bridges under a section.

### Pier

Represents bridge piers.

### Column

Represents pier columns.

### DailyReport

Stores submitted daily reports.

### DailyActivity

Stores individual work activities.

### DailyTeam

Stores reporting teams.

### DailyTeamTask

Stores team task records.

---

## Installation

### Clone Repository

```bash
git clone https://github.com/AOS2019/rbpms_frontend.git

cd rbpms_frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_secure_jwt_secret

ADMIN_NAME=System Administrator

ADMIN_EMAIL=admin@website.com

ADMIN_PASSWORD=My_password_123@
```

---

## Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run Migrations:

```bash
npx prisma migrate deploy
```

Seed Initial Admin User:

```bash
npx prisma db seed
```

---

## Local Development

Start development server:

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:3000
```

---

## Production Deployment

### Database

Create a PostgreSQL database using:

* Neon
* Supabase
* Railway

### Vercel

Add the following environment variables:

```env
DATABASE_URL=...

JWT_SECRET=...

ADMIN_NAME=...

ADMIN_EMAIL=...

ADMIN_PASSWORD=...
```

Deploy using:

```bash
git push origin main
```

or directly through Vercel GitHub integration.

[RBPMS Home Page](https://rbpms-frontend-jp5bs48ad-aos2019s-projects.vercel.app/)

---

## Security

RBPMS implements:

* JWT Authentication
* HttpOnly Cookies
* Role-Based Access Control
* Protected API Routes
* Protected Dashboard Routes
* Secure Password Hashing using bcrypt

---

## Future Enhancements

* Material Management Module
* Equipment Management Module
* Workforce Management
* Progress Charts & Analytics
* PDF Report Generation
* Excel Export
* Mobile App Integration
* GIS Mapping Integration
* Project Cost Tracking
* Contractor Management
* Approval Workflows
* Notifications & Alerts

---

## License

This project is proprietary software developed for construction project monitoring and management.

All rights reserved.

---

## Author

**Olalekan Samuel Akintoye**

Road & Bridge Project Management System (RBPMS)

Built using Next.js, Prisma, PostgreSQL, and Vercel.
