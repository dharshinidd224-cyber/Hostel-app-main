import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';

/*
 * FaceValidation
 * --------------
 * Continuously checks the live camera feed and reports whether it's good
 * enough to capture a sample. Renders its own status checklist card so
 * FaceRegistration.jsx just has to read `canCapture` off the callback.
 *
 * Two real checks run everywhere:
 * - Lighting: average pixel brightness sampled from a downscaled canvas.
 *   No special API needed, works in every browser.
 *
 * Two checks depend on the browser's experimental Shape Detection API
 * (`window.FaceDetector`), which today is only available in Chromium
 * browsers (Chrome/Edge) and sometimes behind a flag:
 * - Face count (one / none / multiple) and rough centering, from the
 *   detected bounding box.
 * - "Eyes visible", approximated from whether the API returns eye
 *   landmarks for the detected face — this is a rough proxy, not a
 *   guaranteed eye-openness check. A dedicated model (e.g. face-api.js,
 *   MediaPipe, or the InsightFace pipeline once the Express/Python side
 *   exists) would replace this with something more reliable.
 *
 * Where FaceDetector isn't supported, those two checks fall back to a
 * clearly-labeled manual toggle so the rest of the enrollment flow (freeze
 * frame, retake, gallery, submit) can still be built and tested end-to-end.
 * This is stated openly in the UI rather than silently pretending to detect.
 */

const CHECK_LABELS = {
  oneFace: 'One Face',
  centered: 'Face Centered',
  goodLighting: 'Good Lighting',
  eyesVisible: 'Eyes Visible',
};

const BRIGHTNESS_DARK_THRESHOLD = 55; // 0-255 scale, tuned for typical laptop webcams
const CENTER_TOLERANCE = 0.18; // fraction of frame width/height a face center may drift
const MIN_FACE_WIDTH_RATIO = 0.22; // face bounding box must be at least this wide relative to frame

const getFaceDetectorSupport = () => typeof window !== 'undefined' && 'FaceDetector' in window;

