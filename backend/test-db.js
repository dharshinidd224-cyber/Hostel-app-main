const db = require('./config/db');  // Uses your existing db.js

async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL Connected!');
    console.log('📊 Connection details:', {
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'hostel_attendance'
    });
    await connection.release();
    
    // Test table exists
    const [tables] = await db.execute('SHOW TABLES LIKE "attendance"');
    if (tables.length > 0) {
      console.log('✅ Attendance table exists!');
      
      // Test insert/select
      const [rows] = await db.execute('SELECT COUNT(*) as count FROM attendance');
      console.log('📈 Current attendance records:', rows[0].count);
    } else {
      console.log('⚠️  Create attendance table first (see SQL above)');
    }
  } catch (err) {
    console.error('❌ Database Error:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('🔧 Fix: Update DB_USER/DB_PASS in .env');
    } else if (err.code === 'ENOTFOUND') {
      console.log('🔧 Fix: Start MySQL (XAMPP) or check DB_HOST');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.log('🔧 Fix: Create "hostel_attendance" database');
    }
  }
}

testConnection();