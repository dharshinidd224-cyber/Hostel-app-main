import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessConfirmation = ({ isOpen, onClose, messageData, onPostAnother }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { type, title, targets, scheduledDate, scheduledTime } = messageData;
  const isEmergency = type === 'alert';
  const estimatedRecipients = targets?.length * 25;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div 
        className="bg-card rounded-xl shadow-2xl w-full max-w-md p-6 md:p-8"
        style={{ animation: 'scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <Icon name="CheckCircle" size={32} color="var(--color-success)" />
          </div>

          <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
            {scheduledDate ? 'Message Scheduled!' : 'Message Posted!'}
          </h3>

          <p className="text-sm md:text-base text-muted-foreground mb-6">
            {scheduledDate 
              ? `Your ${isEmergency ? 'emergency alert' : 'notice'} has been scheduled for delivery`
              : `Your ${isEmergency ? 'emergency alert' : 'notice'} has been sent successfully`
            }
          </p>

          <div className="w-full space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Message Title</span>
              <span className="text-sm font-medium text-foreground truncate ml-2 max-w-[60%]">
                {title}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Recipients</span>
              <span className="text-sm font-medium text-foreground data-text">
                {estimatedRecipients} students
              </span>
            </div>

            {scheduledDate && scheduledTime && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Delivery Time</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date(`${scheduledDate}T${scheduledTime}`)?.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Message Type</span>
              <span className={`
                inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium caption
                ${isEmergency 
                  ? 'bg-destructive/10 text-destructive' :'bg-primary/10 text-primary'
                }
              `}>
                <Icon name={isEmergency ? 'AlertTriangle' : 'Bell'} size={12} />
                {isEmergency ? 'Emergency Alert' : 'General Notice'}
              </span>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onPostAnother}
              fullWidth
              iconName="Plus"
              iconPosition="left"
            >
              Post Another
            </Button>
            <Button
              variant="default"
              onClick={onClose}
              fullWidth
              iconName="ArrowRight"
              iconPosition="right"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessConfirmation;