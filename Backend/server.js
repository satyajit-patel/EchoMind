const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ElevenLabsClient, play } = require("elevenlabs");

const app = express();
app.use(express.json());
app.use(cors());

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "your_api_key_here";
const voices = require("./voices.json"); // Ensure this file exists

const client = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });

async function convertTextToSpeech(text, voiceId) {
    try {
        const audio = await client.textToSpeech.convert(voiceId, {
            text: text,
            model_id: "eleven_multilingual_v2",
            output_format: "mp3_44100_128",
        });

        if (!audio) {
            throw new Error("Received null response from ElevenLabs API");
        }

        return audio;
    } catch (error) {
        console.error("Error generating speech:", error);
        throw error;
    }
}

// Note: Replace **<YOUR_APPLICATION_TOKEN>** with your actual Application token
class LangflowClient {
  constructor(baseURL, applicationToken) {
      this.baseURL = baseURL;
      this.applicationToken = applicationToken;
  }
  async post(endpoint, body, headers = {"Content-Type": "application/json"}) {
      headers["Authorization"] = `Bearer ${this.applicationToken}`;
      headers["Content-Type"] = "application/json";
      const url = `${this.baseURL}${endpoint}`;
      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(body)
          });

          const responseMessage = await response.json();
          if (!response.ok) {
              throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
          }
          return responseMessage;
      } catch (error) {
          console.error('Request Error:', error.message);
          throw error;
      }
  }

  async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
      const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
      return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
  }

  handleStream(streamUrl, onUpdate, onClose, onError) {
      const eventSource = new EventSource(streamUrl);

      eventSource.onmessage = event => {
          const data = JSON.parse(event.data);
          onUpdate(data);
      };

      eventSource.onerror = event => {
          console.error('Stream Error:', event);
          onError(event);
          eventSource.close();
      };

      eventSource.addEventListener("close", () => {
          onClose('Stream closed');
          eventSource.close();
      });

      return eventSource;
  }

  async runFlow(flowIdOrName, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
      try {
          const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream, tweaks);
          console.log('Init Response:', initResponse);
          if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
              const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
              console.log(`Streaming from: ${streamUrl}`);
              this.handleStream(streamUrl, onUpdate, onClose, onError);
          }
          return initResponse;
      } catch (error) {
          console.error('Error running flow:', error);
          onError('Error initiating session');
      }
  }
}

async function main(inputValue, inputType = 'chat', outputType = 'chat', stream = false) {
  const flowIdOrName = 'bd4294ed-7186-463f-9de0-99e1c67a67a6';
  const langflowId = 'f0cec629-7ad7-48ca-847c-adae8a14d9fe';
  const applicationToken = process.env.YOUR_APPLICATION_TOKEN;
  const langflowClient = new LangflowClient('https://api.langflow.astra.datastax.com',
      applicationToken);

  try {
    const tweaks = {
"ChatInput-tAu92": {},
"Prompt-9MViT": {},
"ChatOutput-DUP7J": {},
"GroqModel-DwEIb": {}
};
    response = await langflowClient.runFlow(
        flowIdOrName,
        langflowId,
        inputValue,
        inputType,
        outputType,
        tweaks,
        stream,
        (data) => console.log("Received:", data.chunk), // onUpdate
        (message) => console.log("Stream Closed:", message), // onClose
        (error) => console.log("Stream Error:", error) // onError
    );
    if (!stream && response && response.outputs) {
        const flowOutputs = response.outputs[0];
        const firstComponentOutputs = flowOutputs.outputs[0];
        const output = firstComponentOutputs.outputs.message;

        console.log("Final Output:", output.message.text);
        return output.message.text;
    }
  } catch (error) {
    console.error('Main Error', error.message);
  }
}

app.post("/generate-voice", async (req, res) => {
  const { userText, voiceType } = req.body;

  if (!voices[voiceType]) {
      return res.status(400).json({error: "Invalid voice type selected."});
  }

  const responseText = await main(userText);

  try {
      const audioStream = await convertTextToSpeech(responseText, voices[voiceType]);

      res.setHeader("Content-Type", "audio/mpeg"); // Set correct audio header
      audioStream.pipe(res); // Stream directly to client
  } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Error generating speech." });
  }
});

app.get("/", (req, res) => {
    res.send("Server is UP");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
