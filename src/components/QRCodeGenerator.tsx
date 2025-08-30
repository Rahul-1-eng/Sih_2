import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, RefreshCw, Users } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  classSession: {
    id: string;
    subject: string;
    teacherName: string;
    startTime: string;
    endTime: string;
    room: string;
  };
  onAttendanceUpdate?: (studentCount: number) => void;
}

export default function QRCodeGenerator({ classSession, onAttendanceUpdate }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');

  const generateQRCode = async () => {
    const newSessionId = `${classSession.id}-${Date.now()}`;
    const qrData = {
      sessionId: newSessionId,
      classId: classSession.id,
      subject: classSession.subject,
      timestamp: new Date().toISOString(),
      room: classSession.room
    };

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      
      setQrCodeUrl(qrCodeDataUrl);
      setSessionId(newSessionId);
      setIsActive(true);
      setAttendeeCount(0);
      
      // Store active session in localStorage for scanning simulation
      localStorage.setItem('activeSession', JSON.stringify(qrData));
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    localStorage.removeItem('activeSession');
  };

  // Simulate students joining (for demo purposes)
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        const randomJoin = Math.random() < 0.3; // 30% chance every 3 seconds
        if (randomJoin && attendeeCount < 25) {
          const newCount = attendeeCount + 1;
          setAttendeeCount(newCount);
          onAttendanceUpdate?.(newCount);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isActive, attendeeCount, onAttendanceUpdate]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Generator
        </CardTitle>
        <CardDescription>
          Generate QR code for {classSession.subject}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600">
            <div><strong>Room:</strong> {classSession.room}</div>
            <div><strong>Time:</strong> {classSession.startTime} - {classSession.endTime}</div>
          </div>
          
          {isActive && (
            <Badge variant="default" className="bg-green-500">
              Session Active
            </Badge>
          )}
        </div>

        {qrCodeUrl && (
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
              <img 
                src={qrCodeUrl} 
                alt="QR Code for attendance" 
                className="mx-auto"
              />
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{attendeeCount} students attended</span>
            </div>
            
            <div className="text-xs text-gray-500">
              Session ID: {sessionId.slice(-8)}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {!isActive ? (
            <Button 
              onClick={generateQRCode} 
              className="w-full"
              size="lg"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          ) : (
            <div className="space-y-2">
              <Button 
                onClick={generateQRCode} 
                variant="outline" 
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Code
              </Button>
              <Button 
                onClick={stopSession} 
                variant="destructive" 
                className="w-full"
              >
                End Session
              </Button>
            </div>
          )}
        </div>

        {isActive && (
          <div className="text-xs text-center text-gray-500 bg-blue-50 p-3 rounded">
            Students can now scan this QR code to mark their attendance
          </div>
        )}
      </CardContent>
    </Card>
  );
}