const getClientIp = (req) => {
  let ip = req.socket.remoteAddress;

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
    parts.some(part => Number.isNaN(part) || part < 0 || part > 255)
  ) {
    return false;
  }

  return (
    parts[0] === 192 &&
    parts[1] === 168 &&
    parts[2] >= 100 &&
    parts[2] <= 111
  );
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
    requiredRange: '192.168.100.0 - 192.168.111.255'
  });
};