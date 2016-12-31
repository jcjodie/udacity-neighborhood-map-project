var locations = [{
    title: 'Hawthorn Mall',
    location: {
        lat: 42.2430635,
        lng: -87.9499412
    }
}, {
    title: 'Vernon Hills High School',
    location: {
        lat: 42.2282382,
        lng: -87.9477957
    }
}, {
    title: 'Vernon Hills Station',
    location: {
        lat: 42.216341,
        lng: -87.963705
    }
}, {
    title: 'Cook Memorial Public Library District',
    location: {
        lat: 42.2390978,
        lng: -87.96908580000002
    }
}, {
    title: "Portillo's Restaurants",
    location: {
        lat: 42.2399431,
        lng: -87.9591927
    }
}];

// from Cat Clicker knockout lesson
var ViewModel = function() {
    var self = this;

    self.locationList = ko.observableArray(locations);

    this.currentLocation = ko.observable(this.locationList()[0]);

    this.selectLocation = function(location) {
        console.log(marker);
        populateInfoWindow(location.marker, infowindow);
        toggleBounce(location.marker);
    };

    //input box
    self.submittedLocation = ko.observable(''); //assigns text entered to submittedLocation
    //from Code Pen by John Mavroudis Udacity Coach
    self.submittedLocationList = ko.computed(function() {
        return ko.utils.arrayFilter(self.locationList(), function(location) {
            var showMarker = location.title.toLowerCase().indexOf(self.submittedLocation().toLowerCase());
            if (showMarker >= 0) {
                location.marker.setVisible(true);
            } else {
                location.marker.setVisible(false);
            }
            //check to see if searched for location is in locations list, indexOf returns -1 when the value was not in the array 
            return location.title.toLowerCase().indexOf(self.submittedLocation().toLowerCase()) >= 0;
        });
    });
};

// from Google Maps APIs lessons
var map;
var marker;
var markers = [];
var infowindow;

function initMap() {
    // creates map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 42.2351077,
            lng: -87.9981169
        },
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

        locations[i].marker = marker;
        // push the marker to array of markers
        markers.push(marker);


        // animate marker
        marker.addListener('click', function() {
            toggleBounce(this);
            console.log(this);
        });

        // on click open an infowindow at marker
        marker.addListener('click', function() {
            populateInfoWindow(this, infowindow);
        });

    }
    ko.applyBindings(new ViewModel());
    showLocations();
}

// animate marker - from Google Maps APIs documentation 
function toggleBounce(marker) {
    console.log(marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(google.maps.Animation.null);
    }, 700);
}

// opens infowindow when the marker is clicked- from Google Maps APIs lessons
populateInfoWindow = function(marker, infowindow) {
    // check to make sure the infowindow is not already opened on this marker
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        // make sure the marker property is cleared if the infowindow is closed
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }

    //from your moving company lesson
    var wikiElem;
    var urlLocationTitle = marker.title;
    console.log(urlLocationTitle);
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + urlLocationTitle + '&format=json&callback=wikiCallback';
    //wikipedia api
    var articleStr;

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        timeout: 5000,
        success: function(response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                console.log(articleStr);
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                wikiElem = '<a target="_blank" href="' + url + '">' + articleStr + '</a>';
                console.log(wikiElem);
                infowindow.setContent('<div>' + marker.title + '</div><a>' + wikiElem + '</a>');
                infowindow.open(map, marker);
            }
        },

        error: function() {
            console.log("error");
            alert("failed to get wikipedia resources"); //handle wikipedia error
        }

    });
};

// loop through the markers array and display them
function showLocations() {
    var bounds = new google.maps.LatLngBounds();
    // extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    google.maps.event.addDomListener(window, 'resize', function() {
    map.fitBounds(bounds);
  });
}
//handle google error
function googleSuccess() {
    if (typeof google !== 'undefined') {
        initMap();
    } else {
        googleError();
    }
}

function googleError() {
    alert('Google Maps error');
}