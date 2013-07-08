var places = { };
var pagenum = 1;
var loadover = false;
var markergroup;
function gup(nm){nm=nm.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var rxS="[\\?&]"+nm+"=([^&#]*)";var rx=new RegExp(rxS);var rs=rx.exec(window.location.href);if(!rs){return null;}else{return rs[1];}}
function kicks(){
	pagenum = 1;
	places = [ ];
	loadNextPage();
}
function loadNextPage(){
    loadover = false;
	var url = "/kickjson?project=" + $("#starter").val().split("/")[4] + "/" + $("#starter").val().split("/")[5].split("?")[0].split("&")[0] + "&page=" + pagenum;
	$.getJSON(url, function(d){
		pagenum = d.cursor || "";
		for(place in d.cities){
		    if(typeof places[place] != "undefined"){
		      places[place].count += d.cities[place];
			  if(places[place].marker){
			    places[place].marker.bindPopup("<h4>" + place + "</h4>" + places[place].count + " and counting...");
			  }
			  else{
				if(place.split(", ")[1] && place.split(", ")[1].length == 2){ // must be CITY, STATE inside the US
				  var s = document.createElement("script");
				  s.type = "text/javascript";
				  s.src = "http://www.mapquestapi.com/geocoding/v1/address?key=Fmjtd|luua2l07nq,22=o5-hyy0g&location=" + encodeURIComponent(place) + "&callback=loadPlace";
				  document.body.appendChild(s);
				}
			  }
			}
			else{
				places[place] = { count: d.cities[place] };
			}
		}
		if(d.count >= 50){
			loadNextPage();
		}
		else{
		    loadover = true;
			markergroup.clearLayers();
			for(var place in places){
				// add markers
				if(places[place].latlng){
				    for(var e=0;e<places[place].count;e++){
				      var marker = new L.Marker(new L.LatLng(places[place].latlng[0], places[place].latlng[1] ));
					  markergroup.addLayer(marker);
					  marker.bindPopup("<h4>" + place + "</h4>" + places[place].count);
					}
				}
				else if(place.split(", ")[1] && place.split(", ")[1].length == 2){ // must be CITY, STATE inside the US
					var s = document.createElement("script");
					s.type = "text/javascript";
					s.src = "http://www.mapquestapi.com/geocoding/v1/address?key=Fmjtd|luua2l07nq,22=o5-hyy0g&location=" + encodeURIComponent(place) + "&callback=loadPlace";
					document.body.appendChild(s);
				}
			}
		}
	});
}
var miniIcon;
function loadPlace(geocoded){
	for(place in places){
		if(place == geocoded.results[0].providedLocation.location){
			places[place].latlng = [ geocoded.results[0].locations[0].latLng.lat, geocoded.results[0].locations[0].latLng.lng ];
		
			var marker = new L.Marker(new L.LatLng(places[place].latlng[0], places[place].latlng[1]) );
			markergroup.addLayer(marker);
			marker.bindPopup("<h4>" + place + "</h4>" + places[place].count);
			
			if(loadover){
			  for(var e=1;e<places[place].count;e++){
			    var marker = new L.Marker(new L.LatLng(places[place].latlng[0], places[place].latlng[1]) );
			    markergroup.addLayer(marker);
  			    marker.bindPopup("<h4>" + place + "</h4>" + places[place].count);
			  }
			}

			places[place].marker = marker;
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

	// set the map view to a given center and zoom and add the background layer
	map.setView(new L.LatLng(36.922101,-94.182927), 4).addLayer(cloudmade);
	
	// add the marker cluster maker
	markergroup = L.markerClusterGroup();
	map.addLayer(markergroup);
	
	if(gup("project")){
	  $("#starter").val( unescape( gup("project") ) );
	  loadNextPage();
	}

}
$(document).ready(initMap);