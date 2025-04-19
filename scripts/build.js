const fs = require('fs');
const path = require('path');
const postsDir = path.join(__dirname, '../posts');
const outputFile = path.join(__dirname, '../posts.json');

fs.readdir(postsDir, (err, files) => {
    if (err) {
        console.error('Error reading posts directory:', err);
        return;
    }

    const posts = files.map(file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const metadata = content.match(/---([\s\S]*?)---/);

        if (!metadata) return null;

        const frontmatter = metadata[1];
        const metadataObj = Object.fromEntries(
            frontmatter.split('\n').filter(line => line).map(line => {
                const [key, ...value] = line.split(':');
                return [key.trim(), value.join(':').trim()];
            })
        );

        return {
            title: metadataObj.title,
            date: metadataObj.date,
            author: metadataObj.author,
            tags: metadataObj.tags ? metadataObj.tags.split(',').map(tag => tag.trim()) : [],
            slug: metadataObj.slug,
            excerpt: content.split('---')[2].trim().split('\n')[0] // First line after metadata
        };
    }).filter(post => post !== null);

    fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2), 'utf-8');
    console.log('posts.json generated successfully.');
});