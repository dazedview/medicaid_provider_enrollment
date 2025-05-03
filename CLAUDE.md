# Medicaid Provider Enrollment Portal - Guide for Claude

This document provides a comprehensive overview of the Medicaid Provider Enrollment Portal codebase to help Claude (AI assistant) understand the project structure, functionality, and key components.

## Project Overview

The Medicaid Provider Enrollment Portal is a web application that allows healthcare providers to enroll in the Medicaid program. It features user authentication, provider profile management, application submission and tracking, and an administrative review system.

## Technology Stack

- **Frontend**: React 18, TypeScript, React Router, Formik & Yup, Mantine UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Sequelize ORM
- **Build Tool**: Vite
- **Authentication**: JWT (JSON Web Tokens)

## Codebase Structure

The project follows a client-server architecture:

```
medicaid_provider_enrollment/
├── src/                  # Frontend React application
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── pages/            # Page components (routes)
│   ├── services/         # API service functions
│   ├── styles/           # CSS styles
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main React component
│   └── main.tsx          # Entry point
├── server/               # Backend Node.js application
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── db/           # Database setup and migration
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Sequelize models
│   │   ├── routes/       # Express routes
│   │   ├── utils/        # Utility functions
│   │   └── server.js     # Entry point
│   └── package.json      # Backend dependencies
├── public/               # Static assets
├── package.json          # Frontend dependencies
└── README.md             # Project documentation
```

## Key Components

### Frontend

1. **AuthContext** (`src/context/AuthContext.tsx`)
   - Manages user authentication state
   - Provides login, register, and logout functionality
   - Stores user data and authentication tokens

2. **Layout** (`src/components/Layout.tsx`)
   - Main layout wrapper with Navbar and Footer
   - Provides consistent UI structure across pages

3. **PrivateRoute** (`src/components/PrivateRoute.tsx`)
   - Route protection for authenticated users
   - Redirects unauthenticated users to login

4. **EnrollmentForm** (`src/pages/EnrollmentForm.tsx`)
   - Multi-step form for provider enrollment
   - Collects provider information and documentation
   - Submits application to the backend

5. **Dashboard** (`src/pages/Dashboard.tsx`)
   - Provider dashboard showing application status
   - Lists submitted applications and their statuses

### Backend

1. **Authentication** (`server/src/controllers/auth.js`, `server/src/routes/auth.js`)
   - User registration and login
   - JWT token generation and validation
   - Password hashing with bcrypt

2. **Applications** (`server/src/controllers/applications.js`, `server/src/routes/applications.js`)
   - Application submission and retrieval
   - Status updates and tracking
   - Administrative review functionality

3. **Database Models**
   - User model (`server/src/models/User.js`)
   - Application model (`server/src/models/Application.js`)

4. **Middleware**
   - Authentication middleware (`server/src/middleware/auth.js`)
   - Protects routes requiring authentication

## Database Models

### User Model

```javascript
{
  id: UUID (primary key),
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  organizationName: String (required),
  npi: String (required, 10-digit National Provider Identifier),
  address: String,
  city: String,
  state: String,
  zipCode: String,
  phone: String,
  role: Enum ['provider', 'admin'] (default: 'provider'),
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model

```javascript
{
  id: UUID (primary key),
  userId: UUID (foreign key to User),
  applicationType: String (required),
  status: Enum ['Pending', 'In Review', 'Approved', 'Rejected'] (default: 'Pending'),
  submittedDate: Date (default: now),
  statusUpdateDate: Date (default: now),
  notes: Text,
  formData: JSON (required, contains all application form data),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile

### Applications

- `POST /api/applications` - Submit a new application
- `GET /api/applications` - Get all applications (admin) or user's applications (provider)
- `GET /api/applications/:id` - Get a specific application
- `PUT /api/applications/:id` - Update application status (admin only)

## Authentication Flow

1. User registers or logs in through the frontend
2. Backend validates credentials and returns a JWT token
3. Frontend stores the token in either:
   - localStorage (if "Remember Me" is checked) for persistent login across browser sessions
   - sessionStorage (if "Remember Me" is not checked) for session-only login
4. Token is included in the Authorization header for subsequent API requests
5. Protected routes check for valid token using auth middleware

## Database Initialization

The database is initialized using Sequelize ORM:

1. `server/src/db/config.js` - Sets up the database connection
2. `server/src/db/init.js` - Initializes the database and creates tables
3. `server/src/db/migrate.js` - Handles database migrations

## Environment Variables

The application requires several environment variables:

### Backend (.env in server directory)

```
NODE_ENV=development
PORT=5002
DB_NAME=medicaid_provider
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

> **Note**: The `.env` file is not included in the repository and needs to be created manually. The above template provides the necessary variables.

## Development Workflow

1. Start the backend server: `cd server && npm run dev`
2. Start the frontend development server: `npm run dev`
3. Access the application at http://localhost:5174
4. The API is available at http://localhost:5002

## Common Tasks

### Adding a New API Endpoint

1. Create a controller function in the appropriate controller file
2. Add the route in the corresponding routes file
3. Create a service function in the frontend to call the new endpoint

### Adding a New Page

1. Create a new component in the `src/pages` directory
2. Add the route in `App.tsx`
3. Link to the new page from the navigation or other components

### Database Changes

1. Update the model in `server/src/models`
2. Create a migration in `server/src/db/migrate.js` if needed
3. Run the migration script

## Testing

The application currently does not have automated tests. This would be an area for improvement.
