document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('confirmDeleteModal');
    if (modal) {
        const closeModal = modal.querySelector('.modal .cross');
        const confirmDelete = document.getElementById('confirmDelete');
        const cancelDelete = document.getElementById('cancelDelete');
        let formToDelete, trToDelete;

        document.querySelectorAll('.admin-delete-item').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                formToDelete = form;
                trToDelete = formToDelete.closest('tr');
                modal.style.display = 'flex';
            });
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        cancelDelete.addEventListener('click', () => {
            modal.style.display = 'none';
            formToDelete = null;
        });

        confirmDelete.addEventListener('click', () => {
            if (formToDelete) {
                const formData = new FormData(formToDelete);

                fetch(formToDelete.action, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        if (response.ok) {
                            if (trToDelete) {
                                trToDelete.classList.add('deleting');

                                setTimeout(function () {
                                    trToDelete.remove();
                                }, 500);
                            }
                        } else {
                            return response.json().then(data => {
                                console.error('Error:', data);
                            });
                        }
                    })
                    .catch(error => console.error('Fetch error:', error));
            }
            modal.style.display = 'none';
            formToDelete = null;
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
                formToDelete = null;
            }
        });

        const modalImportActivity = document.getElementById('overwriteConfirmImportActivityModal');
        const closeImportActivityModal = modalImportActivity.querySelector('.modal .cross');
        const confirmOverwrite = document.getElementById('confirmOverwrite');
        const cancelOverwrite = document.getElementById('cancelOverwrite');
        let formToImportActivity;


        document.querySelectorAll('.admin-import-activity').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                formToImportActivity = form;
                submitForm(form);
            });
        });

        closeImportActivityModal.addEventListener('click', () => {
            modalImportActivity.style.display = 'none';
        });

        cancelOverwrite.addEventListener('click', () => {
            modalImportActivity.style.display = 'none';
            formToImportActivity = null;
        });

        confirmOverwrite.addEventListener('click', () => {
            if (formToImportActivity) {
                submitForm(formToImportActivity, true);
            }
            modalImportActivity.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == modalImportActivity) {
                modalImportActivity.style.display = 'none';
                formToImportActivity = null;
            }
        });

        function submitForm(form, overwrite = false) {
            const formData = new FormData(form);
            let actionUrl = form.action;

            if (overwrite) {
                actionUrl += '/overwrite';
            }

            fetch(actionUrl, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        location.reload();
                    } else {
                        if (response.status === 409) {
                            modalImportActivity.style.display = 'flex';
                        } else {
                            return response.json().then(data => {
                                console.error('Error:', data);
                            });
                        }
                    }
                })
                .catch(error => console.error('Fetch error:', error));
        }

        const modalClean = document.getElementById('confirmCleanModal');
        const closeCleanModal = modalClean.querySelector('.modal .cross');
        const confirmClean = document.getElementById('confirmClean');
        const cancelClean = document.getElementById('cancelClean');
        let formToClean;

        document.querySelectorAll('.admin-clean').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                formToClean = form;
                modalClean.style.display = 'flex';
            });
        });

        closeCleanModal.addEventListener('click', () => {
            modalClean.style.display = 'none';
        });

        cancelClean.addEventListener('click', () => {
            modalClean.style.display = 'none';
            formToClean = null;
        });

        confirmClean.addEventListener('click', () => {
            if (formToClean) {
                const formData = new FormData(formToClean);

                fetch(formToClean.action, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        if (response.ok) {
                            location.reload();
                        } else {
                            return response.json().then(data => {
                                console.error('Error:', data);
                            });
                        }
                    })
                    .catch(error => console.error('Fetch error:', error));
            }
            modalClean.style.display = 'none';
            formToClean = null;
        });

        window.addEventListener('click', (event) => {
            if (event.target == modalClean) {
                modalClean.style.display = 'none';
                formToClean = null;
            }
        });
    }
});
