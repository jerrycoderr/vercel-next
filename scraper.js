// Xeno Exe

const axios = require('axios');

async function spotifyDownloader(spotifyUrl) {
    const API = "https://musicfab.io/api/spotify";

    try {
        
        const response = await axios.post(
            API,
            { url: spotifyUrl },
            {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                    "Origin": "https://musicfab.io",
                    "Referer": "https://musicfab.io/",
                    "Sec-CH-UA": '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
                    "Sec-CH-UA-Mobile": "?1",
                    "Sec-CH-UA-Platform": '"Android"',
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Dest": "empty",
                    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
                },
                validateStatus: () => true
            }
        );

        const metadata = response.data?.data?.metadata || null;

        if (!metadata || !metadata.download) {
            throw new Error("Failed");
        }

        const title = metadata.name || "Spotify Song";
        const artist = metadata.artist || "Spotify Downloader";
        const thumbnail = metadata.image || "https://i.scdn.co/image/ab67616d0000b273b14a016954baa06d8af0466e";
        const downloadUrl = metadata.download;
        const bufferResponse = await axios.get(downloadUrl, {
            responseType: 'arraybuffer',
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36"
            }
        });

        if (!bufferResponse.data || bufferResponse.data.length < 1000) {
            throw new Error("Invalid");
        }

        return {
            success: true,
            title,
            artist,
            thumbnail,
            buffer: Buffer.from(bufferResponse.data),
            fileName: `${title} - ${artist}.mp3`
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { spotifyDownloader };
