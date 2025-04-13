function fun() {
    document.body.classList.toggle("dark-mode");
  
    const logo = document.getElementById("logoImg");
  
    if (document.body.classList.contains("dark-mode")) {
      logo.src = "C:/Users/nimis/OneDrive/Pictures/anzen dark.jpg"; 

    } else {
      logo.src = "C:/Users/nimis/OneDrive/Pictures/anzen.jpg";
    }
  }
  
