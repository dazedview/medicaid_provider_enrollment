import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getApplicationById, Application } from '../services/applications'

const ApplicationDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        if (!id) {
          throw new Error('Application ID is required')
        }
        const data = await getApplicationById(id)
        setApplication(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching application:', err)
        setError('Failed to load application details. Please try again later.')
        setLoading(false)
      }
    }

    fetchApplication()
  }, [id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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

  if (loading) {
    return <div className="loading-container">Loading application details...</div>
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/status" className="btn btn-primary">
          Back to Applications
        </Link>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="error-container">
        <h2>Application Not Found</h2>
        <p>The application you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/status" className="btn btn-primary">
          Back to Applications
        </Link>
      </div>
    )
  }

  return (
    <div className="application-detail-page">
      <div className="page-header">
        <h1>Application Details</h1>
        <Link to="/status" className="btn btn-outline">
          Back to Applications
        </Link>
      </div>

      <div className="card">
        <div className="application-header">
          <div>
            <h2>{application.applicationType}</h2>
            <span className="application-id">ID: {application.id}</span>
          </div>
          <span className={`application-status ${getStatusClass(application.status)}`}>
            {application.status}
          </span>
        </div>

        <div className="application-timeline">
          <div className="timeline-item">
            <div className="timeline-date">{formatDate(application.submittedDate)}</div>
            <div className="timeline-content">
              <h3>Application Submitted</h3>
              <p>Your application has been successfully submitted for review.</p>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-date">{formatDate(application.statusUpdateDate)}</div>
            <div className="timeline-content">
              <h3>Status Updated to {application.status}</h3>
              <p>{application.notes}</p>
            </div>
          </div>
        </div>

        <div className="section-header">
          <h3>Application Information</h3>
        </div>

        <div className="application-form-data">
          {Object.entries(application.formData || {}).map(([key, value]) => (
            <div key={key} className="form-data-item">
              <div className="form-data-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
              <div className="form-data-value">
                {typeof value === 'object' 
                  ? JSON.stringify(value) 
                  : String(value)}
              </div>
            </div>
          ))}
        </div>

        <div className="application-actions">
          {application.status === 'Pending' && (
            <button className="btn btn-primary">Upload Supporting Documents</button>
          )}
          <button className="btn btn-outline">Download Application PDF</button>
          <button className="btn btn-outline">Contact Support</button>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailPage
