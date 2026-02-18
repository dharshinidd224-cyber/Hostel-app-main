import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ hasFilters, onResetFilters }) => {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <div className="card text-center py-12">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Icon name="Search" size={32} color="var(--color-muted-foreground)" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
              No Matching Grievances
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              No grievances found matching your current filters. Try adjusting your search criteria.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onResetFilters}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card text-center py-12">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="FileText" size={32} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            No Grievances Yet
          </h3>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            You haven't submitted any grievances yet. Submit your first grievance to start tracking issues.
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => navigate('/submit-grievance')}
          iconName="Plus"
          iconPosition="left"
        >
          Submit Grievance
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;