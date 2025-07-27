// Function to strip front matter from Markdown content
function stripFrontMatter(markdown) {
    const frontMatterRegex = /^---\n[\s\S]*?\n---\n/;
    return markdown.replace(frontMatterRegex, '');
}


// Fetch and render the blog post
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

if (slug) {
    console.log('Fetching post:', `posts/${slug}.md`);
    fetch(`posts/${slug}.md`)
        .then(response => response.text())
        .then(markdown => {
            console.log('Fetched Markdown content:', markdown);
            const postContent = document.getElementById('post-content');
            const strippedMarkdown = stripFrontMatter(markdown);
            console.log('Stripped Markdown content:', strippedMarkdown);
            postContent.innerHTML = marked.parse(strippedMarkdown); // Updated to use marked.parse
        })
        .catch(error => console.error('Error loading post:', error));
} else {
    document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
}