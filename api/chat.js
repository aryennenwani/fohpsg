const express = require('express');
const axios = require('axios');
const router = express.Router();
let conversationHistory = [];

const emotionMusic = {
    "happy": "https://example.com/happy_music.mp3",
    "sad": "https://example.com/sad_music.mp3",
    "angry": "https://example.com/angry_music.mp3",
    "calm": "https://example.com/calm_music.mp3",
    "depressed": "https://example.com/depressed_music.mp3",
};

async function generateDALLEImage(prompt) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            },
            {
                headers: {
                    Authorization: `Bearer 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`
                }
            }
        );
        return response.data.data[0].url;
    } catch (error) {
        return null;
    }
}

router.post('/chat', async (req, res) => {
    const { message } = req.body;
    try {
        conversationHistory.push({ role: 'user', content: message });
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `
                        You are a compassionate and empathetic virtual therapist. 
                        Your goal is to provide mental health support in a calm, thoughtful, and supportive way. 
                        You can discuss deep emotional topics like anxiety, depression, and mental health crises.
                        You are developed by Team Pathways World School, engineers Aryen Nenwani, Irsa Sharma, Vihaan Upadhayay and Anushree.
                        `
                    },
                    ...conversationHistory
                ],
                max_tokens: 500,
                temperature: 0.8
            },
            {
                headers: {
                    Authorization: `Bearer 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`
                }
            }
        );

        const aiResponse = response.data.choices[0].message.content;
        conversationHistory.push({ role: 'assistant', content: aiResponse });

        const emotion = message.toLowerCase().includes("depressed") ? "depressed" :
                        message.toLowerCase().includes("happy") ? "happy" :
                        message.toLowerCase().includes("angry") ? "angry" :
                        message.toLowerCase().includes("calm") ? "calm" : null;

        let dalleImageUrl = null;
        let musicUrl = null;

        if (emotion) {
            dalleImageUrl = await generateDALLEImage(`${emotion} landscape, hyperrealistic, calming, soothing scene`);
            musicUrl = emotionMusic[emotion];
        }

        res.json({ 
            textResponse: aiResponse,
            imageUrl: dalleImageUrl,
            musicUrl: musicUrl
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch response from AI.' });
    }
});

module.exports = router;
