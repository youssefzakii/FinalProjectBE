# Admin Endpoints Documentation

## Overview
This document describes the admin-specific endpoints for user management. All admin endpoints require authentication and admin role.

## Authentication
All admin endpoints require:
- Valid JWT token in Authorization header: `Bearer <token>`
- User must have `role: "admin"` in their profile

## Endpoints

### 1. Get All Users (Admin View)
**GET** `/users/admin/all`

Returns all users in the system (without passwords).

**Response:**
```json
[
  {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "Fields": ["Frontend", "React"],
    "avatar": "avatar_url",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Get User Statistics
**GET** `/users/admin/stats`

Returns statistics about users in the system.

**Response:**
```json
{
  "totalUsers": 100,
  "adminUsers": 5,
  "regularUsers": 95,
  "userPercentage": 95,
  "adminPercentage": 5
}
```

### 3. Get Specific User
**GET** `/users/admin/:id`

Returns a specific user by ID.

**Parameters:**
- `id`: User ID (MongoDB ObjectId)

**Response:**
```json
{
  "_id": "user_id",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "Fields": ["Frontend", "React"],
  "avatar": "avatar_url",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Update User
**PUT** `/users/admin/:id`

Updates a specific user's information.

**Parameters:**
- `id`: User ID (MongoDB ObjectId)

**Request Body:**
```json
{
  "username": "new_username",
  "email": "new_email@example.com",
  "password": "new_password",
  "role": "admin",
  "Fields": ["Backend", "Node.js"],
  "avatar": "new_avatar_url"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response:**
```json
{
  "_id": "user_id",
  "username": "new_username",
  "email": "new_email@example.com",
  "role": "admin",
  "Fields": ["Backend", "Node.js"],
  "avatar": "new_avatar_url",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 5. Delete User
**DELETE** `/users/admin/:id`

Deletes a specific user from the system.

**Parameters:**
- `id`: User ID (MongoDB ObjectId)

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "User not authenticated"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Access denied. Admin role required"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Username already exists"
}
```

## Usage Examples

### Using cURL

1. **Get all users:**
```bash
curl -X GET "http://localhost:3000/users/admin/all" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

2. **Get user statistics:**
```bash
curl -X GET "http://localhost:3000/users/admin/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

3. **Get specific user:**
```bash
curl -X GET "http://localhost:3000/users/admin/USER_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

4. **Update a user:**
```bash
curl -X PUT "http://localhost:3000/users/admin/USER_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_username",
    "role": "admin"
  }'
```

5. **Delete a user:**
```bash
curl -X DELETE "http://localhost:3000/users/admin/USER_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript/Fetch

```javascript
const token = 'YOUR_JWT_TOKEN';
const userId = 'USER_ID';

// Get all users
fetch('http://localhost:3000/users/admin/all', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log(data));

// Get user statistics
fetch('http://localhost:3000/users/admin/stats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log(data));

// Update user
fetch(`http://localhost:3000/users/admin/${userId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'new_username',
    role: 'admin'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Security Notes

1. **Role Validation:** All admin endpoints check for admin role before processing requests.
2. **Password Hashing:** When updating passwords, they are automatically hashed using bcrypt.
3. **Unique Constraints:** Username and email uniqueness are validated before updates.
4. **No Password Exposure:** Passwords are never returned in responses.
5. **Authentication Required:** All endpoints require valid JWT token.

## Testing

You can test these endpoints using:
- Swagger UI: `http://localhost:3000/api-docs`
- Postman
- cURL
- Any HTTP client

Make sure to:
1. Login as an admin user to get a valid JWT token
2. Include the token in the Authorization header
3. Use the correct user IDs for specific user operations 