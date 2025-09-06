import SnakeGame from './snake-game.js';

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function typewriterEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 500);
}

function setupHoverSounds() {
    const buttons = document.querySelectorAll('.game-button, .control-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.volume = 0.05;
            audio.play().catch(() => {});
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    animateValue(document.getElementById('linesOfCode'), 0, 42069, 2000);
    animateValue(document.getElementById('coffeeCount'), 0, 2847, 2000);
    animateValue(document.getElementById('bugsFixed'), 0, 9001, 2000);
    animateValue(document.getElementById('projectsCount'), 0, 127, 2000);
    
    typewriterEffect(document.querySelector('.subtitle'));
    
    setupHoverSounds();
    
    new SnakeGame('gameCanvas', 'score', 'highScore', 'startBtn');
});