
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center h-20">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-careconnect-blue">
              Care<span className="text-careconnect-green">Connect</span>
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-700 hover:text-careconnect-blue font-medium">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-careconnect-blue font-medium">
            About Us
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-careconnect-blue font-medium">
            Services
          </Link>
          <Link to="/blog" className="text-gray-700 hover:text-careconnect-blue font-medium">
            Blog
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-careconnect-blue font-medium">
            Contact
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button asChild className="bg-careconnect-blue hover:bg-careconnect-blue/90">
            <Link to="/contact">Get Care Now</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-careconnect-blue font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-careconnect-blue font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-careconnect-blue font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-careconnect-blue font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-careconnect-blue font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Button asChild className="bg-careconnect-blue hover:bg-careconnect-blue/90 w-full">
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Get Care Now
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
