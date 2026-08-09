import React from 'react';
import Icon from '../../../components/AppIcon';

// Static step definitions for the registration flow.
// Add a step here if the flow ever grows beyond 2 steps — everything below is driven off this array.
const STEPS = [
  { id: 1, label: 'Student Details' },
  { id: 2, label: 'Face Registration' },
];

/**
 * RegistrationStepper
 * --------------------
 * Visual progress indicator for the 2-step registration flow.
 * Purely presentational — it derives completed / active / upcoming state
 * from the `currentStep` prop, so the parent (StudentRegistration/index.jsx)
 * stays the single source of truth for which step is active.
 *
 * Props:
 * - currentStep: 1 | 2 — the step currently shown to the user
 */
const RegistrationStepper = ({ currentStep = 1 }) => {
  return (
    <div className="mb-6 md:mb-8 lg:mb-10">
      <div className="flex items-start justify-center max-w-md mx-auto">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isLast = index === STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-shrink-0 w-20 md:w-28">
                <div
                  className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 text-sm md:text-base font-semibold transition-smooth
                    ${
                      isCompleted
                        ? 'bg-primary border-primary text-primary-foreground'
                        : isActive
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-border text-muted-foreground bg-muted'
                    }`}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={16} className="md:w-5 md:h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`mt-2 text-xs md:text-sm font-medium text-center leading-tight transition-smooth
                    ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line between steps, vertically centered on the circles */}
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mt-4 md:mt-5 mx-1 md:mx-2 transition-smooth ${
                    isCompleted ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrationStepper;