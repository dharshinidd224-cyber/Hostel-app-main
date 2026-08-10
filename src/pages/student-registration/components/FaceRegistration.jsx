import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Camera from './Camera';
import FaceValidation from './FaceValidation';
import PoseGuide, { POSES } from './PoseGuide';
import CapturedGallery from './CapturedGallery';

// Adjust to match wherever the Express backend is mounted (or rely on a dev-server proxy).
const REGISTRATION_ENDPOINT =
  "http://localhost:5000/api/students/register";

const LOADING_MESSAGES = [
  'Creating Account...',
  'Generating Face Embeddings...',
  'Saving Student...',
  'Please Wait...',
];

const INSTRUCTIONS = [
  'Look directly at the camera',
  'Good lighting',
  'Remove mask',
  'Remove sunglasses',
  'One face only',
  'Neutral expression',
];

// Converts the JPEG data URL produced by Camera.captureFrame() into a Blob
// suitable for attaching to a multipart/form-data request.
const dataURLtoBlob = (dataURL) => {
  const [header, base64] = dataURL?.split(',') || [];
  const mimeMatch = header?.match(/:(.*?);/);
  const mime = mimeMatch?.[1] || 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary?.length);
  for (let i = 0; i < binary?.length; i += 1) {
    bytes[i] = binary?.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
};

