import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllApplications, Application } from '../../services/applications';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getAllApplications();
        setApplications(data);
        setFilteredApplications(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    // Apply filters whenever search term or status filter changes
    let result = applications;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        app => 
          app.id.toLowerCase().includes(term) ||
          app.applicationType.toLowerCase().includes(term) ||
          (app.user?.firstName?.toLowerCase().includes(term) || false) ||
          (app.user?.lastName?.toLowerCase().includes(term) || false) ||
          (app.user?.email?.toLowerCase().includes(term) || false) ||
          (app.user?.organizationName?.toLowerCase().includes(term) || false) ||
          (app.user?.npi?.includes(term) || false)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status.toLowerCase().replace(' ', '-') === statusFilter);
    }
    
    setFilteredApplications(result);
  }, [searchTerm, statusFilter, applications]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading-container">Loading applications...</div>;
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
    <div className="application-management">
      <div className="page-header">
        <h1>Application Management</h1>
        <p>View and manage provider enrollment applications</p>
      </div>

      <div className="card">
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <div className="filter-box">
            <label htmlFor="statusFilter">Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-review">In Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="no-results">
            <p>No applications found matching your criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Provider</th>
                  <th>Organization</th>
                  <th>Type</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id.substring(0, 8)}...</td>
                    <td>
                      {app.user ? 
                        `${app.user.firstName} ${app.user.lastName}` : 
                        'Unknown'}
                    </td>
                    <td>{app.user?.organizationName || 'Unknown'}</td>
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

export default ApplicationManagement;
