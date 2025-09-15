# Million Properties Management System

A full-stack property management application with .NET 8 Web API backend, React TypeScript frontend, and MongoDB database.

## Technology Stack

**Backend:** .NET 8 Web API, MongoDB Driver, C#  
**Frontend:** React 19, TypeScript, React Router, Axios, Vite  
**Database:** MongoDB

## Features

- Property listing and filtering
- Search by name, address, and price range
- Responsive design
- RESTful API with MongoDB integration
- Automated sample data seeding

## Quick Start

### Prerequisites

- .NET 8 SDK
- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Database Setup

```bash
cd mongo-scripts
npm install
npm run populate
```

### 2. Backend Setup

```bash
cd backend
dotnet restore
dotnet run
```

API runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

## 📡 API Endpoints

### Properties

- `GET /api/properties` - Get all properties (with optional filters)
- `GET /api/properties/{id}` - Get property by ID

### Query Parameters for Filtering

- `name` - Filter by property name
- `address` - Filter by address
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

**Example:**

```
GET /api/properties?name=Modern&minPrice=100000&maxPrice=500000
```

## 🗄️ Database Schema

The system uses MongoDB with the following collection:

### Properties Collection

```javascript
{
  "_id": ObjectId,
  "name": String,
  "address": String,
  "price": Number,
  "codeInternal": String,
  "year": Number,
  "idOwner": String
}
```

## 🔧 Development

### Running Tests

```bash
# Backend tests (if available)
cd backend
dotnet test

# Frontend tests
cd frontend
npm test
```

### MongoDB Utilities

The `mongo-scripts` directory contains helpful utilities:

```bash
cd mongo-scripts

# Populate database with sample data
npm run populate

# Run sample queries
npm run query

# Clear database
npm run clear

# View database statistics
npm run stats
```

## 🚀 Deployment

### Backend Deployment

```bash
cd backend
dotnet publish -c Release -o ./publish
```

### Frontend Deployment

```bash
cd frontend
npm run build
```

The build folder can be deployed to any static hosting service

## 📝 License

This project is for technical assessment purposes.
