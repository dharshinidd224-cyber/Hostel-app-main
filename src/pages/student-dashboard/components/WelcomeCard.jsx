import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeCard = ({ studentName, roomNumber, blockNumber }) => {
  const getCurrentGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 md:p-8 lg:p-10 text-primary-foreground shadow-elevation-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm md:text-base opacity-90 mb-2">{getCurrentGreeting()},</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 md:mb-4">
            {studentName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 md:px-4 py-2">
              <Icon name="Home" size={18} className="flex-shrink-0" />
              <span className="font-medium">Room {roomNumber}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 md:px-4 py-2">
              <Icon name="Building2" size={18} className="flex-shrink-0" />
              <span className="font-medium">Block {blockNumber}</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-full flex-shrink-0">
          <Icon name="User" size={32} />
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;