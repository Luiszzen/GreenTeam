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

// esto resetea el scroll cuando la pagina se renicia
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // si una subpagina va a home, se salta la animacion de introducicon
    if (isReturningFromSubpage) {
        // Limpiar el flag
        sessionStorage.removeItem('fromSubpage');
        document.body.style.backgroundColor = '#ffffff';
        
        // Habilitar scroll inmediatamente
        document.body.classList.add('scroll-enabled');
        const navigationBar = document.querySelector('.navigation-bar');
        if (navigationBar) {
            navigationBar.className = 'navigation-bar show';
            navigationShown = true;
        }
        const finalContent = document.querySelector('.content-after-expand');
        if (finalContent) {
            finalContent.className = 'content-after-expand show';
            finalContent.style.opacity = '1 !important';
            finalContent.style.transform = 'translateY(0) !important';
            finalContent.style.animation = 'none !important';
            contentShown = true;
        }
        const colorBackground = document.querySelector('.color-background');
        if (colorBackground) {
            colorBackground.className = 'color-background show';
            colorBackground.style.opacity = '1 !important';
            colorBackground.style.animation = 'none !important';
            backgroundShown = true;
        }
        const backAfExpand = document.querySelector('.back_af_expand');
        if (backAfExpand) {
            backAfExpand.style.opacity = '1 !important';
            backAfExpand.style.animation = 'none !important';
        }
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
        
        return;
    }
    
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

// esto agrega eventlisteners
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

// config de sist de admin
const SUPERADMIN_EMAIL = "lastocazaj@gmail.com";
const SUPERADMIN_PASSWORD = "Reciclon2025";

// Definir tipos de usuario
const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    SUPERADMIN: 'superadmin'
};

