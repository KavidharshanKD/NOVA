import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and encoders
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "encoder.pkl")

model = None
encoders = None

if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODER_PATH)
    print("Model and Encoders loaded successfully.")
else:
    print(f"WARNING: Model and Encoders files are missing at {MODEL_PATH} and {ENCODER_PATH}. Run train.py first!")

# Define concrete recommendations payload matching plans
plan_details = {
    'Deep Dev & React Mastery Plan': {
        'recommendedPlanet': 'Learning',
        'recommendedMissions': [
            'Complete React Routing Labs',
            'Refactor API Integrations with Axios',
            'Build high-performance custom hooks'
        ],
        'dailySchedule': [
            '09:00 AM - Study React Router concepts',
            '11:30 AM - Develop components mockup',
            '03:00 PM - Refactor state hooks & context'
        ],
        'weeklyGoals': [
            'Secure dynamic authorization routes',
            'Deploy full stack custom API integration'
        ],
        'recommendedXp': 150,
        'recommendedHabits': [
            'Code for 2 hours daily',
            'Read tech documentation articles',
            'Contribute to portfolio repositories'
        ]
    },
    'Accelerated Professional Growth Plan': {
        'recommendedPlanet': 'Career',
        'recommendedMissions': [
            'Adjust portfolio resume layouts',
            'Optimize LinkedIn search keywords',
            'Apply to 3 start-up job vacancies'
        ],
        'dailySchedule': [
            '10:00 AM - Refine technical CV items',
            '02:00 PM - Cold-outreach hiring managers',
            '04:30 PM - Review mock coding questions'
        ],
        'weeklyGoals': [
            'Obtain 5 professional referrals',
            'Complete job portal registration guides'
        ],
        'recommendedXp': 120,
        'recommendedHabits': [
            'Network with 2 experts daily',
            'Update daily progress logs',
            'Practice system design mockups'
        ]
    },
    'Health & Wellness Plan': {
        'recommendedPlanet': 'Health',
        'recommendedMissions': [
            'Track daily caloric meal balance',
            'Practice 15min deep diaphragmatic breathing',
            'Check blood pressure or vitals parameters'
        ],
        'dailySchedule': [
            '07:30 AM - Morning stretching & hydration',
            '01:00 PM - Nutrition balanced lunch audit',
            '09:30 PM - Wind down offline meditation'
        ],
        'weeklyGoals': [
            'Maintain caloric deficit/surplus goals',
            'Keep resting heart rate below target'
        ],
        'recommendedXp': 80,
        'recommendedHabits': [
            'Sleep 8 full hours nightly',
            'Drink 3 liters of fresh water',
            'Record calorie statistics in ledger'
        ]
    },
    'Peak Fitness Plan': {
        'recommendedPlanet': 'Fitness',
        'recommendedMissions': [
            'Execute 40min high-intensity HIIT workout',
            'Complete a 5km outdoor cardio jog',
            'Perform weight resistance muscle sets'
        ],
        'dailySchedule': [
            '06:30 AM - Pre-workout hydration & jog',
            '05:00 PM - Gym muscle lifting routine',
            '06:30 PM - Post-workout protein refuel'
        ],
        'weeklyGoals': [
            'Run aggregate 20 kilometers distance',
            'Increase bench/deadlift weights index'
        ],
        'recommendedXp': 100,
        'recommendedHabits': [
            'Dynamic stretch before cardio',
            'Daily workout logs',
            'Exceed 10,000 active steps index'
        ]
    },
    'Stress-relief & Mindfulness Plan': {
        'recommendedPlanet': 'Mindfulness',
        'recommendedMissions': [
            'Complete 15min silent mindful focus',
            'Write 3 things in gratitude register',
            'Enforce a 2-hour digital device detox'
        ],
        'dailySchedule': [
            '08:00 AM - Mindfulness breathing exercise',
            '03:00 PM - Five-minute posture realignment',
            '08:30 PM - Journaling today\'s achievements'
        ],
        'weeklyGoals': [
            'Maintain weekly anxiety index below 3',
            'Complete full mindfulness workbook chapter'
        ],
        'recommendedXp': 60,
        'recommendedHabits': [
            'Meditate morning and night',
            'Practice mindful posture reviews',
            'Write daily gratitude reflections'
        ]
    },
    'Strategic Finance & Wealth Plan': {
        'recommendedPlanet': 'Finance',
        'recommendedMissions': [
            'Audit recurring subscriptions log',
            'Draft personal investment allocations',
            'Calculate monthly savings target margin'
        ],
        'dailySchedule': [
            '09:00 AM - Log previous day\'s expenditures',
            '12:30 PM - Read investment/news analysis',
            '06:00 PM - Adjust cash budgeting entries'
        ],
        'weeklyGoals': [
            'Save at least 30% of weekly revenues',
            'Audit bank and investment balances'
        ],
        'recommendedXp': 70,
        'recommendedHabits': [
            'Log all variable expenses',
            'Read a finance newsletter',
            'Adhere to strict cash spending caps'
        ]
    },
    'Creative Expression & Side Projects Plan': {
        'recommendedPlanet': 'Creativity',
        'recommendedMissions': [
            'Sketch dashboard application mockup',
            'Draft 500 words of creative logs',
            'Build custom CSS layout guidelines'
        ],
        'dailySchedule': [
            '10:30 AM - Visual UI prototyping sandbox',
            '03:30 PM - Free-form creative brainstorming',
            '07:30 PM - Read styling/design resources'
        ],
        'weeklyGoals': [
            'Complete two design system components',
            'Publish creative writing portfolio'
        ],
        'recommendedXp': 90,
        'recommendedHabits': [
            'Sketch a daily interface snippet',
            'Write creative prompts daily',
            'Browse Behance/Dribbble references'
        ]
    },
    'Harmonious Social Relations Plan': {
        'recommendedPlanet': 'Relationships',
        'recommendedMissions': [
            'Plan next family dinner menu details',
            'Call a childhood friend or teammate',
            'Coordinate local meetup or board game night'
        ],
        'dailySchedule': [
            '09:00 AM - Send motivational morning greeting',
            '01:00 PM - Short coffee break with peer',
            '07:00 PM - Dedicated quality family block'
        ],
        'weeklyGoals': [
            'Perform one unexpected act of kindness',
            'Meet one new social connection face-to-face'
        ],
        'recommendedXp': 75,
        'recommendedHabits': [
            'Express gratitude to a friend daily',
            'Active listening practice in conversations',
            'Reach out to someone in your network'
        ]
    },
    'Ultimate Skill Booster Plan': {
        'recommendedPlanet': 'Projects',
        'recommendedMissions': [
            'Establish software milestone checklists',
            'Create automated test assertions scripts',
            'Develop background command listener logs'
        ],
        'dailySchedule': [
            '09:30 AM - Refactor project code bottlenecks',
            '02:00 PM - Code unit test coverages',
            '05:30 PM - Review architecture and security'
        ],
        'weeklyGoals': [
            'Launch working backend service code',
            'Fix active debugging issues tickets'
        ],
        'recommendedXp': 110,
        'recommendedHabits': [
            'Write quick scripts to automate work',
            'Solve one complex algorithmic puzzle',
            'Clean refactoring of redundant snippets'
        ]
    }
}

