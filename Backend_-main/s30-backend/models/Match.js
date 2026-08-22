const mongoose = require("mongoose");

const matchedEvidenceSchema = new mongoose.Schema(
  {
    credential_id: { type: mongoose.Schema.Types.ObjectId, ref: "Credential" },
    skill: { type: String },
    contribution: { type: Number },
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  opportunity_id: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity", required: true },
  score: { type: Number, required: true },
  matched_evidence: [matchedEvidenceSchema],
  explanation_text: { type: String },
  missing_skills: [{ type: String }],
  computed_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Match", matchSchema);
