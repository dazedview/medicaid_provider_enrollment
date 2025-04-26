import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome to the Medicaid Provider Portal</h1>
        <p>
          This portal provides healthcare providers with tools to enroll in the Medicaid program,
          manage their information, and track application status.
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="card dashboard-card">
          <h2>Provider Enrollment</h2>
          <p>
            New providers can apply to become a Medicaid provider and existing
            providers can update their information.
          </p>
          <Link to="/enroll" className="btn btn-primary">
            Start Enrollment
          </Link>
        </div>

        <div className="card dashboard-card">
          <h2>Application Status</h2>
          <p>
            Track the status of your provider enrollment application and get
            updates on required documentation.
          </p>
          <Link to="/status" className="btn btn-primary">
            Check Status
          </Link>
        </div>

        <div className="card dashboard-card">
          <h2>Provider Resources</h2>
          <p>
            Access guides, forms, and other resources to help you through the
            enrollment process.
          </p>
          <Link to="/resources" className="btn btn-primary">
            View Resources
          </Link>
        </div>
      </div>

      <div className="dashboard-announcements">
        <h2>Announcements</h2>
        <div className="card">
          <h3>Updated Provider Enrollment Requirements</h3>
          <p>
            Effective January 1, 2025, all providers will need to complete new
            background check requirements. Please check the provider resources
            section for more details.
          </p>
          <span className="announcement-date">Posted: April 23, 2025</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
