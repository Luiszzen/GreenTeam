// JS DE HOMEPAGE
// DETECTAR SI VIENE DE UNA SUBPÁGINA (MOVER AL INICIO)
const isReturningFromSubpage = sessionStorage.getItem('fromSubpage') === 'true';

// Variables de estado (MOVER DESPUÉS DE LA DETECCIÓN)
let contentShown = isReturningFromSubpage;
let backgroundShown = isReturningFromSubpage;
let navigationShown = isReturningFromSubpage;
let hasReachedBottom = false; // Nueva variable para controlar si llegó al final
let isResizing = false; // Variable para controlar si se está redimensionando

// Variable para prevenir activación de animaciones durante resize
let resizeTimeout;

// RESETEAR SCROLL AL INICIO AL CARGAR LA PÁGINA
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Si viene de subpágina, saltar todas las animaciones iniciales
    if (isReturningFromSubpage) {
        // Limpiar el flag
        sessionStorage.removeItem('fromSubpage');
        
        // CAMBIAR EL FONDO DEL BODY A BLANCO
        document.body.style.backgroundColor = '#ffffff';
        
        // Habilitar scroll inmediatamente
        document.body.classList.add('scroll-enabled');
        
        // Mostrar navegación inmediatamente
        const navigationBar = document.querySelector('.navigation-bar');
        if (navigationBar) {
            navigationBar.className = 'navigation-bar show';
            navigationShown = true;
        }
        
        // Mostrar contenido final inmediatamente
        const finalContent = document.querySelector('.content-after-expand');
        if (finalContent) {
            finalContent.className = 'content-after-expand show';
            finalContent.style.opacity = '1 !important';
            finalContent.style.transform = 'translateY(0) !important';
            finalContent.style.animation = 'none !important';
            contentShown = true;
        }
        
        // Mostrar fondo inmediatamente
        const colorBackground = document.querySelector('.color-background');
        if (colorBackground) {
            colorBackground.className = 'color-background show';
            colorBackground.style.opacity = '1 !important';
            colorBackground.style.animation = 'none !important';
            backgroundShown = true;
        }
        
        // Mostrar fondo adicional
        const backAfExpand = document.querySelector('.back_af_expand');
        if (backAfExpand) {
            backAfExpand.style.opacity = '1 !important';
            backAfExpand.style.animation = 'none !important';
        }
        
        // Mostrar cajas HP
        const cajaHP = document.querySelector('.caja_HP');
        if (cajaHP) {
            cajaHP.style.opacity = '1 !important';
            cajaHP.style.animation = 'none !important';
        }
        
        // Deshabilitar completamente las animaciones scroll-timeline
        const style = document.createElement('style');
        style.id = 'disable-scroll-animations';
        style.textContent = `
            .color-background,
            .back_af_expand,
            .caja_HP {
                animation-timeline: none !important;
                animation: none !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
        
        // Ocultar elementos de animación inicial
        const centro = document.querySelector('.centro');
        const backTransicion = document.querySelector('.back-transicion');
        if (centro) centro.style.display = 'none';
        if (backTransicion) backTransicion.style.display = 'none';
        
        return; // Salir sin ejecutar animaciones
    }
    
    // CÓDIGO ORIGINAL PARA PRIMERA VISITA
    const imagen = document.querySelector('.obj-transicion');
    if (imagen) {
        imagen.classList.add('reset');
        setTimeout(() => {
            imagen.classList.remove('reset');
            imagen.classList.add('reactivate');
        }, 100);
    }
    
    const finalContent = document.querySelector('.content-after-expand');
    if (finalContent) {
        finalContent.className = 'content-after-expand';
    }

    const colorBackground = document.querySelector('.color-background');
    if (colorBackground) {
        colorBackground.className = 'color-background';
    }

    const navigationBar = document.querySelector('.navigation-bar');
    if (navigationBar) {
        navigationBar.className = 'navigation-bar';
    }

    document.body.offsetHeight;
});

// LISTENER PARA DETECTAR RESIZE Y PREVENIR ANIMACIONES
window.addEventListener('resize', () => {
    isResizing = true;
    
    // Limpiar timeout anterior si existe
    clearTimeout(resizeTimeout);
    
    // Establecer timeout para considerar que el resize terminó
    resizeTimeout = setTimeout(() => {
        isResizing = false;
    }, 150); // 150ms de espera después del último resize
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        const imagen = document.querySelector('.obj-transicion');
        if (imagen) {
            imagen.classList.add('reset');
            setTimeout(() => {
                imagen.classList.remove('reset');
                imagen.classList.add('reactivate');
            }, 100);
        }
        
        const finalContent = document.querySelector('.content-after-expand');
        if (finalContent) {
            finalContent.className = 'content-after-expand';
        }

        const colorBackground = document.querySelector('.color-background');
        if (colorBackground) {
            colorBackground.className = 'color-background';
        }

        const navigationBar = document.querySelector('.navigation-bar');
        if (navigationBar) {
            navigationBar.className = 'navigation-bar';
        }

        document.body.offsetHeight;
    }
});

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

function enableScroll() {
    document.body.classList.add('scroll-enabled');
}

setTimeout(enableScroll, 11000);

// Función para detectar si el scroll va hacia arriba
function isScrollingUp(currentScrollY) {
    const lastScrollY = window.lastScrollY || 0;
    window.lastScrollY = currentScrollY;
    return currentScrollY < lastScrollY;
}

function preventScroll(e) {
    if (!document.body.classList.contains('scroll-enabled')) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || 
            e.key === 'PageDown' || e.key === 'PageUp' || 
            e.key === 'Home' || e.key === 'End' || e.key === ' ') {
            e.preventDefault();
        }
    }
    
    // Prevenir scroll hacia arriba si ya llegó al final
    if (hasReachedBottom && (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Home')) {
        e.preventDefault();
    }
}

function preventWheel(e) {
    if (!document.body.classList.contains('scroll-enabled')) {
        e.preventDefault();
        return;
    }
    
    // Prevenir scroll hacia arriba con la rueda del mouse si ya llegó al final
    if (hasReachedBottom && e.deltaY < 0) {
        e.preventDefault();
    }
}

// Función para prevenir el scroll táctil hacia arriba
function preventTouch(e) {
    if (!document.body.classList.contains('scroll-enabled')) {
        e.preventDefault();
        return;
    }
    
    // Para dispositivos táctiles, necesitamos detectar el movimiento hacia arriba
    const touch = e.touches[0];
    const currentY = touch.clientY;
    
    if (window.lastTouchY !== undefined && hasReachedBottom) {
        const deltaY = currentY - window.lastTouchY;
        if (deltaY > 0) { // Movimiento hacia arriba
            e.preventDefault();
        }
    }
    
    window.lastTouchY = currentY;
}

document.addEventListener('keydown', preventScroll);
document.addEventListener('wheel', preventWheel, { passive: false });
document.addEventListener('touchmove', preventTouch, { passive: false });

// SCROLL LISTENER ACTUALIZADO CON PROTECCIÓN CONTRA RESIZE
window.addEventListener('scroll', () => {
    // Si se está redimensionando, no ejecutar cambios de estado
    if (isResizing) {
        return;
    }
    
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const finalContent = document.querySelector('.content-after-expand');
    const colorBackground = document.querySelector('.color-background');
    const navigationBar = document.querySelector('.navigation-bar');
    
    // Detectar si llegó al final de la página
    const scrollBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.body.scrollHeight;
    
    // Margen de tolerancia de 10px para asegurar que detecte correctamente el final
    if (scrollBottom >= documentHeight - 10) {
        hasReachedBottom = true;
    }
    
    // Controlar el fondo verde
    if (colorBackground) {
        if (scrollProgress > 0.3 && !backgroundShown) {
            colorBackground.className = 'color-background show';
            backgroundShown = true;
        } else if (scrollProgress <= 0.2 && backgroundShown) {
            colorBackground.className = 'color-background hide';
            backgroundShown = false;
        }
    }

    // Controlar la navegación - aparece un poco antes que el contenido
    if (navigationBar) {
        if (scrollProgress > 0.5 && !navigationShown) {
            navigationBar.className = 'navigation-bar show';
            navigationShown = true;
        } else if (scrollProgress <= 0.4 && navigationShown) {
            navigationBar.className = 'navigation-bar hide';
            navigationShown = false;
        }
    }

    // Controlar el contenido final
    if (finalContent) {
        if (scrollProgress > 0.6 && !contentShown) {
            finalContent.className = 'content-after-expand show';
            contentShown = true;
        } else if (scrollProgress <= 0.5 && contentShown) {
            finalContent.className = 'content-after-expand hide';
            contentShown = false;
        }
    }
});

// AGREGAR EVENT LISTENERS A LOS ENLACES
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.href.includes('homepage.html') && !link.href.includes('#home')) {
                sessionStorage.setItem('fromSubpage', 'true');
            }
        });
    });
});

// Indicador de scroll
setTimeout(() => {
    if (document.body.classList.contains('scroll-enabled')) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.innerHTML = '↓ Scroll down ↓';
        scrollIndicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 1.2rem;
            z-index: 100;
            animation: pulse 2s infinite;
            background: rgba(0,0,0,0.5);
            padding: 10px 20px;
            border-radius: 25px;
        `;
        document.body.appendChild(scrollIndicator);

        let scrolled = false;
        window.addEventListener('scroll', () => {
            if (!scrolled && window.scrollY > 50) {
                scrolled = true;
                scrollIndicator.style.opacity = '0';
                setTimeout(() => scrollIndicator.remove(), 500);
            }
        });
    }
}, 11500);

// Añadir estilos para ocultar la barra de scroll
const style = document.createElement('style');
style.textContent = `
    /* Ocultar barras de scroll pero mantener funcionalidad */
    body::-webkit-scrollbar {
        display: none;
    }
    
    body {
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
        scrollbar-width: none;  /* Firefox */
    }
`;
document.head.appendChild(style);