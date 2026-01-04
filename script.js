// Кастомный курсор
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

// Красные точки от курсора
let redDots = [];
let lastRedDotTime = 0;
const redDotInterval = 50;

// Система частиц
let particles = [];
const particleCount = 5000;

// Отслеживание движения мыши
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Создание красных точек от курсора
    const currentTime = Date.now();
    if (currentTime - lastRedDotTime > redDotInterval) {
        createRedDot(mouseX, mouseY);
        lastRedDotTime = currentTime;
    }
});

// Плавное следование для follower
function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateFollower);
}

animateFollower();

// Эффекты при наведении на интерактивные элементы
const interactiveElements = document.querySelectorAll('a, button');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// Скрытие курсора на мобильных устройствах
if (window.matchMedia('(max-width: 768px)').matches) {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// Создание красной точки от курсора
function createRedDot(x, y) {
    const dot = document.createElement('div');
    dot.className = 'red-dot';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    document.body.appendChild(dot);
    
    let vx = (Math.random() - 0.5) * 2;
    let vy = (Math.random() - 0.5) * 2;
    
    let currentX = x;
    let currentY = y;
    
    const dotData = {
        element: dot,
        x: currentX,
        y: currentY,
        vx: vx,
        vy: vy
    };
    
    redDots.push(dotData);
    
    function animateRedDot() {
        if (!document.body.contains(dot)) {
            return;
        }
        
        currentX += dotData.vx;
        currentY += dotData.vy;
        
        // Отскок от границ
        if (currentX <= 0 || currentX >= window.innerWidth) {
            dotData.vx *= -1;
            currentX = Math.max(0, Math.min(window.innerWidth, currentX));
        }
        if (currentY <= 0 || currentY >= window.innerHeight) {
            dotData.vy *= -1;
            currentY = Math.max(0, Math.min(window.innerHeight, currentY));
        }
        
        // Случайное изменение направления
        dotData.vx += (Math.random() - 0.5) * 0.05;
        dotData.vy += (Math.random() - 0.5) * 0.05;
        
        // Ограничение скорости
        const maxSpeed = 2;
        const speed = Math.sqrt(dotData.vx * dotData.vx + dotData.vy * dotData.vy);
        if (speed > maxSpeed) {
            dotData.vx = (dotData.vx / speed) * maxSpeed;
            dotData.vy = (dotData.vy / speed) * maxSpeed;
        }
        
        dot.style.left = currentX + 'px';
        dot.style.top = currentY + 'px';
        
        dotData.x = currentX;
        dotData.y = currentY;
        
        requestAnimationFrame(animateRedDot);
    }
    
    animateRedDot();
}

// Инициализация после загрузки
window.addEventListener('load', () => {
    initParticles();
    initTitles();
});

// Генерация случайного серого цвета
function getRandomGrayColor() {
    const gray = Math.floor(Math.random() * 100) + 100;
    return `rgba(${gray}, ${gray}, ${gray}`;
}

// Инициализация фоновых частиц
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Создаем частицы
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 0.5,
            color: getRandomGrayColor(),
            opacity: Math.random() * 0.5 + 0.3
        });
    }
    
    // Анимация частиц
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Обновление позиции
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Отскок от границ
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // Ограничение границ
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
            
            // Случайное изменение направления
            particle.vx += (Math.random() - 0.5) * 0.02;
            particle.vy += (Math.random() - 0.5) * 0.02;
            
            // Ограничение скорости
            const maxSpeed = 1;
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > maxSpeed) {
                particle.vx = (particle.vx / speed) * maxSpeed;
                particle.vy = (particle.vy / speed) * maxSpeed;
            }
            
            // Рисуем частицу
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            const colorParts = particle.color.split(',');
            ctx.fillStyle = `${colorParts[0]}, ${colorParts[1]}, ${colorParts[2]}, ${particle.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Инициализация облака точек и текста
function initTitles() {
    const cloudWrapper = document.querySelector('.cloud-wrapper');
    const cloudCanvas = document.getElementById('cloudCanvas');
    
    if (!cloudWrapper || !cloudCanvas) return;
    
    function initCloud() {
        const rect = cloudWrapper.getBoundingClientRect();
        cloudCanvas.width = rect.width;
        cloudCanvas.height = rect.height;
        
        createCloudDots(cloudCanvas, cloudWrapper);
    }
    
    setTimeout(() => {
        initCloud();
    }, 100);
    
    window.addEventListener('resize', () => {
        setTimeout(initCloud, 100);
    });
    
    // Для мобильных - показывать текст при тапе
    let touchTimeout;
    cloudWrapper.addEventListener('touchstart', (e) => {
        cloudWrapper.classList.add('active');
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            cloudWrapper.classList.remove('active');
        }, 3000);
    });
}

// Создание облака точек
function createCloudDots(canvas, wrapper) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const dotCount = 600;
    const dots = [];
    const centerX = width / 2;
    const centerY = height / 2;
    let isHovered = false;
    
    wrapper.addEventListener('mouseenter', () => {
        isHovered = true;
    });
    
    wrapper.addEventListener('mouseleave', () => {
        isHovered = false;
    });
    
    const radius = Math.min(width, height) * 0.45;
    
    // Создаем точки внутри круга
    for (let i = 0; i < dotCount; i++) {
        const randomValue = Math.random();
        const distance = Math.sqrt(randomValue) * radius;
        const angle = Math.random() * Math.PI * 2;
        
        const startX = centerX + Math.cos(angle) * distance;
        const startY = centerY + Math.sin(angle) * distance;
        
        dots.push({
            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            color: getRandomGrayColor()
        });
    }
    
    // Анимация точек
    function animateDots() {
        ctx.clearRect(0, 0, width, height);
        
        dots.forEach(dot => {
            // Обновление позиции
            dot.x += dot.vx;
            dot.y += dot.vy;
            
            // Проверка границ круга и отскок
            const distance = Math.sqrt(
                Math.pow(dot.x - centerX, 2) + Math.pow(dot.y - centerY, 2)
            );
            
            if (distance > radius) {
                const angle = Math.atan2(dot.y - centerY, dot.x - centerX);
                dot.x = centerX + Math.cos(angle) * radius;
                dot.y = centerY + Math.sin(angle) * radius;
                
                // Отражение скорости
                const normalX = Math.cos(angle);
                const normalY = Math.sin(angle);
                const dotProduct = dot.vx * normalX + dot.vy * normalY;
                dot.vx -= 2 * dotProduct * normalX;
                dot.vy -= 2 * dotProduct * normalY;
            }
            
            // Случайное изменение направления
            dot.vx += (Math.random() - 0.5) * 0.02;
            dot.vy += (Math.random() - 0.5) * 0.02;
            
            // Ограничение скорости
            const maxSpeed = 1;
            const speed = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy);
            if (speed > maxSpeed) {
                dot.vx = (dot.vx / speed) * maxSpeed;
                dot.vy = (dot.vy / speed) * maxSpeed;
            }
            
            // Рисуем точку
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
            
            const opacity = isHovered ? dot.opacity * 0.6 : dot.opacity;
            const colorParts = dot.color.split(',');
            ctx.fillStyle = `${colorParts[0]}, ${colorParts[1]}, ${colorParts[2]}, ${opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateDots);
    }
    
    animateDots();
}
