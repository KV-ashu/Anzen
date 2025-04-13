from flask import Flask, request, render_template, jsonify
import requests
import math
from datetime import datetime
import logging

app = Flask(_name_)
logging.basicConfig(level=logging.DEBUG)

# Replace these with your API keys
OPENWEATHER_API_KEY = "2d9b1a298c3548af88f137fb256d5794"
GEOCODING_API_KEY = "39c888f2fadc4c87add3c8a70027790a"

def get_coordinates(location):
    """Convert location string to coordinates using OpenCage Geocoding"""
    try:
        url = f"https://api.opencagedata.com/geocode/v1/json?q={location}&key={GEOCODING_API_KEY}"
        response = requests.get(url)
        data = response.json()
        
        if data.get('results'):
            lat = data['results'][0]['geometry']['lat']
            lon = data['results'][0]['geometry']['lng']
            return lat, lon
        return None, None
    except Exception as e:
        app.logger.error(f"Geocoding error: {str(e)}")
        raise Exception(f"Geocoding error: {str(e)}")

def get_weather_data(lat, lon):
    """Fetch current weather data and forecast"""
    try:
        current_url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        forecast_url = f"http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        
        current = requests.get(current_url).json()
        forecast = requests.get(forecast_url).json()
        return current, forecast
    except Exception as e:
        app.logger.error(f"Weather data error: {str(e)}")
        raise Exception(f"Weather data error: {str(e)}")

def get_earthquake_data(lat, lon):
    """Fetch real earthquake data from USGS"""
    try:
        end_time = datetime.utcnow().strftime("%Y-%m-%d")
        url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
        params = {
            "format": "geojson",
            "latitude": lat,
            "longitude": lon,
            "maxradiuskm": 300,
            "minmagnitude": 2.5,
            "orderby": "time",
            "limit": 10,
            "endtime": end_time
        }
        response = requests.get(url, params=params)
        return response.json()
    except Exception as e:
        app.logger.error(f"Earthquake data error: {str(e)}")
        return {"features": []}

def calculate_hurricane_threat(weather_data, forecast_data):
    """Calculate hurricane threat with enhanced sensitivity"""
    try:
        current_wind = weather_data.get("wind", {}).get("speed", 0)
        pressure = weather_data.get("main", {}).get("pressure", 1013.25)
        humidity = weather_data.get("main", {}).get("humidity", 50)
        
        # Get max wind speed from forecast
        forecast_winds = [item.get("wind", {}).get("speed", 0) for item in forecast_data.get("list", [])]
        max_forecast_wind = max(forecast_winds) if forecast_winds else 0
        
        # Enhanced wind threat (more sensitive)
        wind_speed = max(current_wind, max_forecast_wind)
        wind_threat = min(100, (wind_speed / 32.7) * 100)  # 32.7 m/s = ~74mph (hurricane force)
        
        # Pressure threat (enhanced sensitivity)
        pressure_drop = max(0, 1013.25 - pressure)
        pressure_threat = min(100, (pressure_drop / 50.0) * 100)
        
        # Humidity factor (high humidity increases threat)
        humidity_threat = max(0, (humidity - 50) / 50) * 100
        
        # Combined threat with weighted factors
        hurricane_threat = (
            wind_threat * 0.5 +
            pressure_threat * 0.3 +
            humidity_threat * 0.2
        ) * 1.2  # 20% boost to final value
        
        return min(100, hurricane_threat)
    except Exception as e:
        app.logger.error(f"Hurricane calculation error: {str(e)}")
        return 0

def calculate_earthquake_threat(earthquake_data):
    """Calculate earthquake threat with enhanced sensitivity"""
    try:
        if not earthquake_data.get("features"):
            return 0
        
        max_threat = 0
        recent_activity_boost = 0
        
        for quake in earthquake_data["features"]:
            magnitude = quake["properties"].get("mag", 0)
            
            # Calculate time difference in hours instead of days for more sensitivity
            quake_time = datetime.fromtimestamp(quake["properties"]["time"] / 1000)
            time_diff_hours = (datetime.utcnow() - quake_time).total_seconds() / 3600
            
            # Enhanced magnitude scaling (more sensitive to moderate earthquakes)
            magnitude_threat = min(100, (math.exp(magnitude - 3) * 25))
            
            # Time decay factor (slower decay)
            time_factor = math.exp(-0.01 * time_diff_hours)
            
            # Distance factor (more weight to closer events)
            distance = quake["properties"].get("distance", 300)
            distance_factor = math.exp(-distance / 500)  # Increased from 300 to 500
            
            # Calculate threat for this quake
            threat = magnitude_threat * time_factor * distance_factor
            
            # Add recent activity boost
            if time_diff_hours < 48:  # Past 48 hours
                recent_activity_boost = max(recent_activity_boost, threat * 0.3)
            
            max_threat = max(max_threat, threat)
        
        # Apply recent activity boost and general boost
        final_threat = min(100, (max_threat + recent_activity_boost) * 1.25)  # 25% boost
        
        return final_threat
    except Exception as e:
        app.logger.error(f"Earthquake calculation error: {str(e)}")
        return 0