// esta es la base de datos local
class LocalDatabase {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('reciclatonUsers') || '[]');
        this.nextId = parseInt(localStorage.getItem('reciclatonNextId') || '1');
        this.currentUser = JSON.parse(localStorage.getItem('reciclatonCurrentUser') || 'null');
    }

    saveUser(userData) {
        if (this.users.find(user => user.email === userData.email)) {
            throw new Error('Este correo ya está registrado');
        }

        const newUser = {
            id: this.nextId++,
            ...userData,
            createdAt: new Date().toISOString(),
            role: userData.email === SUPERADMIN_EMAIL ? USER_ROLES.SUPERADMIN : USER_ROLES.USER,
            // Mantener compatibilidad con el campo isAdmin
            isAdmin: userData.email === SUPERADMIN_EMAIL
        };

        this.users.push(newUser);
        this.save();
        return newUser;
    }

    authenticate(email, password) {
        const user = this.users.find(u => u.email === email);
        
        // Verificar superadmin hardcodeado
        if (email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
            const superadminUser = user || {
                id: 0,
                firstName: 'Super',
                lastName: 'Admin',
                email: SUPERADMIN_EMAIL,
                role: USER_ROLES.SUPERADMIN,
                isAdmin: true,
                createdAt: new Date().toISOString()
            };
            
            if (!user) {
                this.users.unshift(superadminUser);
                this.save();
            } else if (user.role !== USER_ROLES.SUPERADMIN) {
                // Actualizar usuario existente a superadmin
                user.role = USER_ROLES.SUPERADMIN;
                user.isAdmin = true;
                this.save();
            }
            
            this.currentUser = superadminUser;
            localStorage.setItem('reciclatonCurrentUser', JSON.stringify(superadminUser));
            return superadminUser;
        }
        
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        
        if (user.password !== password) {
            throw new Error('Contraseña incorrecta');
        }
        
        this.currentUser = user;
        localStorage.setItem('reciclatonCurrentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('reciclatonCurrentUser');
    }

    updateUser(userId, updates) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) throw new Error('Usuario no encontrado');
        
        Object.assign(this.users[userIndex], updates);
        this.save();
        return this.users[userIndex];
    }

    deleteUser(userId) {
        // No se puede eliminar al superadmin
        const user = this.users.find(u => u.id === userId);
        if (user && user.role === USER_ROLES.SUPERADMIN) {
            throw new Error('No se puede eliminar al Superadministrador');
        }
        
        this.users = this.users.filter(u => u.id !== userId);
        this.save();
    }

    promoteToAdmin(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) throw new Error('Usuario no encontrado');
        
        // Solo superadmin puede promover
        if (!this.isCurrentUserSuperAdmin()) {
            throw new Error('Solo el Superadministrador puede promover usuarios');
        }
        
        user.role = USER_ROLES.ADMIN;
        user.isAdmin = true;
        this.save();
        return user;
    }

    demoteFromAdmin(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) throw new Error('Usuario no encontrado');
        
        // No se puede degradar al superadmin
        if (user.role === USER_ROLES.SUPERADMIN) {
            throw new Error('No se puede degradar al Superadministrador');
        }
        
        // Solo superadmin puede degradar admins
        if (!this.isCurrentUserSuperAdmin()) {
            throw new Error('Solo el Superadministrador puede degradar administradores');
        }
        
        user.role = USER_ROLES.USER;
        user.isAdmin = false;
        this.save();
        return user;
    }

    save() {
        localStorage.setItem('reciclatonUsers', JSON.stringify(this.users));
        localStorage.setItem('reciclatonNextId', this.nextId.toString());
    }

    getAllUsers() {
        return this.users;
    }

    isCurrentUserAdmin() {
        return this.currentUser && (this.currentUser.isAdmin || this.currentUser.role === USER_ROLES.ADMIN || this.currentUser.role === USER_ROLES.SUPERADMIN);
    }

    isCurrentUserSuperAdmin() {
        return this.currentUser && this.currentUser.role === USER_ROLES.SUPERADMIN;
    }

    getUserRole(user) {
        // Asegurar compatibilidad con usuarios antiguos
        if (user.role) return user.role;
        if (user.email === SUPERADMIN_EMAIL) return USER_ROLES.SUPERADMIN;
        if (user.isAdmin) return USER_ROLES.ADMIN;
        return USER_ROLES.USER;
    }

    getRoleDisplayName(role) {
        switch (role) {
            case USER_ROLES.SUPERADMIN: return 'SUPERADMIN';
            case USER_ROLES.ADMIN: return 'ADMIN';
            default: return 'USER';
        }
    }

    getRoleColor(role) {
        switch (role) {
            case USER_ROLES.SUPERADMIN: return '#f92672';
            case USER_ROLES.ADMIN: return '#fd971f';
            default: return '#66d9ef';
        }
    }

    canModifyUser(targetUserId) {
        if (!this.currentUser) return false;
        
        const targetUser = this.users.find(u => u.id === targetUserId);
        if (!targetUser) return false;
        
        const currentRole = this.getUserRole(this.currentUser);
        const targetRole = this.getUserRole(targetUser);
        
        // Verificación explícita para superadmin
        if (this.currentUser.email === SUPERADMIN_EMAIL || currentRole === USER_ROLES.SUPERADMIN) {
            return true;
        }
        
        // Admin solo puede modificar usuarios normales
        if (currentRole === USER_ROLES.ADMIN && targetRole === USER_ROLES.USER) {
            return true;
        }
        
        return false;
    }

    canDeleteUser(targetUserId) {
        if (!this.currentUser) return false;
        
        const targetUser = this.users.find(u => u.id === targetUserId);
        if (!targetUser) return false;
        
        const targetRole = this.getUserRole(targetUser);
        
        // No se puede eliminar al superadmin
        if (targetRole === USER_ROLES.SUPERADMIN || targetUser.email === SUPERADMIN_EMAIL) return false;
        
        return this.canModifyUser(targetUserId);
    }

    canChangeRole(targetUserId) {
        if (!this.currentUser) return false;
        
        const targetUser = this.users.find(u => u.id === targetUserId);
        if (!targetUser) return false;
        
        const currentRole = this.getUserRole(this.currentUser);
        const targetRole = this.getUserRole(targetUser);
        
        // Verificación explícita para superadmin
        if (this.currentUser.email !== SUPERADMIN_EMAIL && currentRole !== USER_ROLES.SUPERADMIN) {
            return false;
        }
        
        // Superadmin no puede cambiar su propio rol
        if ((targetRole === USER_ROLES.SUPERADMIN || targetUser.email === SUPERADMIN_EMAIL) && targetUserId === this.currentUser.id) {
            return false;
        }
        
        // No se puede cambiar el rol del superadmin
        if (targetRole === USER_ROLES.SUPERADMIN || targetUser.email === SUPERADMIN_EMAIL) {
            return false;
        }
        
        return true;
    }
}

