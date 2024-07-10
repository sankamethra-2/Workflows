const fs = require('fs');

function updateReadmeWithTopic(topic, information) {
  const readmePath = './README.md';
  try {
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Check if there's already a section for this topic
    const topicRegex = new RegExp(`## ${topic}[\\s\\S]*?(?=##|$)`, 'i');
    const existingSection = readmeContent.match(topicRegex);

    if (existingSection) {
      // Replace existing section
      readmeContent = readmeContent.replace(topicRegex, `## ${topic}\n\n${information}\n\n`);
    } else {
      // Add new section
      readmeContent += `\n\n## ${topic}\n\n${information}\n`;
    }

    fs.writeFileSync(readmePath, readmeContent);
    console.log('README.md updated successfully.');
  } catch (err) {
    console.error('Error updating README.md:', err);
    process.exit(1);
  }
}

// Fetch topic and information from command line arguments
const topic = process.argv[2];
const information = process.argv[3];

if (!topic || !information) {
  console.error('Topic or information not provided.');
  process.exit(1);
}

// Call function to update README with the topic information
updateReadmeWithTopic(topic, information);