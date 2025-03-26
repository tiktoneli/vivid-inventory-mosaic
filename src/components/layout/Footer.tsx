
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto pt-12 pb-6 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 text-primary mb-4">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-medium text-sm">IM</span>
              </div>
              <span className="font-medium tracking-tight text-xl">Inventory</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              A comprehensive and integrated platform for businesses to efficiently control their inventory,
              reducing operational costs and providing real-time visibility.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium text-sm mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {['Dashboard', 'Products', 'Inventory', 'Reports'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-foreground smooth-transition text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium text-sm mb-4">Support</h3>
            <ul className="space-y-3">
              {['Help Center', 'Documentation', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-muted-foreground hover:text-foreground smooth-transition text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground text-xs">
              &copy; {currentYear} Inventory Management System. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link to="#" className="text-muted-foreground hover:text-foreground smooth-transition text-xs">
                Privacy
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground smooth-transition text-xs">
                Terms
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground smooth-transition text-xs">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
