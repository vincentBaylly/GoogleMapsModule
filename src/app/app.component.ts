import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  lat: number = 46.5618296;
  lng: number = -72.74353;
  height = '100%';
}
