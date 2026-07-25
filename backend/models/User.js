import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  ageGroup: { type: String, required: true },
  education: { type: String, required: true },
  occupation: { type: String, required: true },
  country: { type: String, required: true },
  dailyFreeTime: { type: String, required: true },
  primaryGoal: { type: String, required: true },
  learningStyle: { type: String, required: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  coins: { type: Number, default: 10 },
  title: { type: String, default: 'Explorer' },
  joinedDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
