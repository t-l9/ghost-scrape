var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/', function(req, res){

	var url = 'http://tim.ghost.io';
	var articles = [];

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var post;


			$('article').each(function(index) {
				var self = $(this);

				var article = {
					header : self.find('h2.post-title').text(),
					route: url + self.find('h2.post-title a').attr('href'),
					content : '',
					author: self.find('footer a').text(),
					timestamp : self.find('time.post-date').text()
				};

				// function callback(content) {
				// 	console.log(content);
				// }

				// request(article.route, function(error, response, html) {
				// 	$ = cheerio.load(html);
				// 	post = $('section.post-content').text();
				// });

				// function getPosts(error, response, html) {
					// $ = cheerio.load(html);
					// post = $('section.post-content').text();
				// 	console.log(html);
				// 	return post;
				// };

				// request(article.route, getPosts());

				var options = {
					url: article.route
				};

				function getPost(error, response, body) {
					if (!error && response.statusCode == 200) {
						$ = cheerio.load(body);
						post = $('section.post-content').text();
						article.content = post;
					}
				}

				request(options, getPost);



				console.log(post);

				articles.push(article);

			});

			fs.writeFile('posts.json', JSON.stringify(articles, null, 4), function(err){
	    		//console.log('Posts created.');
	    	});

		}
	});

});


app.listen('8000');
console.log('Watching for changes.');
exports = module.exports = app;
