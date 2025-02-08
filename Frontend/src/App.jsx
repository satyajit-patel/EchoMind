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
            // const myURL = "http://localhost:5000/generate-voice";
            const myURL = `${import.meta.env.VITE_URL}/generate-voice`;
            const response = await axios.post(myURL, {userText: text, voiceType}, {responseType: "blob"});

            const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
            const newAudioSrc = URL.createObjectURL(audioBlob);

            setAudioSrc(newAudioSrc);
        } catch (error) {
            setError("An error occurred while generating the voice.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
            <div className="max-w-2xl w-full space-y-8">
                {/* Header Section */}
                <div className="text-center">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                        🎙️ EchoMind
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Transform text into natural-sounding speech with emotional tone selection
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
                    <form onSubmit={handleGenerateVoice} className="space-y-6">
                        {/* Text Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Your Text
                            </label>
                            <textarea
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                rows="4"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter your text here..."
                                required
                            />
                        </div>

                        {/* Voice Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Select Tone
                            </label>
                            <select
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                value={voiceType}
                                onChange={(e) => setVoiceType(e.target.value)}
                            >
                                <option value="formal">🎩 Formal</option>
                                <option value="sarcastic">😏 Sarcastic</option>
                                <option value="excited">🚀 Excited</option>
                                <option value="robotic">🤖 Robotic</option>
                            </select>
                        </div>

                        {/* Generate Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl 
                            bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                            text-white font-semibold transition-all ${loading ? "opacity-75" : ""}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                "Generate Voice"
                            )}
                        </button>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-800/30 border border-red-700 rounded-xl flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-400">{error}</span>
                        </div>
                    )}

                    {/* Audio Player */}
                    {audioSrc && (
                        <div className="mt-8 animate-fade-in">
                            <div className="bg-gray-700/50 p-4 rounded-xl">
                                <p className="text-gray-300 text-sm mb-2">Generated Audio:</p>
                                <audio
                                    key={audioSrc}
                                    controls
                                    autoPlay
                                    className="w-full rounded-lg"
                                >
                                    <source src={audioSrc} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;