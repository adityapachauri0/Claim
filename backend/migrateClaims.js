const mongoose = require('mongoose');
require('dotenv').config({ path: '/Users/adityapachauri/Desktop/claims-website/backend/.env' });
const Claim = require('./models/Claim');
const logger = require('./utils/logger');

const migrate = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully.');

        const claims = await Claim.find({});
        console.log(`Found ${claims.length} documents to check.`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const claim of claims) {
            let hasChanges = false;
            const updates = {};

            // Flatten Personal Details
            if (claim.personalDetails) {
                if (claim.personalDetails.title) updates.title = claim.personalDetails.title;
                if (claim.personalDetails.firstName) updates.firstName = claim.personalDetails.firstName;
                if (claim.personalDetails.lastName) updates.lastName = claim.personalDetails.lastName;
                if (claim.personalDetails.email) updates.email = claim.personalDetails.email;
                if (claim.personalDetails.phone) updates.phone = claim.personalDetails.phone;
                if (claim.personalDetails.dateOfBirth) updates.dateOfBirth = claim.personalDetails.dateOfBirth;
                hasChanges = true;
            }

            // Flatten Address
            if (claim.address && claim.address.current) {
                if (claim.address.current.addressLine1) updates.addressLine1 = claim.address.current.addressLine1;
                if (claim.address.current.addressLine2) updates.addressLine2 = claim.address.current.addressLine2;
                if (claim.address.current.city) updates.city = claim.address.current.city;
                if (claim.address.current.county) updates.county = claim.address.current.county;
                if (claim.address.current.postcode) updates.postcode = claim.address.current.postcode;
                hasChanges = true;
            }

            // Flatten Previous Address
            if (claim.address && claim.address.previous) {
                if (claim.address.previous.addressLine1) updates.prevAddressLine1 = claim.address.previous.addressLine1;
                if (claim.address.previous.addressLine2) updates.prevAddressLine2 = claim.address.previous.addressLine2;
                if (claim.address.previous.city) updates.prevCity = claim.address.previous.city;
                if (claim.address.previous.postcode) updates.prevPostcode = claim.address.previous.postcode;
                hasChanges = true;
            }

            // Flatten Claim Details
            if (claim.claimDetails) {
                if (claim.claimDetails.hadCarFinance !== undefined) updates.hadCarFinance = claim.claimDetails.hadCarFinance;
                if (claim.claimDetails.financeType) updates.financeType = claim.claimDetails.financeType;
                if (claim.claimDetails.financePeriod) updates.financePeriod = claim.claimDetails.financePeriod;
                if (claim.claimDetails.financePeriodStart) updates.financePeriodStart = claim.claimDetails.financePeriodStart;
                if (claim.claimDetails.financePeriodEnd) updates.financePeriodEnd = claim.claimDetails.financePeriodEnd;
                if (claim.claimDetails.wasCommissionDisclosed) updates.wasCommissionDisclosed = claim.claimDetails.wasCommissionDisclosed;
                hasChanges = true;
            }

            // Flatten Consent
            if (claim.consent) {
                if (claim.consent.termsAccepted !== undefined) updates.termsAccepted = claim.consent.termsAccepted;
                if (claim.consent.privacyAccepted !== undefined) updates.privacyAccepted = claim.consent.privacyAccepted;
                if (claim.consent.marketingOptIn !== undefined) updates.marketingOptIn = claim.consent.marketingOptIn;
                if (claim.consent.signature) updates.signature = claim.consent.signature;
                hasChanges = true;
            }

            if (hasChanges) {
                // Use native update to avoid middleware/validation issues during migration
                // and to remove the legacy fields
                await Claim.collection.updateOne(
                    { _id: claim._id },
                    {
                        $set: updates,
                        $unset: {
                            personalDetails: "",
                            address: "",
                            claimDetails: "",
                            consent: ""
                        }
                    }
                );
                migratedCount++;
                if (migratedCount % 10 === 0) console.log(`Migrated ${migratedCount} documents...`);
            } else {
                skippedCount++;
            }
        }

        console.log('Migration complete.');
        console.log(`Total documents: ${claims.length}`);
        console.log(`Migrated: ${migratedCount}`);
        console.log(`Skipped (already flat): ${skippedCount}`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

migrate();
