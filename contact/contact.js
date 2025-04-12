
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

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('Form submitted:', data);
    
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
});
