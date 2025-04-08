document.addEventListener('DOMContentLoaded', function() {
    // Принудительно устанавливаем светлую тему
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    
    // Удаляем переключатель темы, если он есть на странице
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.remove();
    }
}); 