const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
    const { mood } = req.body;

    if (!mood) {
        return res.status(400).json({ error: 'Mood is required' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a therapist providing guided therapy. The session should be personalized to the user's mood, using calming language and techniques."
                    },
                    {
                        role: "user",
                        content: `I am feeling ${mood}. Please guide me through a relaxing therapy session.`
                    }
                ],
                max_tokens: 800,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer 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`
                }
            }
        );

        const guidedTherapy = response.data.choices[0].message.content.trim();
        res.json({ guidedTherapy });

    } catch (error) {
        console.error('Error generating guided therapy:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate guided therapy.' });
    }
});

module.exports = router;
