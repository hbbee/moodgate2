import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import QuestionnairePage from './pages/QuestionnairePage'; // Import the new QuestionnairePage
// Removed Spline component import as the viewer is used in index.html

function App() {
  // Removed loading state logic as the viewer handles its own loading

  return (
    <Router>
      {/*
        The Spline Web Viewer is now handled directly in index.html using the <spline-viewer> tag.
        Removed the spline-background-container div and Spline component from here.
      */}

      {/*
        This div wraps your main application content (Navbar and pages).
        It needs a higher z-index than the Spline background (which is z-index: 0 in index.html) to be visible.
        min-h-screen ensures this container takes at least the full viewport height.
        relative and z-10 are crucial for layering above the Spline background.
      */}
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <Routes>
          {/* Define your routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* Add the new route for the Questionnaire Page */}
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          {/* Add more routes here as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
