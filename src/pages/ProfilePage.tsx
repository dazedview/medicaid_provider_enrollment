import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { updateProfile, setAuthToken, getToken } from '../services/auth'
import { formatPhoneNumber, stripNonDigits } from '../utils/formatters'

// Define the type for our user data
interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  organizationName: string;
  npi: string;
  role: string;
  // These fields are not in the User model but needed for UI
  providerType?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  enrollmentStatus?: string;
  enrollmentDate?: string;
}

const ProfilePage = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState<UserProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UserProfileData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    if (user) {
      // Create profile data from authenticated user
      const profileData: UserProfileData = {
        ...user,
        // Use actual values if they exist, otherwise use defaults
        providerType: 'Provider',
        address: user.address || 'Not provided',
        city: user.city || 'Not provided',
        state: user.state || 'Not provided',
        zipCode: user.zipCode || 'Not provided',
        phone: user.phone || 'Not provided',
        enrollmentStatus: 'Active',
        enrollmentDate: new Date().toISOString().split('T')[0]
      }
      setUserData(profileData)
      setFormData(profileData)
    }
  }, [user])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target
      
      // For phone field, only allow digits and limit to 10 characters
      if (name === 'phone') {
        // Remove any non-digit characters
        const digitsOnly = value.replace(/\D/g, '')
        // Limit to 10 digits
        const truncated = digitsOnly.slice(0, 10)
        
        setFormData({
          ...formData,
          [name]: truncated
        })
      } else {
        setFormData({
          ...formData,
          [name]: value
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    
    // Validate phone number
    const phoneRegex = /^\d{10}$/
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits')
      return
    }
    
    setError(null)
    setIsSubmitting(true)
    
    try {
      // Ensure token is set in axios headers
      const token = getToken()
      if (token) {
        setAuthToken(token)
      }
      
      // Update profile in the backend
      const updatedUser = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        organizationName: formData.organizationName,
        npi: formData.npi,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone
      })
      
      // Update local state with the response from the server
      setUserData(updatedUser)
      setUser(updatedUser) // Update the user in the auth context
      setIsEditing(false)
    } catch (err: any) {
      console.error('Error updating profile:', err)
      // Display error message
      if (err.response && err.response.status === 401) {
        setError('Authentication error. Please log out and log back in.')
      } else {
        setError(err.message || 'Failed to update profile. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // If user data is not loaded yet, show loading
  if (!userData || !formData) {
    return <div className="loading-container">Loading profile data...</div>
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Provider Profile</h1>
        <p>View and manage your provider information</p>
      </div>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="profile-container">
        <div className="card profile-card">
          <div className="profile-header">
            <h2>Provider Information</h2>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="btn btn-outline"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="organizationName">Organization Name</label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="npi">NPI</label>
                <input
                  type="text"
                  id="npi"
                  name="npi"
                  value={formData.npi}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  required
                  placeholder="(XXX) XXX-XXXX"
                />
                {formData.phone && formData.phone !== 'Not provided' && (
                  <div className="input-help-text">
                    Will be stored as: {formatPhoneNumber(formData.phone)}
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false)
                    setFormData(userData)
                    setError(null)
                  }} 
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="profile-section">
                <h3>Personal Information</h3>
                <div className="detail-row">
                  <div className="detail-label">Name:</div>
                  <div className="detail-value">{userData.firstName} {userData.lastName}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Email:</div>
                  <div className="detail-value">{userData.email}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Phone:</div>
                  <div className="detail-value">{formatPhoneNumber(userData.phone)}</div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Organization Details</h3>
                <div className="detail-row">
                  <div className="detail-label">Organization:</div>
                  <div className="detail-value">{userData.organizationName}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">NPI:</div>
                  <div className="detail-value">{userData.npi}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Provider Type:</div>
                  <div className="detail-value">{userData.providerType}</div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Address</h3>
                <div className="detail-row">
                  <div className="detail-label">Street:</div>
                  <div className="detail-value">{userData.address}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">City, State, Zip:</div>
                  <div className="detail-value">{userData.city}, {userData.state} {userData.zipCode}</div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Enrollment Status</h3>
                <div className="detail-row">
                  <div className="detail-label">Status:</div>
                  <div className="detail-value status-approved">{userData.enrollmentStatus}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Date:</div>
                  <div className="detail-value">{userData.enrollmentDate}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Actions</h2>
          <div className="profile-actions">
            <div className="action-item">
              <h3>Update Enrollment Information</h3>
              <p>Make changes to your provider enrollment details</p>
              <button className="btn btn-primary">Update Info</button>
            </div>
            
            <div className="action-item">
              <h3>View Enrollment History</h3>
              <p>Access your previous enrollment applications and changes</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/status')}
              >
                View History
              </button>
            </div>
            
            <div className="action-item">
              <h3>Download Provider Documentation</h3>
              <p>Access your provider manuals and important forms</p>
              <button className="btn btn-primary">Download Docs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
