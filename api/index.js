const express = require("express");
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors') 


// enabling CORS for any unknown origin(https://xyz.example.com) 
app.use(cors());
var pageHostURL;
app.get("/scrape", (req, res) => {

    axios.get(req.query.url).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
                
        pageHostURL = new URL(req.query.url),
        pageHostURL = pageHostURL.protocol+'//'+pageHostURL.hostname,
        isMultipleImageSrc = true;   

        const isPictureMode = $('#pageHeading h1').closest('.fmcna-freseniuscontainer').find('picture').html(), pageHeadingImageURL = []  
        if(!isPictureMode){
            isMultipleImageSrc = false;
            pushToArray(pageHeadingImageURL, "img",curateImageURL($('#pageHeading h1').closest('.fmcna-freseniuscontainer').find('.cmp-image__image').attr('src')))
        }else{
            pushToArray(pageHeadingImageURL, "img",curateImageURL($('#pageHeading h1').closest('.fmcna-freseniuscontainer').find('picture img').attr('src')))
            pushToArray(pageHeadingImageURL, "media_768",curateImageURL($('#pageHeading h1').closest('.fmcna-freseniuscontainer').find('picture source[media="(max-width:768px"]').attr('srcset')))
            pushToArray(pageHeadingImageURL, "media_991",curateImageURL($('#pageHeading h1').closest('.fmcna-freseniuscontainer').find('picture source[media="(max-width:991px"]').attr('srcset')))
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

function curateImageURL(URL__){
    // var absoluteURL = ()
    // console.log(!(absoluteURL))

    // URL__ = "habc.com"
    console.log(URL__)

    if(!URL__.indexOf("https://") || !URL__.indexOf("http://")){
        console.log('absolute')
        return URL__
    }else{
        console.log('relative')
        return pageHostURL+URL__
    }
}


// function isPathAbsolute(path) {
//     var returnValue = new RegExp("^(?:/|.+://)").test(path)
//     console.log("returnValue: "+returnValue)
//     return returnValue
// }

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;