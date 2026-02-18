import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeSection = () => {
  const features = [
    {
      icon: 'CheckSquare',
      title: 'Daily Attendance',
      description: 'Mark your attendance with Wi-Fi validation'
    },
    {
      icon: 'MessageSquare',
      title: 'Submit Grievances',
      description: 'Report issues and track resolution status'
    },
    {
      icon: 'Star',
      title: 'Provide Feedback',
      description: 'Share your experience and suggestions'
    },
    {
      icon: 'Bell',
      title: 'Stay Updated',
      description: 'Receive notices and emergency alerts'
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center md:text-left">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 mb-4 md:mb-6">
          <Icon name="Home" size={32} color="var(--color-primary)" className="md:w-10 md:h-10" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
          Welcome to HostelApp
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
          Your complete hostel management solution for seamless operations and better communication
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {features?.map((feature, index) => (
          <div
            key={index}
            className="p-4 md:p-6 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-elevation-md transition-smooth"
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name={feature?.icon} size={20} color="var(--color-primary)" className="md:w-6 md:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">
                  {feature?.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                  {feature?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 md:p-6 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-start gap-3 md:gap-4">
          <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">First time here?</span> Register using your college credentials to access all hostel management features and services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;