const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/affirmations', async (req, res) => {
    const { thoughts } = req.body;  

  
    if (!thoughts || thoughts.trim().length === 0) {
        return res.status(400).json({ error: 'Thoughts are required to generate an affirmation.' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI that generates personalized affirmations. The tone should be positive, uplifting, and motivational."
                    },
                    {
                        role: "user",
                        content: `Create an affirmation based on these thoughts: "${thoughts}". Make it encouraging and impactful.`
                    }
                ],
                max_tokens: 100,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer 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`
                }
            }
        );

        const affirmation = response.data.choices[0].message.content.trim();
        res.json({ affirmation });

    } catch (error) {
        console.error('Error generating affirmation:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate affirmation.' });
    }
});

module.exports = router;
