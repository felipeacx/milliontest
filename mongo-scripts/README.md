# MongoDB Scripts

Node.js scripts to setup and manage the MongoDB database for the Million Properties project.

## Prerequisites

- MongoDB running on `localhost:27017`
- Node.js (v16+)
- database named `technicaldb`
- collections: `properties`, `owners`, `categories`

## Quick Start

```bash
npm install
npm run populate
```

## Scripts

- `npm run populate` - Populate database with sample data
- `npm run query` - Run sample queries
- `npm run stats` - Show database statistics
- `npm run clear` - Clear all data

## Files

- `populate.js` - Creates database with sample properties and owners
- `queries.js` - Demonstrates MongoDB queries
- `stats.js` - Shows database statistics
- `clear-db.js` - Clears all collections
- `sampleData.js` - Sample data definitions

## Database Configuration

Default connection: `mongodb://localhost:27017/technicaldb`

Edit `config.js` to change database settings.
