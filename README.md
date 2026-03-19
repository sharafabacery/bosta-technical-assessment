## 📚 Library Management System (NestJS)

A robust, scalable backend API for managing a library's catalog, members, and transactions. Built with a focus on security, performance, and ease of deployment.

### 🚀 Key Features

* **RESTful API**: Full CRUD operations for Books, Authors, and Members.
* **Security (Basic Auth)**: Protected routes using standard Base64-encoded credentials.
* **Rate Limiting**: Integrated `ThrottlerModule` to prevent brute-force attacks and API abuse.
* **API Documentation**: Interactive **Swagger** UI for testing endpoints.
* **Validation**: Strict request validation using `class-validator` and `ValidationPipe`.
* **Containerization**: Fully Dockerized for consistent development and production environments.
* **Testing**: Automated unit and integration tests using Jest.

---

### 🛠 Tech Stack

* **Framework**: [NestJS](https://nestjs.com/)
* **Language**: TypeScript
* **Database**: PostgreSQL (via TypeORM)
* **Documentation**: Swagger/OpenAPI
* **DevOps**: Docker & Docker Compose

---

### ⚙️ Getting Started

#### Prerequisites
* Node.js (v18+)
* Docker & Docker Compose (optional, for containerized setup)

#### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/library-mgmt-nest.git
   cd library-mgmt-nest
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

#### Environment Setup
Create a `.env` file in the root directory and configure your variables:
```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=bosta-technical-assessment

# Application Configuration
PORT=3000
NODE_ENV=development
```

---

### 🐳 Docker Deployment

To spin up the entire stack (App + Database) using Docker:

```bash
docker-compose up --build
```
The app will be accessible at `http://localhost:3000`.

---

### 🛡 Security & Usage

#### Basic Authentication
Most administrative endpoints require Brearer Auth. 
* **Header**: `Authorization: Brearer <base64-encoded-credentials>`
Credinatils of login is 
```bash
username: 'admin',
password: 'password123',
```

#### Rate Limiting
To ensure stability, the API is limited to **10 requests per 60 seconds** per IP address (customizable in `.env`).

#### API Documentation
Once the server is running, visit the Swagger UI to explore and test the endpoints:
> **URL**: `http://localhost:3000/api/docs`

---

### 🧪 Running Tests

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

### 📂 Project Structure
```text
src/
├── auth/           # Basic Auth guards and logic
├── books/          # Book management module
├── members/        # Member management module
├── common/         # Rate limiter configs and filters
├── main.ts         # Swagger setup and app bootstrap
└── ...
```

---

### 📊 Database Schema (ERD)

The system uses a relational schema to manage the relationships between books, borrowers, and the tracking of borrowed items.

![Alt text](/erd.png)   

**Relationship Logic:**
* **Book ↔ BookBorrower**: One-to-Many. A book can be involved in multiple borrowing transactions over time.
* **Borrower ↔ BookBorrower**: One-to-Many. A single borrower can have multiple records of borrowed books.
* **BookBorrower**: Acts as a join table (Many-to-Many) that tracks specific metadata like `borrowedAt`, `returnedAt`, and `overdue` status.

---
