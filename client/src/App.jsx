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
import Welcome from './pages/public/Welcome';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';

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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Service Knock</p>
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
        <Routes>
          {/* Public */}
          <Route path="/" element={user ? <Navigate to={getDashboard(user.role)} replace /> : (isNative ? <Welcome /> : <Home />)} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/blog" element={<Blog />} />
          <Route
            path="/login"
            element={user ? <Navigate to={getDashboard(user.role)} replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to={getDashboard(user.role)} replace /> : <Register />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile/:id" element={<Profile />} />

          {/* Customer */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/book" element={<BookService />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>

          {/* Worker */}
          <Route element={<ProtectedRoute allowedRoles={['worker']} />}>
            <Route path="/job-requests" element={<JobRequests />} />
            <Route path="/active-jobs" element={<ActiveJobs />} />
            <Route path="/worker-profile" element={<WorkerProfile />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/workers" element={<AdminWorkers />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/verifications" element={<AdminVerifications />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
            <Toaster position="top-right" />
            <AppRoutes />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