@app.route('/predict', methods=['POST'])
def predict():
    global model, encoders
    
    # Reload model if dynamic training completed in background
    if model is None or encoders is None:
        if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
            model = joblib.load(MODEL_PATH)
            encoders = joblib.load(ENCODER_PATH)

    if model is None or encoders is None:
        return jsonify({'error': 'ML Model not trained or loaded. Verify files.'}), 500
        
    try:
        user_data = request.json
        print("Incoming user payload for prediction:", user_data)
        
        # Parse inputs
        # Accept defaults if profile properties are not yet in database
        features_list = [
            'Age_Group', 'Occupation', 'Education', 'Daily_Free_Time', 
            'Learning_Style', 'Primary_Goal', 'Current_Productivity', 
            'Stress_Level', 'Focus_Level', 'Skill_Level', 'Planet_Focus'
        ]
        
        # Verify required keys
        input_row = {}
        for f in features_list:
            val = user_data.get(f)
            if val is None:
                # Handle numeric defaults
                if f in ['Current_Productivity', 'Stress_Level', 'Focus_Level', 'Skill_Level']:
                    val = 5
                elif f == 'Planet_Focus':
                    # Infer planet focus from Primary Goal
                    g = user_data.get('Primary_Goal', '')
                    if 'React' in g or 'Learn' in g:
                        val = 'Learning'
                    elif 'Career' in g or 'Job' in g:
                        val = 'Career'
                    elif 'Fitness' in g or 'Workout' in g:
                        val = 'Fitness'
                    elif 'Mindful' in g or 'Stress' in g:
                        val = 'Mindfulness'
                    elif 'Project' in g or 'Coding' in g:
                        val = 'Projects'
                    elif 'Finance' in g or 'Money' in g:
                        val = 'Finance'
                    elif 'Relation' in g or 'Friend' in g:
                        val = 'Relationships'
                    elif 'Health' in g or 'Diet' in g:
                        val = 'Health'
                    else:
                        val = 'Creativity'
                else:
                    # Categorical defaults
                    defaults = {
                        'Age_Group': '25-34',
                        'Occupation': 'Engineer',
                        'Education': 'Bachelors',
                        'Daily_Free_Time': '3-4 hours',
                        'Learning_Style': 'Visual',
                        'Primary_Goal': 'Career Advancement'
                    }
                    val = defaults.get(f, '')
            input_row[f] = val

        # Create DataFrame
        input_df = pd.DataFrame([input_row])
        
        # Encode categorical variables using encoders
        categorical_cols = [
            'Age_Group', 'Occupation', 'Education', 'Daily_Free_Time', 
            'Learning_Style', 'Primary_Goal', 'Planet_Focus'
        ]
        
        for col in categorical_cols:
            le = encoders[col]
            val = input_df.loc[0, col]
            # Handle unseen labels by mapping to default/closest
            if val not in le.classes_:
                print(f"Warning: Label {val} not in {col} encoder classes. Using default: {le.classes_[0]}")
                input_df.loc[0, col] = le.classes_[0]
            input_df[col] = le.transform(input_df[col])
            
        # Predict
        pred_encoded = model.predict(input_df)
        pred_label = encoders['Personalized_Plan'].inverse_transform(pred_encoded)[0]
        
        # Fetch corresponding payload details
        payload = plan_details.get(pred_label, plan_details['Ultimate Skill Booster Plan']).copy()
        payload['planName'] = pred_label
        
        print(f"Predicted plan: {pred_label}")
        return jsonify(payload)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Start on dynamic port
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
