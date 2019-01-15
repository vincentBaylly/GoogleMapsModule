import { Component, OnInit, Input, Output } from '@angular/core';

import { GoogleApiService } from './shared/google-api.service';

import { House, Address, markerHouseImg, markerCityImg, markers_declared } from '../model/map.classes';

declare var google: any;

@Component({
  selector: 'google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.less'],
  providers: [GoogleApiService]
})
export class GoogleMapsComponent implements OnInit {

  /**
  * The geocoder that defines the geocoder object to call google maps API
  */
  private geocoder: any;

  /**
  * The height that defines the size of the map
  */
  @Output()
  height: string = '500px';

  /**
   * The longitude that defines the center of the map.
   */
  @Input()
  public longitude: number = 0;

  /**
   * The latitude that defines the center of the map.
   */
  @Input()
  public latitude: number = 0;

  /**
  * The map that defines the google maps object
  */
  private map: any;

  /**
  * the markers house that defines all the house markers added to the map
  */
  private markers_house = [];

  /**
  * the houses that defines the tab of the houses get from the duProprio service call
  */
  private houses: House[] = [];

  /**
  * the markers city that defines the city markers added to the map
  */
  private markers_city = [];

  /**
  * the info window that defines the tooltips of map marker
  */
  private info_window;

  /**
  * the icon that defines the icon to add and remove city list
  */
  public icon = 'add';

  /**
  * the status that defines the state of the city list
  */
  private status: boolean = false;

  /**
  * the display that defines the state of the houses
  */
  private display: boolean = false;

  constructor(private googleApi: GoogleApiService) { }

  ngOnInit() {
    this.googleApi.initMap().then(() => {

      this.info_window = new google.maps.InfoWindow();

      let latlng = new google.maps.LatLng(this.latitude, this.longitude);

      this.map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: latlng,
        zoom: 9
      });

      var container = document.getElementById("container");
      var citylist = document.getElementById("citylist");
      var center = document.getElementById("center");
      var option = document.getElementById("option");

      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(container);
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(citylist);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(center);
      this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(option);

      this.loadDeclaredMarkers();
    });

    this.findFeaturedHomes();
  }

  findFeaturedHomes(): void {
    this.googleApi.findFeaturedHomes()
      .subscribe(listing => {

        for (var i = 0; i < listing.listings.length; i++) {

          let house: House = listing.listings[i];
          house.marker = {
            lat: 0,
            lng: 0,
            draggable: false
          };


          let full_address = this.getFullAddress(house.address);
          if (full_address) {
            this.findLocation(house, full_address, (house: House) => {
              let latlng = new google.maps.LatLng(house.lat, house.lng);

              var marker = new google.maps.Marker({
                position: latlng,
                map: this.map,
                title: house.id + ' ' + full_address,
                icon: markerHouseImg
              });

              google.maps.event.addListener(marker, "click", (this.loadInfoWindow)(this.info_window, this.houses, marker, this.getFullAddress));

              this.markers_house.push(marker);

            });
          }
        }
      });
  }

  findLocation(house: House, address, addToolTips) {

    if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0].geometry.location) {
          house.lat = results[0].geometry.location.lat();
          house.lng = results[0].geometry.location.lng();
          house.marker.lat = results[0].geometry.location.lat();
          house.marker.lng = results[0].geometry.location.lng();
          house.marker.draggable = true;
          house.viewport = results[0].geometry.viewport;
        }

        addToolTips(house);

      } else {
        console.warn('The address: ' + address + ' as not be found');
      }

      this.houses.push(house);
    });
  }

  loadInfoWindow(info_window, houses, marker, getFullAddress) {

    return function(evt) {
      for (var i = 0; i < houses.length; i++) {
        if (marker.title.includes(houses[i].id)) {
          let full_address = getFullAddress(houses[i].address);
          let contentString = '<div id="content">' +
            '<img style="height: 150px;" src="' + houses[i].photo + '">' +
            '<h1 id="firstHeading" class="firstHeading">' + houses[i].address.city + '</h1>' +
            '<div id="bodyContent">' +
            '<p>Prix: ' + houses[i].price.display + '</p>' +
            '<p>Adresse: <a target="blank" href="https://duproprio.com' + houses[i].url + '">' +
            full_address + '</a></p>' +
            '</div>' +
            '</div>';
          this.map.setCenter(marker.getPosition());
          this.map.setZoom(12);

          info_window.close();
          info_window.setContent(contentString);
          info_window.open(this.map, marker);
          break;
        }
      }
    }
  }

  getFullAddress(address: Address): string {
    let full_address: string = address.street || "";
    if (address.city) full_address = full_address + " " + address.city;
    if (address.province) full_address = full_address + " " + address.province;

    return full_address;
  }

  setCenter() {
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    this.map.setZoom(9);
    this.info_window.close();
  }

  addCity() {
    if (this.markers_city.length > 0) {
      if (this.markers_city[0].getMap() === undefined || this.markers_city[0].getMap() == null) {
        for (var index = 0; index < this.markers_city.length; index++) {
          this.markers_city[index].setMap(this.map);
        }
        document.getElementById("addcity").innerHTML = "Supprimer Ville";
      } else {
        this.removeCity();
      }
    }
  }

  removeCity() {
    for (var index = 0; index < this.markers_city.length; index++) {
      this.markers_city[index].setMap(null);
    }
    document.getElementById("addcity").innerHTML = "Ajouter Ville";
    this.info_window.close();
  }

  showHouses() {
    if (this.markers_house.length > 0) {
      if (this.markers_house[0].getMap() === undefined || this.markers_house[0].getMap() === null) {
        for (var index = 0; index < this.markers_house.length; index++) {
          this.markers_house[index].setMap(this.map);
        }
        this.display = false;
      } else {
        for (var index = 0; index < this.markers_house.length; index++) {
          this.markers_house[index].setMap(null);
        }
        this.display = true;
        this.info_window.close();
      }
    }
  }

  loadDeclaredMarkers() {
    for (var index = 0; index < markers_declared.length; index++) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(markers_declared[index].latitude, markers_declared[index].longitude),
        title: markers_declared[index].title,
        icon: markerCityImg
      });

      this.markers_city.push(marker);
    }
  }

  openCityList() {
    this.status = !this.status;
    this.icon = this.status ? 'remove' : 'add';
  }

  cityCenter(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    let idAttr = target.attributes.id;
    let marker = idAttr.nodeValue;
    console.log(marker);
    for (var index = 0; index < this.markers_city.length; index++) {
      if (marker === this.markers_city[index].getTitle()) {
        this.markers_city[index].setMap(this.map);
        this.map.setCenter(this.markers_city[index].getPosition());
        this.info_window.close();
        this.info_window.setContent(this.markers_city[index].title);
        this.info_window.open(this.map, this.markers_city[index]);
        this.map.setZoom(12);
      } else {
        this.markers_city[index].setMap(null);
      }
    }
  }

}
