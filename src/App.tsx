
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./components/pages/Index";
import Dashboard from "./components/pages/Dashboard";
import NotFound from "./components/pages/NotFound";
import CategoryManagement from "./components/pages/CategoryManagement";
import LocationManagement from "./components/pages/LocationManagement";
import InventoryControl from "./components/pages/InventoryControl";
import { Toaster } from "@/components/ui/toaster"
import BatchManagement from "./components/pages/BatchManagement";
import BatchItemsPage from "./components/pages/BatchItemsPage";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ErrorBoundary><Index /></ErrorBoundary>} />
            <Route path="dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
            <Route path="products" element={<Navigate to="/batches" replace />} />
            <Route path="batches/:batchId/items" element={<ErrorBoundary><BatchItemsPage /></ErrorBoundary>} />
            <Route path="products/:productId/items" element={<Navigate to="/batches/:productId/items" replace />} />
            <Route path="categories" element={<ErrorBoundary><CategoryManagement /></ErrorBoundary>} />
            <Route path="locations" element={<ErrorBoundary><LocationManagement /></ErrorBoundary>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
      <Toaster />
    </Router>
  );
}

export default App;
