import Achievement from '../models/Achievement.js';
import { dbHelper } from '../services/dbHelper.js';
import { ALL_ACHIEVEMENTS, checkAndUnlockAchievements } from '../services/achievementService.js';

export const getAchievements = async (req, res) => {
  const userId = req.user.id;

  try {
    // Perform verification scan to unlock achievements
    await checkAndUnlockAchievements(userId);

    // Fetch user unlocked achievements
    const unlocked = await dbHelper.find(Achievement, { userId });
    const unlockedIds = unlocked.map(a => a.achievementId);

    // Map all achievements indicating locked/unlocked state
    const result = ALL_ACHIEVEMENTS.map(ach => {
      const isUnlocked = unlockedIds.includes(ach.id);
      const userUnlockInfo = unlocked.find(a => a.achievementId === ach.id);
      return {
        id: ach.id,
        title: ach.title,
        description: ach.description,
        isLocked: !isUnlocked,
        unlockedAt: isUnlocked && userUnlockInfo ? userUnlockInfo.unlockedAt : null
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve achievements.' });
  }
};
