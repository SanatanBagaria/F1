const axios = require('axios');
const cacheService = require('./cacheService');
const logger = require('../utils/logger');

const BBC_F1_RSS_URL = 'https://feeds.bbci.co.uk/sport/formula1/rss.xml';

const parseRSS = (xmlText) => {
  const items = [];
  // Split by item tags
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g);
  if (!itemMatches) return items;
  
  itemMatches.forEach((itemXml, index) => {
    const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || itemXml.match(/<title>([\s\S]*?)<\/title>/);
    const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || itemXml.match(/<description>([\s\S]*?)<\/description>/);
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    
    // Extract thumbnail/enclosure images if present
    const mediaThumbnail = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/);
    const mediaContent = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/);
    const enclosure = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/);
    
    let imageUrl = null;
    if (mediaThumbnail) imageUrl = mediaThumbnail[1];
    else if (mediaContent) imageUrl = mediaContent[1];
    else if (enclosure) imageUrl = enclosure[1];

    // Array of curated background images if feed has no images
    const fallbackImages = [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600', // Red F1 Car
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600', // Race Track
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600', // Helmet
      'https://images.unsplash.com/photo-1562591176-808f40359643?auto=format&fit=crop&q=80&w=600', // Steering Wheel
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=600'  // Pits
    ];

    items.push({
      id: index + 1,
      title: titleMatch ? titleMatch[1].trim().replace(/&amp;/g, '&') : 'Unknown Title',
      excerpt: descMatch ? descMatch[1].trim().replace(/&amp;/g, '&').replace(/<[^>]*>/g, '') : '',
      link: linkMatch ? linkMatch[1].trim() : '#',
      date: pubDateMatch ? new Date(pubDateMatch[1]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      image: imageUrl || fallbackImages[index % fallbackImages.length],
      category: index === 0 ? 'breaking' : (index % 3 === 0 ? 'technical' : (index % 2 === 0 ? 'team' : 'driver')),
      author: 'BBC Sport F1',
      featured: index === 0
    });
  });
  
  return items;
};

const newsService = {
  getLatestNews: async () => {
    const cacheKey = 'rss:f1_news';
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      logger.info('Fetching latest F1 news from RSS feed...');
      const response = await axios.get(BBC_F1_RSS_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        timeout: 5000
      });

      const parsedNews = parseRSS(response.data);
      cacheService.set(cacheKey, parsedNews, 60 * 60 * 1000); // Cache for 1 hour
      return parsedNews;
    } catch (error) {
      logger.error('Failed to fetch F1 news from RSS feed, using fallback mock data:', { error: error.message });
      // Fallback data in case the network fails or RSS block occurs
      const fallbacks = [
        {
          id: 1,
          title: "Hamilton Settles in at Scuderia Ferrari for New Season Campaign",
          excerpt: "Lewis Hamilton speaks on his initial track testing with Ferrari and his aspirations to bring the Scuderia back to championship-winning ways.",
          link: "https://www.formula1.com",
          date: new Date().toISOString().split('T')[0],
          image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600",
          category: "breaking",
          author: "F1 Insider",
          featured: true
        },
        {
          id: 2,
          title: "McLaren Focuses on Aero Efficiency to Defend Championship Title",
          excerpt: "McLaren engineers outline their wind tunnel discoveries ahead of European session launches, pushing design boundaries on front-wing flexibility.",
          link: "https://www.formula1.com",
          date: new Date().toISOString().split('T')[0],
          image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600",
          category: "technical",
          author: "Tech Analyst",
          featured: false
        }
      ];
      return fallbacks;
    }
  }
};

module.exports = newsService;
