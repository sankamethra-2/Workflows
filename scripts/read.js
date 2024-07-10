const fs = require('fs');

async function updateReadmeWithTopic(topic) {
  // Simulate fetching data related to the topic from Google
  const dataFromGoogle = `Information related to ${topic} fetched from Google.`;

  // Update README.md with the fetched information
  const readmePath = './README.md';  // Adjust path as needed
  try {
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    readmeContent += `\n\n${dataFromGoogle}\n`;
    fs.writeFileSync(readmePath, readmeContent);
    console.log('README.md updated successfully.');
  } catch (err) {
    console.error('Error updating README.md:', err);
    process.exit(1);  // Exit with non-zero code on error
  }
}

// Fetch topic from command line argument
const topic = process.argv[2];
if (!topic) {
  console.error('Topic not provided.');
  process.exit(1);  // Exit with non-zero code if topic is missing
}

// Call function to update README with the topic information
updateReadmeWithTopic(topic);
