let charts = {};

function createCircularBar(canvasId, value, label) {
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    const ctx = document.getElementById(canvasId).getContext("2d");
    const gradientColor = ctx.createLinearGradient(0, 0, 0, 150);
    
    // Color gradient based on threat level
    if (value < 33) {
        gradientColor.addColorStop(0, '#4CAF50');
        gradientColor.addColorStop(1, '#8BC34A');
    } else if (value < 66) {
        gradientColor.addColorStop(0, '#FFC107');
        gradientColor.addColorStop(1, '#FFB300');
    } else {
        gradientColor.addColorStop(0, '#f44336');
        gradientColor.addColorStop(1, '#d32f2f');
    }

    charts[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, 100 - value],
                backgroundColor: [gradientColor, '#f0f0f0'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });

    // Add center text
    const centerText = document.createElement('div');
    centerText.classList.add('center-text');
    centerText.innerHTML = `
        <div class="threat-label">${label}</div>
        <div class="threat-value">${value.toFixed(1)}%</div>
    `;
    
    const existingCenterText = document.getElementById(canvasId).parentElement.querySelector('.center-text');
    if (existingCenterText) {
        existingCenterText.remove();
    }
    
    document.getElementById(canvasId).parentElement.appendChild(centerText);
}

function displayDetails(details) {
    if (!details) return;

    const locationDetails = document.getElementById('location-details');
    const weatherDetails = document.getElementById('weather-details');
    const seismicDetails = document.getElementById('seismic-details');

    locationDetails.innerHTML = `
        <h4>Location</h4>
        <p>${details.location.address}</p>
        <p>Coordinates: ${details.location.coordinates}</p>
    `;

    weatherDetails.innerHTML = `
        <h4>Current Weather</h4>
        <p>Temperature: ${details.weather.temperature}°C</p>
        <p>Wind Speed: ${details.weather.wind_speed} m/s</p>
        <p>Pressure: ${details.weather.pressure} hPa</p>
        <p>Humidity: ${details.weather.humidity}%</p>
        <p>Rainfall (1h): ${details.weather.rainfall_1h} mm</p>
    `;

    if (details.recent_earthquakes && Array.isArray(details.recent_earthquakes)) {
        seismicDetails.innerHTML = `
            <h4>Recent Seismic Activity</h4>
            ${details.recent_earthquakes.length > 0 ? 
                details.recent_earthquakes.map(quake => `
                    <p>Magnitude ${quake.magnitude} - ${quake.distance}<br>
                    <small>${quake.time}</small></p>
                `).join('') : 
                '<p>No recent seismic activity recorded</p>'
            }
        `;
    }
}

async function getPrediction() {
    const location = document.getElementById('location').value;
    if (!location) {
        showError('Please enter a location');
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('error').style.display = 'none';

    try {
        const response = await axios.post('/predict', { location });
        const data = response.data;

        if (data.error) {
            throw new Error(data.error);
        }

        createCircularBar('earthquakeBar', data.earthquake_threat, 'Earthquake');
        createCircularBar('floodBar', data.flood_threat, 'Flood');
        createCircularBar('hurricaneBar', data.hurricane_threat, 'Hurricane');

        displayDetails(data.details);
        document.getElementById('results').style.display = 'block';
    } catch (error) {
        let errorMessage = 'An error occurred';
        if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
        } else if (error.message) {
            errorMessage = error.message;
        }
        showError(errorMessage);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
}

// Add event listener for Enter key
document.addEventListener('DOMContentLoaded', function() {
    const locationInput = document.getElementById('location');
    if (locationInput) {
        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                getPrediction();
            }
        });
    }
});