const FaceRegistration = ({ studentData, onBack }) => {
  const navigate = useNavigate();
  const cameraRef = useRef(null);

  // samples[i] is either null (not yet captured) or { pose, image } once saved
  const [samples, setSamples] = useState(Array(POSES?.length)?.fill(null));
  // Index of the sample currently being captured/retaken, or null once all 5 are filled
  const [activeIndex, setActiveIndex] = useState(0);

  // 'live' = showing the camera feed, 'frozen' = showing a captured still awaiting Retake/Use Photo
  const [mode, setMode] = useState('live');
  const [frozenImage, setFrozenImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const [validation, setValidation] = useState({ checks: {}, canCapture: false, reason: '' });

  // 'idle' | 'loading' | 'success'
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const allCaptured = samples?.every(Boolean);
  const isLiveChecking = mode === 'live' && activeIndex !== null && submitStatus === 'idle';

  // Cycle through the loading messages while the submission request is in flight
  useEffect(() => {
    if (submitStatus !== 'loading') return undefined;
    setLoadingMessageIndex(0);
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES?.length);
    }, 900);
    return () => clearInterval(interval);
  }, [submitStatus]);

  // After a successful submission, hold the success message briefly, then redirect to login
  useEffect(() => {
    if (submitStatus !== 'success') return undefined;
    const timeout = setTimeout(() => navigate('/login'), 1800);
    return () => clearTimeout(timeout);
  }, [submitStatus, navigate]);

  const handleCaptureFace = () => {
    if (mode !== 'live' || !validation?.canCapture || activeIndex === null) return;

    const image = cameraRef?.current?.captureFrame?.();
    if (!image) return;

    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 200); // brief shutter flash only

    setFrozenImage(image);
    setMode('frozen');
  };

  const handleRetake = () => {
    setFrozenImage(null);
    setMode('live');
  };

  const handleUsePhoto = () => {
    if (activeIndex === null || !frozenImage) return;

    const next = [...samples];
    next[activeIndex] = { pose: POSES?.[activeIndex]?.label, image: frozenImage };
    setSamples(next);

    const nextEmptyIndex = next?.findIndex((sample) => !sample);

    if (nextEmptyIndex === -1) {
      // That was the 5th sample — hold the frame on this photo for final review
      // instead of jumping back to the live feed. frozenImage is left as-is on purpose.
      setActiveIndex(null);
      setMode('complete');
    } else {
      setActiveIndex(nextEmptyIndex);
      setFrozenImage(null);
      setMode('live');
    }
  };

  // Discards all 5 samples and starts the capture sequence over from "Front"
  const handleRetakeAll = () => {
    setSamples(Array(POSES?.length)?.fill(null));
    setActiveIndex(0);
    setFrozenImage(null);
    setMode('live');
  };

  // Clicking an already-captured thumbnail lets the user redo just that one sample —
  // works both mid-sequence ('live') and after all 5 are done ('complete'), just not
  // while a single shot is already frozen awaiting Retake/Use Photo.
  const handleSelectThumbnail = (index) => {
    if (mode === 'frozen' || !samples?.[index]) return;
    setActiveIndex(index);
    setFrozenImage(null);
    setMode('live');
  };

  const handleBack = () => {
    if (submitStatus === 'loading') return;
    onBack?.();
  };

  const handleCompleteRegistration = async () => {
    if (!allCaptured || submitStatus === 'loading') return;

    setSubmitError('');
    setSubmitStatus('loading');

    try {
      const formData = new FormData();

      // Student details collected in Step 1
      Object.entries(studentData || {})?.forEach(([key, value]) => {
        if (key === 'password' || key === 'confirmPassword') {
          // Passwords still need to reach the backend, but never logged/inspected here
          formData.append(key, value);
          return;
        }
        formData.append(key, value ?? '');
      });

      // 5 captured face samples, one multipart file each
      samples?.forEach((sample, index) => {
        const blob = dataURLtoBlob(sample?.image);
        const filename = `${sample?.pose?.replace(/\s+/g, '_')?.toLowerCase()}_${index + 1}.jpg`;
        formData.append('faceSamples', blob, filename);
      });

      const response = await fetch(REGISTRATION_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      if (!response?.ok) {
        throw new Error(`Registration failed (server responded with ${response?.status}).`);
      }

      setSubmitStatus('success');
    } catch (err) {
      setSubmitStatus('idle');
      setSubmitError(
        err?.message || 'Something went wrong while submitting your registration. Please try again.'
      );
    }
  };

  // ---------------------------------------------------------------------
  // Success screen
  // ---------------------------------------------------------------------
  if (submitStatus === 'success') {
    return (
      <div className="flex flex-col items-center text-center py-8 md:py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-success/10 mb-4 md:mb-6">
          <Icon name="CheckCircle2" size={32} color="var(--color-success)" className="md:w-10 md:h-10" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Registration Successful</h2>
        <p className="text-sm md:text-base text-muted-foreground">Redirecting to Login...</p>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Loading screen
  // ---------------------------------------------------------------------
  if (submitStatus === 'loading') {
    return (
      <div className="flex flex-col items-center text-center py-8 md:py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-4 md:mb-6">
          <Icon name="Loader2" size={32} color="var(--color-primary)" className="md:w-10 md:h-10 animate-spin" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Creating Your Account</h2>
        <p className="text-sm md:text-base text-muted-foreground transition-smooth">
          {LOADING_MESSAGES?.[loadingMessageIndex]}
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Main enrollment UI
  // ---------------------------------------------------------------------
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-2">Face Registration</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          {studentData?.name ? `Hi ${studentData?.name}, capture` : 'Capture'} 5 face samples from slightly
          different angles so we can securely verify your identity.
        </p>
      </div>

      {submitError ? (
        <div className="flex items-start gap-3 bg-error/10 border border-error/20 rounded-lg p-3 md:p-4">
          <Icon name="AlertCircle" size={18} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{submitError}</p>
        </div>
      ) : null}

      <Camera
        ref={cameraRef}
        frozenImage={mode !== 'live' ? frozenImage : null}
        canCapture={mode === 'live' && !!validation?.canCapture && activeIndex !== null}
        isCapturing={isCapturing}
        active={mode !== 'complete'}
      />

      {mode === 'live' && activeIndex !== null && <PoseGuide poseIndex={activeIndex} />}

      {mode === 'live' && activeIndex !== null && (
        <FaceValidation cameraRef={cameraRef} isActive={isLiveChecking} onStatusChange={setValidation} />
      )}

      {mode === 'frozen' && (
        <div className="bg-muted/50 rounded-xl p-4 md:p-6 text-center">
          <p className="text-sm md:text-base text-foreground font-medium mb-1">How does this photo look?</p>
          <p className="text-xs md:text-sm text-muted-foreground">
            Choose Use Photo to save it, or Retake to try this pose again.
          </p>
        </div>
      )}

      {mode === 'complete' && (
        <div className="flex items-center gap-3 bg-success/10 border border-success/20 rounded-lg p-3 md:p-4">
          <Icon name="CheckCircle2" size={20} color="var(--color-success)" />
          <p className="text-sm md:text-base font-medium text-success">
            All 5 samples captured. If the photo above looks good, complete registration below —
            otherwise retake all samples.
          </p>
        </div>
      )}

      {/* Instructions card */}
      <div className="bg-muted/50 rounded-xl p-4 md:p-6">
        <h3 className="text-sm md:text-base font-semibold text-foreground mb-3 md:mb-4">Before You Capture</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 md:gap-y-3">
          {INSTRUCTIONS?.map((instruction) => (
            <div key={instruction} className="flex items-center gap-2">
              <Icon name="CheckCircle2" size={16} color="var(--color-success)" className="flex-shrink-0" />
              <span className="text-xs md:text-sm text-foreground">{instruction}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Capture controls — swap between "Capture Face" and "Retake / Use Photo" based on mode */}
      {mode === 'live' && activeIndex !== null && (
        <Button
          type="button"
          variant="default"
          fullWidth
          iconName="Camera"
          iconPosition="left"
          disabled={!validation?.canCapture}
          onClick={handleCaptureFace}
        >
          Capture Face
        </Button>
      )}

      {mode === 'frozen' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button type="button" variant="outline" fullWidth iconName="RotateCcw" iconPosition="left" onClick={handleRetake}>
            Retake
          </Button>
          <Button type="button" variant="default" fullWidth iconName="Check" iconPosition="left" onClick={handleUsePhoto}>
            Use Photo
          </Button>
        </div>
      )}

      {mode === 'complete' && (
        <Button type="button" variant="outline" fullWidth iconName="RotateCcw" iconPosition="left" onClick={handleRetakeAll}>
          Retake All Samples
        </Button>
      )}

      <CapturedGallery samples={samples} activeIndex={activeIndex} onSelect={handleSelectThumbnail} disabled={mode === 'frozen'} />

      {/* Bottom navigation */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
        <Button type="button" variant="outline" iconName="ArrowLeft" iconPosition="left" onClick={handleBack} className="sm:w-auto">
          Back
        </Button>
        <Button
          type="button"
          variant="default"
          fullWidth
          iconName="CheckCircle2"
          iconPosition="left"
          disabled={!allCaptured}
          onClick={handleCompleteRegistration}
        >
          Complete Registration
        </Button>
      </div>
    </div>
  );
};

export default FaceRegistration;