var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/', function(req, res){

	function Scrape(url, articles) {
		this.url      = url;
		this.getPosts = request(url, function(error, response, html) {
				if(!error) {
					var $ = cheerio.load(html);

					$('article').each(function(index) {
						var self = $(this);
						var article = {
							header : self.find('h2.post-title').text(),
							route: url + self.find('h2.post-title a').attr('href'),
							content : null,
							author: self.find('footer a').text(),
							timestamp : self.find('time.post-date').text()
						};

						articles[index] = article;
					});

					fs.writeFile('posts.json', JSON.stringify(articles, null, 4), function(err){
						//console.log('Posts created.');
					});
				}
		});

		this.routes = fs.readFile('posts.json', function(error, data) {
				if(!error) {
					var postData = data.toString();
					JSON.parse(postData, function(key, value) {
						if(key == 'route') {
							console.log(value);
						}
					});

				} else {
					throw error;
				}
		});
		this.postContent = request(url, function(error, response, html) {
			if(!error) {
				var $ = cheerio.load(html);

				fs.writeFile('posts.json', JSON.stringify(articles, null, 4), function(err){
					//console.log('Posts created.');
				});
			}
		});
	};

	var myPosts = new Scrape('https://tim.ghost.io', []);

	//myPosts.getPosts;
	myPosts.routes;



});


app.listen('8000');
console.log('Watching for changes.');
exports = module.exports = app;
