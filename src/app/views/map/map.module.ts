import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {ModalModule} from 'ngx-bootstrap/modal';


import {ChartsModule} from 'ng2-charts/ng2-charts';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ButtonsModule} from 'ngx-bootstrap/buttons';

import {MapComponent} from './map.component';
import {MapRoutingModule} from './map-routing.module';

import {ScrollDispatchModule, ScrollDispatcher} from '@angular/cdk/scrolling';
import {VIEWPORT_RULER_PROVIDER} from '@angular/cdk/scrolling';

import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';

import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {TabsModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ScrollDispatchModule, MatSelectModule,
    FormsModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    NgSelectModule,
    ChartsModule,
    BsDropdownModule,
    MapRoutingModule,
    ButtonsModule.forRoot(),
    MatChipsModule,
    MatRadioModule, MatButtonModule,
    TabsModule
  ],
  declarations: [MapComponent]
})
export class MapModule {
}
