import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './routes/ProtectedRoute';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { PlacementLayout } from './layouts/PlacementLayout';

// Public & Auth Pages
import { Home } from './pages/public/Home';
import { StudentLogin } from './pages/auth/StudentLogin';
import { StudentSignup } from './pages/auth/StudentSignup';
import { PlacementLogin } from './pages/auth/PlacementLogin';
import { PlacementSignup } from './pages/auth/PlacementSignup';

// Student Pages
import { Dashboard as StudentDashboard } from './pages/student/Dashboard';
import { Profile as StudentProfile } from './pages/student/Profile';
import { Resume as StudentResume } from './pages/student/Resume';
import { GitHubIntelligence as StudentGitHub } from './pages/student/GitHubIntelligence';
import { LeetCodeIntelligence as StudentLeetCode } from './pages/student/LeetCodeIntelligence';
import { Evidence as StudentEvidence } from './pages/student/Evidence';
import { Skills as StudentSkills } from './pages/student/Skills';
import { Projects as StudentProjects } from './pages/student/Projects';
import { CodingActivity as StudentCodingActivity } from './pages/student/CodingActivity';
import { CareerPath as StudentCareerPath } from './pages/student/CareerPath';
import { Jobs as StudentJobs } from './pages/student/Jobs';
import { Courses as StudentCourses } from './pages/student/Courses';
import { Roadmap as StudentRoadmap } from './pages/student/Roadmap';
import { CareerGuide as StudentCareerGuide } from './pages/student/CareerGuide';
import { CareerAdvisor as StudentCareerAdvisor } from './pages/student/CareerAdvisor';
import { Interview as StudentInterview } from './pages/student/Interview';
import { Progress as StudentProgress } from './pages/student/Progress';
import { StudentSettings } from './pages/student/Settings';

// Placement Pages
import { PlacementDashboard } from './pages/placement/Dashboard';
import { Students as PlacementStudents } from './pages/placement/Students';
import { PendingApprovals as PlacementPending } from './pages/placement/PendingApprovals';
import { ClaimVsProof as PlacementClaimProof } from './pages/placement/ClaimVsProof';
import { PlacementSkills } from './pages/placement/Skills';
import { PlacementRoles } from './pages/placement/Roles';
import { PlacementGaps } from './pages/placement/Gaps';
import { PlacementInterventions } from './pages/placement/Interventions';
import { PlacementReports } from './pages/placement/Reports';
import { PlacementSettings } from './pages/placement/Settings';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/student/login"
            element={
              <PublicOnlyRoute>
                <StudentLogin />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/student/signup"
            element={
              <PublicOnlyRoute>
                <StudentSignup />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/placement/login"
            element={
              <PublicOnlyRoute>
                <PlacementLogin />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/placement/signup"
            element={
              <PublicOnlyRoute>
                <PlacementSignup />
              </PublicOnlyRoute>
            }
          />
        </Route>

        {/* Protected Student Portal Routes */}
        <Route
          element={
            <ProtectedRoute allowedRole="STUDENT" redirectUnauthTo="/student/login" />
          }
        >
          <Route element={<StudentLayout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/resume" element={<StudentResume />} />
            <Route path="/github" element={<StudentGitHub />} />
            <Route path="/leetcode" element={<StudentLeetCode />} />
            <Route path="/evidence" element={<StudentEvidence />} />
            <Route path="/skills" element={<StudentSkills />} />
            <Route path="/projects" element={<StudentProjects />} />
            <Route path="/coding-activity" element={<StudentCodingActivity />} />
            <Route path="/career-path" element={<StudentCareerPath />} />
            <Route path="/jobs" element={<StudentJobs />} />
            <Route path="/courses" element={<StudentCourses />} />
            <Route path="/roadmap" element={<StudentRoadmap />} />
            <Route path="/career-guide" element={<StudentCareerGuide />} />
            <Route path="/advisor" element={<StudentCareerAdvisor />} />
            <Route path="/interview" element={<StudentInterview />} />
            <Route path="/progress" element={<StudentProgress />} />
            <Route path="/settings" element={<StudentSettings />} />
          </Route>
        </Route>

        {/* Protected Placement Cell Portal Routes */}
        <Route
          element={
            <ProtectedRoute allowedRole="PLACEMENT_ADMIN" redirectUnauthTo="/placement/login" />
          }
        >
          <Route element={<PlacementLayout />}>
            <Route path="/placement" element={<PlacementDashboard />} />
            <Route path="/placement/students" element={<PlacementStudents />} />
            <Route path="/placement/pending" element={<PlacementPending />} />
            <Route path="/placement/claim-proof" element={<PlacementClaimProof />} />
            <Route path="/placement/skills" element={<PlacementSkills />} />
            <Route path="/placement/roles" element={<PlacementRoles />} />
            <Route path="/placement/gaps" element={<PlacementGaps />} />
            <Route path="/placement/interventions" element={<PlacementInterventions />} />
            <Route path="/placement/reports" element={<PlacementReports />} />
            <Route path="/placement/settings" element={<PlacementSettings />} />
          </Route>
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
