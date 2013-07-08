module.exports = function(app, models, mongoose){

  var jsdom = require("jsdom");

  app.get('/', function(req, res){
    res.render('kickpedal.jade');
  });
  
  app.get('/kickjson', function(req, res){
	var findPlaces = function(places, $, pagenum){
	    var first = true;
		$('.location').each(function(located){
		    if(first){
		      first = false;
		      return;
		    }
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
			jsdom.env(
				'http://www.kickstarter.com/projects/' + req.query["project"] + '/backers?page=' + (pagenum+1),
				[ ],
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
	
	jsdom.env(
	  'http://www.kickstarter.com/projects/' + req.query["project"] + '/backers?page=' + ( req.query["page"] || "1" ),
	  [ ],
	  function(err, window){
		if(err){ return res.json(err); }
		var places = [ ];
		findPlaces(places, window.$, 2);
	  }
	);
  });
  
};