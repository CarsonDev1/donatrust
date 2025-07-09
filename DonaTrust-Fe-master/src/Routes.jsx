import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import AdminLayout from './components/common/AdminLayout';

// Import page components
import HomePage from './pages/Home';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import CharityRegistrationPage from './pages/CharityRegistration';
import CampaignDetailPage from './pages/CampaignDetail';
import DaoRegistrationPage from './pages/DaoRegistration';
import CampaignListPage from './pages/CampaignList';
import ProfileEditPage from './pages/ProfileEdit';
import ProfileDashboardPage from './pages/ProfileDashboard';
import VerifyEmailPage from './pages/VerifyEmail';
import { default as NewsManagement } from './pages/Admin/NewsManagement';
import CharityPendingPage from './pages/CharityPending';
import { CampaignDetail } from './pages/CharityPending';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes without layout */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Pending Charity Campaigns */}
        <Route path="/charity-pending" element={<Layout><CharityPendingPage /></Layout>} requiredRole="admin" />
        <Route path="/charity-pending/:id" element={<Layout><CampaignDetail /></Layout>} requiredRole="admin" />

        {/* Routes with layout */}
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="campaigns" element={<CampaignListPage />} />
          <Route path="campaign/:id" element={<CampaignDetailPage />} />

          {/* Protected routes - require authentication */}
          <Route
            path="charity-registration"
            element={
              <ProtectedRoute>
                <CharityRegistrationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dao-registration"
            element={
              <ProtectedRoute>
                <DaoRegistrationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile/edit"
            element={
              <ProtectedRoute>
                <ProfileEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfileDashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/news" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout>
              <NewsManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
