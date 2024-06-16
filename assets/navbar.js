document.addEventListener('DOMContentLoaded', () => {
    const burgerMenuBtn = document.getElementById('burgerMenuBtn');
    const burgerMenu = document.getElementById('burgerMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const accountMenuBtn = document.getElementById('accountMenuBtn');
    const accountDropdown = document.getElementById('accountDropdown');

    burgerMenuBtn.addEventListener('click', () => {
        burgerMenuBtn.classList.toggle('open');
        burgerMenu.classList.toggle('open');
        menuOverlay.classList.toggle('open');
    });

    menuOverlay.addEventListener('click', () => {
        burgerMenuBtn.classList.remove('open');
        burgerMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
    });

    accountMenuBtn.addEventListener('click', () => {
        accountDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
        if (!accountMenuBtn.contains(event.target) && !accountDropdown.contains(event.target)) {
            accountDropdown.classList.remove('open');
        }
    });
});
