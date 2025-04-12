const header = document.querySelector("header");
let prevScrollPos = window.pageYOffset;
window.onscroll = function () {
  let currentScrollPos = window.pageYOffset;
  prevScrollPos > currentScrollPos
    ? header.classList.remove("scroll")
    : header.classList.add("scroll");
  prevScrollPos = currentScrollPos;
};


// Counter Animation
const counter = document.getElementById("counter");
const counter1=document.getElementById("counter1");
let current = 1000;
let current1=7500;

// Function to animate count-up to new value
function animateTo(target) {
  const duration = 800; // ms
  const frames = 30;
  const increment = (target - current) / frames;
  let frame = 0;

  const animate = () => {
    if (frame < frames) {
      current += increment;
      counter.textContent = Math.floor(current).toLocaleString() + "+";
      frame++;
      requestAnimationFrame(animate);
    } else {
      current = target;
      counter.textContent = target.toLocaleString() + "+";
    }
  };

  animate();
}



function animateTo1(target1) {
  const duration1 = 500; // ms
  const frames1 = 30;
  const increment1 = (target1 - current1) / frames1;
  let frame1 = 0;

  const animate1 = () => {
    if (frame1 < frames1) {
      current1 += increment1;
      counter1.textContent = Math.floor(current1).toLocaleString() + "+";
      frame1++;
      requestAnimationFrame(animate1);
    } else {
      current1 = target1;
      counter1.textContent = target1.toLocaleString() + "+";
    }
  };

  animate1();
}
function updateCounterRandomly1() 
{
  const extra1 = Math.floor(Math.random() * 4) + 1; // add 1–10
  const newTarget1 = current1 + extra1;
  animateTo1(newTarget1);

  // Call again after 2–4 sec
  const nextUpdate1 = Math.random() * 2000 + 2000;
  setTimeout(updateCounterRandomly1, nextUpdate1);
}
counter1.textContent1 = current1.toLocaleString() + "+";
setTimeout(updateCounterRandomly1, 1000);




// Random update every 2–4 seconds
function updateCounterRandomly() {
  const extra = Math.floor(Math.random() * 15) + 1; // add 1–10
  const newTarget = current + extra;
  animateTo(newTarget);

  // Call again after 2–4 sec
  const nextUpdate = Math.random() * 2000 + 2000;
  setTimeout(updateCounterRandomly, nextUpdate);
}

// Initialize
counter.textContent = current.toLocaleString() + "+";
setTimeout(updateCounterRandomly, 1000);
