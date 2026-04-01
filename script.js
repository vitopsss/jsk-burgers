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
            // Bloqueio de performance para não inundar o GPU
            let ticking = false; 
            
            // O hambúrguer só é montado através do scroll nativo puro
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        // Mais sensível e rápido no mobile (300px), mais longo e dramático no PC (500px)
                        const isMobile = window.innerWidth <= 900;
                        const scrollNecessario = isMobile ? 300 : 500; 
                        
                        let progress = scrollY / scrollNecessario;
                        if (progress < 0) progress = 0;
                        if (progress > 1) progress = 1; // Trava perfeitamente no último frame final
                        
                        // Mapeia a percentagem da descida
                        let targetFrame = Math.floor(progress * (totalFrames - 1));
                        
                        // Reescreve o Canvas instantaneamente sem mexer na estrutura da página HTML (Zero Lag)
                        if (targetFrame !== lastFrame && imagesObj[targetFrame]) {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(imagesObj[targetFrame], 0, 0);
                            lastFrame = targetFrame;
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true }); // passive impede bloqueios visuais na Apple
        }
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
