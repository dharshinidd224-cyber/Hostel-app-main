import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickLinks = () => {
  const navigate = useNavigate();

  const links = [
    {
      label: 'Forgot Password?',
      path: '/forgot-password',
      icon: 'HelpCircle',
      variant: 'link'
    },
    {
      label: 'Register as Student',
      path: '/student-registration',
      icon: 'UserPlus',
      variant: 'outline'
    },
    {
      label: 'Register as Warden',
      path: '/warden-registration',
      icon: 'ShieldPlus',
      variant: 'outline'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="text-center">
        <button
          onClick={() => navigate(links?.[0]?.path)}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth inline-flex items-center gap-2"
        >
          <Icon name={links?.[0]?.icon} size={16} />
          {links?.[0]?.label}
        </button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-4 text-muted-foreground font-medium">
            New User?
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {links?.slice(1)?.map((link, index) => (
          <button
            key={index}
            onClick={() => navigate(link?.path)}
            className="py-3 px-4 rounded-lg border border-border bg-card hover:bg-muted text-foreground font-medium text-sm transition-smooth flex items-center justify-center gap-2"
          >
            <Icon name={link?.icon} size={18} />
            {link?.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;