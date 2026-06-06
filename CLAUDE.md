# Project Context: Family-Tasks (Gamified Household Management)

## 🎯 Project Overview
Family-Tasks is a web application designed to help families manage household chores using Gamification. 
- **Parents (PARENT)** can create a family group, assign tasks, and set up a reward store.
- **Children (CHILD)** can join the family using an invite code, complete tasks to earn points, and redeem those points for rewards.
- **Utilities:** Includes a shared grocery list and a family leaderboard.

## 🏗️ Tech Stack
- **Backend (Completed):** Java, Spring Boot 3.2.x, Spring Security (JWT), Spring Data JPA, PostgreSQL, Swagger (OpenAPI).
- **Frontend (Current Goal):** Next.js (App Router), React, Tailwind CSS, Axios/Fetch for API integration.

## 🗄️ Database Schema & Entities
- **FamilyEntity:** `id`, `familyName`, `inviteCode`.
- **UserEntity:** `id`, `fullName`, `email`, `password`, `role` (PARENT, CHILD), `totalPoints` (Integer), `family` (ManyToOne).
- **TaskEntity:** `id`, `title`, `description`, `points`, `dueDate`, `status` (PENDING, SUBMITTED, APPROVED), `family` (ManyToOne), `assignedTo` (ManyToOne -> UserEntity).
- **RewardEntity:** `id`, `name`, `description`, `pointsRequired`, `family` (ManyToOne).
- **GroceryEntity:** `id`, `name`, `isPurchased` (boolean), `family` (ManyToOne), `addedBy` (ManyToOne -> UserEntity).

## 🔌 API Endpoints Summary (Base URL: `http://localhost:8080`)
*Note: All endpoints except `/api/auth/**` require a Bearer JWT Token in the Authorization header.*

**1. Authentication:**
- `POST /api/auth/register` | Body: `{ fullName, email, password, role }`
- `POST /api/auth/login` | Body: `{ email, password }` -> Returns: `{ "token": "jwt_string" }`

**2. Family Management:**
- `POST /api/families` (PARENT only) | Body: `{ familyName }` -> Returns inviteCode
- `POST /api/families/join` (CHILD) | Body: `{ inviteCode }`
- `GET /api/families/me` | Returns current user info and list of family members

**3. Task Management:**
- `POST /api/tasks` (PARENT) | Body: `{ title, description, points, dueDate, assigneeId(optional) }`
- `GET /api/tasks` | Returns all tasks in the family
- `PATCH /api/tasks/{id}/submit` (CHILD) | Marks task as SUBMITTED
- `PATCH /api/tasks/{id}/approve` (PARENT) | Marks task as APPROVED and adds points to the assignee

**4. Rewards Store:**
- `POST /api/rewards` (PARENT) | Body: `{ name, description, pointsRequired }`
- `GET /api/rewards` | Returns all rewards
- `POST /api/rewards/{id}/redeem` (CHILD) | Deducts points and redeems reward

**5. Shared Groceries:**
- `GET /api/groceries`
- `POST /api/groceries` | Body: `{ name }`
- `PATCH /api/groceries/{id}/toggle` | Toggles `isPurchased` boolean

**6. Utilities:**
- `GET /api/dashboard/summary` | Returns `{ totalMembers, pendingTasks, tasksToApprove, availableRewards }`
- `GET /api/leaderboard` | Returns members ranked by `totalPoints` descending.

## 🚀 Current Status & AI Instruction
**Status:** The Spring Boot backend is 100% completed, tested, and running smoothly.
**Instruction for Claude:** I want you to act as an Expert Next.js Frontend Developer. Please read this context carefully. My next step is to build the web interface. 
Please start by giving me a step-by-step plan to initialize the Next.js project, setup Tailwind, and create the basic folder structure and Authentication (Login/Register) pages.