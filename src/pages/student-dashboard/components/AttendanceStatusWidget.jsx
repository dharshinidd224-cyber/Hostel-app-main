import React from 'react';
import Icon from '../../../components/AppIcon';

const AttendanceStatusWidget = ({ status, lastMarkedTime }) => {
  const getStatusConfig = () => {
    if (status === 'present') {
      return {
        icon: 'CheckCircle2',
        text: 'Attendance Marked',
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20'
      };
    }
    return {
      icon: 'AlertCircle',
      text: 'Attendance Pending',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    };
  };

  const config = getStatusConfig();

  return (
    <div className={`bg-card rounded-xl p-4 md:p-6 border ${config?.borderColor} shadow-elevation-sm`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`${config?.bgColor} rounded-lg p-2 md:p-3`}>
          <Icon name={config?.icon} size={20} className={config?.color} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-semibold text-foreground">Today's Attendance</h3>
          <p className={`text-xs md:text-sm ${config?.color} font-medium`}>{config?.text}</p>
        </div>
      </div>
      {status === 'present' && lastMarkedTime && (
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mt-2 pt-2 border-t border-border">
          <Icon name="Clock" size={14} />
          <span>Marked at {lastMarkedTime}</span>
        </div>
      )}
    </div>
  );
};

export default AttendanceStatusWidget;