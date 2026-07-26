import os
import random
import pandas as pd
import numpy as np

# Ensure directories exist
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
dataset_dir = os.path.join(BASE_DIR, "dataset")
os.makedirs(dataset_dir, exist_ok=True)

# Set random seed for reproducibility
random.seed(42)
np.random.seed(42)

# Features ranges
age_groups = ['18-24', '25-34', '35-44', '45+']
occupations = ['Student', 'Engineer', 'Manager', 'Designer', 'Other']
educations = ['High School', 'Bachelors', 'Masters', 'PhD']
daily_free_times = ['1-2 hours', '3-4 hours', '5+ hours']
learning_styles = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic']
primary_goals = [
    'Career Advancement', 'Learn React', 'Physical Fitness', 
    'Mindfulness', 'Side Projects', 'Financial Stability', 
    'Aesthetic Design', 'Better Relationships', 'Creative Writing'
]
planet_focuses = [
    'Learning', 'Career', 'Health', 'Projects', 
    'Finance', 'Relationships', 'Mindfulness', 'Fitness', 'Creativity'
]

# Define concrete recommendations per plan
plan_recommendations = {
    'Deep Dev & React Mastery Plan': {
        'planet': 'Learning',
        'missions': 'Complete React Routing Labs,Refactor API Integrations,Build custom hooks demo',
        'habits': 'Code for 2 hours daily,Read technical docs,Contribute to open source',
        'daily_hours': 3.5,
        'xp_target': 150
    },
    'Accelerated Professional Growth Plan': {
        'planet': 'Career',
        'missions': 'Adjust portfolio layouts,Optimize resume metrics,Apply to 3 start-up platforms',
        'habits': 'Network on LinkedIn,Update progress logs,Practice system design',
        'daily_hours': 2.5,
        'xp_target': 120
    },
    'Health & Wellness Plan': {
        'planet': 'Health',
        'missions': 'Track meal nutrition,Practice deep breathing,Monitor physical vitals',
        'habits': 'Sleep 8 hours,Drink 3L water,Track daily calories',
        'daily_hours': 1.5,
        'xp_target': 80
    },
    'Peak Fitness Plan': {
        'planet': 'Fitness',
        'missions': 'Execute 40min HIIT workout,Run 5k outdoor cardio,Perform muscle sets',
        'habits': 'Stretch daily,Daily cardio sessions,Keep steps above 10k',
        'daily_hours': 2.0,
        'xp_target': 100
    },
    'Stress-relief & Mindfulness Plan': {
        'planet': 'Mindfulness',
        'missions': 'Complete 15min silent meditation,Write gratitude logs,Disconnect from social media',
        'habits': 'Meditate morning and night,Mindful eating,Journal daily thoughts',
        'daily_hours': 1.0,
        'xp_target': 60
    },
    'Strategic Finance & Wealth Plan': {
        'planet': 'Finance',
        'missions': 'Audit monthly subscriptions,Map investment allocations,Refine savings target',
        'habits': 'Log expenses,Read financial journals,Budget weekly spending',
        'daily_hours': 1.0,
        'xp_target': 70
    },
    'Creative Expression & Side Projects Plan': {
        'planet': 'Creativity',
        'missions': 'Sketch interface concepts,Draft 500 words creative writing,Develop styling guide',
        'habits': 'Daily creative sessions,Sketching ideas,Review design references',
        'daily_hours': 1.5,
        'xp_target': 90
    },
    'Harmonious Social Relations Plan': {
        'planet': 'Relationships',
        'missions': 'Schedule family dinner chat,Call a distant friend,Plan community meetup',
        'habits': 'Express appreciation,Daily active listening,Schedule social calls',
        'daily_hours': 1.2,
        'xp_target': 75
    },
    'Ultimate Skill Booster Plan': {
        'planet': 'Projects',
        'missions': 'Define software milestones,Test application edge cases,Build command controllers',
        'habits': 'Write utility scripts,Solve coding challenges,Refactor redundant blocks',
        'daily_hours': 2.0,
        'xp_target': 110
    }
}

plan_names = list(plan_recommendations.keys())

data = []

