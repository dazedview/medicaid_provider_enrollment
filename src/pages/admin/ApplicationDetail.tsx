import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  getAdminApplicationById, 
  updateApplicationStatus, 
  Application,
  ApplicationStatusUpdate 
} from '../../services/applications';
import { deleteApplication } from '../../services/admin';

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getAdminApplicationById(id);
        setApplication(data);
        setStatus(data.status);
        setNotes(data.notes || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching application:', err);
        setError('Failed to load application details. Please try again later.');
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setUpdateSuccess(false);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setUpdateSuccess(false);
  };

  const handleDeleteApplication = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await deleteApplication(id);
      navigate('/admin/applications', { state: { message: 'Application deleted successfully' } });
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('Failed to delete application. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      setIsUpdating(true);
      
      const statusData: ApplicationStatusUpdate = {
        status: status as 'Pending' | 'In Review' | 'Approved' | 'Rejected',
        notes: notes
      };
      
      const updatedApplication = await updateApplicationStatus(id, statusData);
      setApplication(updatedApplication);
      setUpdateSuccess(true);
      setIsUpdating(false);
    } catch (err) {
      console.error('Error updating application status:', err);
      setError('Failed to update application status. Please try again.');
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading-container">Loading application details...</div>;
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
    );
  }

  if (!application) {
    return (
      <div className="not-found-container">
        <h2>Application Not Found</h2>
        <p>The application you are looking for does not exist or has been removed.</p>
        <Link to="/admin/applications" className="btn btn-primary">
          Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="application-detail">
      <div className="page-header">
        <div className="header-content">
          <h1>Application Details</h1>
          <span className={`status-badge status-${application.status.toLowerCase().replace(' ', '-')}`}>
            {application.status}
          </span>
        </div>
        <div className="header-actions">
          <Link to="/admin/applications" className="btn btn-outline">
            Back to Applications
          </Link>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <div className="delete-confirmation-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this application? This action cannot be undone.</p>
            <div className="delete-confirmation-actions">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="btn btn-outline"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteApplication} 
                className="btn btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="detail-grid">
        <div className="card application-info">
          <h2>Application Information</h2>
          <div className="detail-row">
            <div className="detail-label">Application ID:</div>
            <div className="detail-value">{application.id}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Type:</div>
            <div className="detail-value">{application.applicationType}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Submitted:</div>
            <div className="detail-value">{formatDate(application.submittedDate)}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Last Updated:</div>
            <div className="detail-value">{formatDate(application.statusUpdateDate)}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Current Status:</div>
            <div className="detail-value">
              <span className={`status-badge status-${application.status.toLowerCase().replace(' ', '-')}`}>
                {application.status}
              </span>
            </div>
          </div>
          {application.status === 'Approved' && application.medicaidProviderId && (
            <div className="detail-row">
              <div className="detail-label">Medicaid Provider ID:</div>
              <div className="detail-value highlight-value">{application.medicaidProviderId}</div>
            </div>
          )}
        </div>

        <div className="card provider-info">
          <h2>Provider Information</h2>
          {application.user ? (
            <>
              <div className="detail-row">
                <div className="detail-label">Name:</div>
                <div className="detail-value">{`${application.user.firstName} ${application.user.lastName}`}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Email:</div>
                <div className="detail-value">{application.user.email}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Organization:</div>
                <div className="detail-value">{application.user.organizationName}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">NPI:</div>
                <div className="detail-value">{application.user.npi}</div>
              </div>
              {application.user.address && (
                <div className="detail-row">
                  <div className="detail-label">Address:</div>
                  <div className="detail-value">
                    {application.user.address}<br />
                    {application.user.city}, {application.user.state} {application.user.zipCode}
                  </div>
                </div>
              )}
              {application.user.phone && (
                <div className="detail-row">
                  <div className="detail-label">Phone:</div>
                  <div className="detail-value">{application.user.phone}</div>
                </div>
              )}
              <div className="detail-actions">
                <Link to={`/admin/users/${application.user.id}`} className="btn btn-outline btn-sm">
                  View Provider Profile
                </Link>
              </div>
            </>
          ) : (
            <p>Provider information not available</p>
          )}
        </div>
      </div>

      <div className="card application-form-data">
        <h2>Application Form Data</h2>
        <pre className="json-viewer">
          {JSON.stringify(application.formData, null, 2)}
        </pre>
      </div>

      <div className="card update-status">
        <h2>Update Application Status</h2>
        {updateSuccess && (
          <div className="success-message">
            Application status updated successfully!
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={status}
              onChange={handleStatusChange}
              className="form-control"
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes:</label>
            <textarea
              id="notes"
              value={notes}
              onChange={handleNotesChange}
              className="form-control"
              rows={4}
              placeholder="Add notes about this application status update..."
            ></textarea>
          </div>
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>

      <div className="card danger-zone">
        <h2>Danger Zone</h2>
        <p>
          Deleting this application will permanently remove it from the system.
          This action cannot be undone.
        </p>
        <button 
          onClick={() => setShowDeleteConfirm(true)} 
          className="btn btn-danger"
          disabled={isDeleting}
        >
          Delete Application
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetail;
