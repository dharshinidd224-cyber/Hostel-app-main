const getClientIp = (req) => {
  let ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    req.ip;

  if (ip) {
    ip = ip.replace(/^::ffff:/, '');
  }

  return ip;
};

const isHostelWifi = (ip) => {
  if (!ip) return false;

  // Development only
  if (ip === '127.0.0.1' || ip === '::1') {
    return true;
  }

  const parts = ip.split('.').map(Number);

  if (
    parts.length !== 4 ||
    parts.some(
      part => Number.isNaN(part) || part < 0 || part > 255
    )
  ) {
    return false;
  }

  // Hostel Wi-Fi: 192.168.96.0/20
  //
  // Valid range:
  // 192.168.96.0
  //       to
  // 192.168.111.255

  const isCorrectNetwork =
    parts[0] === 192 &&
    parts[1] === 168 &&
    parts[2] >= 96 &&
    parts[2] <= 111;

  return isCorrectNetwork;
};

module.exports = (req, res, next) => {
  const clientIp = getClientIp(req);

  console.log('\n🔍 WIFI CHECK');
  console.log('   Client IP:', clientIp);

  if (isHostelWifi(clientIp)) {
    console.log('   ✅ HOSTEL WIFI CONFIRMED');

    req.clientIp = clientIp;
    return next();
  }

  console.log('   ❌ NOT HOSTEL WIFI');

  return res.status(403).json({
    success: false,
    error: 'INVALID_WIFI',
    message: 'Connect to hostel WiFi only',
    currentIP: clientIp,
    requiredRange: '192.168.96.0/20'
  });
};