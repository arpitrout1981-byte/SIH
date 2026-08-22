const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  type: {
    type: String,
    enum: ["coursework", "project", "hackathon", "certification"],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  skills_tagged: [{ type: String }],
  // We'll fill skill_embeddings in Step 3 (the AI layer) - leave it empty for now
  skill_embeddings: [[Number]],
  evidence_url: { type: String },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  verified_by: { type: String },
  verified_at: { type: Date },
});

module.exports = mongoose.model("Credential", credentialSchema);
