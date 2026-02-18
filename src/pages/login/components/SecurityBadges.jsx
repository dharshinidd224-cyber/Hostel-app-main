import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const badges = [
    {
      icon: 'Shield',
      text: 'SSL Secured',
      color: 'text-success'
    },
    {
      icon: 'Lock',
      text: 'Data Protected',
      color: 'text-primary'
    },
    {
      icon: 'CheckCircle',
      text: 'Verified Institution',
      color: 'text-secondary'
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {badges?.map((badge, index) => (
        <div key={index} className="flex items-center gap-2">
          <Icon name={badge?.icon} size={16} className={badge?.color} />
          <span className="text-xs md:text-sm text-muted-foreground font-medium">
            {badge?.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SecurityBadges;