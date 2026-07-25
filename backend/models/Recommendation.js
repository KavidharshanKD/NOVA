import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { type: String, required: true },
  recommendedPlanet: { type: String, required: true },
  recommendedMissions: [{ type: String }],
  dailySchedule: [{ type: String }],
  weeklyGoals: [{ type: String }],
  recommendedXpTarget: { type: Number, required: true },
  recommendedHabits: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
