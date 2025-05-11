import { useState, useEffect } from 'react'; // Import useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom'; // Import useLocation
import Chatbot from '../components/Chatbot';

const Home = () => {
  // State to control whether the chatbot is shown
  const [showChat, setShowChat] = useState(false);

  // Get location object to access navigation state
  const location = useLocation();

  // Define animation variants for the title for cleaner code
  const titleVariants = {
    // Initial state when the chat is closed
    initial: { fontSize: '4rem', y: 0 },
    // State when the chat is open
    chatOpen: { fontSize: '2rem', y: -280 },
    // Subtle idle animation when the chat is closed
    idle: {
      opacity: [1, 0.95, 1], // Subtle fade effect
      scale: [1, 1.005, 1], // Subtle scale effect
      transition: {
        duration: 6, // Slow animation duration
        repeat: Infinity, // Loop infinitely
        repeatType: "reverse", // Go back and forth
        ease: "easeInOut" // Smooth easing
      }
    }
  };

  // Effect to check if the user navigated from the questionnaire
  useEffect(() => {
    // Check if the navigation state has the 'fromQuestionnaire' flag
    if (location.state?.fromQuestionnaire) {
      setShowChat(true); // Automatically show the chat if coming from the questionnaire
      // Optional: Clear the state so refreshing the page doesn't reopen chat
      // window.history.replaceState({}, document.title); // Simple way to clear state
      // Or use navigate('/', { replace: true }); if you want to clear state and replace history entry
    }
  }, [location.state]); // Rerun this effect if the location state changes


  return (
    // Relative positioning for z-index to work correctly with the fixed background
    // min-h-screen ensures this container takes at least the full viewport height
    // Note: The main z-index layering is handled in App.tsx now
    <div className="relative min-h-screen">
      {/*
        Removed the <Background /> component here as it was creating a conflicting background
        inside the application content, covering the fixed Spline background.
      */}
      {/* <Background /> */}

      {/*
        This div contains the main visible content of the Home page.
        z-10 ensures it's above the background (which is z-index: 0).
        min-h-screen ensures it takes full height, flex/items/justify centers content vertically.
        px classes add horizontal padding.
      */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Animated main title */}
        <motion.h1
          // Use defined variants for animation states
          variants={titleVariants}
          // Set initial state
          initial="initial"
          // Animate based on showChat state. If chat is not open, chain initial and idle animations.
          animate={showChat ? "chatOpen" : ["initial", "idle"]}
          // Use a spring transition for smoother movement between states
          transition={{ type: "spring", stiffness: 80, damping: 10 }} // Adjust stiffness/damping for feel
          // Apply text color and other styles. Text shadow is handled in style.css.
          className="text-white tracking-wider font-light text-center"
        >
          MOODGATE
        </motion.h1>

        {/* AnimatePresence allows exit animations for components being removed */}
        {/* Button to toggle chatbox - only shown if chat is NOT shown */}
        <AnimatePresence>
          {/* Render the button only when chat is NOT shown */}
          {!showChat && (
            <motion.button
              // Initial state when entering (starts slightly lower and faded)
              initial={{ opacity: 0, y: 20 }}
              // Animation when entering (fades in and moves up)
              animate={{ opacity: 1, y: 0 }}
              // Animation when exiting (fades out and scales down)
              exit={{ opacity: 0, scale: 0.8 }}
              // Animation on hover (slight scale increase and subtle border glow)
              whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              // Click handler to navigate to the questionnaire page
              // This button now navigates to the questionnaire page
              onClick={() => navigate('/questionnaire')} // Use navigate to go to questionnaire page
              // Styling classes for the button
              className="mt-12 px-8 py-4 text-xl bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all shadow-lg border border-transparent"
            >
              Take the Test {/* Button text */}
            </motion.button>
          )}
        </AnimatePresence>


        {/* AnimatePresence allows exit animations for components being removed */}
        {/* Render the Chatbot component when showChat is true */}
        <AnimatePresence>
          {showChat && (
             <motion.div
               key="chatbot" // Unique key for AnimatePresence
               initial={{ opacity: 0, y: 50 }} // Start lower for entry animation
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -50 }} // Exit upwards
               transition={{ duration: 0.5 }}
               className="w-full max-w-2xl flex flex-col flex-grow mt-8" // Add margin top and flex properties
             >
                {/* Container for messages - allows scrolling */}
                <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar"> {/* Added flex-grow, overflow-y-auto, pr-2, custom-scrollbar */}
                   <Chatbot /> {/* Chatbot content will render here */}
                </div>
                {/* Input area is now managed by the Chatbot component itself */}
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
