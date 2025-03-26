
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Bell, User } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary"
          >
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-medium text-sm">IM</span>
            </div>
            <span className="font-medium tracking-tight text-xl hidden md:block">Inventory</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-muted-foreground hover:text-foreground smooth-transition text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-muted-foreground hover:text-foreground smooth-transition rounded-full">
              <Search size={18} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground smooth-transition rounded-full">
              <Bell size={18} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground smooth-transition rounded-full">
              <User size={18} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground smooth-transition rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg shadow-md animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-muted-foreground hover:text-foreground smooth-transition px-2 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center space-x-4 pt-4 border-t border-border">
                <button className="p-2 text-muted-foreground hover:text-foreground smooth-transition rounded-full">
                  <Search size={18} />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground smooth-transition rounded-full">
                  <Bell size={18} />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground smooth-transition rounded-full">
                  <User size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
