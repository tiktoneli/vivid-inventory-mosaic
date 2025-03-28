import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Update the navigation links to include locations
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/categories', label: 'Categories' },
    { path: '/locations', label: 'Locations' },
    { path: '/inventory', label: 'Inventory' },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-[#445372]">Inventory System</Link>
        <div className="space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-700 hover:text-[#00859e] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
