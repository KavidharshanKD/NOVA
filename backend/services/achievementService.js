import Achievement from '../models/Achievement.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import PlanetProgress from '../models/PlanetProgress.js';
import { dbHelper } from './dbHelper.js';

// Predefined list of achievements (50 items)
export const ALL_ACHIEVEMENTS = [
  // Authentication & General
  { id: 'first_login', title: 'First Login', description: 'Boot up the Nova terminal for the first time.' },
  { id: 'profile_setup', title: 'Callsign Set', description: 'Configure custom username avatar details.' },
  { id: 'streak_3', title: '3-Day Orbit', description: 'Maintain active sector logs for 3 consecutive days.' },
  { id: 'streak_7', title: '7-Day Streak', description: 'Maintain active sector logs for 7 consecutive days.' },
  { id: 'streak_15', title: 'Fortnight Orbit', description: 'Active quadrant checks for 15 consecutive days.' },
  { id: 'streak_30', title: 'Lunar Cycle', description: 'Log in for 30 consecutive days.' },
  
  // Levels & XP
  { id: 'xp_100', title: '100 XP Accumulator', description: 'Reach 100 total XP points.' },
  { id: 'xp_500', title: '500 XP Vanguard', description: 'Reach 500 total XP points.' },
  { id: 'xp_1000', title: 'Millennial XP Elite', description: 'Accumulate 1000 total XP points.' },
  { id: 'xp_5000', title: 'Cosmic Legend', description: 'Accumulate 5000 total XP points.' },
  { id: 'level_3', title: 'Strategist Rank', description: 'Reach level 3.' },
  { id: 'level_5', title: 'Achiever Rank', description: 'Reach level 5.' },
  { id: 'level_8', title: 'Visionary Rank', description: 'Reach level 8.' },
  { id: 'level_12', title: 'Universe Master', description: 'Reach level 12.' },
  { id: 'level_20', title: 'Supernova Entity', description: 'Reach level 20.' },

  // Mission Counts
  { id: 'missions_1', title: 'First Directive Checked', description: 'Complete 1 daily mission.' },
  { id: 'missions_5', title: 'Squad Commander', description: 'Complete 5 daily missions.' },
  { id: 'missions_10', title: 'Sector Inspector', description: 'Complete 10 daily missions.' },
  { id: 'missions_25', title: 'Centurion Scout', description: 'Complete 25 daily missions.' },
  { id: 'missions_50', title: 'Galaxy Guard', description: 'Complete 50 daily missions.' },
  { id: 'missions_100', title: 'Directive Master', description: 'Complete 100 daily missions.' },
  { id: 'missions_important', title: 'Priority Master', description: 'Complete 5 marked important missions.' },

  // Planets Mastery (Progress = 100)
  { id: 'planet_learning_100', title: 'Learning Expert', description: 'Master the Learning Planet (100% progress).' },
  { id: 'planet_career_100', title: 'Career Builder', description: 'Master the Career Planet (100% progress).' },
  { id: 'planet_health_100', title: 'Health Hero', description: 'Master the Health Planet (100% progress).' },
  { id: 'planet_projects_100', title: 'Project Creator', description: 'Master the Projects Planet (100% progress).' },
  { id: 'planet_finance_100', title: 'Wealth Sentinel', description: 'Master the Finance Planet (100% progress).' },
  { id: 'planet_relationships_100', title: 'Social Architect', description: 'Master the Relationships Planet (100% progress).' },
  { id: 'planet_mindfulness_100', title: 'Zen Voyager', description: 'Master the Mindfulness Planet (100% progress).' },
  { id: 'planet_fitness_100', title: 'Fitness Hero', description: 'Master the Fitness Planet (100% progress).' },
  { id: 'planet_creativity_100', title: 'Aura Creator', description: 'Master the Creativity Planet (100% progress).' },

  // Achievements Count
  { id: 'achieve_5', title: 'Decorated Officer', description: 'Unlock 5 different achievements.' },
  { id: 'achieve_10', title: 'Medal of Valor', description: 'Unlock 10 different achievements.' },
  { id: 'achieve_20', title: 'Nova Hero', description: 'Unlock 20 different achievements.' },
  
  // Custom planet discoveries/milestones
  { id: 'planet_learning_50', title: 'Vigorous Student', description: 'Reach 50% progress on Learning Planet.' },
  { id: 'planet_career_50', title: 'Resume Shined', description: 'Reach 50% progress on Career Planet.' },
  { id: 'planet_health_50', title: 'Vessel Hydrated', description: 'Reach 50% progress on Health Planet.' },
  { id: 'planet_projects_50', title: 'Vite Compiler', description: 'Reach 50% progress on Projects Planet.' },
  { id: 'planet_finance_50', title: 'Savings Architect', description: 'Reach 50% progress on Finance Planet.' },
  { id: 'planet_relationships_50', title: 'Active Linker', description: 'Reach 50% progress on Relationships Planet.' },
  { id: 'planet_mindfulness_50', title: 'Deep Breather', description: 'Reach 50% progress on Mindfulness Planet.' },
  { id: 'planet_fitness_50', title: 'Active Runner', description: 'Reach 50% progress on Fitness Planet.' },
  { id: 'planet_creativity_50', title: 'Visual Designer', description: 'Reach 50% progress on Creativity Planet.' },
  
  // Coin milestones
  { id: 'coins_50', title: 'Coin Collector', description: 'Accumulate 50 gold coins.' },
  { id: 'coins_100', title: 'Rich Merchant', description: 'Accumulate 100 gold coins.' },
  { id: 'coins_500', title: 'Treasury Lord', description: 'Accumulate 500 gold coins.' },

  // Goal Milestones
  { id: 'goals_1', title: 'Goal Setter', description: 'Complete your first weekly goal.' },
  { id: 'goals_5', title: 'Target Crusher', description: 'Complete 5 weekly goals.' },
  { id: 'goals_10', title: 'Vision Completer', description: 'Complete 10 weekly goals.' },
  { id: 'universe_master', title: 'Universe Master', description: 'Unlock all achievements and master multiple planets.' }
];

