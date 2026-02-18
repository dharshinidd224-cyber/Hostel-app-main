import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationBenefits = () => {
  const benefits = [
    {
      icon: 'CheckCircle2',
      title: 'Daily Attendance',
      description: 'Mark your attendance easily from hostel Wi-Fi'
    },
    {
      icon: 'MessageSquare',
      title: 'Submit Grievances',
      description: 'Report maintenance issues with photo evidence'
    },
    {
      icon: 'Star',
      title: 'Provide Feedback',
      description: 'Share your experience to improve hostel services'
    },
    {
      icon: 'Bell',
      title: 'Stay Updated',
      description: 'Receive important notices and emergency alerts'
    }
  ];

  return (
    <div className="bg-muted/50 rounded-xl p-4 md:p-6 lg:p-8">
      <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-4 md:mb-6">
        What You Get
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {benefits?.map((benefit, index) => (
          <div key={index} className="flex gap-3 md:gap-4">
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name={benefit?.icon} size={20} color="var(--color-primary)" className="md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-medium text-foreground mb-1">
                {benefit?.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {benefit?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationBenefits;