import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityFeatures = () => {
  const features = [
    {
      icon: 'Shield',
      title: 'Secure Authentication',
      description: 'JWT-based authentication with encrypted password storage using bcrypt hashing'
    },
    {
      icon: 'Lock',
      title: 'Role-Based Access',
      description: 'Dedicated warden interface with administrative privileges for hostel management'
    },
    {
      icon: 'UserCheck',
      title: 'Staff Verification',
      description: 'Staff ID validation against institution database ensures authorized access only'
    },
    {
      icon: 'Bell',
      title: 'Real-Time Alerts',
      description: 'Instant notifications for critical grievances and attendance anomalies'
    }
  ];

  return (
    <div className="bg-card rounded-xl shadow-elevation-md p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="ShieldCheck" size={24} color="var(--color-success)" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Administrative Security
          </h2>
          <p className="text-sm text-muted-foreground">
            Enterprise-grade protection for hostel operations
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {features?.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={feature?.icon} size={20} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-medium text-foreground mb-1">
                {feature?.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground">
            <p className="font-medium mb-1">Important Notice</p>
            <p className="text-muted-foreground">
              Warden accounts require administrative approval. You will receive confirmation via registered phone number within 24-48 hours of registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityFeatures;