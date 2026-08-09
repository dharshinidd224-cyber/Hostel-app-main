import React, { useState } from 'react';
import AuthenticationNavigation from '../../components/navigation/AuthenticationNavigation';
import RegistrationHeader from './components/RegistrationHeader';
import RegistrationStepper from './components/RegistrationStepper';
import RegistrationForm from './components/RegistrationForm';
import FaceRegistration from './components/FaceRegistration';
import RegistrationBenefits from './components/RegistrationBenefits';

const StudentRegistration = () => {
  const [step, setStep] = useState(1);
  const [studentData, setStudentData] = useState(null);

  const handleNext = (data) => {
    setStudentData(data);
    setStep(2);
  };

  // Lets the user go back to Student Details from Face Registration without losing what they typed
  const handleBackToDetails = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticationNavigation />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div className="max-w-3xl mx-auto">

          <RegistrationHeader />

          <RegistrationStepper currentStep={step} />

          <div className="bg-card rounded-xl shadow-elevation-md p-4 md:p-6 lg:p-8">

            {step === 1 ? (
              <RegistrationForm onNext={handleNext} />
            ) : (
              <FaceRegistration studentData={studentData} onBack={handleBackToDetails} />
            )}

          </div>

          <div className="mt-6 md:mt-8">
            <RegistrationBenefits />
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;