import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms-database';

async function cleanDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('\n🗑️  Dropping all collections...');
    
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`✅ Dropped collection: ${collection.name}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE CLEANED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📝 Next Steps:');
    console.log('  1. Run: node scripts/addTestData.js');
    console.log('  2. Start the servers');
    console.log('  3. Test the application\n');

  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
cleanDatabase();
