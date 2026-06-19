// Xeno Exe



const express = require('express');
const { spotifyDownloader } = require('./scraper');

const app = express();
app.set('json spaces', 2);
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
    blue: "\x1b[34m"
};

app.use(express.json());
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${colors.reset}[${colors.blue}${timestamp}${colors.reset}] ${colors.yellow}${req.method}${colors.reset} ${req.url}`);
    next();
});



app.get('/', (req, res) => {
    res.json({
        status: true,
        message: "Xeno Spotify",
        creator: "XENO SIR",
        endpoints: {
            spotify: "/api/spotify?url=[URL]"
        }
    });
});


app.get('/api/spotify', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "url need" });

    console.log(`${colors.cyan}✨ Processing Spotify: ${colors.reset}${url}`);

    const result = await spotifyDownloader(url);
    if (!result.success) {
        console.log(`${colors.red}Error: ${colors.reset}${result.error}`);
        return res.status(500).json({ status: false, message: result.error });
    }

    console.log(`${colors.green}Success: ${colors.reset}${result.title}`);


    res.json({
        status: true,
        code: 200,
        creator: "Xeno Exe",
        result_url: `/api/spotify/download?url=${encodeURIComponent(url)}`,
        metadata: {
            name: result.title,
            artist: result.artist,
            thumbnail: result.thumbnail
        }
    });
});

app.get('/api/spotify/download', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send("URL required.");

    const result = await spotifyDownloader(url);
    if (!result.success) return res.status(500).send(result.error);

    res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(result.buffer);
});


if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.clear();
        console.log(`${colors.magenta}${colors.bright}
  ██╗  ██╗███████╗███╗   ██╗ ██████╗ 
  ╚██╗██╔╝██╔════╝████╗  ██║██╔═══██╗
   ╚███╔╝ █████╗  ██╔██╗ ██║██║   ██║
   ██╔██╗ ██╔══╝  ██║╚██╗██║██║   ██║
  ██╔╝ ██╗███████╗██║ ╚████║╚██████╔╝
  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝ 
  ${colors.cyan}Xeno Spotify Downloader ${colors.yellow}v1.2.0
  ${colors.green}Developed by: ${colors.bright}XENO SIR
  ${colors.reset}
  ${colors.green}🚀 Server is live at: ${colors.reset}${colors.bright}http://localhost:${PORT}${colors.reset}
  ${colors.blue}Press Ctrl+C to stop.${colors.reset}
        `);
    });
}

module.exports = app;
