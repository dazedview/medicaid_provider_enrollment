# Medicaid Provider Enrollment

## Overview
A modern web application for healthcare providers to enroll in the Medicaid program. This module facilitates the entire provider enrollment process, from application submission to administrative review and approval.

## Features
- Provider enrollment application
- User authentication and account management
- Provider profile management
- Application status tracking
- Document upload capabilities
- Administrative review system

## Technology Stack
- **Frontend**
  - React 18
  - TypeScript
  - React Router
  - Formik & Yup for form validation
  - Mantine UI components
  - Vite for development and building
- **Backend**
  - Node.js with Express
  - Sequelize ORM
  - PostgreSQL database
  - JWT authentication

## Directory Structure
```
medicaid_provider_enrollment/
├── src/                  # Frontend source code
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   │   └── admin/        # Admin portal pages
│   ├── services/         # API service functions
│   ├── utils/            # Utility functions
│   └── styles/           # Global styles and themes
│
└── server/               # Backend source code
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── routes/       # API endpoint definitions
    │   ├── models/       # Sequelize models
    │   ├── middleware/   # Express middleware
    │   └── db/           # Database setup and migration
```

## Setup and Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL database

### Installation Steps
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd medicaid_enterprise_system/medicaid_provider_enrollment
   ```

2. Install frontend dependencies
   ```bash
   npm install
   ```

3. Install backend dependencies
   ```bash
   cd server
   npm install
   ```

4. Database Setup
   - Create a PostgreSQL database named 'medicaid_provider'
   ```bash
   createdb medicaid_provider
   ```

### Configuration
1. Create a `.env` file in the server directory
   ```bash
   cd server
   cp .env.example .env
   ```

2. Configure the environment variables
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
   DATA_WAREHOUSE_URL=http://localhost:5005/api/events/provider-enrollment
   ```

## Usage

### Running the Application
1. Start the backend server
   ```bash
   cd server
   npm run dev
   ```

2. In a new terminal, start the frontend
   ```bash
   cd medicaid_provider_enrollment
   npm run dev
   ```

3. Access the application
   - Frontend: http://localhost:5174
   - API: http://localhost:5002

### Available Scripts
- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### User Journey
1. **Provider Registration**: Providers register for an account
2. **Application Submission**: Providers complete the enrollment form
3. **Document Upload**: Providers upload required documentation
4. **Application Review**: Administrators review the application
5. **Approval/Rejection**: Application is approved or rejected
6. **Provider Notification**: Provider is notified of the decision

## API Documentation
The API endpoints are documented in the [API Reference](../docs/API_REFERENCE.md#provider-enrollment-api).

## Integration with Other Modules
This module integrates with other parts of the Medicaid Enterprise System as follows:

1. **Data Warehouse Integration**
   - Sends approved provider data to the Data Warehouse
   - Provider information is made available to the Claims Processing module
   - Real-time event notifications are sent on provider approval

## Troubleshooting
For common issues and their solutions, see the [Troubleshooting Guide](../docs/TROUBLESHOOTING.md#provider-enrollment).

## Contributing
Please see the [Contributing Guide](../CONTRIBUTING.md) for details on how to contribute to this project.

## License
This project is licensed under the MIT License.
