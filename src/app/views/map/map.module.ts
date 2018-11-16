import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { MapComponent } from './map.component';
import { MapRoutingModule } from './map-routing.module';

import {ScrollDispatchModule ,ScrollDispatcher} from '@angular/cdk/scrolling';
import { VIEWPORT_RULER_PROVIDER } from '@angular/cdk/scrolling';

 import { LeafletModule } from '@asymmetrik/ngx-leaflet';

 import {MatSelectModule} from '@angular/material/select';


@NgModule({
  imports: [
  CommonModule,
  ScrollDispatchModule,MatSelectModule,
    FormsModule,
   LeafletModule,
    ReactiveFormsModule,
    NgSelectModule,
    ChartsModule,
    BsDropdownModule,
    MapRoutingModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ MapComponent ] 
}) 
export class MapModule { }