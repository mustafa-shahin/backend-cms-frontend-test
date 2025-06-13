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
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
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
import { ROUTES } from "./config/constants";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductVariantsPage from "./pages/ProductVariantsPage";
import "./index.css";

// Create a client with improved configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    },
    mutations: {
      retry: false,
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
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

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
                          <Route
                            path="products/list"
                            element={<ProductsPage />}
                          />
                          <Route
                            path="products/categories"
                            element={<CategoriesPage />}
                          />
                          <Route
                            path="products/variants"
                            element={<ProductVariantsPage />}
                          />
                          <Route
                            path="products"
                            element={<Navigate to="products/list" replace />}
                          />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Default redirect */}
                <Route
                  path={ROUTES.HOME}
                  element={<Navigate to={ROUTES.DASHBOARD} replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to={ROUTES.DASHBOARD} replace />}
                />
              </Routes>

              {/* Toast notifications with improved styling */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--toast-bg)",
                    color: "var(--toast-color)",
                    borderRadius: "8px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
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
                  loading: {
                    iconTheme: {
                      primary: "#3B82F6",
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
