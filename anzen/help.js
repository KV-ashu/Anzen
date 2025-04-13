function fun() {
    document.body.classList.toggle("dark-mode");
  
    const logo = document.getElementById("logoImg");
  
    if (document.body.classList.contains("dark-mode")) {
      logo.src = "anzen dark.jpg"; 

    } else {
      logo.src = "anzen.jpg"; // 
    }
  }
window.addEventListener('scroll', reveal);
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        }
    });
}
reveal(); // Initialize

// Click Ripple Effect
document.addEventListener('click', function(e) {
    if (e.target.closest('.ripple')) {
        const btn = e.target.closest('.ripple');
        const ripple = document.createElement('div');
        const rect = btn.getBoundingClientRect();
        
        ripple.style.width = ripple.style.height = 
            Math.max(rect.width, rect.height) + 'px';
        ripple.style.left = e.clientX - rect.left - ripple.offsetWidth/2 + 'px';
        ripple.style.top = e.clientY - rect.top - ripple.offsetHeight/2 + 'px';
        
        ripple.classList.add('ripple-effect');
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Emergency Particle System
function createParticles(e) {
    const particles = document.createElement('div');
    particles.classList.add('particle');
    particles.style.left = e.clientX + 'px';
    particles.style.top = e.clientY + 'px';
    document.body.appendChild(particles);
    
    setTimeout(() => particles.remove(), 2000);
}

// Add particles to interactive elements
document.querySelectorAll('button, .toggle-option, .form-card').forEach(element => {
    element.addEventListener('mousemove', createParticles);
    element.addEventListener('touchmove', (e) => {
        createParticles(e.touches[0]);
    }, {passive: true});
});

// Emergency Sound Effect (optional)
function playEmergencySound() {
    const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
    audio.play().catch(() => {});
}

// Form Management System
function showForm(formId) {
    document.querySelectorAll('.form-matrix').forEach(f => f.style.display = 'none');
    document.querySelectorAll('.toggle-option').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(`${formId}Form`).style.display = 'grid';
}

// Dynamic Selection Handlers
function selectFund(element) {
    document.querySelectorAll('#donateForm .toggle-option').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

function selectSkill(element) {
    element.classList.toggle('active');
}

// Form submission handlers
async function handleSubmission(event) {
    event.preventDefault();
    const form = event.target;
    const formType = form.id.replace('Form', '');
    
    if (formType === 'distress') {
        const coordinates = document.getElementById('coordinates').value;
        const emergencyType = form.querySelector('select[name="emergencyType"]').value;
        const details = form.querySelector('textarea[name="details"]').value;
        
        if (!coordinates || !emergencyType) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Here you would typically send this data to your server
        console.log('Distress Signal:', {
            coordinates,
            emergencyType,
            details
        });
        
        alert('Distress signal sent successfully!');
        form.reset();
    } else {
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Add emergency pulse effect
        submitButton.classList.add('emergency-pulse');
        
        try {
            let response;
            const formData = new FormData(form);
            
            switch(formType) {
                case 'donate':
                    const donationData = {
                        amount: parseFloat(formData.get('amount')),
                        category: formData.get('category')
                    };
                    response = await fetch('http://localhost:3000/api/donate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(donationData)
                    });
                    break;
                
                case 'volunteer':
                    const volunteerData = {
                        name: formData.get('name'),
                        email: formData.get('email'),
                        skills: Array.from(formData.getAll('skills'))
                    };
                    response = await fetch('http://localhost:3000/api/volunteer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(volunteerData)
                    });
                    break;
            }
            
            const data = await response.json();
            
            if (response.ok) {
                showSuccessMessage(formType);
                form.reset();
                updateStats();
            } else {
                throw new Error(data.error || 'Submission failed');
            }
        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            submitButton.classList.remove('emergency-pulse');
        }
    }
}

// Update stats display
async function updateStats() {
    try {
        const response = await fetch('http://localhost:3000/api/stats');
        const stats = await response.json();
        
        // Update donation stats
        document.querySelector('#donateForm .stats').textContent = `$${stats.totalDonations.toLocaleString()}`;
        
        // Update volunteer stats
        document.querySelector('#volunteerForm .stats').textContent = stats.totalVolunteers.toLocaleString();
        
        // Update distress signal stats
        document.querySelector('#distressForm .stats').textContent = stats.totalSignals.toLocaleString();
        
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Show success message
function showSuccessMessage(formType) {
    const messages = {
        donate: 'Donation processed successfully!',
        volunteer: 'Volunteer profile created successfully!',
        distress: 'Distress signal sent successfully!'
    };
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = messages[formType];
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Initialize stats on page load
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    // Update stats every 30 seconds
    setInterval(updateStats, 30000);
});

// Initialize
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        return {
            x,
            y,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 3 - 1.5,
            speedY: Math.random() * 3 - 1.5,
            life: 1
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= 0.01;
            
            this.ctx.fillStyle = `rgba(255,70,85,${p.life})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            if(p.life <= 0) this.particles.splice(i, 1);
        });
        requestAnimationFrame(() => this.animate());
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('.particle-canvas');
    const ps = new ParticleSystem(canvas);
    ps.animate();

    // Interactive Particle Generation
    document.addEventListener('mousemove', (e) => {
        ps.particles.push(ps.createParticle(e.clientX, e.clientY));
    });

    // Animated Stats
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.dataset.count);
        let count = 0;
        const interval = setInterval(() => {
            stat.textContent = Math.ceil(count += target/100);
            if(count >= target) clearInterval(interval);
        }, 20);
    });
});

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// Remove old cursor trail code and add bubble effect
let lastScrollY = window.scrollY;
let scrollTimeout;

function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Random size between 15 and 35 pixels
    const size = Math.random() * 20 + 15;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Random position across the screen
    const startX = Math.random() * window.innerWidth;
    const startY = window.scrollY + Math.random() * window.innerHeight;
    bubble.style.left = `${startX}px`;
    bubble.style.top = `${startY}px`;
    
    // Random movement direction with more variation
    const moveX = (Math.random() - 0.5) * 300; // Increased horizontal movement
    const moveY = -200 - Math.random() * 150; // Increased upward movement
    bubble.style.setProperty('--moveX', `${moveX}px`);
    bubble.style.setProperty('--moveY', `${moveY}px`);
    
    // Random animation duration between 1.5 and 2.5 seconds
    const duration = 1.5 + Math.random();
    bubble.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(bubble);
    
    // Remove bubble after animation
    setTimeout(() => {
        bubble.remove();
    }, duration * 1000);
}

// Create bubbles on scroll
window.addEventListener('scroll', () => {
    const scrollDelta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    
    // Only create bubbles when scrolling and throttle creation
    if (Math.abs(scrollDelta) > 5) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Create more bubbles based on scroll speed
            const bubbleCount = Math.min(Math.floor(Math.abs(scrollDelta) / 2), 10);
            for (let i = 0; i < bubbleCount; i++) {
                createBubble();
            }
        }, 50);
    }
});

// Remove old cursor trail elements
document.querySelectorAll('.cursor-trail').forEach(trail => trail.remove());

// Ripple effect
const rippleElements = document.querySelectorAll('.ripple');

rippleElements.forEach(element => {
    element.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple-effect');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size/2 + 'px';
        ripple.style.top = e.clientY - rect.top - size/2 + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Form toggle functionality
function showForm(formType) {
    const forms = document.querySelectorAll('.form-matrix');
    const options = document.querySelectorAll('.toggle-option');
    
    forms.forEach(form => form.style.display = 'none');
    options.forEach(option => option.classList.remove('active'));
    
    document.getElementById(formType + 'Form').style.display = 'grid';
    event.target.classList.add('active');
}

// Fund selection
function selectFund(element) {
    const options = document.querySelectorAll('#donateForm .toggle-option');
    options.forEach(option => option.classList.remove('active'));
    element.classList.add('active');
}

// Skill selection
function selectSkill(element) {
    const options = document.querySelectorAll('#volunteerForm .toggle-option');
    options.forEach(option => option.classList.remove('active'));
    element.classList.add('active');
}

// Quote Carousel Functionality
let currentQuoteIndex = 0;
const quotes = document.querySelectorAll('.quote-slide');
const totalQuotes = quotes.length;

function updateQuoteDisplay() {
    quotes.forEach((quote, index) => {
        if (index === currentQuoteIndex) {
            quote.classList.add('active');
        } else {
            quote.classList.remove('active');
        }
    });
}

function nextQuote() {
    currentQuoteIndex = (currentQuoteIndex + 1) % totalQuotes;
    updateQuoteDisplay();
}

function prevQuote() {
    currentQuoteIndex = (currentQuoteIndex - 1 + totalQuotes) % totalQuotes;
    updateQuoteDisplay();
}

// Auto-advance quotes every 5 seconds
let quoteInterval = setInterval(nextQuote, 5000);

// Pause auto-advance when hovering over quotes
document.querySelector('.quote-container').addEventListener('mouseenter', () => {
    clearInterval(quoteInterval);
});

// Resume auto-advance when mouse leaves
document.querySelector('.quote-container').addEventListener('mouseleave', () => {
    quoteInterval = setInterval(nextQuote, 5000);
});

// Initialize quote display
updateQuoteDisplay();

// Map initialization
let map;
let marker;
let emergencyLayer;

function initMap() {
    // Initialize map centered on India with a closer zoom level
    map = L.map('emergencyMap').setView([20.5937, 78.9629], 6);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Initialize emergency layer
    emergencyLayer = L.layerGroup().addTo(map);

    // Add coordinate input event listeners
    const coordInput = document.getElementById('coordinates');
    coordInput.addEventListener('input', handleCoordinateInput);
    coordInput.addEventListener('blur', handleCoordinateInput);
}

// Handle coordinate input
function handleCoordinateInput() {
    const input = document.getElementById('coordinates');
    const value = input.value.trim();
    
    if (!value) return;
    
    const coordinates = value.split(',').map(coord => parseFloat(coord.trim()));
    
    if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
        // Validate latitude (-90 to 90)
        if (coordinates[0] < -90 || coordinates[0] > 90) {
            alert('Latitude must be between -90 and 90 degrees');
            return;
        }
        // Validate longitude (-180 to 180)
        if (coordinates[1] < -180 || coordinates[1] > 180) {
            alert('Longitude must be between -180 and 180 degrees');
            return;
        }
        
        updateMapLocation(coordinates[0], coordinates[1]);
    } else {
        alert('Please enter valid coordinates in the format: latitude, longitude\nExample: 20.5937, 78.9629');
    }
}

// Get current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                updateMapLocation(latitude, longitude);
                document.getElementById('coordinates').value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            },
            error => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please enter coordinates manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Update map location
function updateMapLocation(lat, lng) {
    // Remove existing marker if any
    if (marker) {
        emergencyLayer.removeLayer(marker);
    }

    // Add new marker
    marker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'emergency-marker',
            iconSize: [20, 20]
        })
    }).addTo(emergencyLayer);

    // Center map on new location with a closer zoom level
    map.setView([lat, lng], 12);
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', initMap);

// Statistics animation
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize statistics animation
function initStatsAnimation() {
    const statsElements = document.querySelectorAll('.tech-section .stats');
    const targetValues = [15000, 2100000, 850];
    
    statsElements.forEach((element, index) => {
        animateValue(element, 0, targetValues[index], 2000);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initStatsAnimation();
    // ... rest of your initialization code ...
});

// Medical Form Handling
function openMedicalForm() {
    const modal = document.getElementById('medicalFormModal');
    modal.style.display = 'block';
}

function closeMedicalForm() {
    const modal = document.getElementById('medicalFormModal');
    modal.style.display = 'none';
}

async function handleMedicalForm(event) {
    event.preventDefault();
    const formData = {
        patientName: document.getElementById('patientName').value,
        age: document.getElementById('age').value,
        condition: document.getElementById('condition').value,
        severity: document.getElementById('severity').value,
        location: document.getElementById('location').value,
        details: document.getElementById('details').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/medical/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Medical form submitted successfully!');
            document.getElementById('medicalFormModal').style.display = 'none';
        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit form. Please try again.');
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add click event to medical card
    const medicalCard = document.querySelector('.card:nth-child(1)');
    medicalCard.addEventListener('click', openMedicalForm);
    
    // Add close button event
    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', closeMedicalForm);
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('medicalFormModal');
        if (event.target === modal) {
            closeMedicalForm();
        }
    });
});

// Form Handling Functions
function openVolunteerForm() {
    const modal = document.getElementById('volunteerFormModal');
    modal.style.display = 'block';
}

function openTechForm() {
    const modal = document.getElementById('techFormModal');
    modal.style.display = 'block';
}

function closeVolunteerForm() {
    const modal = document.getElementById('volunteerFormModal');
    modal.style.display = 'none';
}

function closeTechForm() {
    const modal = document.getElementById('techFormModal');
    modal.style.display = 'none';
}

async function handleVolunteerForm(event) {
    event.preventDefault();
    const formData = {
        volunteerName: document.getElementById('volunteerName').value,
        volunteerEmail: document.getElementById('volunteerEmail').value,
        volunteerPhone: document.getElementById('volunteerPhone').value,
        volunteerSkills: document.getElementById('volunteerSkills').value,
        volunteerAvailability: document.getElementById('volunteerAvailability').value,
        volunteerExperience: document.getElementById('volunteerExperience').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/volunteer/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Volunteer form submitted successfully!');
            document.getElementById('volunteerFormModal').style.display = 'none';
        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit form. Please try again.');
    }
}

async function handleTechForm(event) {
    event.preventDefault();
    const formData = {
        organization: document.getElementById('organization').value,
        contactPerson: document.getElementById('contactPerson').value,
        contactEmail: document.getElementById('contactEmail').value,
        equipmentType: document.getElementById('equipmentType').value,
        quantity: document.getElementById('quantity').value,
        urgency: document.getElementById('urgency').value,
        techDetails: document.getElementById('techDetails').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/tech/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Tech equipment form submitted successfully!');
            document.getElementById('techFormModal').style.display = 'none';
        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit form. Please try again.');
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add close button events
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});
