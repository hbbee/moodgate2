// server/index.js (This code is for running your backend locally with Node.js, using the Google Gemini API)

import express from 'express';
import dotenv from 'dotenv'; // Needed to load environment variables from .env
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import the Google Generative AI library
import cors from 'cors';

// Load environment variables from .env file
// This makes the variables in your .env file available via process.env
dotenv.config();

// --- Security Check ---
// Make sure the GOOGLE_API_KEY is loaded from the environment
// We are now checking for GOOGLE_API_KEY
if (!process.env.GOOGLE_API_KEY) {
    console.error("Error: GOOGLE_API_KEY not found in your environment variables.");
    console.error("Please make sure you have a .env file in your project root with GOOGLE_API_KEY=YOUR_SECRET_KEY");
    // Exit the process if the key is not found, as the server cannot function
    process.exit(1);
}
// --- End Security Check ---


// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Choose a model
// You can change this to other available Gemini models if needed
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"}); // Example model

const app = express();
// Use port 3001 for the backend by default, or use the PORT environment variable
const port = process.env.PORT || 3001;

// --- Middleware ---
// Enable CORS for cross-origin requests from your frontend
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());
// --- End Middleware ---


// --- API Endpoint for Chat ---
// This route handles POST requests to /api/chat
app.post('/api/chat', async (req, res) => {
    console.log("Received request at /api/chat");

    // Get the conversation history from the request body
    const messages = req.body.messages;

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        console.error("Invalid or empty messages array provided.");
        return res.status(400).json({ error: "Invalid or empty messages array provided." });
    }

    console.log("Conversation History received:", messages);

    try {
        // --- Call the Google Gemini API ---
        // The messages format for Gemini is slightly different from OpenAI/OpenRouter
        // It expects alternating 'user' and 'model' roles, STARTING WITH 'user'.
        // We need to convert the incoming messages format and ensure the order is correct for Gemini.

        // Filter out initial system/assistant messages and convert roles/format
        // We only want the alternating user/assistant turns that represent the actual conversation history
        // that can be sent to Gemini's startChat history.
        const geminiMessages = [];
        let expectingUser = true; // Gemini history must start with user

        for (const msg of messages) {
            // Skip the initial system message and the very first assistant message
            // if the conversation hasn't started with a user turn yet.
            if (geminiMessages.length === 0 && msg.role !== 'user') {
                 continue; // Skip until we find the first user message
            }

            if (msg.role === 'user' && expectingUser) {
                geminiMessages.push({
                    role: 'user',
                    parts: [{ text: msg.content }],
                });
                expectingUser = false; // Next message should be model
            } else if (msg.role === 'assistant' && !expectingUser) {
                 geminiMessages.push({
                    role: 'model', // Gemini uses 'model' for AI responses
                    parts: [{ text: msg.content }],
                });
                expectingUser = true; // Next message should be user
            } else {
                // Handle unexpected roles or order if necessary, or just skip
                console.warn(`Skipping message with role "${msg.role}" due to unexpected order or role.`);
            }
        }

        // The last message in the history should be the user's new message that we want to send.
        // We will send this message separately using chat.sendMessage, not include it in the history for startChat.
        const latestUserMessageContent = geminiMessages.pop(); // Remove the last user message from history for startChat

        if (!latestUserMessageContent || latestUserMessageContent.role !== 'user') {
             console.error("Could not find the latest user message to send to Gemini.");
             return res.status(400).json({ error: "Invalid conversation history format: Missing latest user message." });
        }


        // Start a chat session with the model, providing the history *excluding* the latest user message
        const chat = model.startChat({
            history: geminiMessages, // Pass the filtered and formatted conversation history
            // You can add generation config or safety settings here if needed
        });

        // Send the latest user message content separately
        const result = await chat.sendMessage(latestUserMessageContent.parts[0].text);
        const response = await result.response;
        const geminiResponseText = response.text(); // Get the text from the response

        console.log("Google Gemini API Response:", geminiResponseText);

        // --- Send the response back to the frontend ---
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*'); // Still needed for local testing with CORS
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        res.end(JSON.stringify({ reply: geminiResponseText })); // Send the JSON response

    } catch (error) {
        console.error("Error calling Google Gemini API:", error);

        let statusCode = 500;
        let errorMessage = "An error occurred while processing your request.";
        let errorDetails = null;

        // Basic error handling - Gemini API errors might have different structures
        if (error.message) {
             errorMessage = error.message;
        }
        // You might need more specific error parsing based on the structure of errors
        // returned by the @google/generative-ai library

        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: errorMessage, details: errorDetails }));
    }
});
// --- End API Endpoint ---


// --- Start the Server ---
app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
    console.log(`Chat endpoint: http://localhost:${port}/api/chat`);
});
// --- End Start Server ---
