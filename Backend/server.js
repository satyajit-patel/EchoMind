const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ElevenLabsClient } = require("elevenlabs");
const Groq = require("groq-sdk");
const voices = require("./voices.json");

const app = express();
app.use(express.json());

app.use(cors({
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const client = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });
const groq = new Groq({ apiKey: GROQ_API_KEY });

async function generateAIResponse(userText) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are an AI assistant that provides short, concise, and accurate responses." },
                { role: "user", content: userText },
            ],
            model: "llama-3.3-70b-versatile",
        });

        if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
            throw new Error("AI response is empty.");
        }

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error("Groq API Error:", error);
        throw new Error("Failed to generate AI response.");
    }
}

async function convertTextToSpeech(text, voiceId) {
    try {
        if (!text) throw new Error("No text provided for speech conversion.");
        if (!voiceId) throw new Error("Invalid voice ID.");

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
        console.error("ElevenLabs API Error:", error);
        throw new Error("Failed to convert text to speech.");
    }
}

app.post("/generate-voice", async (req, res) => {
    try {
        const { userText, voiceType } = req.body;
        if (!userText) return res.status(400).json({ error: "Text input is required." });
        if (!voices[voiceType]) return res.status(400).json({ error: "Invalid voice type." });

        // Step 1: Generate AI response
        const aiGeneratedText = await generateAIResponse(userText);

        // Step 2: Convert AI response to speech
        const audioStream = await convertTextToSpeech(aiGeneratedText, voices[voiceType]);

        res.setHeader("Content-Type", "audio/mpeg");

        audioStream.pipe(res);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: error.message || "Something went wrong. Please try again." });
    }
});

app.get("/", (req, res) => res.send("Server is running successfully."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
