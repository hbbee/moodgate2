import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import QuestionnairePage from './pages/QuestionnairePage';
import { motion, AnimatePresence } from 'framer-motion'; // <-- Import AnimatePresence here
// Assuming you are using the <spline-viewer> tag in index.html,
// you don't need to import the Spline component here.

function App() {
  // State to store the user's name, initialized from local storage
  const [userName, setUserName] = useState<string | null>(null);
  // State to track if onboarding is complete, initialized from local storage
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);

  // Effect to read the user's name and onboarding status from local storage on initial mount
  useEffect(() => {
    console.log("App.tsx initial mount useEffect");
    const storedName = localStorage.getItem('userName');
    const onboardingStatus = localStorage.getItem('onboardingComplete');

    if (storedName) {
      setUserName(storedName);
      console.log("App.tsx found userName in localStorage:", storedName);
    } else {
       console.log("App.tsx did not find userName in localStorage.");
    }

    if (onboardingStatus === 'true') {
      setOnboardingComplete(true);
      console.log("App.tsx found onboardingComplete flag in localStorage.");
    } else {
       console.log("App.tsx did not find onboardingComplete flag in localStorage.");
    }

    // Listen for changes in local storage (e.g., when onboarding completes on QuestionnairePage)
    // This is a fallback/sync mechanism, direct state updates via setters are also used.
    const handleStorageChange = (event: StorageEvent) => {
      console.log("App.tsx storage event detected:", event.key);
      if (event.key === 'userName' && event.newValue !== null) {
        setUserName(event.newValue);
        console.log("App.tsx updated userName from storage event:", event.newValue);
      }
      if (event.key === 'onboardingComplete' && event.newValue === 'true') {
        setOnboardingComplete(true);
        console.log("App.tsx updated onboardingComplete from storage event.");
      }
       if (event.key === 'onboardingComplete' && event.newValue === null) {
        setOnboardingComplete(false);
        console.log("App.tsx onboardingComplete flag removed from storage.");
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, []); // Empty dependency array means this effect runs once on mount


  return (
    <Router>
      {/*
        The Spline Web Viewer is now handled directly in index.html using the <spline-viewer> tag.
        Ensure its z-index is lower than the #root div (z-index: 0 in index.html vs z-index: 1 on #root).
      */}

      {/*
        This div wraps your main application content (Navbar and pages).
        It needs a higher z-index than the Spline background to be visible.
        min-h-screen ensures this container takes at least the full viewport height.
        relative and z-10 are crucial for layering above the Spline background.
      */}
      <div className="relative z-10 min-h-screen">
        {/*
          Render the Navbar component.
          Use motion.header to animate it.
          It will start hidden and fade in if onboardingComplete is true.
          Pass the userName as a prop.
          Conditionally render the motion.header based on onboardingComplete.
        */}
        <AnimatePresence> {/* Use AnimatePresence for exit animation if onboarding status changes */}
            {onboardingComplete && ( // Only render the Navbar header if onboarding is complete
                <motion.header
                   key="navbar-header" // Key for AnimatePresence
                   initial={{ opacity: 0 }} // Start completely transparent
                   animate={{ opacity: 1 }} // Fade in to full opacity
                   exit={{ opacity: 0 }} // Fade out when onboardingComplete becomes false
                   transition={{ duration: 0.5, delay: 0.5 }} // Fade in over 0.5s with a slight delay
                   className={`fixed top-0 left-0 right-0 z-50 py-4 bg-white/10 backdrop-blur-md transition-all duration-300`} // Keep Navbar styling
                >
                    {/* Render the actual Navbar content inside the motion.header */}
                    {/* Pass the userName prop down to the Navbar component */}
                    <Navbar userName={userName || undefined} /> {/* Pass userName, or undefined if null */}
                </motion.header>
            )}
        </AnimatePresence>


        {/*
          This div wraps your page content (Routes).
          Add padding-top to push content down below the fixed Navbar *only if* the Navbar is visible.
          This prevents content from being hidden behind the Navbar.
          Adjust pt-16 based on your Navbar's actual height (py-4 is 1rem or 16px top/bottom, so total height is more).
          Let's use pt-20 (5rem or 80px) or pt-24 (6rem or 96px) to be safe.
        */}
        {/* Apply padding only if onboarding is complete and Navbar is visible */}
        {/* Added transition for smoother padding change */}
        <div className={`transition-all duration-300 ${onboardingComplete ? "pt-20" : ""}`}> {/* Apply padding only if Navbar is shown */}
            <Routes>
              {/* Define your routes */}
              {/* Pass onboardingComplete status to Home */}
              <Route path="/" element={<Home onboardingComplete={onboardingComplete} />} />
              <Route path="/about" element={<About />} />
              {/* Pass setters to QuestionnairePage to update App state and localStorage */}
              <Route path="/questionnaire" element={<QuestionnairePage setOnboardingComplete={setOnboardingComplete} setUserName={setUserName} />} />
              {/* Add routes for To-Do, Productivity, Psychiatrist here */}
              {/* Example: <Route path="/todo" element={<TodoPage />} /> */}
              {/* Example: <Route path="/productivity" element={<ProductivityPage />} /> */}
              {/* Example: <Route path="/psychiatrist" element={<PsychiatristPage />} /> */}
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
