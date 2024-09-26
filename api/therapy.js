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
                    Authorization: `Bearer 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` 
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
