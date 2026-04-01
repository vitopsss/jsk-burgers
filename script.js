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

    // Lógica da Animação Hero em DOM Stacking (Alta Performance / Zero Lag Mobile)
    const container = document.getElementById('hero-animation-container');
    if (container) {
        let loaded = 0;
        const totalFrames = 40;
        const imagesDOM = [];
        
        // Limpar placeholder inicial
        container.innerHTML = ''; 

        for (let i = 1; i <= totalFrames; i++) {
            const frameNumber = i.toString().padStart(3, '0');
            const img = new Image();
            img.src = `hamburguerjsk/ezgif-frame-${frameNumber}.png`;
            img.alt = "";
            
            // Frame 1 fica relativo para "esticar" a altura da DIV contentora.
            if (i === 1) {
                img.className = "hero-frame-base";
            }
            
            img.onload = () => {
                loaded++;
                // Inicia quando o iPhone/Android relatar download 100% de todas sem exceção!
                if (loaded === totalFrames) startSmoothAnimation();
            };
            img.onerror = () => {
                loaded++;
                if (loaded === totalFrames) startSmoothAnimation();
            };
            
            imagesDOM.push(img);
            container.appendChild(img);
        }

        function startSmoothAnimation() {
            let current = 0;
            imagesDOM[0].classList.add('active'); // Mostrar primeira frame
            
            const interval = setInterval(() => {
                imagesDOM[current].classList.remove('active'); // Esconder antiga
                current++;
                
                if (current >= totalFrames) {
                    clearInterval(interval);
                    imagesDOM[totalFrames - 1].classList.add('active'); // Trancar a última frame visível
                } else {
                    imagesDOM[current].classList.add('active'); // Revelar seguinte
                }
            }, 80); // Ritmo fluido a ~12.5 FPS baseados em placa gráfica
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
