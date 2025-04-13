function fun() {
    document.body.classList.toggle("dark-mode");
  
    const logo = document.getElementById("logoImg");
  
    if (document.body.classList.contains("dark-mode")) {
      logo.src = "anzend.jpg"; 

    } else {
      logo.src = "anzen.jpg";
    }
  }
  
