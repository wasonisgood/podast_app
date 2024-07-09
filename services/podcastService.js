import { XMLParser } from 'fast-xml-parser';

export const getPodcastEpisodes = async () => {
  const rssUrl = 'https://feed.firstory.me/rss/user/ckudnw7fn4tqg0870axzgirva';
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  
  try {
    const response = await fetch(proxyUrl + rssUrl, {
      headers: {
        'Origin': 'http://localhost'
      }
    });
    const text = await response.text();
    console.log('API Response (first 500 characters):', text.substring(0, 500));

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      textNodeName: "#text"
    });
    const result = parser.parse(text);
    console.log('Parsed Result (first item):', JSON.stringify(result.rss.channel.item[0], null, 2));

    if (!result.rss || !result.rss.channel || !result.rss.channel.item) {
      throw new Error('Invalid RSS feed format');
    }

    const items = Array.isArray(result.rss.channel.item) ? result.rss.channel.item : [result.rss.channel.item];
    
    const episodes = items.map(item => {
      let audioUrl = '';
      if (item.enclosure) {
        if (typeof item.enclosure === 'object' && item.enclosure['@_url']) {
          audioUrl = item.enclosure['@_url'];
        } else if (Array.isArray(item.enclosure)) {
          const audioEnclosure = item.enclosure.find(enc => enc['@_type'] && enc['@_type'].startsWith('audio/'));
          if (audioEnclosure) {
            audioUrl = audioEnclosure['@_url'];
          }
        }
      }

      const imageUrl = item['itunes:image'] ? (item['itunes:image']['@_href'] || item['itunes:image']) : '';
      
      console.log('Processing item:');
      console.log('Title:', item.title);
      console.log('Audio URL:', audioUrl);
      console.log('Image URL:', imageUrl);
      
      if (!audioUrl) {
        console.log('No audio URL found for this item');
        return null;
      }

      return {
        id: item.guid ? (item.guid['#text'] || item.guid) : '',
        title: item.title,
        author: item['itunes:author'] || 'Unknown Author',
        image: imageUrl ? { uri: imageUrl } : require('../assets/podcast1.webp'),
        audioUrl: audioUrl,
      };
    }).filter(episode => episode !== null);

    console.log(`Total episodes with audio URL: ${episodes.length}`);
    console.log('First episode:', episodes[0]);

    return episodes;
  } catch (error) {
    console.error("Error fetching podcast episodes: ", error);
    return [];
  }
};