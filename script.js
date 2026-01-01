// Кастомный курсор
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;
let lastTrailTime = 0;
const trailInterval = 10; // Интервал между следами в миллисекундах

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

// Контейнер для следов (больше не используется для змейки)
const trailContainer = document.querySelector('.trail-container');
let mousePath = [];
let isDrawing = false;
let currentSnake = null;

// Убрана змейка от курсора

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
const interactiveElements = document.querySelectorAll('a, button, .work-item, .cta-button');

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

// Плавная прокрутка для навигации
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

// Анимация появления элементов при прокрутке
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию к элементам
document.querySelectorAll('.work-item, .about-text').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Эффект параллакса удален, так как на первой странице нет контента

// Скрытие курсора на мобильных устройствах
if (window.matchMedia('(max-width: 768px)').matches) {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// Центрирование кнопок с случайным смещением
function randomizeButtonPositions() {
    const buttons = document.querySelectorAll('.cta-button, .nav-link, .contact-link, .social-link');
    
    buttons.forEach(button => {
        // Генерируем случайное смещение от -30px до +30px
        const randomX = (Math.random() - 0.5) * 60;
        const randomY = (Math.random() - 0.5) * 60;
        
        // Применяем смещение
        button.style.position = 'relative';
        button.style.left = randomX + 'px';
        button.style.top = randomY + 'px';
        button.style.transition = 'all 0.3s ease';
    });
}

// Создание красной точки от курсора
function createRedDot(x, y) {
    const dot = document.createElement('div');
    dot.className = 'red-dot';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    document.body.appendChild(dot);
    
    // Случайная скорость для плавания
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
    
    // Анимация плавания
    function animateRedDot() {
        if (!document.body.contains(dot)) {
            return; // Точка была удалена
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
        
        // Небольшое случайное изменение направления
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

// Применяем случайное позиционирование после загрузки страницы
window.addEventListener('load', () => {
    randomizeButtonPositions();
    initParticles();
    initTitles();
});

// Система частиц (пыль/пиксели/песок)
let particles = [];
const particleCount = 5000; // Больше частиц для эффекта пыли/песка

// Красные точки от курсора
let redDots = [];
let lastRedDotTime = 0;
const redDotInterval = 50; // Интервал создания красных точек

function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем размер canvas
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
        
        particles.forEach((particle, index) => {
            // Обновление позиции
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Отскок от границ
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // Ограничение границ
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
            
            // Проверка коллизий убрана, так как больше нет упавших следов
            
            // Небольшое случайное изменение направления
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

// Генерация случайного серого цвета
function getRandomGrayColor() {
    const gray = Math.floor(Math.random() * 100) + 100; // Оттенки серого от 100 до 200
    return `rgba(${gray}, ${gray}, ${gray}`;
}

// Инициализация заголовков с возможностью перемещения
function initTitles() {
    const titles = document.querySelectorAll('.title-item');
    
    titles.forEach((title, index) => {
        // Начальная позиция - случайная
        const startX = Math.random() * (window.innerWidth - 200);
        const startY = Math.random() * (window.innerHeight - 100);
        
        title.style.left = startX + 'px';
        title.style.top = startY + 'px';
        
        // Создаем точки от заголовков постоянно
        setInterval(() => {
            createTitleDot(title);
        }, 500 + Math.random() * 500); // Каждые 0.5-1 секунду
        
        // Перетаскивание
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        title.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Левая кнопка мыши
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                
                if (e.target === title) {
                    isDragging = true;
                    title.classList.add('dragging');
                }
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                xOffset = currentX;
                yOffset = currentY;
                
                title.style.left = (startX + currentX) + 'px';
                title.style.top = (startY + currentY) + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                startX = parseFloat(title.style.left);
                startY = parseFloat(title.style.top);
                xOffset = 0;
                yOffset = 0;
                isDragging = false;
                title.classList.remove('dragging');
            }
        });
    });
}

// Создание точки от заголовка
function createTitleDot(title) {
    const rect = title.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Случайная позиция вокруг заголовка
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 20; // От 20 до 70 пикселей от центра
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    createRedDot(x, y);
}

// Функция distanceToLine удалена, так как больше не используется

