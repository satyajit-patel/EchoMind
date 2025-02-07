# EchoMind 🎙️  

**Conversational AI with Generative Intelligence & Realistic Speech Synthesis**  

## 🚀 About EchoMind  
EchoMind is an **AI-powered voice assistant** that **combines generative AI and text-to-speech (TTS) technology**. Unlike standard TTS applications that merely convert text into speech, **EchoMind first generates intelligent responses** using the **Groq LLM model**, then **synthesizes speech using ElevenLabs**, delivering a highly **interactive and natural-sounding AI experience**.  

## 🔗 Live Demo  
[Vercel Deployment Link](#) _(Coming Soon)_  

## 🛠️ How It Works  
1. **User asks a question or provides input** in the chat interface.  
2. **Groq LLM processes the input** and generates a relevant response.  
3. **The response text is sent to ElevenLabs TTS**, which converts it into **high-quality speech**.  
4. **Frontend receives the speech as a Blob** and plays it instantly.  

## 🎯 Why EchoMind is Unique  
✅ **Hybrid AI model** combining **LLM intelligence + advanced speech synthesis**.  
✅ **Seamless, real-time AI voice responses** (not just text-to-speech).  
✅ **Supports multiple voice tones** (e.g., Formal, Sarcastic, Excited, Robotic).  
✅ **Highly scalable** – can be integrated into **voice assistants, customer support bots, or accessibility tools**.  

## What problem does it solve?
🚀 EchoMind **solves a real problem**—traditional TTS systems lack intelligence, and most chatbots lack **natural speech synthesis**. By **merging LLM intelligence with voice synthesis**, EchoMind creates a truly **conversational AI**.  

This **hybrid approach** makes it more than just a **TTS tool**—it’s a **fully interactive voice-based AI assistant** that can be expanded into multiple domains like **customer service, accessibility tools, or personal AI companions**.  

## 🏗️ Tech Stack  
- **Groq LLM** - Generates intelligent responses before TTS.  
- **ElevenLabs TTS** - Converts AI-generated responses into lifelike speech.  
- **Node.js + Express.js** - Backend API for AI integration.  
- **React + Tailwind CSS** - Frontend for user interaction.  

## 📦 Installation & Setup  
```
git clone https://github.com/yourusername/EchoMind.git
```
### Frontend
``` 
    cd Frontend
    npm install
    npm run dev
```
### Backend
``` 
    cd Backend
    npm install
    node server.js
```
### 🔑 Environment Variables (.env)
Ensure you update the .env file with the necessary API keys:
```
    ELEVENLABS_API_KEY=your_api_key
    YOUR_APPLICATION_TOKEN=your_langflow_api_key
    PORT=5000
```
