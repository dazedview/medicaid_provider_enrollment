import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplicationStats, AdminStats } from '../../services/admin';
import { getAllApplications, Application } from '../../services/applications';

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats and recent applications in parallel
        const [statsData, applicationsData] = await Promise.all([
          getApplicationStats(),
          getAllApplications()
        ]);
        
        setStats(statsData);
        
        // Get the 5 most recent applications
        const sortedApplications = applicationsData.sort((a, b) => 
          new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
        );
        setRecentApplications(sortedApplications.slice(0, 5));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading-container">Loading dashboard data...</div>;
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

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of system statistics and recent activity</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card card">
            <h3>Total Users</h3>
            <div className="stat-value">{stats.users.total}</div>
            <Link to="/admin/users" className="btn btn-outline btn-sm">
              View All Users
            </Link>
          </div>

          <div className="stat-card card">
            <h3>Total Applications</h3>
            <div className="stat-value">{stats.applications.total}</div>
            <div className="stat-subtext">
              {stats.applications.recent} in the last 30 days
            </div>
            <Link to="/admin/applications" className="btn btn-outline btn-sm">
              View All Applications
            </Link>
          </div>

          <div className="stat-card card">
            <h3>Applications by Status</h3>
            <div className="status-stats">
              <div className="status-stat">
                <span className="status-label">Pending:</span>
                <span className="status-value">{stats.applications.byStatus.pending}</span>
              </div>
              <div className="status-stat">
                <span className="status-label">In Review:</span>
                <span className="status-value">{stats.applications.byStatus.inReview}</span>
              </div>
              <div className="status-stat">
                <span className="status-label">Approved:</span>
                <span className="status-value">{stats.applications.byStatus.approved}</span>
              </div>
              <div className="status-stat">
                <span className="status-label">Rejected:</span>
                <span className="status-value">{stats.applications.byStatus.rejected}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Recent Applications</h2>
          <Link to="/admin/applications" className="btn btn-primary btn-sm">
            View All
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Provider</th>
                  <th>Type</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id.substring(0, 8)}...</td>
                    <td>
                      {app.user ? 
                        `${app.user.firstName} ${app.user.lastName}` : 
                        'Unknown'}
                    </td>
                    <td>{app.applicationType}</td>
                    <td>{formatDate(app.submittedDate)}</td>
                    <td>
                      <span className={`status-badge status-${app.status.toLowerCase().replace(' ', '-')}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <Link 
                        to={`/admin/applications/${app.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
