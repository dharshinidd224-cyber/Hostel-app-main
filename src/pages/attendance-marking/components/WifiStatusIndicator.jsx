import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const WifiStatusIndicator = ({ onStatusChange }) => {
  const [wifiStatus, setWifiStatus] = useState({
    connected: false,
    ssid: null,
    signalStrength: 0
  });

  const checkWifiConnection = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const isWifi = connection?.type === 'wifi';
      const status = {
        connected: isWifi,
        ssid: isWifi ? 'Hostel WiFi Network' : null,
        signalStrength: isWifi ? Math.floor(Math.random() * 30) + 70 : 0
      };
      setWifiStatus(status);
      if (onStatusChange) onStatusChange(status);
    } else {
      const mockStatus = {
        connected: true,
        ssid: 'Hostel WiFi Network',
        signalStrength: 85
      };
      setWifiStatus(mockStatus);
      if (onStatusChange) onStatusChange(mockStatus);
    }
  };

  useEffect(() => {
    checkWifiConnection();
    const interval = setInterval(checkWifiConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSignalIcon = () => {
    if (!wifiStatus?.connected) return 'WifiOff';
    if (wifiStatus?.signalStrength >= 80) return 'Wifi';
    if (wifiStatus?.signalStrength >= 50) return 'Wifi';
    return 'Wifi';
  };

  return (
    <div className={`flex items-center gap-3 p-3 md:p-4 rounded-lg border transition-smooth ${
      wifiStatus?.connected 
        ? 'bg-success/10 border-success/20' :'bg-destructive/10 border-destructive/20'
    }`}>
      <div className="flex-shrink-0">
        <Icon 
          name={getSignalIcon()} 
          size={20} 
          color={wifiStatus?.connected ? 'var(--color-success)' : 'var(--color-destructive)'}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm md:text-base font-medium text-foreground mb-0.5">
          {wifiStatus?.connected ? 'Connected to Hostel WiFi' : 'Not Connected'}
        </p>
        {wifiStatus?.connected ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <p className="text-xs md:text-sm text-muted-foreground caption">
              Network: {wifiStatus?.ssid}
            </p>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4]?.map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 rounded-sm transition-smooth ${
                      bar * 25 <= wifiStatus?.signalStrength 
                        ? 'bg-success' :'bg-muted'
                    }`}
                    style={{ height: `${bar * 3}px` }}
                  />
                ))}
              </div>
              <span className="text-xs text-success caption data-text ml-1">
                {wifiStatus?.signalStrength}%
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs md:text-sm text-muted-foreground caption">
            Please connect to hostel WiFi to mark attendance
          </p>
        )}
      </div>
      <button
        onClick={checkWifiConnection}
        className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-smooth active:scale-95"
        aria-label="Refresh WiFi status"
      >
        <Icon name="RefreshCw" size={16} />
      </button>
    </div>
  );
};

export default WifiStatusIndicator;