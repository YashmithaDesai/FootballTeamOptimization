import streamlit as st
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import os

# Streamlit app interface
st.title("Football Player Optimization Tool")
st.header("Upload Excel File")

# Apply background image
st.markdown(
    """
    <style>
    .stApp {
        background-color: #89CFF0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# File upload from user
uploaded_file = st.file_uploader("Choose an Excel file", type=["xlsx", "xls"])

if uploaded_file is not None:
    # Read the uploaded Excel file
    data = pd.read_excel(uploaded_file)

    # Normalize 'Pos' column to ensure consistent formatting (strip whitespace, convert to uppercase)
    if 'Pos' in data.columns:
        data['Pos'] = data['Pos'].str.strip().str.upper()
    else:
        st.error("'Pos' column is missing in the uploaded file.")

    # Check for missing columns and add them if they don't exist
    missing_columns = ['Pos_DF', 'Pos_FWDF', 'Pos_FWMF', 'Pos_MFFW', 'Pos_DFFW', 'Pos_DFMF', 'Pos_MFDF']
    for column in missing_columns:
        if column not in data.columns:
            data[column] = 0  # Set default values (0 or other relevant values)

    # Feature engineering
    data['Goal_Conversion'] = data['Goals'] / (data['Shots'] + 1)  # Avoid division by zero
    data['Pass_Ability'] = (data['PasTotCmp%'] + data.get('PasMedAtt', 0) + data['PasLonCmp']) / 3
    data['Efficiency_Score_A'] = (data['Goals'] * 0.4 + data['Assists'] * 0.3 +
                                  data['TklWon'] * 0.2 + data['BlkSh'] * 0.1)
    data['Efficiency_Score_D'] = (data['TklWon'] * 0.4 +
                                   data['BlkSh'] * 0.3 +
                                   data['Int'] * 0.2 +
                                   data['Clr'] * 0.1)
    data['Efficiency_Score_G'] = (data['Goals'] * -0.3 +  # Negative weight for goals conceded
                                   data['Shots'] * 0.1 + 
                                   data['TklWon'] * 0.05 + 
                                   data['BlkSh'] * 0.4 + 
                                   data['AerWon'] * 0.3)
    data['Efficiency_Score_M'] = (data['Goals'] * 0.25 +
                                   data['Assists'] * 0.3 +
                                   data['PasTotCmp%'] * 0.2 +
                                   data['TklWon'] * 0.15 +
                                   data['PasProg'] * 0.1)

    # Normalize numeric columns
    numeric_cols = data.select_dtypes(include=['number']).columns
    scaler = StandardScaler()
    data[numeric_cols] = scaler.fit_transform(data[numeric_cols])

    # One-hot encode 'Pos' column with drop_first=False
    data = pd.get_dummies(data, columns=['Pos'], drop_first=False)

    # Split data into position-specific subsets
    attackers = data[data[['Pos_FW', 'Pos_FWDF', 'Pos_FWMF', 'Pos_MFFW']].any(axis=1)].copy()
    defenders = data[data[['Pos_DF', 'Pos_DFFW', 'Pos_DFMF', 'Pos_MFDF']].any(axis=1)].copy()
    goalkeepers = data[data['Pos_GK']].copy()
    midfielders = data[data['Pos_MF']].copy()

    # Assign position labels
    attackers['Position'] = 'Attacker'
    defenders['Position'] = 'Defender'
    goalkeepers['Position'] = 'Goalkeeper'
    midfielders['Position'] = 'Midfielder'

    # Drop position columns for modeling
    positions = ['Pos_DF','Pos_DFFW', 'Pos_DFMF', 'Pos_FW', 'Pos_FWDF', 'Pos_FWMF', 'Pos_GK', 'Pos_MF', 'Pos_MFDF', 'Pos_MFFW']
    attackers = attackers.drop(columns=positions, errors='ignore')
    defenders = defenders.drop(columns=positions, errors='ignore')
    goalkeepers = goalkeepers.drop(columns=positions, errors='ignore')
    midfielders = midfielders.drop(columns=positions, errors='ignore')

    # Final team initialization
    best_team = pd.DataFrame(columns=['Player', 'Position', 'Predicted_Score'])

    # --- Model Training and Predictions ---
    def train_and_predict(subset, efficiency_col, model_name, top_n):
        if not subset.empty:
            X = subset.drop(columns=['Player', 'Position', 'Predicted_Score'], errors='ignore')
            y = subset[efficiency_col]
            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(X, y)
            subset['Predicted_Score'] = model.predict(X)
            return subset.sort_values(by='Predicted_Score', ascending=False).head(top_n)
        else:
            st.warning(f"No data available for {model_name}")
            return pd.DataFrame(columns=['Player', 'Position', 'Predicted_Score'])

    # Ensure to get only 1 goalkeeper, 4 defenders, 3 attackers, and 3 midfielders
    best_attackers = train_and_predict(attackers, 'Efficiency_Score_A', "Attackers", 3)
    best_defenders = train_and_predict(defenders, 'Efficiency_Score_D', "Defenders", 4)
    best_goalkeeper = train_and_predict(goalkeepers, 'Efficiency_Score_G', "Goalkeepers", 1)
    best_midfielders = train_and_predict(midfielders, 'Efficiency_Score_M', "Midfielders", 3)

    # Combine the best players into the final team
    best_team = pd.concat([best_attackers, best_defenders, best_goalkeeper, best_midfielders])

    # Display only player names in the final team
    st.subheader("Best Team")
    if not best_team.empty:
        st.markdown(
            """
            <style>
            .team-table {
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
                text-align: center;
                background-color: white;  /* White background for the table */
                border: 20px solid #000000;  /* Add black border around the table */
                border-radius: 5px;  /* Rounded corners */
            }
            .team-table th, .team-table td {
                padding: 15px;
                text-align: center;
                 
            }
            </style>
            """,
            unsafe_allow_html=True
        )
        st.table(best_team[['Player', 'Position']])  # Display player names, positions, and scores
    else:
        st.warning("No team could be generated due to insufficient data.")

    # Add a home button that links to another URL (replace with your desired URL)
    st.markdown(
        """
        <div style="position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%);">
            <a href="http://localhost:5173/" target="_self">
                <button style="background-color: #4CAF50; color: white; padding: 15px 32px; font-size: 16px; border: none; border-radius: 5px;">
                    Home
                </button>
            </a>
        </div>
        """,
        unsafe_allow_html=True
    )