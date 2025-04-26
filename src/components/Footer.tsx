const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Medicaid Provider Portal</h3>
            <p>A streamlined system for healthcare providers to enroll in the Medicaid program.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/enroll">Provider Enrollment</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/resources">Provider Resources</a></li>
              <li><a href="/policy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Contact</h3>
            <p>1-800-MEDICAID</p>
            <p>support@medicaidprovider.gov</p>
            <p>123 Healthcare Ave, Suite 300<br />Washington, DC 20001</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} State Medicaid Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
