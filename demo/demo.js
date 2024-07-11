const ytsr = require('ytsr');

const testYtsr = async () => {
  const query = '兒童歌曲';
  try {
    console.log(`Searching YouTube for query: ${query}`);
    const searchResults = await ytsr(query, { limit: 10 });
    const items = searchResults.items;

    const urls = await Promise.all(items.map(async (itemPromise) => {
      const item = await itemPromise;
      if (item && item.url) {
        return item.url;
      }
      return null;
    }));

    // Filter out null values
    const validUrls = urls.filter(url => url !== null);
    
    // Extract video IDs from URLs
    const videoIds = validUrls.map(url => {
      const match = url.match(/watch\?v=([^&]+)/);
      return match ? match[1] : null;
    }).filter(id => id !== null);

    console.log('Extracted Video IDs:', videoIds);
  } catch (error) {
    console.error(`Error searching YouTube for query "${query}":`, error);
  }
};

testYtsr();
