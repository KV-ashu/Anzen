document.addEventListener("DOMContentLoaded", () => {
    const map = L.map('map').setView([22.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const markers = L.layerGroup().addTo(map);
    const permanentMarkers = L.layerGroup(); // Separate layer for permanent markers
    let liveShown = false;

    function addPermanentMarkers() {
        const permanentLocations = [
            { lat: 28.6139, lng: 77.2090, type: 'Delhi', description: 'Water shortage' },
            { lat: 19.0760, lng: 72.8777, type: 'Mumbai', description: 'Flood' },
            { lat: 22.5726, lng: 88.3639, type: 'Kolkata', description: 'Earthquake' },
            { lat: 13.0827, lng: 80.2707, type: 'Chennai', description: 'Tsunami' },
            { lat: 17.3850, lng: 78.4867, type: 'Hyderabad', description: 'Water shortage' }
        ];

        permanentLocations.forEach(loc => {
            const marker = L.marker([loc.lat, loc.lng]);
            marker.bindPopup(`<strong>${loc.type}</strong><br>${loc.description}`);
            permanentMarkers.addLayer(marker);
        });

        permanentMarkers.addTo(map);
    }

    document.getElementById('liveBtn').addEventListener('click', () => {
        if (!liveShown) {
            addPermanentMarkers();
            document.getElementById('liveBtn').textContent = "Hide";
            liveShown = true;
        } else {
            permanentMarkers.clearLayers();
            document.getElementById('liveBtn').textContent = "Live";
            liveShown = false;
        }
    });

    map.on('click', (e) => {
        document.getElementById('latitude').value = e.latlng.lat.toFixed(6);
        document.getElementById('longitude').value = e.latlng.lng.toFixed(6);
    });

    document.getElementById('reportForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value.trim();
        const latitude = parseFloat(document.getElementById('latitude').value);
        const longitude = parseFloat(document.getElementById('longitude').value);

        if (!description || isNaN(latitude) || isNaN(longitude)) {
            alert("Please fill in all fields.");
            return;
        }

        const marker = L.marker([latitude, longitude]).addTo(markers);
        marker.bindPopup(`<strong>${type}</strong><br>${description}`).openPopup();

        document.getElementById('reportForm').reset();
    });
});
document.getElementById('type').addEventListener('change', function() {
    const otherDisasterContainer = document.getElementById('otherDisasterContainer');
    const selectedType = this.value;

    if (selectedType === 'other') {
        otherDisasterContainer.style.display = 'block'; 
    } else {
        otherDisasterContainer.style.display = 'none'; 
    }
});
function fun() {
    document.body.classList.toggle("dark-mode");
  
    const logo = document.getElementById("logoImg");
  
    if (document.body.classList.contains("dark-mode")) {
      logo.src = "anzen dark.jpg"; 

    } else {
      logo.src = "anzen.jpg";
    }
  }

  const detailsBtn = document.getElementById("detailsBtn");
  const authModal = document.getElementById("authModal");
  
  detailsBtn.addEventListener("click", () => {
    authModal.style.display = "flex";
  });
  
  function closeModal() {
    authModal.style.display = "none";
  }
  
  function handleSignIn() {
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;
  
    if (email && password) {
      closeModal();
      detailsBtn.style.display = "none";
    } else {
      alert("Please enter both email and password.");
    }
  }
  
  
