import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Clock, TrendingUp, QrCode, BookOpen } from 'lucide-react';
import { Student, ClassSession, getCurrentUser, getTodaysClasses } from '@/lib/mockData';
import AttendanceScanner from '@/components/AttendanceScanner';
import ProductivitySuggestions from '@/components/ProductivitySuggestions';

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [todaysClasses, setTodaysClasses] = useState<ClassSession[]>([]);
  const [attendanceMessage, setAttendanceMessage] = useState<string>('');

  useEffect(() => {
    const currentStudent = getCurrentUser() as Student | null;
    if (currentStudent) {
      setStudent(currentStudent);
    }
    
    const classes = getTodaysClasses();
    setTodaysClasses(classes);
  }, []);

  const handleAttendanceMarked = (success: boolean, message: string) => {
    setAttendanceMessage(message);
    setTimeout(() => setAttendanceMessage(''), 5000);
  };

  const goHome = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  if (!student) {
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

  const getNextClass = () => {
    const current = currentHour * 60 + currentMinute;
    return todaysClasses.find(cls => {
      const [startHour, startMin] = cls.startTime.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      return startTime > current;
    });
  };

  const currentClass = getCurrentClass();
  const nextClass = getNextClass();

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
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {student.name}!</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Current Time</div>
              <div className="font-mono font-bold">{currentTimeString}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Alert Messages */}
        {attendanceMessage && (
          <div className={`mb-6 p-4 rounded-lg ${attendanceMessage.includes('successfully') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            {attendanceMessage}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.attendancePercentage}%</div>
              <Progress value={student.attendancePercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {student.attendancePercentage >= 75 ? 'Good attendance!' : 'Needs improvement'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentClass ? 'In Class' : 'Free Period'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {currentClass ? `${currentClass.subject} - ${currentClass.room}` : 
                 nextClass ? `Next: ${nextClass.subject} at ${nextClass.startTime}` : 'No more classes today'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysClasses.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {todaysClasses.length > 0 ? 'Classes scheduled' : 'No classes today'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="productivity" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Productivity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <AttendanceScanner
                studentId={student.id}
                studentName={student.name}
                onAttendanceMarked={handleAttendanceMarked}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Today's Attendance Status</CardTitle>
                  <CardDescription>Your attendance for today's classes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todaysClasses.map((cls) => {
                    const attendanceKey = `attendance_${student.id}_${cls.id}`;
                    const hasAttended = localStorage.getItem(attendanceKey);
                    
                    return (
                      <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{cls.subject}</div>
                          <div className="text-sm text-gray-600">
                            {cls.startTime} - {cls.endTime} • {cls.room}
                          </div>
                        </div>
                        <Badge variant={hasAttended ? 'default' : 'secondary'}>
                          {hasAttended ? 'Present' : 'Not Marked'}
                        </Badge>
                      </div>
                    );
                  })}
                  
                  {todaysClasses.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No classes scheduled for today
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your class timetable for {new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysClasses.map((cls, index) => (
                    <div key={cls.id} className={`p-4 border rounded-lg ${currentClass?.id === cls.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{cls.subject}</h3>
                          <p className="text-gray-600">Prof. {cls.teacherName}</p>
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
                            <Badge className="bg-green-500">Currently Active</Badge>
                          )}
                          {nextClass?.id === cls.id && (
                            <Badge variant="outline">Next Class</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {todaysClasses.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No classes scheduled for today</p>
                      <p className="text-sm">Enjoy your free day!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="productivity" className="space-y-6">
            <ProductivitySuggestions
              studentInterests={student.interests}
              careerGoals={student.careerGoals}
              freeTimeSlots={!currentClass ? ['current'] : []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}