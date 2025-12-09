# Military Asset Management System (MAMS)

A full-stack MERN application for managing military assets, tracking purchases, transfers, and assignments with Role-Based Access Control (RBAC).

## Features
- **Dashboard**: Real-time asset balances, net movements, and charts.
- **RBAC**: 
  - **Admin**: Full access.
  - **Logistics**: Manage purchases and transfers.
  - **Commander**: Manage assignments and expenditures for their base.
- **Tracking**: Complete audit trail of asset movements.

## Prerequisites
- Node.js installed
- MongoDB installed and running locally on default port `27017`

## Setup & Installation

### 1. Database Setup
The application requires a seeded database to function correctly (for users and initial assets).

```bash
cd server
npm install
npm run seed
```
This will create the `mams` database and populate it with users and assets.

### 2. Backend Server
Start the Express API server:

```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`.

### 3. Frontend Client
Start the React application:

```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`.

## Login Credentials (Demo)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@mams.com` | `password123` |
| **Commander** (Alpha Base) | `cmdr_alpha@mams.com` | `password123` |
| **Logistics Officer** | `logistics@mams.com` | `password123` |

## Project Structure
- `server/`: Node.js + Express backend
- `client/`: React + Tailwind CSS frontend
