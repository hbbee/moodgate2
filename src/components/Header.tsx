// src/components/Header.tsx
import React, { useState, useEffect } from 'react';

function Header() {
  // State to manage if the header should have a background (e.g., when scrolled)
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to add a scroll listener to change header style
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

  return (
    // Use Tailwind classes for styling
    // Fixed positioning, top-0, left-0, right-0 to make it sticky
    // Conditional background and shadow based on scroll state
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent' // Change background on scroll
    }`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo or Site Title - Using a simple text logo for now */}
        {/* You can replace this with an image logo */}
        <div className={`text-xl font-bold transition-colors duration-300 ${
          isScrolled ? 'text-blue-600' : 'text-white' // Change text color on scroll
        }`}>
          Your Logo
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-6"> {/* Increased spacing */}
            <li>
              {/* Navigation Link with subtle hover effect and text color change on scroll */}
              <a
                href="#features" // Link to the features section (if you have one on the Home page)
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-white' // Change text color on scroll
                }`}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#testimonials" // Link to the testimonials section (if you have one)
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isScrolled ? 'text-gray-700' : 'text-white' // Change text color on scroll
                }`}
              >
                Testimonials
              </a>
            </li>
            <li>
              {/* Call to Action Button in the Header */}
              {/* This button might navigate to the questionnaire or a sign-up page */}
              <a
                href="#cta" // Link to a relevant section or page
                className={`bg-white text-blue-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300 shadow-md`}
              >
                Get Started
              </a>
            </li>
            {/* Add more navigation links as needed */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
