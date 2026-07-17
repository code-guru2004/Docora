/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ChevronUp } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { DocumentDetailView } from './views/DocumentDetailView';
import { UploadView } from './views/UploadView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { DashboardView } from './views/DashboardView';
import { ProfileView } from './views/ProfileView';

// Lazily load policy and support pages for optimized loading
const PrivacyView = React.lazy(() => import('./views/PrivacyView'));
const TermsView = React.lazy(() => import('./views/TermsView'));
const DmcaView = React.lazy(() => import('./views/DmcaView'));
const SupportView = React.lazy(() => import('./views/SupportView'));

function AppContent() {
  const { activeRoute, documents, selectedDocId } = useApp();
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Reset scroll-to-top button visibility when route changes
  useEffect(() => {
    setShowScrollTop(false);
  }, [activeRoute]);

  // Track page scroll to show/hide the back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrolled > 150) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    
    // Initial check on load
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Dynamically update document head title based on active view and document selection
  useEffect(() => {
    if (activeRoute === 'home') {
      document.title = 'DocShare - Read, Share, and Publish Knowledge Instantly';
    } else if (activeRoute === 'explore') {
      document.title = 'Explore Directory - DocShare Shared Library';
    } else if (activeRoute === 'document' && selectedDocId) {
      const doc = documents.find(d => d.id === selectedDocId);
      if (doc) {
        document.title = `${doc.title} - DocShare Online Viewer`;
      } else {
        document.title = 'DocShare Document Viewer';
      }
    } else {
      const formattedTitle = activeRoute.charAt(0).toUpperCase() + activeRoute.slice(1);
      document.title = `${formattedTitle} - DocShare Platform`;
    }
  }, [activeRoute, selectedDocId, documents]);

  const renderActiveView = () => {
    switch (activeRoute) {
      case 'home':
        return <HomeView />;
      case 'explore':
        return <ExploreView />;
      case 'document':
        return <DocumentDetailView />;
      case 'upload':
        return <UploadView />;
      case 'login':
        return <LoginView />;
      case 'register':
        return <RegisterView />;
      case 'dashboard':
        return <DashboardView />;
      case 'profile':
        return <ProfileView />;
      case 'privacy':
        return (
          <React.Suspense fallback={<div className="mx-auto w-full max-w-4xl px-4 py-24 space-y-8 animate-pulse"><div className="h-10 w-48 bg-gray-200 rounded-lg" /><div className="h-6 w-full bg-gray-100 rounded" /><div className="h-40 w-full bg-gray-50 rounded-2xl" /></div>}>
            <PrivacyView />
          </React.Suspense>
        );
      case 'terms':
        return (
          <React.Suspense fallback={<div className="mx-auto w-full max-w-4xl px-4 py-24 space-y-8 animate-pulse"><div className="h-10 w-48 bg-gray-200 rounded-lg" /><div className="h-6 w-full bg-gray-100 rounded" /><div className="h-40 w-full bg-gray-50 rounded-2xl" /></div>}>
            <TermsView />
          </React.Suspense>
        );
      case 'dmca':
        return (
          <React.Suspense fallback={<div className="mx-auto w-full max-w-4xl px-4 py-24 space-y-8 animate-pulse"><div className="h-10 w-48 bg-gray-200 rounded-lg" /><div className="h-6 w-full bg-gray-100 rounded" /><div className="h-40 w-full bg-gray-50 rounded-2xl" /></div>}>
            <DmcaView />
          </React.Suspense>
        );
      case 'support':
        return (
          <React.Suspense fallback={<div className="mx-auto w-full max-w-4xl px-4 py-24 space-y-8 animate-pulse"><div className="h-10 w-48 bg-gray-200 rounded-lg" /><div className="h-6 w-full bg-gray-100 rounded" /><div className="h-40 w-full bg-gray-50 rounded-2xl" /></div>}>
            <SupportView />
          </React.Suspense>
        );
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="flex-1 animate-fade-in-down">
        {renderActiveView()}
      </main>
      <Footer />
      <Toast />

      {/* Scroll to Top Button (Stays perfectly pinned to the viewport) */}
      {activeRoute === 'document' && showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-45 flex h-12 w-12 items-center justify-center rounded-full google-glass-btn google-ai-active-glow text-blue-600 hover:text-blue-700 hover:scale-110 active:scale-95 focus:outline-none transition-all duration-300 shadow-md cursor-pointer"
          title="Scroll to top"
          id="scroll-to-top-button"
        >
          <ChevronUp className="h-6 w-6" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
