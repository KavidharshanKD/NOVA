import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  xpReward: { type: Number, required: true },
  coinsReward: { type: Number, default: 5 },
  planet: { type: String, required: true },
  completed: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Completed', 'Skipped', 'Rescheduled'], default: 'Pending' },
  isImportant: { type: Boolean, default: false },
  dueDate: { type: Date, default: Date.now }
});

const Mission = mongoose.model('Mission', missionSchema);
export default Mission;
