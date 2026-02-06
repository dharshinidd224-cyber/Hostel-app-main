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

const isHostelWifi = (ip) => {
  if (!ip) {
    console.log('❌ No IP provided');
    return false;
  }

  const cleanIp = ip.replace(/^::ffff:/, '').trim();
  console.log(`\n🔍 WiFi Check for IP: ${cleanIp}`);

  if (cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp === 'localhost') {
    console.log('⚠️ LOCALHOST DETECTED - BYPASSING WiFi check (Development Mode)');
    return true;
  }

  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = cleanIp.match(ipv4Regex);
  
  if (!match) {
    console.log(`❌ Invalid IPv4 format: ${cleanIp}`);
    return false;
  }

  const parts = cleanIp.split('.').map(Number);
  
  if (parts.some(part => part < 0 || part > 255)) {
    console.log(`❌ Invalid IP octets: ${cleanIp}`);
    return false;
  }

  console.log(`   IP Parts: [${parts.join(', ')}]`);

  const isValid = (
    parts[0] === 192 &&
    parts[1] === 168 &&
    parts[2] >= 100 &&
    parts[2] <= 111
  );

  console.log(`   Range Check: 192.168.[${parts[2]}].${parts[3]}`);
  console.log(`   Third Octet: ${parts[2]} (Must be 100-111)`);
  console.log(`   Result: ${isValid ? '✅ VALID HOSTEL WIFI' : '❌ NOT HOSTEL WIFI'}`);
  
  return isValid;
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
    
    const clientIp = getClientIp(req);
    const wifiValid = isHostelWifi(clientIp);
    
    if (!wifiValid) {
      console.log(`\n❌ ATTENDANCE REJECTED: Invalid WiFi`);
      console.log(`${'='.repeat(60)}\n`);
      
      return res.status(403).json({
        success: false,
        message: "You must be connected to hostel WiFi (SSID: Student)",
        error: "INVALID_WIFI",
        debug: {
          yourIp: clientIp,
          requiredRange: "192.168.100.0 - 192.168.111.255",
          hint: clientIp === '127.0.0.1' 
            ? "You're on localhost - this should work in development."
            : "Please connect to the 'Student' WiFi network and try again."
        }
      });
    }

    console.log(`✅ WiFi validation PASSED`);

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
    
    const clientIp = getClientIp(req);
    const isValid = isHostelWifi(clientIp);
    const timeValid = isWithinAttendanceWindow();

    console.log(`\n📊 VALIDATION SUMMARY:`);
    console.log(`   IP Address: ${clientIp}`);
    console.log(`   WiFi Valid: ${isValid ? '✅ YES' : '❌ NO'}`);
    console.log(`   Time Valid: ${timeValid ? '✅ YES' : '❌ NO'}`);
    console.log(`${'='.repeat(60)}\n`);

    return res.json({
      success: isValid,
      ip: clientIp,
      isHostelWifi: isValid,
      timeWindow: timeValid,
      message: isValid 
        ? "✅ Connected to hostel WiFi (SSID: Student)" 
        : "❌ Not connected to hostel WiFi. Please connect to 'Student' network.",
      requiredRange: "192.168.100.0 - 192.168.111.255",
      debug: {
        headers: {
          'x-forwarded-for': req.headers['x-forwarded-for'],
          'x-real-ip': req.headers['x-real-ip']
        },
        detectedIp: clientIp
      }
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