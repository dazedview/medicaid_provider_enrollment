# Provider Enrollment Data Warehouse Integration

This document describes the integration between the Provider Enrollment system and the Medicaid Enterprise Data Warehouse.

## Overview

The Provider Enrollment system sends data to the Data Warehouse in two ways:

1. **Real-time Integration**: When a provider application is approved, the Provider Enrollment system immediately sends the provider data to the Data Warehouse via an API call.

2. **Batch ETL Processing**: The Data Warehouse also pulls data from the Provider Enrollment database on a scheduled basis (daily at 1:00 AM and 1:15 AM) as a backup mechanism.

This hybrid approach ensures that provider data is available in the Data Warehouse as soon as possible after approval, while also providing redundancy through the scheduled ETL processes.

## Real-time Integration Flow

1. An administrator approves a provider application in the Provider Enrollment system.
2. The `updateApplicationStatus` function in `applications.js` detects that the status has been set to "Approved".
3. The function retrieves the provider data from the database.
4. The data is formatted into a provider event object.
5. The `sendToDataWarehouse` utility function sends the data to the Data Warehouse API.
6. If the API call fails, the function retries up to 3 times.
7. If all retries fail, the data is queued for later retry.

## Data Warehouse API Endpoint

The Data Warehouse exposes an API endpoint at `/api/events/provider-enrollment` that accepts provider data in the following format:

```json
{
  "id": "application-uuid",
  "user_id": "user-uuid",
  "medicaid_provider_id": "12345678901",
  "npi": "1234567890",
  "first_name": "John",
  "last_name": "Doe",
  "organization_name": "Healthcare Clinic",
  "address": "123 Main St",
  "city": "Anytown",
  "state": "NE",
  "zip_code": "68001",
  "phone": "4025551234",
  "email": "john.doe@example.com",
  "application_type": "New Enrollment",
  "status": "Approved",
  "submitted_date": "2025-01-15T08:30:00.000Z",
  "status_update_date": "2025-01-20T14:45:00.000Z"
}
```

## Batch ETL Processing

The Data Warehouse runs scheduled ETL jobs to pull data from the Provider Enrollment database:

1. **Provider Load** (Daily at 1:00 AM): Extracts provider data from the `users` table.
2. **Provider Enrollment Load** (Daily at 1:15 AM): Extracts provider enrollment applications from the `applications` table.

These ETL processes serve as a backup mechanism to ensure data consistency between the Provider Enrollment system and the Data Warehouse.

## Configuration

The integration is configured through environment variables in the Provider Enrollment system:

- `DATA_WAREHOUSE_URL`: The URL of the Data Warehouse API endpoint (default: `http://localhost:5005/api/events/provider-enrollment`)

## Error Handling and Resilience

The integration includes several mechanisms to ensure reliability:

1. **Retry Logic**: Failed API calls are retried up to 3 times with a 1-second delay between retries.
2. **Queuing**: If all retries fail, the data is queued for later retry.
3. **Batch Backup**: The scheduled ETL processes provide a backup mechanism for data that fails to be sent in real-time.
4. **Logging**: All integration activities are logged for troubleshooting.

## Verification

A verification script is available to check if provider data is properly synchronized between the Provider Enrollment system and the Data Warehouse:

```bash
node medicaid_enterprise_data_warehouse/scripts/verify_provider_integration.js [provider-id]
```

If no provider ID is specified, the script will verify all approved providers.

## Troubleshooting

### Common Issues

1. **API Connection Failures**:
   - Check if the Data Warehouse server is running
   - Verify the `DATA_WAREHOUSE_URL` environment variable
   - Check network connectivity between the Provider Enrollment server and the Data Warehouse

2. **Data Discrepancies**:
   - Run the verification script to identify specific discrepancies
   - Check the logs for any errors during data transmission
   - Verify that the ETL processes are running as scheduled

3. **Missing Provider Data in Data Warehouse**:
   - Check if the provider application was approved
   - Verify that the real-time integration is working
   - Check if the ETL processes are running

### Logs

Integration logs can be found in:

- Provider Enrollment: Standard application logs
- Data Warehouse: `medicaid_enterprise_data_warehouse/logs/etl.log`

## Comparison with Eligibility Integration

The Provider Enrollment integration follows the same hybrid approach (real-time + batch) as the Eligibility system integration:

1. **Real-time Updates**: Both systems send data to the Data Warehouse immediately when key events occur (application approval).
2. **Batch Backup**: Both systems have scheduled ETL processes as a backup mechanism.
3. **Error Handling**: Both integrations include retry logic and error handling.

This consistent approach ensures that both provider and eligibility data are available in the Data Warehouse in a timely manner, with redundancy to prevent data loss.
