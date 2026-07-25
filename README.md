# Nova – Personal Universe Dashboard
> **"Your AI Powered Personal Life Operating System"**

Nova maps your daily goals, learning tracks, mindfulness states, and creative projects as orbital coordinates in a beautifully styled, responsive virtual universe. By combining a **Machine Learning Recommendation Engine** (Random Forest Classifier) and a secure **Node.js Express / MongoDB REST API**, Nova delivers custom daily quests, achievements checklists, and interactive analytics panels.

---

## 🚀 Key Features

- **Personalized Cosmos Dashboard**: Dynamically renders 9 active planetary coordinates representing key lifecycle sectors (Learning, Career, Projects, Finance, Health, Relationships, Mindfulness, Fitness, Creativity).
- **ML AI Recommendations Engine**: Evaluates your user profile characteristics (Focus levels, free time, learning style, and primary goal) to predict and seed personalized daily hour schedules, recommended habits, and XP targets.
- **Quest Timelines (Missions)**: Interactive checklist panel to complete, skip, reschedule, and filter daily tasks. Includes automated Level & XP calculations on checkbox toggles.
- **Interactive Analytics Panels**: Multi-dimensional charts rendering XP Growth Curves, Completion Ratios, and Orbital quadrant balances via Recharts.
- **Cosmic Badges scan (Achievements)**: Keeps tabs on 50+ unlockable achievement tokens stored inside the database.
- **Resilient Mock DB Fallback**: Starts and persists data locally inside JSON files (`backend/backend/data/*.json`) if a native MongoDB database server is unreachable, ensuring out-of-the-box readiness.
- **Production-grade client code**: Custom loading suspense indicators, centralized Error Boundary crash shields, and fully optimized production-grade manual code splitting chunks.

---

## 🛠️ Technology Stack

### Frontend
- React 19 + Vite
- React Router DOM v6 (Client Routing)
- Recharts (Area, Bar, Line, Radar analytics)
- Bootstrap 5 + Custom Glassmorphism Theme (Dark/Light Modes)
- Lucide React (Vector Icons)
- Axios (HTTP client API interceptors)
- React Context API (Auth session state)

### Backend Services
- **Express Server**: Port `5001`. Handles MVC schemas, routes, and authorization checks.
- **Flask ML Predictor API**: Port `5000`. Standardized Python script loading serialized Random Forest models.
- **Database**: MongoDB + Mongoose (with local JSON file database fallback logic).
- **Security Check**: JWT (JSON Web Tokens) with custom headers bearer verification, bcrypt password hashing.

---

## 📂 Project Folder Structure

```text
Universe - React project/
├── ml/                      # Machine Learning Recommendation Module
│   ├── dataset/             # Synthetic CSV Dataset (15,000 records)
│   ├── generate_dataset.py  # Dataset Generator Script
│   ├── train.py             # Classifier comparison & training (RF vs DT vs LR)
│   ├── predict.py           # Flask Inference Server (Port 5000)
│   ├── model.pkl            # Serialized RandomForest Model
│   └── encoder.pkl          # Serialized Label Encoders
│
├── backend/                 # Node.js + Express.js REST backend
│   ├── config/              # Database connection configuration
│   ├── controllers/         # MVC Controller API Handlers
│   ├── middleware/          # JWT Route Guards
│   ├── models/              # Mongoose MongoDB Database Schemas
│   ├── routes/              # Express API Routes Mapping
│   ├── services/            # Persistence wrappers with JSON File DB Fallback
│   ├── data/                # Local database fallback files (.json)
│   └── server.js            # Server entry (Port 5001)
│
├── src/                     # React + Vite Frontend (Port 5173)
│   ├── components/          # Reusable UI Elements (Cards, Navs, Panels)
│   ├── contexts/            # Global Auth Context API providers
│   ├── hooks/               # Custom Hooks (useAuth)
│   ├── services/            # Axios API Clients
│   └── pages/               # Views (Dashboard, Analytics, Planets, etc.)
│
├── vercel.json              # Vercel SPA rewrite configurations
└── vite.config.js           # Vite bundle code-splitting settings
```

---

## 💻 Running Locally

### 1. Setup ML API
```bash
# Install Python packages
pip install pandas numpy scikit-learn flask flask-cors joblib

# Generate dataset and train models
python ml/generate_dataset.py
python ml/train.py

# Start predictor endpoint on http://localhost:5000
python ml/predict.py
```

### 2. Setup REST Backend
```bash
# Navigate to backend and install packages
cd backend
npm install

# Start Express on http://localhost:5001
npm start
```

### 3. Setup React Client
```bash
# Install node packages
npm install

# Launch Vite hot-reload server on http://localhost:5173
npm run dev

# Compile optimized chunks
npm run build
```

---

## ☁️ Deployment on Vercel

The React frontend client is fully configured for Vercel deployment with SPA route configurations (`vercel.json`) and optimized manual Rollup chunks.

### Step-by-Step Vercel Deployment

1. **Push your codebase to GitHub**:
   - Initialize git and push your repository:
     ```bash
     git init
     git add .
     git commit -m "feat: production optimized for vercel deployment"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
     git push -u origin main
     ```

2. **Connect to Vercel**:
   - Log in to your [Vercel Dashboard](https://vercel.com).
   - Click **Add New** > **Project**.
   - Import your GitHub repository.

3. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (Root directory of the workspace)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**:
   - Under the **Environment Variables** accordion, add:
     - `VITE_API_URL`: *The URL of your deployed Express backend server* (e.g. `https://your-express-backend.render.com/api`).
   - If not set, it will fallback to your local backend on `http://localhost:5001/api`.

5. **Deploy**:
   - Click **Deploy**. Vercel will build the split chunks and launch your cosmic universe application.

---

## 🔮 Future Scope
- **Multiplayer Orbit Collaboration**: Team-based checkpoints where multiple commanders align trajectories on shared side projects.
- **Physical Wearables Sync**: Direct integration with fitness trackers (Apple Health, Garmin, Fitbit) to synchronize stats from the physical world.
- **AI Conversation Assistant**: Direct NLP text chat to reschedule, skip, or command missions by talking to the ship's computer.

---

## 📸 Screenshots

*(Add your custom screenshots below after taking them during deployment!)*

| Cosmic Dashboard | Timeline Analytics | Checkpoint Matrix |
| :---: | :---: | :---: |
| ![Dashboard Mockup](https://raw.githubusercontent.com/username/repo/main/screenshots/dashboard.png) | ![Analytics Mockup](https://raw.githubusercontent.com/username/repo/main/screenshots/analytics.png) | ![Missions Mockup](https://raw.githubusercontent.com/username/repo/main/screenshots/missions.png) |
