import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, TrendingUp, Calendar, BarChart3, Download, School } from 'lucide-react';
import { mockStudents, mockTeachers, mockClassSessions, mockAttendanceRecords } from '@/lib/mockData';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    avgAttendance: 0,
    todayAttendance: 0
  });

  useEffect(() => {
    // Calculate statistics
    const totalStudents = mockStudents.length;
    const totalTeachers = mockTeachers.length;
    const totalClasses = mockClassSessions.length;
    const avgAttendance = Math.round(mockStudents.reduce((acc, student) => acc + student.attendancePercentage, 0) / totalStudents);
    const todayAttendance = mockAttendanceRecords.length;

    setStats({
      totalStudents,
      totalTeachers,
      totalClasses,
      avgAttendance,
      todayAttendance
    });
  }, []);

  const goHome = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  const exportReport = () => {
    const reportData = [
      ['Student Name', 'Roll Number', 'Semester', 'Attendance %', 'Status'],
      ...mockStudents.map(student => [
        student.name,
        student.rollNumber,
        student.semester.toString(),
        student.attendancePercentage.toString() + '%',
        student.attendancePercentage >= 75 ? 'Good' : 'Needs Improvement'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([reportData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `institution_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const currentTime = new Date();
  const currentTimeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Institution Management Portal</p>
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Active enrollments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTeachers}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Teaching staff
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
              <Progress value={stats.avgAttendance} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Institution-wide
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClasses}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Scheduled sessions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="faculty" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              Faculty
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Attendance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Overview</CardTitle>
                  <CardDescription>Student attendance distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Excellent (90%+)</span>
                      <Badge className="bg-green-500">
                        {mockStudents.filter(s => s.attendancePercentage >= 90).length} students
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Good (75-89%)</span>
                      <Badge className="bg-blue-500">
                        {mockStudents.filter(s => s.attendancePercentage >= 75 && s.attendancePercentage < 90).length} students
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Needs Improvement (&lt;75%)</span>
                      <Badge className="bg-red-500">
                        {mockStudents.filter(s => s.attendancePercentage < 75).length} students
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Activity</CardTitle>
                  <CardDescription>Real-time attendance tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockClassSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{session.subject}</div>
                        <div className="text-sm text-gray-600">
                          {session.startTime} - {session.endTime} • {session.room}
                        </div>
                        <div className="text-xs text-gray-500">Prof. {session.teacherName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {mockAttendanceRecords.filter(r => r.classSessionId === session.id).length}
                        </div>
                        <div className="text-xs text-gray-600">Present</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Records</CardTitle>
                    <CardDescription>Complete list of enrolled students and their attendance</CardDescription>
                  </div>
                  <Button onClick={exportReport} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-semibold">{student.name}</h3>
                            <p className="text-sm text-gray-600">{student.rollNumber} • Semester {student.semester}</p>
                            <p className="text-xs text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold">{student.attendancePercentage}%</div>
                          <Progress value={student.attendancePercentage} className="w-20" />
                        </div>
                        <Badge variant={student.attendancePercentage >= 75 ? 'default' : 'destructive'}>
                          {student.attendancePercentage >= 75 ? 'Good' : 'Low'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faculty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Faculty Members</CardTitle>
                <CardDescription>Teaching staff and their subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{teacher.name}</h3>
                        <p className="text-sm text-gray-600">{teacher.department}</p>
                        <p className="text-xs text-gray-500">{teacher.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{teacher.subjects.length} Subjects</div>
                        <div className="text-xs text-gray-500">
                          {teacher.subjects.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}