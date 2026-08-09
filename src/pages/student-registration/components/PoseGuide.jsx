import React from 'react';
import Icon from '../../../components/AppIcon';

// Exported so FaceRegistration.jsx and CapturedGallery.jsx share one definition of the pose sequence.
export const POSES = [
  { id: 'front', label: 'Front', icon: 'User', instruction: 'Look straight at the camera with a neutral expression.' },
  { id: 'slight_left', label: 'Slight Left', icon: 'RotateCcw', instruction: 'Slowly turn your head slightly to the left.' },
  { id: 'slight_right', label: 'Slight Right', icon: 'RotateCw', instruction: 'Slowly turn your head slightly to the right.' },
  { id: 'chin_up', label: 'Chin Up', icon: 'ArrowUp', instruction: 'Tilt your chin up slightly, keeping your eyes on the camera.' },
  { id: 'front_again', label: 'Front Again', icon: 'User', instruction: 'Return to looking straight at the camera.' },
];

/**
 * PoseGuide
 * ---------
 * Small instruction banner shown above the camera telling the user which
 * of the 5 poses they're currently capturing.
 *
 * Props:
 * - poseIndex: 0-4, index into the POSES array
 */
const PoseGuide = ({ poseIndex = 0 }) => {
  const pose = POSES?.[poseIndex] || POSES[0];

  return (
    <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-lg p-3 md:p-4">
      <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/15 flex items-center justify-center">
        <Icon name={pose?.icon} size={18} color="var(--color-primary)" />
      </div>
      <div>
        <p className="text-sm md:text-base font-medium text-foreground">
          Sample {poseIndex + 1} of {POSES?.length} &middot; {pose?.label}
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">{pose?.instruction}</p>
      </div>
    </div>
  );
};

export default PoseGuide;