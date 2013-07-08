module.exports = function(app, models, mongoose){

  var request = require('request');
  var cheerio = require("cheerio");

  app.get('/', function(req, res){
    res.render('kickpedal.jade');
  });
  
  app.get('/kickjson', function(req, res){
	var findPlaces = function(places, $, pagenum){
	    return res.json( $('p.location').length );
		
		if($('.NS_backers__backing_row').length >= 50 && !req.query["page"]){
			jsdom.env(
				'http://www.kickstarter.com/projects/' + req.query["project"] + '/backers?page=' + (pagenum+1),
				[ 'http://code.jquery.com/jquery-1.9.1.min.js' ],
				function(err, window){
				  if(err){ throw err; }
				  findPlaces(places, window.$, pagenum+1);
				}
		    );
		}
		else{
			res.json({ cities: places, count: $('.NS_backers__backing_row').length });
		}
	};
	
    var requestOptions = {
      'uri': 'http://www.kickstarter.com/projects/' + req.query["project"] + '/backers?cursor=' + ( req.query["page"] || "1" )
    };
    request(requestOptions, function (err, response, b) {
      if(err){
        return res.json( err );
      }
      $ = cheerio.load( b );
      var places = { };
      $('p.location').each(function(located){
		var myPlace = $(this).text().replace('\n','').replace('\n','').replace('\n','');
		if(places[myplace]){
		  places[myplace]++;
		}
		else{
		  places[myPlace] = 1;
		}
	  });
	  res.json( places );
    });
  });
  
};