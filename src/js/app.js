var map;
var currentInfoWindow = false;
var yelpResults;
var markers = {};
var currentMarker;
var filterInput = ko.observable('');

// For IE and Chrome compatability with String.js
// Credit to Rajesh @ http://stackoverflow.com/a/19196456
if (!('contains' in String.prototype)) {
    String.prototype.contains = function(str, startIndex) {
        'use strict';
        return -1 !== String.prototype.indexOf.call(this, str, startIndex);
    };
}

/**
 * @function nonce_generate()
 * Generates a random 12 digit number for one time use
 * @returns {String} 12 digit number as a String
 */
function nonce_generate() {
    //credit to hellbertos @ https://discussions.udacity.com/t/yelp-api-oauth-issue/40606/5?u=gixugif
    'use strict';
    return (Math.floor(Math.random() * 1e12).toString());
}

/*Yelp API search values*/
var baseURL = 'https://api.yelp.com/v2/search?';
var oauth_consumer_keyVal = 'o7io1ZSwVn_Gcxj4MqsgkQ';
var oauth_tokenVal = '3Rka9DQ66lV8bxGac4DSEcgt6Ze95TfM';
var oauth_signature_methodVal = 'HMAC-SHA1';
var oauth_signatureVal = 'oZstoMIkks8R3kXJGM5uFzDipas';
var oauth_timestamp = '&oauth_timestamp=';
var oauth_nonce = '&oauth_nonce=';


/*Google Maps*/

/**
 * @function initMap()
 * Creates a Google Map initially centered on Red Hook, NY
 * grabs restaurant location data from the Yelp Search API
 * for the area and initializes the filtering function when
 * someone types into the filter box.
 */
function initMap() {
    'use strict';

    if (typeof(google) === 'undefined') {
        alert('error: google failed to load')
    } else {
        var latLng = {
            lat: 41.994654,
            lng: -73.875959
        };
        var markerArray = [];

        map = new google.maps.Map(document.getElementById('map'), {
            center: latLng,
            zoom: 16
        });

        searchYelp('food', 'Red+Hook,NY+12571', 'restaurants,bars');

        filterBox.on('input', function() {
            filterInput = $(this).val();
            filterLocations(filterInput, yelpResults);
        }).trigger('input');
    }
}

/**
 * @function createMarkers()
 * Places markers on the Google Map using the
 * Google Map API. Also associates Info Windows
 * with each Map Marker that appear when the Marker
 * is clicked on, and dissapear when another is clicked
 * on or the Info Window close button is pressed.
 * @param {Object} locationData
 * @param {Object} map
 */
function createMarkers(locationData, map) {

    'use strict';
    var yelpLogo = './images/yelp-logo-xsmall.png'; // Yelp display req

    locationData.businesses.forEach(function(business) {

        var latLng = {
            lat: business.location.coordinate.latitude,
            lng: business.location.coordinate.longitude
        };
        var name = business.name;
        var phoneNum = business.display_phone;
        var description = business.snippet_text;
        var businessURL = business.url; // Yelp display req
        var ratingImg = business.rating_img_url_small; // Yelp display req
        var reviewCount = business.review_count; // Yelp display req
        var img = business.image_url;

        var contentString = '<div id="content">' +
            '<div id="placeImg"><img src="' + img + '"></img></div>' +
            '<div id="yelpLogo"><a href="http://www.yelp.com" target="_blank"><img src="' + yelpLogo + '"></img></a></div>' +
            '<h3 id="placeName">' + name + '</h3>' +
            '<img src="' + ratingImg + '"></img>' + '(' + reviewCount + ')' +
            '<p><a href="tel: +' + phoneNum + '">' + phoneNum + '</a></p>' +
            '<p>' + description + '<a href="' + businessURL + '" target="_blank">(read more...)</a></p>' + // read more is Yelp display req
            '</div>';



        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 350
        });

        markers[name] = new google.maps.Marker({
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP,
            title: name
        });

        markers[name].addListener('click', function() {
            if (currentInfoWindow) {
                currentInfoWindow.close();
                currentMarker.setAnimation(null);
            }

            currentInfoWindow = infowindow; // noting current opened infowindow so we know which to close if another opens
            currentMarker = markers[name];

            infowindow.open(map, markers[name]);
            markers[name].setAnimation(google.maps.Animation.BOUNCE);

            google.maps.event.addListener(infowindow, 'closeclick', function() {
                currentMarker.setAnimation(null);
            });
        });
    });
}

