const Application = require('../models/Application');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { sendToDataWarehouse, queueFailedSend } = require('../utils/dataWarehouse');

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { applicationType, formData } = req.body;

    // Create application
    const application = await Application.create({
      userId: req.user.id,
      applicationType,
      formData,
      status: 'Pending',
      notes: 'Application submitted and pending review.'
    });

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all applications for the current user
// @route   GET /api/applications
// @access  Private
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { userId: req.user.id },
      order: [['submittedDate', 'DESC']]
    });

    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get a single application by ID
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function to generate a random 11-digit Medicaid provider ID
const generateMedicaidProviderId = () => {
  // Generate a random 11-digit number
  let id = '';
  for (let i = 0; i < 11; i++) {
    id += Math.floor(Math.random() * 10).toString();
  }
  return id;
};

// @desc    Update application status (admin only)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
exports.updateApplicationStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { status, notes } = req.body;

    // Check if application exists
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update application
    application.status = status;
    if (notes) {
      application.notes = notes;
    }
    application.statusUpdateDate = new Date();
    
    // If status is being set to Approved and no medicaidProviderId exists, generate one
    if (status === 'Approved' && !application.medicaidProviderId) {
      // Check if medicaidProviderId exists in formData
      const formData = application.formData;
      if (formData && formData.medicaidProviderId && formData.medicaidProviderId.length === 11) {
        // Use the medicaidProviderId from the formData
        application.medicaidProviderId = formData.medicaidProviderId;
      } else {
        // Generate a new medicaidProviderId
        application.medicaidProviderId = generateMedicaidProviderId();
      }
    }
    
    await application.save();

    // If status is being set to Approved, send data to the data warehouse
    if (status === 'Approved') {
      try {
        // Get the user data associated with the application
        const user = await User.findByPk(application.userId);
        
        if (!user) {
          console.error(`User not found for application ${application.id}`);
        } else {
          // Format the provider event data
          const providerEvent = {
            id: application.id,
            user_id: application.userId,
            medicaid_provider_id: application.medicaidProviderId,
            npi: user.npi,
            first_name: user.firstName,
            last_name: user.lastName,
            organization_name: user.organizationName,
            address: user.address,
            city: user.city,
            state: user.state,
            zip_code: user.zipCode,
            phone: user.phone,
            email: user.email,
            application_type: application.applicationType,
            status: application.status,
            submitted_date: application.submittedDate,
            status_update_date: application.statusUpdateDate
          };
          
          // Send the event to the data warehouse with retry logic
          const result = await sendToDataWarehouse(providerEvent, 'provider-enrollment');
          
          if (result.success) {
            console.log('Successfully sent provider data to data warehouse');
          } else {
            console.error('Failed to send provider data to data warehouse after retries:', result.error);
            // Queue the failed send for later retry
            await queueFailedSend(providerEvent, 'provider-enrollment');
          }
        }
      } catch (error) {
        console.error('Error sending provider data to data warehouse:', error);
        // Don't fail the main request if the data warehouse integration fails
      }
    }

    res.json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
