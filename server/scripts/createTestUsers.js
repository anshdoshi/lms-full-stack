import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yunay-ca-academy');
    console.log('✅ Connected to MongoDB');

    // Create Admin User
    let admin = await User.findOne({ email: 'admin@test.com' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        imageUrl: 'https://via.placeholder.com/150'
      });
      console.log('✅ Admin user created:', admin.email);
    } else {
      console.log('ℹ️  Admin user already exists:', admin.email);
    }

    // Create Educator User
    let educator = await User.findOne({ email: 'educator@test.com' });
    if (!educator) {
      const hashedPassword = await bcrypt.hash('educator123', 10);
      educator = await User.create({
        name: 'Test Educator',
        email: 'educator@test.com',
        password: hashedPassword,
        role: 'educator',
        imageUrl: 'https://via.placeholder.com/150'
      });
      console.log('✅ Educator user created:', educator.email);
    } else {
      console.log('ℹ️  Educator user already exists:', educator.email);
    }

    // Create Student User
    let student = await User.findOne({ email: 'student@test.com' });
    if (!student) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      student = await User.create({
        name: 'Test Student',
        email: 'student@test.com',
        password: hashedPassword,
        role: 'student',
        imageUrl: 'https://via.placeholder.com/150'
      });
      console.log('✅ Student user created:', student.email);
    } else {
      console.log('ℹ️  Student user already exists:', student.email);
    }

    console.log('\n📋 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@test.com');
    console.log('  Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Educator:');
    console.log('  Email: educator@test.com');
    console.log('  Password: educator123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Student:');
    console.log('  Email: student@test.com');
    console.log('  Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createTestUsers();
