/**
 * Data Warehouse Integration Utilities
 * 
 * This module provides utilities for integrating with the Medicaid Enterprise Data Warehouse.
 */

const axios = require('axios');

/**
 * Send data to the data warehouse with retry logic
 * @param {Object} data - The data to send
 * @param {string} endpoint - The endpoint to send the data to (defaults to provider-enrollment)
 * @param {number} retries - Number of retries (default: 3)
 * @returns {Promise<Object>} - Response from the data warehouse
 */
async function sendToDataWarehouse(data, endpoint = 'provider-enrollment', retries = 3) {
  const dataWarehouseBaseUrl = process.env.DATA_WAREHOUSE_URL || `http://localhost:5005/api/events/${endpoint}`;
  const url = dataWarehouseBaseUrl.includes('/api/events/') 
    ? dataWarehouseBaseUrl 
    : `${dataWarehouseBaseUrl}/api/events/${endpoint}`;
  
  try {
    console.log(`Sending data to data warehouse (${url}):`, JSON.stringify(data, null, 2));
    
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Data warehouse response:', response.status, response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending data to data warehouse:', error.message);
    
    // If we have retries left, wait and try again
    if (retries > 0) {
      console.log(`Retrying data warehouse send. Attempts remaining: ${retries-1}`);
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return sendToDataWarehouse(data, endpoint, retries - 1);
    }
    
    // Log the detailed error for debugging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Data warehouse error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from data warehouse:', error.request);
    }
    
    // Return failure
    return { 
      success: false, 
      error: error.message,
      details: error.response ? error.response.data : null
    };
  }
}

/**
 * Queue a failed data warehouse send for later retry
 * @param {Object} data - The data to queue
 * @param {string} endpoint - The endpoint to send the data to
 * @returns {Promise<boolean>} - Success status
 */
async function queueFailedSend(data, endpoint) {
  try {
    // In a real implementation, this would store the failed send in a database
    // or persistent queue for later retry
    console.log(`Queuing failed data warehouse send for later retry:`, {
      endpoint,
      data: JSON.stringify(data)
    });
    
    // For now, just log it
    return true;
  } catch (error) {
    console.error('Error queuing failed data warehouse send:', error);
    return false;
  }
}

module.exports = {
  sendToDataWarehouse,
  queueFailedSend
};
