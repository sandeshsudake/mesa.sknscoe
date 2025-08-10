// Function to simulate fetching and displaying dashboard data
function loadDashboardData() {
    const data = {
        totalEvents: 12,
        totalRegistrations: 256,
        totalFrf: 42,
        totalUsers: 850
    };

    document.getElementById('totalEvents').textContent = data.totalEvents;
    document.getElementById('totalRegistrations').textContent = data.totalRegistrations;
    document.getElementById('totalFrf').textContent = data.totalFrf;
    document.getElementById('totalUsers').textContent = data.totalUsers;
}

// --- Modal and Form Logic ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const addEventBtn = document.getElementById('addEventBtn');
const addEventModal = document.getElementById('addEventModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const eventForm = document.getElementById('eventForm');

const addGoogleFormEventBtn = document.getElementById('addGoogleFormEventBtn');
const googleFormModal = document.getElementById('googleFormModal');
const googleFormModalCloseBtn = document.getElementById('googleFormModalCloseBtn');
const googleFormEventForm = document.getElementById('googleFormEventForm');

const toastContainer = document.getElementById('toastContainer');
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');
const deleteCancelBtn = document.getElementById('deleteCancelBtn');
let eventToDeleteId = null;

const addAdminBtn = document.getElementById('addAdminBtn');
const addAdminModal = document.getElementById('addAdminModal');
const addAdminModalCloseBtn = document.getElementById('addAdminModalCloseBtn');
const addAdminForm = document.getElementById('addAdminForm');


function toggleMenu() {
    if (navLinks && hamburger) {
        navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    }
}

if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Event handlers for opening/closing modals
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Logic for Add Event (PMF) modal
if (addEventBtn && addEventModal && modalCloseBtn && eventForm) {
    addEventBtn.addEventListener('click', () => {
        eventForm.reset();
        document.getElementById('modalTitle').textContent = 'Add New Event';
        document.getElementById('submitBtn').textContent = 'Save Event';
        openModal(addEventModal);
    });
    modalCloseBtn.addEventListener('click', () => closeModal(addEventModal));
    addEventModal.addEventListener('click', (e) => {
        if (e.target === addEventModal) {
            closeModal(addEventModal);
        }
    });
}

// Logic for Add Google Form Event modal
if (addGoogleFormEventBtn && googleFormModal && googleFormModalCloseBtn && googleFormEventForm) {
    addGoogleFormEventBtn.addEventListener('click', () => {
        googleFormEventForm.reset();
        document.getElementById('googleFormModalTitle').textContent = 'Add New G-Form Event';
        document.getElementById('googleFormSubmitBtn').textContent = 'Save Event';
        openModal(googleFormModal);
    });
    googleFormModalCloseBtn.addEventListener('click', () => closeModal(googleFormModal));
    googleFormModal.addEventListener('click', (e) => {
        if (e.target === googleFormModal) {
            closeModal(googleFormModal);
        }
    });
}

// Logic for Add Admin modal
if (addAdminBtn && addAdminModal && addAdminModalCloseBtn && addAdminForm) {
    addAdminBtn.addEventListener('click', () => {
        addAdminForm.reset();
        openModal(addAdminModal);
    });
    addAdminModalCloseBtn.addEventListener('click', () => closeModal(addAdminModal));
    addAdminModal.addEventListener('click', (e) => {
        if (e.target === addAdminModal) {
            closeModal(addAdminModal);
        }
    });
}


// Function to show toast notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Function to populate the form for editing an event
function populateEditForm(eventId, row) {
    const tableId = row.closest('table').id;

    const data = {
        eventName: row.querySelector('[data-label="Event Name"]').textContent,
        eventDay: row.querySelector('[data-label="Day"]').textContent,
        eventMonth: row.querySelector('[data-label="Month"]').textContent,
        eventTime: row.querySelector('[data-label="Time"]').textContent,
        eventLocation: row.querySelector('[data-label="Location"]').textContent,
        eventDescription: row.querySelector('[data-label="Description"]').textContent,
        regFees: row.querySelector('[data-label="Reg. Fees"]').textContent,
        eventRegLink: tableId === 'googleFormEventTable' ? row.querySelector('.link-icon').href : null,
    };

    if (tableId === 'eventManagementTable') {
        const form = document.getElementById('eventForm');
        document.getElementById('modalTitle').textContent = 'Edit Event';
        document.getElementById('submitBtn').textContent = 'Update Event';
        form.querySelector('#pmfEventId').value = eventId;
        form.querySelector('#eventName').value = data.eventName;
        form.querySelector('#eventDay').value = data.eventDay;
        form.querySelector('#eventMonth').value = data.eventMonth;
        form.querySelector('#eventTime').value = data.eventTime;
        form.querySelector('#eventLocation').value = data.eventLocation;
        form.querySelector('#eventDescription').value = data.eventDescription;
        form.querySelector('#regFees').value = data.regFees;
        openModal(addEventModal);
    } else if (tableId === 'googleFormEventTable') {
        const form = document.getElementById('googleFormEventForm');
        document.getElementById('googleFormModalTitle').textContent = 'Edit G-Form Event';
        document.getElementById('googleFormSubmitBtn').textContent = 'Update Event';
        form.querySelector('#gformEventId').value = eventId;
        form.querySelector('#googleFormEventName').value = data.eventName;
        form.querySelector('#googleFormEventDay').value = data.eventDay;
        form.querySelector('#googleFormEventMonth').value = data.eventMonth;
        form.querySelector('#googleFormEventTime').value = data.eventTime;
        form.querySelector('#googleFormEventLocation').value = data.eventLocation;
        form.querySelector('#googleFormEventDescription').value = data.eventDescription;
        form.querySelector('#googleFormRegFees').value = data.regFees;
        form.querySelector('#googleFormLink').value = data.eventRegLink;
        openModal(googleFormModal);
    }
}

// Event delegation for action icons (edit, delete) for PMF events
document.getElementById('eventTableBody').addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;
    const eventId = row.dataset.id;
    if (e.target.classList.contains('edit-icon')) {
        populateEditForm(eventId, row);
    } else if (e.target.classList.contains('delete-icon')) {
        eventToDeleteId = eventId;
        openModal(deleteConfirmModal);
    }
});

