const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

// const url = 'https://fmcna.com/insights/articles/5-diamond-status-kathleen-belmonte/'; // Replace this with the URL you want to scrape
const port = process.env.PORT || 3000;

// Sample API endpoint
app.get('/scrape', (req, res) => {
    axios.get(req.query.url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        // Your scraping logic here
        // Example: Get the title of the page
        const pageTitle = $('.h1-style .text-dark-blue').text();
        console.log('Page Title:', pageTitle);
        res.json({ pageHeading: pageTitle });
    })
    .catch(error => {
        console.log('Error fetching the page:', error);
    });
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});