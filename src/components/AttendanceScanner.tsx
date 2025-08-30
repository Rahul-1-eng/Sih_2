import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scan, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AttendanceScannerProps {
  studentId: string;
  studentName: string;
  onAttendanceMarked?: (success: boolean, message: string) => void;
}

export default function AttendanceScanner({ studentId, studentName, onAttendanceMarked }: AttendanceScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    subject?: string;
    room?: string;
  } | null>(null);

  const simulateQRScan = () => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate scanning delay
    setTimeout(() => {
      const activeSession = localStorage.getItem('activeSession');
      
      if (!activeSession) {
        const result = {
          success: false,
          message: 'No active class session found. Please ask your teacher to generate a QR code.'
        };
        setScanResult(result);
        onAttendanceMarked?.(false, result.message);
        setIsScanning(false);
        return;
      }

      try {
        const sessionData = JSON.parse(activeSession);
        const currentTime = new Date();
        const sessionTime = new Date(sessionData.timestamp);
        const timeDiff = (currentTime.getTime() - sessionTime.getTime()) / (1000 * 60); // minutes

        if (timeDiff > 30) {
          const result = {
            success: false,
            message: 'QR code has expired. Please ask your teacher for a new one.'
          };
          setScanResult(result);
          onAttendanceMarked?.(false, result.message);
        } else {
          // Check if already marked attendance
          const attendanceKey = `attendance_${studentId}_${sessionData.sessionId}`;
          const alreadyMarked = localStorage.getItem(attendanceKey);

          if (alreadyMarked) {
            const result = {
              success: false,
              message: 'You have already marked attendance for this session.'
            };
            setScanResult(result);
            onAttendanceMarked?.(false, result.message);
          } else {
            // Mark attendance
            localStorage.setItem(attendanceKey, JSON.stringify({
              studentId,
              studentName,
              timestamp: new Date().toISOString(),
              sessionId: sessionData.sessionId
            }));

            const result = {
              success: true,
              message: 'Attendance marked successfully!',
              subject: sessionData.subject,
              room: sessionData.room
            };
            setScanResult(result);
            onAttendanceMarked?.(true, result.message);
          }
        }
      } catch (error) {
        const result = {
          success: false,
          message: 'Invalid QR code. Please try again.'
        };
        setScanResult(result);
        onAttendanceMarked?.(false, result.message);
      }

      setIsScanning(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Scan className="h-5 w-5" />
          Scan QR Code
        </CardTitle>
        <CardDescription>
          Scan the QR code displayed by your teacher to mark attendance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-4">
            Student: <strong>{studentName}</strong>
          </div>
          
          {isScanning && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <Badge variant="outline" className="animate-pulse">
                Scanning QR Code...
              </Badge>
            </div>
          )}

          {scanResult && !isScanning && (
            <Alert className={`mb-4 ${scanResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <div className="flex items-center gap-2">
                {scanResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={scanResult.success ? 'text-green-800' : 'text-red-800'}>
                  {scanResult.message}
                </AlertDescription>
              </div>
              {scanResult.success && scanResult.subject && (
                <div className="mt-2 text-sm text-green-700">
                  <div><strong>Subject:</strong> {scanResult.subject}</div>
                  <div><strong>Room:</strong> {scanResult.room}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>Marked at {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              )}
            </Alert>
          )}
        </div>

        <Button 
          onClick={simulateQRScan} 
          disabled={isScanning}
          className="w-full"
          size="lg"
        >
          {isScanning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Scanning...
            </>
          ) : (
            <>
              <Scan className="h-4 w-4 mr-2" />
              Scan QR Code
            </>
          )}
        </Button>

        <div className="text-xs text-center text-gray-500 bg-blue-50 p-3 rounded">
          <strong>Demo Mode:</strong> This simulates QR code scanning. In a real app, this would access the device camera.
        </div>
      </CardContent>
    </Card>
  );
}