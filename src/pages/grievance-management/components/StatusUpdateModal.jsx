import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const StatusUpdateModal = ({ isOpen, onClose, grievance, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(grievance?.status || 'submitted');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'submitted', label: 'Submitted' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const handleSubmit = async () => {
    if (selectedStatus === 'resolved' && !remarks?.trim()) {
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onUpdate({
      id: grievance?.id,
      status: selectedStatus,
      remarks: remarks?.trim()
    });

    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    setSelectedStatus(grievance?.status || 'submitted');
    setRemarks('');
    onClose();
  };

  if (!isOpen || !grievance) return null;

  return (
    <div className="validation-popup">
      <div className="validation-popup-content max-w-2xl">
        <div className="validation-popup-header">
          <div className="validation-popup-icon warning">
            <Icon name="Edit" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="validation-popup-title">Update Grievance Status</h3>
            <p className="text-sm text-muted-foreground caption mt-1">
              Grievance ID: {grievance?.id}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="validation-popup-message">
          <div className="mb-4 p-4 rounded-lg bg-muted">
            <div className="flex items-start gap-3 mb-3">
              <Icon name="User" size={16} color="var(--color-primary)" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{grievance?.studentName}</div>
                <div className="text-xs text-muted-foreground caption">
                  Block {grievance?.block} • Room {grievance?.room}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="FileText" size={16} color="var(--color-primary)" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-1">{grievance?.category}</div>
                <div className="text-xs text-muted-foreground">{grievance?.description}</div>
              </div>
            </div>
          </div>

          <Select
            label="New Status"
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
            required
            className="mb-4"
          />

          <Input
            label="Resolution Remarks"
            type="text"
            placeholder="Enter remarks (required for resolved status)"
            value={remarks}
            onChange={(e) => setRemarks(e?.target?.value)}
            required={selectedStatus === 'resolved'}
            description={selectedStatus === 'resolved' ? 'Remarks are mandatory for resolved grievances' : 'Optional for other statuses'}
            error={selectedStatus === 'resolved' && !remarks?.trim() ? 'Remarks are required for resolved status' : ''}
          />
        </div>

        <div className="validation-popup-actions">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={selectedStatus === 'resolved' && !remarks?.trim()}
            iconName="CheckCircle"
            iconPosition="left"
          >
            Update Status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;