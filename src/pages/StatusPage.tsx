import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserApplications, Application } from '../services/applications'

const StatusPage = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getUserApplications()
        setApplications(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching applications:', err)
        setError('Failed to load your applications. Please try again later.')
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved'
      case 'in review':
        return 'status-in-review'
      case 'pending':
        return 'status-pending'
      case 'rejected':
        return 'status-rejected'
      default:
        return ''
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div className="loading-container">Loading application status...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="status-page">
      <div className="page-header">
        <h1>Application Status</h1>
        <p>Track the status of your Medicaid provider applications</p>
      </div>

      <div className="card">
        <div className="status-header">
          <h2>Your Applications</h2>
          <Link to="/enroll" className="btn btn-primary">Submit New Application</Link>
        </div>

        {applications.length === 0 ? (
          <div className="no-applications">
            <p>You don't have any applications yet.</p>
            <Link to="/enroll" className="btn btn-primary">Start an Application</Link>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-header">
                  <div>
                    <h3>{app.applicationType}</h3>
                    <span className="application-id">ID: {app.id}</span>
                  </div>
                  <span className={`application-status ${getStatusClass(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                
                <div className="application-details">
                  <div className="detail-row">
                    <div className="detail-label">Submitted:</div>
                    <div className="detail-value">{formatDate(app.submittedDate)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Status Updated:</div>
                    <div className="detail-value">{formatDate(app.statusUpdateDate)}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Notes:</div>
                    <div className="detail-value">{app.notes}</div>
                  </div>
                </div>
                
                <div className="application-actions">
                  <Link to={`/application/${app.id}`} className="btn btn-outline">View Details</Link>
                  {app.status === 'Pending' && (
                    <button className="btn btn-outline">Upload Documents</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="card status-help">
        <h2>Need Help?</h2>
        <p>
          If you have questions about your application status or need assistance, 
          please contact our Provider Enrollment team.
        </p>
        <div className="contact-info">
          <div className="contact-method">
            <strong>Phone:</strong> (555) 123-4567
          </div>
          <div className="contact-method">
            <strong>Email:</strong> provider.enrollment@medicaid.example.gov
          </div>
          <div className="contact-method">
            <strong>Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusPage
