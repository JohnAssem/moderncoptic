const menuIcon = document.getElementById('menuBarIcon');
const sidebarMenu = document.getElementById('sidebarMenu');

menuIcon.addEventListener('click', () => {
    sidebarMenu.classList.toggle('minimized');
});
