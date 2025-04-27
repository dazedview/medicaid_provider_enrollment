import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-page">
      <div className="card">
        <h1>Access Denied</h1>
        <div className="unauthorized-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <p>
          You do not have permission to access this page. This area is restricted
          to administrators only.
        </p>
        <p>
          If you believe you should have access to this page, please contact the
          system administrator.
        </p>
        <div className="unauthorized-actions">
          <Link to="/" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
