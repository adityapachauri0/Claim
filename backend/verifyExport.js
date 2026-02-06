const { exportToDesktop } = require('./utils/desktopExport');

const mockClaim = {
    referenceNumber: 'VERIFY-TEST-001',
    firstName: 'Verification',
    lastName: 'Test',
    email: 'test@example.com',
    phone: '0123456789',
    dateOfBirth: '1990-01-01',
    addressLine1: '123 Test Lane',
    city: 'Test City',
    postcode: 'TE1 1ST',
    financeType: 'PCP',
    financePeriod: '2018-2022',
    status: 'new',
    createdAt: new Date().toISOString(),
    ipAddress: '127.0.0.1',
    location: 'Local Test'
};

console.log('Starting verification of desktop export...');

exportToDesktop(mockClaim).then(filePath => {
    if (filePath) {
        console.log('✅ Export successful! File created at:', filePath);
    } else {
        console.error('❌ Export failed! Check logs.');
    }
    process.exit(filePath ? 0 : 1);
}).catch(err => {
    console.error('❌ Error during verification:', err);
    process.exit(1);
});
