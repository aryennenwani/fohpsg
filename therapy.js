const express = require('express');
const axios = require('axios');
const router = express.Router();

const musicMap = {
    fiening: 'https://freesound.org/data/previews/519/519168_3001454-lq.mp3',
    happy: 'https://freesound.org/data/previews/523/523276_10842179-lq.mp3',
    sad: 'https://freesound.org/data/previews/337/337049_5865515-lq.mp3',
    depressed: 'https://freesound.org/data/previews/337/337049_5865515-lq.mp3',
    neutral: 'https://freesound.org/data/previews/337/337051_5865515-lq.mp3'
};

router.post('/therapy', async (req, res) => {
    const { emotion } = req.body;
    let imageUrl = '';
    let musicUrl = '';

    try {
        const dalleResponse = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                prompt: `A calming, therapeutic image representing the emotion ${emotion}. Hyper-realistic, detailed, peaceful, and soothing.`,
                n: 1,
                size: "1024x1024"
            },
            {
                headers: {
                    Authorization: `Bearer YOUR_OPENAI_API_KEY` // Replace with actual OpenAI key
                }
            }
        );

        if (dalleResponse.data && dalleResponse.data.data && dalleResponse.data.data.length > 0) {
            imageUrl = dalleResponse.data.data[0].url;
        } else {
            throw new Error("No image returned by DALL-E");
        }

        if (musicMap[emotion]) {
            musicUrl = musicMap[emotion];
        } else {
            musicUrl = musicMap['neutral'];
        }

        res.json({ imageUrl, musicUrl });
    } catch (error) {
        console.error('Error generating image or music:', error.message || error);
        res.status(500).json({ error: 'Failed to fetch therapy content. Please try again later.' });
    }
});

module.exports = router;
