document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".mobilemenu");
  const navList = document.querySelector(".navlist");

  menuBtn.addEventListener("click", () => {
    navList.classList.toggle("ativo");
    menuBtn.classList.toggle("open");
  });
});
