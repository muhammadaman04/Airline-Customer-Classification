# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS configuration

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model and scaler
model = pickle.load(open('xgb_model.pkl', 'rb'))
scaler = pickle.load(open('scaler.pkl', 'rb'))

class CustomerData(BaseModel):
    Age: int
    Flight_Distance: int
    Seat_comfort: int
    Departure_Arrival_time_convenient: int
    Food_and_drink: int
    Gate_location: int
    Inflight_wifi_service: int
    Inflight_entertainment: int
    Online_support: int
    Ease_of_Online_booking: int
    On_board_service: int
    Leg_room_service: int
    Baggage_handling: int
    Checkin_service: int
    Cleanliness: int
    Online_boarding: int
    Departure_Delay_in_Minutes: int
    Customer_Type: str  
    Type_of_Travel: str  
    Class: str  

@app.post("/predict")
async def predict(data: CustomerData):
    try:
        print(data)
        # Convert input data to DataFrame
        input_data = {
            'Age': [data.Age],
            'Flight Distance': [data.Flight_Distance],  # Note: space instead of underscore
            'Seat comfort': [data.Seat_comfort],
            'Departure/Arrival time convenient': [data.Departure_Arrival_time_convenient],
            'Food and drink': [data.Food_and_drink],
            'Gate location': [data.Gate_location],
            'Inflight wifi service': [data.Inflight_wifi_service],
            'Inflight entertainment': [data.Inflight_entertainment],
            'Online support': [data.Online_support],
            'Ease of Online booking': [data.Ease_of_Online_booking],
            'On-board service': [data.On_board_service],
            'Leg room service': [data.Leg_room_service],
            'Baggage handling': [data.Baggage_handling],
            'Checkin service': [data.Checkin_service],
            'Cleanliness': [data.Cleanliness],
            'Online boarding': [data.Online_boarding],
            'Departure Delay in Minutes': [data.Departure_Delay_in_Minutes],
            'Customer Type': [data.Customer_Type],  
            'Type of Travel': [data.Type_of_Travel],  
            'Class': [data.Class]
        }
        
        df = pd.DataFrame(input_data)
        
        # Encode categorical variables
        df['Customer Type'] = df['Customer Type'].map({'Loyal Customer': 1, 'disloyal Customer': 0})
        df['Type of Travel'] = df['Type of Travel'].map({'Personal Travel': 1, 'Business travel': 0})

        # Create dummy variables for Class without prefix
        class_dummies = pd.get_dummies(df['Class'], dtype=int)
        df = pd.concat([df, class_dummies], axis=1)
        df.drop(columns=['Class'], inplace=True)

        # Add missing columns that the scaler expects
        expected_columns = [
            'Customer Type', 'Age', 'Type of Travel', 'Flight Distance', 'Seat comfort',
            'Departure/Arrival time convenient', 'Food and drink', 'Gate location',
            'Inflight wifi service', 'Inflight entertainment', 'Online support',
            'Ease of Online booking', 'On-board service', 'Leg room service',
            'Baggage handling', 'Checkin service', 'Cleanliness', 'Online boarding',
            'Departure Delay in Minutes', 'Business', 'Eco', 'Eco Plus'
        ]


        # Ensure all columns exist (add with 0 if missing)
        for col in expected_columns:
            if col not in df.columns:
                df[col] = 0

        # Reorder columns to exactly match scaler's expectations
        df = df[expected_columns]

        # Now the scaling should work
        scaled_data = scaler.transform(df)
        
        # Make prediction
        prediction = model.predict(scaled_data)
        probability = model.predict_proba(scaled_data)
        print('prediction:', prediction, 'probability:', probability)
        return {
            "prediction": "satisfied" if prediction[0] == 1 else "dissatisfied",
            "probability": float(probability[0][1])
        }
    except Exception as e:
        print("Error during prediction:", str(e))
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Airline Customer Satisfaction Prediction API"}