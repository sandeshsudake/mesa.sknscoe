// Get all necessary elements from the DOM
const registrationForm = document.getElementById('registrationForm');
const sliderSubmit = document.getElementById('sliderSubmit');
const sliderHandle = sliderSubmit?.querySelector('.slider-handle');
const registerToast = document.getElementById('registerToast');
const toastText = registerToast?.querySelector('.toast-text');
const toastProgress = registerToast?.querySelector('.toast-progress');

/**
 * Shows a toast notification with a given message.
 * @param {string} message The message to display.
 * @param {string} type The type of toast ('success' or 'error').
 */
function showToast(message, type) {
    if (registerToast && toastText) {
        toastText.textContent = message;
        registerToast.className = 'register-toast'; // Reset classes
        registerToast.classList.add('active', type);

        // Reset and animate the progress bar
        if (toastProgress) {
            toastProgress.style.animation = 'none';
            void toastProgress.offsetWidth; // Trigger reflow to restart animation
            toastProgress.style.animation = '';
        }

        setTimeout(() => registerToast.classList.remove('active'), 3500);
    }
}

// Check if the required elements exist before adding event listeners
if (sliderHandle && sliderSubmit && registrationForm) {
    let isDragging = false,
        startX = 0,
        currentX = 0,
        max = 0;

    function recalcMax() {
        max = sliderSubmit.offsetWidth - sliderHandle.offsetWidth;
    }

    function setHandle(x) {
        recalcMax();
        x = Math.max(0, Math.min(x, max));
        sliderHandle.style.left = x + 'px';

        sliderSubmit.style.background = `linear-gradient(90deg, #43a047 ${(x + sliderHandle.offsetWidth / 2) / sliderSubmit.offsetWidth * 100}%, #e6f0fa 0%)`;

        if (x >= max - 5) {
            if (registrationForm.checkValidity()) {
                sliderSubmit.classList.add('submitted');
                setTimeout(() => {
                    // Trigger the form submission logic here, instead of a simple event
                    handleFormSubmission();
                }, 250);
            } else {
                setHandle(0);
                sliderSubmit.classList.remove('submitted');
                sliderSubmit.style.background = '';
                registrationForm.reportValidity();
                showToast("Please fill out all required fields.", "error");
            }
        }
    }

    // --- Form Submission Logic (NEW) ---
    async function handleFormSubmission() {
        // Prevent multiple submissions
        if (registrationForm.dataset.submitting === 'true') {
            return;
        }
        registrationForm.dataset.submitting = 'true';

        // Show a "loading" state
        sliderSubmit.classList.add('loading');
        sliderHandle.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

        try {
            const formData = new FormData(registrationForm);
            const response = await fetch('/addNewUser', {
                method: 'POST',
                body: new URLSearchParams(formData), // Use URLSearchParams for x-www-form-urlencoded
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.redirected) {
                // If Spring successfully saved the user and sent a redirect
                showToast("🎉 Registration successful! Redirecting to login...", "success");
                setTimeout(() => {
                    window.location.href = response.url;
                }, 2000);
            } else {
                // Handle a non-redirect response (e.g., a server-side error)
                const errorMessage = await response.text();
                showToast(`❌ Registration failed: ${errorMessage}`, "error");
                console.error("Server responded with an error:", errorMessage);
                resetSlider();
            }
        } catch (error) {
            // Handle network errors
            showToast("❌ Network error. Please try again.", "error");
            console.error("Network error during registration:", error);
            resetSlider();
        } finally {
            // Reset the submitting flag and loading state
            registrationForm.dataset.submitting = 'false';
            sliderSubmit.classList.remove('loading');
        }
    }

    function resetSlider() {
        setHandle(0);
        registrationForm.reset();
        sliderSubmit.classList.remove('submitted');
        sliderHandle.innerHTML = '<i class="fa fa-arrow-right"></i>';
    }

    // --- Event Listeners (mostly unchanged) ---
    sliderHandle.addEventListener('mousedown', e => {
        isDragging = true;
        recalcMax();
        startX = e.clientX - sliderHandle.offsetLeft;
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        setHandle(currentX);
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        recalcMax();
        if (sliderHandle.offsetLeft < max - 5) {
            setHandle(0);
        }
        isDragging = false;
        document.body.style.userSelect = '';
    });

    sliderHandle.addEventListener('touchstart', e => {
        isDragging = true;
        recalcMax();
        startX = e.touches[0].clientX - sliderHandle.offsetLeft;
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', e => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX - startX;
        setHandle(currentX);
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        recalcMax();
        if (sliderHandle.offsetLeft < max - 5) {
            setHandle(0);
        }
        isDragging = false;
    });

    sliderHandle.addEventListener('keydown', e => {
        recalcMax();
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
            if (registrationForm.checkValidity()) {
                setHandle(max);
            } else {
                setHandle(0);
                registrationForm.reportValidity();
            }
            e.preventDefault();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            setHandle(0);
            e.preventDefault();
        }
    });

    // We no longer need this listener, as submission is handled by the slider logic
    // registrationForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
    // });
}