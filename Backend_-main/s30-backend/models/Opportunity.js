const mongoose = require("mongoose");

const requiredSkillSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    weight: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["internship", "hackathon_team"], required: true },
    required_skills: [requiredSkillSchema],
    description: { type: String },
    posted_by: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);
