import axios from 'axios';
import cheerio from 'cheerio';
import { getPodcastChannels } from '../services/podcastService';

const rssUrls = [
  //'https://feed.firstory.me/rss/user/ckudnw7fn4tqg0870axzgirva',
  // Add RSS URLs here
];

const getYouTubeVideoDetails = async (videoId) => {
  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);
    const title = $('meta[name="title"]').attr('content') || $('title').text();
    const channelTitle = $('meta[itemprop="author"]').attr('content') || $('a[href*="/channel/"]').text();
    
    return {
      title: title.trim(),
      channelTitle: channelTitle.trim(),
    };
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    return null;
  }
};

const getYouTubeVideoIds = () => {
  return [
    '8vobf7pjLlA',
    '-YCnXCLQwls',
    'widpO5Quqhk',
    'Gb4Es-8DqMM',
    'wlSvIL-H1GQ',
    //'8MG--WuNW1Y',
    // Add more YouTube video IDs here
  ];
};

export const fetchContent = async () => {
  const fetchedChannels = await getPodcastChannels(rssUrls);
  const podcasts = fetchedChannels.flatMap(channel => 
    channel.episodes.map(episode => ({
      ...episode,
      type: 'podcast',
      channelTitle: channel.title,
      channelImageUrl: channel.imageUrl,
    }))
  );

  const youtubeVideoIds = getYouTubeVideoIds();
  const youtubeVideos = await Promise.all(youtubeVideoIds.map(async (id, index) => {
    const details = await getYouTubeVideoDetails(id);
    return {
      id: `youtube-${index}`,
      title: details ? details.title : `YouTube Audio ${index + 1}`,
      videoId: id,
      type: 'youtube',
      channelTitle: details ? details.channelTitle : 'YouTube Channel',
      channelImageUrl: `https://img.youtube.com/vi/${id}/0.jpg`,
    };
  }));

  return [...podcasts, ...youtubeVideos].sort(() => Math.random() - 0.5);
};
