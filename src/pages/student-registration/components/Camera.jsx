import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Camera
 * ------
 * Owns the webcam stream (getUserMedia) and the live <video> element.
 * Also knows how to freeze the current frame into a still image on request
 * (via the imperative `captureFrame()` handle) — the stream itself is never
 * stopped for a freeze, only the display switches to a still <img> so the
 * feed is instantly ready again after Retake.
 *
 * Exposed to the parent via ref (see useImperativeHandle below):
 * - captureFrame(): returns a JPEG data URL of the current video frame
 * - getVideoElement(): returns the raw <video> DOM node, used by
 *   FaceValidation.jsx to run live face/lighting checks against the same feed
 *
 * Props:
 * - frozenImage: data URL to display instead of the live feed (set by the
 *   parent right after a successful capture, cleared on Retake/Use Photo)
 * - canCapture: drives the frame's accent color (green when validation passes)
 * - isCapturing: brief shutter-flash flag
 * - active: when false, the webcam stream is stopped and released entirely
 *   (camera indicator light turns off) — used once all samples are captured
 *   and no further capture is expected. Set back to true to re-acquire it.
 */
const Camera = forwardRef(({ frozenImage = null, canCapture = false, isCapturing = false, active = true }, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // hidden canvas used only for capturing stills, never rendered

  // 'idle' | 'requesting' | 'ready' | 'denied' | 'unavailable' | 'stopped'
  const [cameraState, setCameraState] = useState('idle');

  useEffect(() => {
    let isMounted = true;
    let activeStream = null;

    const startCamera = async () => {
      if (!navigator?.mediaDevices?.getUserMedia) {
        if (isMounted) setCameraState('unavailable');
        return;
      }

      setCameraState('requesting');

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });

        if (!isMounted) {
          stream.getTracks()?.forEach((track) => track.stop());
          return;
        }

        activeStream = stream;
        if (videoRef?.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraState('ready');
      } catch (err) {
        if (isMounted) setCameraState('denied');
      }
    };

    if (active) {
      startCamera();
    } else {
      // Not active (e.g. all samples reviewed) — don't request the camera at all
      setCameraState('stopped');
    }

    // Cleanup runs whenever `active` flips OR the component unmounts — either way,
    // any stream acquired by this effect run is released and the camera light goes off.
    return () => {
      isMounted = false;
      activeStream?.getTracks()?.forEach((track) => track.stop());
      if (videoRef?.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [active]);

  useImperativeHandle(ref, () => ({
    // Draws the current video frame to a hidden canvas and returns it as a JPEG data URL.
    // Mirrored horizontally to match what the user actually sees in the preview.
    captureFrame: () => {
      const video = videoRef?.current;
      if (!video || cameraState !== 'ready') return null;

      const canvas = canvasRef?.current || document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1); // mirror to match the on-screen preview
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      return canvas.toDataURL('image/jpeg', 0.92);
    },
    getVideoElement: () => videoRef?.current,
    isReady: () => cameraState === 'ready',
  }));

  const showLiveVideo = !frozenImage;

  return (
    <div className="w-full">
      <div
        className={`relative w-full aspect-video rounded-xl border-2 overflow-hidden flex items-center justify-center transition-smooth bg-muted ${
          frozenImage
            ? 'border-primary'
            : canCapture
            ? 'border-success'
            : 'border-border'
        }`}
      >
        {/* Live webcam feed, mirrored so it behaves like a selfie camera */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover transition-smooth ${
            showLiveVideo && cameraState === 'ready' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Frozen still shown after Capture Face, until Retake or Use Photo */}
        {frozenImage && (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            src={frozenImage}
            alt="Captured face sample preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Requesting permission */}
        {showLiveVideo && cameraState === 'requesting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 md:gap-3 text-muted-foreground select-none">
            <Icon name="Loader2" size={28} className="md:w-10 md:h-10 animate-spin" />
            <span className="text-sm md:text-base font-medium">Requesting camera access...</span>
          </div>
        )}

        {showLiveVideo && cameraState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 md:gap-3 text-muted-foreground select-none">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-background/70 flex items-center justify-center">
              <Icon name="Camera" size={28} className="md:w-10 md:h-10" />
            </div>
            <span className="text-sm md:text-base font-medium">Camera Preview</span>
          </div>
        )}

        {showLiveVideo && cameraState === 'denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 md:gap-3 text-error px-4 text-center select-none">
            <Icon name="VideoOff" size={28} className="md:w-10 md:h-10" />
            <span className="text-sm md:text-base font-medium">Camera access denied</span>
            <span className="text-xs md:text-sm text-muted-foreground">
              Allow camera access in your browser settings, then reload this page.
            </span>
          </div>
        )}

        {showLiveVideo && cameraState === 'unavailable' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 md:gap-3 text-muted-foreground px-4 text-center select-none">
            <Icon name="VideoOff" size={28} className="md:w-10 md:h-10" />
            <span className="text-sm md:text-base font-medium">Camera not available</span>
            <span className="text-xs md:text-sm">This browser or connection doesn't support webcam access.</span>
          </div>
        )}

        {showLiveVideo && cameraState === 'stopped' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 md:gap-3 text-muted-foreground select-none">
            <Icon name="VideoOff" size={28} className="md:w-10 md:h-10" />
            <span className="text-sm md:text-base font-medium">Camera paused</span>
          </div>
        )}

        {/* Frozen-frame label */}
        {frozenImage && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-elevation-md">
            <Icon name="ImageIcon" size={14} />
            <span className="text-xs font-medium text-foreground">Preview</span>
          </div>
        )}

        {/* Ready-to-capture badge, only shown on the live feed */}
        {showLiveVideo && cameraState === 'ready' && (
          <div
            className={`absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-elevation-md backdrop-blur-sm ${
              canCapture ? 'bg-success/90 text-success-foreground' : 'bg-background/90 text-foreground'
            }`}
          >
            <Icon name={canCapture ? 'CheckCircle2' : 'Loader2'} size={14} className={canCapture ? '' : 'animate-spin'} />
            <span className="text-xs font-medium">{canCapture ? 'Ready to Capture' : 'Checking...'}</span>
          </div>
        )}

        {isCapturing && <div className="absolute inset-0 bg-white/80 animate-pulse pointer-events-none" />}
      </div>

      {/* Hidden canvas used only as a scratchpad for captureFrame() */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
});

Camera.displayName = 'Camera';

export default Camera;