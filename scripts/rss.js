const fs = require('fs');
const path = require('path');
const postsDir = path.join(__dirname, '../posts');
const outputFile = path.join(__dirname, '../rss.xml');

const siteUrl = 'https://your-blog-site.com';
const rssHeader = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Your Blog</title>
  <link>${siteUrl}</link>
  <description>A collection of blog posts</description>
`;

const rssFooter = `</channel>
</rss>`;

fs.readdir(postsDir, (err, files) => {
    if (err) {
        console.error('Error reading posts directory:', err);
        return;
    }

    const rssItems = files.map(file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const metadata = content.match(/---([\s\S]*?)---/);

        if (!metadata) return '';

        const frontmatter = metadata[1];
        const metadataObj = Object.fromEntries(
            frontmatter.split('\n').filter(line => line).map(line => {
                const [key, ...value] = line.split(':');
                return [key.trim(), value.join(':').trim()];
            })
        );

        return `  <item>
    <title>${metadataObj.title}</title>
    <link>${siteUrl}/post.html?slug=${metadataObj.slug}</link>
    <description>${metadataObj.title}</description>
    <pubDate>${new Date(metadataObj.date).toUTCString()}</pubDate>
  </item>`;
    }).join('\n');

    const rssContent = `${rssHeader}${rssItems}${rssFooter}`;

    fs.writeFileSync(outputFile, rssContent, 'utf-8');
    console.log('RSS feed generated at:', outputFile);
});