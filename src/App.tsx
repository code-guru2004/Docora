/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
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

function AppContent() {
  const { activeRoute, documents, selectedDocId } = useApp();

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
