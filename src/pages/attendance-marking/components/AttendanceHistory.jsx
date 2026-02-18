import React from 'react';
import Icon from '../../../components/AppIcon';

const AttendanceHistory = ({ history }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'present':
        return {
          icon: 'CheckCircle',
          color: 'var(--color-success)',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          label: 'Present'
        };
      case 'absent':
        return {
          icon: 'XCircle',
          color: 'var(--color-destructive)',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          label: 'Absent'
        };
      default:
        return {
          icon: 'Clock',
          color: 'var(--color-warning)',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          label: 'Pending'
        };
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="History" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-foreground">
            Attendance History
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground caption">
            Last 7 days attendance records
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {history?.map((record) => {
          const config = getStatusConfig(record?.status);
          return (
            <div
              key={record?.id}
              className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border ${config?.bgColor} ${config?.borderColor} transition-smooth hover:shadow-md`}
            >
              <div className="flex-shrink-0">
                <Icon name={config?.icon} size={20} color={config?.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                  <p className="text-sm md:text-base font-medium text-foreground">
                    {record?.date}
                  </p>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium caption ${config?.bgColor}`} style={{ color: config?.color }}>
                    <Icon name={config?.icon} size={12} />
                    {config?.label}
                  </span>
                </div>
                {record?.timestamp && (
                  <p className="text-xs md:text-sm text-muted-foreground caption mt-1 data-text">
                    Marked at {record?.timestamp}
                  </p>
                )}
                {record?.autoMarked && (
                  <p className="text-xs text-muted-foreground caption mt-1 flex items-center gap-1">
                    <Icon name="AlertCircle" size={12} />
                    Auto-marked absent
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-2 mb-3">
          <Icon name="TrendingUp" size={16} className="flex-shrink-0 mt-0.5" color="var(--color-primary)" />
          <p className="text-xs md:text-sm font-medium text-foreground">
            Attendance Statistics
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-success data-text">
              {history?.filter(r => r?.status === 'present')?.length}
            </p>
            <p className="text-xs text-muted-foreground caption mt-1">Present</p>
          </div>
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-destructive data-text">
              {history?.filter(r => r?.status === 'absent')?.length}
            </p>
            <p className="text-xs text-muted-foreground caption mt-1">Absent</p>
          </div>
          <div className="text-center">
            <p className="text-xl md:text-2xl font-bold text-primary data-text">
              {Math.round((history?.filter(r => r?.status === 'present')?.length / history?.length) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground caption mt-1">Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;