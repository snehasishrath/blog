// Pagination variables
let currentPage = 1;
const postsPerPage = 5;

function paginatePosts(posts) {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    return posts.slice(start, end);
}

function renderPaginationControls(totalPosts) {
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'flex justify-center mt-4';

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `px-4 py-2 mx-1 ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderPosts(paginatePosts(posts));
            document.querySelectorAll('.pagination button').forEach(btn => btn.className = 'px-4 py-2 mx-1 bg-gray-200');
            pageButton.className = 'px-4 py-2 mx-1 bg-blue-600 text-white';
        });
        paginationContainer.appendChild(pageButton);
    }

    return paginationContainer;
}

// Improved error handling for fetch
fetch('./posts.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(posts => {
        const paginatedPosts = paginatePosts(posts);
        renderPosts(paginatedPosts);

        const paginationControls = renderPaginationControls(posts.length);
        document.body.appendChild(paginationControls);

        // Add Fuse.js for client-side search
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search posts...';
        searchInput.className = 'border p-2 rounded mb-4 w-full';
        searchInput.setAttribute('aria-label', 'Search posts');
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value;
            const fuse = new Fuse(posts, { keys: ['title', 'tags', 'excerpt'] });
            const results = query ? fuse.search(query).map(result => result.item) : posts;
            renderPosts(paginatePosts(results));
        });

        const mainContainer = document.querySelector('main');
        mainContainer.insertBefore(searchInput, document.getElementById('posts'));

        function renderPosts(posts) {
            const postsContainer = document.getElementById('posts');
            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'bg-white p-4 rounded shadow';
                postElement.innerHTML = `
                    <h2 class='text-xl font-bold'>${post.title}</h2>
                    <p>${post.excerpt}</p>
                    <p class='text-sm text-gray-500'>${new Date(post.date).toLocaleDateString()}</p>
                    <a href='post.html?slug=${post.slug}' class='text-blue-600 underline'>Read more</a>
                `;
                postsContainer.appendChild(postElement);
            });
        }

        // Enhanced dark mode toggle button design
        const darkModeToggle = document.createElement('button');
        darkModeToggle.textContent = localStorage.getItem('darkMode') === 'true' ? 'Light Mode' : 'Dark Mode';
        darkModeToggle.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg';
        darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');

        darkModeToggle.addEventListener('click', () => {
            const isDarkMode = document.body.classList.toggle('dark');
            localStorage.setItem('darkMode', isDarkMode);
            darkModeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
        });

        document.body.appendChild(darkModeToggle);

        // Apply saved dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
        }
    })
    .catch(error => {
        console.error('Error loading posts:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Failed to load posts. Please try again later.';
        errorMessage.className = 'text-red-600 text-center';
        document.getElementById('posts').appendChild(errorMessage);
    });