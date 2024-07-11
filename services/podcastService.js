import { XMLParser } from 'fast-xml-parser';

export const getPodcastChannels = async (rssUrls) => {
  const channels = [];
  for (const rssUrl of rssUrls) {
    try {
      const response = await fetch(rssUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
     
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        textNodeName: "#text"
      });
      const result = parser.parse(text);
     
      if (!result.rss || !result.rss.channel) {
        throw new Error('Invalid RSS feed format');
      }
     
      const channel = result.rss.channel;
     
      channels.push({
        id: rssUrl,
        title: channel.title || 'Unknown Channel',
        description: channel.description || 'No description available.',
        imageUrl: channel['itunes:image'] ? (channel['itunes:image']['@_href'] || channel['itunes:image']) : 'https://example.com/default-image.jpg',
        episodes: Array.isArray(channel.item) ? channel.item.map(item => ({
          id: item.guid ? (item.guid['#text'] || item.guid) : '',
          title: item.title,
          author: item['itunes:author'] || 'Unknown Author',
          imageUrl: item['itunes:image'] ? (item['itunes:image']['@_href'] || item['itunes:image']) : 'https://example.com/default-image.jpg',
          audioUrl: item.enclosure ? (item.enclosure['@_url'] || '') : '',
          description: item.description || 'No description available.'
        })) : []
      });
    } catch (error) {
      console.error(`Error fetching podcast channel ${rssUrl}:`, error.message);
    }
  }
   
  return channels;
};

export const searchPodcasts = async (query, rssUrls) => {
  const results = [];
  for (const rssUrl of rssUrls) {
    try {
      const response = await fetch(rssUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
     
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        textNodeName: "#text"
      });
      const result = parser.parse(text);

      if (!result.rss || !result.rss.channel || !result.rss.channel.item) {
        throw new Error('Invalid RSS feed format');
      }
     
      const channel = result.rss.channel;
      const items = Array.isArray(channel.item) ? channel.item : [channel.item];

      items.forEach(item => {
        const itemTitle = item.title?.toLowerCase() || '';
        const itemDescription = item.description?.toLowerCase() || '';
        if (itemTitle.includes(query.toLowerCase()) || itemDescription.includes(query.toLowerCase())) {
          results.push({
            id: item.guid ? (item.guid['#text'] || item.guid) : item.title,
            title: item.title,
            author: item['itunes:author'] || channel['itunes:author'] || 'Unknown Author',
            imageUrl: item['itunes:image'] ? (item['itunes:image']['@_href'] || item['itunes:image']) : 
                      (channel['itunes:image'] ? (channel['itunes:image']['@_href'] || channel['itunes:image']) : 
                      'https://example.com/default-image.jpg'),
            pubDate: item.pubDate,
            audioUrl: item.enclosure ? (item.enclosure['@_url'] || '') : '',
            description: item.description || 'No description available.',
          });
        }
      });
    } catch (error) {
      console.error(`Error searching podcast in ${rssUrl}:`, error.message);
    }
  }
  return results;
};