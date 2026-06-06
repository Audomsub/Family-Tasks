<div align="center">

# 🏠 Family Tasks

### *Gamified Household Management for the Modern Family*

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> Turn everyday chores into an exciting family adventure. Assign tasks, earn points, climb the leaderboard, and redeem awesome rewards!

</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🗄️ Database Schema](#️-database-schema)
- [🔌 API Reference](#-api-reference)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [📁 Project Structure](#-project-structure)
- [🎮 How It Works](#-how-it-works)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Secure Auth** | JWT-based authentication with role-based access control |
| 👨‍👩‍👧‍👦 **Family Groups** | Create families and invite members with unique invite codes |
| ✅ **Task Management** | Assign, submit, and approve household chores |
| 🏆 **Leaderboard** | Real-time family rankings based on earned points |
| 🎁 **Rewards Store** | Redeem accumulated points for custom family rewards |
| 🛒 **Grocery List** | Shared, collaborative family grocery tracking |
| 📊 **Dashboard** | At-a-glance summary of tasks, members, and rewards |

---

## 🏗️ Architecture

```
Family-Tasks/
├── backend/        ← Spring Boot REST API  (✅ Completed)
└── frontend/       ← Next.js Web Application (🚧 In Progress)
```

The application follows a **decoupled client-server architecture**:
- The **backend** exposes a RESTful API secured with **JWT tokens**.
- The **frontend** is a **Next.js App Router** SPA that communicates with the backend via `fetch`/`SWR`.

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Primary language |
| Spring Boot | 3.2.5 | Application framework |
| Spring Security | — | JWT authentication & authorization |
| Spring Data JPA | — | ORM & database abstraction |
| PostgreSQL | — | Relational database |
| Lombok | 1.18.46 | Boilerplate reduction |
| jjwt | 0.11.5 | JWT creation & validation |
| Springdoc OpenAPI | 2.5.0 | Swagger UI & API docs |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.7 | React framework (App Router) |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Utility-first styling |
| SWR | 2.4.1 | Data fetching & caching |
| Lucide React | 1.17.0 | Icon library |
| React Hot Toast | 2.6.0 | Notifications |

---

## 🗄️ Database Schema

```
┌─────────────────┐       ┌─────────────────┐
│   FamilyEntity  │       │   UserEntity    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ id (PK)         │
│ familyName      │       │ fullName        │
│ inviteCode      │       │ email           │
└─────────────────┘       │ password        │
         ▲                │ role            │
         │                │ totalPoints     │
         │                │ family (FK)     │
         │                └─────────────────┘
         │                        ▲
         │                        │
┌─────────────────┐       ┌───────┴─────────┐
│   TaskEntity    │       │  GroceryEntity  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ title           │       │ name            │
│ description     │       │ isPurchased     │
│ points          │       │ family (FK)     │
│ dueDate         │       │ addedBy (FK)    │
│ status          │       └─────────────────┘
│ family (FK)     │
│ assignedTo (FK) │       ┌─────────────────┐
└─────────────────┘       │  RewardEntity   │
                          ├─────────────────┤
                          │ id (PK)         │
                          │ name            │
                          │ description     │
                          │ pointsRequired  │
                          │ family (FK)     │
                          └─────────────────┘
```

**Task Status Flow:** `PENDING` → `SUBMITTED` → `APPROVED`

**User Roles:**
- `PARENT` — Can create/approve tasks, manage rewards, oversee family
- `CHILD` — Can join family, submit tasks, redeem rewards

---

## 🔌 API Reference

> **Base URL:** `http://localhost:8080`
> 
> All endpoints (except `/api/auth/**`) require a `Bearer <JWT>` token in the `Authorization` header.
> 
> **Swagger UI:** `http://localhost:8080/swagger-ui.html`

### 🔑 Authentication

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ fullName, email, password, role }` | Register a new user |
| `POST` | `/api/auth/login` | `{ email, password }` | Login → returns `{ token }` |

### 👨‍👩‍👧 Family Management

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/families` | PARENT | Create a family, returns invite code |
| `POST` | `/api/families/join` | CHILD | Join family via `{ inviteCode }` |
| `GET` | `/api/families/me` | Any | Get current user's family info & members |

### ✅ Task Management

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/tasks` | PARENT | Create a task `{ title, description, points, dueDate, assigneeId? }` |
| `GET` | `/api/tasks` | Any | List all tasks in family |
| `PATCH` | `/api/tasks/{id}/submit` | CHILD | Mark task as SUBMITTED |
| `PATCH` | `/api/tasks/{id}/approve` | PARENT | Approve task, award points |

### 🎁 Rewards Store

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/api/rewards` | PARENT | Create reward `{ name, description, pointsRequired }` |
| `GET` | `/api/rewards` | Any | List all rewards |
| `POST` | `/api/rewards/{id}/redeem` | CHILD | Redeem reward (deducts points) |

### 🛒 Groceries

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/groceries` | List all grocery items |
| `POST` | `/api/groceries` | Add item `{ name }` |
| `PATCH` | `/api/groceries/{id}/toggle` | Toggle purchased status |

### 📊 Utilities

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/summary` | Returns `{ totalMembers, pendingTasks, tasksToApprove, availableRewards }` |
| `GET` | `/api/leaderboard` | Returns members ranked by `totalPoints` desc |

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+** (for backend)
- **Maven** (bundled via `mvnw`)
- **PostgreSQL** database running locally
- **Node.js 18+** & **npm** (for frontend)

---

### Backend Setup

**1. Configure the database**

Create a PostgreSQL database and update `application.properties` (or `application.yml`) inside `backend/family-task/src/main/resources/`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/family_tasks
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

**2. (Optional) Load mock data**

```bash
psql -U your_username -d family_tasks -f backend/mock_data.sql
```

**3. Run the backend**

```bash
cd backend/family-task
./mvnw spring-boot:run
```

The API will be available at **`http://localhost:8080`**.  
Swagger UI: **`http://localhost:8080/swagger-ui.html`**

---

### Frontend Setup

**1. Install dependencies**

```bash
cd frontend
npm install
```

**2. Configure the API URL**

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**3. Start the development server**

```bash
npm run dev
```

The app will be available at **`http://localhost:3000`**.

---

## 📁 Project Structure

```
Family-Tasks/
│
├── backend/
│   ├── family-task/                    ← Spring Boot project root
│   │   ├── src/main/java/com/example/
│   │   │   ├── config/                 ← Security & JWT configuration
│   │   │   ├── controller/             ← REST controllers
│   │   │   ├── dto/                    ← Request/Response DTOs
│   │   │   ├── entity/                 ← JPA entities
│   │   │   ├── repository/             ← Spring Data repositories
│   │   │   └── service/                ← Business logic
│   │   └── pom.xml
│   └── mock_data.sql                   ← Sample seed data
│
└── frontend/
    └── src/
        ├── app/                        ← Next.js App Router pages
        │   ├── login/                  ← Authentication pages
        │   ├── tasks/                  ← Task management
        │   ├── rewards/                ← Rewards store
        │   ├── leaderboard/            ← Family leaderboard
        │   ├── groceries/              ← Grocery list
        │   ├── family/                 ← Family management
        │   └── profile/                ← User profile
        ├── components/                 ← Reusable React components
        ├── context/                    ← React Context providers (Auth, etc.)
        ├── lib/                        ← API client & utilities
        └── types/                      ← TypeScript type definitions
```

---

## 🎮 How It Works

```
1. PARENT registers → creates a Family → gets an Invite Code
                                               │
2.                              CHILD registers → joins family via Invite Code
                                               │
3. PARENT creates Tasks (with optional assignee) ──► CHILD sees tasks in dashboard
                                               │
4.                              CHILD completes chore → submits task
                                               │
5. PARENT reviews → approves task ──► Points awarded to CHILD ──► Leaderboard updates
                                               │
6.                              CHILD redeems points for Rewards 🎉
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

Made with ❤️ for families everywhere

</div>