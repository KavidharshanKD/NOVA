import mongoose from 'mongoose';

const planetProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planetName: { type: String, required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  level: { type: Number, default: 1 },
  unlocked: { type: Boolean, default: true }
});

planetProgressSchema.index({ userId: 1, planetName: 1 }, { unique: true });

const PlanetProgress = mongoose.model('PlanetProgress', planetProgressSchema);
export default PlanetProgress;
