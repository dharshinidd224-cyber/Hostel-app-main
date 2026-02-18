import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActionsBar = ({ attendanceStatus }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border shadow-elevation-sm">
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <Button
          variant={attendanceStatus === 'pending' ? 'default' : 'outline'}
          iconName="CheckSquare"
          iconPosition="left"
          onClick={() => navigate('/mark-attendance')}
          fullWidth
        >
          {attendanceStatus === 'pending' ? 'Mark Attendance' : 'View Attendance'}
        </Button>
        <Button
          variant="outline"
          iconName="MessageSquare"
          iconPosition="left"
          onClick={() => navigate('/submit-grievance')}
          fullWidth
        >
          Submit Grievance
        </Button>
      </div>
    </div>
  );
};

export default QuickActionsBar;