import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {Organizations} from '../../models/organizations';

import {Service} from '../../services/service.module';

import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {ViewportRuler, ScrollDispatcher,} from '@angular/cdk/scrolling';
import {FormControl} from '@angular/forms';

//import {latLng, LatLng, tileLayer} from 'leaflet';
import {icon, latLng, Layer, marker, tileLayer, polygon, circle} from 'leaflet';


//import * as Leaflet from 'leaflet';

//import 'leaflet.markercluster';

//import icon1 from 'leaflet/dist/images/marker-shadow.png';
//import icon2 from 'leaflet/dist/images/marker-icon.png';

//import * as Leaflet from 'leaflet';


//import 'leaflet-draw';

declare const L: any;

@Component({
  // selector: 'map',
  templateUrl: './map.component.html',
  //styles: ['.ui-leaflet { width: 100%; height: 500px; margin-top: 10px; }'],
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class MapComponent implements OnInit {


  isCollapsed: boolean = true;

  collapsedSelected: number;

  step: number;

  title = 'Mapa';
  map: any;
  data: any;
  estado: any;
  cityselected: any;

  entity_api = 'administrative';

  cities: any = [];
  regions: any = [];
  projects: any = [];

  actualubicacion = {
    id: 0,
    name: 'Colombia',
    lat: 4.624335,
    lng: -74.063644,
    parent_id: null
  };

  options: any;
  /*options = {
      layers: [
          Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
          //circle([ 46.95, -122 ], { radius: 5000 }),
          //Leaflet.polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
          //Leaflet.marker([ 4.624335, -74.063644 ])
      ],
      zoom: 6,
      center: Leaflet.latLng(4.624335, -74.063644)
  };*/

  /*layers = [
      circle([ 4.624335, -74.063644 ], { radius: 5000 }),
      //polygon([[ 4.624335, -74.063644 ], [4.624335, -74.063644 ], [ 4.624335, -74.063644 ]]),
     marker([ 4.624335, -74.063644 ],{
         icon: icon({
          iconSize: [ 25, 41 ],
          iconAnchor: [ 13, 41 ],
          iconUrl: 'assets/images/marker-icon.png',
          shadowUrl: 'assets/images/marker-shadow.png'
       })
     })
  ];*/


  /*layer = marker([ 4.624335, -74.063644], {
     icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/images/marker-icon.png',
        shadowUrl: 'assets/images/marker-shadow.png'
     })
  });*/


  center = {
    lat: 4.624335,
    lng: -74.063644,

  };
  zoom = 6;

  /*center =  {
    lat: null,
    lng: null,

  };*/

  //zoom:number;

  /*layer = Leaflet.marker([ 4.624335, -74.063644 ], {
    icon: Leaflet.icon({
       iconSize: [ 25, 41 ],
       iconAnchor: [ 13, 41 ],
       iconUrl: 'assets/images/marker-icon.png',
       shadowUrl: 'assets/images/marker-shadow.png'
    })
 });*/


  markerClusterData: any[] = [];


  //markerClusterOptions: Leaflet.MarkerClusterGroupOptions;


  constructor(private service: Service) {

  }

  ngOnInit() {
    //this.drawMap();
    console.log('ENTITY API');
    console.log(this.entity_api);


    this.service.getAll('administrativeMap').subscribe(cities => {

      this.cities = cities;
      console.log('cities');
      console.log(this.cities);


    });

    this.service.getRequest('getAllRegions', null).subscribe(res => {
      this.regions = res;
      for (let r of this.regions) {
        let childrens = r['childrens'];

        this.checkMain2(r, 'childrens');
      }
    });
    console.log('Regions');
    console.log(this.regions);


    this.options = {


      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'}),
        circle([4.624335, -74.063644], {radius: 5000}),
        //polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
        marker([4.624335, -74.063644], {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/images/marker-icon.png',
            shadowUrl: 'assets/images/marker-shadow.png'
          })

        })
      ],
      zoom: 6,
      center: latLng(4.624335, -74.063644)
    };

    /*this.layers=[
    circle([ 4.624335, -74.063644 ], { radius: 5000 }),
         //polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
         marker([ 4.624335, -74.063644 ],{
             icon: icon({
              iconSize: [ 25, 41 ],
              iconAnchor: [ 13, 41 ],
              iconUrl: 'assets/images/marker-icon.png',
              shadowUrl: 'assets/images/marker-shadow.png'
           })
         })
         ];*/
    console.log('OPTIONS');
    console.log(this.options);

    /*	const data: any[] = [];

          data.push(
                      marker([ 4.624335, -74.063644 ], {
                         icon: icon({
                            iconSize: [ 25, 41 ],
                            iconAnchor: [ 13, 41 ],
                            iconUrl: 'assets/images/marker-icon.png',
                            shadowUrl: 'assets/images/marker-shadow.png'
                         })
                      }
                 )
          );
      this.markerClusterData = data;*/


  }

  checkMain2(parent, childrens) {
    let checkMain = true;
    for (let c of parent[childrens])
      if (!c.select) {
        checkMain = false;
        break;
      }
    parent.selected = checkMain;
  }

  changeStatusCollapse(position) {
    //if (position == this.step) {
    this.isCollapsed = position == this.collapsedSelected && this.isCollapsed ? false : true;
    this.collapsedSelected = position;
    //}
  }


  changeCenter(city) {
    this.projects = [];
    let valcit = parseInt(city);


    console.log(valcit);
    console.log('CIUDAD');
    console.log(city);
    console.log('CIUDADES');
    console.log(this.cities);
    console.log('regions');
    console.log(this.cities);

    //this.actualubicacion = parseInt(city);
    console.log('this.actualizacion');
    console.log(this.actualubicacion);

    let index2 = this.cities.find(cit => cit.id === valcit);
    //let index2 = this.regions.find(reg => reg.id === valcit);

    console.log('el index');
    console.log(index2);
    console.log('EXISTE?');


    if (index2 != -1) {
      console.log('SI EXISTE');
      this.actualubicacion = index2;

      console.log(this.actualubicacion);

      this.service.getById('projects_by_admin', this.actualubicacion.id).subscribe(projects => {
        console.log('projects');
        console.log(projects);
        this.projects = projects;

        console.log('this.projects');
        console.log(this.projects);


      });

      if (this.actualubicacion.lat != null && this.actualubicacion.lng != null) {

        /*this.center = {
                      lat: this.actualubicacion.lat,
                      lng: this.actualubicacion.lng
             }*/

        this.options = {};

        let elid = this.actualubicacion.id;
        console.log('EL ID');
        console.log(elid);

        if (this.actualubicacion.parent_id == null) {

          if (elid == 1) {

            this.options = {
              layers: [
                tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'}),
                circle([this.actualubicacion.lat, this.actualubicacion.lng], {radius: 5000}),
                //Leaflet.polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
                marker([this.actualubicacion.lat, this.actualubicacion.lng], {
                  icon: icon({
                    iconSize: [25, 41],
                    iconAnchor: [13, 41],
                    iconUrl: 'assets/images/marker-icon.png',
                    shadowUrl: 'assets/images/marker-shadow.png'
                  })
                })
              ],
              zoom: 6,
              center: latLng(this.actualubicacion.lat, this.actualubicacion.lng)
            };

            console.log('options: ');
            console.log(this.options);

            //this.zoom = 6;

          } else {

            this.options = {
              layers: [
                tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'}),
                //circle([ this.actualubicacion.lat, this.actualubicacion.lng ], { radius: 5000 }),
                //Leaflet.polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
                marker([this.actualubicacion.lat, this.actualubicacion.lng], {
                  icon: icon({
                    iconSize: [25, 41],
                    iconAnchor: [13, 41],
                    iconUrl: 'assets/images/marker-icon.png',
                    shadowUrl: 'assets/images/marker-shadow.png'
                  })
                })
              ],
              zoom: 8,
              center: latLng(this.actualubicacion.lat, this.actualubicacion.lng)
            };

            console.log('options: ');
            console.log(this.options);
          }


        } else if (this.actualubicacion.parent_id != null) {
          this.options = {
            layers: [
              tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'}),
              //circle([ this.actualubicacion.lat, this.actualubicacion.lng ], { radius: 5000 }),
              //Leaflet.polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
              marker([this.actualubicacion.lat, this.actualubicacion.lng], {
                icon: icon({
                  iconSize: [25, 41],
                  iconAnchor: [13, 41],
                  iconUrl: 'assets/images/marker-icon.png',
                  shadowUrl: 'assets/images/marker-shadow.png'
                })
              })
            ],
            zoom: 12,
            center: latLng(this.actualubicacion.lat, this.actualubicacion.lng)
          };
        }
      }


      console.log('Changing center to ' + this.actualubicacion.name);

      //console.log(this.options);

    } else {
      console.log('NO EXISTE');

      /*	for(let region of this.regions){

                  let index3 = this.region.childrens.find(cit => cit.id === valcit);

                  if(index3 != -1){
                          console.log("SI EXISTE");
                      this.actualubicacion = index3;

                      console.log(this.actualubicacion);

                       this.service.getById('projects_by_admin',this.actualubicacion.id).subscribe(projects =>{
                       console.log("projects");
                       console.log(projects);
                       this.projects = projects;

                       console.log("this.projects");
                       console.log(this.projects);
                   });

                        if(this.actualubicacion.lat != null && this.actualubicacion.lng != null){

                         this.center = {
                                   lat: this.actualubicacion.lat,
                                   lng: this.actualubicacion.lng
                          }

                          let elid = this.actualubicacion.id;
                          console.log("EL ID");
                          console.log(elid);

                          if(this.actualubicacion.parent_id == null){

                                if( elid == 1){

                                    this.zoom = 6;

                                }else{
                                    this.zoom = 8;
                                }


                          }else if(this.actualubicacion.parent_id != null){
                              this.zoom = 13;
                          }
                      }

              }
          }*/

    }
  }


  /*drawMap(): void {
    this.map = Leaflet.map('map').setView([-0.1836298, -78.4821206], 13);
    Leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'AppTuto',
      maxZoom: 18
    }).addTo(this.map);*/

  /* var drawnItems = new L.FeatureGroup().addTo(this.map);
   var drawControl = new L.Control.Draw({
     draw: {
       polygon: {
       showArea: true,
       shapeOptions: {
         color: 'red'
       },
       },
       polyline: {
       shapeOptions: {
         color: 'red'
       },
       },
       rect: {
       shapeOptions: {
         color: 'green'
       },
       },
       circle: {
       shapeOptions: {
         color: 'steelblue'
       },
       },
     },
     edit: {
       featureGroup: drawnItems
     }
});
this.map.addControl(drawControl);
this.map.on(L.Draw.Event.CREATED, function (event) {
const layer = event.layer;

drawnItems.addLayer(layer);
this.data = drawnItems.toGeoJSON();
console.log(this.data);
});

Leaflet.polygon([
 [-0.126332,-78.491907],
 [-0.12878,-78.48856],
 [-0.13922,-78.485727],
 [-0.147082,-78.483796],
 [-0.156362,-78.485341],
 [-0.154815,-78.48753],
 [-0.14734,-78.489847],
 [-0.145536,-78.491521,],
 [-0.135096,-78.493323],
 [-0.126332,-78.491907]
]).addTo(this.map);

   var map = this.map;

    //web location
    map.locate({ setView: true});

    //when we have a location draw a marker and accuracy circle
    function onLocationFound(e) {
      var radius = e.accuracy / 2;

      Leaflet.marker(e.latlng).addTo(map)
          .bindPopup("Estás dentro de los " + radius + "metros desde este punto").openPopup();

      Leaflet.circle(e.latlng, radius).addTo(map);
    }
    map.on('locationfound', onLocationFound);*/

  //alert on location error
  /*function onLocationError(e) {
    alert(e.message);
  }

  this.map.on('locationerror', onLocationError);
}*/

  /*MostrarLatLon(){
    var map = this.map;
    var popup = L.popup();

      function onMapClick(e) {
          popup
              .setLatLng(e.latlng)
              .setContent("Hiciste clic en el mapa en " + e.latlng.toString())
              .openOn(map);
      }

      if(this.estado == 1){
      map.on('click', onMapClick);
      this.estado = 0;
   }else{
      map.off('click');
      this.estado = 1;

    }

 }*/

}
