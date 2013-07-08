module.exports = function(app, models, mongoose){

  var request = require('request');
  var cheerio = require("cheerio");

  app.get('/', function(req, res){
    res.render('kickpedal.jade');
  });
  
  app.get('/kickjson', function(req, res){
	
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
		if(places[myPlace]){
		  places[myPlace]++;
		}
		else{
		  places[myPlace] = 1;
		}
	  });
	  var cursor = "";
	  if($('.NS_backers__backing_row').length){
	    cursor = $($('.NS_backers__backing_row')[ $('.NS_backers__backing_row').length - 1 ]).attr("data-cursor");
	  }
	  res.json( { cities: places, count: $('.NS_backers__backing_row').length, cursor: cursor } );
    });
  });
  
};