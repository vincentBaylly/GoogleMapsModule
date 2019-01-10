import { Component, OnInit, Input } from '@angular/core';

import { GoogleApiService } from './shared/google-api.service';

import { Listing } from '../model/listing.classes';

declare var google: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?:string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;
}

@Component({
  selector: 'google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.less'],
  providers: [ GoogleApiService ]
})
export class GoogleMapsComponent implements OnInit {

  geocoder:any;

  /**
  * The height that defines the size of the map
  */
  //@Input()
  private height: string = '300px';

  /**
   * The longitude that defines the center of the map.
   */
  @Input() longitude: number = 0;

  /**
   * The latitude that defines the center of the map.
   */
  @Input() latitude: number = 0;

  private map:any;

  constructor(private googleApi:GoogleApiService) {}

  ngOnInit() {
    this.googleApi.initMap().then(() => {

      let latlng = new google.maps.LatLng(this.latitude, this.longitude);

      this.map = new google.maps.Map(document.getElementById('map'), {
        center: latlng,
        zoom: 4
      });

      new google.maps.Marker({
        position: latlng,
        map: this.map,
        title: 'Hello World!'
      });
    });

    this.findFeaturedHomes();
  }

  findFeaturedHomes(): void {
    this.googleApi.findFeaturedHomes()
    .subscribe(listing =>{

      for (var i=0; i < listing.listings.length; i++ ) {
        let listingRow: Listing = listing.listings[i];
        let full_address:string = listingRow.address.street || "";
        if (listingRow.address.city) full_address = full_address + " " + listingRow.address.city;
        if (listingRow.address.province) full_address = full_address + " " + listingRow.address.province;
        let location = this.findLocation(full_address);
        console.log(full_address);
        let latlng = new google.maps.LatLng(location.lat, location.lng);

        new google.maps.Marker({
          position: latlng,
          map: this.map,
          title: full_address
        });

      }
    });
  }

  findLocation(address):Location  {

    let location : Location;

    if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      console.log(results);
      if (status == google.maps.GeocoderStatus.OK) {
        for (var i = 0; i < results[0].address_components.length; i++) {
          let types = results[0].address_components[i].types
          console.log(types);

          if (types.indexOf('locality') != -1) {
            location.address_level_2 = results[0].address_components[i].long_name
          }
          if (types.indexOf('country') != -1) {
            location.address_country = results[0].address_components[i].long_name
          }
          if (types.indexOf('postal_code') != -1) {
            location.address_zip = results[0].address_components[i].long_name
          }
          if (types.indexOf('administrative_area_level_1') != -1) {
            location.address_state = results[0].address_components[i].long_name
          }
        }
        if (results[0].geometry.location) {
          location.lat = results[0].geometry.location.lat();
          location.lng = results[0].geometry.location.lng();
          location.marker.lat = results[0].geometry.location.lat();
          location.marker.lng = results[0].geometry.location.lng();
          location.marker.draggable = true;
          location.viewport = results[0].geometry.viewport;
        }

        this.map.triggerResize();

      } else {
        alert("Sorry, this search produced no results.");
      }
    });

    return location;
  }

}
