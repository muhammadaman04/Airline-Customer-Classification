// src/App.js
import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    Age: 30,
    Flight_Distance: 500,
    Seat_comfort: 3,
    Departure_Arrival_time_convenient: 3,
    Food_and_drink: 3,
    Gate_location: 3,
    Inflight_wifi_service: 3,
    Inflight_entertainment: 3,
    Online_support: 3,
    Ease_of_Online_booking: 3,
    On_board_service: 3,
    Leg_room_service: 3,
    Baggage_handling: 3,
    Checkin_service: 3,
    Cleanliness: 3,
    Online_boarding: 3,
    Departure_Delay_in_Minutes: 0,
    Customer_Type: "Loyal Customer",
    Type_of_Travel: "Business travel",
    Class: "Eco",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("comfort") ||
        name.includes("service") ||
        name.includes("convenient")
          ? parseInt(value)
          : name === "Age" ||
            name === "Flight_Distance" ||
            name === "Departure_Delay_in_Minutes"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Airline Customer Satisfaction Predictor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  min="1"
                  max="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Type
                </label>
                <select
                  name="Customer_Type"
                  value={formData.Customer_Type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                >
                  <option value="Loyal Customer">Loyal Customer</option>
                  <option value="disloyal Customer">Disloyal Customer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type of Travel
                </label>
                <select
                  name="Type_of_Travel"
                  value={formData.Type_of_Travel}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                >
                  <option value="Business travel">Business Travel</option>
                  <option value="Personal Travel">Personal Travel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                <select
                  name="Class"
                  value={formData.Class}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                >
                  <option value="Business">Business</option>
                  <option value="Eco">Eco</option>
                  <option value="Eco Plus">Eco Plus</option>
                </select>
              </div>
            </div>

            {/* Flight Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Flight Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Flight Distance (km)
                </label>
                <input
                  type="number"
                  name="Flight_Distance"
                  value={formData.Flight_Distance}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Departure Delay (minutes)
                </label>
                <input
                  type="number"
                  name="Departure_Delay_in_Minutes"
                  value={formData.Departure_Delay_in_Minutes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Service Ratings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Service Ratings (1-5)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Seat_comfort",
                "Departure_Arrival_time_convenient",
                "Food_and_drink",
                "Gate_location",
                "Inflight_wifi_service",
                "Inflight_entertainment",
                "Online_support",
                "Ease_of_Online_booking",
                "On_board_service",
                "Leg_room_service",
                "Baggage_handling",
                "Checkin_service",
                "Cleanliness",
                "Online_boarding",
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.replace(/_/g, " ")}
                  </label>
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Predict Satisfaction"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {prediction && (
          <div
            className={`mt-6 p-6 rounded-lg ${
              prediction.prediction === "satisfied"
                ? "bg-green-50 border-l-4 border-green-500"
                : "bg-red-50 border-l-4 border-red-500"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">
              Prediction:{" "}
              <span
                className={
                  prediction.prediction === "satisfied"
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                {prediction.prediction} (
                {Math.round(prediction.probability * 100)}% confidence)
              </span>
            </h2>
            <p className="text-gray-700">
              Based on the provided information, the customer is likely to be{" "}
              {prediction.prediction} with the airline service.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
