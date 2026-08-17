const { Attendance, Student } = require("../models");
const { Op } = require("sequelize");

// ✅ IMPROVED IP EXTRACTION - Checks ALL possible sources
const getClientIp = (req) => {
  console.log('\n🔍 DEBUG IP EXTRACTION:');
  console.log('   x-forwarded-for:', req.headers['x-forwarded-for']);
  console.log('   x-real-ip:', req.headers['x-real-ip']);
  console.log('   req.ip:', req.ip);
  console.log('   req.socket.remoteAddress:', req.socket.remoteAddress);
  console.log('   req.connection.remoteAddress:', req.connection?.remoteAddress);
  
  let ip = 
    req.headers['x-real-ip'] || 
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
    req.socket.remoteAddress || 
    req.connection?.remoteAddress || 
    req.ip;

  if (ip) {
    ip = ip.replace(/^::ffff:/, '');
  }

  console.log('   ✅ Final IP:', ip);
  return ip;
};



const isWithinAttendanceWindow = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const inWindow = currentHour >= 15 && currentHour <= 23;
  
  console.log(`\n⏰ Time Check:`);
  console.log(`   Current Time: ${now.toLocaleTimeString()}`);
  console.log(`   Hour: ${currentHour}`);
  console.log(`   Window: 15:00 - 23:59`);
  console.log(`   Result: ${inWindow ? '✅ IN WINDOW' : '❌ OUT OF WINDOW'}`);
  
  return inWindow;
};

const isTodayMarked = (records) => {
  const today = new Date().toISOString().split("T")[0];
  return records.some(record => record.date === today && record.status === 'present');
};

const calculateStreak = (records) => {
  if (!records || records.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  for (let i = 0; i < sortedRecords.length; i++) {
    const recordDate = new Date(sortedRecords[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    const recordDateStr = recordDate.toISOString().split('T')[0];
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (recordDateStr === expectedDateStr && sortedRecords[i].status === 'present') {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// ================= STUDENT =================

exports.markAttendance = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📝 MARK ATTENDANCE REQUEST - User ID: ${userId}`);
    console.log(`${'='.repeat(60)}`);
    
   const clientIp = req.clientIp;

console.log(`✅ WiFi validation PASSED`);
console.log(`   Client IP: ${clientIp}`);

  

    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().split(" ")[0];

    const existingAttendance = await Attendance.findOne({
      where: { user_id: userId, date: today }
    });

    if (existingAttendance) {
      console.log(`\n❌ ATTENDANCE REJECTED: Already marked today`);
      console.log(`   Marked at: ${existingAttendance.time_marked}`);
      console.log(`${'='.repeat(60)}\n`);
      
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for today",
        error: "ALREADY_MARKED",
        data: {
          date: existingAttendance.date,
          markedAt: existingAttendance.time_marked,
          ip: existingAttendance.ip_address
        }
      });
    }

    console.log(`✅ No existing attendance found`);

    const attendance = await Attendance.create({
      user_id: userId,
      date: today,
      time_marked: currentTime,
      ip_address: clientIp,
      status: "present",
      auto_marked: false
    });

    console.log(`\n✅ ATTENDANCE MARKED SUCCESSFULLY!`);
    console.log(`   Date: ${today}`);
    console.log(`   Time: ${currentTime}`);
    console.log(`   IP: ${clientIp}`);
    console.log(`${'='.repeat(60)}\n`);

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully! 🎉",
      data: {
        id: attendance.id,
        date: attendance.date,
        time_marked: attendance.time_marked,
        status: attendance.status,
        ip_address: attendance.ip_address
      }
    });

  } catch (error) {
    console.error(`\n❌ ERROR marking attendance:`, error);
    console.log(`${'='.repeat(60)}\n`);
    
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.resetTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const today = new Date().toISOString().split("T")[0];

    console.log(`\n🧪 DEV RESET ATTENDANCE`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Date: ${today}`);

    // Safety: only allow this in development
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Development endpoint is disabled in production"
      });
    }

    const deletedCount = await Attendance.destroy({
      where: {
        user_id: userId,
        date: today
      }
    });

    if (deletedCount === 0) {
      return res.json({
        success: true,
        message: "No attendance record found for today",
        deleted: false
      });
    }

    console.log(`   🗑️ Today's attendance deleted`);

    return res.json({
      success: true,
      message: "Today's attendance reset successfully",
      deleted: true,
      date: today
    });

  } catch (error) {
    console.error("❌ ERROR resetting attendance:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset today's attendance",
      error: error.message
    });
  }
};

exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      where: { user_id: req.user.user_id, date: today }
    });

    const clientIp = getClientIp(req);
    const wifiValid = isHostelWifi(clientIp);
    const timeValid = isWithinAttendanceWindow();

    return res.json({
      success: true,
      marked: !!attendance,
      attendance,
      canMarkNow: wifiValid && timeValid && !attendance,
      status: {
        wifi: wifiValid,
        timeWindow: timeValid,
        currentIp: clientIp
      }
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.getAttendanceHistory = async (req, res) => {
  try {
    const records = await Attendance.findAll({
      where: { user_id: req.user.user_id },
      order: [["date", "DESC"]],
      limit: 30
    });

    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = total - present;
    const percentage = total > 0
      ? ((present / total) * 100).toFixed(2)
      : 0;

    const todayMarked = isTodayMarked(records);
    const currentStreak = calculateStreak(records);

    return res.json({ 
      success: true, 
      records,
      todayMarked,
      currentStreak,
      stats: {
        total,
        present,
        absent,
        percentage: parseFloat(percentage)
      }
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.validateWifi = async (req, res) => {
  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔍 WIFI VALIDATION REQUEST`);
    console.log(`${'='.repeat(60)}`);

    // wifiCheck middleware has already validated the IP
    const clientIp = req.clientIp;

    const timeValid = isWithinAttendanceWindow();

    console.log(`\n📊 VALIDATION SUMMARY:`);
    console.log(`   IP Address: ${clientIp}`);
    console.log(`   WiFi Valid: ✅ YES`);
    console.log(`   Time Valid: ${timeValid ? '✅ YES' : '❌ NO'}`);
    console.log(`${'='.repeat(60)}\n`);

    return res.json({
      success: true,
      ip: clientIp,
      isHostelWifi: true,
      timeWindow: timeValid,
      canMarkAttendance: timeValid,
      message: timeValid
        ? "✅ Connected to hostel WiFi (SSID: Student)"
        : "✅ Hostel WiFi connected, but attendance window is closed",
      requiredRange: "192.168.96.0/20"
    });

  } catch (error) {
    console.error(`❌ ERROR validating WiFi:`, error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getAttendanceReport = async (req, res) => {
  try {
    const { date, block, department, status } = req.query;
    const targetDate = date || new Date().toISOString().split("T")[0];

    const whereClause = { date: targetDate };
    if (status) whereClause.status = status;

    const records = await Attendance.findAll({
      where: whereClause,
      include: [{
        model: Student,
        as: 'student',
        attributes: ['name', 'room_number', 'block_number', 'department'],
        where: {
          ...(block && { block_number: block }),
          ...(department && { department })
        },
        required: false
      }],
      order: [["date", "DESC"]]
    });

    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = total - present;

    return res.json({ 
      success: true, 
      date: targetDate,
      summary: {
        total,
        present,
        absent,
        percentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0
      },
      records 
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.autoMarkAbsent = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString('en-CA');

    console.log(`\n🤖 AUTO-MARK ABSENT - ${today}`);

    const present = await Attendance.findAll({
      where: { date: today },
      attributes: ["user_id"]
    });

    const presentIds = present.map(p => p.user_id);
    console.log(`   Present: ${presentIds.length} students`);

    const students = await Student.findAll({ attributes: ["user_id"] });
    console.log(`   Total: ${students.length} students`);

    let markedCount = 0;

    for (const s of students) {
      if (!presentIds.includes(s.user_id)) {
        await Attendance.create({
          user_id: s.user_id,
          date: today,
          status: "absent",
          auto_marked: true
        });
        markedCount++;
      }
    }

    console.log(`   Marked Absent: ${markedCount} students\n`);

    return res.json({ 
      success: true,
      message: `Auto-marked ${markedCount} students as absent`,
      data: {
        date: today,
        totalStudents: students.length,
        presentCount: presentIds.length,
        absentCount: markedCount
      }
    });

  } catch (error) {
    console.error(`❌ ERROR auto-marking absent:`, error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};