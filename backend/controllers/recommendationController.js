import Recommendation from '../models/Recommendation.js';
import User from '../models/User.js';
import Mission from '../models/Mission.js';
import Goal from '../models/Goal.js';
import Notification from '../models/Notification.js';
import { dbHelper } from '../services/dbHelper.js';

export const getRecommendation = async (req, res) => {
  const userId = req.user.id;
  try {
    const recs = await dbHelper.find(Recommendation, { userId });
    // Return the latest recommendation
    if (recs.length === 0) {
      return res.status(404).json({ error: 'No recommendation index found for user.' });
    }
    // Sort recommendations descending by date
    recs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(recs[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve recommendation logs.' });
  }
};

export const updateRecommendation = async (req, res) => {
  const userId = req.user.id;
  const { stressLevel, focusLevel, productivityLevel, skillLevel, planetFocus } = req.body;

  try {
    const user = await dbHelper.findById(User, userId);
    if (!user) {
      return res.status(404).json({ error: 'User profiles files not found.' });
    }

    // Call ML Flask API
    const flaskUrl = `${process.env.FLASK_API_URL}/predict`;
    const payload = {
      Age_Group: user.ageGroup,
      Occupation: user.occupation,
      Education: user.education,
      Daily_Free_Time: user.dailyFreeTime,
      Learning_Style: user.learningStyle,
      Primary_Goal: user.primaryGoal,
      Current_Productivity: productivityLevel || 6,
      Stress_Level: stressLevel || 5,
      Focus_Level: focusLevel || 6,
      Skill_Level: skillLevel || 5,
      Planet_Focus: planetFocus || 'Learning'
    };

    console.log("Requesting recommendation updates from Flask ML API:", flaskUrl, payload);
    const response = await fetch(flaskUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Flask API returned error state ${response.status}`);
    }

    const data = await response.json();

    // Store new recommendation
    const newRec = await dbHelper.create(Recommendation, {
      userId,
      planName: data.planName,
      recommendedPlanet: data.recommendedPlanet,
      recommendedMissions: data.recommendedMissions,
      dailySchedule: data.dailySchedule,
      weeklyGoals: data.weeklyGoals,
      recommendedXpTarget: data.recommendedXp,
      recommendedHabits: data.recommendedHabits
    });

    // Remove old pending missions and seed new ones
    const oldMissions = await dbHelper.find(Mission, { userId, completed: false });
    for (const m of oldMissions) {
      await dbHelper.deleteOne(Mission, { _id: m._id || m.id });
    }

    // Seed new missions
    for (const mName of data.recommendedMissions) {
      await dbHelper.create(Mission, {
        userId,
        title: mName,
        difficulty: 'Medium',
        xpReward: 35,
        coinsReward: 10,
        planet: data.recommendedPlanet,
        completed: false,
        status: 'Pending',
        isImportant: false,
        dueDate: new Date()
      });
    }

    // Add Goal
    if (data.weeklyGoals && data.weeklyGoals.length > 0) {
      await dbHelper.create(Goal, {
        userId,
        title: data.weeklyGoals[0],
        planet: data.recommendedPlanet,
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        completed: false
      });
    }

    // Trigger Notification
    await dbHelper.create(Notification, {
      userId,
      text: `🛸 ML Recommendation Engine updated! Suggested Planet: ${data.recommendedPlanet}. Active plan: ${data.planName}.`,
      type: 'info'
    });

    res.json(newRec);

  } catch (error) {
    console.error("ML recommendation update failed:", error.message);
    res.status(500).json({ error: 'ML API update routing failed. Using default guidelines.' });
  }
};
