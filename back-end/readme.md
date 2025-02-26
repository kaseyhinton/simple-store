# Simple Store

### Application Architecture

```
src/
  ├── db/                // Database-related code
  │    ├── connection.ts // Database connection setup
  │    └── queries.ts    // Database queries
  ├── middleware/        // Middleware functions
  │    ├── enforceOwnership.ts
  │    ├── securityHeaders.ts
  │    ├── validateApiKey.ts
  │    ├── rateLimit.ts
  │    └── index.ts // exports for all middleware
  ├── routes/            // Route handlers
  │    ├── apiKeys.ts
  │    ├── store.ts
  │    ├── meta.ts
  │    └── index.ts // exports for all routes
  ├── types/             // Type definitions
  │    └── index.ts
  ├── utils/             // Utility functions
  │    ├── apiKeys.ts
  │    ├── constants.ts
  │    └── types.ts
  ├── database.sqlite    // Database generated on application startup
  ├── app.ts             // Main application setup
  └── server.ts          // Server initialization
```

### API Overview

# API Overview

This API provides functionality to store, retrieve, and manage JSON data, as well as manage API keys for authentication and rate limiting.

Base URL: http://localhost:3000

Endpoints:

1. Store JSON Data: POST /store/:key
2. Retrieve JSON Data: GET /store/:key
3. Delete JSON Data: DELETE /store/:key
4. Get Metadata: GET /meta/:key
5. Create API Key: POST /api-keys
6. Delete API Key: DELETE /api-keys/:key

Authentication:

- All endpoints (except /api-keys) require an API key in the `x-api-key` header.

Rate Limiting:

- Each API key has a default rate limit of 100 requests per hour.
- Rate limits are enforced using the `x-api-key` header.

## Usage

### Example Usage

=============

1. Create an API Key:
   curl -X POST http://localhost:3000/api-keys \
    -H "Content-Type: application/json" \
    -d '{"key": "your-uuid", "rateLimit": 200}'

2. Store JSON Data:
   curl -X POST http://localhost:3000/store/my-key \
    -H "x-api-key: your-uuid" \
    -H "Content-Type: application/json" \
    -d '{"foo": "bar"}'

3. Retrieve JSON Data:
   curl -X GET http://localhost:3000/store/my-key \
    -H "x-api-key: your-uuid"

4. Delete JSON Data:
   curl -X DELETE http://localhost:3000/store/my-key \
    -H "x-api-key: your-uuid"

5. Get Metadata:
   curl -X GET http://localhost:3000/meta/placeholder \
    -H "x-api-key: your-uuid"

6. Delete API Key:
   curl -X DELETE http://localhost:3000/api-keys/your-uuid

### Store JSON Data

===============

Endpoint: POST /store/:key

Description:
Stores JSON data under a specific key. If the key already exists, the data will be overwritten.

Authentication:

- Requires an API key in the `x-api-key` header.

Rate Limiting:

- Counts towards the API key's rate limit.

Request:

- URL Params:
  - key: The key under which the JSON data will be stored (string).
- Headers:
  - x-api-key: Your API key (string).
- Body:
  - JSON data to store (any valid JSON object).

Response:

- Success (200):
  {
  "message": "Data stored successfully",
  "key": "your-key"
  }
- Error (401):
  {
  "message": "API key is required"
  }
- Error (429):
  {
  "message": "Rate limit exceeded"
  }
- Error (500):
  {
  "message": "Failed to store data",
  "error": "Error message"
  }

Example:
curl -X POST http://localhost:3000/store/my-key \
 -H "x-api-key: your-api-key" \
 -H "Content-Type: application/json" \
 -d '{"foo": "bar"}'

### Retrieve JSON Data

==================

Endpoint: GET /store/:key

Description:
Retrieves JSON data stored under a specific key.

Authentication:

- Requires an API key in the `x-api-key` header.

Rate Limiting:

- Counts towards the API key's rate limit.

Request:

- URL Params:
  - key: The key for the JSON data to retrieve (string).
- Headers:
  - x-api-key: Your API key (string).

Response:

- Success (200):
  The stored JSON data.
- Error (401):
  {
  "message": "API key is required"
  }
