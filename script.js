document.addEventListener("DOMContentLoaded", () => {
    // Scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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

    // Lógica da Animação Hero via Sequência de Imagens (SpriteSheet-like)
    const heroAnimationImg = document.getElementById('hero-animation-img');
    if (heroAnimationImg) {
        let currentFrame = 1;
        const totalFrames = 40;
        const frames = [];
        
        // Fazer Preload de todas as imagens para evitar flashes entre frames
        for (let i = 1; i <= totalFrames; i++) {
            const frameNumber = i.toString().padStart(3, '0');
            const imgSrc = `hamburguerjsk/ezgif-frame-${frameNumber}.png`;
            
            const img = new Image();
            img.src = imgSrc;
            frames.push(imgSrc);
        }

        // Tocar a animação em slow motion apenas uma vez ao carregar a página
        const animationInterval = setInterval(() => {
            currentFrame++;
            if (currentFrame > totalFrames) {
                clearInterval(animationInterval); // Parar a animação quando chegar ao fim
            } else {
                // Atualizar o src visível apenas se houver mais frames
                heroAnimationImg.src = frames[currentFrame - 1];
            }
        }, 83);
    }

    // Lógica do Carousel manual removida a favor do Marquee Infinito (CSS Only).

    // --- Lógica do Botão iFood (Download / Deep Link Inteligente) ---
    const ifoodBtn = document.getElementById('ifood-download');
    if (ifoodBtn) {
        ifoodBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const ua = navigator.userAgent || navigator.vendor || window.opera;
            
            // Redirecionamento Inteligente baseado no Sistema Operativo
            if (/android/i.test(ua)) {
                // Tenta abrir app, se não tiver vai para a Play Store pedir para baixar
                window.location.href = "intent://#Intent;package=br.com.brainweb.ifood;scheme=ifood;end";
            } 
            else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
                // Tenta abrir app, se não vira janela da App Store pedir para baixar
                window.location.href = "https://apps.apple.com/br/app/ifood-delivery-de-comida/id483668252";
            } 
            else {
                // Utilizadores de Computador PC/Mac
                window.open("https://www.ifood.com.br/", "_blank");
            }
        });
    }

    // Fechar o menu Mobile puro (Checkbox) ao carregar nos atalhos
    const menuToggle = document.getElementById('mobile-menu-toggle');
    if(menuToggle) {
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.checked = false;
            });
        });
    }
});
