
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TimeProvider } from './context/TimeContext';
import Navbar from './components/common/Navbar';
import CommandBar from './components/common/CommandBar';
import GlobalUtilities from './components/common/GlobalUtilities';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import TasksPage from './pages/TasksPage';
import MarketingPage from './pages/MarketingPage';
import FinancialPage from './pages/FinancialPage';
import CalendarPage from './pages/CalendarPage';
import TechnicalHubPage from './pages/TechnicalHubPage';
import ProposalsManagementPage from './pages/ProposalsManagementPage';
import MediaHubPage from './pages/MediaHubPage';
import MaterialLibraryPage from './pages/MaterialLibraryPage';
import StudioInboxPage from './pages/StudioInboxPage';
import PublicHomePage from './pages/PublicHomePage';
import PublicStudioPage from './pages/PublicStudioPage';
import PublicServicesPage from './pages/PublicServicesPage';
import PublicContactPage from './pages/PublicContactPage';
import PublicProjectDetailsPage from './pages/PublicProjectDetailsPage';
import ClientPortalPage from './pages/ClientPortalPage';
import BrandIdentityPage from './pages/BrandIdentityPage';
import CalculatorPage from './pages/CalculatorPage';
import AntigravityPage from './pages/AntigravityPage';
import NeuralStudioPage from './pages/NeuralStudioPage';
import LegalReportPage from './pages/LegalReportPage';
import RescueNode from './components/common/RescueNode';
import { TimeTracker } from './components/ui/TimeTracker';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isPublic = location.pathname.startsWith('/public');
  const isPortal = location.pathname.startsWith('/portal');
  const isAntigravity = location.pathname === '/antigravity';
  const isNeural = location.pathname === '/neural';

  if (isPublic || isPortal) {
    return (
      <div className="min-h-screen bg-luxury-white dark:bg-luxury-black text-luxury-charcoal dark:text-luxury-white transition-colors duration-300">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-white dark:bg-luxury-black text-luxury-charcoal dark:text-luxury-white transition-colors duration-300 overflow-x-hidden">
      <Navbar />
      <CommandBar />
      <GlobalUtilities />
      <TimeTracker />

      <main className="w-full px-2 sm:px-4 md:px-6 lg:px-8 pt-4 md:pt-10 lg:pt-32 pb-32 max-w-[2400px] mx-auto">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TimeProvider>
          <AppLayout>
            <Routes>
              {/* ... existing routes ... */}
              <Route path="/antigravity" element={<AntigravityPage />} />
              <Route path="/neural" element={<RescueNode nodeName="Neural Studio"><NeuralStudioPage /></RescueNode>} />
              <Route path="/" element={<RescueNode nodeName="Dashboard"><DashboardPage /></RescueNode>} />
              <Route path="/projects" element={<RescueNode nodeName="Projetos"><ProjectsPage /></RescueNode>} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/:id" element={<ClientDetailsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/financial" element={<FinancialPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/technical" element={<TechnicalHubPage />} />
              <Route path="/legal" element={<LegalReportPage />} />
              <Route path="/proposals" element={<ProposalsManagementPage />} />
              <Route path="/media" element={<MediaHubPage />} />
              <Route path="/dna" element={<MaterialLibraryPage />} />
              <Route path="/inbox" element={<StudioInboxPage />} />
              <Route path="/calculator" element={<RescueNode nodeName="Simulador PavA­vel"><CalculatorPage /></RescueNode>} />
              <Route path="/marketing" element={<MarketingPage />} />
              <Route path="/brand" element={<BrandIdentityPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Routes>
          </AppLayout>
        </TimeProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;

