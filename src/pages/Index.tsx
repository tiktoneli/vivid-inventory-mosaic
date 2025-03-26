
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Dashboard from '@/components/pages/Dashboard';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
