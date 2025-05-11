import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Questionnaire from '../components/Questionnaire'; // Import the Questionnaire component
import { motion } from 'framer-motion'; // Import motion for animations

const QuestionnairePage = () => {
  const navigate = useNavigate(); // Get the navigate function

  // Function to handle completion of the questionnaire
  const handleQuestionnaireComplete = (answers: { [key: string]: string }) => {
    console.log("Questionnaire completed on QuestionnairePage:", answers);
    // Process answers here if needed (e.g., send to backend)

    // Navigate to the Home page (or another page) after completion
    // You could pass answers as state if needed: navigate('/', { state: { questionnaireAnswers: answers } });
    navigate('/');
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

      {/* Render the Questionnaire component */}
      {/* Pass the completion handler */}
      <Questionnaire onComplete={handleQuestionnaireComplete} />
    </div>
  );
};

export default QuestionnairePage;
