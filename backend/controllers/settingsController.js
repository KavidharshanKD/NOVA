import Settings from '../models/Settings.js';
import { dbHelper } from '../services/dbHelper.js';

export const getSettings = async (req, res) => {
  const userId = req.user.id;
  try {
    let settings = await dbHelper.findOne(Settings, { userId });
    if (!settings) {
      settings = await dbHelper.create(Settings, {
        userId,
        darkMode: true,
        accentColor: '#6366F1',
        fontSize: 'medium',
        notificationsEnabled: true,
        language: 'en'
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve settings.' });
  }
};

export const updateSettings = async (req, res) => {
  const userId = req.user.id;
  const { darkMode, accentColor, fontSize, notificationsEnabled, language } = req.body;

  try {
    let settings = await dbHelper.findOne(Settings, { userId });
    if (!settings) {
      settings = await dbHelper.create(Settings, {
        userId,
        darkMode: darkMode !== undefined ? darkMode : true,
        accentColor: accentColor || '#6366F1',
        fontSize: fontSize || 'medium',
        notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : true,
        language: language || 'en'
      });
      return res.json(settings);
    }

    const updated = await dbHelper.findByIdAndUpdate(Settings, settings._id, {
      darkMode: darkMode !== undefined ? darkMode : settings.darkMode,
      accentColor: accentColor || settings.accentColor,
      fontSize: fontSize || settings.fontSize,
      notificationsEnabled: notificationsEnabled !== undefined ? notificationsEnabled : settings.notificationsEnabled,
      language: language || settings.language
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences.' });
  }
};
