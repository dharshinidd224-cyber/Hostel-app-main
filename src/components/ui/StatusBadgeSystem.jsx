import React from 'react';
import Icon from '../AppIcon';

const StatusBadgeSystem = ({ status, showIcon = true, size = 'default' }) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: 'Clock',
      className: 'status-badge pending'
    },
    'in-progress': {
      label: 'In Progress',
      icon: 'RefreshCw',
      className: 'status-badge in-progress'
    },
    resolved: {
      label: 'Resolved',
      icon: 'CheckCircle',
      className: 'status-badge resolved'
    },
    rejected: {
      label: 'Rejected',
      icon: 'XCircle',
      className: 'status-badge rejected'
    }
  };

  const config = statusConfig?.[status] || statusConfig?.pending;
  const iconSize = size === 'small' ? 12 : 14;

  return (
    <span className={config?.className}>
      {showIcon && <Icon name={config?.icon} size={iconSize} />}
      <span>{config?.label}</span>
    </span>
  );
};

export default StatusBadgeSystem;
