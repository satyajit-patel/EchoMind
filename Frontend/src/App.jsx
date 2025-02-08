
import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [text, setText] = useState("");
    const [voiceType, setVoiceType] = useState("formal");
    const [audioSrc, setAudioSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerateVoice = async (e) => {
        e.preventDefault();
        setError(null);
        setAudioSrc(null);
    
        if (!text.trim()) {
            setError("Please enter text before generating voice.");
            return;
        }
    
        setLoading(true);
        try {
            const myURL = `http://localhost:5000/generate-voice`;
            const response = await axios.post(myURL, { 
                userText: text, 
                voiceType 
            }, {
                responseType: "blob" // Ensure proper handling of binary data
            });
    
            const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
            const newAudioSrc = URL.createObjectURL(audioBlob);
            setAudioSrc(newAudioSrc);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-bold text-blue-400 mb-2 animate-fade-in">🎙️ EchoMind</h1>
            <p className="text-gray-300 mb-6 text-center">AI-powered voice synthesis with dynamic tones.</p>

            <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-lg transition-all hover:scale-105 hover:shadow-2xl">
                <form onSubmit={handleGenerateVoice} className="space-y-4">
                    <textarea
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        rows="4"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your text here..."
                        required
                    />

                    <select
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={voiceType}
                        onChange={(e) => setVoiceType(e.target.value)}
                    >
                        <option value="formal">Formal</option>
                        <option value="sarcastic">Sarcastic</option>
                        <option value="excited">Excited</option>
                        <option value="robotic">Robotic</option>
                    </select>

                    <button
                        type="submit"
                        className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300 flex justify-center items-center ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            "Generate Voice"
                        )}
                    </button>
                </form>
            </div>

            {error && (
                <div className="mt-4 bg-red-300 text-white p-3 rounded-lg shadow-md w-full max-w-lg">
                    ❌ {error}
                </div>
            )}

            {audioSrc && (
                <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-lg animate-fade-in">
                    <audio controls className="w-full">
                        <source src={audioSrc} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </div>
    );
};

export default App;
