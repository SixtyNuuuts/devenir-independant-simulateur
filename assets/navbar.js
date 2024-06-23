document.addEventListener('DOMContentLoaded', () => {
    const burgerMenuBtn = document.getElementById('burgerMenuBtn');
    const burgerMenu = document.getElementById('burgerMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const burgerMenuCross = document.querySelector('#burgerMenu > .cross');

    const accountMenuBtn = document.getElementById('accountMenuBtn');
    const accountDropdown = document.getElementById('accountDropdown');

    burgerMenuBtn.addEventListener('click', () => {
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


    document.addEventListener('click', (event) => {
        const isClickInsideDropdown = accountDropdown.contains(event.target);
        const isClickInMenuBtn = event.target.classList.contains('navbar-user-icon');

        if (isClickInMenuBtn) {
            accountDropdown.classList.toggle('open');
        } else if (!isClickInsideDropdown) {
            accountDropdown.classList.remove('open');
        }
    });

    document.querySelectorAll('.delete-simulation').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        var liElement = form.closest('li');
                        if (liElement) {
                            liElement.remove();
                        }
                    } else {
                        return response.json().then(data => {
                            console.error('Error:', data);
                        });
                    }
                })
                .catch(error => console.error('Fetch error:', error));
        });
    });
});
