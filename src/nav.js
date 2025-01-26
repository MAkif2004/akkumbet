const hamburgerButton = document.getElementById("hamburger-menu-container");
hamburgerButton.addEventListener("click", () => {
    const navLinks = document.getElementById("nav-links-mobile");
    const hamburgerMenuContainer = document.getElementById("hamburger-menu-container");
    const hamburgerMenuLine = document.getElementsByClassName("hamburger-menu-line");
    if (navLinks.classList.contains("hide")) {
        document.body.style.overflowY = "hidden";
        hamburgerMenuContainer.classList.add("hamburger-menu-closing-container");
        for (let i = 0; i < hamburgerMenuLine.length; i++) {
            if (i === 0 || i === 1) {
                hamburgerMenuLine[i].classList.add("spin-45");
            }
            else if (i === 2) {
                hamburgerMenuLine[i].classList.add("spin-45-backwards");
            }
            hamburgerMenuLine[i].classList.add("hamburger-menu-closing-line");
        }
        navLinks.classList.remove("hide");
    }
    else {
        navLinks.classList.add(("hide"));
        document.body.style.overflowY = "auto";
        hamburgerMenuContainer.classList.remove("hamburger-menu-closing-container");
        for (let i = 0; i < hamburgerMenuLine.length; i++) {
            if (i === 0 || i === 1) {
                hamburgerMenuLine[i].classList.remove("spin-45");
            }
            else if (i === 2) {
                hamburgerMenuLine[i].classList.remove("spin-45-backwards");
            }
            hamburgerMenuLine[i].classList.remove("hamburger-menu-closing-line");
        }
    }
});