for i in range(15000):
    # Random distributions with logic dependencies to form natural clusters
    age = random.choices(age_groups, weights=[0.4, 0.35, 0.15, 0.10])[0]
    occ = random.choices(occupations, weights=[0.25, 0.35, 0.15, 0.15, 0.10])[0]
    edu = random.choices(educations, weights=[0.15, 0.50, 0.25, 0.10])[0]
    free_time = random.choices(daily_free_times, weights=[0.30, 0.50, 0.20])[0]
    style = random.choice(learning_styles)
    
    # Map Primary Goal to typical weights
    goal = random.choice(primary_goals)
    
    # Demographics and goal affect stress, focus, and productivity scores
    if occ in ['Engineer', 'Manager'] and age in ['25-34', '35-44']:
        stress = random.randint(6, 10)
        focus = random.randint(4, 8)
        prod = random.randint(5, 9)
    elif occ == 'Student':
        stress = random.randint(3, 7)
        focus = random.randint(5, 9)
        prod = random.randint(4, 8)
    else:
        stress = random.randint(4, 8)
        focus = random.randint(4, 9)
        prod = random.randint(5, 9)
        
    skill = random.randint(1, 10)
    
    # Map goal to matching Planet Focus
    if goal == 'Learn React':
        planet = 'Learning'
    elif goal == 'Career Advancement':
        planet = 'Career'
    elif goal == 'Physical Fitness':
        planet = 'Fitness'
    elif goal == 'Mindfulness':
        planet = 'Mindfulness'
    elif goal == 'Side Projects':
        planet = 'Projects'
    elif goal == 'Financial Stability':
        planet = 'Finance'
    elif goal == 'Better Relationships':
        planet = 'Relationships'
    elif goal == 'Creative Writing':
        planet = 'Creativity'
    else:
        planet = random.choice(planet_focuses)

    # Logic rules to determine target variable "Personalized_Plan" to make it highly predictable
    if planet == 'Learning' or goal == 'Learn React':
        target_plan = 'Deep Dev & React Mastery Plan'
    elif planet == 'Career' or goal == 'Career Advancement':
        target_plan = 'Accelerated Professional Growth Plan'
    elif planet == 'Mindfulness' or (stress >= 8 and goal == 'Mindfulness'):
        target_plan = 'Stress-relief & Mindfulness Plan'
    elif planet == 'Fitness' or (goal == 'Physical Fitness'):
        target_plan = 'Peak Fitness Plan'
    elif planet == 'Health':
        target_plan = 'Health & Wellness Plan'
    elif planet == 'Finance' or goal == 'Financial Stability':
        target_plan = 'Strategic Finance & Wealth Plan'
    elif planet == 'Creativity' or goal in ['Creative Writing', 'Aesthetic Design']:
        target_plan = 'Creative Expression & Side Projects Plan'
    elif planet == 'Relationships' or goal == 'Better Relationships':
        target_plan = 'Harmonious Social Relations Plan'
    else:
        target_plan = 'Ultimate Skill Booster Plan'

    # Get recommended static values for that target plan
    recs = plan_recommendations[target_plan]
    
    # Assemble row
    row = {
        'Age_Group': age,
        'Occupation': occ,
        'Education': edu,
        'Daily_Free_Time': free_time,
        'Learning_Style': style,
        'Primary_Goal': goal,
        'Current_Productivity': prod,
        'Stress_Level': stress,
        'Focus_Level': focus,
        'Skill_Level': skill,
        'Planet_Focus': planet,
        'Recommended_Missions': recs['missions'],
        'Recommended_Habits': recs['habits'],
        'Recommended_Daily_Hours': recs['daily_hours'],
        'Recommended_XP_Target': recs['xp_target'],
        'Personalized_Plan': target_plan
    }
    
    data.append(row)

# Save to CSV
df = pd.DataFrame(data)
csv_path = os.path.join(dataset_dir, "nova_synthetic_data.csv")
df.to_csv(csv_path, index=False)
print(f"Generated synthetic dataset with {len(df)} rows at {csv_path}")
print("Target distributions:")
print(df['Personalized_Plan'].value_counts())
