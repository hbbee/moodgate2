import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Questionnaire from '../components/Questionnaire';
import { motion, AnimatePresence } from 'framer-motion';
// Removed the incorrect import for Navbar from here.
// Navbar is handled and rendered in App.tsx now.

// Define props interface to receive setters from App.tsx
interface QuestionnairePageProps {
    setOnboardingComplete?: (complete: boolean) => void;
    setUserName?: (name: string | null) => void;
}

// Add props to the component signature
const QuestionnairePage: React.FC<QuestionnairePageProps> = ({ setOnboardingComplete, setUserName }) => {
  const navigate = useNavigate();
  // State to track the current phase: 'questionnaire', 'nameInput', 'finished'
  const [phase, setPhase] = useState('questionnaire');
  // State to store the entered name locally
  const [userNameLocal, setUserNameLocal] = useState(''); // Use a different state name to avoid conflict with prop
  // State to store the questionnaire answers
  const [completedAnswers, setCompletedAnswers] = useState<{ [key: string]: string }>({});

  // Function called when the Questionnaire component finishes
  const handleQuestionnaireComplete = (answers: { [key: string]: string }) => {
    console.log("Questionnaire completed on QuestionnairePage:", answers);
    setCompletedAnswers(answers); // Store answers
    setPhase('nameInput'); // Move to the name input phase
  };

  // Function to handle input change for the name
  const handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameLocal(event.target.value); // Update local state
  };

  // Function to handle submitting the name
  const handleNameSubmit = () => {
    if (userNameLocal.trim()) {
      console.log("Name submitted:", userNameLocal.trim());
      // --- Save the user's name to Local Storage ---
      localStorage.setItem('userName', userNameLocal.trim());
      // --- Save the onboarding complete flag ---
      localStorage.setItem('onboardingComplete', 'true'); // <-- Added this line
      // --- End Save to Local Storage ---

      // Update state in parent components if setters were passed
      if (setUserName) setUserName(userNameLocal.trim());
      if (setOnboardingComplete) setOnboardingComplete(true);


      // Set the phase to 'finished' to show the final message briefly
      setPhase('finished');
      // We will now rely on the manual button click to navigate.
      // The Home page will read the flag from localStorage on load or react to storage event.
    } else {
      // Optionally show a warning if the name is empty
      alert("Please enter your name."); // Using alert for simplicity, replace with a better UI later
    }
  };

   // Function to handle clicking the manual proceed button
  const handleManualProceedToChat = () => {
      console.log("Manual Proceed to Chat button clicked. Navigating to /");
      // Navigate to the Home page. The Home page will read state from localStorage.
      navigate('/');
  };


  // Animation variants for transitions between phases
  const phaseVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
      {/* Page Title */}
      <motion.h1
         initial={{ opacity: 0, y: -50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="text-white text-4xl md:text-5xl font-light mb-8 tracking-wider text-center"
      >
         Tell Us About Yourself
      </motion.h1>

      {/* Use AnimatePresence to animate transitions between phases */}
      <AnimatePresence mode="wait"> {/* Use mode="wait" for sequential animation */}
        {/* Render Questionnaire phase */}
        {phase === 'questionnaire' && (
          <motion.div
            key="questionnaire-phase" // Key for AnimatePresence
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={phaseVariants}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl" // Ensure it takes appropriate width
          >
            {/* Render the Questionnaire component */}
            {/* Pass the completion handler */}
            <Questionnaire onComplete={handleQuestionnaireComplete} />
          </motion.div>
        )}

        {/* Render Name Input phase */}
        {phase === 'nameInput' && (
          <motion.div
            key="name-input-phase" // Key for AnimatePresence
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={phaseVariants}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl text-white" // Styled container
          >
            <h2 className="text-2xl font-semibold mb-6">What's your name?</h2>
            <input
              type="text"
              value={userNameLocal} // Use local state
              onChange={handleNameInputChange}
              placeholder="Enter your name"
              className="w-full px-4 py-3 text-lg rounded-full bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm mb-6" // Styled input
            />
            <motion.button
              onClick={handleNameSubmit} // Call the submit handler
              whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-xl bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all shadow-lg border border-transparent" // Styled button
            >
              Continue
            </motion.button>
          </motion.div>
        )}

        {/* Render Finished phase with Manual Button */}
        {phase === 'finished' && (
           <motion.div
             key="finished-phase" // Key for AnimatePresence
             initial="hidden"
             animate="visible"
             variants={phaseVariants}
             className="max-w-2xl mx-auto text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl text-white"
           >
             <h2 className="text-3xl font-bold mb-4">All Set!</h2>
             <p className="text-lg mb-8">Preparing your personalized experience...</p>
             {/* Manual button to proceed */}
             <motion.button
               onClick={handleManualProceedToChat} // Call the manual navigation handler
               whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.5)' }}
               whileTap={{ scale: 0.95 }}
               className="px-8 py-4 text-xl bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all shadow-lg border border-transparent" // Styled button
             >
               Proceed to Chat
             </motion.button>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionnairePage;
