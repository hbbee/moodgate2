import { useState, useEffect } from 'react'; // <-- Import useEffect here
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

// Define props interface to receive onboardingComplete from App.tsx
interface HomeProps {
    onboardingComplete: boolean;
}

// Add props to the component signature
const Home: React.FC<HomeProps> = ({ onboardingComplete }) => {
  // State to control whether the chatbot is shown (this state is local to Home)
  // It will be initially true if onboarding is complete, false otherwise.
  // We initialize it based on the prop.
  const [showChat, setShowChat] = useState(onboardingComplete);


  // Get navigate function
  const navigate = useNavigate();

  // Define animation variants for the title for cleaner code
  const titleVariants = {
    // Initial state when the chat is closed
    initial: { fontSize: '4rem', y: 0 },
    // State when the chat is open - Adjusted y position to make space for chatbot
    chatOpen: { fontSize: '2rem', y: -280 }, // <-- Adjusted y position higher

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

  // Effect to check onboarding status from local storage on initial mount
  // This effect determines if the chat should be shown on direct load based on the flag
  useEffect(() => {
      console.log("Home initial mount useEffect.");
      const onboardingStatus = localStorage.getItem('onboardingComplete'); // <-- Get the onboarding flag

      if (onboardingStatus === 'true') { // <-- Check for the flag
          console.log("Found onboardingComplete flag in local storage, showing chat.");
          // No need to set onboardingComplete state here, using prop from App.tsx
          setShowChat(true); // Show chat automatically if onboarding was previously completed
      } else {
          console.log("No onboardingComplete flag found in local storage. Showing button.");
          setShowChat(false); // Ensure chat is hidden
          // No need to set onboardingComplete state here
      }

      // Listen for local storage changes to react if onboarding completes on another page (like QuestionnairePage)
      const handleStorageChange = (event: StorageEvent) => {
         console.log("Home storage event detected:", event.key);
         if (event.key === 'onboardingComplete' && event.newValue === 'true') {
            // No need to set onboardingComplete state here, App.tsx handles it and passes prop
            setShowChat(true); // Show chat if onboarding completes
            console.log("Home updated onboardingComplete from storage event, showing chat.");
         } else if (event.key === 'onboardingComplete' && event.newValue === null) {
            // No need to set onboardingComplete state here
            setShowChat(false); // Hide chat if onboarding status is removed
             console.log("Home onboardingComplete flag removed from storage, hiding chat.");
         }
      };

      window.addEventListener('storage', handleStorageChange);

      return () => {
          window.removeEventListener('storage', handleStorageChange);
      };

  }, []); // Empty dependency array means this effect runs once on mount


  // Effect to update showChat state when the onboardingComplete prop changes
  useEffect(() => {
      console.log("Home onboardingComplete prop changed:", onboardingComplete);
      setShowChat(onboardingComplete);
  }, [onboardingComplete]); // Rerun this effect if the onboardingComplete prop changes


  return (
    // Relative positioning for z-index to work correctly with the fixed background
    // min-h-screen ensures this container takes at least the full viewport height
    // Note: The main z-index layering is handled in App.tsx now
    <div className="relative min-h-screen">
      {/* Background elements are handled in index.html/style.css */}

      {/*
        This div contains the main visible content of the Home page.
        z-10 ensures it's above the background.
        min-h-screen ensures it takes full height.
        Using flex column layout, items-center for horizontal centering.
        justify-center is removed to allow content to flow from top.
        px classes add horizontal padding.
      */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4">

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
          className="text-white tracking-wider font-light mt-20 text-center" // Added mt-20 for initial spacing
        >
          MOODGATE
        </motion.h1>

        {/* AnimatePresence allows exit animations for components being removed */}
        {/* Button to toggle chatbox - only shown if onboarding is not complete */}
        <AnimatePresence>
          {!onboardingComplete && ( // Only show button if onboarding is NOT complete (using prop)
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
              onClick={() => navigate('/questionnaire')} // Use navigate to go to questionnaire page
              // Styling classes for the button
              className="mt-40 px-8 py-4 text-xl bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all shadow-lg border border-transparent" // <-- Adjusted mt-40
            >
              Take the Test {/* Button text */}
            </motion.button>
          )}
        </AnimatePresence>


        {/* AnimatePresence allows exit animations for components being removed */}
        {/* Render the Chatbot component when showChat is true (i.e., onboardingComplete is true) */}
        <AnimatePresence>
          {showChat && ( // Show chat if showChat state is true (synced with onboardingComplete prop)
             <motion.div
               key="chatbot" // Unique key for AnimatePresence
               initial={{ opacity: 0, y: 50 }} // Start lower for entry animation
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -50 }} // Exit upwards
               transition={{ duration: 0.5 }}
               // Added flex-grow to make chatbot content area take available space
               // Adjusted mt to position it below the potentially moved title
               className="w-full max-w-2xl flex flex-col flex-grow mt-40" // <-- Adjusted mt higher again
             >
                {/* Container for messages - allows scrolling */}
                <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar"> {/* Added flex-grow, overflow-y-auto, pr-2, custom-scrollbar */}
                   <Chatbot /> {/* Chatbot content will render here */}
                </div>
                {/* Input area is now managed by the Chatbot component itself */}
                {/* No need for a separate input div here */}
             </motion.div>
          )}
        </AnimatePresence>

        {/* Placeholder for Navigation Boxes (To-Do, Productivity, etc.) */}
        {/* We'll add this component here in a later step */}
        {/* {showChat && <DashboardNav />} */}

        {/* Placeholder for Social Media Links (Footer) */}
        {/* We'll add a Footer component in App.tsx */}

      </div>
    </div>
  );
};

export default Home;
