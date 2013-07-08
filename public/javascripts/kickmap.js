var places = [ ];
var pagenum = 1;
var templayers = [ ];
function gup(nm){nm=nm.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var rxS="[\\?&]"+nm+"=([^&#]*)";var rx=new RegExp(rxS);var rs=rx.exec(window.location.href);if(!rs){return null;}else{return rs[1];}}
function kicks(){
	pagenum = 1;
	places = [ ];
	loadNextPage();
}
function loadNextPage(){
	var url = "/kickjson?project=" + $("#starter").val().split("/")[4] + "/" + $("#starter").val().split("/")[5].split("?")[0].split("&")[0] + "&page=" + pagenum;
	$.getJSON(url, function(d){
		pagenum++;
		for(var city=0;city<d.cities.length;city++){
			var foundMatch = false;
			for(var known=0;known<places.length;known++){
				if(places[known].name == d.cities[city].name){
					places[known].count += d.cities[city].count;
					foundMatch = true;
					if(places[known].marker){
						places[known].marker.bindPopup("<h3>" + places[known].name + "</h3>" + places[known].count + " and counting...");
					}
					else{
						if(places[known].name.split(", ")[1] && places[known].name.split(", ")[1].length == 2){ // must be CITY, STATE inside the US
							if(places[known].count >= 3){ // only map if more than 3 people in a city
								var s = document.createElement("script");
								s.type = "text/javascript";
								s.src = "http://www.mapquestapi.com/geocoding/v1/address?key=Fmjtd|luua2l07nq,22=o5-hyy0g&location=" + d.cities[city].name.replace(" ","+").replace(" ","+") + "&callback=loadPlace";
								document.body.appendChild(s);
							}
						}
					}
					break;
				}
			}
			if(!foundMatch){
				places.push({ name: d.cities[city].name, count: d.cities[city].count });
			}
		}
		if(d.count >= 50){
			loadNextPage();
		}
		else{
			for(var t=0;t<templayers.length;t++){
				map.removeLayer(templayers[t]);
			}
			for(var place=0;place<places.length;place++){
				// add markers
				if(places[place].latlng){
					var marker = new L.Marker(new L.LatLng(places[place].latlng[0], places[place].latlng[1] ));
					map.addLayer(marker);
					marker.bindPopup("<h3>" + places[place].name + "</h3>" + places[place].count);
				}
				else if(places[place].name.split(", ")[1] && places[place].name.split(", ")[1].length == 2){ // must be CITY, STATE inside the US
					var s = document.createElement("script");
					s.type = "text/javascript";
					s.src = "http://www.mapquestapi.com/geocoding/v1/address?key=Fmjtd|luua2l07nq,22=o5-hyy0g&location=" + places[place].name.replace(" ","+").replace(" ","+") + "&callback=loadPlace";
					document.body.appendChild(s);
				}
			}
		}
	});
}
var miniIcon;
function loadPlace(geocoded){
	for(var place=0;place<places.length;place++){
		if(places[place].name == geocoded.results[0].providedLocation.location){
			places[place].latlng = [ geocoded.results[0].locations[0].latLng.lat, geocoded.results[0].locations[0].latLng.lng ];
			var marker;
			if(places[place].count < 3){
				marker = new L.Marker(new L.LatLng(places[place].latlng[0], places[place].latlng[1]), { icon: miniIcon });
			}
			else{
				marker = new L.Marker(new L.LatLng(places[place].latlng[0], places[place].latlng[1]) );			
			}
			map.addLayer(marker);
			marker.bindPopup("<h3>" + places[place].name + "</h3>" + places[place].count);
			places[place].marker = marker;
			templayers.push(marker);
			return;
		}
	}
}
function initMap(){
	//var cloudmadeUrl = 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg';
	var cloudmadeUrl = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
	cloudmadeAttribution = 'Map data &copy; 2013 OpenStreetMap contributors, Tiles &copy; Stamen Design',
	cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

	// initialize the map
	map = L.map('map');
	map.attributionControl.setPrefix('');

	// set the map view to a given center and zoom and add the CloudMade layer
	map.setView(new L.LatLng(36.922101,-94.182927), 4).addLayer(cloudmade);
	
	if(gup("project")){
	  $("#starter").val( unescape( gup("project") ) );
	  loadNextPage();
	}

}
$(document).ready(initMap);