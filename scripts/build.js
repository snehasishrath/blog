const fs = require('fs');
const path = require('path');
const postsDir = path.join(__dirname, '../posts');
const outputFile = path.join(__dirname, '../posts.json');

// Helper to remove wrapping quotes from front matter values
function clean(value) {
    const trimmed = value.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
}

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
            frontmatter
                .split('\n')
                .filter(line => line)
                .map(line => {
                    const [key, ...value] = line.split(':');
                    return [key.trim(), clean(value.join(':'))];
                })
        );

        const tags = metadataObj.tags
            ? metadataObj.tags
                  .replace(/^\[|\]$/g, '')
                  .split(',')
                  .map(tag => clean(tag))
                  .filter(Boolean)
            : [];

        return {
            title: clean(metadataObj.title || ''),
            date: clean(metadataObj.date || ''),
            author: clean(metadataObj.author || ''),
            tags,
            slug: clean(metadataObj.slug || ''),
            excerpt: content.split('---')[2].trim().split('\n')[0] // First line after metadata
        };
    }).filter(post => post !== null);

    fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2), 'utf-8');
    console.log('posts.json generated successfully.');
});