export const checkAndUnlockAchievements = async (userId) => {
  try {
    const user = await dbHelper.findById(User, userId);
    if (!user) return;

    // Fetch unlocked achievements ids
    const unlocked = await dbHelper.find(Achievement, { userId });
    const unlockedIds = unlocked.map(a => a.achievementId);

    const planetProgress = await dbHelper.find(PlanetProgress, { userId });
    const achievementsToUnlock = [];

    // Helper to add
    const add = (id) => {
      if (!unlockedIds.includes(id)) {
        const found = ALL_ACHIEVEMENTS.find(a => a.id === id);
        if (found) achievementsToUnlock.push(found);
      }
    };

    // 1. XP and levels criteria
    if (user.xp >= 100) add('xp_100');
    if (user.xp >= 500) add('xp_500');
    if (user.xp >= 1000) add('xp_1000');
    if (user.xp >= 5000) add('xp_5000');

    if (user.level >= 3) add('level_3');
    if (user.level >= 5) add('level_5');
    if (user.level >= 8) add('level_8');
    if (user.level >= 12) add('level_12');
    if (user.level >= 20) add('level_20');

    // 2. Coins criteria
    if (user.coins >= 50) add('coins_50');
    if (user.coins >= 100) add('coins_100');
    if (user.coins >= 500) add('coins_500');

    // 3. Planet Progress criteria
    for (const p of planetProgress) {
      const name = p.planetName.toLowerCase();
      if (p.progress >= 50) {
        add(`planet_${name}_50`);
      }
      if (p.progress >= 100) {
        add(`planet_${name}_100`);
      }
    }

    // 4. Achievement Count criteria
    const totalCount = unlockedIds.length + achievementsToUnlock.length;
    if (totalCount >= 5) add('achieve_5');
    if (totalCount >= 10) add('achieve_10');
    if (totalCount >= 20) add('achieve_20');

    // Perform DB writes and insert notifications
    for (const item of achievementsToUnlock) {
      await dbHelper.create(Achievement, {
        userId,
        achievementId: item.id,
        title: item.title,
        description: item.description
      });

      // Insert notification
      await dbHelper.create(Notification, {
        userId,
        text: `🏆 Achievement Unlocked: ${item.title}! (+50 XP Reward)`,
        type: 'achievement'
      });

      // Reward XP for achievements
      user.xp += 50;
    }

    // Handle level increments if XP rewarded
    let levelCheck = user.level;
    let xpCheck = user.xp;
    while (xpCheck >= 100) {
      levelCheck += 1;
      xpCheck -= 100;
      await dbHelper.create(Notification, {
        userId,
        text: `🏆 Level Up! Reached Level ${levelCheck}! Title: ${getLevelTitle(levelCheck)}`,
        type: 'achievement'
      });
    }

    if (user.xp !== xpCheck || user.level !== levelCheck) {
      user.xp = xpCheck;
      user.level = levelCheck;
      user.title = getLevelTitle(levelCheck);
      await dbHelper.findByIdAndUpdate(User, userId, {
        xp: user.xp,
        level: user.level,
        title: user.title
      });
    }

  } catch (error) {
    console.error("Error checking achievements:", error.message);
  }
};

export const getLevelTitle = (lvl) => {
  if (lvl >= 12) return 'Master';
  if (lvl >= 8) return 'Visionary';
  if (lvl >= 5) return 'Achiever';
  if (lvl >= 3) return 'Strategist';
  return 'Explorer';
};
