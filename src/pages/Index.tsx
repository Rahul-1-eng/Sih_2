import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Shield, QrCode, TrendingUp, Calendar } from 'lucide-react';
import { mockStudents, mockTeachers } from '@/lib/mockData';

export default function Index() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelection = (role: string, userId?: string) => {
    localStorage.setItem('userType', role);
    if (userId) {
      localStorage.setItem('userId', userId);
    }
    
    // Navigate to appropriate dashboard
    if (role === 'student') {
      window.location.href = '/student';
    } else if (role === 'teacher') {
      window.location.href = '/teacher';
    } else if (role === 'admin') {
      window.location.href = '/admin';
    }
  };

  const features = [
    {
      icon: <QrCode className="h-8 w-8" />,
      title: "QR Code Attendance",
      description: "Quick and accurate attendance marking with unique QR codes for each class session"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Productivity Insights",
      description: "Smart suggestions for academic tasks and career-building activities during free time"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Daily Routine Generator",
      description: "Personalized day plans combining class schedules, goals, and productivity recommendations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Smart Attendance & Productivity
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionize college attendance management and boost student productivity with our intelligent platform
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary" className="px-4 py-2">QR Code Based</Badge>
            <Badge variant="secondary" className="px-4 py-2">Real-time Analytics</Badge>
            <Badge variant="secondary" className="px-4 py-2">Productivity Focused</Badge>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit text-blue-600">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Role Selection */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Role</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Student Role */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-700">Student</CardTitle>
                <CardDescription>
                  Mark attendance, get productivity suggestions, and manage your daily routine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="text-sm text-gray-600">Demo Students:</div>
                  {mockStudents.slice(0, 2).map(student => (
                    <Button
                      key={student.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleRoleSelection('student', student.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.rollNumber}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teacher Role */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-700">Teacher</CardTitle>
                <CardDescription>
                  Generate QR codes, track real-time attendance, and manage class sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="text-sm text-gray-600">Demo Teachers:</div>
                  {mockTeachers.map(teacher => (
                    <Button
                      key={teacher.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleRoleSelection('teacher', teacher.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-xs text-gray-500">{teacher.department}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admin Role */}
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-fit">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-purple-700">Administrator</CardTitle>
                <CardDescription>
                  View institution-wide analytics, generate reports, and manage system settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleRoleSelection('admin')}
                >
                  Access Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>Built for modern educational institutions • Secure • Reliable • User-friendly</p>
        </div>
      </div>
    </div>
  );
}