def calculate_flood_threat(weather_data, forecast_data):
    """Calculate flood threat with enhanced sensitivity"""
    try:
        # Current conditions
        current_rain = weather_data.get("rain", {}).get("1h", 0)
        humidity = weather_data.get("main", {}).get("humidity", 50)
        
        # Forecast data (next 24 hours)
        forecast_rain = 0
        for item in forecast_data.get("list", [])[:8]:  # 8 3-hour forecasts = 24 hours
            forecast_rain += item.get("rain", {}).get("3h", 0)
        
        # Enhanced rainfall threat
        current_rain_threat = min(100, (current_rain / 25.0) * 100)  # More sensitive to current rain
        forecast_rain_threat = min(100, (forecast_rain / 50.0) * 100)  # More sensitive to forecast
        
        # Enhanced humidity factor
        humidity_factor = max(0, (humidity - 60) / 40) * 100  # More sensitive to humidity
        
        # Ground saturation factor (based on recent rainfall and forecast)
        ground_saturation = min(100, (current_rain_threat + forecast_rain_threat) * 0.7)
        
        # Weather condition factor
        weather_id = weather_data.get("weather", [{}])[0].get("id", 800)
        weather_factor = 0
        
        # Enhanced weather condition threats
        if weather_id < 600:  # Rain conditions
            weather_factor = 80
        elif weather_id < 700:  # Snow conditions
            weather_factor = 60
        elif weather_id < 800:  # Atmosphere conditions (fog, mist, etc.)
            weather_factor = 30
        
        # Combined threat with weighted factors
        flood_threat = (
            current_rain_threat * 0.3 +
            forecast_rain_threat * 0.25 +
            humidity_factor * 0.15 +
            ground_saturation * 0.15 +
            weather_factor * 0.15
        ) * 1.3  # 30% boost to final value
        
        return min(100, flood_threat)
    except Exception as e:
        app.logger.error(f"Flood calculation error: {str(e)}")
        return 0

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        location = data.get("location")
        
        if not location:
            return jsonify({"error": "Location is required"}), 400

        # Get coordinates
        lat, lon = get_coordinates(location)
        if not lat or not lon:
            return jsonify({"error": "Could not find coordinates for the location"}), 404

        # Get weather and earthquake data
        current_weather, forecast = get_weather_data(lat, lon)
        earthquake_data = get_earthquake_data(lat, lon)

        # Calculate threats
        hurricane_threat = calculate_hurricane_threat(current_weather, forecast)
        earthquake_threat = calculate_earthquake_threat(earthquake_data)
        flood_threat = calculate_flood_threat(current_weather, forecast)

        # Prepare detailed information
        details = {
            "location": {
                "coordinates": f"({lat:.2f}, {lon:.2f})",
                "address": location
            },
            "weather": {
                "temperature": current_weather.get("main", {}).get("temp", "N/A"),
                "wind_speed": current_weather.get("wind", {}).get("speed", "N/A"),
                "pressure": current_weather.get("main", {}).get("pressure", "N/A"),
                "humidity": current_weather.get("main", {}).get("humidity", "N/A"),
                "rainfall_1h": current_weather.get("rain", {}).get("1h", 0)
            },
            "recent_earthquakes": [
                {
                    "magnitude": quake["properties"]["mag"],
                    "time": datetime.fromtimestamp(quake["properties"]["time"] / 1000).strftime("%Y-%m-%d %H:%M:%S"),
                    "distance": quake["properties"]["place"]
                }
                for quake in earthquake_data.get("features", [])[:3]
            ] if earthquake_data.get("features") else []
        }

        return jsonify({
            "hurricane_threat": hurricane_threat,
            "earthquake_threat": earthquake_threat,
            "flood_threat": flood_threat,
            "details": details
        })

    except Exception as e:
        app.logger.error(f"General error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if _name_ == '_main_':
    app.run(debug=True)
