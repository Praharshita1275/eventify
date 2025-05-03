const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// List of URLs to scrape
const pages = [
  { name: 'about', url: 'https://www.cbit.ac.in/about-cbit/' },
  { name: 'departments', url: 'https://www.cbit.ac.in/departments/' },
  { name: 'clubs', url: 'https://www.cbit.ac.in/clubs/' },
  // Add more as needed
];

async function scrapePage({ name, url }) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    // Get all visible text from the main content area
    const text = $('main').text().replace(/\s+/g, ' ').trim();
    return { name, url, text };
  } catch (e) {
    console.error(`Failed to scrape ${url}:`, e.message);
    return { name, url, text: '' };
  }
}

(async () => {
  const results = [];
  for (const page of pages) {
    console.log(`Scraping ${page.url}...`);
    results.push(await scrapePage(page));
  }
  fs.writeFileSync('src/data/cbitData.json', JSON.stringify(results, null, 2));
  console.log('Scraping complete! Data saved to src/data/cbitData.json');
})();