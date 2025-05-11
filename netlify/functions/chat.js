// netlify/functions/chat.js (or chat.ts if you are using TypeScript)

// Import necessary libraries
// dotenv is useful for local testing, but Netlify handles environment variables in production
// import dotenv from 'dotenv';
import OpenAI from 'openai'; // Keep importing the openai library

// Load environment variables if running locally (Netlify handles this in production)
// dotenv.config();

// --- Security Check ---
// Access environment variables using process.env
const openRouterApiKey = process.env.OPENROUTER_API_KEY;

if (!openRouterApiKey) {
    console.error("Error: OPENROUTER_API_KEY not found in environment variables.");
    // In a function, you can't process.exit, but you can return an error response
    // We'll handle this by returning an error below if the key is missing.
}
// --- End Security Check ---


// >>> Initialize the OpenAI client, BUT point it to the OpenRouter API base URL <<<
// This client instance will be reused across function invocations if the function stays warm
const openai = new OpenAI({
    apiKey: openRouterApiKey, // Use the OpenRouter key from environment variables
    baseURL: 'https://openrouter.ai/api/v1', // <--- **OpenRouter API Base URL**
});

// --- Netlify Function Handler ---
// This is the main function that Netlify will execute when the endpoint is hit
exports.handler = async (event, context) => {
    console.log("Netlify Function /api/chat invoked");

    // Ensure the API key is available
    if (!openRouterApiKey) {
         return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server configuration error: API key not set." }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    // Netlify Functions provide the request body in event.body
    // The body is a string, so you need to parse it (assuming it's JSON)
    let requestBody;
    try {
        requestBody = JSON.parse(event.body);
    } catch (error) {
        console.error("Failed to parse request body:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid JSON in request body." }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    // Get the conversation history from the parsed request body
    const messages = requestBody.messages;

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        console.error("Invalid or empty messages array received.");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid or empty messages array provided." }),
            headers: { 'Content-Type': 'application/json' },
        };
    }

    console.log("Conversation History received:", messages);

    try {
        // >>> Call the OpenRouter API using the configured 'openai' instance <<<
        // This request goes to the baseURL you set above (OpenRouter's URL)
        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat:free", // <--- **Use the OpenRouter model identifier**
            messages: messages, // Pass the conversation history
            temperature: 0.7, // Controls randomness
            max_tokens: 500, // Limit the length
            // You can add extra headers required by OpenRouter here if needed
        });

        // Extract the AI's response text
        const aiResponseText = completion.choices[0].message.content;

        console.log("OpenRouter API (DeepSeek Model) Response:", aiResponseText);

        // --- Return the response in the Netlify Functions format ---
        return {
            statusCode: 200, // HTTP status code for success
            body: JSON.stringify({ reply: aiResponseText }), // The response body (must be a string)
            headers: {
                'Content-Type': 'application/json', // Indicate that the response is JSON
                 // You might need CORS headers if not handled by Netlify's default settings
                 // 'Access-Control-Allow-Origin': '*',
                 // 'Access-Control-Allow-Headers': 'Content-Type',
                 // 'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
        };

    } catch (error) {
        // >>> Log and handle errors specifically for the OpenRouter API call <<<
        console.error("Error calling OpenRouter API:", error);

        let statusCode = 500;
        let errorMessage = "An error occurred while processing your request.";
        let errorDetails = null;

        // Check for specific API errors
        if (error.response) {
            console.error("OpenRouter API Response Error Data:", error.response.data);
            statusCode = error.response.status || 500;
            errorMessage = error.response.data.error ? error.response.data.error.message : "Error from OpenRouter API.";
            errorDetails = error.response.data;
        }

        // --- Return an error response in the Netlify Functions format ---
        return {
            statusCode: statusCode,
            body: JSON.stringify({ error: errorMessage, details: errorDetails }),
            headers: { 'Content-Type': 'application/json' },
        };
    }
};
