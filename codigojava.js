// RESETEAR SCROLL AL INICIO AL CARGAR LA PÁGINA
        window.addEventListener('load', () => {
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

            // Resetear navegación
            const navigationBar = document.querySelector('.navigation-bar');
            if (navigationBar) {
                navigationBar.className = 'navigation-bar';
            }

            document.body.offsetHeight;
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

        function preventScroll(e) {
            if (!document.body.classList.contains('scroll-enabled')) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || 
                    e.key === 'PageDown' || e.key === 'PageUp' || 
                    e.key === 'Home' || e.key === 'End' || e.key === ' ') {
                    e.preventDefault();
                }
            }
        }

        function preventWheel(e) {
            if (!document.body.classList.contains('scroll-enabled')) {
                e.preventDefault();
            }
        }

        document.addEventListener('keydown', preventScroll);
        document.addEventListener('wheel', preventWheel, { passive: false });
        document.addEventListener('touchmove', preventWheel, { passive: false });

        // Variables de estado
        let contentShown = false;
        let backgroundShown = false;
        let navigationShown = false;
        
        window.addEventListener('scroll', () => {
            const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            const finalContent = document.querySelector('.content-after-expand');
            const colorBackground = document.querySelector('.color-background');
            const navigationBar = document.querySelector('.navigation-bar');
            
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