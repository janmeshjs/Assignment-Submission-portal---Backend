# Assignment Submission Portal - Backend

## Overview

The Assignment Submission Portal is a simple backend system that allows users (students) to register, log in, and upload assignments. Admins can log in, view all assignments, and either accept or reject them. The system is built using Node.js, Express, MongoDB, and JSON Web Tokens (JWT) for authentication.

## Features

- **User Registration**: Users can register by providing a username and password.
- **User Login**: Registered users can log in to upload assignments.
- **Assignment Upload**: Users can upload assignments, which are tagged to admins for review.
- **Admin Registration & Login**: Admins can register and log in to view, accept, or reject assignments.
- **JWT Authentication**: Both users and admins are authenticated using JWT tokens.
- **Admin Actions**: Admins can accept or reject assignments submitted by users.

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens) for authentication
- Bcrypt for password hashing

## Requirements

- Node.js (v14.x or higher)
- MongoDB (local or cloud-based e.g., MongoDB Atlas)
- Git
- Environment variables (.env file)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/janmeshjs/assignment-submission-portal.git
cd assignment-submission-portal
```
### 2. Install Dependencies

Navigate to the project root directory and run the following command to install the required dependencies:

```
npm install
```

### 3. Setup Environment Variables

Create a .env file in the root directory with the following variables:
```
MONGO_URI= your_mongodb_uri
JWT_SECRET= your_jwt_secret_key
PORT=5000
```
### 4. Start the Server
To start the server in development mode, run:
```
node app.js
```
The server should start on the port specified in the .env file (default is 5000).


### 5. API Endpoints

#### 5.1 User Endpoints

| HTTP Method | Endpoint                   | Description                       |
|-------------|----------------------------|-----------------------------------|
| POST        | `/users/register`          | Register a new user               |
| POST        | `/users/login`             | Log in as a user                  |
| POST        | `/users/upload`            | Upload an assignment              |
| GET         | `/users/admins`            | Get all admins                    |


#### 5.2 Admin Endpoints

| HTTP Method | Endpoint                   | Description                        |
|-------------|----------------------------|------------------------------------|
| POST        | `/admins/register`         | Register a new admin               |
| POST        | `/admins/login`            | Log in as an admin                 |
| GET         | `/assignments`             | Get assignments for logged-in admin|
| POST        | `/assignments/:id/accept`  | Accept an assignment               |
| POST        | `/assignments/:id/reject`  | Reject an assignment               |


## Validation

Input validation is performed for all user and admin-related actions. The following validations are implemented:

- **User Registration**: Checks that both username and password are provided and that the username is unique.
- **User Login**: Validates that the username and password are provided.
- **Assignment Upload**: Ensures that all required fields (userId, task, adminId) are present.
- **Admin Registration**: Checks for valid username and password inputs.
- **Admin Login**: Validates username and password inputs.

Invalid input will result in a response with a `400` status code and an appropriate error message.

## Error Handling

The system includes centralized error handling that responds with appropriate HTTP status codes and messages. Common errors include:

- **404 Not Found**: Returned when a requested resource does not exist (e.g., non-existent user or admin).
- **401 Unauthorized**: Returned for invalid credentials during login.
- **500 Internal Server Error**: Returned for unexpected errors during operations.

Errors are logged to the console for debugging purposes, while users receive a clean error message in the response.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.




