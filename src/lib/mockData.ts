// Mock data for the Smart Attendance & Productivity App

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  semester: number;
  interests: string[];
  careerGoals: string[];
  attendancePercentage: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
}

export interface ClassSession {
  id: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  room: string;
  date: string;
  qrCode?: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classSessionId: string;
  timestamp: string;
  status: 'present' | 'absent' | 'late';
}

export interface ProductivitySuggestion {
  id: string;
  type: 'academic' | 'career' | 'skill';
  title: string;
  description: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
}

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 'S001',
    name: 'Alice Johnson',
    email: 'alice.johnson@college.edu',
    rollNumber: 'CS2021001',
    semester: 6,
    interests: ['Web Development', 'AI/ML', 'Data Science'],
    careerGoals: ['Software Engineer', 'Full Stack Developer'],
    attendancePercentage: 92
  },
  {
    id: 'S002',
    name: 'Bob Smith',
    email: 'bob.smith@college.edu',
    rollNumber: 'CS2021002',
    semester: 6,
    interests: ['Mobile Development', 'UI/UX', 'Game Development'],
    careerGoals: ['Mobile App Developer', 'Product Manager'],
    attendancePercentage: 87
  },
  {
    id: 'S003',
    name: 'Carol Davis',
    email: 'carol.davis@college.edu',
    rollNumber: 'CS2021003',
    semester: 6,
    interests: ['Cybersecurity', 'Network Administration', 'Ethical Hacking'],
    careerGoals: ['Security Analyst', 'DevOps Engineer'],
    attendancePercentage: 95
  }
];

// Mock Teachers
export const mockTeachers: Teacher[] = [
  {
    id: 'T001',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@college.edu',
    department: 'Computer Science',
    subjects: ['Data Structures', 'Algorithms', 'Database Systems']
  },
  {
    id: 'T002',
    name: 'Prof. Michael Brown',
    email: 'michael.brown@college.edu',
    department: 'Computer Science',
    subjects: ['Web Development', 'Software Engineering', 'Project Management']
  }
];

// Mock Class Sessions (Today's schedule)
export const mockClassSessions: ClassSession[] = [
  {
    id: 'CS001',
    subject: 'Data Structures',
    teacherId: 'T001',
    teacherName: 'Dr. Sarah Wilson',
    startTime: '09:00',
    endTime: '10:30',
    room: 'CS-101',
    date: new Date().toISOString().split('T')[0],
    isActive: true
  },
  {
    id: 'CS002',
    subject: 'Web Development',
    teacherId: 'T002',
    teacherName: 'Prof. Michael Brown',
    startTime: '11:00',
    endTime: '12:30',
    room: 'CS-102',
    date: new Date().toISOString().split('T')[0],
    isActive: false
  },
  {
    id: 'CS003',
    subject: 'Database Systems',
    teacherId: 'T001',
    teacherName: 'Dr. Sarah Wilson',
    startTime: '14:00',
    endTime: '15:30',
    room: 'CS-103',
    date: new Date().toISOString().split('T')[0],
    isActive: false
  }
];

// Mock Attendance Records
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'A001',
    studentId: 'S001',
    classSessionId: 'CS001',
    timestamp: new Date().toISOString(),
    status: 'present'
  },
  {
    id: 'A002',
    studentId: 'S002',
    classSessionId: 'CS001',
    timestamp: new Date().toISOString(),
    status: 'present'
  }
];

// Mock Productivity Suggestions
export const mockProductivitySuggestions: ProductivitySuggestion[] = [
  {
    id: 'P001',
    type: 'academic',
    title: 'Review Data Structures Notes',
    description: 'Go through today\'s lecture on binary trees and practice implementation',
    estimatedTime: '30 minutes',
    priority: 'high'
  },
  {
    id: 'P002',
    type: 'career',
    title: 'Update LinkedIn Profile',
    description: 'Add recent project experience and skills to your professional profile',
    estimatedTime: '20 minutes',
    priority: 'medium'
  },
  {
    id: 'P003',
    type: 'skill',
    title: 'Complete React Tutorial',
    description: 'Continue with the React hooks tutorial on your learning platform',
    estimatedTime: '45 minutes',
    priority: 'medium'
  },
  {
    id: 'P004',
    type: 'academic',
    title: 'Prepare for Database Quiz',
    description: 'Review SQL queries and normalization concepts for tomorrow\'s quiz',
    estimatedTime: '40 minutes',
    priority: 'high'
  }
];

// Helper functions
export const getCurrentUser = () => {
  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');
  
  if (userType === 'student') {
    return mockStudents.find(s => s.id === userId);
  } else if (userType === 'teacher') {
    return mockTeachers.find(t => t.id === userId);
  }
  return null;
};

export const getStudentAttendance = (studentId: string) => {
  return mockAttendanceRecords.filter(record => record.studentId === studentId);
};

export const getClassAttendance = (classSessionId: string) => {
  const attendanceRecords = mockAttendanceRecords.filter(record => record.classSessionId === classSessionId);
  return attendanceRecords.map(record => {
    const student = mockStudents.find(s => s.id === record.studentId);
    return {
      ...record,
      studentName: student?.name || 'Unknown',
      rollNumber: student?.rollNumber || 'Unknown'
    };
  });
};

export const getTodaysClasses = () => {
  const today = new Date().toISOString().split('T')[0];
  return mockClassSessions.filter(session => session.date === today);
};