/*Yelp*/

/**
 * @function searchYelp()
 * Makes an asynchronous call to the Yelp Search API,
 * calls createMarkers() with the results and stores the
 * results in a global variable.
 * @param {String} termVal - Search term (e.g. "food", "restaurants").
 * If term isn’t included we search everything. The term keyword also
 * accepts business names such as "Starbucks".
 * @param {String} locationVal -  	Specifies the combination of "address,
 * neighborhood, city, state or zip, optional country" to be used when
 * searching for businesses.
 * @param {String} categoryVal - Category to filter search results with.
 * The category filter can be a list of comma delimited categories. For
 * example, 'bars,french' will filter by Bars and French. The category
 * identifier should be used (for example 'discgolf', not 'Disc Golf').
 */
function searchYelp(termVal, locationVal, categoryVal) {

    'use strict';
    var httpMethod = 'GET';
    var url = 'http://api.yelp.com/v2/search?';
    var parameters = {
        location: locationVal,
        term: termVal,
        category_filter: categoryVal,
        oauth_consumer_key: oauth_consumer_keyVal,
        oauth_token: oauth_tokenVal,
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: oauth_signature_methodVal,
        callback: 'cb'
    };
    var consumerSecret = 'Xzz7g7qJMMY6-rs8zX8KTtxtBZY';
    var tokenSecret = 'oZstoMIkks8R3kXJGM5uFzDipas';
    var encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);
    parameters.oauth_signature = encodedSignature;

    var settings = {
        url: url,
        data: parameters,
        cache: true,
        dataType: 'jsonp',
        jsonpCallback: 'cb',
        success: function(results) {
            createMarkers(results, map);
            yelpResults = results;
        },
        error: function(error) {
            alert('Warning: Cannot load location data!');
        }
    };

    $.ajax(settings);
}


