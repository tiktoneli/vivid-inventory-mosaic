
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update the navigation links to include locations
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/categories', label: 'Categories' },
    { path: '/locations', label: 'Locations' },
    { path: '/inventory', label: 'Inventory' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-brand-primary shadow" aria-label="Main navigation">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-lg font-semibold text-white" 
            aria-label="Homepage"
          >
            Inventory System
          </Link>
          
          {isMobile ? (
            <>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button 
                  onClick={toggleMenu} 
                  className="text-white p-2 focus-visible-outline rounded-md"
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
              
              {isMenuOpen && (
                <div 
                  id="mobile-menu" 
                  className="absolute top-[56px] left-0 right-0 bg-brand-primary z-40 py-4 shadow-lg"
                >
                  <div className="flex flex-col space-y-3 px-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="text-white hover:text-gray-200 transition-colors duration-200 py-2 px-3 rounded-md focus-visible-outline"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-white hover:text-gray-200 transition-colors duration-200 focus-visible-outline px-2 py-1 rounded"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
