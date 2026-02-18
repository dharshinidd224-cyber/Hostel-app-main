import React from 'react';
import Icon from '../../../components/AppIcon';

const AttendancePolicyCard = () => {
  const policies = [
    {
      icon: "Clock",
      title: "Daily Deadline",
      description: "Attendance must be marked before 11:59 PM each day. Late submissions will be marked as absent."
    },
    {
      icon: "Wifi",
      title: "Wi-Fi Requirement",
      description: "You must be connected to the hostel Wi-Fi network (HostelWiFi_Main) to mark attendance."
    },
    {
      icon: "CheckCircle2",
      title: "One Per Day",
      description: "Attendance can only be marked once per day. Once marked, it cannot be changed."
    },
    {
      icon: "AlertTriangle",
      title: "Auto Absent",
      description: "If attendance is not marked by the deadline, you will be automatically marked as absent."
    }
  ];

  return (
    <div className="bg-card rounded-xl shadow-elevation-md p-4 md:p-6 lg:p-8 border border-border">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon name="FileText" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground">
            Attendance Policies
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Important guidelines for marking attendance
          </p>
        </div>
      </div>
      <div className="space-y-3 md:space-y-4">
        {policies?.map((policy, index) => (
          <div
            key={index}
            className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-smooth"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name={policy?.icon} size={20} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-semibold text-foreground mb-1">
                {policy?.title}
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {policy?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-warning/5 rounded-lg border border-warning/20">
        <div className="flex items-start gap-2 md:gap-3">
          <Icon name="Info" size={18} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm md:text-base font-semibold text-warning mb-1">
              Important Reminder
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground">
              Consistent attendance is mandatory for all hostel residents. Excessive absences may result in disciplinary action. If you face any issues marking attendance, please contact the warden immediately.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
        <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
          <span>Need help?</span>
          <button className="text-primary hover:underline font-medium flex items-center gap-1">
            Contact Warden
            <Icon name="ExternalLink" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePolicyCard;