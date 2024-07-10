const Parser = require('rss-parser');
const fs = require('fs').promises;
const parser = new Parser();

const RSS_FEEDS = [
  'https://feeds.feedburner.com/TechCrunch',
  'https://www.wired.com/feed/rss',
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
  'https://www.reddit.com/r/programming/.rss',
  'https://news.google.com/rss/search?q={TOPIC}&hl=en-US&gl=US&ceid=US:en'
];

async function fetchRSSFeed(feedUrl, topic) {
  try {
    const feed = await parser.parseURL(feedUrl.replace('{TOPIC}', encodeURIComponent(topic)));
    return feed.items
      .filter(item => 
        item.title.toLowerCase().includes(topic.toLowerCase()) || 
        (item.contentSnippet && item.contentSnippet.toLowerCase().includes(topic.toLowerCase()))
      )
      .map(item => ({
        title: item.title,
        link: item.link,
        pubDate: new Date(item.pubDate),
        description: item.contentSnippet
      }));
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error.message);
    return [];
  }
}

async function updateReadme(topic, articles) {
  const readmePath = './README.md';
  let content = await fs.readFile(readmePath, 'utf8');

  const newContent = `# Latest News and Articles on ${topic}\n\n` +
    articles.map(article => 
      `- [${article.title}](${article.link})\n  ${article.description ? article.description.slice(0, 150) + '...' : ''}`
    ).join('\n\n');

  const regex = new RegExp(`# Latest News and Articles on ${topic}[\\s\\S]*?(?=\\n#|$)`, 'i');
  if (content.match(regex)) {
    content = content.replace(regex, newContent);
  } else {
    content += '\n\n' + newContent;
  }

  await fs.writeFile(readmePath, content);
  console.log('README.md has been updated.');
}

async function main() {
  const topic = process.argv[2];
  if (!topic) {
    console.error('Please provide a topic');
    process.exit(1);
  }

  let allArticles = [];

  for (const feed of RSS_FEEDS) {
    const articles = await fetchRSSFeed(feed, topic);
    allArticles = allArticles.concat(articles);
  }

  // Sort by publication date (most recent first) and limit to top 5
  const sortedArticles = allArticles
    .sort((a, b) => b.pubDate - a.pubDate)
    .slice(0, 5);

  console.log(`Top 5 recent articles about "${topic}":\n`);
  sortedArticles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
    console.log(`   ${article.link}`);
    console.log(`   Published: ${article.pubDate.toISOString()}`);
    if (article.description) {
      console.log(`   Description: ${article.description.slice(0, 150)}...`);
    }
    console.log();
  });

  await updateReadme(topic, sortedArticles);
}

main().catch(console.error);