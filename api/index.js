const express = require("express");
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

app.get("/scrape", (req, res) => {
    axios.get(req.query.url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        // Your scraping logic here
        // Example: Get the title of the page
        const pageTitle = $('.h1-style .text-dark-blue').text();
        // console.log('Page Title:', pageTitle);
        res.json({ pageHeading: pageTitle });
    })
    .catch(error => {
        console.log('Error fetching the page:', error);
    });
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;