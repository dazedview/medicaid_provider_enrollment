# Medicaid Provider Enrollment Portal

> **Note for Claude**: For a comprehensive overview of this codebase's structure and functionality, please refer to the CLAUDE.md file in this repository.

A modern web application for healthcare providers to enroll in the Medicaid program.

## Features

- Provider enrollment application
- User authentication
- Provider profile management
- Application status tracking
- Document upload capabilities
- Administrative review system

## Technology Stack

- React 18
- TypeScript
- React Router
- Formik & Yup for form validation
- Mantine UI components
- Vite for development and building

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/medicaid-provider-enrollment.git
cd medicaid-provider-enrollment
```

2. Install frontend dependencies
```
npm install
```

3. Install backend dependencies
```
cd server
npm install
cd ..
```

4. Database Setup
   - Create a PostgreSQL database named 'medicaid_provider'
   - Create a `server/.env` file with the following variables:
     ```
     NODE_ENV=development
     PORT=5001
     DB_NAME=medicaid_provider
     DB_USER=your_db_username
     DB_PASSWORD=your_db_password
     DB_HOST=localhost
     DB_PORT=5432
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRE=30d
     ```
   - The application will automatically create the necessary tables on startup

### Running the Application

1. Start the backend server
```
cd server
npm run dev
```

2. In a new terminal, start the frontend
```
cd medicaid-provider-enrollment
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite's default port) and the API at `http://localhost:5001`.

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Application Structure

- `src/components` - Reusable UI components (Layout, Navbar, Footer, route protection)
- `src/context` - React context providers (AuthContext for authentication)
- `src/pages` - Page components that correspond to routes
  - Regular user pages (Dashboard, EnrollmentForm, etc.)
  - Admin pages in `src/pages/admin/` (AdminDashboard, UserManagement, etc.)
- `src/services` - API service functions for auth, applications, and admin
- `src/utils` - Utility functions and helpers
- `src/styles` - Global styles and themes
- `server/src/controllers` - Backend route controllers
- `server/src/routes` - Express routes defining API endpoints
- `server/src/models` - Sequelize models for database entities
- `server/src/middleware` - Express middleware (including authentication)
- `server/src/db` - Database setup, initialization, and migration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
