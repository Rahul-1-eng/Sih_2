import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Clock, BookOpen, QrCode, Download } from 'lucide-react';
import { Teacher, ClassSession, getCurrentUser, getTodaysClasses, getClassAttendance, mockClassSessions } from '@/lib/mockData';
import QRCodeGenerator from '@/components/QRCodeGenerator';

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [todaysClasses, setTodaysClasses] = useState<ClassSession[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null);
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    const currentTeacher = getCurrentUser() as Teacher | null;
    if (currentTeacher) {
      setTeacher(currentTeacher);
      
      // Filter classes for this teacher
      const classes = getTodaysClasses().filter(cls => cls.teacherId === currentTeacher.id);
      setTodaysClasses(classes);
      
      if (classes.length > 0) {
        setSelectedClass(classes[0]);
      }
    }
  }, []);

  const handleAttendanceUpdate = (count: number) => {
    setAttendanceCount(count);
  };

  const goHome = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  const exportAttendance = () => {
    if (!selectedClass) return;
    
    const attendance = getClassAttendance(selectedClass.id);
    const csvContent = [
      ['Student Name', 'Roll Number', 'Status', 'Timestamp'],
      ...attendance.map(record => [
        record.studentName,
        record.rollNumber,
        record.status,
        new Date(record.timestamp).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedClass.subject}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <Button onClick={goHome}>Go Back to Home</Button>
        </div>
      </div>
    );
  }

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

  const getCurrentClass = () => {
    return todaysClasses.find(cls => {
      const [startHour, startMin] = cls.startTime.split(':').map(Number);
      const [endHour, endMin] = cls.endTime.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      const current = currentHour * 60 + currentMinute;
      return current >= startTime && current <= endTime;
    });
  };

  const currentClass = getCurrentClass();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={goHome} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600">Welcome, {teacher.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Current Time</div>
              <div className="font-mono font-bold">{currentTimeString}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysClasses.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {currentClass ? `Currently: ${currentClass.subject}` : 'No active class'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Attendance</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceCount}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Students present
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Department</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{teacher.department}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {teacher.subjects.length} subjects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="qr-generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="qr-generator" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Generator
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Live Attendance
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              My Classes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr-generator" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Class Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Class Session</CardTitle>
                  <CardDescription>Choose a class to generate QR code for attendance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todaysClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedClass?.id === cls.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedClass(cls)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{cls.subject}</h3>
                          <p className="text-sm text-gray-600">
                            {cls.startTime} - {cls.endTime} • {cls.room}
                          </p>
                        </div>
                        {currentClass?.id === cls.id && (
                          <Badge className="bg-green-500">Active Now</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {todaysClasses.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No classes scheduled for today
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* QR Code Generator */}
              {selectedClass && (
                <QRCodeGenerator
                  classSession={selectedClass}
                  onAttendanceUpdate={handleAttendanceUpdate}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Real-time Attendance</CardTitle>
                    <CardDescription>
                      {selectedClass ? `Live attendance for ${selectedClass.subject}` : 'Select a class to view attendance'}
                    </CardDescription>
                  </div>
                  {selectedClass && (
                    <Button onClick={exportAttendance} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedClass ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{selectedClass.subject}</h3>
                        <p className="text-sm text-gray-600">{selectedClass.room} • {selectedClass.startTime} - {selectedClass.endTime}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{attendanceCount}</div>
                        <div className="text-sm text-gray-600">Present</div>
                      </div>
                    </div>

                    {attendanceCount > 0 ? (
                      <div className="space-y-2">
                        <h4 className="font-medium">Students Present:</h4>
                        {Array.from({ length: attendanceCount }, (_, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <div className="font-medium">Student {i + 1}</div>
                              <div className="text-sm text-gray-600">CS2021{(i + 1).toString().padStart(3, '0')}</div>
                            </div>
                            <Badge variant="default">Present</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No students have marked attendance yet</p>
                        <p className="text-sm">Generate a QR code to start taking attendance</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <QrCode className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a class session to view attendance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Classes Today</CardTitle>
                <CardDescription>Your teaching schedule for {new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysClasses.map((cls) => (
                    <div key={cls.id} className={`p-4 border rounded-lg ${currentClass?.id === cls.id ? 'border-green-500 bg-green-50' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{cls.subject}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {cls.startTime} - {cls.endTime}
                            </span>
                            <span>Room: {cls.room}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {currentClass?.id === cls.id && (
                            <Badge className="bg-green-500">Currently Teaching</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {todaysClasses.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No classes scheduled for today</p>
                      <p className="text-sm">Enjoy your free day!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}