import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUserById, deleteUser } from '../../services/admin';
import { UserData } from '../../services/auth';

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteUser = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await deleteUser(id);
      navigate('/admin/users', { state: { message: 'User deleted successfully' } });
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getUserById(id);
        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user details. Please try again later.');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading-container">Loading user details...</div>;
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

  if (!user) {
    return (
      <div className="not-found-container">
        <h2>User Not Found</h2>
        <p>The user you are looking for does not exist or has been removed.</p>
        <Link to="/admin/users" className="btn btn-primary">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="user-detail">
      <div className="page-header">
        <div className="header-content">
          <h1>User Details</h1>
          <span className={`role-badge role-${user.role}`}>
            {user.role}
          </span>
        </div>
        <div className="header-actions">
          <Link to="/admin/users" className="btn btn-outline">
            Back to Users
          </Link>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <div className="delete-confirmation-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            <p><strong>Warning:</strong> Deleting this user will also delete all their applications.</p>
            <div className="delete-confirmation-actions">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="btn btn-outline"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteUser} 
                className="btn btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Personal Information</h2>
        <div className="detail-row">
          <div className="detail-label">Name:</div>
          <div className="detail-value">{`${user.firstName} ${user.lastName}`}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Email:</div>
          <div className="detail-value">{user.email}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Organization:</div>
          <div className="detail-value">{user.organizationName}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">NPI:</div>
          <div className="detail-value">{user.npi}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Role:</div>
          <div className="detail-value">
            <span className={`role-badge role-${user.role}`}>
              {user.role}
            </span>
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Registered:</div>
          <div className="detail-value">{formatDate(user.createdAt)}</div>
        </div>
      </div>

      <div className="card">
        <h2>Contact Information</h2>
        <div className="detail-row">
          <div className="detail-label">Address:</div>
          <div className="detail-value">
            {user.address ? (
              <>
                {user.address}<br />
                {user.city}, {user.state} {user.zipCode}
              </>
            ) : (
              'Not provided'
            )}
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Phone:</div>
          <div className="detail-value">{user.phone || 'Not provided'}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>User Applications</h2>
          <Link to={`/admin/applications?userId=${user.id}`} className="btn btn-primary btn-sm">
            View All Applications
          </Link>
        </div>
        <p>
          View all applications submitted by this provider in the Applications Management section.
        </p>
      </div>

      <div className="card danger-zone">
        <h2>Danger Zone</h2>
        <p>
          Deleting this user will permanently remove their account and all associated data, including applications.
          This action cannot be undone.
        </p>
        <button 
          onClick={() => setShowDeleteConfirm(true)} 
          className="btn btn-danger"
          disabled={isDeleting}
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default UserDetail;
