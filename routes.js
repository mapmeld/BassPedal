module.exports = function(app, models, mongoose){

  var jsdom = require("jsdom");

  app.get('/', function(req, res){
    res.render('kickpedal.jade');
  });
  
  app.get('/kickjson', function(req, res){
	var findPlaces = function(places, $, pagenum){
		$('.location').each(function(located){
			var myPlace = $(this).text().replace('\n','').replace('\n','').replace('\n','');
			var foundPlace = false;
			for(var p=0;p<places.length;p++){
				if(places[p].name == myPlace){
					places[p].count++;
					foundPlace = true;
					break;
				}
			}
			if(!foundPlace){
				places.push({"name": myPlace, "count": 1});
			}
		});
		if($('.NS_backers__backing_row').length >= 50 && !req.query["page"]){
			scraper({
				uri: 'http://www.kickstarter.com/projects/' + req.query["project"] + '/backers?page=' + (pagenum+1),
				headers: {
					'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
				}
			}, function(err, $){
				if(err){ throw err; }
				findPlaces(places, $, pagenum+1);
			});
		}
		else{
			res.json({ cities: places, count: $('.NS_backers__backing_row').length });
		}
	};
	
	jsdom.env({
		uri: 'http://www.kickstarter.com/projects/' + req.query["project"] + '/backers?page=' + ( req.query["page"] || "1" ),
		headers: {
			'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
		}
	}, function(err, window){
		if(err){ throw err; }
		var places = [ ];
		findPlaces(places, window.$, 2);
	});
  });
  
};