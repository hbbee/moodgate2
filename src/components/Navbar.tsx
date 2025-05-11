import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 z-50 p-4">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white/10 backdrop-blur-md shadow-lg">
            <Link
              to="/"
              className="block px-4 py-2 text-white hover:bg-white/20 rounded-t-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-white hover:bg-white/20 rounded-b-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;