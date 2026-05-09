import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Public pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import AboutUs from './pages/public/AboutUs';
import ContactUs from './pages/public/ContactUs';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsAndConditions from './pages/public/TermsAndConditions';
import FAQs from './pages/public/FAQs';
import Blog from './pages/public/Blog';

// Customer pages
import BookService from './pages/customer/BookService';
import MyBookings from './pages/customer/MyBookings';

// Worker pages
import JobRequests from './pages/worker/JobRequests';
import ActiveJobs from './pages/worker/ActiveJobs';
import WorkerProfile from './pages/worker/WorkerProfile';

// Common pages
import Profile from './pages/common/Profile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminWorkers from './pages/admin/AdminWorkers';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVerifications from './pages/admin/AdminVerifications';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VerificationPopup from './components/VerificationPopup';
import VerificationBanner from './components/VerificationBanner';

import { LanguageProvider } from './context/LanguageContext';
import { Capacitor } from '@capacitor/core';
import MobileNav from './components/MobileNav';
import { motion, AnimatePresence } from 'framer-motion';

const isNative = Capacitor.isNativePlatform();

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">
            {window.location.pathname === '/login' || window.location.pathname === '/register' ? 'Connecting...' : 'Verifying Session...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${isNative ? 'pb-20' : ''}`}>
      {!isNative && <Navbar />}
      <VerificationBanner />
      <VerificationPopup />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public */}
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutUs /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><ContactUs /></PageWrapper>} />
            <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
            <Route path="/terms" element={<PageWrapper><TermsAndConditions /></PageWrapper>} />
            <Route path="/faqs" element={<PageWrapper><FAQs /></PageWrapper>} />
            <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
            <Route
              path="/login"
              element={user ? <Navigate to={getDashboard(user.role)} replace /> : <PageWrapper><Login /></PageWrapper>}
            />
            <Route
              path="/register"
              element={user ? <Navigate to={getDashboard(user.role)} replace /> : <PageWrapper><Register /></PageWrapper>}
            />
            <Route path="/profile/:id" element={<PageWrapper><Profile /></PageWrapper>} />

            {/* Customer */}
            <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
              <Route path="/book" element={<PageWrapper><BookService /></PageWrapper>} />
              <Route path="/my-bookings" element={<PageWrapper><MyBookings /></PageWrapper>} />
            </Route>

            {/* Worker */}
            <Route element={<ProtectedRoute allowedRoles={['worker']} />}>
              <Route path="/job-requests" element={<PageWrapper><JobRequests /></PageWrapper>} />
              <Route path="/active-jobs" element={<PageWrapper><ActiveJobs /></PageWrapper>} />
              <Route path="/worker-profile" element={<PageWrapper><WorkerProfile /></PageWrapper>} />
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
              <Route path="/admin/bookings" element={<PageWrapper><AdminBookings /></PageWrapper>} />
              <Route path="/admin/workers" element={<PageWrapper><AdminWorkers /></PageWrapper>} />
              <Route path="/admin/users" element={<PageWrapper><AdminUsers /></PageWrapper>} />
              <Route path="/admin/verifications" element={<PageWrapper><AdminVerifications /></PageWrapper>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isNative && <Footer />}
      {isNative && <MobileNav />}
    </div>
  );
};

const getDashboard = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'worker') return '/job-requests';
  return '/my-bookings';
};

export default function App() {
  const Router = isNative ? HashRouter : BrowserRouter;

  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                },
              }}
            />
            <AppRoutes />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
