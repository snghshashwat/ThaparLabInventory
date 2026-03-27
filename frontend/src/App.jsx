import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const WarningsPage = lazy(() => import("./pages/WarningsPage"));
const LogsPage = lazy(() => import("./pages/LogsPage"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));
const AddComponentPage = lazy(() => import("./pages/AddComponentPage"));
const StudentHoldingsPage = lazy(() => import("./pages/StudentHoldingsPage"));

function AppShell() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading page..." />}>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warnings"
            element={
              <ProtectedRoute>
                <WarningsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <LogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-holdings"
            element={
              <ProtectedRoute>
                <StudentHoldingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-component"
            element={
              <ProtectedRoute>
                <AddComponentPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Suspense>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading app..." />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute allowViewer>
              <AppShell />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
