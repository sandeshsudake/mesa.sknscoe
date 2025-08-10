// --- Global Data and Utility Functions ---

/**
 * Reads user data from the HTML and populates the profile section.
 */
function populateUserProfileFromHtml() {
    const profileGrid = document.querySelector('.profile-details-grid');
    if (!profileGrid) return;

    // FIX: This line was causing the script to crash because the 'usernameDisplay' span
    // is removed by Thymeleaf when it renders the welcome message.
    // Since Thymeleaf now handles this, the line is no longer needed and has been commented out.
    // document.getElementById('usernameDisplay').textContent = profileGrid.dataset.username;

    document.getElementById('userFullName').textContent = profileGrid.dataset.userFullname;
    document.getElementById('userClass').textContent = profileGrid.dataset.userClass;
    document.getElementById('userBranch').textContent = profileGrid.dataset.userBranch;
    document.getElementById('userCollege').textContent = profileGrid.dataset.userCollege;
    document.getElementById('userEmail').textContent = profileGrid.dataset.userEmail;
    document.getElementById('userMobileNo').textContent = profileGrid.dataset.userMobileno;
}

/**
 * Populates the table of events the user has registered for from HTML.
 */
function populateRegisteredEventsTableFromHtml() {
    const eventsTableBody = document.getElementById('eventsTableBody');
    const noEventsMessage = document.getElementById('noEventsMessage');

    if (eventsTableBody && noEventsMessage) {
        if (eventsTableBody.children.length > 0 && eventsTableBody.querySelector('.event-row')) {
            noEventsMessage.style.display = 'none';
        } else {
            noEventsMessage.style.display = 'block';
        }
    }
}


// --- Main Initialization and Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    populateUserProfileFromHtml();
    populateRegisteredEventsTableFromHtml();

    attachCarouselListeners();
    attachEventRegisterListeners();
    attachEditProfileModalListeners();
});


/**
 * Attaches event listeners for the event carousel navigation and filter chips.
 */
function attachCarouselListeners() {
    const carousel = document.getElementById('eventsCarousel');
    const leftBtn = document.getElementById('carouselLeft');
    const rightBtn = document.getElementById('carouselRight');

    if (carousel && leftBtn && rightBtn) {
        leftBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -350, behavior: 'smooth' });
        });
        rightBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 350, behavior: 'smooth' });
        });
    }

    document.querySelectorAll('.event-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.event-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            // FIX: This function was not defined in your code and would cause an error on click.
            // It is commented out. You can implement it later if needed.
            // filterEvents(filter);
        });
    });
}

// --- Modals and General UI Logic ---
// Hamburger menu toggle for mobile
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function toggleMenu() {
    if (navLinks && hamburger) {
        navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    }
}
if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
    navLinks.querySelectorAll('a, form').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 900 && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Event registration modal logic
const eventRegisterModal = document.getElementById('eventRegisterModal');
const eventRegisterModalClose = document.getElementById('eventRegisterModalClose');
const eventRegisterForm = document.getElementById('eventRegisterForm');

// Event link modal logic
const eventLinkModal = document.getElementById('eventLinkModal');
const eventLinkModalClose = document.getElementById('eventLinkModalClose');
const googleFormLink = document.getElementById('googleFormLink');

// --- Edit Profile Modal Logic ---
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileModal = document.getElementById('editProfileModal');
const editProfileModalClose = document.getElementById('editProfileModalClose');
const editProfileForm = document.getElementById('editProfileForm');

function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

if (eventRegisterModalClose) eventRegisterModalClose.addEventListener('click', () => closeModal(eventRegisterModal));
if (eventRegisterModal) eventRegisterModal.addEventListener('click', e => { if (e.target === eventRegisterModal) closeModal(eventRegisterModal); });
if (eventLinkModalClose) eventLinkModalClose.addEventListener('click', () => closeModal(eventLinkModal));
if (eventLinkModal) eventLinkModal.addEventListener('click', e => { if (e.target === eventLinkModal) closeModal(eventLinkModal); });
if (editProfileModalClose) editProfileModalClose.addEventListener('click', () => closeModal(editProfileModal));
if (editProfileModal) editProfileModal.addEventListener('click', e => { if (e.target === editProfileModal) closeModal(editProfileModal); });

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal(eventRegisterModal);
        closeModal(eventLinkModal);
        closeModal(editProfileModal);
    }
});


function attachEventRegisterListeners() {
    // FIX: Use event delegation by attaching the listener to the carousel itself.
    // This is more reliable for dynamically created buttons.
    const carousel = document.getElementById('eventsCarousel');
    if (!carousel) return;

    carousel.addEventListener('click', e => {
        // Check if the clicked element is a register button
        if (e.target.classList.contains('event-register')) {
            e.preventDefault();
            const eventCard = e.target.closest('.event-card');
            if (!eventCard) return;

            const regType = eventCard.dataset.regType;
            const eventName = eventCard.querySelector('.event-info h3')?.textContent || '';

            if (regType === 'form') {
                const eventId = eventCard.dataset.id || '';
                const profileGrid = document.querySelector('.profile-details-grid');
                if (profileGrid) {
                    document.getElementById('studentName').value = profileGrid.dataset.userFullname;
                    document.getElementById('studentClass').value = profileGrid.dataset.userClass;
                    document.getElementById('branch').value = profileGrid.dataset.userBranch;
                    document.getElementById('collegeName').value = profileGrid.dataset.userCollege;
                    document.getElementById('email').value = profileGrid.dataset.userEmail;
                    document.getElementById('mobileNo').value = profileGrid.dataset.userMobileno;
                }
                document.getElementById('modalEventId').value = eventId;
                document.getElementById('eventName').value = eventName;
                const eventQrImage = eventCard.querySelector('.event-qr-code');
                const qrImgUrl = eventQrImage ? eventQrImage.src : '';
                const modalQrImage = document.getElementById('qrCodeImageInModal');
                if (modalQrImage) {
                   modalQrImage.src = qrImgUrl;
                }
               openModal(eventRegisterModal);
            } else if (regType === 'link') {
                if (googleFormLink) {
                    googleFormLink.href = e.target.href;
                    openModal(eventLinkModal);
                }
            }
        }
    });
}

if (eventRegisterForm) {
    eventRegisterForm.addEventListener('submit', function(e) {
        const toast = document.getElementById('registerToast');
        const toastText = toast?.querySelector('.toast-text');
        if (toast && toastText) {
            toastText.textContent = "🎉 Event registration successful! Check your email for details.";
            toast.classList.add('active');
            setTimeout(() => toast.classList.remove('active'), 3500);
        }
    });
}

function attachEditProfileModalListeners() {
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            const profileGrid = document.querySelector('.profile-details-grid');
            if (profileGrid) {
                const welcomeText = document.querySelector('.welcome-text')?.textContent || 'Welcome, User!';
                const username = welcomeText.replace('Welcome, ', '').replace('!', '');
                document.getElementById('editUsername').value = username;
                document.getElementById('editFullName').value = profileGrid.dataset.userFullname;
                document.getElementById('editClass').value = profileGrid.dataset.userClass;
                document.getElementById('editBranch').value = profileGrid.dataset.userBranch;
                document.getElementById('editCollege').value = profileGrid.dataset.userCollege;
                document.getElementById('editEmail').value = profileGrid.dataset.userEmail;
                document.getElementById('editMobileNo').value = profileGrid.dataset.userMobileno;
            }
            openModal(editProfileModal);
        });
    }
}
