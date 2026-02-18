import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessConfirmation = ({ timestamp, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="validation-popup">
      <div className="validation-popup-content">
        <div className="validation-popup-header">
          <div className="validation-popup-icon success">
            <Icon name="CheckCircle" size={32} />
          </div>
          <div className="flex-1">
            <h3 className="validation-popup-title">
              Attendance Marked Successfully!
            </h3>
          </div>
        </div>

        <div className="validation-popup-message">
          <div className="flex items-center gap-2 mb-4 p-3 bg-success/10 rounded-lg">
            <Icon name="Calendar" size={20} color="var(--color-success)" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-0.5">
                {new Date()?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-muted-foreground caption data-text">
                Marked at {timestamp}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <Icon name="CheckCircle" size={16} className="flex-shrink-0 mt-0.5" color="var(--color-success)" />
              <p className="text-sm text-muted-foreground">
                Your attendance has been recorded successfully
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Wifi" size={16} className="flex-shrink-0 mt-0.5" color="var(--color-success)" />
              <p className="text-sm text-muted-foreground">
                Location verified via hostel WiFi network
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Shield" size={16} className="flex-shrink-0 mt-0.5" color="var(--color-success)" />
              <p className="text-sm text-muted-foreground">
                Attendance data securely saved
              </p>
            </div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground caption text-center">
              This window will close automatically in 5 seconds
            </p>
          </div>
        </div>

        <div className="validation-popup-actions">
          <Button
            variant="default"
            onClick={onClose}
            iconName="X"
            iconPosition="left"
            fullWidth
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessConfirmation;