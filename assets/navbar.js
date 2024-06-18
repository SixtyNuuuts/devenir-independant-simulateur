document.addEventListener('DOMContentLoaded', () => {
    const burgerMenuBtn = document.getElementById('burgerMenuBtn');
    const burgerMenu = document.getElementById('burgerMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const burgerMenuCross = document.querySelector('#burgerMenu > .cross');

    const accountMenuBtn = document.getElementById('accountMenuBtn');
    const accountDropdown = document.getElementById('accountDropdown');

    burgerMenuBtn.addEventListener('click', () => {
        console.log('clicked');
        burgerMenuBtn.classList.toggle('open');
        burgerMenu.classList.toggle('open');
        menuOverlay.classList.toggle('open');
        document.body.classList.toggle('overflow-hidden');
    });

    burgerMenuCross.addEventListener('click', () => {
        burgerMenuBtn.classList.remove('open');
        burgerMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.classList.remove('overflow-hidden');
    });

    menuOverlay.addEventListener('click', () => {
        burgerMenuBtn.classList.remove('open');
        burgerMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.classList.remove('overflow-hidden');
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
