import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
import PlanetProgress from '../models/PlanetProgress.js';
import Notification from '../models/Notification.js';
import Achievement from '../models/Achievement.js';
import Recommendation from '../models/Recommendation.js';
import Mission from '../models/Mission.js';
import Goal from '../models/Goal.js';
import { dbHelper } from '../services/dbHelper.js';

dotenv.config();

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Seed 9 planets progress
const seedPlanets = async (userId) => {
  const planets = [
    'Learning', 'Career', 'Health', 'Projects', 
    'Finance', 'Relationships', 'Mindfulness', 'Fitness', 'Creativity'
  ];
  for (const planet of planets) {
    await dbHelper.create(PlanetProgress, {
      userId,
      planetName: planet,
      progress: planet === 'Learning' ? 20 : 0, // start Learning with a small progress
      level: 1,
      unlocked: true
    });
  }
};

// Seed initial achievements
const seedInitialAchievements = async (userId) => {
  await dbHelper.create(Achievement, {
    userId,
    achievementId: 'first_login',
    title: 'First Login',
    description: 'Establish secure communications and initiate Nova dashboard boot sequences.'
  });
};

// Call ML API and seed initial recommendation and missions
const generateMLRecommendations = async (userDoc) => {
  try {
    const flaskUrl = `${process.env.FLASK_API_URL}/predict`;
    const payload = {
      Age_Group: userDoc.ageGroup,
      Occupation: userDoc.occupation,
      Education: userDoc.education,
      Daily_Free_Time: userDoc.dailyFreeTime,
      Learning_Style: userDoc.learningStyle,
      Primary_Goal: userDoc.primaryGoal,
      Current_Productivity: 5,
      Stress_Level: 5,
      Focus_Level: 5,
      Skill_Level: 5,
      Planet_Focus: 'Learning' // default
    };

    console.log("Seeding recommendations from Flask ML API:", flaskUrl, payload);
    const response = await fetch(flaskUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Store recommendation
      await dbHelper.create(Recommendation, {
        userId: userDoc._id,
        planName: data.planName,
        recommendedPlanet: data.recommendedPlanet,
        recommendedMissions: data.recommendedMissions,
        dailySchedule: data.dailySchedule,
        weeklyGoals: data.weeklyGoals,
        recommendedXpTarget: data.recommendedXp,
        recommendedHabits: data.recommendedHabits
      });

      // Seed Recommended Missions
      for (const mName of data.recommendedMissions) {
        await dbHelper.create(Mission, {
          userId: userDoc._id,
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

      // Seed initial Goal
      if (data.weeklyGoals && data.weeklyGoals.length > 0) {
        await dbHelper.create(Goal, {
          userId: userDoc._id,
          title: data.weeklyGoals[0],
          planet: data.recommendedPlanet,
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
          completed: false
        });
      }

      return data.recommendedPlanet;
    }
  } catch (error) {
    console.error("Failed to seed ML recommendations on signup:", error.message);
  }
  
  // Fallback if Flask API is unreachable
  const fallbackPlan = 'Ultimate Skill Booster Plan';
  await dbHelper.create(Recommendation, {
    userId: userDoc._id,
    planName: fallbackPlan,
    recommendedPlanet: 'Projects',
    recommendedMissions: ['Define software milestones', 'Test application edge cases'],
    dailySchedule: ['09:00 AM - Launch working backend', '02:00 PM - Code unit test coverages'],
    weeklyGoals: ['Establish active debugging issues tickets'],
    recommendedXpTarget: 100,
    recommendedHabits: ['Write script to automate things']
  });

  // Seed default Missions
  await dbHelper.create(Mission, {
    userId: userDoc._id,
    title: 'Explore Nova Dashboard Quadrants',
    difficulty: 'Easy',
    xpReward: 20,
    coinsReward: 5,
    planet: 'Projects',
    completed: false,
    status: 'Pending',
    isImportant: true,
    dueDate: new Date()
  });

  return 'Projects';
};

export const registerUser = async (req, res) => {
  const {
    firstName,
    email,
    password,
    ageGroup,
    education,
    occupation,
    country,
    dailyFreeTime,
    primaryGoal,
    learningStyle
  } = req.body;

  try {
    const userExists = await dbHelper.findOne(User, { email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists with this email address.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await dbHelper.create(User, {
      firstName,
      email,
      passwordHash,
      ageGroup,
      education,
      occupation,
      country,
      dailyFreeTime,
      primaryGoal,
      learningStyle,
      level: 1,
      xp: 0,
      coins: 10,
      title: 'Explorer'
    });

    // Create Settings
    await dbHelper.create(Settings, {
      userId: newUser._id,
      darkMode: true,
      accentColor: '#6366F1',
      fontSize: 'medium',
      notificationsEnabled: true,
      language: 'en'
    });

    // Seed planets list
    await seedPlanets(newUser._id);

    // Seed achievements
    await seedInitialAchievements(newUser._id);

    // Seed ML recommendations
    const suggestedPlanet = await generateMLRecommendations(newUser);

    // Create initial Notification
    await dbHelper.create(Notification, {
      userId: newUser._id,
      text: `🚀 Orbit established around Suggested Planet: ${suggestedPlanet}! Initial daily directives loaded.`,
      type: 'info'
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      email: newUser.email,
      level: newUser.level,
      xp: newUser.xp,
      coins: newUser.coins,
      title: newUser.title,
      token
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: 'Server registration error.' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await dbHelper.findOne(User, { email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Trigger Notification for connection establishment
    await dbHelper.create(Notification, {
      userId: user._id,
      text: `🔐 Connection established. Welcome back, Commander ${user.firstName}!`,
      type: 'success'
    });

    res.json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      level: user.level,
      xp: user.xp,
      coins: user.coins,
      title: user.title,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Server authentication error.' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await dbHelper.findOne(User, { email });
    if (!user) {
      return res.status(404).json({ error: 'No user registered with this email address.' });
    }
    // Return dummy verification recovery link
    res.json({ message: `Password reset cryptokey dispatched to ${email}. Check security logs.` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process recovery key.' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await dbHelper.findOne(User, { email });
    if (!user) {
      return res.status(404).json({ error: 'No user found.' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await dbHelper.findByIdAndUpdate(User, user._id, { passwordHash });
    res.json({ message: 'Authorization cryptokey updated successfully. Re-verify link.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset cryptokey.' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await dbHelper.findById(User, req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    res.json({
      firstName: user.firstName,
      email: user.email,
      ageGroup: user.ageGroup,
      education: user.education,
      occupation: user.occupation,
      country: user.country,
      dailyFreeTime: user.dailyFreeTime,
      primaryGoal: user.primaryGoal,
      learningStyle: user.learningStyle,
      level: user.level,
      xp: user.xp,
      coins: user.coins,
      title: user.title,
      joinedDate: user.joinedDate
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile details.' });
  }
};

export const updateProfile = async (req, res) => {
  const {
    firstName,
    ageGroup,
    education,
    occupation,
    country,
    dailyFreeTime,
    primaryGoal,
    learningStyle
  } = req.body;

  try {
    const updated = await dbHelper.findByIdAndUpdate(User, req.user.id, {
      firstName,
      ageGroup,
      education,
      occupation,
      country,
      dailyFreeTime,
      primaryGoal,
      learningStyle
    });

    if (!updated) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    // Automatically recheck and regenerate recommendations if primary goal or occupation changes
    await generateMLRecommendations(updated);

    res.json({
      firstName: updated.firstName,
      email: updated.email,
      ageGroup: updated.ageGroup,
      education: updated.education,
      occupation: updated.occupation,
      country: updated.country,
      dailyFreeTime: updated.dailyFreeTime,
      primaryGoal: updated.primaryGoal,
      learningStyle: updated.learningStyle,
      level: updated.level,
      xp: updated.xp,
      coins: updated.coins,
      title: updated.title,
      joinedDate: updated.joinedDate
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: 'Failed to update profile details.' });
  }
};

