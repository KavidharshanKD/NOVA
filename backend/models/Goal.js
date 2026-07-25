import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  planet: { type: String, required: true },
  targetDate: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
});

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
