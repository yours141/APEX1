/* ========================================
   TechNova - 3D Animations & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== PRELOADER ==========
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 1500);
    });

    // Fallback: hide preloader after 4s max
    setTimeout(() => {
        preloader.classList.add('loaded');
    }, 4000);

    // ========== PARTICLES BACKGROUND ==========
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() * 60 + 220; // Blue-purple range
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse attraction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                this.x += dx * 0.001;
                this.y += dy * 0.001;
                this.opacity = Math.min(0.8, this.opacity + 0.01);
            }

            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 65%, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(240, 60%, 60%, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        animationId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ========== NAVBAR ==========
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinkEls = document.querySelectorAll('.nav-link');

    // Scroll behavior
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;

        // Active section tracking
        updateActiveNavLink();

        // Back to top visibility
        const backToTop = document.getElementById('back-to-top');
        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinkEls.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Active nav link tracking
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinkEls.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ========== BACK TO TOP ==========
    document.getElementById('back-to-top').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== COUNTER ANIMATION ==========
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(easeProgress * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // ========== SCROLL ANIMATIONS ==========
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);

                // Trigger counter animation when hero stats visible
                if (entry.target.closest('.hero-stats') || entry.target.querySelector('.stat-number')) {
                    animateCounters();
                }

                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // Also observe hero stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(heroStats);
    }

    // ========== 3D TILT EFFECT ON CARDS ==========
    function apply3DTilt(elements, intensity = 15) {
        elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -intensity;
                const rotateY = ((x - centerX) / centerX) * intensity;

                el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
                el.style.transition = 'transform 0.5s ease';
            });

            el.addEventListener('mouseenter', () => {
                el.style.transition = 'none';
            });
        });
    }

    // Apply 3D tilt to about cards
    apply3DTilt(document.querySelectorAll('.about-card-inner'), 8);

    // ========== TESTIMONIALS CAROUSEL ==========
    const track = document.getElementById('testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    let currentSlide = 0;
    let autoPlayInterval;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;

        // Update dots
        document.querySelectorAll('.carousel-dots .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        resetAutoPlay();
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % cards.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + cards.length) % cards.length);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    startAutoPlay();

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // ========== CONTACT FORM ==========
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('form-name').value;
        const phone = document.getElementById('form-phone').value;
        const email = document.getElementById('form-email').value;
        const courseSelect = document.getElementById('form-course');
        const course = courseSelect.options[courseSelect.selectedIndex].text;
        const message = document.getElementById('form-message').value;

        // Simulate submission UI update
        const submitBtn = document.getElementById('form-submit');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        try {
            // Send data to backend API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, phone, email, course, message })
            });

            if (response.ok) {
                // Construct WhatsApp message
                let waText = `*New Admission Inquiry*\n\n`;
                waText += `*Name:* ${name}\n`;
                waText += `*Phone:* ${phone}\n`;
                waText += `*Email:* ${email}\n`;
                waText += `*Course Interested:* ${course}\n`;
                if (message.trim()) {
                    waText += `*Message:* ${message}`;
                }

                const phoneNumber = '919547543695';
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waText)}`;
                window.open(whatsappUrl, '_blank');

                contactForm.innerHTML = `
                    <div class="form-success">
                        <div class="success-icon">🎉</div>
                        <h3>Inquiry Saved & Redirected!</h3>
                        <p>Your details have been saved to our database. Please send the pre-filled message on WhatsApp to complete your inquiry.</p>
                    </div>
                `;
            } else {
                throw new Error('Failed to save to database');
            }
        } catch (error) {
            console.error('Error:', error);
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            alert('There was an error saving your inquiry. Please try again.');
        }
    });

    // ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ========== PARALLAX EFFECT ON HERO SHAPES ==========
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const shapes = document.querySelectorAll('.floating-shape');

        shapes.forEach((shape, i) => {
            const speed = 0.05 * (i + 1);
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // ========== MAGNETIC BUTTON EFFECT ==========
    function addMagneticEffect(elements) {
        elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    addMagneticEffect(document.querySelectorAll('.carousel-btn'));

    // ========== TEXT TYPING EFFECT IN MONITOR ==========
    function retypeCode() {
        const codeLines = document.querySelectorAll('.code-line');
        codeLines.forEach((line, i) => {
            line.style.opacity = '0';
            line.style.animation = 'none';
            
            setTimeout(() => {
                line.style.animation = `typeLine 0.3s ${i * 0.3}s forwards`;
            }, 50);
        });
    }

    // Retype every 12 seconds
    setInterval(retypeCode, 12000);

    // ========== KEYBOARD NAVIGATION ==========
    document.addEventListener('keydown', (e) => {
        // Carousel keyboard nav
        if (e.key === 'ArrowLeft') {
            const testimonialSection = document.getElementById('testimonials');
            const rect = testimonialSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                prevSlide();
            }
        }
        if (e.key === 'ArrowRight') {
            const testimonialSection = document.getElementById('testimonials');
            const rect = testimonialSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                nextSlide();
            }
        }
    });

    // ========== PERFORMANCE: Reduce animations when not visible ==========
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
            clearInterval(autoPlayInterval);
        } else {
            animateParticles();
            startAutoPlay();
        }
    });

    // ========== CURSOR GLOW EFFECT ==========
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.06) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // ========== WHATSAPP WIDGET ==========
    const waFab = document.getElementById('wa-fab');
    const waChatPopup = document.getElementById('wa-chat-popup');
    const waChatClose = document.getElementById('wa-chat-close');
    const waChatForm = document.getElementById('wa-chat-form');
    const waChatInput = document.getElementById('wa-chat-input');
    const waFabIconWa = document.getElementById('wa-fab-icon-wa');
    const waFabIconClose = document.getElementById('wa-fab-icon-close');

    if (waFab && waChatPopup) {
        waFab.addEventListener('click', () => {
            waChatPopup.classList.toggle('active');
            if (waChatPopup.classList.contains('active')) {
                if (waFabIconWa) waFabIconWa.style.display = 'none';
                if (waFabIconClose) waFabIconClose.style.display = 'block';
                if (waChatInput) waChatInput.focus();
            } else {
                if (waFabIconWa) waFabIconWa.style.display = 'block';
                if (waFabIconClose) waFabIconClose.style.display = 'none';
            }
        });
    }

    if (waChatClose && waChatPopup) {
        waChatClose.addEventListener('click', () => {
            waChatPopup.classList.remove('active');
            if (waFabIconWa) waFabIconWa.style.display = 'block';
            if (waFabIconClose) waFabIconClose.style.display = 'none';
        });
    }

    if (waChatForm) {
        waChatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = waChatInput ? waChatInput.value.trim() : '';
            const phoneNumber = '919547543695'; // APEX Computer phone number from contact section
            
            if (message) {
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                if (waChatInput) waChatInput.value = '';
                if (waChatPopup) waChatPopup.classList.remove('active');
                if (waFabIconWa) waFabIconWa.style.display = 'block';
                if (waFabIconClose) waFabIconClose.style.display = 'none';
            } else {
                // If empty message, just open WhatsApp chat
                window.open(`https://wa.me/${phoneNumber}`, '_blank');
            }
        });
    }

    console.log('%c🚀 TechNova Website Loaded Successfully!', 
        'color: #667eea; font-size: 16px; font-weight: bold;');
});
