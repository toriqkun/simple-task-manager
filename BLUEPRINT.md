# Task Manager Application Blueprint (Repository Pattern)

## 1. Overview

Task Manager adalah aplikasi fullstack berbasis web yang digunakan untuk mengelola aktivitas atau tugas harian pengguna. Aplikasi ini memungkinkan pengguna untuk membuat akun, login, serta mengelola daftar tugas pribadi mereka.

Setiap pengguna memiliki daftar tugas yang terhubung langsung dengan akun mereka melalui relasi database.

Aplikasi menggunakan arsitektur REST API dengan Repository Pattern untuk memastikan:
* code modular
* maintainability
* scalability
* separation of concerns

Arsitektur aplikasi dibagi menjadi beberapa layer:
```
Controller → Service → Repository → Database
```
Setiap layer memiliki tanggung jawab berbeda.

---

### 1.1. Technology Stack

**Frontend**
* React
* TypeScript
* TailwindCSS v4
* Lucide React
* Axios

**Backend**
* Node.js
* Express.js
* TypeScript (strict mode)
* Prisma ORM v7

**Database**
* NeonDB (Serverless PostgreSQL)

**Authentication**
* JWT

**Deployment**
* Frontend → Vercel
* Backend → Render
* Database → NeonDB

---

## 2. Architecture Pattern

Backend menggunakan Repository Pattern.

Tujuannya:
* memisahkan logic bisnis dengan akses database
* memudahkan testing
* menghindari coupling dengan ORM

Arsitektur:
```
Request
 ↓
Routes
 ↓
Controllers
 ↓
Services
 ↓
Repositories
 ↓
Prisma Client
 ↓
NeonDB
```

Penjelasan layer:

**Controller**
Menangani:
* request
* response
* HTTP status code

Controller tidak berisi business logic.

**Service**

Berisi business logic utama aplikasi.

Contoh:
* validasi user login
* hashing password
* verifikasi JWT
* logika manipulasi task

**Repository**

Berfungsi untuk akses database melalui Prisma.

Semua query database berada di layer ini.

**Prisma**

ORM yang menghubungkan backend dengan database NeonDB.

---

## 3. Fitur

### 3.1 Authentication System

Sistem autentikasi berbasis JWT.

User dapat:
* register
* login
* mengakses endpoint yang dilindungi

***Register User***

Endpoint

POST /users

Request

```json
{
  "name": "Toriq",
  "email": "toriq@email.com",
  "password": "password123"
}
```

Validasi:
* email unik
* password minimal 6 karakter
* semua field wajib

Response

```json
{
  "message": "User registered successfully"
}
```

***Login User***

Endpoint

POST /users/login

Request

```json
{
  "email": "toriq@email.com",
  "password": "password123"
}
```

Response

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Toriq",
    "email": "toriq@email.com"
  }
}
```

Token digunakan untuk endpoint protected.

---

### 3.2 User Management

***Get All Users***
Endpoint

GET /users

***Get User By ID***
Endpoint

GET /users/:id

***Update User***
Endpoint

PUT /users/:id

***Delete User***
Endpoint

DELETE /users/:id

---

### 3.3 Task Management

Task adalah aktivitas yang dibuat oleh user.

Struktur Task:
* id
* title
* description
* completed
* userId
* createdAt
* updatedAt

---

***Create Task***
Endpoint

POST /tasks

Auth Required: YES

Request

```json
{
  "title": "Belajar Express",
  "description": "Membuat REST API",
  "completed": false
}
```

***Get All Tasks***
Endpoint

GET /tasks

Auth: NO

***Get My Tasks***
Endpoint

GET /tasks/my-tasks

Auth: YES

***Get Task By ID***
Endpoint

GET /tasks/:id

***Update Task***
Endpoint

PUT /tasks/:id

***Delete Task***
Endpoint

DELETE /tasks/:id

---

## 4. Type Safety (No Any)

Seluruh kode menggunakan TypeScript strict mode.

Prinsip utama:
* Tidak menggunakan any
* Menggunakan interface atau type
* Menggunakan DTO (Data Transfer Object)

***User Type***

```typescript
export interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}
```

***Task Type***

```typescript
export interface Task {
  id: number
  title: string
  description?: string
  completed: boolean
  userId: number
  createdAt: Date
  updatedAt: Date
}
```

***DTO Example***

CreateUserDTO

```typescript
export interface CreateUserDTO {
  name: string
  email: string
  password: string
}
```

LoginDTO

```typescript
export interface LoginDTO {
  email: string
  password: string
}
```

CreateTaskDTO

```typescript
export interface CreateTaskDTO {
  title: string
  description?: string
  completed?: boolean
}
```

---

## 5. Database Schema

Database menggunakan NeonDB PostgreSQL.

Prisma Schema
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String

  tasks     Task[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)

  userId Int
  user   User @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 6. NeonDB Configuration
Connection string disimpan di .env.

```env
DATABASE_URL="postgresql://username:password@ep-xxxx.neon.tech/dbname?sslmode=require"
```

---

## 7. Project Structure

Struktur backend menggunakan Repository Pattern.

```bash
backend
src
│
├── config
│   └── prisma.ts
│
├── controllers
│   ├── userController.ts
│   └── taskController.ts
│
├── services
│   ├── userService.ts
│   └── taskService.ts
│
├── repositories
│   ├── userRepository.ts
│   └── taskRepository.ts
│
├── routes
│   ├── userRoutes.ts
│   └── taskRoutes.ts
│
├── middleware
│   └── authMiddleware.ts
│
├── types
│   ├── user.ts
│   └── task.ts
│
├── dto
│   ├── user.ts
│   └── task.ts
│
├── utils
│   ├── jwt.ts
│   └── password.ts
│
├── app.ts
└── server.ts
```

---

## 8. Frontend Structure

```bash
frontend
src
│
├── components
│   ├── TaskCard.tsx
│   ├── Navbar.tsx
│   └── Button.tsx
│
├── pages
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── CreateTask.tsx
│   └── EditTask.tsx
│
├── services
│   └── api.ts
│
├── context
│   └── auth.context.tsx
│
├── hooks
│
├── types
│
├── App.tsx
└── main.tsx
```

---

## 9. Roadmap

Phase 1

Project setup
* Express + TypeScript
* React + TypeScript
* TailwindCSS
* Prisma
* NeonDB

Phase 2

Authentication
* register
* login
* JWT
* password hashing

Phase 3

Task CRUD
* create task
* update task
* delete task
* get tasks

Phase 4

Frontend
* authentication pages
* dashboard
* task CRUD UI

Phase 5

Integration
* axios setup
* token authentication
* error handling

---

## 10. Security

Keamanan sistem:
* bcrypt password hashing
* JWT authentication
* request validation
* CORS configuration
* environment variables

---

## 11. Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
NODE_ENV=production
```

Repository harus menyertakan:
```env
.env.example
```

---

## 12. Optional Improvements

Fitur tambahan:
* task search
* task filtering
* pagination
* task priority
* due date
* dark mode
* drag & drop tasks
* optimistic UI update
* mobile responsive UI