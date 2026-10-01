# Shipment Management API

## Overview

A production-style backend REST API for an EXIM/Transport product. It lets you manage **customers** and their **shipments**, track shipment status through its lifecycle, and upload invoice documents linked to each shipment.

Built with Node.js, Express.js, MongoDB, and JWT authentication.

---

## Features

- JWT-based authentication (register + login)
- Full CRUD for Customers
- Full CRUD for Shipments with status tracking
- Invoice file upload (PDF/JPEG/PNG, max 5 MB) linked to a shipment
- Zod request validation on every write endpoint
- Consistent JSON error responses with correct HTTP status codes
- Pagination and search/filter on list endpoints
- MongoDB ObjectId validation middleware

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Validation | Zod |
| Authentication | JSON Web Tokens (JWT) |
| File Upload | Multer (local storage / S3-ready) |
| Password Hashing | bcryptjs |
| Logging | Morgan (HTTP) + custom logger |

---

## Architecture / Request Flow

```
Client
  │
  ▼
Express App (app.js)
  │
  ├── Morgan HTTP Logger
  ├── CORS + JSON body parser
  │
  ├── /api/auth      → auth.routes     → auth.controller     → auth.service     → User model
  ├── /api/customers → customer.routes → customer.controller → customer.service → Customer model
  └── /api/shipments → shipment.routes → shipment.controller → shipment.service → Shipment model
                                                                                      │
                                                                               upload.middleware
                                                                               (Multer → local/S3)
  │
  └── Global Error Handler (error.middleware)
```

---

## Folder Structure

```
shipment-management-api/
├── src/
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Entry point — DB connect + server start
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── user.model.js         # User (for auth)
│   │   ├── customer.model.js     # Customer
│   │   └── shipment.model.js     # Shipment + invoiceFile sub-document
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── customer.controller.js
│   │   └── shipment.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── customer.service.js
│   │   └── shipment.service.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── customer.routes.js
│   │   └── shipment.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT protect
│   │   ├── error.middleware.js    # Global error handler + Zod validate()
│   │   ├── upload.middleware.js   # Multer config
│   │   └── validateId.middleware.js
│   ├── validations/
│   │   ├── auth.validation.js
│   │   ├── customer.validation.js
│   │   └── shipment.validation.js
│   └── utils/
│       ├── apiError.js
│       ├── apiResponse.js
│       └── logger.js
├── uploads/
│   └── invoices/                 # Local invoice file storage (git-ignored)
├── postman_collection.json
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=5000
NODE_ENV=development

MONGO_URL=mongodb://localhost:27017/shipment-db

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# AWS S3 (optional — leave blank to use local file storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=
```

---

## Installation & Running

```bash
# Clone and install
git clone <repo-url>
cd shipment-management-api
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start development server (with nodemon)
npm run dev

# Server starts at http://localhost:5000
```

---

## API Endpoint Reference

### Auth

| Method | URL | Purpose | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT token | No |

**Sample Login Request:**
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "secret123"
}
```
**Sample Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "_id": "...", "name": "Admin User", "email": "admin@example.com", "role": "admin" }
  }
}
```

---

### Customers

All endpoints require `Authorization: Bearer <token>` header.

| Method | URL | Purpose |
|---|---|---|
| POST | `/api/customers` | Create a customer |
| GET | `/api/customers` | List customers (paginated) |
| GET | `/api/customers/:id` | Get a single customer |
| PUT | `/api/customers/:id` | Update a customer |

**Query params for GET /api/customers:** `page`, `limit`, `search`, `isActive`

**Sample Create Customer Request:**
```json
POST /api/customers
{
  "name": "Ravi Sharma",
  "email": "ravi@example.com",
  "phone": "9876543210",
  "address": "12 MG Road, Bengaluru",
  "companyName": "Sharma Exports Pvt Ltd"
}
```

---

### Shipments

All endpoints require `Authorization: Bearer <token>` header.

| Method | URL | Purpose |
|---|---|---|
| POST | `/api/shipments` | Create a shipment |
| GET | `/api/shipments` | List shipments (paginated) |
| GET | `/api/shipments/:id` | Get shipment details |
| PUT | `/api/shipments/:id` | Update shipment |
| DELETE | `/api/shipments/:id` | Delete shipment |
| POST | `/api/shipments/:id/invoice` | Upload invoice file |

**Query params for GET /api/shipments:** `page`, `limit`, `status`, `shipmentType`, `customerId`, `search`

**Sample Create Shipment Request:**
```json
POST /api/shipments
{
  "customerId": "64a1f...",
  "invoiceNumber": "INV-2024-001",
  "invoiceValue": 150000,
  "currency": "INR",
  "origin": "Mumbai",
  "destination": "Chennai",
  "vehicleNumber": "MH12AB1234",
  "shipmentType": "Export"
}
```

**Shipment Status Values:** `Created` → `In Transit` → `Delivered` / `Cancelled`

---

