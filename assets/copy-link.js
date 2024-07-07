document.addEventListener('DOMContentLoaded', () => {
    let tooltipTimeout;

    document.getElementById('copy-link-simulation-button').addEventListener('click', function () {
        const url = this.getAttribute('data-simulationUrl');

        navigator.clipboard.writeText(url).then(function () {
            const tooltip = document.getElementById('copy-link-simulation-tooltip');
            tooltip.classList.remove('hidden');

            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
            }

            tooltipTimeout = setTimeout(function () {
                tooltip.classList.add('hidden');
            }, 1500);
        }, function (err) {
            console.error('Could not copy text: ', err);
        });
    });
});