const FaceValidation = ({ cameraRef, isActive, onStatusChange }) => {
  const detectorSupported = useRef(getFaceDetectorSupport());
  const detectorRef = useRef(null);
  const scratchCanvasRef = useRef(null);
  const timeoutRef = useRef(null);

  const [checks, setChecks] = useState({
    oneFace: false,
    centered: false,
    goodLighting: false,
    eyesVisible: false,
  });
  const [reason, setReason] = useState('Starting camera checks...');

  // Manual fallback state, only used/shown when FaceDetector isn't supported
  const [manualOverride, setManualOverride] = useState({
    oneFace: true,
    centered: true,
    eyesVisible: true,
  });

  useEffect(() => {
    if (detectorSupported?.current && !detectorRef?.current) {
      try {
        // eslint-disable-next-line no-undef
        detectorRef.current = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
      } catch (err) {
        detectorSupported.current = false;
      }
    }
  }, []);

  useEffect(() => {
    if (!isActive) return undefined;

    let cancelled = false;

    const measureBrightness = (video) => {
      const canvas = scratchCanvasRef?.current || document.createElement('canvas');
      scratchCanvasRef.current = canvas;
      const w = 48;
      const h = 36;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, w, h);

      const { data } = ctx.getImageData(0, 0, w, h);
      let total = 0;
      for (let i = 0; i < data.length; i += 4) {
        total += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      return total / (data.length / 4);
    };

    const runTick = async () => {
      if (cancelled) return;

      const video = cameraRef?.current?.getVideoElement?.();
      const isReady = cameraRef?.current?.isReady?.();

      if (video && isReady && video.readyState >= 2) {
        const brightness = measureBrightness(video);
        const goodLighting = brightness >= BRIGHTNESS_DARK_THRESHOLD;

        let nextChecks;
        let nextReason = 'Looks good — hold still.';

        if (detectorSupported?.current && detectorRef?.current) {
          try {
            const faces = await detectorRef.current.detect(video);
            const faceCount = faces?.length || 0;

            if (faceCount === 0) {
              nextChecks = { oneFace: false, centered: false, goodLighting, eyesVisible: false };
              nextReason = 'No face detected. Position yourself in the frame.';
            } else if (faceCount > 1) {
              nextChecks = { oneFace: false, centered: false, goodLighting, eyesVisible: false };
              nextReason = 'Multiple faces detected. Only one person should be in frame.';
            } else {
              const face = faces[0];
              const box = face?.boundingBox;
              const centerX = (box?.x + box?.width / 2) / video.videoWidth;
              const centerY = (box?.y + box?.height / 2) / video.videoHeight;
              const widthRatio = box?.width / video.videoWidth;

              const isCentered =
                Math.abs(centerX - 0.5) <= CENTER_TOLERANCE && Math.abs(centerY - 0.5) <= CENTER_TOLERANCE;
              const isCloseEnough = widthRatio >= MIN_FACE_WIDTH_RATIO;
              const centered = isCentered && isCloseEnough;

              // Rough proxy: count landmarks flagged as eyes. Not a real eye-openness check.
              const eyeLandmarks = (face?.landmarks || [])?.filter((lm) => lm?.type === 'eye');
              const eyesVisible = face?.landmarks ? eyeLandmarks?.length >= 1 : true;

              nextChecks = { oneFace: true, centered, goodLighting, eyesVisible };

              if (!goodLighting) nextReason = 'Too dark — move to a brighter area.';
              else if (!isCloseEnough) nextReason = 'Move Closer to the camera.';
              else if (!isCentered) nextReason = 'Center your face in the frame.';
              else if (!eyesVisible) nextReason = 'Make sure your eyes are visible.';
            }
          } catch (err) {
            // Detector call failed at runtime — treat like unsupported for this tick
            nextChecks = { oneFace: manualOverride?.oneFace, centered: manualOverride?.centered, goodLighting, eyesVisible: manualOverride?.eyesVisible };
            nextReason = goodLighting ? 'Manual check mode (detector unavailable).' : 'Too dark — move to a brighter area.';
          }
        } else {
          // No FaceDetector support in this browser — rely on the manual toggle below
          nextChecks = { oneFace: manualOverride?.oneFace, centered: manualOverride?.centered, goodLighting, eyesVisible: manualOverride?.eyesVisible };
          nextReason = goodLighting
            ? 'Automatic face detection isn\u2019t supported in this browser — using manual checks.'
            : 'Too dark — move to a brighter area.';
        }

        if (!cancelled) {
          setChecks(nextChecks);
          setReason(nextReason);
          const canCapture = Object.values(nextChecks).every(Boolean);
          onStatusChange?.({ checks: nextChecks, canCapture, reason: nextReason });
        }
      }

      timeoutRef.current = setTimeout(runTick, 500);
    };

    runTick();

    return () => {
      cancelled = true;
      clearTimeout(timeoutRef?.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, cameraRef, manualOverride]);

  return (
    <div className="bg-muted/50 rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-sm md:text-base font-semibold text-foreground">Live Face Check</h3>
        <span className="text-xs text-muted-foreground">{reason}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:gap-y-3">
        {Object.keys(CHECK_LABELS)?.map((key) => {
          const passed = !!checks?.[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <Icon
                name={passed ? 'CheckCircle2' : 'XCircle'}
                size={16}
                className={passed ? 'text-success' : 'text-error'}
              />
              <span className={`text-xs md:text-sm ${passed ? 'text-foreground' : 'text-muted-foreground'}`}>
                {CHECK_LABELS?.[key]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Manual fallback controls — only rendered when the browser has no FaceDetector support */}
      {!detectorSupported?.current && (
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Automatic face detection isn't available in this browser. Toggle these manually for now:
          </p>
          <div className="flex flex-wrap gap-2">
            {['oneFace', 'centered', 'eyesVisible']?.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setManualOverride((prev) => ({ ...prev, [key]: !prev?.[key] }))}
                className={`text-xs px-2.5 py-1 rounded-full border transition-smooth ${
                  manualOverride?.[key]
                    ? 'border-success text-success bg-success/10'
                    : 'border-error text-error bg-error/10'
                }`}
              >
                {CHECK_LABELS?.[key]}: {manualOverride?.[key] ? 'On' : 'Off'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceValidation;