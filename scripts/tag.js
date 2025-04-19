// Fetch and display posts filtered by tag
const urlParams = new URLSearchParams(window.location.search);
const tag = urlParams.get('tag');

if (tag) {
    fetch('posts.json')
        .then(response => response.json())
        .then(posts => {
            const filteredPosts = posts.filter(post => post.tags.includes(tag));
            const postsContainer = document.getElementById('tag-posts');
            filteredPosts.forEach(post => {
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
        })
        .catch(error => console.error('Error loading posts:', error));
} else {
    document.getElementById('tag-posts').innerHTML = '<p>No posts found for this tag.</p>';
}