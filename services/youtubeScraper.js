const puppeteer = require('puppeteer');

const searchYouTubeMusic = async (queries) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set user agent and other headers to simulate a real user
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://music.youtube.com/',
  });

  const allVideoIds = [];

  for (const query of queries) {
    const url = `https://music.youtube.com/search?q=${encodeURIComponent(query)}`;
    try {
      console.log(`Fetching URL: ${url}`);
      
      await page.goto(url, {
        waitUntil: 'networkidle2',
      });

      const videoIds = await page.evaluate(() => {
        const videoElements = document.querySelectorAll('ytmusic-responsive-list-item-renderer a.yt-simple-endpoint');
        console.log(`Found ${videoElements.length} video elements`);
        const ids = [];
        videoElements.forEach((el) => {
          const href = el.getAttribute('href');
          if (href && href.includes('watch?v=')) {
            console.log(`Found href: ${href}`);
            const videoId = href.split('=')[1];
            ids.push(videoId);
          } else {
            console.log('Invalid href or no href found for element:', el);
          }
        });
        return ids;
      });

      // Filter out invalid IDs and remove duplicates
      const validVideoIds = videoIds.filter(id => id && !id.startsWith('PL') && id !== null);
      const uniqueVideoIds = [...new Set(validVideoIds)];

      console.log(`Found video IDs for query "${query}":`, uniqueVideoIds);
      allVideoIds.push(...uniqueVideoIds);
    } catch (error) {
      console.error(`Error fetching YouTube search results for query "${query}":`, error);
    }
  }

  await browser.close();

  const finalUniqueVideoIds = [...new Set(allVideoIds)];
  console.log('All unique video IDs:', finalUniqueVideoIds);

  return finalUniqueVideoIds;
};

module.exports = searchYouTubeMusic;
