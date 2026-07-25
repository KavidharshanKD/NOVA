import PlanetProgress from '../models/PlanetProgress.js';
import Goal from '../models/Goal.js';
import Mission from '../models/Mission.js';
import Recommendation from '../models/Recommendation.js';
import User from '../models/User.js';
import { dbHelper } from '../services/dbHelper.js';

// Configuration details for all 9 planets
const PLANET_METADATA = {
  learning: {
    icon: 'BookOpen',
    color: '#6366F1',
    description: 'Expanding intellectual horizons, studying technical frameworks, and mastering skills.',
    quote: '“Live as if you were to die tomorrow. Learn as if you were to live forever.” — Mahatma Gandhi'
  },
  career: {
    icon: 'Briefcase',
    color: '#8B5CF6',
    description: 'Securing job applications, updating LinkedIn parameters, and building software portfolio structures.',
    quote: '“Choose a job you love, and you will never have to work a day in your life.” — Confucius'
  },
  health: {
    icon: 'HeartPulse',
    color: '#22C55E',
    description: 'Nurturing the physical vessel through wholesome nutrition, tracking vitals, and monitoring calories.',
    quote: '“It is health that is real wealth and not pieces of gold and silver.” — Mahatma Gandhi'
  },
  projects: {
    icon: 'Rocket',
    color: '#F59E0B',
    description: 'Launching creative code libraries, writing utility scripts, and deploying portfolio apps.',
    quote: '“The way to get started is to quit talking and begin doing.” — Walt Disney'
  },
  finance: {
    icon: 'Coins',
    color: '#3B82F6',
    description: 'Managing monthly savings, budgeting expenditures, and mapping investment portfolios.',
    quote: '“An investment in knowledge pays the best interest.” — Benjamin Franklin'
  },
  relationships: {
    icon: 'Users',
    color: '#EC4899',
    description: 'Fostering social connection loops, coordinating gatherings, and calling family.',
    quote: '“No road is long with good company.” — Turkish Proverb'
  },
  mindfulness: {
    icon: 'Compass',
    color: '#14B8A6',
    description: 'Attaining calm index values through breath meditation, journaling, and device detoxes.',
    quote: '“Quiet the mind and the soul will speak.” — Buddha'
  },
  fitness: {
    icon: 'Zap',
    color: '#EF4444',
    description: 'Developing cardiovascular performance, weight lifts, and executing active steps target limits.',
    quote: '“Strength does not come from physical capacity. It comes from an indomitable will.” — Mahatma Gandhi'
  },
  creativity: {
    icon: 'Sparkles',
    color: '#F43F5E',
    description: 'Drafting designs, coding aesthetic templates, sketching interface prototypes, or writing.',
    quote: '“Creativity is intelligence having fun.” — Albert Einstein'
  }
};

export const getPlanets = async (req, res) => {
  const userId = req.user.id;

  try {
    const progresses = await dbHelper.find(PlanetProgress, { userId });
    
    // Combine progress with static metadata
    const planetList = progresses.map(p => {
      const key = p.planetName.toLowerCase();
      const meta = PLANET_METADATA[key] || { icon: 'Orbit', color: '#6366F1', description: '', quote: '' };
      return {
        id: p._id,
        planetName: p.planetName,
        progress: p.progress,
        level: p.level,
        unlocked: p.unlocked,
        ...meta
      };
    });

    res.json(planetList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orbital planet coordinates.' });
  }
};

export const getPlanetDetails = async (req, res) => {
  const userId = req.user.id;
  const { name } = req.params;
  const key = name.toLowerCase();

  const meta = PLANET_METADATA[key];
  if (!meta) {
    return res.status(404).json({ error: 'Planet coordinate not mapped.' });
  }

  try {
    // 1. Get Progress
    const progresses = await dbHelper.find(PlanetProgress, { userId, planetName: { $in: [name, name.charAt(0).toUpperCase() + name.slice(1)] } });
    const progressDoc = progresses[0] || { progress: 0, level: 1, unlocked: true };

    // 2. Get Goals for this planet
    const goals = await dbHelper.find(Goal, { userId, planet: name });

    // 3. Get Missions for this planet
    const missions = await dbHelper.find(Mission, { userId, planet: name });

    // 4. Load AI recommendations to yield insights
    const recommendations = await dbHelper.find(Recommendation, { userId });
    const userRec = recommendations[0];

    // Generate dynamic AI Insights based on user profile and productivity metrics
    const user = await dbHelper.findById(User, userId);
    let aiInsight = `AI Analysis: The ${name} quadrant is currently operational. Complete pending directives to increase orbit status.`;
    
    if (userRec && userRec.recommendedPlanet.toLowerCase() === key) {
      aiInsight = `AI recommendation: This sector is your primary target. The ML recommendation engine predicts that focusing on ${name} will yield maximum progress matching your primary goal of "${user.primaryGoal}". Complete your daily habits: ${userRec.recommendedHabits.join(', ')}.`;
    } else if (progressDoc.progress >= 80) {
      aiInsight = `AI analysis: Excellent work! You have achieved high proficiency in this sector. Consider locking down remaining checklist items to master this planet completely.`;
    } else if (progressDoc.progress === 0) {
      aiInsight = `AI alert: Sector is currently dormant. Initiate at least one target goal checklist items to boot the planetary orbit tracker.`;
    }

    res.json({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      progress: progressDoc.progress,
      level: progressDoc.level,
      unlocked: progressDoc.unlocked,
      icon: meta.icon,
      color: meta.color,
      description: meta.description,
      quote: meta.quote,
      goals: goals,
      tasks: missions.map(m => ({ id: m._id || m.id, text: m.title, completed: m.completed })),
      aiInsights: aiInsight,
      weeklyReport: {
        completedMissions: missions.filter(m => m.completed).length,
        totalMissions: missions.length,
        efficiencyRate: missions.length > 0 ? Math.round((missions.filter(m => m.completed).length / missions.length) * 100) : 0
      }
    });

  } catch (error) {
    console.error("Get planet details error:", error);
    res.status(500).json({ error: 'Failed to retrieve detailed planet coordinate files.' });
  }
};
