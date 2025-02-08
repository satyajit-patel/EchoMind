
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ElevenLabsClient } = require("elevenlabs");
const voices = require("./voices.json");

const app = express();
app.use(express.json());
app.use(cors());

const Groq = require("groq-sdk");

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const APPLICATION_TOKEN = process.env.YOUR_APPLICATION_TOKEN;
if (!ELEVENLABS_API_KEY || !APPLICATION_TOKEN) {
    console.error("Missing API keys. Check .env file.");
    process.exit(1);
}

const client = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY});

async function convertTextToSpeech(text, voiceId) {
    try {
        if (!text) throw new Error("No text provided for speech conversion.");
        
        const audioStream = await client.textToSpeech.convert(voiceId, {
            text,
            model_id: "eleven_multilingual_v2",
            output_format: "mp3_44100_128",
        });

        if (!audioStream || typeof audioStream.pipe !== "function") {
            throw new Error("Invalid audio stream received.");
        }
        
        return audioStream;
    } catch (error) {
        console.error("Error generating speech:", error);
        throw error;
    }
}


  
async function getGroqChatCompletion(msg) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are an AI assistant that provides short, concise and accurate responses.",
            },
            {
                role: "user",
                content: msg,
            },
        ],
        model: "llama-3.3-70b-versatile",
    });
}

// server.js (backend)
async function main(msg) {
    try {
        const chatCompletion = await getGroqChatCompletion(msg);
        return chatCompletion.choices[0]?.message?.content;
    } catch (error) {
        console.error("Groq API error:", error);
        throw error;
    }
}

app.post("/generate-voice", async (req, res) => {
    try {
        const { userText, voiceType } = req.body;
        if (!userText) return res.status(400).json({ error: "Text input is required." });
        if (!voices[voiceType]) return res.status(400).json({ error: "Invalid voice type." });

        // Get AI-generated response
        const responseText = await main(userText);
        
        // Convert AI response to speech
        const audioStream = await convertTextToSpeech(responseText, voices[voiceType]);
        
        res.setHeader("Content-Type", "audio/mpeg");
        audioStream.pipe(res);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: error.message || "Something went wrong. Please try again." });
    }
});

app.get("/", (req, res) => res.send("Server is UP"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
