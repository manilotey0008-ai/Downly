// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow GitHub Pages domain
app.use(cors({
  origin: ["https://manilotey0008-ai.github.io", "http://localhost:5000"],
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"]
}));
app.use(bodyParser.json());

// Health check
app.get("/health", (req, res) => res.send("OK"));

// API route
app.post("/api/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ status: "error", message: "No URL provided" });

  try {
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ status: "error", message: "Invalid YouTube URL" });
    }
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, "audioandvideo");
    const qualities = formats.map(f => ({
      label: `${f.qualityLabel || "Audio"} (${f.container})`,
      url: f.url
    }));
    res.json({ status: "ready", qualities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
