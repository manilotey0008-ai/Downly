// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ytdl = require("ytdl-core");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "/")));

// API route for download
app.post("/api/download", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ status: "error", message: "No URL provided" });
  }

  try {
    // validate YouTube URL
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
