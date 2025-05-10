# Medicaid Provider Enrollment

## Overview
A modern web application for healthcare providers to enroll in the Medicaid program. This module facilitates the entire provider enrollment process, from application submission to administrative review and approval, with real-time integration with the Medicaid Enterprise Data Warehouse.

## Features
- **Provider Portal**
  - Provider enrollment application
  - User authentication and account management
  - Provider profile management
  - Application status tracking
  - Document upload capabilities
  - Real-time status updates
- **Admin Portal**
  - Administrative review system
  - Provider verification tools
  - Document review interface
  - Bulk processing capabilities
  - Provider search and filtering
- **Data Warehouse Integration**
  - Real-time provider data synchronization
  - Provider status tracking
  - Historical data preservation
  - Event-based notifications

## Technology Stack
- **Frontend**
  - React 18 with TypeScript
  - Mantine UI components
  - React Router for navigation
  - Formik & Yup for form validation
  - Axios for API communication
  - Vite for development and building
- **Backend**
  - Node.js (v18+) with Express
  - TypeScript
  - Sequelize ORM
  - PostgreSQL (v14+)
  - JWT authentication
  - Event-driven architecture

## Directory Structure
```
medicaid_provider_enrollment/
├── src/                  # Frontend source code
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Shared components
│   │   ├── forms/        # Form components
│   │   └── layout/       # Layout components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin portal pages
│   │   └── provider/     # Provider portal pages
│   ├── services/         # API service functions
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── styles/           # Global styles and themes
│
└── server/               # Backend source code
    ├── src/
    │   ├── config/       # Configuration files
    │   ├── controllers/  # Route controllers
    │   ├── routes/       # API endpoint definitions
    │   ├── models/       # Sequelize models
    │   ├── services/     # Business logic
    │   ├── middleware/   # Express middleware
    │   ├── utils/        # Utility functions
    │   └── db/           # Database setup and migration
    └── tests/            # Backend tests
```

## Setup and Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn
- Access to the Medicaid Enterprise Data Warehouse

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
   ```bash
   # Create a PostgreSQL database named 'medicaid_provider'
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
   # Server will run on http://localhost:5002
   ```

2. In a new terminal, start the frontend
   ```bash
   cd medicaid_provider_enrollment
   npm run dev
   # Frontend will run on http://localhost:5174
   ```

### Provider Portal
- Register at http://localhost:5174/register
- Apply for enrollment at http://localhost:5174/apply
- Check application status at http://localhost:5174/status
- Manage profile at http://localhost:5174/profile

### Admin Portal
- Admin dashboard at http://localhost:5174/admin
- Review applications at http://localhost:5174/admin/applications
- Manage providers at http://localhost:5174/admin/providers
- View provider details at http://localhost:5174/admin/providers/:id

### Provider Enrollment Process
The application includes a comprehensive provider enrollment system that:
- Validates provider credentials and qualifications
- Manages required documentation
- Tracks application status in real-time
- Integrates with Data Warehouse for provider verification
- Sends notifications for status changes

## Data Warehouse Integration

This module integrates with the Medicaid Enterprise Data Warehouse for provider data. For detailed information about the integration, see [README_DW_INTEGRATION.md](./README_DW_INTEGRATION.md).

Key integration points:
1. **Provider Data**: Sent to Data Warehouse upon approval
2. **Status Updates**: Real-time provider status synchronization
3. **Event Notifications**: Provider enrollment events propagated to other modules

## API Documentation
The API endpoints are documented in the [API Reference](../docs/API_REFERENCE.md#provider-enrollment-api).

## Troubleshooting
For common issues and their solutions, see the [Troubleshooting Guide](../docs/TROUBLESHOOTING.md#provider-enrollment).

## Production Deployment
1. Build the frontend
   ```bash
   npm run build
   ```

2. Compile the backend TypeScript
   ```bash
   cd server
   npm run build
   ```

3. Set appropriate environment variables for production

4. Start the services
   - Backend Server (Node.js)
   - Frontend (served via Nginx or similar)

## Contributing
Please see the [Contributing Guide](../CONTRIBUTING.md) for details on how to contribute to this project.

## License
This project is licensed under the MIT License.
