
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
            <Route index element={<Index />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="batches" element={<BatchManagement />} />
            <Route path="products" element={<Navigate to="/batches" replace />} />
            <Route path="batches/:batchId/items" element={<BatchItemsPage />} />
            <Route path="products/:productId/items" element={<Navigate to="/batches/:productId/items" replace />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="locations" element={<LocationManagement />} />
            <Route path="inventory" element={<InventoryControl />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
      <Toaster />
    </Router>
  );
}

export default App;
