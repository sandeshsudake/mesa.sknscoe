const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function toggleMenu() {
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
}

hamburger.addEventListener('click', toggleMenu);

// Keyboard accessibility for hamburger
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        toggleMenu();
        e.preventDefault(); // Prevent scrolling when space is pressed
    }
});

// Optional: close menu when a link is clicked (mobile UX)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Image Slider
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentSlide = 0;
let slideInterval = setInterval(nextSlide, 3500);

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
});
prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
});

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3500);
}

// Optional: swipe support for mobile
const slider = document.getElementById('slider');
let startX = 0;
if (slider) {
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    slider.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].clientX;
        if (endX - startX > 50) {
            prevSlide();
            resetInterval();
        } else if (startX - endX > 50) {
            nextSlide();
            resetInterval();
        }
    });
}

// Initialize slider
showSlide(currentSlide);

// Animated Counter for About Section
function animateCounter(element, target, duration = 1500) {
    let start = 0;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (target - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = target;
        }
    };
    window.requestAnimationFrame(step);
}

let aboutAnimated = false;
const aboutSection = document.getElementById('about');

function handleAboutAnimation() {
    if (!aboutAnimated && aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100 && rect.bottom > 0) { // Check if at least part of the section is in view
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                animateCounter(counter, target, 1200 + Math.random() * 800);
            });
            aboutAnimated = true;
            window.removeEventListener('scroll', handleAboutAnimation); // Remove listener after animation
        }
    }
}

window.addEventListener('scroll', handleAboutAnimation);
// Also run on DOMContentLoaded in case it's already in view
window.addEventListener('DOMContentLoaded', handleAboutAnimation);

// Event Carousel Scroll
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

// Event Filter Chips
document.querySelectorAll('.event-chip').forEach(chip => {
    chip.addEventListener('click', function() {
        document.querySelectorAll('.event-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        document.querySelectorAll('.event-card').forEach(card => {
            if (filter === 'all' || card.dataset.type.includes(filter)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Smooth reset for contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Changed alert to a more user-friendly message box or toast if available
        // For now, using console.log as a placeholder for alert()
        console.log('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// FRF Modal Logic
const frfLink = document.querySelector('.frf-link');
const frfModal = document.getElementById('frfModal');
const frfModalClose = document.getElementById('frfModalClose');
const frfForm = document.getElementById('frfForm');
const sliderSubmit = document.getElementById('sliderSubmit');
const sliderHandle = sliderSubmit?.querySelector('.slider-handle');
const frfToast = document.getElementById('frfToast'); // Ensure you have an element with id="frfToast" in your HTML

function openFrfModal() {
    frfModal.style.display = 'flex';
    frfModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (sliderSubmit) {
        sliderSubmit.classList.remove('submitted');
        sliderHandle.style.left = '0';
        sliderSubmit.style.background = '';
    }
}

function closeFrfModal() {
    frfModal.style.display = 'none';
    frfModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (frfForm) frfForm.reset();
}

if (frfLink && frfModal && frfModalClose) {
    frfLink.addEventListener('click', e => {
        e.preventDefault();
        openFrfModal();
    });
    frfModalClose.addEventListener('click', closeFrfModal);
    frfModal.addEventListener('click', e => {
        if (e.target === frfModal) closeFrfModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && frfModal.style.display === 'flex') {
            closeFrfModal();
        }
    });
}

// Slider Submit Logic
if (sliderHandle && sliderSubmit && frfForm) {
    let isDragging = false, startX = 0, currentX = 0, max = 0;
    let hasSubmitted = false; // Flag to prevent multiple submissions

    function recalcMax() {
        max = sliderSubmit.offsetWidth - sliderHandle.offsetWidth;
    }

    function setHandle(x) {
        recalcMax();
        x = Math.max(0, Math.min(x, max));
        sliderHandle.style.left = x + 'px';
        sliderSubmit.style.background = `linear-gradient(90deg, #43a047 ${(x + 48) / sliderSubmit.offsetWidth * 100}%, #e6f0fa 0%)`;

        // Check if slider is at the end AND form is valid AND we haven't submitted yet
        if (x >= max - 5 && frfForm.checkValidity() && !hasSubmitted) {
            sliderSubmit.classList.add('submitted');
            hasSubmitted = true; // Set flag to true immediately to prevent re-submission
            frfForm.submit(); // Explicitly trigger native form submission

            // No need for setTimeout or dispatchEvent here.
            // The server will redirect, and the page will reload.
            // The success toast will be handled by the URL parameter on the new page load.
        } else if (x < max - 5) {
            // Reset submitted state if slider is pulled back from the end
            hasSubmitted = false;
            sliderSubmit.classList.remove('submitted');
            sliderSubmit.style.background = '';
        } else if (x >= max - 5 && !frfForm.checkValidity()) {
            // If at end but invalid, reset handle and report validity
            sliderHandle.style.left = '0';
            sliderSubmit.style.background = '';
            sliderSubmit.classList.remove('submitted');
            frfForm.reportValidity();
            hasSubmitted = false; // Ensure it can be submitted once valid
        }
    }

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
        // Only reset handle if it's not already submitted (i.e., if it didn't reach the end successfully)
        if (sliderHandle.offsetLeft < max - 5 && !hasSubmitted) {
            setHandle(0);
        }
        isDragging = false;
        document.body.style.userSelect = '';
    });

    // Touch support
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
        // Only reset handle if it's not already submitted
        if (sliderHandle.offsetLeft < max - 5 && !hasSubmitted) {
            setHandle(0);
        }
        isDragging = false;
    });

    // Keyboard accessibility
    sliderHandle.addEventListener('keydown', e => {
        recalcMax();
        // Trigger submission only if not already submitted
        if ((e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') && !hasSubmitted) {
            if (frfForm.checkValidity()) {
                hasSubmitted = true; // Set flag for keyboard submission
                setHandle(max); // This will trigger frfForm.submit()
            } else {
                setHandle(0);
                frfForm.reportValidity();
            }
            e.preventDefault();
        }
        // Allow resetting with left/down arrow only if not already submitted
        if ((e.key === 'ArrowLeft' || e.key === 'ArrowDown') && !hasSubmitted) {
            setHandle(0);
            e.preventDefault();
        }
    });
}

// New Toast Logic to check URL parameter after redirect
// This ensures the toast logic runs only after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const frfToastElement = document.getElementById('frfToast'); // Get the element inside DOMContentLoaded

    if (urlParams.get('frfSuccess') === 'true' && frfToastElement) {
        frfToastElement.textContent = "🎉 Thank you! Your feature request has been submitted.";
        frfToastElement.classList.add('active');
        setTimeout(() => {
            frfToastElement.classList.remove('active');
            // Clean the URL parameter after showing the toast
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: newUrl }, '', newUrl);
        }, 3500);
    }
});


// New Auth Modal Logic
const authModal = document.getElementById('authModal');
const authModalClose = document.getElementById('authModalClose');

function openAuthModal() {
    if (!authModal) return;
    authModal.style.display = 'flex';
    authModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    if (!authModal) return;
    authModal.style.display = 'none';
    authModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (authModalClose) {
    authModalClose.addEventListener('click', closeAuthModal);
}

if (authModal) {
    authModal.addEventListener('click', e => {
        if (e.target === authModal) closeAuthModal();
    });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && authModal && authModal.style.display === 'flex') {
        closeAuthModal();
    }
});

// Attach event listeners to all enabled register buttons to open the new auth modal
document.querySelectorAll('.event-register:not(:disabled)').forEach(button => {
    button.addEventListener('click', e => {
        openAuthModal();
    });
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
