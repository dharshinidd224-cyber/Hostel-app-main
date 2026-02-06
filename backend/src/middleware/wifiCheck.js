module.exports = (req, res, next) => {

  const rawIp =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket.remoteAddress ||
    req.ip;

  const clientIp = rawIp?.replace('::ffff:', '');

  console.log("🔍 CLIENT IP:", clientIp);

  // ✅ DEV MODE BYPASS (localhost only)
  if (
    clientIp === '127.0.0.1' ||
    clientIp === '::1' ||
    !clientIp
  ) {
    console.log("🔧 DEV MODE: Localhost allowed");
    req.clientIp = '127.0.0.1';
    return next();
  }

  // 🎯 Hostel WiFi range check
  const isHostelWifi = (ip) => {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;

    if (parts[0] === '192' && parts[1] === '168') {
      const third = Number(parts[2]);
      return third >= 100 && third <= 111;
    }
    return false;
  };

  if (isHostelWifi(clientIp)) {
    console.log("✅ HOSTEL WIFI CONFIRMED:", clientIp);
    req.clientIp = clientIp;
    return next();
  }

  // ❌ Block everything else
  console.log("❌ BLOCKED IP:", clientIp);

  return res.status(403).json({
    success: false,
    error: "Connect to hostel WiFi only",
    currentIP: clientIp
  });
};
