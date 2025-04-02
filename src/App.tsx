import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Index } from "./components/pages/Index";
import { Dashboard } from "./components/pages/Dashboard";
import { NotFound } from "./components/pages/NotFound";
import { CategoryManagement } from "./components/pages/CategoryManagement";
import { LocationManagement } from "./components/pages/LocationManagement";
import { InventoryControl } from "./components/pages/InventoryControl";
import { Toaster } from "@/components/ui/toaster"
import ProductManagement from "./components/pages/ProductManagement";
// Add the import for ProductItemsPage
import ProductItemsPage from "./components/pages/ProductItemsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:productId/items" element={<ProductItemsPage />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="locations" element={<LocationManagement />} />
          <Route path="inventory" element={<InventoryControl />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
