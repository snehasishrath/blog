(function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
    }

    document.addEventListener('DOMContentLoaded', () => {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
        darkModeToggle.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg';
        darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');

        darkModeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.toggle('dark');
            localStorage.setItem('darkMode', isDarkMode);
            darkModeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
        });

        document.body.appendChild(darkModeToggle);
    });
})();
