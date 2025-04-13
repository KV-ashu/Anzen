// Form handling
const options = document.querySelectorAll('.option');
const contactForm = document.getElementById('contactForm');
const ngoFields = document.querySelectorAll('.ngo-fields');

options.forEach(option => {
    option.addEventListener('click', () => {
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        contactForm.classList.remove('hidden');
        const isNGO = option.dataset.type === 'ngo';
        
        ngoFields.forEach(field => {
            if (isNGO) {
                field.classList.remove('hidden');
            } else {
                field.classList.add('hidden');
            }
        });
    });
});

// Form submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your server
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // For demo purposes, we'll just log the data
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
});

