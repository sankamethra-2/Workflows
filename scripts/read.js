const fs = require('fs');
const fetch = require('node-fetch');

async function searchWikipedia(query) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodedQuery}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const extract = pages[pageId].extract;

    if (extract) {
      // Limit the extract to around 150 words
      const words = extract.split(' ').slice(0, 150);
      return words.join(' ') + (words.length === 150 ? '...' : '');
    } else {
      return `No information found for "${query}" on Wikipedia.`;
    }
  } catch (error) {
    console.error('Error searching Wikipedia:', error);
    return `Error occurred while searching for "${query}".`;
  }
}

async function updateReadmeWithTopic(topic) {
  const information = await searchWikipedia(topic);

  const readmePath = './README.md';
  try {
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Check if there's already a section for this topic
    const topicRegex = new RegExp(`## ${topic}[\\s\\S]*?(?=##|$)`, 'i');
    const existingSection = readmeContent.match(topicRegex);

    if (existingSection) {
      // Replace existing section
      readmeContent = readmeContent.replace(topicRegex, `## ${topic}\n\n${information}\n\nSource: Wikipedia\n\n`);
    } else {
      // Add new section
      readmeContent += `\n\n## ${topic}\n\n${information}\n\nSource: Wikipedia\n`;
    }

    fs.writeFileSync(readmePath, readmeContent);
    console.log('README.md updated successfully.');
  } catch (err) {
    console.error('Error updating README.md:', err);
    process.exit(1);
  }
}

// Fetch topic from command line argument
const topic = process.argv[2];
if (!topic) {
  console.error('Topic not provided.');
  process.exit(1);
}

// Call function to update README with the topic information
updateReadmeWithTopic(topic);