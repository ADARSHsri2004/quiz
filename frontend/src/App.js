import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';

import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import FacultyDashboard from './pages/FacultyDashboard/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard/StudentDashboard';
import CreateQuiz from './pages/CreateQuiz/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz/TakeQuiz';
import TakeQuizResult from './pages/TakeQuiz/TakeQuizResult';
import FacultyQuizAnalytics from './pages/FacultyDashboard/FacultyQuizAnalytics';
import EditQuiz from './pages/FacultyDashboard/EditQuiz';
import ViewQuiz from './pages/FacultyDashboard/ViewQuiz';
import Profile from './pages/Profile/Profile';
// import QuizList from './pages/QuizList/QuizList';
// import QuizAnalytics from './pages/QuizAnalytics/QuizAnalytics';
// import QuizResults from './pages/QuizResults/QuizResults';


function PrivateRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
}

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 min-h-screen flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(v => !v)} user={user} />
        <main className="flex-1 p-4 md:p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Faculty Dashboard and features */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <AppLayout>
                {/* Auto-redirect to correct dashboard by role */}
                <DashboardRedirect />
              </AppLayout>
            </PrivateRoute>
          } />
          <Route path="/faculty" element={
            <PrivateRoute role="faculty">
              <AppLayout>
                <FacultyDashboard />
              </AppLayout>
            </PrivateRoute>
          } />
          {/* Student-specific Dashboard */}
          <Route path="/student" element={
            <PrivateRoute role="student">
              <AppLayout>
                <StudentDashboard />
              </AppLayout>
            </PrivateRoute>
          } />
          {/* ---------- Faculty Features ---------- */}
          {/* <Route path="/faculty/quizzes" element={
            <PrivateRoute role="faculty">
              <AppLayout><QuizList /></AppLayout>
            </PrivateRoute>
          } /> */}

          <Route path="/faculty/quizzes/create" element={
            <PrivateRoute role="faculty">
              <AppLayout><CreateQuiz /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/faculty/quizzes/:id/edit" element={
            <PrivateRoute role="faculty">
              <AppLayout><EditQuiz /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/faculty/quizzes/:id/analytics" element={
            <PrivateRoute role="faculty">
              <AppLayout><FacultyQuizAnalytics /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/faculty/quizzes/:id" element={
            <PrivateRoute role="faculty">
              <AppLayout><ViewQuiz /></AppLayout>
            </PrivateRoute>
          } />

          {/* ---------- Student Features ---------- */}
          <Route path="/takequiz/:id" element={
            <PrivateRoute role="student">
              <AppLayout><TakeQuiz /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/takequiz/:id/result" element={
            <PrivateRoute role="student">
              <AppLayout><TakeQuizResult /></AppLayout>
            </PrivateRoute>
          } />

          {/* Profile route */}
          <Route path="/profile" element={
            <PrivateRoute>
              <AppLayout><Profile /></AppLayout>
            </PrivateRoute>
          } />

          {/* Add more routes for quiz creation, analytics, quiz taking, etc. */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function DashboardRedirect() {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'faculty') return <Navigate to="/faculty" />;
  if (user.role === 'student') return <Navigate to="/student" />;
  return null;
}