### Invoice Upload

```
POST /api/shipments/:id/invoice
Content-Type: multipart/form-data
Authorization: Bearer <token>

form field: invoice  (file)
```

- Accepted types: PDF, JPEG, PNG
- Max size: 5 MB
- File saved locally at `uploads/invoices/`
- The file path/URL is saved on the shipment document

---

## Database Schema

### User
| Field | Type | Notes |
|---|---|---|
| name | String | Required |
| email | String | Required, unique |
| password | String | Hashed with bcrypt, not returned in queries |
| role | String | `admin` or `user` |
| isActive | Boolean | Default true |

### Customer
| Field | Type | Notes |
|---|---|---|
| name | String | Required |
| email | String | Required, unique |
| phone | String | Required |
| address | String | Required |
| companyName | String | Optional |
| isActive | Boolean | Default true |

### Shipment
| Field | Type | Notes |
|---|---|---|
| customerId | ObjectId | References Customer (required) |
| invoiceNumber | String | Required |
| invoiceValue | Number | Required, positive |
| currency | String | Default `INR` |
| origin | String | Required |
| destination | String | Required |
| vehicleNumber | String | Required, stored uppercase |
| shipmentType | String | `Import` or `Export` |
| status | String | `Created` / `In Transit` / `Delivered` / `Cancelled` |
| description | String | Optional |
| invoiceFile | Object | Sub-document with file metadata |

**Customer–Shipment relationship:** One customer can have many shipments. `customerId` on Shipment is a foreign key reference to the Customer collection.

### Indexes Added

| Collection | Field(s) | Reason |
|---|---|---|
| User | email | Fast login lookup |
| Customer | email | Duplicate check + lookup |
| Customer | name | Search by name |
| Customer | isActive | Filter active customers |
| Shipment | customerId | Fetch shipments per customer |
| Shipment | status | Filter by status |
| Shipment | shipmentType | Filter Import/Export |
| Shipment | createdAt (desc) | Default sort (newest first) |

---

## Authentication Flow

1. Call `POST /api/auth/register` to create a user account.
2. Call `POST /api/auth/login` with email + password. The server verifies the password against the bcrypt hash and returns a signed JWT.
3. Include the token in every subsequent request as `Authorization: Bearer <token>`.
4. The `protect` middleware extracts and verifies the token on every protected route. If missing or expired it returns `401`.

---

## Invoice Upload Flow

1. Ensure the shipment exists.
2. `POST /api/shipments/:id/invoice` with `multipart/form-data`, field name `invoice`.
3. Multer validates MIME type (PDF/JPEG/PNG) and file size (≤ 5 MB).
4. File is saved to `uploads/invoices/` locally.
5. File metadata (name, size, MIME type, path, URL) is stored in the `invoiceFile` sub-document on the Shipment.
6. The file is accessible at `GET /uploads/invoices/<filename>`.

### Switching to AWS S3

When AWS credentials are set in `.env`, replace the `diskStorage` in `upload.middleware.js` with `multer-s3`:

```js
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.AWS_REGION });

const s3Storage = multerS3({
  s3,
  bucket: process.env.AWS_S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    cb(null, `invoices/${Date.now()}-${file.originalname}`);
  },
});
```

The controller already reads `req.file.location` (S3 URL) if present, so no controller changes are needed.

---

## Error Response Format

All errors return a consistent JSON shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please enter a valid email" }
  ]
}
```

---

## Testing with Postman

1. Import `postman_collection.json` into Postman.
2. Set the `base_url` collection variable to `http://localhost:5000`.
3. Run **Register User**, then **Login (Valid)** — the token is auto-saved to the `token` variable.
4. All other requests use `{{token}}` automatically.

### Test Cases Included

| # | Test | Expected |
|---|---|---|
| 1 | Login with valid credentials | `200` + JWT token |
| 2 | Login with wrong password | `401` Unauthorized |
| 3 | Create customer (missing fields) | `400` Validation error |
| 4 | Access customers without token | `401` Unauthorized |
| 5 | Get shipment with invalid ID format | `400` Invalid ID |
| 6 | Upload invoice file | `200` + updated shipment |

---

## Sample Credentials (Dummy)

```
Email:    admin@example.com
Password: secret123
```

---

## Assumptions

- A user (auth account) and a customer are separate entities. A user is a system operator; a customer is a business entity in the shipment domain.
- Soft-delete is not implemented for shipments — `DELETE` permanently removes the record.
- Local file storage is the default; S3 is opt-in via env variables.
- There is no email verification flow for registration.

## Known Issues

- The `uploads/invoices/` directory is not git-tracked. Add it to `.gitignore` to avoid committing uploaded files.

## Future Improvements

- Add AWS S3 integration with `multer-s3`
- Add role-based access control (admin-only routes)
- Add soft-delete for shipments
- Add email notification on status change
- Add unit and integration tests (Jest + Supertest)
- Add rate limiting and helmet for security hardening
