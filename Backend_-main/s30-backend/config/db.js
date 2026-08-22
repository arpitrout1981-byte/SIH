const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes("your_mongodb_atlas_connection_string_here")) {
    console.warn(
      "\n[WARNING] No real MONGO_URI found in .env — the server will still start,\n" +
      "but any route that touches the database will fail until you add your\n" +
      "MongoDB Atlas connection string to .env. See .env.example for the format.\n"
    );
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("[OK] Connected to MongoDB Atlas");
  } catch (err) {
    console.error("[ERROR] MongoDB connection failed:", err.message);
    console.error("Double-check: is your IP whitelisted in Atlas Network Access, and is the password correct?");
  }
}

module.exports = connectDB;