// Event delegation for action icons (edit, delete) for G-Form events
document.getElementById('googleFormEventTableBody').addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;
    const eventId = row.dataset.id;
    if (e.target.classList.contains('edit-icon')) {
        populateEditForm(eventId, row);
    } else if (e.target.classList.contains('delete-icon')) {
        eventToDeleteId = eventId;
        openModal(deleteConfirmModal);
    }
});


document.getElementById('adminTableBody').addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;
    const adminId = row.dataset.id;
    if (e.target.classList.contains('edit-icon')) {
        console.log('Editing admin with ID:', adminId);
        showToast('Editing feature for admin not yet implemented.', 'info');
    } else if (e.target.classList.contains('delete-icon')) {
        eventToDeleteId = adminId;
        openModal(deleteConfirmModal);
    }
});

// Delete confirmation modal logic
if (deleteConfirmBtn && deleteCancelBtn && deleteConfirmModal) {
    deleteConfirmBtn.addEventListener('click', () => {
        // Create a temporary form to submit the delete request
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/deleteEvent';

        // Add the eventId as a hidden input
        const eventIdInput = document.createElement('input');
        eventIdInput.type = 'hidden';
        eventIdInput.name = 'eventId';
        eventIdInput.value = eventToDeleteId;
        form.appendChild(eventIdInput);

        // Append the form to the body and submit it
        document.body.appendChild(form);
        form.submit();
    });
    deleteCancelBtn.addEventListener('click', () => closeModal(deleteConfirmModal));
    deleteConfirmModal.addEventListener('click', (e) => {
        if (e.target === deleteConfirmModal) {
            closeModal(deleteConfirmModal);
        }
    });
}

// The 'eventForm' submission listener is removed, as it's no longer needed.
// The browser will handle the form submission.

// Logout functionality
const logoutButton = document.querySelector('.logout-btn');
if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        alert('You have been logged out!');
        window.location.href = 'index.html';
    });
}

// Initial data load on page load
window.onload = loadDashboardData;