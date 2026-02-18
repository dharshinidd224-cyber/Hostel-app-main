import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AttendanceValidator = ({ 
  isOpen, 
  onClose, 
  onValidate,
  validationType = 'wifi'
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [wifiStatus, setWifiStatus] = useState({
    connected: false,
    ssid: null
  });

  useEffect(() => {
    if (isOpen && validationType === 'wifi') {
      checkWifiConnection();
    }
  }, [isOpen, validationType]);

  const checkWifiConnection = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const isWifi = connection?.type === 'wifi';
      setWifiStatus({
        connected: isWifi,
        ssid: isWifi ? 'Hostel WiFi' : null
      });
    } else {
      setWifiStatus({
        connected: true,
        ssid: 'Hostel WiFi'
      });
    }
  };

  const handleValidation = async () => {
    setIsValidating(true);
    setValidationStatus(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (wifiStatus?.connected) {
        setValidationStatus({
          success: true,
          message: 'WiFi connection verified successfully',
          details: `Connected to ${wifiStatus?.ssid}`
        });
        
        setTimeout(() => {
          if (onValidate) onValidate(true);
          handleClose();
        }, 2000);
      } else {
        setValidationStatus({
          success: false,
          message: 'WiFi connection required',
          details: 'Please connect to hostel WiFi network to mark attendance'
        });
      }
    } catch (error) {
      setValidationStatus({
        success: false,
        message: 'Validation failed',
        details: 'Unable to verify connection. Please try again.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRetry = () => {
    setValidationStatus(null);
    checkWifiConnection();
  };

  const handleClose = () => {
    setValidationStatus(null);
    setIsValidating(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="validation-popup">
      <div className="validation-popup-content">
        <div className="validation-popup-header">
          <div className={`validation-popup-icon ${
            validationStatus?.success ? 'success' : 
            validationStatus?.success === false ? 'error': 'warning'
          }`}>
            <Icon 
              name={
                validationStatus?.success ? 'CheckCircle' : 
                validationStatus?.success === false ? 'XCircle': 'Wifi'
              } 
              size={24} 
            />
          </div>
          <div className="flex-1">
            <h3 className="validation-popup-title">
              {validationStatus ? validationStatus?.message : 'Attendance Validation'}
            </h3>
          </div>
        </div>

        <div className="validation-popup-message">
          {validationStatus ? (
            <div>
              <p className="mb-2">{validationStatus?.details}</p>
              {validationStatus?.success && (
                <div className="flex items-center gap-2 text-success text-sm">
                  <Icon name="CheckCircle" size={16} />
                  <span>You can now mark your attendance</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="mb-3">
                To mark your attendance, you must be connected to the hostel WiFi network.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Icon 
                  name={wifiStatus?.connected ? 'Wifi' : 'WifiOff'} 
                  size={16}
                  color={wifiStatus?.connected ? 'var(--color-success)' : 'var(--color-error)'}
                />
                <span className={wifiStatus?.connected ? 'text-success' : 'text-error'}>
                  {wifiStatus?.connected 
                    ? `Connected to ${wifiStatus?.ssid}` 
                    : 'Not connected to hostel WiFi'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="validation-popup-actions">
          {validationStatus?.success === false && (
            <Button
              variant="outline"
              onClick={handleRetry}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Retry
            </Button>
          )}
          {!validationStatus && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleValidation}
                loading={isValidating}
                disabled={!wifiStatus?.connected}
                iconName="CheckCircle"
                iconPosition="left"
              >
                Validate
              </Button>
            </>
          )}
          {validationStatus && !validationStatus?.success && (
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceValidator;