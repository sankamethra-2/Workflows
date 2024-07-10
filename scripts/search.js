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
      return extract.split('\n')[0]; // Return only the first paragraph
    } else {
      return "No information found for this topic.";
    }
  } catch (error) {
    console.error('Error searching:', error);
    return "An error occurred while fetching information.";
  }
}

const topic = process.argv[2];
searchWikipedia(topic)
  .then(result => {
    console.log("info<<EOF");
    console.log(result);
    console.log("EOF");
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });