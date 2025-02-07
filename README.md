# EchoMind 🎙️  

**AI-driven voice synthesis with generative intelligence.**  

## 🚀 About EchoMind  
EchoMind is an **AI-powered text-to-speech (TTS) application** that **enhances speech generation** using **Generative AI**. Instead of directly converting text to speech, EchoMind first **processes input through a Generative AI model** to refine tone, context, and structure, ensuring more **natural and engaging output** before passing it to TTS for voice synthesis.  

## 🔗 Live Demo  
[Vercel Deployment Link](#) _(Coming Soon)_  

## 🛠️ How It Works  
1. **User inputs text** → Selects a voice tone → Clicks "Generate Voice".  
2. **Langflow (Generative AI) refines the text**, adjusting tone, grammar, and context.  
3. **Processed text is sent to ElevenLabs (TTS)** for **lifelike speech synthesis**.  
4. **The final AI-generated speech is streamed back** to the user in real time.  

## 🏗️ Tech Stack  
- **Langflow** - Enhances input text with generative AI before TTS conversion.  
- **ElevenLabs** - Provides natural-sounding voice synthesis.  
- **Node.js + Express.js** - Backend API for AI & TTS integration.  
- **React + Tailwind CSS** - Frontend for user interaction.  

## 📜 Features  
✅ AI-enhanced speech synthesis with **intelligent text refinement**.  
✅ Choose from multiple tones (**Formal, Sarcastic, Excited, Robotic**).  
✅ Real-time **streaming audio playback** for instant results.  

## 📦 Installation & Setup  
```sh
git clone https://github.com/yourusername/EchoMind.git

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
#### NOTE: Make sure to update .env file 