const db = new LocalDatabase();
let currentForm = 'register';

// func de UI
function showAuthModal() {
    document.getElementById('authModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showLoginModal() {
    switchForm('login');
    showAuthModal();
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('show');
    document.body.style.overflow = '';
    clearForm();
}

function clearForm() {
    document.getElementById('registrationForm').reset();
    clearErrors();
}

function clearErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
}

function showError(fieldId, message) {
    const group = document.getElementById(fieldId).closest('.form-group');
    group.classList.add('error');
    const errorMsg = group.querySelector('.error-message');
    if (errorMsg) errorMsg.textContent = message;
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => successDiv.classList.add('show'), 100);
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => successDiv.remove(), 500);
    }, 4000);
}

function switchForm(formType) {
    currentForm = formType;
    const registrationFields = document.querySelectorAll('.registration-fields');
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const submitText = document.getElementById('submitText');
    
    // Actualizar botones de switch
    document.querySelectorAll('.switch-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.form === formType);
    });

    if (formType === 'login') {
        registrationFields.forEach(field => field.style.display = 'none');
        formTitle.textContent = 'Iniciar Sesión';
        formSubtitle.textContent = 'Accede a tu cuenta de Reciclatón';
        submitText.textContent = 'Iniciar Sesión';
        
        // Hacer campos opcionales para login
        document.getElementById('firstName').required = false;
        document.getElementById('lastName').required = false;
        document.getElementById('age').required = false;
    } else {
        registrationFields.forEach(field => field.style.display = 'block');
        formTitle.textContent = '¡Únete a Reciclatón!';
        formSubtitle.textContent = 'Comienza tu viaje hacia un futuro más verde';
        submitText.textContent = 'Registrarse';
        
        // Hacer campos requeridos para registro
        document.getElementById('firstName').required = true;
        document.getElementById('lastName').required = true;
        document.getElementById('age').required = true;
    }
}

// func de validacion
function validateRegistration(formData) {
    let isValid = true;
    clearErrors();

    if (!formData.firstName.trim()) {
        showError('firstName', 'El nombre es requerido');
        isValid = false;
    }

    if (!formData.lastName.trim()) {
        showError('lastName', 'El apellido es requerido');
        isValid = false;
    }

    if (!formData.email.trim()) {
        showError('email', 'El correo es requerido');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showError('email', 'Ingresa un correo válido');
        isValid = false;
    }

    if (!formData.password) {
        showError('password', 'La contraseña es requerida');
        isValid = false;
    } else if (formData.password.length < 8) {
        showError('password', 'La contraseña debe tener al menos 8 caracteres');
        isValid = false;
    }

    if (!formData.age || formData.age < 13 || formData.age > 120) {
        showError('age', 'La edad debe estar entre 13 y 120 años');
        isValid = false;
    }

    return isValid;
}

function validateLogin(formData) {
    let isValid = true;
    clearErrors();

    if (!formData.email.trim()) {
        showError('email', 'El correo es requerido');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showError('email', 'Ingresa un correo válido');
        isValid = false;
    }

    if (!formData.password) {
        showError('password', 'La contraseña es requerida');
        isValid = false;
    }

    return isValid;
}

