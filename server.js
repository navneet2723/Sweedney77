const express = require('express');
const cors = require("cors");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config();
const path = require('path'); // Add this for path handling

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files from the root directory

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

const psychologicalQuestions = [
    "Can you describe what led to your feelings today?",
    "How would you rate your current mood on a scale from 1 to 10?",
    "What are some specific thoughts that have been occupying your mind recently?",
    "Have you noticed any physical symptoms when you're feeling overwhelmed?",
    "What activities do you usually enjoy, and have you been able to engage in them lately?",
    "Are there any recent events that have impacted your emotional well-being?",
    "How do you usually cope with stress or difficult emotions?",
    "What support systems do you currently have in your life?",
    "If you could change one thing about your situation right now, what would it be?",
    "Can you think of a time when you felt particularly good about yourself? What was happening then?"
];

async function runChat(userInput) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 1000,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        // ... other safety settings
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
            {
                role: "user",
                parts: [{ text: "You are Sweedney, a compassionate mental health assistant designed to help users explore their feelings and thoughts. Ask open-ended questions that allow users to share their experiences and emotional states." }],
            },
            {
                role: "model",
                parts: [{ text: "Hello! I’m Sweedney, here to help you with your mental well-being. How are you feeling today?" }],
            },
        ],
    });

    const result = await chat.sendMessage(userInput);
    const response = result.response;

    const randomQuestion = psychologicalQuestions[Math.floor(Math.random() * psychologicalQuestions.length)];
    const enhancedResponse = `${response.text()}\n\nBy the way, I'd love to know more about your situation. ${randomQuestion}`;

    return enhancedResponse; 
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Use path.join for cross-platform compatibility
});

app.post('chat', async (req, res) => {
    try {
        const userInput = req.body?.userInput;
        console.log('incoming /chat req', userInput);
        if (!userInput) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const response = await runChat(userInput);
        res.json({ response });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
