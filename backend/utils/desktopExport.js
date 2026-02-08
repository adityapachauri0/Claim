const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Utility to export submission data to the user's desktop
 * Targets the folder: /Users/adityapachauri/Desktop/All Submissions/
 */
const exportToDesktop = async (claimData) => {
    try {
        const desktopPath = '/Users/adityapachauri/Desktop/All Submissions';

        // Ensure the directory exists
        if (!fs.existsSync(desktopPath)) {
            fs.mkdirSync(desktopPath, { recursive: true });
            logger.info('Created Desktop submissions folder:', desktopPath);
        }

        // Prepare CSV filename
        // Filename format: CLM-TIMESTAMP-REF.csv
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const ref = claimData.referenceNumber || 'NO-REF';
        const fileName = `submission-${ref}-${timestamp}.csv`;
        const filePath = path.join(desktopPath, fileName);

        // Prepare CSV content
        // Define headers based on the Claim model
        const headers = [
            'Reference Number',
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'Date of Birth',
            'Address Line 1',
            'City',
            'Postcode',
            'Status',
            'Submitted At',
            'IP Address',
            'Location'
        ];

        const row = [
            claimData.referenceNumber || '',
            claimData.firstName || '',
            claimData.lastName || '',
            claimData.email || '',
            claimData.phone || '',
            claimData.dateOfBirth || '',
            claimData.addressLine1 || '',
            claimData.city || '',
            claimData.postcode || '',
            claimData.status || 'new',
            claimData.createdAt || new Date().toISOString(),
            claimData.ipAddress || '',
            claimData.location || ''
        ];

        // Sanitize row data (handle commas in values)
        const sanitizedRow = row.map(val => {
            const str = String(val).replace(/"/g, '""'); // Escape double quotes
            return `"${str}"`;
        });

        const csvContent = headers.join(',') + '\n' + sanitizedRow.join(',');

        // Write file
        fs.writeFileSync(filePath, csvContent);
        logger.info(`Successfully exported submission to desktop: ${fileName}`);

        return filePath;
    } catch (error) {
        logger.error('Error exporting to desktop:', error);
        // We don't want to fail the whole submission if export fails, 
        // but we should log it clearly.
        return null;
    }
};

module.exports = { exportToDesktop };
