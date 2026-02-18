import React, { useState, useEffect } from 'react';
import RoleBasedNavigation from '../../components/navigation/RoleBasedNavigation';
import AttendanceValidator from '../../components/ui/AttendanceValidator';
import NotificationDisplay from '../../components/ui/NotificationDisplay';
import AttendanceCard from './components/AttendanceCard';
import AttendanceHistory from './components/AttendanceHistory';
import WifiStatusIndicator from './components/WifiStatusIndicator';
import SuccessConfirmation from './components/SuccessConfirmation';

const AttendanceMarking = () => {
  const [showValidator, setShowValidator] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wifiStatus, setWifiStatus] = useState(null);
  const [notification, setNotification] = useState({
    type: 'notice',
    title: 'Daily Attendance Reminder',
    message: 'Please mark your attendance before 11:59 PM today. Auto-absent marking will occur for unrecorded attendance.',
    timestamp: new Date()?.toISOString()
  });

  const [studentInfo] = useState({
    name: 'Rajesh Kumar Sharma',
    collegeId: 'CS2023001',
    block: 'A',
    room: '205',
    department: 'Computer Science',
    year: '3'
  });

  const [todayAttendance, setTodayAttendance] = useState({
    marked: false,
    timestamp: null
  });

  const [attendanceHistory] = useState([
    {
      id: 1,
      date: 'Thursday, January 30, 2026',
      status: 'present',
      timestamp: '09:15 AM',
      autoMarked: false
    },
    {
      id: 2,
      date: 'Wednesday, January 29, 2026',
      status: 'present',
      timestamp: '08:45 AM',
      autoMarked: false
    },
    {
      id: 3,
      date: 'Tuesday, January 28, 2026',
      status: 'absent',
      timestamp: null,
      autoMarked: true
    },
    {
      id: 4,
      date: 'Monday, January 27, 2026',
      status: 'present',
      timestamp: '09:30 AM',
      autoMarked: false
    },
    {
      id: 5,
      date: 'Sunday, January 26, 2026',
      status: 'present',
      timestamp: '10:00 AM',
      autoMarked: false
    },
    {
      id: 6,
      date: 'Saturday, January 25, 2026',
      status: 'present',
      timestamp: '09:00 AM',
      autoMarked: false
    },
    {
      id: 7,
      date: 'Friday, January 24, 2026',
      status: 'present',
      timestamp: '08:50 AM',
      autoMarked: false
    }
  ]);

  const handleMarkAttendance = () => {
    setShowValidator(true);
  };

  const handleValidationSuccess = (success) => {
    if (success) {
      setIsLoading(true);
      setTimeout(() => {
        const currentTime = new Date()?.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
        setTodayAttendance({
          marked: true,
          timestamp: currentTime
        });
        setIsLoading(false);
        setShowValidator(false);
        setShowSuccess(true);
      }, 1000);
    }
  };

  const handleWifiStatusChange = (status) => {
    setWifiStatus(status);
  };

  const handleDismissNotification = () => {
    setNotification(null);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <RoleBasedNavigation userRole="student" />
      {notification && (
        <NotificationDisplay 
          notification={notification}
          onDismiss={handleDismissNotification}
          autoHideDuration={10000}
        />
      )}
      <div className={`main-content ${notification ? 'with-notification' : ''}`}>
        <div className="content-container">
          <div className="max-w-5xl mx-auto space-y-6">
            <WifiStatusIndicator onStatusChange={handleWifiStatusChange} />

            <AttendanceCard
              studentInfo={studentInfo}
              todayAttendance={todayAttendance}
              onMarkAttendance={handleMarkAttendance}
              isLoading={isLoading}
            />

            <AttendanceHistory history={attendanceHistory} />
          </div>
        </div>
      </div>
      <AttendanceValidator
        isOpen={showValidator}
        onClose={() => setShowValidator(false)}
        onValidate={handleValidationSuccess}
        validationType="wifi"
      />
      {showSuccess && (
        <SuccessConfirmation
          timestamp={todayAttendance?.timestamp}
          onClose={handleCloseSuccess}
        />
      )}
    </>
  );
};

export default AttendanceMarking;