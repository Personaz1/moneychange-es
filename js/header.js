// Set active menu item based on current page
function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.main-nav .nav-link');
    
    menuItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        
        if (href === currentPath || 
            (href === '/' && (currentPath === '/' || currentPath === '')) ||
            (href !== '/' && currentPath.includes(href))) {
            item.classList.add('active');
        }
    });
}

// Initialize header functionality
function initHeader() {
    // Load header component
    fetch('/components/header')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-component').innerHTML = data;
            // Initialize theme toggle and set active menu item
            initThemeToggle();
            setActiveMenuItem();
        });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme if exists
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateToggleIcon(savedTheme);
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(newTheme);
    });
}

// Update toggle button icon based on theme
function updateToggleIcon(theme) {
    const iconElement = document.getElementById('theme-toggle').querySelector('i');
    if (theme === 'dark') {
        iconElement.className = 'fas fa-sun';
    } else {
        iconElement.className = 'fas fa-moon';
    }
}

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', initHeader); 

function setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if ((href === '/' && (currentPath === '/' || currentPath === '')) ||
            (href !== '/' && currentPath.includes(href))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
} 