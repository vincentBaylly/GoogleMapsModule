/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// Create the map.
var map;
var markersCity = [];
var markersHouse = [];
var cityCircle;

var infowindow = new google.maps.InfoWindow();
var markerHouseImg = "https://upload.wikimedia.org/wikipedia/commons/c/c0/Map_marker_icon_%E2%80%93_Nicolas_Mollet_%E2%80%93_Home_%E2%80%93_People_%E2%80%93_Classic.png";

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        mapTypeControl: false,
        //zoomControl: false,
        center: {
            lat: mapsPosition.latitude,
            lng: mapsPosition.longitude
        },
    });

    var container = document.getElementById("container");
    var option = document.getElementById("option");
	var search = document.getElementById("search");
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(container);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(option);
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(search);

    cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        clickable: false,
        map: map,
        center: {
            lat: mapsPosition.latitude,
            lng: mapsPosition.longitude
        },
        radius: mapsPosition.radius
    });

    for (index = 0; index < markersDeclared.length; index++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(markersDeclared[index].latitude, markersDeclared[index].longitude),
            title: markersDeclared[index].title
        });

        markersCity.push(marker);
    }

    for (index = 0; index < houses.length; index++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(houses[index].latitude, houses[index].longitude),
            title: houses[index].title,
            icon: markerHouseImg,
            centris: houses[index].centris,
        });

        google.maps.event.addListener(marker, 'click', function () {
            loadInfoWindow(this);
        });

        markersHouse.push(marker);
    }

}
$(document).ready(function () {
    $(".location").click(function () {
        var marker = $(this).data('marker');
        for (index = 0; index < markersCity.length; index++) {
            if (marker === markersCity[index].getTitle()) {
                markersCity[index].setMap(map);
                map.setCenter(markersCity[index].getPosition());
                infowindow.close();
                infowindow.setContent(markersCity[index].title);
                infowindow.open(map, markersCity[index]);
                map.setZoom(12);
            } else {
                markersCity[index].setMap(null);
            }
        }

    });

    $(".center").click(function () {
        map.setCenter(new google.maps.LatLng(mapsPosition.latitude, mapsPosition.longitude));
        map.setZoom(11);
        infowindow.close();
        removeCity();
        cityCircle.setMap(map);
    });

    $(".addcity").click(function () {
        console.log(markersCity[0].getMap());
        if (markersCity.length > 0) {
            if (markersCity[0].getMap() === undefined || markersCity[0].getMap() == null) {
                for (index = 0; index < markersCity.length; index++) {
                    markersCity[index].setMap(map);
                }
                document.getElementById("addcity").innerHTML = "Supprimer Ville";
            } else {
                removeCity();
            }
        }
    });

    $(".header").click(function () {

        $header = $(this);
        //getting the next element
        $content = $header.next();
        //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
        $content.slideToggle(500, function () {
            //execute this after slideToggle is done
            //change text of header based on visibility of content div
            $header.text(function () {
                //change text based on condition
                return $content.is(":visible") ? "-" : "+";
            });
        });

    });

    $(".disable").click(function () {
        if (cityCircle.getMap() !== null) {
            cityCircle.setMap(null);
            document.getElementById("disable").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
        } else {
            cityCircle.setMap(map);
            document.getElementById("disable").innerHTML = "<span class=\"close_cross\">&times;</span>";
        }
    });

    $(".houses").click(function () {

        if (markersHouse.length > 0) {
            if (markersHouse[0].getMap() === undefined || markersHouse[0].getMap() === null) {
                for (index = 0; index < markersHouse.length; index++) {
                    markersHouse[index].setMap(map);
                }
                document.getElementById("houses").innerHTML = "<div class=\"crossedhouse\">&#9750;</div>";
            } else {
                for (index = 0; index < markersHouse.length; index++) {
                    markersHouse[index].setMap(null);
                }
                document.getElementById("houses").innerHTML = "&#9750;";
                infowindow.close();
            }
        }
    });
    $(".centris").keyup(function () {
        if (document.getElementById("centris").value.length === 8) {
            console.log("input text: " + document.getElementById("centris").value);
            for (index = 0; index < markersHouse.length; index++) {
                console.log("markersHouse.centris: " + markersHouse[index].centris);
                if (markersHouse[index].centris == document.getElementById("centris").value) {
                    createInfoWindow(markersHouse[index], houses[index]);
                    markersHouse[index].setMap(map);
                    break;
                }
            }
        }
    });

});

function createInfoWindow(marker) {

    for (i = 0; i < houses.length; i++) {
        if (houses[i].title === marker.getTitle()) {

            var contentString = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h1 id="firstHeading" class="firstHeading">' + houses[i].centris + '</h1>' +
                    '<div id="bodyContent">' +
                    '<p>Prix: ' + houses[i].price + ' $</p>' +
                    '<p>Adresse: <a target="blank" href="http://www.centris.ca/fr/trouvez-votre-propriete-liste/' + houses[i].centris + '">' +
                    houses[i].address + '</a></p>' +
                    '<p>Taxes Mun. :' + houses[i].taxesmun + ' $</p>' +
                    '<p>Taxes Scol. :' + houses[i].taxesscol + ' $</p>' +
                    '<p>Taxes total:' + houses[i].taxestotal + ' $</p>' +
                    '</div>' +
                    '</div>';
            map.setCenter(marker.getPosition());
            map.setZoom(15);
            infowindow.setContent(contentString);
            cityCircle.setMap(null);
            infowindow.open(map, marker);
            break;
        }
    }
}

function loadInfoWindow(marker) {
	for (i = 0; i < houses.length; i++) {
		if (houses[i].title === marker.getTitle()) {

			createInfoWindow(marker, houses[i]);
			break;
		}
	}
}

function removeCity() {
    for (index = 0; index < markersCity.length; index++) {
        markersCity[index].setMap(null);
    }
    document.getElementById("addcity").innerHTML = "Ajouter Ville";
    infowindow.close();
}

google.maps.event.addDomListener(window, 'load', initMap);