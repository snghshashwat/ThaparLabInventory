import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import TransactionsPage from "./pages/TransactionsPage";
import WarningsPage from "./pages/WarningsPage";
import LogsPage from "./pages/LogsPage";
import InventoryPage from "./pages/InventoryPage";
import AddComponentPage from "./pages/AddComponentPage";
import StudentHoldingsPage from "./pages/StudentHoldingsPage";

function AppShell() {
  return (
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
  );
}

export default function App() {
  return (
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
  );
}
