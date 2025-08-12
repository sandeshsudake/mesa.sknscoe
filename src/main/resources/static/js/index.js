document.addEventListener('DOMContentLoaded', () => {

    // --- NAVBAR / HAMBURGER MENU ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        function toggleMenu() {
            navLinks.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
        }

        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                toggleMenu();
                e.preventDefault();
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });
    }

    // --- IMAGE SLIDER ---
    const slider = document.getElementById('slider');
    const slidesContainer = document.getElementById('slidesContainer');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navContainer = document.getElementById('sliderNav');

    if (slider && slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('nav-dot');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetInterval();
            });
            navContainer.appendChild(dot);
        });

        const navDots = document.querySelectorAll('.nav-dot');

        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            navDots.forEach(dot => dot.classList.remove('active'));
            navDots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            goToSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(currentSlide);
        }

        function startInterval() {
            slideInterval = setInterval(nextSlide, 3500);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', resetInterval);

        let startX = 0;
        slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; clearInterval(slideInterval); }, { passive: true });
        slider.addEventListener('touchend', (e) => {
            let endX = e.changedTouches[0].clientX;
            if (endX - startX > 50) prevSlide();
            else if (startX - endX > 50) nextSlide();
            resetInterval();
        });

        goToSlide(0);
        startInterval();
    }

    // --- ANIMATED COUNTER (ABOUT SECTION) ---
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        let aboutAnimated = false;

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

        function handleAboutAnimation() {
            if (!aboutAnimated) {
                const rect = aboutSection.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
                    const counters = document.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        animateCounter(counter, target, 1200 + Math.random() * 800);
                    });
                    aboutAnimated = true;
                    window.removeEventListener('scroll', handleAboutAnimation);
                }
            }
        }
        window.addEventListener('scroll', handleAboutAnimation);
        handleAboutAnimation(); // Also run on load in case it's already in view
    }

    // --- EVENT CAROUSEL ---
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

    // --- EVENT FILTER CHIPS ---
    const eventChips = document.querySelectorAll('.event-chip');
    if (eventChips.length > 0) {
        eventChips.forEach(chip => {
            chip.addEventListener('click', function() {
                eventChips.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');
                document.querySelectorAll('.event-card').forEach(card => {
                    if (filter === 'all' || (card.dataset.type && card.dataset.type.includes(filter))) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- CONTACT FORM ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // --- FRF MODAL ---
    const frfLink = document.querySelector('.frf-link');
    const frfModal = document.getElementById('frfModal');
    const frfModalClose = document.getElementById('frfModalClose');
    const frfForm = document.getElementById('frfForm');
    if (frfLink && frfModal && frfModalClose) {
        function openFrfModal() {
            frfModal.style.display = 'flex';
            frfModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
        function closeFrfModal() {
            frfModal.style.display = 'none';
            frfModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (frfForm) frfForm.reset();
        }
        frfLink.addEventListener('click', e => { e.preventDefault(); openFrfModal(); });
        frfModalClose.addEventListener('click', closeFrfModal);
        frfModal.addEventListener('click', e => { if (e.target === frfModal) closeFrfModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && frfModal.style.display === 'flex') closeFrfModal(); });
    }

    // --- FRF SLIDER SUBMIT ---
    const sliderSubmit = document.getElementById('sliderSubmit');
    const sliderHandle = sliderSubmit?.querySelector('.slider-handle');
    if (sliderHandle && sliderSubmit && frfForm) {
        let isDragging = false, startX = 0, currentX = 0, max = 0, hasSubmitted = false;
        function recalcMax() { max = sliderSubmit.offsetWidth - sliderHandle.offsetWidth; }
        function setHandle(x) {
            recalcMax();
            x = Math.max(0, Math.min(x, max));
            sliderHandle.style.left = x + 'px';
            sliderSubmit.style.background = `linear-gradient(90deg, #43a047 ${(x + 48) / sliderSubmit.offsetWidth * 100}%, #e6f0fa 0%)`;
            if (x >= max - 5 && frfForm.checkValidity() && !hasSubmitted) {
                sliderSubmit.classList.add('submitted');
                hasSubmitted = true;
                frfForm.submit();
            } else if (x < max - 5) { hasSubmitted = false; sliderSubmit.classList.remove('submitted'); sliderSubmit.style.background = ''; }
            else if (x >= max - 5 && !frfForm.checkValidity()) {
                sliderHandle.style.left = '0'; sliderSubmit.style.background = ''; sliderSubmit.classList.remove('submitted');
                frfForm.reportValidity(); hasSubmitted = false;
            }
        }
        sliderHandle.addEventListener('mousedown', e => { isDragging = true; recalcMax(); startX = e.clientX - sliderHandle.offsetLeft; document.body.style.userSelect = 'none'; e.preventDefault(); });
        document.addEventListener('mousemove', e => { if (!isDragging) return; currentX = e.clientX - startX; setHandle(currentX); });
        document.addEventListener('mouseup', () => { if (!isDragging) return; recalcMax(); if (sliderHandle.offsetLeft < max - 5 && !hasSubmitted) setHandle(0); isDragging = false; document.body.style.userSelect = ''; });
        sliderHandle.addEventListener('touchstart', e => { isDragging = true; recalcMax(); startX = e.touches[0].clientX - sliderHandle.offsetLeft; e.preventDefault(); }, { passive: false });
        document.addEventListener('touchmove', e => { if (!isDragging) return; currentX = e.touches[0].clientX - startX; setHandle(currentX); e.preventDefault(); }, { passive: false });
        document.addEventListener('touchend', () => { if (!isDragging) return; recalcMax(); if (sliderHandle.offsetLeft < max - 5 && !hasSubmitted) setHandle(0); isDragging = false; });
        sliderHandle.addEventListener('keydown', e => {
            recalcMax();
            if ((e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') && !hasSubmitted) {
                if (frfForm.checkValidity()) { hasSubmitted = true; setHandle(max); }
                else { setHandle(0); frfForm.reportValidity(); }
                e.preventDefault();
            }
            if ((e.key === 'ArrowLeft' || e.key === 'ArrowDown') && !hasSubmitted) { setHandle(0); e.preventDefault(); }
        });
    }

    // --- FRF SUCCESS TOAST (VIA URL PARAMETER) ---
    const urlParams = new URLSearchParams(window.location.search);
    const frfToastElement = document.getElementById('frfToast');
    if (urlParams.get('frfSuccess') === 'true' && frfToastElement) {
        frfToastElement.textContent = "🎉 Thank you! Your feature request has been submitted.";
        frfToastElement.classList.add('active');
        setTimeout(() => {
            frfToastElement.classList.remove('active');
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: newUrl }, '', newUrl);
        }, 3500);
    }

    // --- AUTH MODAL ---
    const authModal = document.getElementById('authModal');
    const authModalClose = document.getElementById('authModalClose');
    if (authModal) {
        function openAuthModal() { authModal.style.display = 'flex'; authModal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
        function closeAuthModal() { authModal.style.display = 'none'; authModal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
        if (authModalClose) authModalClose.addEventListener('click', closeAuthModal);
        authModal.addEventListener('click', e => { if (e.target === authModal) closeAuthModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && authModal.style.display === 'flex') closeAuthModal(); });
        document.querySelectorAll('.event-register:not(:disabled)').forEach(button => button.addEventListener('click', openAuthModal));
    }

    // --- BACK TO TOP BUTTON ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.style.display = (window.scrollY > 300) ? 'flex' : 'none';
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});