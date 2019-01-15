import { Component, OnInit, Input, Output } from '@angular/core';

import { GoogleApiService } from './shared/google-api.service';

declare var google: any;

@Component({
  selector: 'google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.less'],
  providers: [GoogleApiService]
})
export class GoogleMapsComponent implements OnInit {

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
  * the info window that defines the tooltips of map marker
  */
  private info_window;

  /**
  * The geocoder that defines the geocoder object to call google maps API
  */
  private geocoder: any;

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
    });
  }

  findLocation(address, addToolTips) {

    if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({
      'address': address
    }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0].geometry.location) {
          //use the get adress from geocoder
        }

      } else {
        console.warn('The address: ' + address + ' as not be found');
      }
    });
  }

  loadInfoWindow(info_window, houses, marker, getFullAddress) {
    return function(evt) {
      let contentString = 'my tooltips Content';
      this.map.setCenter(marker.getPosition());
      this.map.setZoom(12);

      info_window.close();
      info_window.setContent(contentString);
      info_window.open(this.map, marker);

    }
  }

  setCenter() {
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    this.map.setZoom(9);
    this.info_window.close();
  }

}
