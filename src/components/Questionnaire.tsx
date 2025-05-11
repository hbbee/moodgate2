import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the structure for a question
interface Question {
  id: string; // Unique identifier for the question
  text: string; // The question text (more personal tone)
  options: {
    value: string; // The value to store if this option is selected
    label: string; // The text displayed on the button (can also be more descriptive)
  }[];
}

// Define your list of questions here with more personality!
const questions: Question[] = [
  {
    id: 'current_vibe',
    text: "Hey there! Let's start with how you're feeling right now. What's the general vibe today?",
    options: [
      { value: 'great', label: "Feeling pretty good, thanks for asking!" },
      { value: 'okay', label: "Just cruising along, doing alright." },
      { value: 'meh', label: "Could be better, honestly." },
      { value: 'struggling', label: "Finding things a bit tough right now." },
    ],
  },
  {
    id: 'safe_space',
    text: "Thinking about where you spend most of your time, does it feel like a safe and supportive space for you?",
    options: [
      { value: 'very_safe', label: "Yes, absolutely. It's my sanctuary." },
      { value: 'mostly_safe', label: "Generally yes, with a few bumps sometimes." },
      { value: 'neutral', label: "It's okay, not particularly safe or unsafe." },
      { value: 'not_very_safe', label: "Honestly, not as safe as I'd like it to be." },
    ],
  },
  {
    id: 'sleep_story', // Changed ID for personality
    text: "Let's talk about sleep – the great reset button! How has your sleep story been lately?",
    options: [
      { value: 'zzz_master', label: "Sleeping like a log, consistently!" },
      { value: 'decent_rest', label: "Getting decent rest most nights." },
      { value: 'hit_or_miss', label: "It's a bit hit or miss, some good nights, some not." },
      { value: 'sleep_struggle', label: "Finding it hard to get enough quality sleep." },
    ],
  },
  {
    id: 'energy_levels', // New question idea with personality
    text: "How's your energy tank looking these days? Full, half-full, or running on empty?",
    options: [
      { value: 'full_tank', label: "Ready to go, plenty of energy!" },
      { value: 'half_full', label: "Got enough to get through the day." },
      { value: 'low_reserve', label: "Feeling pretty drained most of the time." },
      { value: 'empty', label: "Running on fumes, need a recharge." },
    ],
  },
  {
    id: 'coping_tools', // Question hinting at past experiences/trauma in a gentle way
    text: "When things get tough, what's one way you usually try to find your footing or feel better?",
    options: [
      { value: 'talk_it_out', label: "Talking to someone I trust." },
      { value: 'distract', label: "Diving into a hobby or distraction." },
      { value: 'self_care', label: "Doing something kind for myself (bath, walk, etc.)." },
      { value: 'process_alone', label: "Spending quiet time to process my thoughts." },
      { value: 'not_sure', label: "Honestly, I'm not sure how I cope." },
    ],
  },
  // Add more questions here, focusing on empathetic and open-ended phrasing.
  // Instead of directly asking "What trauma have you experienced?", you could ask:
  // {
  //   id: 'past_journeys',
  //   text: "Life takes us on all sorts of journeys. Are there any past experiences that feel like they still weigh on you?",
  //   options: [
  //     { value: 'yes', label: "Yes, some things are still with me." },
  //     { value: 'no', label: "Not particularly, feeling okay about the past." },
  //     { value: 'working_through', label: "Working through some past things right now." },
  //     { value: 'prefer_not_to_share', label: "Prefer not to share right now, thank you." },
  //   ],
  // },
  // You can also add open-ended text input questions if needed, but the current structure is multiple choice.
];

// Define the props the Questionnaire component expects
interface QuestionnaireProps {
    onComplete: (answers: { [key: string]: string }) => void; // Function to call when finished
}

// Add QuestionnaireProps to the component signature
const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  // State to track the index of the current question being displayed
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // State to store the user's answers
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  // State to know when the questionnaire is finished
  const [isFinished, setIsFinished] = useState(false);

  // Get the current question based on the index
  const currentQuestion = questions[currentQuestionIndex];

  // Function to handle an answer selection
  const handleAnswer = (selectedValue: string) => {
    // Store the answer for the current question
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedValue,
    }));

    // Move to the next question after a short delay for animation
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      // If there are more questions, go to the next one
      setTimeout(() => {
         setCurrentQuestionIndex(nextQuestionIndex);
      }, 300); // Short delay for animation
    } else {
      // If this was the last question, mark as finished
      setTimeout(() => {
         setIsFinished(true);
         // Here you would typically process the answers
         console.log("Questionnaire Finished! Answers:", answers);
         // Call the onComplete prop here, passing the answers
         onComplete(answers); // <-- UNCOMMENTED THIS LINE
      }, 300); // Short delay for animation
    }
  };

  // Animation variants for questions and options
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // --- Render the "Thank You" message when finished ---
  // The QuestionnairePage will handle showing the "Proceed" button,
  // so this component just needs to signal completion via onComplete.
  // We can still show a brief "Thank You" within this component before it potentially unmounts
  if (isFinished) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="max-w-2xl mx-auto text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
        <p className="text-lg">Please proceed to the next step.</p>
        {/* The QuestionnairePage will render the button */}
      </motion.div>
    );
  }

  // --- Render the current question and options ---
  return (
    <motion.div
      key={currentQuestionIndex} // Use question index as key for AnimatePresence transitions
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={itemVariants}
      transition={{ duration: 0.5 }} // Transition duration for the question block
      className="max-w-2xl mx-auto text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl text-white"
    >
      {/* Display the current question text */}
      <h2 className="text-2xl font-semibold mb-8">{currentQuestion?.text}</h2>

      {/* Display answer options as buttons */}
      <div className="flex flex-col space-y-4">
        {currentQuestion?.options.map((option, index) => (
          <motion.button
            key={option.value} // Use option value as key
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={itemVariants}
            transition={{ duration: 0.3, delay: index * 0.05 }} // Stagger option animations
            onClick={() => handleAnswer(option.value)}
            // Styling for the option buttons - similar to the "Take the Test" button style
            className="px-6 py-3 text-lg bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-200 backdrop-blur-md border border-transparent hover:border-white/30"
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default Questionnaire;
