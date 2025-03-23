import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/client-dashboard/Home";
import Register from "./pages/Authentication/Register";
import ChooseLogin from "./pages/Authentication/ChooseLogin";
import CompanyHome from "./pages/company-dashboard/CompanyHome";
import ClientInsights from "./pages/insights/ClientInsights";
import CompanyInsights from "./pages/insights/CompanyInsights";
import RegisteredCompaniesPage from "./pages/companies/RegisteredCompaniesPage";
import CompanyProfilePage from "./pages/companies/CompanyProfilePage";
import SettingsPageClient from "./pages/Settings/SettingsPageClient";
import SettingsPageCompany from "./pages/Settings/SettingsPageCompany";
import CompanyTenderDashboard from "./pages/CompanyTender/CompanyTenderDashboard.jsx";

import CompanyPortfolio from "./pages/company-dashboard/CompanyPortfolio";
import ContactsCompany from "./pages/Contacts/ContactsCompany";
import ContactsClient from "./pages/Contacts/ContactsClient";
import CompanyProfileEdit from "./pages/company-dashboard/CompanyProfileEdit";
import CreateTender from "./pages/ClientTender/CreateTender.jsx";
import ClientTender from "./pages/ClientTender/ClientTender.jsx";
import TenderHeatmap from "./pages/CompanyTender/TenderHeatmap.jsx";
import ActiveBids from "./pages/CompanyTender/ActiveBids.jsx";
import TenderAnalytics from "./pages/CompanyTender/TenderAnalytics.jsx";
import ClientLogin from "./pages/Authentication/ClientLogin";
import CompanyLogin from "./pages/Authentication/CompanyLogin";
import CompanyPortfolioEdit from "./pages/company-dashboard/CompanyPortfolioEdit";

const App = () => {
  return (
    <div>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<ChooseLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/company/login" element={<CompanyLogin />} />

          {/* Protected Client routes */}
          <Route
            path="/client/home"
            element={
              <ProtectedRoute allowedRole="CLIENT">
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/companies"
            element={
              <ProtectedRoute allowedRole="CLIENT">
                <RegisteredCompaniesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/insights"
            element={
              <ProtectedRoute allowedRole="CLIENT">
                <ClientInsights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/settings"
            element={
              <ProtectedRoute allowedRole="CLIENT">
                <SettingsPageClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/tender"
            element={
              <ProtectedRoute allowedRole="CLIENT">
                <ClientTender />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/companies/:id"
            element={
              <ProtectedRoute allowedRole="CLIENT">
                <CompanyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/tender/create"
            element={
              <ProtectedRoute allowedRole="CLIENT">
                <CreateTender />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/contacts"
            element={
              <ProtectedRoute allowedRole="CLIENT">
                <ContactsClient />
              </ProtectedRoute>
            }
          />

          {/* Protected Company routes */}
          <Route
            path="/company/home"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <CompanyHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/portfolio"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <CompanyPortfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/portfolio/:id"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <CompanyPortfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/portfolio/:id/edit"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <CompanyPortfolioEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/insights"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <CompanyInsights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/settings"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <SettingsPageCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/tender"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <CompanyTenderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/companies/:id"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <CompanyProfileEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/tender/heatmap"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <TenderHeatmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/tender/bids"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <ActiveBids />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/tender/analytics"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <TenderAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/contacts"
            element={
              <ProtectedRoute allowedRole="COMPANY">
                <ContactsCompany />
              </ProtectedRoute>
            }
          />
          {/* Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
