// Fetch and render the blog post
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

if (slug) {
    fetch(`posts/${slug}.md`)
        .then(response => response.text())
        .then(markdown => {
            const postContent = document.getElementById('post-content');
            const renderer = new marked.Renderer();
            postContent.innerHTML = marked(markdown, { renderer });
        })
        .catch(error => console.error('Error loading post:', error));
} else {
    document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
}