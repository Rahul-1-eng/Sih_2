# Smart Attendance & Productivity App - MVP Development Plan

## Core Files to Create (Max 8 files)

1. **src/pages/Index.tsx** - Main landing/dashboard page with role selection
2. **src/pages/StudentDashboard.tsx** - Student dashboard with attendance, productivity suggestions, daily routine
3. **src/pages/TeacherDashboard.tsx** - Teacher dashboard with QR code generation and real-time attendance
4. **src/pages/AdminDashboard.tsx** - Admin dashboard with institution-wide analytics
5. **src/components/QRCodeGenerator.tsx** - Component for generating and displaying QR codes
6. **src/components/AttendanceScanner.tsx** - Component for scanning QR codes (simulated)
7. **src/components/ProductivitySuggestions.tsx** - Component for showing productivity recommendations
8. **src/lib/mockData.ts** - Mock data for students, classes, attendance records

## MVP Features Implementation Priority

### 1. QR Code Based Attendance (Core Feature)
- Teacher generates QR code for class session
- Students scan QR code to mark attendance
- Real-time attendance list display
- Mock QR code generation and scanning simulation

### 2. Student Dashboard
- Attendance percentage display
- Current day schedule
- Basic productivity suggestions based on free time

### 3. Teacher Dashboard  
- Generate QR codes for classes
- View real-time attendance for current session
- Basic attendance reports

### 4. Admin Dashboard
- Institution-wide attendance overview
- Basic analytics and reporting

### 5. Daily Routine Generator (Simplified)
- Show student's class timetable
- Highlight free periods
- Basic productivity suggestions for free time

## Technical Implementation
- Use React Router for navigation between dashboards
- Use shadcn/ui components for consistent UI
- Mock data instead of real backend for MVP
- QR code generation using qrcode library
- Local storage for session management
- Responsive design for mobile and desktop

## Simplified User Flow
1. Landing page with role selection (Student/Teacher/Admin)
2. Role-specific dashboard with core features
3. QR code generation/scanning workflow
4. Basic analytics and reporting views