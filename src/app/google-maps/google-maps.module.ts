import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { GoogleMapsComponent } from './google-maps.component';

@NgModule({
  declarations: [
    GoogleMapsComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    HttpClientModule,
    BrowserAnimationsModule

  ],
  exports: [
    GoogleMapsComponent
  ]
})
export class GoogleMapsModule { }
