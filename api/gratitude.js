const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/gratitude', async (req, res) => {
    const { moments } = req.body;  // Capture the moments user sends

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI that helps users express personalized gratitude in a warm, reflective, and thoughtful manner. The message should be written from the user's perspective, focusing on positive moments or people the user mentions. Aim to evoke a sense of deep appreciation, happiness, and gratitude for life. Keep the tone heartfelt and sincere, and write between 80-100 words to create a meaningful and impactful message that leaves the user feeling uplifted and grateful. Make the message truly resonate with the user's emotions and experiences."
                    },
                    {
                        role: "user",
                        content: `Create a personalized gratitude message based on these positive moments: "${moments}". The tone should be warm and reflective.`
                    }
                ],
                max_tokens: 200,
                temperature: 0.844444
            },
            {
                headers: {
                    Authorization: `Bearer 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`
                }
            }
        );

        const gratitudeMessage = response.data.choices[0].message.content.trim();
        res.json({ gratitudeMessage });

    } catch (error) {
        console.error('Error generating gratitude message:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate gratitude message' });
    }
});

module.exports = router;
