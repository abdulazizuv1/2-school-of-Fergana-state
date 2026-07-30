import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/ScrollProgress';
import AppLoader from './components/AppLoader';
import PageSkeleton from './components/ui/PageSkeleton';
import { scrollToTop } from './lib/lenis';

// ─── Public pages (lazy) ─────────────────────────────────────────
const HomePage        = lazy(() => import('./pages/HomePage'));
const AboutPage       = lazy(() => import('./pages/AboutPage'));
const LeadershipPage  = lazy(() => import('./pages/LeadershipPage'));
const TeachersPage    = lazy(() => import('./pages/TeachersPage'));
const AchieversPage   = lazy(() => import('./pages/AchieversPage'));
const ClubsPage       = lazy(() => import('./pages/ClubsPage'));
const ClubDetailPage  = lazy(() => import('./pages/ClubDetailPage'));
const CurriculumPage  = lazy(() => import('./pages/CurriculumPage'));
const NewsPage        = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage  = lazy(() => import('./pages/NewsDetailPage'));
const ContactPage     = lazy(() => import('./pages/ContactPage'));
const GalleryPage     = lazy(() => import('./pages/GalleryPage'));
const DocumentsPage   = lazy(() => import('./pages/DocumentsPage'));
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage'));

// ─── Admin pages (lazy) ──────────────────────────────────────────
const AdminLogin      = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard  = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminNews       = lazy(() => import('./pages/admin/AdminNews'));
const AdminTeachers   = lazy(() => import('./pages/admin/AdminTeachers'));
const AdminLeadership = lazy(() => import('./pages/admin/AdminLeadership'));
const AdminAchievers  = lazy(() => import('./pages/admin/AdminAchievers'));
const AdminClubs      = lazy(() => import('./pages/admin/AdminClubs'));
const AdminCurriculum = lazy(() => import('./pages/admin/AdminCurriculum'));
const AdminGallery    = lazy(() => import('./pages/admin/AdminGallery'));
const AdminDocuments  = lazy(() => import('./pages/admin/AdminDocuments'));
const AdminAbout      = lazy(() => import('./pages/admin/AdminAbout'));

// Admin layout + route guard (not lazy — needed immediately)
import AdminRoute  from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Simple dark spinner for admin Suspense fallback
function AdminFallback() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--color-bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} color="white" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Public animated routes ───────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    scrollToTop(true);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<HomePage />} />
        <Route path="/about"      element={<AboutPage />} />
        <Route path="/leadership" element={<LeadershipPage />} />
        <Route path="/teachers"   element={<TeachersPage />} />
        <Route path="/achievers"  element={<AchieversPage />} />
        <Route path="/clubs"      element={<ClubsPage />} />
        <Route path="/clubs/:slug" element={<ClubDetailPage />} />
        <Route path="/education"  element={<CurriculumPage />} />
        <Route path="/news"       element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsDetailPage />} />
        <Route path="/contact"    element={<ContactPage />} />
        <Route path="/gallery"    element={<GalleryPage />} />
        <Route path="/documents"  element={<DocumentsPage />} />
        <Route path="*"           element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

// ─── Main app content (needs useLocation, must be inside BrowserRouter) ───
function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [appReady, setAppReady] = useState(false);

  // Admin subtree — no public Navbar/Footer/AppLoader/ScrollProgress
  if (isAdmin) {
    return (
      <Suspense fallback={<AdminFallback />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              {/* Без index-маршрута сам /admin рендерил пустой Outlet — белый экран */}
              <Route index            element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard"  element={<AdminDashboard />} />
              <Route path="news"       element={<AdminNews />} />
              <Route path="teachers"   element={<AdminTeachers />} />
              <Route path="leadership" element={<AdminLeadership />} />
              <Route path="achievers"  element={<AdminAchievers />} />
              <Route path="clubs"      element={<AdminClubs />} />
              <Route path="curriculum" element={<AdminCurriculum />} />
              <Route path="gallery"    element={<AdminGallery />} />
              <Route path="documents"  element={<AdminDocuments />} />
              <Route path="about"      element={<AdminAbout />} />
              {/* Любой неизвестный /admin/... тоже ведёт на дашборд, а не в пустоту */}
              <Route path="*"          element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    );
  }

  // Public site
  return (
    <>
      <AppLoader onComplete={() => setAppReady(true)} />

      {appReady && (
        <>
          <a
            href="#main-content"
            style={{
              position: 'absolute', top: 0, left: 0,
              padding: '0.5rem 1rem',
              background: 'var(--color-primary)', color: 'white',
              zIndex: 99999,
              transform: 'translateY(-100%)', transition: 'transform 200ms',
            }}
            onFocus={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            onBlur={(e) => { e.currentTarget.style.transform = 'translateY(-100%)'; }}
          >
            Skip to content
          </a>

          <Navbar />
          <ScrollProgress />

          <main id="main-content">
            <Suspense fallback={<PageSkeleton />}>
              <AnimatedRoutes />
            </Suspense>
          </main>

          <Footer />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}
