require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Health check - visit this in your browser to confirm the server is alive
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "S30 backend is running" });
});

async function start() {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Try it: http://localhost:${PORT}/health`);
  });
}

start();
