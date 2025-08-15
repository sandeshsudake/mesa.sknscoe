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

    // --- AI INSIGHTS FEATURE ---
    // AI Insights Modal Elements
    const aiInsightsModal = document.getElementById('aiInsightsModal');
    const aiInsightsModalClose = document.getElementById('aiInsightsModalClose');
    const aiEventNameSpan = document.getElementById('aiEventName');
    const aiInsightsLoader = document.getElementById('aiInsightsLoader');
    const aiInsightsContent = document.getElementById('aiInsightsContent');
    const aiInsightsText = document.getElementById('aiInsightsText');
    const aiInsightsError = document.getElementById('aiInsightsError');
    const aiInsightsErrorText = document.getElementById('aiInsightsErrorText');

    // Reusing your existing openModal/closeModal functions (ensure they are defined globally or within this scope)
    // If you don't have them, add them here:
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

    // Function to convert basic markdown to HTML
    function convertMarkdownToHtml(markdownText) {
        let htmlText = markdownText;
        // Convert bold: **text** to <strong>text</strong>
        htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Convert bullet points: - item to <li>item</li> within an <ul>
        // This is a basic conversion; for complex lists, a dedicated markdown parser is better.
        // It assumes bullet points are at the start of a line.
        htmlText = htmlText.replace(/^- (.*)$/gm, '<li>$1</li>');
        if (htmlText.includes('<li>')) {
            htmlText = '<ul>' + htmlText + '</ul>';
        }
        // Convert newlines to <br> for basic line breaks
        htmlText = htmlText.replace(/\n/g, '<br>');
        return htmlText;
    }


    // Function to open the AI Insights modal and fetch data
    function openAiInsightsModal(eventName, eventDesc, eventDay, eventMonth, eventTime, eventLocation) {
        if (!aiInsightsModal) return;

        // Reset modal content
        aiEventNameSpan.textContent = eventName;
        aiInsightsText.textContent = '';
        aiInsightsContent.classList.add('hidden');
        aiInsightsError.classList.add('hidden');
        aiInsightsErrorText.textContent = '';
        aiInsightsLoader.classList.remove('hidden'); // Show loader

        openModal(aiInsightsModal); // Use your existing openModal function

        // Construct the REVISED prompt for the AI
        const prompt = `Provide a concise, professional summary for a mechanical engineering student about the event: "${eventName}".\n\n` +
                       `Event Details:\n` +
                       `- Description: ${eventDesc}\n` +
                       `- Date: ${eventDay} ${eventMonth}\n` +
                       `- Time: ${eventTime}\n` +
                       `- Location: ${eventLocation}\n\n` +
                       `Your response should be structured as follows:\n` +
                       `1. **Event Overview:** A very brief, engaging sentence.\n` +
                       `2. **Key Benefits for ME Students:** Use 3-4 concise bullet points.\n` +
                       `3. **Why Attend?** A short, impactful concluding sentence.\n\n` +
                       `Maintain a professional and encouraging tone. Limit the entire response to 80-120 words.`;

        // Make API call to your Spring Boot backend
        fetch('/api/ai-insights', { // Your new Spring Boot endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include CSRF token if your API is not excluded from CSRF protection
                'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').content // Assuming CSRF token meta tag
            },
            body: JSON.stringify({ prompt: prompt })
        })
        .then(response => {
            if (!response.ok) {
                // If response is not OK (e.g., 400, 500), throw an error
                return response.json().then(errorData => {
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            aiInsightsLoader.classList.add('hidden'); // Hide loader
            if (data.status === 'success') {
                // Use innerHTML and convert markdown to HTML
                aiInsightsText.innerHTML = convertMarkdownToHtml(data.response);
                aiInsightsContent.classList.remove('hidden'); // Show content
            } else {
                aiInsightsErrorText.textContent = data.message || 'Failed to generate insights.';
                aiInsightsError.classList.add('hidden'); // Show error
            }
        })
        .catch(error => {
            console.error('Error fetching AI insights:', error);
            aiInsightsLoader.classList.add('hidden'); // Hide loader
            aiInsightsErrorText.textContent = 'Failed to connect to AI service or generate insights. Please try again later.';
            aiInsightsError.classList.remove('hidden'); // Show error
        });
    }

    // Event Listeners for AI Insights Button
    const eventsCarousel = document.getElementById('eventsCarousel');
    if (eventsCarousel) {
        eventsCarousel.addEventListener('click', function(e) {
            // Check if the clicked element is the AI Insights button or its child icon
            if (e.target.classList.contains('ai-insights-btn') || e.target.closest('.ai-insights-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.ai-insights-btn'); // Get the button element
                const eventCard = btn.closest('.event-card'); // Get the parent event card

                if (eventCard) {
                    // Extract data from data-attributes
                    const eventName = eventCard.dataset.eventName;
                    const eventDesc = eventCard.dataset.eventDesc;
                    const eventDay = eventCard.dataset.eventDay;
                    const eventMonth = eventCard.dataset.eventMonth;
                    const eventTime = eventCard.dataset.eventTime;
                    const eventLocation = eventCard.dataset.eventLocation;

                    openAiInsightsModal(eventName, eventDesc, eventDay, eventMonth, eventTime, eventLocation);
                }
            }
        });
    }

    // Close AI Insights modal
    if (aiInsightsModalClose) {
        aiInsightsModalClose.addEventListener('click', () => closeModal(aiInsightsModal));
    }
    if (aiInsightsModal) {
        aiInsightsModal.addEventListener('click', (e) => {
            if (e.target === aiInsightsModal) closeModal(aiInsightsModal);
        });
    }





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

//if (eventRegisterForm) {
//    eventRegisterForm.addEventListener('submit', function(e) {
//        const toast = document.getElementById('registerToast');
//        const toastText = toast?.querySelector('.toast-text');
//        if (toast && toastText) {
//            toastText.textContent = "🎉 Event registration successful! Check your email for details.";
//            toast.classList.add('active');
//            setTimeout(() => toast.classList.remove('active'), 3500);
//        }
//    });
//}

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

// Query all logout buttons with classes 'logout-btn' or 'logout-btn-as-link'
const logoutButtons = document.querySelectorAll('.logout-btn, .logout-btn-as-link');

 logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent immediate form submit

            Swal.fire({
                title: 'Are you sure?',
                text: "You will be logged out from your session.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, log me out!',
                cancelButtonText: 'No, stay logged in'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Submit the closest form enclosing the button
                    const form = e.target.closest('form');
                    if (form) {
                        form.submit();
                    }
                }
            });
        });
 });




// Add this inside your attachEventRegisterListeners function
// or in a new function called on DOMContentLoaded
const registerEventForm = document.getElementById('eventRegisterForm');
const registerSubmitBtn = document.getElementById('registerEventSubmitBtn');
const registerBtnText = registerSubmitBtn ? registerSubmitBtn.querySelector('.button-text') : null;
const registerBtnSpinner = registerSubmitBtn ? registerSubmitBtn.querySelector('.spinner') : null;

if (registerEventForm && registerSubmitBtn && registerBtnText && registerBtnSpinner) {
    registerEventForm.addEventListener('submit', function(e) {
        // Prevent default submission initially if you have client-side validation
        // e.preventDefault(); // Uncomment if you need to do client-side validation before showing loading

        // Add loading state
        registerSubmitBtn.classList.add('loading');
        registerSubmitBtn.disabled = true; // Disable the button to prevent multiple clicks
        registerBtnText.classList.add('hidden'); // Hide text
        registerBtnSpinner.classList.remove('hidden'); // Show spinner

        // Since the form submits and causes a page reload,
        // the state will naturally reset on the next page load.
        // If you were doing AJAX, you would reset the state in the AJAX callback.
    });
}