
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Layout from '@/components/layout/Layout';
import Index from '@/components/pages/Index';
import Dashboard from '@/components/pages/Dashboard';
import ProductManagement from '@/components/pages/ProductManagement';
import CategoryManagement from '@/components/pages/CategoryManagement';
import NotFound from '@/components/pages/NotFound';
import InventoryControl from '@/components/pages/InventoryControl';
import LocationManagement from '@/components/pages/LocationManagement';

// Update the routes to include location management
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/products',
        element: <ProductManagement />
      },
      {
        path: '/categories',
        element: <CategoryManagement />
      },
      {
        path: '/locations',
        element: <LocationManagement />
      },
      {
        path: '/inventory',
        element: <InventoryControl />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
