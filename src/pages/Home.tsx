import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import Background from '../components/Background'; // Keep this commented out/removed
import Chatbot from '../components/Chatbot';

const Home = () => {
  // Removed showChat state as the Chatbot is now shown based on navigation/route
  // const [showChat, setShowChat] = useState(false);

  const navigate = useNavigate(); // Get the navigate function

  // Define animation variants for the title for cleaner code
  const titleVariants = {
    // Initial state when the chat is closed
    initial: { fontSize: '4rem', y: 0 },
    // State when the chat is open - Adjusted y position and removed font size change
    // This keeps the title visible and in a fixed position relative to the top
    // Note: The title animation might need adjustment depending on whether you show chat on Home or a separate page after questionnaire
    chatOpen: { fontSize: '4rem', y: -200 }, // Adjusted y and kept font size
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

  // Removed the useEffect hook that was listening for the Spline event

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
          // Animate based on whether you are on the home page (not showing chat here anymore)
          // You might adjust this animation based on your new flow
          animate="initial" // Always initial state on Home page now
          // Use a spring transition for smoother movement between states
          transition={{ type: "spring", stiffness: 80, damping: 10 }} // Adjust stiffness/damping for feel
          // Apply text color and other styles. Text shadow is handled in style.css.
          className="text-white tracking-wider font-light text-center"
        >
          MOODGATE
        </motion.h1>

        {/* AnimatePresence allows exit animations for components being removed */}
        {/* Button to navigate to the questionnaire page */}
        <AnimatePresence>
          {/* Render the button */}
            <motion.button
              // Initial state when entering (starts slightly lower and faded)
              initial={{ opacity: 0, y: 20 }}
              // Animation when entering (fades in and moves up)
              animate={{ opacity: 1, y: 0 }}
              // Animation on hover (slight scale increase and subtle border glow)
              whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.5)' }}
              // Animation on tap (slight scale decrease)
              whileTap={{ scale: 0.95 }}
              // Click handler to navigate to the questionnaire page
              onClick={() => navigate('/questionnaire')} // Navigate to the new page
              // Styling classes for the button
              className="mt-12 px-8 py-4 text-xl bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all shadow-lg border border-transparent"
            >
              Take the Test {/* Button text */}
            </motion.button>
        </AnimatePresence>

        {/*
          Removed the Chatbot component from the Home page.
          It will be rendered on the Home page *after* the questionnaire is completed,
          or you could navigate to a separate chat page.
          For now, it navigates back to Home after questionnaire, where you could add logic
          to check if the questionnaire was completed and then show the chat.
          Alternatively, we can create a dedicated '/chat' route. Let's do that next for clarity.
        */}
        {/*
        <AnimatePresence>
          {showChat && <Chatbot />}
        </AnimatePresence>
        */}
      </div>
    </div>
  );
};

export default Home;
