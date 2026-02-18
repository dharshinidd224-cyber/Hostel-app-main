import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const NotificationDisplay = ({ 
  notification, 
  onDismiss,
  autoHideDuration = 5000,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHideDuration && notification?.type !== 'emergency') {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, notification]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  };

  if (!isVisible || !notification) return null;

  const typeConfig = {
    emergency: {
      icon: 'AlertTriangle',
      className: 'notification-banner emergency'
    },
    notice: {
      icon: 'Info',
      className: 'notification-banner'
    },
    alert: {
      icon: 'Bell',
      className: 'notification-banner'
    }
  };

  const config = typeConfig?.[notification?.type] || typeConfig?.notice;

  return (
    <div className={config?.className} style={{ animation: 'slideIn 300ms ease-out' }}>
      <div className="notification-content">
        <div className="notification-icon">
          <Icon name={config?.icon} size={20} />
        </div>
        <div className="notification-text">
          {notification?.title && (
            <div className="font-semibold mb-1">{notification?.title}</div>
          )}
          <div>{notification?.message}</div>
          {notification?.timestamp && (
            <div className="text-xs mt-1 opacity-75 data-text">
              {new Date(notification.timestamp)?.toLocaleString()}
            </div>
          )}
        </div>
        {notification?.type !== 'emergency' && (
          <button
            onClick={handleDismiss}
            className="notification-close"
            aria-label="Dismiss notification"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationDisplay;