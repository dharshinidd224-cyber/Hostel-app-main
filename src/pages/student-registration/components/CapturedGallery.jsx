import React from 'react';
import Icon from '../../../components/AppIcon';
import { POSES } from './PoseGuide';

/**
 * CapturedGallery
 * ----------------
 * Shows one thumbnail slot per pose. Filled slots show the captured image
 * and can be clicked to retake just that sample. Empty slots are inert
 * placeholders — the active one (next to be captured) is highlighted.
 *
 * Props:
 * - samples: array of length 5, each entry either null or { pose, image }
 * - activeIndex: index currently being captured (highlighted), or null if all are filled
 * - onSelect(index): called when a filled thumbnail is clicked, to retake that sample
 * - disabled: true while a capture/review is in progress, to prevent switching mid-flow
 */
const CapturedGallery = ({ samples = [], activeIndex = null, onSelect, disabled = false }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm md:text-base font-medium text-foreground">Captured Samples</span>
        <span className="text-xs md:text-sm text-muted-foreground">
          {samples?.filter(Boolean)?.length} of {POSES?.length} samples captured
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {POSES?.map((pose, index) => {
          const sample = samples?.[index];
          const isActive = activeIndex === index;

          return (
            <button
              key={pose?.id}
              type="button"
              disabled={!sample || disabled}
              onClick={() => sample && onSelect?.(index)}
              className={`group relative aspect-square rounded-lg border-2 overflow-hidden transition-smooth
                ${sample ? 'border-success cursor-pointer' : isActive ? 'border-primary border-dashed' : 'border-border border-dashed'}
                ${!sample ? 'cursor-default' : ''}`}
            >
              {sample ? (
                <>
                  <img
                    src={sample?.image}
                    alt={`${pose?.label} sample`}
                    className="w-full h-full object-cover"
                  />
                  {/* Retake overlay, shown on hover to hint the thumbnail is clickable */}
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/70 flex items-center justify-center transition-smooth">
                    <Icon
                      name="RotateCcw"
                      size={16}
                      className="text-foreground opacity-0 group-hover:opacity-100 transition-smooth"
                    />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-muted text-muted-foreground">
                  <Icon name={pose?.icon} size={16} />
                </div>
              )}

              {/* Pose label */}
              <span className="absolute bottom-0 inset-x-0 bg-background/85 text-[10px] md:text-xs text-center text-foreground py-0.5 truncate px-1">
                {pose?.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CapturedGallery;