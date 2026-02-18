import React from 'react';
import Icon from '../../../components/AppIcon';

const ResponsibilitiesOverview = () => {
  const responsibilities = [
    {
      category: 'Attendance Management',
      icon: 'ClipboardCheck',
      color: 'var(--color-primary)',
      tasks: [
        'Monitor daily student attendance records',
        'View present and absent student lists',
        'Track attendance patterns and anomalies',
        'Generate attendance reports for administration'
      ]
    },
    {
      category: 'Grievance Resolution',
      icon: 'MessageSquare',
      color: 'var(--color-secondary)',
      tasks: [
        'Review and categorize student complaints',
        'Update grievance status (Submitted, In Progress, Resolved)',
        'Add resolution remarks and timestamps',
        'Filter complaints by category and priority'
      ]
    },
    {
      category: 'Communication',
      icon: 'Megaphone',
      color: 'var(--color-accent)',
      tasks: [
        'Post important notices and announcements',
        'Send emergency alerts to students',
        'Manage hostel-wide communications',
        'Coordinate with other block wardens'
      ]
    }
  ];

  return (
    <div className="bg-card rounded-xl shadow-elevation-md p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Briefcase" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Warden Responsibilities
          </h2>
          <p className="text-sm text-muted-foreground">
            Key duties and administrative functions
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {responsibilities?.map((responsibility, index) => (
          <div key={index} className="border border-border rounded-lg p-4 md:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${responsibility?.color}15` }}>
                <Icon name={responsibility?.icon} size={20} color={responsibility?.color} />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-foreground">
                {responsibility?.category}
              </h3>
            </div>
            <ul className="space-y-2">
              {responsibility?.tasks?.map((task, taskIndex) => (
                <li key={taskIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Icon name="Check" size={16} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Access Level</p>
            <p className="text-muted-foreground">
              As a warden, you will have full administrative access to your assigned block's operations, including student data, attendance records, and grievance management systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsibilitiesOverview;