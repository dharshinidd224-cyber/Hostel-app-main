import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const ScheduleOptions = ({ scheduleEnabled, onScheduleToggle, scheduledDate, onDateChange, scheduledTime, onTimeChange }) => {
  const minDate = new Date()?.toISOString()?.split('T')?.[0];
  const minTime = new Date()?.toTimeString()?.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          Delivery Options
        </label>
        <Checkbox
          label="Schedule for later"
          checked={scheduleEnabled}
          onChange={(e) => onScheduleToggle(e?.target?.checked)}
          size="sm"
        />
      </div>
      {!scheduleEnabled ? (
        <div className="p-4 md:p-5 rounded-xl bg-success/5 border border-success/20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Icon name="Zap" size={20} color="var(--color-success)" />
            </div>
            <div>
              <div className="text-sm md:text-base font-medium text-success mb-1">
                Immediate Delivery
              </div>
              <div className="text-xs md:text-sm text-muted-foreground caption">
                Message will be sent immediately after posting
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-4 md:p-5 rounded-xl bg-card border border-border">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name="Clock" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <div className="text-sm md:text-base font-medium text-foreground mb-1">
                Scheduled Delivery
              </div>
              <div className="text-xs md:text-sm text-muted-foreground caption">
                Choose when to send this message
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Delivery Date"
              value={scheduledDate}
              onChange={(e) => onDateChange(e?.target?.value)}
              min={minDate}
              required
            />
            <Input
              type="time"
              label="Delivery Time"
              value={scheduledTime}
              onChange={(e) => onTimeChange(e?.target?.value)}
              min={scheduledDate === minDate ? minTime : undefined}
              required
            />
          </div>

          {scheduledDate && scheduledTime && (
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground caption">
              <Icon name="Info" size={14} />
              <span>
                Message will be delivered on {new Date(`${scheduledDate}T${scheduledTime}`)?.toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleOptions;