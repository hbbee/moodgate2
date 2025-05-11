// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom for navigation links
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

// You might need to import icons here, e.g., for a menu toggle
// import { MenuIcon, XIcon } from '@heroicons/react/outline'; // Example using Heroicons

// We'll need to get the user's name. For now, we'll use a placeholder.
// In a later step, we'll fetch the actual name (e.g., from local storage).
interface NavbarProps {
  userName?: string; // Optional prop to pass the user's name
}

// Add NavbarProps to the component signature
const Navbar: React.FC<NavbarProps> = ({ userName }) => {
  // State to manage if the navbar should have a background (e.g., when scrolled)
  const [isScrolled, setIsScrolled] = useState(false);
  // State to manage the mobile menu open/closed state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile responsiveness

  // Effect to add a scroll listener to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled down more than a certain threshold (e.g., 50px)
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Function to toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // Use Tailwind classes for styling
    // Fixed positioning, top-0, left-0, right-0 to make it sticky
    // Conditional background and shadow based on scroll state
    // Added padding-y for vertical space
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 py-4 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent' // Change background on scroll
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Left side: Logo or Site Title and User Name */}
        <div className="flex items-center space-x-4"> {/* Use flex to align items */}
          {/* Logo or Site Title - Changed to "MOODGATE" text */}
          <Link to="/" className={`text-xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-blue-600' : 'text-white' // Change text color on scroll
          }`}>
            MOODGATE {/* Changed logo text */}
          </Link>
          {/* Display User's Name if available */}
          {userName && (
            <span className={`text-lg font-semibold transition-colors duration-300 ${
              isScrolled ? 'text-gray-700' : 'text-white' // Change text color on scroll
            } hidden md:block`}> {/* Hide on small screens */}
              Hello, {userName}!
            </span>
          )}
        </div>

        {/* Right side: Navigation Links and Dropdown/Menu */}
        {/* Desktop Navigation (hidden on small screens) */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center"> {/* Increased spacing and centered items */}
            <li>
              <Link
                to="/" // Link to Home
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-white' // Change text color on scroll
                }`}
              >
                Home
              </Link>
            </li>
             <li>
              <Link
                to="/about" // Link to About
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-white' // Change text color on scroll
                }`}
              >
                About
              </Link>
            </li>
            {/* Added new navigation links - Removed incorrect comment syntax */}
            <li>
              <Link
                to="/todo" // Placeholder route - Removed comment syntax
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-white' // Change text color on scroll
                }`}
              >
                To-Do List
              </Link>
            </li>
             <li>
              <Link
                to="/productivity" // Placeholder route - Removed comment syntax
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-white' // Change text color on scroll
                }`}
              >
                Productivity
              </Link>
            </li>
             <li>
              <Link
                to="/psychiatrist" // Placeholder route - Removed comment syntax
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-white' // Change text color on scroll
                }`}
              >
                Contact a Psychiatrist
              </Link>
            </li>
            {/* Add more navigation links as needed */}
            {/* Placeholder for Dropdown Menu or User Avatar */}
            <li>
               {/* This could be a button that opens a dropdown */}
               <button className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                 isScrolled ? 'bg-gray-200 text-gray-700' : 'bg-white/10 text-white hover:bg-white/20'
               }`}>
                  Menu {/* Or User Icon */}
               </button>
               {/* You would add dropdown content here, conditionally rendered */}
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button (hidden on large screens) */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className={`p-2 rounded-md transition-colors duration-300 ${
             isScrolled ? 'text-blue-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
          }`}>
             {/* Replace with an actual icon component */}
             {isMobileMenuOpen ? 'Close' : 'Menu'} {/* Example text, use icons */}
             {/* <MenuIcon className="w-6 h-6" /> */}
          </button>
        </div>

      </div>

      {/* Mobile Menu Content (conditionally rendered) */}
      <AnimatePresence> {/* AnimatePresence is used here for mobile menu transitions */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
          >
            <ul className="flex flex-col items-center space-y-4 py-4">
              <li>
                <Link
                  to="/"
                  onClick={toggleMobileMenu} // Close menu on click
                  className={`text-lg hover:text-blue-400 transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  Home
                </Link>
              </li>
               <li>
                <Link
                  to="/about"
                   onClick={toggleMobileMenu} // Close menu on click
                  className={`text-lg hover:text-blue-400 transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  About
                </Link>
              </li>
               {/* Added new mobile navigation links - Removed incorrect comment syntax */}
              <li>
                <Link
                  to="/todo" // Placeholder route - Removed comment syntax
                  onClick={toggleMobileMenu} // Close menu on click
                  className={`text-lg hover:text-blue-400 transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  To-Do List
                </Link>
              </li>
               <li>
                <Link
                  to="/productivity" // Placeholder route - Removed comment syntax
                  onClick={toggleMobileMenu} // Close menu on click
                  className={`text-lg hover:text-blue-400 transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  Productivity
                </Link>
              </li>
               <li>
                <Link
                  to="/psychiatrist" // Placeholder route - Removed comment syntax
                  onClick={toggleMobileMenu} // Close menu on click
                  className={`text-lg hover:text-blue-400 transition-colors duration-300 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  Contact a Psychiatrist
                </Link>
              </li>
              {/* Add more mobile navigation links */}
              {/* Display User's Name on mobile if available */}
              {userName && (
                <li className={`text-lg font-semibold transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  Hello, {userName}!
                </li>
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