// func de admin de contingencia
function showAdminPanel() {
    if (!db.isCurrentUserAdmin()) {
        alert('No tienes permisos de administrador');
        return;
    }
    
    updateAdminPanel();
    document.getElementById('adminPanel').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeAdminPanel() {
    document.getElementById('adminPanel').classList.remove('show');
    document.body.style.overflow = '';
}

function updateAdminPanel() {
    const users = db.getAllUsers();
    const currentUserRole = db.getUserRole(db.currentUser);
    
    // Actualizar estadísticas
    const statsHtml = `
        <div class="stat-card">
            <span class="stat-number">${users.length}</span>
            <div class="stat-label">Total Usuarios</div>
        </div>
        <div class="stat-card">
            <span class="stat-number">${users.filter(u => db.getUserRole(u) === USER_ROLES.SUPERADMIN).length}</span>
            <div class="stat-label">Superadmins</div>
        </div>
        <div class="stat-card">
            <span class="stat-number">${users.filter(u => db.getUserRole(u) === USER_ROLES.ADMIN).length}</span>
            <div class="stat-label">Administradores</div>
        </div>
        <div class="stat-card">
            <span class="stat-number">${users.filter(u => {
                const createdDate = new Date(u.createdAt);
                const today = new Date();
                return createdDate.toDateString() === today.toDateString();
            }).length}</span>
            <div class="stat-label">Registros Hoy</div>
        </div>
        <div class="stat-card">
            <span class="stat-number">${users.filter(u => db.getUserRole(u) === USER_ROLES.USER).length}</span>
            <div class="stat-label">Usuarios Regulares</div>
        </div>
    `;
    
    document.getElementById('adminStats').innerHTML = statsHtml;
    
    // Actualizar lista de usuarios
    const usersHtml = users.map(user => {
        const userRole = db.getUserRole(user);
        const roleDisplayName = db.getRoleDisplayName(userRole);
        const roleColor = db.getRoleColor(userRole);
        
        return `
        <div class="user-card" data-user-id="${user.id}">
            <div class="user-header">
                <div class="user-info">
                    <div class="user-name">
                        ${user.firstName} ${user.lastName}
                        <span class="user-status" style="background: ${roleColor}; color: white;">
                            ${roleDisplayName}
                        </span>
                    </div>
                    <div class="user-details">
                        <div>📧 ${user.email}</div>
                        <div>🎂 ${user.age || 'N/A'} años</div>
                        <div>📅 ${new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="user-actions">
                    ${db.canModifyUser(user.id) ? `
                        <button class="btn btn-primary btn-small" onclick="editUser(${user.id})">
                            ✏️ Editar
                        </button>
                    ` : ''}
                    ${db.canDeleteUser(user.id) ? `
                        <button class="btn btn-danger btn-small" onclick="deleteUser(${user.id})">
                            🗑️ Eliminar
                        </button>
                    ` : ''}
                    ${db.canChangeRole(user.id) ? `
                        <button class="btn btn-secondary btn-small" onclick="toggleUserRole(${user.id})">
                            ${userRole === USER_ROLES.ADMIN ? '⬇️ Degradar' : '⬆️ Promover'}
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    const panelTitle = currentUserRole === USER_ROLES.SUPERADMIN ? 
        'Panel de Superadministración' : 'Panel de Administración';
    
    document.getElementById('adminUsersList').innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #a6e22e;">${panelTitle} - Lista de Usuarios (${users.length})</h3>
        ${usersHtml || '<p style="text-align: center; opacity: 0.7;">No hay usuarios registrados.</p>'}
    `;
}

function editUser(userId) {
    const user = db.users.find(u => u.id === userId);
    if (!user) return;

    if (!db.canModifyUser(userId)) {
        alert('No tienes permisos para modificar este usuario');
        return;
    }

    const newName = prompt('Nuevo nombre:', user.firstName);
    const newLastName = prompt('Nuevo apellido:', user.lastName);
    const newAge = prompt('Nueva edad:', user.age);

    if (newName !== null || newLastName !== null || newAge !== null) {
        const updates = {};
        if (newName !== null && newName.trim()) updates.firstName = newName.trim();
        if (newLastName !== null && newLastName.trim()) updates.lastName = newLastName.trim();
        if (newAge !== null && !isNaN(newAge) && newAge >= 13) updates.age = parseInt(newAge);

        try {
            db.updateUser(userId, updates);
            updateAdminPanel();
            showSuccessMessage('Usuario actualizado correctamente');
        } catch (error) {
            alert('Error al actualizar usuario: ' + error.message);
        }
    }
}

function deleteUser(userId) {
    if (!db.canDeleteUser(userId)) {
        alert('No tienes permisos para eliminar este usuario');
        return;
    }

    const user = db.users.find(u => u.id === userId);
    if (!user) return;

    const userRole = db.getRoleDisplayName(db.getUserRole(user));
    
    if (confirm(`¿Estás seguro de que quieres eliminar a ${user.firstName} ${user.lastName} (${userRole})?`)) {
        try {
            db.deleteUser(userId);
            updateAdminPanel();
            showSuccessMessage('Usuario eliminado correctamente');
        } catch (error) {
            alert('Error al eliminar usuario: ' + error.message);
        }
    }
}

function toggleUserRole(userId) {
    console.log('=== DEBUG TOGGLE USER ROLE ===');
    console.log('Usuario actual:', db.currentUser);
    console.log('Es Superadmin?:', db.isCurrentUserSuperAdmin());
    console.log('Email:', db.currentUser?.email);
    console.log('Rol:', db.getUserRole(db.currentUser));
    
    if (!db.canChangeRole(userId)) {
        alert('No tienes permisos para cambiar el rol de este usuario');
        return;
    }

    const user = db.users.find(u => u.id === userId);
    if (!user) return;

    const currentRole = db.getUserRole(user);
    console.log('Usuario objetivo:', user);
    console.log('Rol actual del usuario objetivo:', currentRole);
    
    let newRole;
    let actionDescription;

    if (currentRole === USER_ROLES.USER) {
        newRole = USER_ROLES.ADMIN;
        actionDescription = `promover a ${user.firstName} ${user.lastName} a Administrador`;
    } else if (currentRole === USER_ROLES.ADMIN) {
        newRole = USER_ROLES.USER;
        actionDescription = `degradar a ${user.firstName} ${user.lastName} a Usuario Regular`;
    } else {
        alert('No se puede cambiar el rol del Superadministrador');
        return;
    }

    if (confirm(`¿Estás seguro de que quieres ${actionDescription}?`)) {
        try {
            if (newRole === USER_ROLES.ADMIN) {
                console.log('Intentando promover a admin...');
                db.promoteToAdmin(userId);
                showSuccessMessage(`${user.firstName} ha sido promovido/a a Administrador`);
            } else {
                console.log('Intentando degradar de admin...');
                db.demoteFromAdmin(userId);
                showSuccessMessage(`${user.firstName} ha sido degradado/a a Usuario Regular`);
            }
            updateAdminPanel();
        } catch (error) {
            console.error('Error al cambiar rol:', error);
            alert('Error al cambiar rol: ' + error.message);
        }
    }
}

function updateNavigationState() {
    const loginBtn = document.getElementById('loginBtn');
    const adminBtn = document.getElementById('adminBtn');
    
    if (db.currentUser) {
        const userRole = db.getUserRole(db.currentUser);
        let displayName = db.currentUser.firstName;
        
        // Agregar indicador de rol para admins y superadmins
        if (userRole === USER_ROLES.SUPERADMIN) {
            displayName += ' (SA)';
        } else if (userRole === USER_ROLES.ADMIN) {
            displayName += ' (A)';
        }
        
        loginBtn.textContent = `Cerrar sesión`;
        loginBtn.onclick = () => {
            if (confirm('¿Quieres cerrar sesión?')) {
                db.logout();
                updateNavigationState();
                showSuccessMessage('Sesión cerrada correctamente');
            }
        };
        
        if (db.isCurrentUserAdmin()) {
            adminBtn.style.display = 'inline';
            // Cambiar texto del botón según el rol
            adminBtn.textContent = userRole === USER_ROLES.SUPERADMIN ? 'Super Admin' : 'Admin';
        } else {
            adminBtn.style.display = 'none';
        }
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = showLoginModal;
        adminBtn.style.display = 'none';
    }
}

// formularios
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        password: document.getElementById('password').value,
        age: parseInt(document.getElementById('age').value)
    };

    try {
        if (currentForm === 'register') {
            if (!validateRegistration(formData)) return;
            
            const newUser = db.saveUser(formData);
            const userRole = db.getRoleDisplayName(db.getUserRole(newUser));
            showSuccessMessage(`¡Registro exitoso! Bienvenido/a ${newUser.firstName} (${userRole})`);
            closeAuthModal();
            updateNavigationState();
            
        } else if (currentForm === 'login') {
            if (!validateLogin(formData)) return;
            
            const user = db.authenticate(formData.email, formData.password);
            const userRole = db.getRoleDisplayName(db.getUserRole(user));
            showSuccessMessage(`¡Bienvenido/a de vuelta, ${user.firstName}! (${userRole})`);
            closeAuthModal();
            updateNavigationState();
        }

        // Verificar si necesita redirigir a recycle después del login
        setTimeout(() => {
            if (sessionStorage.getItem('redirectToRecycle') && db.currentUser && db.isCurrentUserAdmin()) {
                sessionStorage.setItem('fromSubpage', 'true');
                window.location.href = './subpages/recycle.html';
            }
        }, 1500);

    } catch (error) {
        console.error('Error:', error);
        if (error.message === 'Este correo ya está registrado') {
            showError('email', error.message);
        } else if (error.message === 'Usuario no encontrado') {
            showError('email', error.message);
        } else if (error.message === 'Contraseña incorrecta') {
            showError('password', error.message);
        } else {
            alert('Error: ' + error.message);
        }
    }
});

// Event listeners para los botones de switch
document.querySelectorAll('.switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchForm(btn.dataset.form);
        clearForm();
    });
});

// func de compatibilidad
// Estas funciones mantienen compatibilidad con el código del leaderboard
function toggleAdmin(userId) {
    // Redirigir a la nueva función toggleUserRole
    toggleUserRole(userId);
}

// inicializacion
document.addEventListener('DOMContentLoaded', () => {
    // Migrar usuarios existentes al nuevo sistema de roles
    db.users.forEach(user => {
        if (!user.role) {
            if (user.email === SUPERADMIN_EMAIL) {
                user.role = USER_ROLES.SUPERADMIN;
            } else if (user.isAdmin) {
                user.role = USER_ROLES.ADMIN;
            } else {
                user.role = USER_ROLES.USER;
            }
        }
    });
    db.save();
    
    updateNavigationState();
    
    // Verificar redirección desde recycle
    if (sessionStorage.getItem('redirectToRecycle') && db.currentUser && db.isCurrentUserAdmin()) {
        // Si ya está logueado como admin, redirigir de vuelta
        setTimeout(() => {
            sessionStorage.setItem('fromSubpage', 'true');
            window.location.href = './subpages/recycle.html';
        }, 1000);
        return;
    }
    
    // Auto-mostrar modal de registro después de la animación si no hay usuario logueado
    setTimeout(() => {
        if (!sessionStorage.getItem('fromSubpage') && !db.currentUser) {
            showAuthModal();
        }
    }, 11500);
});

// Cerrar modales con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAuthModal();
        closeAdminPanel();
    }
});

// Cerrar modales haciendo clic fuera
document.getElementById('authModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeAuthModal();
    }
});

document.getElementById('adminPanel').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeAdminPanel();
    }
});