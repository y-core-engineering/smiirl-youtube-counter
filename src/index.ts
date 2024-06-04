import dotenv from "dotenv";
import express from "express";

dotenv.config();

const PORT = process.env.PORT || 3000;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || undefined;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || undefined;

if (!YOUTUBE_CHANNEL_ID || !YOUTUBE_API_KEY) {
  throw new Error("YOUTUBE_CHANNEL_ID and YOUTUBE_API_KEY are required.");
}

// create express app
const app = express();

// add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add routes
app.get("/", async (req, res) => {
  const stats: ChannelStatistics = await loadChannel();
  res.json(stats);
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

type ChannelStatistics = {
  viewCount: number;
  subscriberCount: number;
  videoCount: number;
};
async function loadChannel(): Promise<ChannelStatistics> {
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const stats = data.items[0].statistics;
        resolve({
          viewCount: parseInt(stats.viewCount),
          subscriberCount: parseInt(stats.subscriberCount),
          videoCount: parseInt(stats.videoCount),
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}
