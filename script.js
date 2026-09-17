const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#main-nav");

navToggle?.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(opened));
});

document.querySelectorAll("#main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
