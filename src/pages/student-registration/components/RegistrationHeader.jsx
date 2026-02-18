import React from 'react';
import Icon from '../../../components/AppIcon';

const RegistrationHeader = () => {
  return (
    <div className="text-center mb-6 md:mb-8 lg:mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-primary/10 mb-4 md:mb-6">
        <Icon name="UserPlus" size={32} color="var(--color-primary)" className="md:w-10 md:h-10 lg:w-12 lg:h-12" />
      </div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2 md:mb-3">
        Student Registration
      </h1>
      <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-md mx-auto px-4">
        Create your hostel account to access attendance marking, grievance submission, and feedback services
      </p>
    </div>
  );
};

export default RegistrationHeader;