import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

// Update the Message interface to allow text to be a string or JSX.Element
interface Message {
  text: string | JSX.Element; // Allow JSX for formatted content
  isUser: boolean;
  isTyping?: boolean;
}

const systemMessage = {
  role: "system",
  content: "You are a helpful assistant designed to help the user explore aspects of themselves and their emotions. Respond in a supportive and encouraging tone."
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([systemMessage]);

  // Function to format the raw AI response text
  const formatMessageText = (text: string): string | JSX.Element => {
    let formattedText = text;

    // --- Add Friendly Opening/Closing and Emojis (Basic Examples) ---
    // You can expand this logic significantly
    if (!formattedText.trim().match(/^(hello|hi|hey)/i)) { // Check if it doesn't start with a greeting
         formattedText = "Hey there! 😊 " + formattedText;
    }
    if (!formattedText.trim().match(/[.!?]$/)) { // Add a friendly ending if it doesn't end with punctuation
         formattedText += " ✨";
    }

    // Basic emoji replacements - be careful with context!
    formattedText = formattedText.replace(/\bstress\b/gi, "stress 😟");
    formattedText = formattedText.replace(/\bhappy\b/gi, "happy 😄");
    formattedText = formattedText.replace(/\bhelp\b/gi, "help 👍");
    formattedText = formattedText.replace(/\bexplore\b/gi, "explore 🧠");
    formattedText = formattedText.replace(/\bemotions\b/gi, "emotions ❤️");


    // --- Structure Text by Splitting on Newlines ---
    const paragraphs = formattedText.split('\n').map(paragraph => paragraph.trim()).filter(paragraph => paragraph.length > 0);

    if (paragraphs.length > 1) {
      // If there are multiple paragraphs, return JSX
      return (
        <>
          {paragraphs.map((p, pIndex) => (
            // Add margin to paragraphs after the first one
            <p key={pIndex} className={pIndex > 0 ? 'mt-2' : ''}>{p}</p>
          ))}
        </>
      );
    } else {
      // If only one paragraph, return the string (or the single paragraph)
      return formattedText;
    }
  };


  useEffect(() => {
      setIsTyping(true);
      const welcomeMessageText = "Hi! I'm here to help you discover more about yourself. What would you like to explore today?";
      // Format the welcome message using the new function
      const formattedWelcomeMessage = formatMessageText(welcomeMessageText);

      setTimeout(() => {
        setMessages([{
          text: formattedWelcomeMessage, // Use the formatted message
          isUser: false
        }]);
        // Note: conversationHistory should ideally store the raw text for the API
        setConversationHistory(prev => [...prev, { role: "assistant", content: welcomeMessageText }]);
        setIsTyping(false);
      }, 2000);
  }, []); // Empty dependency array means this effect runs once on mount

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessageText = input.trim();
    const userMessageForDisplay = { text: userMessageText, isUser: true };
    const userMessageForAPI = { role: "user", content: userMessageText };

    // Add user message immediately
    setMessages(prev => [...prev, userMessageForDisplay]);
    // Add user message to history (raw text)
    setConversationHistory(prev => [...prev, userMessageForAPI]);

    // Clear input and show typing indicator
    setInput('');
    setIsTyping(true);

    try {
      // Send conversation history (including the latest user message) to the API
      const response = await fetch('/api/chat', { // <-- **UPDATE THIS URL** if your backend endpoint is different
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...conversationHistory, userMessageForAPI],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend API Error:', errorData.error);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponseText = data.reply; // <-- Make sure your backend sends the AI text in a 'reply' field

      // Format the AI response text before displaying
      const formattedAiResponse = formatMessageText(aiResponseText);

      setIsTyping(false);

      // Create the AI message for display using the formatted text/JSX
      const aiMessageForDisplay = { text: formattedAiResponse, isUser: false };
      setMessages(prev => [...prev, aiMessageForDisplay]);
      // Add the raw AI response text to conversation history for the next API call
      setConversationHistory(prev => [...prev, { role: "assistant", content: aiResponseText }]);

    } catch (error) {
      console.error('Failed to send message or get AI response:', error);
      setIsTyping(false);
      // Format the error message too
      const errorMessage = formatMessageText("Sorry, I'm having trouble connecting right now. Please try again later. 😔");
      setMessages(prev => [...prev, { text: errorMessage, isUser: false }]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mt-20 px-4"
    >
      <div className="space-y-6">
        <AnimatePresence initial={false}> {/* initial={false} prevents initial animation on mount for existing items */}
          {messages.map((message, index) => (
            <motion.div
              key={index}
              // --- ANIMATION CHANGES START HERE ---
              initial={{
                opacity: 0,
                // Slide in from left for bot, right for user
                x: message.isUser ? 50 : -50,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                x: 0, // Move to final position
                scale: 1
              }}
              exit={{
                opacity: 0,
                // Slide out in the same direction
                x: message.isUser ? 50 : -50,
                scale: 0.9
              }}
              transition={{
                type: "spring", // Use a spring animation for a little bounce
                damping: 15, // Adjust damping and stiffness for feel
                stiffness: 150,
                duration: 0.5, // Overall duration
                delay: index * 0.05 // Stagger messages slightly based on index
              }}
              // --- ANIMATION CHANGES END HERE ---
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-sm ${
                  message.isUser
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                {/* Render the message text - it can be a string or JSX */}
                {message.text}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
                key="typing-indicator" // Add a key to the typing indicator for AnimatePresence
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} // Add exit animation
                transition={{ duration: 0.2 }} // Optional: add a transition
              className="flex justify-start"
            >
              <div className="max-w-[80%] p-4 rounded-2xl bg-white/10 text-white backdrop-blur-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: messages.length * 0.05 + (isTyping ? 0.2 : 0), duration: 0.3 }} // Add delay based on number of messages and typing
        className="mt-6 mb-8"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={isTyping} // Disable input while typing
            className="flex-1 px-6 py-3 rounded-full bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()} // Disable send button while typing or input is empty
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-6 h-6 text-white" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chatbot;
