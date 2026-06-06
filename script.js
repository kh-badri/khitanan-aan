// script.js - Premium Khitanan Invitation

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // INIT AOS
    // ============================
    AOS.init({
        once: false,
        mirror: true,
        duration: 800,
    });

    // ============================
    // ELEMENTS
    // ============================
    const openBtn = document.getElementById('open-btn');
    const coverSection = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const audioControl = document.getElementById('audio-control');
    const audioIcon = audioControl.querySelector('i');
    const guestNameEl = document.getElementById('guest-name');

    let isPlaying = false;

    // ============================
    // GUEST NAME FROM URL
    // ============================
    // Usage: index.html?to=Bapak+Ahmad
    // When shared via WhatsApp, add the recipient name in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        guestNameEl.textContent = guestName;
    }

    // ============================
    // PARTICLE BACKGROUND
    // ============================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
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
            this.size = Math.random() * 4 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * -1.5 - 0.3;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? 'rgba(212, 168, 67,' : 'rgba(245, 215, 142,';
            this.life = 0;
            this.maxLife = Math.random() * 200 + 100;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;
            if (this.life > this.maxLife || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
                this.y = canvas.height + 10;
            }
        }
        draw() {
            const fadeRatio = Math.min(this.life / 30, 1) * Math.min((this.maxLife - this.life) / 30, 1);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + (this.opacity * fadeRatio) + ')';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(60, Math.floor(canvas.width * canvas.height / 15000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ============================
    // OPEN INVITATION
    // ============================
    openBtn.addEventListener('click', () => {
        // Fire Confetti
        fireConfetti();

        // Slide up cover
        coverSection.style.transform = 'translateY(-100vh)';
        coverSection.style.opacity = '0';

        setTimeout(() => {
            coverSection.classList.add('hidden');
            mainContent.classList.remove('hidden');
            audioControl.classList.remove('hidden');
            playMusic();
            AOS.refresh();
            startCountdown();
        }, 900);
    });

    // ============================
    // AUDIO CONTROL
    // ============================
    audioControl.addEventListener('click', () => {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    function playMusic() {
        bgMusic.play().then(() => {
            isPlaying = true;
            audioIcon.className = 'fa-solid fa-music';
            audioControl.classList.remove('paused');
        }).catch(err => {
            console.log('Autoplay prevented:', err);
        });
    }

    function pauseMusic() {
        bgMusic.pause();
        isPlaying = false;
        audioIcon.className = 'fa-solid fa-volume-xmark';
        audioControl.classList.add('paused');
    }

    // ============================
    // COUNTDOWN TIMER
    // ============================
    function startCountdown() {
        const eventDate = new Date('2026-06-19T10:00:00+07:00').getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ============================
    // CONFETTI EFFECT
    // ============================
    function fireConfetti() {
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const colors = ['#d4a843', '#f5d78e', '#1a2a6c', '#0e9aa7', '#ffffff', '#b8860b'];

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        (function frame() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return;

            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.7 },
                colors: colors,
                zIndex: 10000,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.7 },
                colors: colors,
                zIndex: 10000,
            });

            requestAnimationFrame(frame);
        })();

        // Big burst
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { x: 0.5, y: 0.5 },
                colors: colors,
                zIndex: 10000,
                scalar: 1.2,
            });
        }, 300);
    }

});
