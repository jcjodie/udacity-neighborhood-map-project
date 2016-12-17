var locations = [
  {
  title: 'Westfield Hawthorn Mall',
  location: {lat : 42.2430635, lng: -87.9499412}
  },
  {
  title: 'Vernon Hills High School',
  location: {lat: 42.2282382, lng : -87.9477957}
  },
  {
  title: 'Century Park',
  location: {lat: 42.2467455, lng : -87.96193249999999}
  },
  {
  title: 'Family Aquatic Center',
  location: {lat: 42.232613, lng : -87.97110149999999}
  },
  {
  title: 'Portillos Restaurant',
  location: {lat:  42.2399431, lng : -87.9591927}
  }
  ];

var Location = function(data){
  this.title = data.title;
  this.marker = data.marker;
  // add a marker property to pass the marker property through to observable array
  }

// from Cat Clicker knockout lesson
var ViewModel = function(){
  var self=this;

  this.locationList = ko.observableArray([]);

  locations.forEach(function(locationItem){
    self.locationList.push(new Location(locationItem));
    });

  this.currentLocation = ko.observable(this.locationList()[0]);
 
  this.selectLocation = function(location){
    console.log(marker);
    populateInfoWindow(location.marker, infowindow);
    toggleBounce(location.marker);
  };

  self.submittedLocation = ko.observable("");
  this.submittedLocationList = ko.computed(function(){
    var submittedLocations = [];
    if (!submittedLocations){
     self.locationList()
    }else {
      return submittedLocations; 
    }

    })
   console.log(this.submittedLocationList)
  
  //clear submittedLocationList when text is entered
};
// applies bindings to ViewModel

// from Google Maps APIs lessons
var map;
var marker;     
var markers = [];
var infowindow;
function initMap() {
  // creates map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.2351077, lng:-87.9981169},
    zoom: 13,
    mapTypeControl: false
  });
  
  
  infowindow = new google.maps.InfoWindow();
  // create an array of markers on initialize
  for (var i = 0; i < locations.length; i++) {
    // get the position from the location array
    var position = locations[i].location;
    var title = locations[i].title;
    // create a marker at each location and put into markers array
    marker = new google.maps.Marker({
    position: position,
    title: title,
    animation: google.maps.Animation.DROP,
    id: i
    });

  locations[i].marker=marker;
  // push the marker to array of markers
  markers.push(marker);
 

  // animate marker
  marker.addListener('click', function(){
    toggleBounce(this);
    console.log(this);
  });
    
  // on click open an infowindow at marker
  marker.addListener('click', function() {
    populateInfoWindow(this, infowindow);
  });

  }
  ko.applyBindings(new ViewModel());
  showLocations()
}
// animate marker - from Google Maps APIs documentation 
function toggleBounce(marker) {
  console.log(marker);

  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function(){
  marker.setAnimation(google.maps.Animation.null); }, 750);
  }



//  opens infowindow when the marker is clicked- from Google Maps APIs lessons
populateInfoWindow= function(marker, infowindow) {
  // check to make sure the infowindow is not already opened on this marker
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // make sure the marker property is cleared if the infowindow is closed
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });

    // open the info window on the correct marker
    infowindow.open(map, marker);
  }
      
}
// loop through the markers array and display them
function showLocations() {
  var bounds = new google.maps.LatLngBounds();
  // extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

 
//knockout observables: list, filter
//drop down menu or text input to filter list and markers that load


// third party APIs in info windows

//APIs should load asynch

//need error messages when API requests fail, or it shouldn't affect the UI
//if using jquery and ajax() can use .fail()method for example
//also see article in project details about block websites with hosts file

//indicate in README what API you used
//and in your interface

//mobile responsive
