import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  
  const isAdmin = user?.role === 'admin'

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    logout()
    // The logout function in AuthContext now handles the navigation
  }

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <h1>Medicaid Provider Portal</h1>
          </Link>
        </div>

        <nav className="navbar-links">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/enroll">Provider Enrollment</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/status">Application Status</Link>
                </li>
                <li>
                  <Link to="/profile">My Profile</Link>
                </li>
                
                {isAdmin && (
                  <li className="dropdown">
                    <button 
                      className="dropdown-toggle"
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    >
                      Admin <span className="caret"></span>
                    </button>
                    {adminMenuOpen && (
                      <ul className="dropdown-menu">
                        <li>
                          <Link to="/admin" onClick={() => setAdminMenuOpen(false)}>
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/users" onClick={() => setAdminMenuOpen(false)}>
                            Users
                          </Link>
                        </li>
                        <li>
                          <Link to="/admin/applications" onClick={() => setAdminMenuOpen(false)}>
                            Applications
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                )}
                
                <li>
                  <button className="btn btn-outline" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="btn btn-outline">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
