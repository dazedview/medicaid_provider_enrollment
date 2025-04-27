/**
 * Utility functions for formatting data consistently across the application
 */

/**
 * Formats an Employer Identification Number (EIN) into XX-XXXXXXX format
 * @param ein - The EIN to format (9 digits, numbers only)
 * @returns Formatted EIN or the original string if not valid
 */
export const formatEIN = (ein: string | undefined): string => {
  // Return empty string if ein is undefined
  if (!ein) return '';
  
  // If the ein is already formatted or not a 9-digit number, return as is
  if (ein === 'Not provided') return ein;
  
  // Strip non-digits
  const digitsOnly = ein.replace(/\D/g, '');
  
  // If not 9 digits, return original input
  if (digitsOnly.length !== 9) return ein;
  
  // Format as XX-XXXXXXX
  return `${digitsOnly.substring(0, 2)}-${digitsOnly.substring(2, 9)}`;
};

/**
 * Formats a 10-digit phone number string into (XXX) XXX-XXXX format
 * @param phone - The phone number to format (10 digits, numbers only)
 * @returns Formatted phone number or the original string if not valid
 */
export const formatPhoneNumber = (phone: string | undefined): string => {
  // Return empty string if phone is undefined
  if (!phone) return '';
  
  // If the phone is already formatted or not a 10-digit number, return as is
  if (phone === 'Not provided' || !/^\d{10}$/.test(phone)) {
    return phone;
  }
  
  // Format as (XXX) XXX-XXXX
  return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6, 10)}`;
};

/**
 * Strips all non-digit characters from a string
 * @param value - The string to process
 * @returns String containing only digits
 */
export const stripNonDigits = (value: string): string => {
  return value.replace(/\D/g, '');
};
