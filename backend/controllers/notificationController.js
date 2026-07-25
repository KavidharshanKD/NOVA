import Notification from '../models/Notification.js';
import { dbHelper } from '../services/dbHelper.js';

export const getNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    const notifications = await dbHelper.find(Notification, { userId });
    // Sort notifications by date descending
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve notification logs.' });
  }
};

export const markNotificationsRead = async (req, res) => {
  const userId = req.user.id;
  try {
    const notifications = await dbHelper.find(Notification, { userId, read: false });
    for (const notif of notifications) {
      await dbHelper.findByIdAndUpdate(Notification, notif._id, { read: true });
    }
    res.json({ message: 'Notifications marked read.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification states.' });
  }
};

export const deleteNotification = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const notif = await dbHelper.findById(Notification, id);
    if (!notif || notif.userId.toString() !== userId) {
      return res.status(404).json({ error: 'Notification log not found.' });
    }
    await dbHelper.deleteOne(Notification, { _id: id });
    res.json({ message: 'Notification log removed.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove notification.' });
  }
};
