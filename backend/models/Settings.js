import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  darkMode: { type: Boolean, default: true },
  accentColor: { type: String, default: '#6366F1' },
  fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
  notificationsEnabled: { type: Boolean, default: true },
  language: { type: String, default: 'en' }
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
