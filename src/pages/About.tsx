import { motion } from 'framer-motion';
// import Background from '../components/Background'; // Keep this commented out/removed

const About = () => {
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
        This div contains the main visible content of the About page.
        z-10 ensures it's above the background (which is z-index: 0).
        min-h-screen ensures it takes full height, flex/items/justify centers content vertically.
        px classes add horizontal padding.
      */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-8 lg:px-16">
        {/* Animated container for the About text */}
        <motion.div
          // Initial state (starts faded and slightly lower)
          initial={{ opacity: 0, y: 20 }}
          // Animation when entering (fades in and moves up)
          animate={{ opacity: 1, y: 0 }}
          // Styling classes for the container (max width, semi-transparent background, blur, padding, text color)
          // These classes are styled in style.css to use the new color palette and readability improvements
          className="max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white"
        >
          {/* About Us title */}
          {/* h1 styles are handled in style.css */}
          <h1 className="text-4xl md:text-5xl font-light mb-8 tracking-wider">About Us</h1>
          {/* About Us paragraph text */}
          {/* text-white class is styled in style.css */}
          <p className="text-lg leading-relaxed text-white"> {/* Ensure text-white class is on paragraph */}
            We are a dedicated group of students from the National School of Commerce and Management. Our mission is to support individuals who face daily stress and emotional challenges. At MOODGATE, we believe that understanding one's personality and emotional state is the key to achieving better mental health and a balanced life. Our platform offers a safe and supportive environment where users can discover their true selves, learn practical stress management techniques, and find personalized ways to improve their overall mood and well-being. We aim to make mental wellness more accessible, approachable, and a natural part of daily life.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
