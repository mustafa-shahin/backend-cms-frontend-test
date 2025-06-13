import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./Context/ThemeContext";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Layout from "./components/ui/layout/Layout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import PagesPage from "./pages/PagesPage";
import CompanyPage from "./pages/CompanyPage";
import LocationsPage from "./pages/LocationsPage";
import FilesPage from "./pages/FilesPage";
import FoldersPage from "./pages/FoldersPage";
import FileManagerPage from "./pages/FileManagerPage";
import JobTriggersPage from "./pages/JobTriggersPage";
import JobHistoryPage from "./pages/JobHistoryPage";
import "./index.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route index element={<DashboardPage />} />
                          <Route path="users" element={<UsersPage />} />
                          <Route path="pages" element={<PagesPage />} />
                          <Route path="company" element={<CompanyPage />} />
                          <Route path="locations" element={<LocationsPage />} />

                          {/* File Management Routes */}
                          <Route path="files" element={<FileManagerPage />} />
                          <Route
                            path="files/manager"
                            element={<FileManagerPage />}
                          />
                          <Route
                            path="files/folders"
                            element={<FoldersPage />}
                          />
                          <Route
                            path="files/documents"
                            element={<FilesPage filterType="documents" />}
                          />
                          <Route
                            path="files/photos"
                            element={<FilesPage filterType="images" />}
                          />
                          <Route
                            path="files/videos"
                            element={<FilesPage filterType="videos" />}
                          />
                          <Route
                            path="files/audio"
                            element={<FilesPage filterType="audio" />}
                          />
                          <Route
                            path="files/archives"
                            element={<FilesPage filterType="archives" />}
                          />

                          {/* Job Management Routes */}
                          <Route
                            path="jobs/triggers"
                            element={<JobTriggersPage />}
                          />
                          <Route
                            path="jobs/history"
                            element={<JobHistoryPage />}
                          />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Default redirect */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>

              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--toast-bg)",
                    color: "var(--toast-color)",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#10B981",
                      secondary: "#FFFFFF",
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: "#EF4444",
                      secondary: "#FFFFFF",
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
