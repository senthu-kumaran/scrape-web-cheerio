const express = require("express");
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

app.get("/scrape", (req, res) => {

    var requestURL = req.query.url
    axios.get(req.query.url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        // Your scraping logic here
        // Example: Get the title of the page
        // const pageTitle = $('.h1-style .text-dark-blue').text();
        // let getHTML = $(".cmp-container .fmcna-freseniuscontainer").map((i, el)=>{
        //     return $(el).find('h1').text();
        // }).get(0);
        // console.log(getHTML);

        // const relateArticle = $('.cmp-container .fmcna-freseniuscontainer').map((i, section) => {
        //     let articles = $(section).find('h1');
        //     return articles.text().trim();
        // }).get(0)
        
        // console.log(relateArticle) 

        
        var pageHostURL = new URL(requestURL),
            pageHostURL = pageHostURL.protocol+'//'+pageHostURL.hostname

        const pageTitle = $('#pageHeading h1').text().trim();
        const pageHeadingImageURL = $('#pageHeading h1').closest('.fmcna-freseniuscontainer').find('.fmcna-image img').attr('src')
        const pageContent = $('.cmp-articlecomponent__content').html().trim().replace(/\n/g, '')
        const socialShareURLs = $('.cmp-socialshare__list li').map((i, el)=>{
            console.log(i)
            var returnString = i == 1 ? requestURL : $(el).find('a').attr('href')
            return returnString;
        }).toArray();

        // $("#block-zircon-content tbody tr td").map((i, el)=>{
        //     return el;
        // }).toArray();

    
        // console.log($('.cmp-container .fmcna-freseniuscontainer').html().toString())

        res.json({ pageURL: req.query.url,pageHeading: pageTitle , pageHeadingImageURL: pageHostURL+pageHeadingImageURL,socialShareURL: socialShareURLs, pageContent: pageContent});
    })
    .catch(error => {
        console.log('Error fetching the page:', error);
    });
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;