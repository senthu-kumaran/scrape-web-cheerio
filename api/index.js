const express = require("express");
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

// enabling CORS for any unknown origin(https://xyz.example.com) 
app.use(cors());

app.get("/scrape", (req, res) => {

    var requestURL = req.query.url
    axios.get(req.query.url).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
                
        var pageHostURL = new URL(requestURL),
            pageHostURL = pageHostURL.protocol+'//'+pageHostURL.hostname,
            isMultipleImageSrc = true;   

        const isPictureMode = $('#pageHeading h1').closest('.fmcna-freseniuscontainer').find('picture').html(), pageHeadingImageURL = []  
        if(!isPictureMode){
            isMultipleImageSrc = false;
            pushToArray(pageHeadingImageURL, "img",pageHostURL+$('#pageHeading h1').closest('.fmcna-freseniuscontainer').find('.cmp-image__image').attr('src'))
        }else{
            pushToArray(pageHeadingImageURL, "img",pageHostURL + $('#pageHeading h1').closest('.fmcna-freseniuscontainer').find('picture img').attr('src'))
            pushToArray(pageHeadingImageURL, "media_768",$('#pageHeading h1').closest('.fmcna-freseniuscontainer').find('picture source[media="(max-width:768px"]').attr('srcset'))
            pushToArray(pageHeadingImageURL, "media_991",$('#pageHeading h1').closest('.fmcna-freseniuscontainer').find('picture source[media="(max-width:991px"]').attr('srcset'))
        }

        const pageTitle = $('#pageHeading h1').text().trim(),
            pageContent = $('.cmp-articlecomponent__content').html().trim().replace(/\n/g, ''),
            socialShareURLs = []

        $('.cmp-socialshare__list li').map((i, el)=>{
            if($(el).find('a').attr('id') != 'Clipboard'){
                pushToArray(socialShareURLs, $(el).find('a').attr('id'),$(el).find('a').attr('href'))
            }
        })

        res.json({ 
            pageURL: req.query.url, 
            isMultipleImageSrc: isMultipleImageSrc, 
            pageHeading: pageTitle, 
            pageHeadingImageURL: pageHeadingImageURL, 
            socialShareURL: socialShareURLs, 
            pageContent: pageContent
        });

    })
    .catch(error => {
        console.log('Error fetching the page:', error);
    });
});


function pushToArray(array, name, val) {
    var obj = {};
    obj[name] = val;
    array.push(obj);
}

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;