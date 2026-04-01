document.addEventListener("DOMContentLoaded", () => {
    // --- Menu Mobile ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-dropdown-nav');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = mobileNav.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            mobileNav.setAttribute('aria-hidden', !isOpen);
            if (iconOpen) iconOpen.style.display = isOpen ? 'none' : 'block';
            if (iconClose) iconClose.style.display = isOpen ? 'block' : 'none';
        });

        // Fecha ao clicar num link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
                if (iconOpen) iconOpen.style.display = 'block';
                if (iconClose) iconClose.style.display = 'none';
            });
        });

        // Fecha ao clicar fora
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileNav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
                if (iconOpen) iconOpen.style.display = 'block';
                if (iconClose) iconClose.style.display = 'none';
            }
        });
    }

    // Scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                // Fecha o menu mobile se estiver aberto
                if (mainNav) mainNav.classList.remove('active');
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Intersection Observer para animações no scroll (fade-in, slide-up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Deixa de observar depois de animar a primeira vez
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    animatedElements.forEach(el => scrollObserver.observe(el));

    // Lógica da Animação Hero em HTML5 Canvas (Hardware Accelerated, Ultra Performance)
    const container = document.getElementById('hero-animation-container');
    const canvas = document.getElementById('hero-canvas');
    
    if (container && canvas) {
        const ctx = canvas.getContext('2d');
        let loaded = 0;
        const totalFrames = 40;
        const imagesObj = [];
        
        for (let i = 1; i <= totalFrames; i++) {
            const frameNumber = i.toString().padStart(3, '0');
            const img = new Image();
            img.src = `hamburguerjsk/ezgif-frame-${frameNumber}.png`;
            
            img.onload = () => {
                loaded++;
                // Inicia canvas quando todas forem carregadas
                if (loaded === totalFrames) {
                    initCanvas();
                    startScrollAnimation();
                }
            };
            img.onerror = () => {
                loaded++;
                if (loaded === totalFrames) {
                    initCanvas();
                    startScrollAnimation();
                }
            };
            imagesObj.push(img);
        }

        function initCanvas() {
            // Ajustar o canvas ao tamanho original da primeira imagem 
            if(imagesObj[0] && imagesObj[0].width) {
                canvas.width = imagesObj[0].width;
                canvas.height = imagesObj[0].height;
                // Pintar log o primeiro frame original
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imagesObj[0], 0, 0);
            }
        }

        function startScrollAnimation() {
            let lastFrame = 0;
            let ticking = false; 
            
            // Cache Absoluto para não matar a memória do Telemóvel (Anti Layout-Thrashing)
            let canvasAbsoluteTop = canvas.getBoundingClientRect().top + window.scrollY;
            let windowHeight = window.innerHeight;
            
            // Se virar o telemóvel, recalcula
            window.addEventListener('resize', () => {
                canvasAbsoluteTop = canvas.getBoundingClientRect().top + window.scrollY;
                windowHeight = window.innerHeight;
            }, { passive: true });
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const isMobile = window.innerWidth <= 900;
                        let progress = 0;
                        
                        if (isMobile) {
                            // Lógica Ultra-Rápida via Matemática base em vez de interrogar a gráfica
                            const currentRectTop = canvasAbsoluteTop - window.scrollY;
                            
                            const startVis = windowHeight - 50; 
                            const endVis = windowHeight / 2 - 50;
                            
                            progress = (startVis - currentRectTop) / (startVis - endVis);
                        } else {
                            progress = window.scrollY / 500;
                        }
                        
                        if (progress < 0) progress = 0;
                        if (progress > 1) progress = 1;
                        
                        let targetFrame = Math.floor(progress * (totalFrames - 1));
                        
                        if (targetFrame !== lastFrame && imagesObj[targetFrame]) {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(imagesObj[targetFrame], 0, 0);
                            lastFrame = targetFrame;
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }
    }

    // Ações iFood
    const ifoodBtn = document.getElementById('ifood-download');
    if (ifoodBtn) {
        ifoodBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const ua = navigator.userAgent || navigator.vendor || window.opera;
            if (/android/i.test(ua)) {
                window.location.href = "intent://#Intent;package=br.com.brainweb.ifood;scheme=ifood;end";
            } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
                window.location.href = "https://apps.apple.com/br/app/ifood-delivery-de-comida/id483668252";
            } else {
                window.open("https://www.ifood.com.br/", "_blank");
            }
        });
    }
});
