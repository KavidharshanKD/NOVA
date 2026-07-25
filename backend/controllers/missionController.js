import Mission from '../models/Mission.js';
import User from '../models/User.js';
import PlanetProgress from '../models/PlanetProgress.js';
import Notification from '../models/Notification.js';
import { dbHelper } from '../services/dbHelper.js';
import { checkAndUnlockAchievements, getLevelTitle } from '../services/achievementService.js';

export const getMissions = async (req, res) => {
  const userId = req.user.id;
  const { completed, status, difficulty, planet, isImportant } = req.query;

  try {
    const query = { userId };
    
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }
    if (status) {
      query.status = status;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (planet) {
      query.planet = planet;
    }
    if (isImportant !== undefined) {
      query.isImportant = isImportant === 'true';
    }

    const missions = await dbHelper.find(Mission, query);
    res.json(missions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve missions.' });
  }
};

export const createMission = async (req, res) => {
  const userId = req.user.id;
  const { title, difficulty, planet, isImportant, dueDate } = req.body;

  try {
    let xpReward = 30;
    let coinsReward = 5;
    if (difficulty === 'Medium') {
      xpReward = 40;
      coinsReward = 10;
    } else if (difficulty === 'Hard') {
      xpReward = 50;
      coinsReward = 15;
    }

    const newMission = await dbHelper.create(Mission, {
      userId,
      title,
      difficulty: difficulty || 'Medium',
      xpReward,
      coinsReward,
      planet: planet || 'Projects',
      isImportant: isImportant || false,
      completed: false,
      status: 'Pending',
      dueDate: dueDate || new Date()
    });

    res.status(201).json(newMission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to build mission directive.' });
  }
};

export const updateMissionStatus = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { status } = req.body; // 'Completed', 'Skipped', 'Rescheduled', 'Pending'

  try {
    const mission = await dbHelper.findById(Mission, id);
    if (!mission || mission.userId.toString() !== userId) {
      return res.status(404).json({ error: 'Mission directive not found.' });
    }

    const oldStatus = mission.status;
    if (oldStatus === status) {
      return res.json(mission);
    }

    const updatedCompleted = status === 'Completed';
    
    // XP / Coins modification variables
    let xpDiff = 0;
    let coinsDiff = 0;
    
    if (status === 'Completed' && oldStatus !== 'Completed') {
      xpDiff = mission.xpReward;
      coinsDiff = mission.coinsReward;
    } else if (oldStatus === 'Completed' && status !== 'Completed') {
      xpDiff = -mission.xpReward;
      coinsDiff = -mission.coinsReward;
    }

    // Update mission status
    const updatedMission = await dbHelper.findByIdAndUpdate(Mission, id, {
      status,
      completed: updatedCompleted
    });

    // Update user XP & Level & Coins
    const user = await dbHelper.findById(User, userId);
    if (user && (xpDiff !== 0 || coinsDiff !== 0)) {
      let newXp = user.xp + xpDiff;
      let newLevel = user.level;
      let coins = (user.coins || 0) + coinsDiff;
      if (coins < 0) coins = 0;

      // Handle level up
      if (newXp >= 100) {
        newLevel += 1;
        newXp -= 100;
        
        await dbHelper.create(Notification, {
          userId,
          text: `🏆 Level Up! Reached Level ${newLevel}! Title: ${getLevelTitle(newLevel)}`,
          type: 'achievement'
        });
      } else if (newXp < 0) {
        if (newLevel > 1) {
          newLevel -= 1;
          newXp += 100;
        } else {
          newXp = 0;
        }
      }

      await dbHelper.findByIdAndUpdate(User, userId, {
        xp: newXp,
        level: newLevel,
        coins,
        title: getLevelTitle(newLevel)
      });

      // Update Planet Progress
      const progressList = await dbHelper.find(PlanetProgress, { userId, planetName: mission.planet });
      if (progressList.length > 0) {
        const currentProgressDoc = progressList[0];
        let progressChange = 0;
        if (status === 'Completed' && oldStatus !== 'Completed') {
          progressChange = 15;
        } else if (oldStatus === 'Completed' && status !== 'Completed') {
          progressChange = -15;
        }

        let newProgress = (currentProgressDoc.progress || 0) + progressChange;
        if (newProgress > 100) newProgress = 100;
        if (newProgress < 0) newProgress = 0;

        await dbHelper.findByIdAndUpdate(PlanetProgress, currentProgressDoc._id, {
          progress: newProgress
        });

        // Trigger Notification for completing planet
        if (newProgress === 100 && currentProgressDoc.progress < 100) {
          await dbHelper.create(Notification, {
            userId,
            text: `🪐 Planet Completed: You have mastered the ${mission.planet} Planet!`,
            type: 'success'
          });
        }
      }

      // Add corresponding log notification
      if (status === 'Completed') {
        await dbHelper.create(Notification, {
          userId,
          text: `✓ Completed: ${mission.title} (+${mission.xpReward} XP)`,
          type: 'success'
        });
      } else if (status === 'Skipped') {
        await dbHelper.create(Notification, {
          userId,
          text: `⎋ Skipped mission: ${mission.title}.`,
          type: 'warning'
        });
      } else if (status === 'Rescheduled') {
        await dbHelper.create(Notification, {
          userId,
          text: `📅 Rescheduled mission: ${mission.title}.`,
          type: 'info'
        });
      } else if (oldStatus === 'Completed' && status === 'Pending') {
        await dbHelper.create(Notification, {
          userId,
          text: `⎋ Reverted mission: ${mission.title} (-${mission.xpReward} XP)`,
          type: 'warning'
        });
      }

      // Recheck achievements
      await checkAndUnlockAchievements(userId);
    }

    res.json(updatedMission);
  } catch (error) {
    console.error("Update mission error:", error);
    res.status(500).json({ error: 'Failed to update mission.' });
  }
};

export const toggleMissionImportant = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const mission = await dbHelper.findById(Mission, id);
    if (!mission || mission.userId.toString() !== userId) {
      return res.status(404).json({ error: 'Mission directive not found.' });
    }

    const updated = await dbHelper.findByIdAndUpdate(Mission, id, {
      isImportant: !mission.isImportant
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle importance status.' });
  }
};

export const deleteMission = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const mission = await dbHelper.findById(Mission, id);
    if (!mission || mission.userId.toString() !== userId) {
      return res.status(404).json({ error: 'Mission not found.' });
    }

    await dbHelper.deleteOne(Mission, { _id: id });
    res.json({ message: 'Mission deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete mission.' });
  }
};
