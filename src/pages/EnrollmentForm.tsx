import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitApplication } from '../services/applications'
import { formatPhoneNumber, formatEIN, stripNonDigits } from '../utils/formatters'

const steps = [
  'Provider Information',
  'Practice Information',
  'Specialties & Credentials',
  'Disclosure Questions',
  'Agreements & Attestations',
  'Review & Submit'
]

const EnrollmentForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Provider Information
    providerType: '',
    firstName: '',
    lastName: '',
    npi: '',
    ssn: '',
    medicaidId: '',
    dob: '',
    email: '',
    phone: '',
    
    // Practice Information
    practiceType: '',
    businessName: '',
    ein: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    billingAddressSame: true,
    billingAddressLine1: '',
    billingAddressLine2: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    
    // Specialties & Credentials
    primarySpecialty: '',
    additionalSpecialties: [],
    licenseNumber: '',
    licenseState: '',
    licenseExpiration: '',
    boardCertified: false,
    deaNumber: '',
    deaExpiration: '',
    
    // Disclosure Questions
    disciplinaryAction: false,
    disciplinaryActionDetails: '',
    malpracticeClaims: false,
    malpracticeClaimsDetails: '',
    felonyConviction: false,
    felonyConvictionDetails: '',
    medicaidExclusion: false,
    medicaidExclusionDetails: '',
    
    // Agreements & Attestations
    acceptTerms: false,
    attestAccuracy: false,
    attestDisclosureRequirement: false,
    attestNonDiscrimination: false
  })
  
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const isCheckbox = (e.target as HTMLInputElement).type === 'checkbox'
    
    // For NPI field, only allow digits and limit to 10 characters
    if (name === 'npi') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '')
      // Limit to 10 digits
      const truncated = digitsOnly.slice(0, 10)
      
      setFormData({
        ...formData,
        [name]: truncated
      })
    } 
    // For phone field, only allow digits and limit to 10 characters
    else if (name === 'phone') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '')
      // Limit to 10 digits
      const truncated = digitsOnly.slice(0, 10)
      
      setFormData({
        ...formData,
        [name]: truncated
      })
    }
    // For EIN field, only allow digits and limit to 9 characters
    else if (name === 'ein') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '')
      // Limit to 9 digits
      const truncated = digitsOnly.slice(0, 9)
      
      setFormData({
        ...formData,
        [name]: truncated
      })
    } else {
      setFormData({
        ...formData,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
      })
    }
  }

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate NPI and email on the first step (Provider Information)
    if (currentStep === 0) {
      const npiRegex = /^\d{10}$/
      if (formData.npi && !npiRegex.test(formData.npi)) {
        alert('NPI must be exactly 10 digits')
        return
      }
      
      // Email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (formData.email && !emailRegex.test(formData.email)) {
        alert('Please enter a valid email address')
        return
      }
      
      // Phone validation
      const phoneRegex = /^\d{10}$/
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        alert('Phone number must be exactly 10 digits')
        return
      }
    }
    
    // Validate EIN on the second step (Practice Information)
    if (currentStep === 1) {
      const einRegex = /^\d{9}$/
      if (formData.ein && !einRegex.test(formData.ein)) {
        alert('EIN must be exactly 9 digits')
        return
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Final validation before submission
    const npiRegex = /^\d{10}$/
    if (!npiRegex.test(formData.npi)) {
      alert('NPI must be exactly 10 digits. Please correct this before submitting.')
      return
    }
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address before submitting.')
      return
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.phone)) {
      alert('Phone number must be exactly 10 digits. Please correct this before submitting.')
      return
    }
    
    // EIN validation
    const einRegex = /^\d{9}$/
    if (!einRegex.test(formData.ein)) {
      alert('EIN must be exactly 9 digits. Please correct this before submitting.')
      return
    }
    
    try {
      // Submit the application to the API
      await submitApplication({
        applicationType: 'Provider Enrollment',
        formData
      })
      
      // Navigate to a confirmation page
      navigate('/enrollment-submitted')
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('There was an error submitting your application. Please try again.')
    }
  }

  const renderFormStep = () => {
    switch (currentStep) {
      case 0: // Provider Information
        return (
          <div className="form-step">
            <h2>Provider Information</h2>
            <p className="step-description">
              Enter your basic provider details and contact information.
            </p>
            
            <div className="form-group">
              <label htmlFor="providerType">Provider Type</label>
              <select
                id="providerType"
                name="providerType"
                value={formData.providerType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Provider Type</option>
                <option value="individual">Individual Practitioner</option>
                <option value="group">Group Practice</option>
                <option value="facility">Facility/Organization</option>
                <option value="dental">Dental Provider</option>
                <option value="pharmacy">Pharmacy</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="npi">NPI (National Provider Identifier)</label>
                <input
                  type="text"
                  id="npi"
                  name="npi"
                  value={formData.npi}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                  placeholder="10-digit NPI"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ssn">SSN (Last 4 digits)</label>
                <input
                  type="text"
                  id="ssn"
                  name="ssn"
                  value={formData.ssn}
                  onChange={handleInputChange}
                  required
                  maxLength={4}
                  placeholder="Last 4 digits only"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="medicaidId">Medicaid ID (if already enrolled)</label>
                <input
                  type="text"
                  id="medicaidId"
                  name="medicaidId"
                  value={formData.medicaidId}
                  onChange={handleInputChange}
                  placeholder="Leave blank if new enrollment"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone ? formData.phone : ''}
                  onChange={handleInputChange}
                  required
                  placeholder="(XXX) XXX-XXXX"
                />
                {formData.phone && (
                  <div className="input-help-text">
                    Will be stored as: {formatPhoneNumber(formData.phone)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
        
      case 1: // Practice Information
        return (
          <div className="form-step">
            <h2>Practice Information</h2>
            <p className="step-description">
              Enter information about your practice or organization.
            </p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="practiceType">Practice Type</label>
                <select
                  id="practiceType"
                  name="practiceType"
                  value={formData.practiceType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Practice Type</option>
                  <option value="solo">Solo Practice</option>
                  <option value="group">Group Practice</option>
                  <option value="hospital">Hospital</option>
                  <option value="clinic">Clinic</option>
                  <option value="fqhc">Federally Qualified Health Center</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="businessName">Business/Practice Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="ein">Employer Identification Number (EIN)</label>
              <input
                type="text"
                id="ein"
                name="ein"
                value={formData.ein}
                onChange={handleInputChange}
                required
                placeholder="XX-XXXXXXX"
              />
              {formData.ein && (
                <div className="input-help-text">
                  Will be stored as: {formatEIN(formData.ein)}
                </div>
              )}
            </div>
            
            <h3>Practice Address</h3>
            
            <div className="form-group">
              <label htmlFor="addressLine1">Address Line 1</label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select State</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                  <option value="DC">District of Columbia</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="billingAddressSame"
                name="billingAddressSame"
                checked={formData.billingAddressSame}
                onChange={handleInputChange}
              />
              <label htmlFor="billingAddressSame">
                Billing address is the same as practice address
              </label>
            </div>
            
            {!formData.billingAddressSame && (
              <div className="billing-address-section">
                <h3>Billing Address</h3>
                
                <div className="form-group">
                  <label htmlFor="billingAddressLine1">Address Line 1</label>
                  <input
                    type="text"
                    id="billingAddressLine1"
                    name="billingAddressLine1"
                    value={formData.billingAddressLine1}
                    onChange={handleInputChange}
                    required={!formData.billingAddressSame}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="billingAddressLine2">Address Line 2</label>
                  <input
                    type="text"
                    id="billingAddressLine2"
                    name="billingAddressLine2"
                    value={formData.billingAddressLine2}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="billingCity">City</label>
                    <input
                      type="text"
                      id="billingCity"
                      name="billingCity"
                      value={formData.billingCity}
                      onChange={handleInputChange}
                      required={!formData.billingAddressSame}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="billingState">State</label>
                    <select
                      id="billingState"
                      name="billingState"
                      value={formData.billingState}
                      onChange={handleInputChange}
                      required={!formData.billingAddressSame}
                    >
                      <option value="">Select State</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                      <option value="DC">District of Columbia</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="billingZipCode">Zip Code</label>
                    <input
                      type="text"
                      id="billingZipCode"
                      name="billingZipCode"
                      value={formData.billingZipCode}
                      onChange={handleInputChange}
                      required={!formData.billingAddressSame}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )
        
      case 2: // Specialties & Credentials
        return (
          <div className="form-step">
            <h2>Specialties & Credentials</h2>
            <p className="step-description">
              Provide information about your specialties and professional credentials.
            </p>
            
            <div className="form-group">
              <label htmlFor="primarySpecialty">Primary Specialty</label>
              <select
                id="primarySpecialty"
                name="primarySpecialty"
                value={formData.primarySpecialty}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Primary Specialty</option>
                <option value="familyMedicine">Family Medicine</option>
                <option value="internalMedicine">Internal Medicine</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="obgyn">Obstetrics/Gynecology</option>
                <option value="psychiatry">Psychiatry</option>
                <option value="generalSurgery">General Surgery</option>
                <option value="cardiology">Cardiology</option>
                <option value="dermatology">Dermatology</option>
                <option value="neurology">Neurology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="licenseNumber">License Number</label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="licenseState">License State</label>
                <select
                  id="licenseState"
                  name="licenseState"
                  value={formData.licenseState}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select State</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                  <option value="DC">District of Columbia</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="licenseExpiration">License Expiration Date</label>
                <input
                  type="date"
                  id="licenseExpiration"
                  name="licenseExpiration"
                  value={formData.licenseExpiration}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="boardCertified"
                name="boardCertified"
                checked={formData.boardCertified}
                onChange={handleInputChange}
              />
              <label htmlFor="boardCertified">
                I am board certified in my specialty
              </label>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="deaNumber">DEA Number (if applicable)</label>
                <input
                  type="text"
                  id="deaNumber"
                  name="deaNumber"
                  value={formData.deaNumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="deaExpiration">DEA Expiration Date</label>
                <input
                  type="date"
                  id="deaExpiration"
                  name="deaExpiration"
                  value={formData.deaExpiration}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        )
        
      case 3: // Disclosure Questions
        return (
          <div className="form-step">
            <h2>Disclosure Questions</h2>
            <p className="step-description">
              Please answer the following disclosure questions. For any "Yes" answers, provide details in the corresponding text area.
            </p>
            
            <div className="disclosure-section">
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="disciplinaryAction"
                  name="disciplinaryAction"
                  checked={formData.disciplinaryAction}
                  onChange={handleInputChange}
                />
                <label htmlFor="disciplinaryAction">
                  Have you ever been subject to disciplinary action by any state licensing agency or board, or have any pending disciplinary actions?
                </label>
              </div>
              
              {formData.disciplinaryAction && (
                <div className="form-group">
                  <label htmlFor="disciplinaryActionDetails">Please provide details:</label>
                  <textarea
                    id="disciplinaryActionDetails"
                    name="disciplinaryActionDetails"
                    value={formData.disciplinaryActionDetails}
                    onChange={handleInputChange}
                    required={formData.disciplinaryAction}
                    rows={4}
                  />
                </div>
              )}
            </div>
            
            <div className="disclosure-section">
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="malpracticeClaims"
                  name="malpracticeClaims"
                  checked={formData.malpracticeClaims}
                  onChange={handleInputChange}
                />
                <label htmlFor="malpracticeClaims">
                  Have you had any malpractice claims filed against you in the last 10 years?
                </label>
              </div>
              
              {formData.malpracticeClaims && (
                <div className="form-group">
                  <label htmlFor="malpracticeClaimsDetails">Please provide details:</label>
                  <textarea
                    id="malpracticeClaimsDetails"
                    name="malpracticeClaimsDetails"
                    value={formData.malpracticeClaimsDetails}
                    onChange={handleInputChange}
                    required={formData.malpracticeClaims}
                    rows={4}
                  />
                </div>
              )}
            </div>
            
            <div className="disclosure-section">
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="felonyConviction"
                  name="felonyConviction"
                  checked={formData.felonyConviction}
                  onChange={handleInputChange}
                />
                <label htmlFor="felonyConviction">
                  Have you ever been convicted of a felony?
                </label>
              </div>
              
              {formData.felonyConviction && (
                <div className="form-group">
                  <label htmlFor="felonyConvictionDetails">Please provide details:</label>
                  <textarea
                    id="felonyConvictionDetails"
                    name="felonyConvictionDetails"
                    value={formData.felonyConvictionDetails}
                    onChange={handleInputChange}
                    required={formData.felonyConviction}
                    rows={4}
                  />
                </div>
              )}
            </div>
            
            <div className="disclosure-section">
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="medicaidExclusion"
                  name="medicaidExclusion"
                  checked={formData.medicaidExclusion}
                  onChange={handleInputChange}
                />
                <label htmlFor="medicaidExclusion">
                  Have you ever been excluded from Medicare, Medicaid, or any other federal or state healthcare program?
                </label>
              </div>
              
              {formData.medicaidExclusion && (
                <div className="form-group">
                  <label htmlFor="medicaidExclusionDetails">Please provide details:</label>
                  <textarea
                    id="medicaidExclusionDetails"
                    name="medicaidExclusionDetails"
                    value={formData.medicaidExclusionDetails}
                    onChange={handleInputChange}
                    required={formData.medicaidExclusion}
                    rows={4}
                  />
                </div>
              )}
            </div>
          </div>
        )
        
      case 4: // Agreements & Attestations
        return (
          <div className="form-step">
            <h2>Agreements & Attestations</h2>
            <p className="step-description">
              Please review and agree to the following terms and conditions.
            </p>
            
            <div className="agreements-container">
              <div className="agreement-section">
                <h3>Terms and Conditions</h3>
                <div className="agreement-text">
                  <p>
                    By enrolling as a Medicaid provider, you agree to comply with all applicable Medicaid program requirements, including but not limited to:
                  </p>
                  <ul>
                    <li>Maintaining current licensure and certification requirements for your provider type</li>
                    <li>Adhering to all billing and documentation requirements</li>
                    <li>Providing services only within your scope of practice</li>
                    <li>Cooperating with all program integrity activities, including audits and investigations</li>
                    <li>Notifying the Medicaid agency of any changes to your enrollment information within 30 days</li>
                    <li>Adhering to all applicable state and federal laws and regulations</li>
                  </ul>
                  <p>
                    Failure to comply with program requirements may result in suspension or termination from the Medicaid program and potential recovery of payments.
                  </p>
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="acceptTerms">
                    I have read, understand, and agree to the terms and conditions of participating in the Medicaid program.
                  </label>
                </div>
              </div>
              
              <div className="agreement-section">
                <h3>Attestations</h3>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="attestAccuracy"
                    name="attestAccuracy"
                    checked={formData.attestAccuracy}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="attestAccuracy">
                    I attest that all information provided in this enrollment application is true, accurate, and complete to the best of my knowledge.
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="attestDisclosureRequirement"
                    name="attestDisclosureRequirement"
                    checked={formData.attestDisclosureRequirement}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="attestDisclosureRequirement">
                    I understand that I am required to disclose any changes to the information provided in this application within 30 days of such changes.
                  </label>
                </div>
                
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="attestNonDiscrimination"
                    name="attestNonDiscrimination"
                    checked={formData.attestNonDiscrimination}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="attestNonDiscrimination">
                    I agree to provide services to Medicaid beneficiaries without discrimination on the basis of race, color, national origin, disability, age, sex, gender identity, or sexual orientation.
                  </label>
                </div>
              </div>
            </div>
          </div>
        )
        
      case 5: // Review & Submit
        return (
          <div className="form-step">
            <h2>Review & Submit</h2>
            <p className="step-description">
              Please review your enrollment information before submitting. You can go back to previous steps to make changes if needed.
            </p>
            
            <div className="review-sections">
              <div className="review-section">
                <h3>Provider Information</h3>
                <div className="review-items">
                  <div className="review-item">
                    <span className="review-label">Provider Type:</span>
                    <span className="review-value">{formData.providerType}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Name:</span>
                    <span className="review-value">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">NPI:</span>
                    <span className="review-value">{formData.npi}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Email:</span>
                    <span className="review-value">{formData.email}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Phone:</span>
                    <span className="review-value">{formatPhoneNumber(formData.phone)}</span>
                  </div>
                </div>
              </div>
              
              <div className="review-section">
                <h3>Practice Information</h3>
                <div className="review-items">
                  <div className="review-item">
                    <span className="review-label">Practice Type:</span>
                    <span className="review-value">{formData.practiceType}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Business Name:</span>
                    <span className="review-value">{formData.businessName}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">EIN:</span>
                    <span className="review-value">{formatEIN(formData.ein)}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Address:</span>
                    <span className="review-value">
                      {formData.addressLine1}{formData.addressLine2 ? `, ${formData.addressLine2}` : ''}<br />
                      {formData.city}, {formData.state} {formData.zipCode}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="review-section">
                <h3>Credentials</h3>
                <div className="review-items">
                  <div className="review-item">
                    <span className="review-label">Primary Specialty:</span>
                    <span className="review-value">{formData.primarySpecialty}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">License:</span>
                    <span className="review-value">{formData.licenseNumber} ({formData.licenseState})</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">License Expiration:</span>
                    <span className="review-value">{formData.licenseExpiration}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Board Certified:</span>
                    <span className="review-value">{formData.boardCertified ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
              
              <div className="review-section">
                <h3>Disclosures</h3>
                <div className="review-items">
                  <div className="review-item">
                    <span className="review-label">Disciplinary Action:</span>
                    <span className="review-value">{formData.disciplinaryAction ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Malpractice Claims:</span>
                    <span className="review-value">{formData.malpracticeClaims ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Felony Conviction:</span>
                    <span className="review-value">{formData.felonyConviction ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Program Exclusion:</span>
                    <span className="review-value">{formData.medicaidExclusion ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="submission-notice">
              <p>
                By clicking "Submit Enrollment", you certify that all information provided is accurate and complete,
                and you agree to the terms and conditions of participation in the Medicaid program.
              </p>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <div className="enrollment-page">
      <div className="page-header">
        <h1>Medicaid Provider Enrollment</h1>
        <p>Complete the enrollment process to become a Medicaid provider</p>
      </div>
      
      <div className="enrollment-progress">
        <ul className="steps-indicator">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`step ${index < currentStep ? 'completed' : ''} ${index === currentStep ? 'active' : ''}`}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-title">{step}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="card enrollment-form-container">
        <form onSubmit={currentStep === steps.length - 1 ? handleSubmit : nextStep}>
          {renderFormStep()}
          
          <div className="form-navigation">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-outline"
              >
                Previous
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <button type="submit" className="btn btn-primary">
                Continue
              </button>
            ) : (
              <button type="submit" className="btn btn-primary submit-button">
                Submit Enrollment
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default EnrollmentForm
