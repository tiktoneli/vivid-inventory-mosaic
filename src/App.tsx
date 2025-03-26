
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import pages components
import ProductManagement from "./components/pages/ProductManagement";
import InventoryControl from "./components/pages/InventoryControl";
import CategoryManagement from "./components/pages/CategoryManagement";
import Dashboard from "./components/pages/Dashboard";

// Create a wrapper component to add layout to pages
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={
            <PageWrapper>
              <Dashboard />
            </PageWrapper>
          } />
          <Route path="/products" element={
            <PageWrapper>
              <ProductManagement />
            </PageWrapper>
          } />
          <Route path="/categories" element={
            <PageWrapper>
              <CategoryManagement />
            </PageWrapper>
          } />
          <Route path="/inventory" element={
            <PageWrapper>
              <InventoryControl />
            </PageWrapper>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
