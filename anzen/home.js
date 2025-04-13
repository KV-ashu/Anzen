const header = document.querySelector("header");
let prevScrollPos = window.pageYOffset;
window.onscroll = function () {
  let currentScrollPos = window.pageYOffset;
  prevScrollPos > currentScrollPos
    ? header.classList.remove("scroll")
    : header.classList.add("scroll");
  prevScrollPos = currentScrollPos;
};
// let btn = document.querySelector("#btn");
// let sidebar = document.querySelector(".sidebar");
// let searchbtn = document.querySelector(".bx-search-alt");
// let textHatao = document.querySelector(".links_name");

// btn.onclick = function () {
//   sidebar.classList.toggle("active");
// };
// sidebar.onclick = function () {
//   sidebar.classList.toggle("active");
//   textHatao.classList.toggle("naitik");
// //   sidebar.classList.toggle("sidebar");
// };
// searchbtn.onclick = function () {
//   sidebar.classList.toggle("active");
// };




let token = null;

    function openModal() {
      document.getElementById("authModal").style.display = "flex";
    }

    function closeModal() {
      document.getElementById("authModal").style.display = "none";
    }

    function toggleForm() {
      const signin = document.getElementById("signin");
      const signup = document.getElementById("signup");
      signin.style.display = signin.style.display === "none" ? "block" : "none";
      signup.style.display = signup.style.display === "none" ? "block" : "none";
    }

    function handleSignUp() {
      const email = document.getElementById("signup-email").value;
      const phone = document.getElementById("signup-phone").value;
      const about = document.getElementById("signup-about").value;
      const password = document.getElementById("signup-password").value;
      const confirm = document.getElementById("signup-confirm").value;

      if (phone.length !== 10) {
        return alert("Phone number must be 10 digits.");
      }
      if (password !== confirm) {
        return alert("Passwords do not match.");
      }

      fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, about, password })
      })  
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(() => alert("Signup failed"));
    }

    function handleSignIn() {
      const email = document.getElementById("signin-email").value;
      const password = document.getElementById("signin-password").value;
    
      fetch('/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) 
      })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("authToken", data.token); // ✅ store the token
          window.location.href = "profile.html";         // ✅ redirect to profile page
        } else {
          alert(data.message);
        }
      });
    }
    function loadProfile() {
      const token = localStorage.getItem("authToken");
    
      if (!token) {
        alert("Please login first.");
        return;
      }
    
      // Optional: validate token with a quick check before redirect
      fetch('/profile', {
        headers: { Authorization: Bearer ${token} }
      })
      .then(res => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then(data => {
        // ✅ Token is valid, go to profile page
        window.location.href = "profile.html";
      })
      .catch(err => {
        console.error("Error verifying token:", err);
        alert("Session expired. Please login again.");
        localStorage.removeItem("authToken");
      });
    }
    











// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 50);
});

// Cursor effects on hover
document.querySelectorAll('.hover-effect').forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// Counter Animation
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
    } else {
            element.textContent = target + '+';
        }
    };
    updateCounter();
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'counter') {
                animateCounter(entry.target, 1000, 2000);
            } else if (entry.target.id === 'counter1') {
                animateCounter(entry.target, 7500, 2000);
            }
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('#counter, #counter1').forEach(counter => {
    observer.observe(counter);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Video background effect
const video = document.querySelector('video');
if (video) {
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    
    // Add parallax effect to video
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        video.style.transform = 'translate(-50%, -50%) scale(1.1) translate(${x}px, ${y}px)';
    });
}

// Header scroll effect
const pageHeader = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll) {
        pageHeader.style.transform = 'translateY(-100%)';
    } else {
        pageHeader.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('bx-menu');
        icon.classList.toggle('bx-x');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('bx-x');
            icon.classList.add('bx-menu');
        }
    });

    // Handle scroll events
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Header scroll effect
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide header on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        // Scroll progress indicator
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const progress = (currentScroll / documentHeight) * 100;
        scrollProgress.style.transform = 'scaleX(${progress / 100})';

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effect to navigation items
    const navItems = document.querySelectorAll('nav a');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) { // Only on desktop
                item.style.transform = 'translateY(-3px)';
            }
        });
        item.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) { // Only on desktop
                item.style.transform = 'translateY(0)';
            }
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        }, 250);
    });
});
