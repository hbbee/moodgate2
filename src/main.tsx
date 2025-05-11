import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Assuming you have a global index.css for other styles

// Find the root element in index.html where the React app will be mounted
const container = document.getElementById('root');

// Ensure the container exists before creating the root
if (container) {
  // Create a root for the React application
  const root = createRoot(container);

  // Render the main App component inside StrictMode for development checks
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  // Log an error if the root element is not found
  console.error('Root element with ID "root" not found in the document.');
}
