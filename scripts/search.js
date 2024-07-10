const fetch = require('node-fetch');

async function searchWikipedia(query) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedQuery}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.extract) {
      return data.extract;
    } else if (data.description) {
      return data.description;
    } else {
      console.error('API response:', JSON.stringify(data, null, 2));
      return "No detailed information found for this topic.";
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