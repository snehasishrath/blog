fetch('posts.json')
    .then(response => response.json())
    .then(posts => {
        const tagSet = new Set();
        posts.forEach(post => post.tags.forEach(t => tagSet.add(t)));
        const tagList = document.getElementById('tag-list');
        tagSet.forEach(tag => {
            const tagEl = document.createElement('a');
            tagEl.href = `tag.html?tag=${encodeURIComponent(tag)}`;
            tagEl.className = 'block bg-white p-4 rounded shadow text-center hover:underline';
            tagEl.textContent = tag;
            tagList.appendChild(tagEl);
        });
    })
    .catch(err => {
        console.error('Error loading tags:', err);
        document.getElementById('tag-list').textContent = 'Failed to load tags.';
    });