function FilterViewModel() {

    var self = this;

    self.filteredLocations = ko.observableArray();

    /**
     * @function removeDuplicates()
     * Remove duplicates from a list of Yelp locations based
     * on if they have a common name.
     */
    self.removeDuplicates = function() {
        current = self.filteredLocations()[0];

        for (var i = 0; i < self.filteredLocations().length; i++) {

            if (current.name === self.filteredLocations()[i].name) {
                self.filteredLocations()[i].name = 'erase';
            } else {
                current = self.filteredLocations()[i];
            }
        }

        self.filteredLocations.remove(function(locationPiece) {
            return locationPiece.name === 'erase';
        });
    };

    /**
     * @function compareMarkers()
     * Tests whether a Google Map marker has the same name as
     * a location from the Yelp Search API.
     * @param {Object} marker - a Google Map Marker
     * @param {Boolean} toBreak
     * @param {Object} location - a location from the Yelp Search API
     * @returns {Boolean} Shows there was a match between the objects
     */
    self.compareMarkers = function(marker, toBreak, location) {

        if (location.name === markers[marker].title) {
            markers[marker].setMap(map);
            toBreak = true;
            return toBreak;
        } else if (toBreak === false) {
            markers[marker].setMap(null);
        }
    };

    self.setMarkers = function() {

        for (var marker in markers) {
            if (!markers.hasOwnProperty(markers[marker])) {
                var toBreak = false;

                for (var location in filteredLocations()) {
                    if (filteredLocations().hasOwnProperty(location)) {
                        toBreak = compareMarkers(marker, toBreak, filteredLocations()[location]);
                    }

                }
            }
        }
    };

    /**
     * @function filterLocations()
     * Filters the locations on the map by matching their
     * name, categories, address, latitude and longitude and
     * location. Makes sure it doesn't return any duplicates,
     * and returns all locations if the input is an empty String.
     * Stores the matched locations in an observable array so that
     * the map will update live instead of needing to refresh the
     * page for each search.
     * @param {String} input - Search query to filter with
     * @param {Object} locationData - Yelp Search API data
     **/
    self.filterLocations = function(input, locationData) {
        var findAll = false;

        if (input === '') {
            // Display all locations if no filter is in place
            findAll = true;
        }


        locationData.businesses.forEach(function(business) {

            var name = business.name,
                categoryArray = business.categories,
                address = business.location.display_address,
                latLng = {
                    lat: business.location.coordinate.latitude,
                    lng: business.location.coordinate.longitude
                },
                location = [business.location.city, business.location.neighborhoods, business.location.state_code];

            var found = false;
            // We'll keep track of if we matched this location already to avoid duplicate entries

            categoryArray.forEach(function(categories) {
                categories.forEach(function(category) {

                    if ((!found && category.toLowerCase().contains(input.toLowerCase())) || findAll === true) {
                        self.filteredLocations.push({
                            name: name,
                            address: address[0] + ' ' + address[1],
                            category: categoryArray[0][0],
                            latLng: latLng
                        });

                        found = true;
                    }
                });
            });

            if (!found) {
                location.forEach(function(locationPiece) {

                    if (!found && locationPiece !== undefined && locationPiece.toLowerCase().contains(input.toLowerCase())) {
                        self.filteredLocations.push({
                            name: name,
                            address: address[0] + ' ' + address[1],
                            category: categoryArray[0][0],
                            latLng: latLng
                        });
                        found = true;
                    }
                });
            }

            if (!found) {
                address.forEach(function(addressPiece) {
                    if (!found && addressPiece.toLowerCase().contains(input.toLowerCase())) {
                        self.filteredLocations.push({
                            name: name,
                            address: address[0] + ' ' + address[1],
                            category: categoryArray[0][0],
                            latLng: latLng
                        });
                        found = true;
                    }
                });
            }

            if (name.toLowerCase().contains(input.toLowerCase()) && !found) {
                self.filteredLocations.push({
                    name: name,
                    address: address[0] + ' ' + address[1],
                    category: categoryArray[0][0],
                    latLng: latLng
                });
                found = true;
            }

            if (!found) {
                self.filteredLocations.remove(function(locationPiece) {
                    return locationPiece.name === name;
                });
            }

            found = false;
        });

        self.filteredLocations.sort(function(left, right) {
            // sort results alphabetically
            return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1);
        });

        removeDuplicates();
        setMarkers();
    };

    /**
     * @function centerMap()
     * Centers the map on the map marker that matches
     * the provided location's name.
     * @param {object} location - location data from Yelp Search API
     **/
    self.centerMap = function(location) {
        menu.removeClass('is-active');
        filterBox.blur();
        map.setCenter(location.latLng);
        google.maps.event.trigger(markers[location.name], 'click');
        markers[location.name].setAnimation(google.maps.Animation.BOUNCE);
    };
}

ko.applyBindings(FilterViewModel);

var filterBox = $('.filter-box'),
    menu = $('.filter-menu'),
    closeButton = $('.close-button'),
    map = $('#map');

map.click(function() {
    menu.removeClass('is-active');
    filterBox.blur(); // we have to remove focus or else it can't gain focus and reopen the menu!
});

filterBox.focus(function() {
    menu.addClass('is-active');
    filterLocations(filterInput, yelpResults);
    // If the fitler box is given focus while there is a query in the box, we want to make sure
    // the existing query is used!
});

closeButton.click(function() {
    menu.removeClass('is-active');
});