- Error (404):
  {
  "message": "Data not found"
  }
- Error (429):
  {
  "message": "Rate limit exceeded"
  }
- Error (500):
  {
  "message": "Failed to retrieve data",
  "error": "Error message"
  }

Example:
curl -X GET http://localhost:3000/store/my-key \
 -H "x-api-key: your-api-key"

### Delete JSON Data

================

Endpoint: DELETE /store/:key

Description:
Deletes JSON data stored under a specific key.

Authentication:

- Requires an API key in the `x-api-key` header.

Rate Limiting:

- Counts towards the API key's rate limit.

Request:

- URL Params:
  - key: The key for the JSON data to delete (string).
- Headers:
  - x-api-key: Your API key (string).

Response:

- Success (200):
  {
  "message": "Data deleted successfully",
  "key": "your-key"
  }
- Error (401):
  {
  "message": "API key is required"
  }
- Error (404):
  {
  "message": "Data not found"
  }
- Error (429):
  {
  "message": "Rate limit exceeded"
  }
- Error (500):
  {
  "message": "Failed to delete data",
  "error": "Error message"
  }

Example:
curl -X DELETE http://localhost:3000/store/my-key \
 -H "x-api-key: your-api-key"

### Get Metadata

============

Endpoint: GET /meta/:key

Description:
Retrieves metadata about the stored JSON data, including total size, number of collections, and timestamps.

Authentication:

- Requires an API key in the `x-api-key` header.

Rate Limiting:

- Counts towards the API key's rate limit.

Request:

- URL Params:
  - key: A placeholder (string). The key is not used but required for consistency.
- Headers:
  - x-api-key: Your API key (string).

Response:

- Success (200):
  {
  "totalSize": 1234,
  "totalCollections": 5,
  "createdAt": "2023-10-01T12:00:00.000Z",
  "updatedAt": "2023-10-01T12:30:00.000Z"
  }
- Error (401):
  {
  "message": "API key is required"
  }
- Error (429):
  {
  "message": "Rate limit exceeded"
  }
- Error (500):
  {
  "message": "Failed to fetch metadata",
  "error": "Error message"
  }

Example:
curl -X GET http://localhost:3000/meta/placeholder \
 -H "x-api-key: your-api-key"

### Create API Key

==============

Endpoint: POST /api-keys

Description:
Creates a new API key with an optional custom rate limit. The API key must be a valid UUID.

Authentication:

- None (this endpoint does not require an API key).

Request:

- Body:
  {
  "key": "your-uuid", // Required: A valid UUID.
  "rateLimit": 100 // Optional: Default is 100 requests per hour.
  }

Response:

- Success (201):
  {
  "message": "API key created successfully",
  "key": "your-uuid"
  }
- Error (400):
  {
  "message": "Invalid API key format. Must be a valid UUID."
  }
- Error (500):
  {
  "message": "Failed to create API key",
  "error": "Error message"
  }

Example:
curl -X POST http://localhost:3000/api-keys \
 -H "Content-Type: application/json" \
 -d '{"key": "your-uuid", "rateLimit": 200}'

### Delete API Key

==============

Endpoint: DELETE /api-keys/:key

Description:
Deletes an API key.

Authentication:

- None (this endpoint does not require an API key).

Request:

- URL Params:
  - key: The API key to delete (string).

Response:

- Success (200):
  {
  "message": "API key deleted successfully",
  "key": "your-uuid"
  }
- Error (404):
  {
  "message": "API key not found"
  }
- Error (500):
  {
  "message": "Failed to delete API key",
  "error": "Error message"
  }

Example:
curl -X DELETE http://localhost:3000/api-keys/your-uuid

### Error Responses

===============

1. Missing API Key (401):
   {
   "message": "API key is required"
   }

2. Invalid API Key (401):
   {
   "message": "Invalid API key"
   }

3. Rate Limit Exceeded (429):
   {
   "message": "Rate limit exceeded"
   }

4. Data Not Found (404):
   {
   "message": "Data not found"
   }

5. Invalid UUID (400):
   {
   "message": "Invalid API key format. Must be a valid UUID."
   }

6. Internal Server Error (500):
   {
   "message": "Internal server error",
   "error": "Error message"
   }
