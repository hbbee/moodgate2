import React, { useState } from 'react'; // Import useState
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Questionnaire from '../components/Questionnaire'; // Import the Questionnaire component
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence

const QuestionnairePage = () => {
  const navigate = useNavigate(); // Get the navigate function
  // State to track if the questionnaire is finished and the button should be shown
  const [showProceedButton, setShowProceedButton] = useState(false);
  // State to store answers if needed later (optional for this step)
  const [completedAnswers, setCompletedAnswers] = useState<{ [key: string]: string }>({});


  // Function called when the Questionnaire component finishes (triggered by onComplete prop)
  const handleQuestionnaireComplete = (answers: { [key: string]: string }) => {
    console.log("Questionnaire completed on QuestionnairePage:", answers);
    setCompletedAnswers(answers); // Store answers if needed
    setShowProceedButton(true); // Show the proceed button
  };

  // Function to handle clicking the proceed button
  const handleProceedToChat = () => {
    // Navigate back to the Home page, potentially passing state
    // We'll pass a state flag to indicate the user came from the completed questionnaire
    navigate('/', { state: { fromQuestionnaire: true, answers: completedAnswers } });
  };

  // Animation variants for the button
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    // Use the same container styling as other pages for consistency
    // relative z-10 min-h-screen ensures it's above the Spline background
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
      {/* Add a title for the page */}
      <motion.h1
         initial={{ opacity: 0, y: -50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="text-white text-4xl md:text-5xl font-light mb-8 tracking-wider text-center"
      >
         Tell Us About Yourself
      </motion.h1>

      {/* Use AnimatePresence to animate between the Questionnaire and the button */}
      <AnimatePresence mode="wait"> {/* Use mode="wait" for sequential animation */}
        {/* Render the Questionnaire component only if the button is NOT shown */}
        {!showProceedButton && (
          <motion.div
            key="questionnaire" // Key for AnimatePresence
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
             className="w-full max-w-2xl" // Ensure it takes appropriate width
          >
            {/* Render the Questionnaire component */}
            {/* Pass the completion handler to the Questionnaire component */}
            <Questionnaire onComplete={handleQuestionnaireComplete} />
          </motion.div>
        )}

        {/* Render the Proceed button only if showProceedButton is true */}
        {showProceedButton && (
          <motion.div
            key="proceed-button" // Key for AnimatePresence
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={buttonVariants}
            transition={{ duration: 0.5 }}
            className="mt-8" // Add margin top
          >
            <motion.button
              onClick={handleProceedToChat} // Call the navigation handler
              whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-xl bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all shadow-lg border border-transparent"
            >
              Proceed to Chat {/* Button text */}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionnairePage;
