import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessModal = ({ isOpen, grievanceId, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewGrievances = () => {
    navigate('/my-grievances');
  };

  const handleSubmitAnother = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div 
        className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 md:p-8 relative"
        style={{ animation: 'scaleIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors duration-200 group"
          aria-label="Close modal"
        >
          <Icon 
            name="X" 
            size={20} 
            className="text-muted-foreground group-hover:text-foreground transition-colors" 
          />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
            <Icon name="CheckCircle" size={40} color="var(--color-success)" />
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Grievance Submitted Successfully!
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            Your grievance has been recorded and assigned to the hostel administration for review.
          </p>

          <div className="w-full p-4 bg-primary/5 rounded-lg border border-primary/20 mb-6">
            <div className="text-xs text-muted-foreground caption mb-2">
              Your Grievance ID
            </div>
            <div className="text-2xl font-bold text-primary data-text">
              {grievanceId}
            </div>
            <div className="text-xs text-muted-foreground caption mt-2">
              Use this ID to track your grievance status
            </div>
          </div>

          <div className="w-full space-y-3">
            <Button
              variant="default"
              onClick={handleViewGrievances}
              iconName="FileText"
              iconPosition="left"
              fullWidth
            >
              View My Grievances
            </Button>

            <Button
              variant="outline"
              onClick={handleSubmitAnother}
              iconName="Plus"
              iconPosition="left"
              fullWidth
            >
              Submit Another Grievance
            </Button>
          </div>

          <div className="mt-6 p-3 bg-accent/10 rounded-lg border border-accent/20 w-full">
            <div className="flex items-start gap-2 text-left">
              <Icon name="Info" size={16} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
              <div className="text-xs text-accent-foreground caption">
                You will receive updates on your grievance status. Expected response time is 24-48 hours.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;