const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/claims-website');

        const adminEmail = 'admin@claimcheck.com';
        const adminPassword = 'admin123';

        const existingUser = await User.findOne({ email: adminEmail });
        if (existingUser) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const admin = new User({
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('****************************************');
        console.log('  Admin user created successfully');
        console.log(`  Email: ${adminEmail}`);
        console.log(`  Password: ${adminPassword}`);
        console.log('****************************************');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
