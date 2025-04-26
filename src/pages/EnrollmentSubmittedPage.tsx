import { Link } from 'react-router-dom'

const EnrollmentSubmittedPage = () => {
  return (
    <div className="enrollment-submitted-page">
      <div className="page-header">
        <h1>Enrollment Submitted Successfully</h1>
        <p>Thank you for submitting your Medicaid provider enrollment application</p>
      </div>
      
      <div className="card">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h2>Your Application Has Been Received</h2>
        
        <div className="confirmation-details">
          <p>
            Your Medicaid provider enrollment application has been successfully submitted. 
            Our team will review your application and may contact you if additional information is needed.
          </p>
          
          <div className="next-steps">
            <h3>What Happens Next?</h3>
            <ol>
              <li>Our enrollment team will review your application (typically within 5-7 business days)</li>
              <li>You may be contacted for additional documentation or clarification if needed</li>
              <li>Once approved, you will receive an official enrollment confirmation by email</li>
              <li>Your provider credentials and billing information will be activated in our system</li>
            </ol>
          </div>
          
          <div className="confirmation-actions">
            <p>You can check the status of your application in your provider dashboard.</p>
            <div className="button-group">
              <Link to="/status" className="btn btn-primary">View Application Status</Link>
              <Link to="/" className="btn btn-outline">Return to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentSubmittedPage
