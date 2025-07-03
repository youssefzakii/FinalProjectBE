# Graduation Project - Backend

This is the backend for the graduation project, built with **NestJS** and **MongoDB**.

---

## Overview

A user & company management system that supports:

### User Features

- User registration (Sign Up)
- User authentication (Sign In)
- Automatic role assignment (`user` by default)
- Input validation for all fields
- Data persistence in MongoDB

### Company Features

- Company registration (Sign Up)
- Company authentication (Sign In)
- Search companies by technical fields (e.g. Frontend, Backend)

---

## Technologies Used

- **NestJS** – for structured backend development
- **MongoDB** with **Mongoose** – database and ODM
- **class-validator** – for DTO validation
- **@nestjs/swagger** – for API documentation
- **bcrypt** – to securely hash passwords
- **dotenv** – for environment variable management

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/youssefzakii/FinalProjectBE
cd FinalProjectBE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
MONGO_DB_URI=mongodb://localhost:27017/graduation_db
```

### 4. Run the application

```bash
npm run start:dev
```

### API Documentation

```bash
http://localhost:3000/api-docs#/

```
