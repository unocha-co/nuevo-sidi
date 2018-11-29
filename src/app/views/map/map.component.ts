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
import {icon, latLng, Layer, marker, Marker, tileLayer, polygon, circle} from 'leaflet';
import * as L from 'leaflet';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
//import icon1 from 'leaflet/dist/images/marker-shadow.png';
//import icon2 from 'leaflet/dist/images/marker-icon.png';
//import * as Leaflet from 'leaflet';
//import 'leaflet-draw';
//declare const L: any;
@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  isCollapsed: boolean = true;
  collapsedSelected: number;
  title = 'Mapa';
  map: any;
  data: any;
  estado: any;
  filtros: any = {
    tags_list: [],
    stags_list: [],
    org_list: []
  };
  cityselected: any = [];
  departamentosseleccionados: any = [];
  ejecutorseleccionado: any;
  donantesseleccionados: any = [];
  implementadoresseleccionados: any = [];
  actualubicacion = {
    id: 0,
    name: 'Colombia',
    x: 4.624335,
    y: -74.063644,
    parent_id: null,
    filtro: ''
  };
  LAYER_OSM = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Open Street Map'});
  // defino array markers
  markers: Marker[] = [];
  proyectoseleccionado: any = {
    name: null,
    description: null,
    ejecutor: {org: {name: ''}},
    beneficiaries: [],
    budget: []
  };

  options: any;

  // Marker cluster stuff
  markerClusterData: any[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions = ({
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    removeOutsideVisibleBounds: true,
    animate: true,
    iconCreateFunction: function (cluster) {
      let markrs = cluster.getAllChildMarkers();
      let marksfinal: any = [];
      let countmarks = 0;
      markrs.forEach((obj) => {
        let o = marksfinal.find((p) => p.options.title == obj.options.title);
        if (!o) {
          marksfinal.push(obj);
          countmarks = countmarks + 1;
        }
      });
      return L.divIcon({html: '<div class="leaflet-marker-icon"><b>' + countmarks + '</b></div>'});
    }

  });
//arrays para los selects
  ejecutores: any = [];
  donantes: any = [];
  implementadores: any = [];
  undafarray: any = [];
  estados: any = [
    {id: 1, texto: 'Finalizado', cantidad: 0},
    {id: 2, texto: 'En ejecución', cantidad: 0}
  ];
  periodos: any = [];
  opcionesvigencia: any = [
    {value: 1, texto: 'Proyectos que inicien en:', f_date: 'inicio'},
    {value: 2, texto: 'Proyectos que finalicen en:', f_date: 'final'},
    {value: 3, texto: 'Proyectos con vigencia en:', f_date: 'vigencia'},
  ];
  lavigencia = this.opcionesvigencia[2];
  departamentos: any = [];
  acuerdosdepaz: any = [];
  emergencias: any = [];
  cities: any = [];
  checkcities: any = 0;
  citiesfilter: any = [];
  relacionesOrgProyectos: any = [];
  projecttags: any = [];
  projectshorttags: any = [];
  projects: any = [];
  act_ids: any = [];
  project_list: any = [];
  totalprojects: number = 0;
  totalbeneficiarios: number = 0;
  presupuestototal: number = 0;
  yearactual = new Date();
  list_start = 0;
  list_end = 10;
  periodoseleccionado: any = this.yearactual.getFullYear();
  senddata: any = {
    f_date: this.lavigencia.f_date,
    date: this.periodoseleccionado,
    loc: [],
    org: [],
    tags: {},
    s_tags: {},
    id: null
  };
  filterchips: any = [
    {
      filtro: 'Periodo',
      texto: 'Vigentes en:',
      years: []
    }
  ];
  filters: any = {
    shorttags: [],
    tags: [],
    org: []
  };

  constructor(private service: Service, private spinnerService: Ng4LoadingSpinnerService) {
  }

  markerClusterReady(markerCluster: L.MarkerClusterGroup) {
    markerCluster.on('clusterclick', (a) => {
      let mark = a.layer.getAllChildMarkers();
      if (mark.length > 0) {
        let ids = mark.map(function (x) {
          return x.options.title;
        });
        this.getProjectsList(ids, this.list_start, this.list_end);
      }
    });
  }

  getProjectsList(ids, start, end) {
    this.act_ids = ids;
    this.service.getAll('administrativeMap?pi=1&id=' + ids + '&start=' + start + '&end=' + end).subscribe(data => {
      this.project_list = data.pa;
    });
  }

  loadMoreProjectsList() {
    this.spinnerService.show();
    this.list_end += 5;
    this.service.getAll('administrativeMap?pi=1&id=' + this.act_ids + '&start=' + this.list_start + '&end=' + this.list_end).subscribe(data => {
      this.project_list = data.pa;
      this.spinnerService.hide();
    });
  }

  groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  ngOnInit() {
    this.spinnerService.show();
    this.filterchips[0].years.push(this.periodoseleccionado);
    //INICIALIZO OPTIONS
    this.options = {
      layers: [this.LAYER_OSM],
      zoom: 6,
      center: latLng(4.624335, -74.063644)
    };
    //TRAE REALACION ORGANIZACIONES Y PROYECTOS:
    this.service.getAll('relation').subscribe(data => {
      this.relacionesOrgProyectos = data;
    });

    //TRAE PROJECTS TAGS
    this.service.getAll('project-tags-parents').subscribe(data => {
      this.projecttags = data;
    });

    this.service.getAll('project-short-tags-parents').subscribe(data => {
      this.projectshorttags = data;
    });

    //TRAERE LOS PROJECTOS con las divisiones administrativas y la ubicación de cada una
    this.service.getAll('administrativeMap?f_date=' + this.senddata.f_date + '&date=' + this.senddata.date).subscribe(data => {
      //ciudadesydepartamentos: 
      for (let ciudadodepartamento of data.filtros.loc) {
        if (ciudadodepartamento.parent_id == null) {
          this.departamentos.push(ciudadodepartamento);
        } else if (ciudadodepartamento.parent_id != null && ciudadodepartamento.parent_id != 0) {
          this.cities.push(ciudadodepartamento);
          this.citiesfilter.push(ciudadodepartamento);
        }
      }

      //Beneficiarios: 
      this.totalbeneficiarios = data.benef;
      //Filtros
      this.filtros = data.filtros;
      this.filtros.tags_list = this.groupBy(data.filtros.tags, 'parent_id');
      this.filtros.stags_list = this.groupBy(data.filtros.s_tags, 'parent_id');
      this.filtros.org_list = this.groupBy(data.filtros.org, 'relation_id');
      //organizaciones:
      for (let organizacion of data.filtros.org) {
        if (organizacion.relation_id == 1) {  //1 para ejecutores
          this.ejecutores.push(organizacion);
        } else if (organizacion.relation_id == 2) {//2 para donantes
          this.donantes.push(organizacion);
        } else if (organizacion.relation_id == 3) {//3 para implementadores
          this.implementadores.push(organizacion);
        }
      }
      //Acuerdos de PAZ
      for (let acuerdodepaz of data.filtros.tags) {
        if (acuerdodepaz.code) {
          this.acuerdosdepaz.push(acuerdodepaz);
        }
        if (acuerdodepaz.parent_id == 175 || acuerdodepaz.parent_id == 176) {
          this.undafarray.push(acuerdodepaz);
        }
      }
      //EMERGENCIAS
      for (let emergencia of data.filtros.s_tags) {
        if (emergencia.parent_id == 7) {
          this.emergencias.push(emergencia);
        }
      }

      //PROYECTOS
      let all_projects = data.pa;
      if (all_projects.length > 0) {
        let ids = all_projects.map(function (x) {
          return x.id;
        });
        this.getProjectsList(ids, this.list_start, this.list_end);
      }
      const datamapa: any[] = [];
      for (let project of all_projects) {
        let index = this.projects.indexOf(project);
        if (index == -1) {
          this.projects.push(project);
          if (project.presu) {
            this.presupuestototal += parseFloat(project.presu);
          }
          //PARA LOS PERIODOS
          let fechaini = new Date(project.date_start);
          let fechaini2 = fechaini.getFullYear();

          let fechafin = new Date(project.date_end);
          let fechafin2 = fechafin.getFullYear();
          //PARA ESTADOS

          var hoy = new Date(),
            month = '' + (hoy.getMonth() + 1),
            day = '' + hoy.getDate(),
            year = hoy.getFullYear();
          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
          var hoy2 = [year, month, day].join('-');
          if (project.date_end < hoy2) {
            this.estados[0]['cantidad'] = this.estados[0]['cantidad'] + 1;
          } else if (project.date_end > hoy2) {
            this.estados[1]['cantidad'] = this.estados[1]['cantidad'] + 1;
          }
          //TERMINA ESTADOS
          let indexperiodoini = this.periodos.indexOf(fechaini2);
          let indexperiodofin = this.periodos.indexOf(fechafin2);
          if (indexperiodoini == -1) {
            this.periodos.push(fechaini2);
          }
          if (indexperiodofin == -1) {
            this.periodos.push(fechafin2);
          }
          //PARA PINTAR EL PROYECTO EN CADA DIV ADMINISTRATIVA
          for (let divadmin of project.admins) {
            //divadmin.admin_division    Aquí tengo la info de la DIVADMI
            if (divadmin.admin_division != null) {
              if (divadmin.admin_division.x != null && divadmin.admin_division.y != null) {
                let newMarker = marker(
                  [divadmin.admin_division.y, divadmin.admin_division.x],
                  {
                    icon: icon({
                      iconSize: [25, 41],
                      iconAnchor: [13, 41],
                      iconUrl: 'assets/images/marker-icon.png',
                      shadowUrl: 'assets/images/marker-shadow.png'
                    }),
                    title: project.id
                  },
                ).on('click', () => {
                  //alert(proj.project_id);
                  this.service.getById('project', project.id).subscribe(item => {
                    let data = item.data;
                    this.proyectoseleccionado = data;
                    this.show_modal(data, 'mapa');
                  });
                });
                this.markers.push(newMarker);
                datamapa.push(newMarker);
              }
            }
          }
        }
      }
      this.markerClusterData = datamapa;
      this.periodos.sort();
      this.spinnerService.hide();
    });
  }

  enviarInfo() {
    this.spinnerService.show();
    var lugares = [];
    this.departamentos = [];
    this.cities = [];

    if (this.departamentosseleccionados.length > 0 && this.checkcities == 0) {
      for (let dep of this.departamentosseleccionados) {
        lugares.push(dep.id);
      }
    }
    if (this.cityselected.length > 0 && this.checkcities == 1) {
      for (let cit of this.cityselected) {
        lugares.push(cit.id);
      }
    }

    let finaltags = '';
    for (let tagindex of this.filters.tags) {
      if (tagindex != undefined) {
        if (finaltags != '' && finaltags.substr(-1) != '-' && tagindex.length > 0) {
          finaltags += '-';
        }
        for (let tag of tagindex) {
          if (finaltags == '' || finaltags.substr(-1) == '-') {
            finaltags += tag.toString();
          } else {
            finaltags += ',' + tag;
          }
        }
      }
    }

    let finalorg = '';
    for (let oindex of this.filters.org) {
      if (oindex != undefined) {
        if (finalorg != '' && finalorg.substr(-1) != '-' && oindex.length > 0) {
          finalorg += '-';
        }
        for (let tag of oindex) {
          if (finalorg == '' || finalorg.substr(-1) == '-') {
            finalorg += tag.toString();
          } else {
            finalorg += ',' + tag;
          }
        }
      }
    }

    let finalshorttags = '';
    for (let shorttagindex of this.filters.shorttags) {
      if (shorttagindex != undefined) {
        if (finalshorttags != '' && finalshorttags.substr(-1) != '-' && shorttagindex.length > 0) {
          finalshorttags += '-';
        }
        for (let tag of shorttagindex) {
          if (finalshorttags == '' || finalshorttags.substr(-1) == '-') {
            finalshorttags += tag.toString();
          } else {
            finalshorttags += ',' + tag;
          }
        }
      }
    }

    this.senddata = {
      f_date: this.lavigencia.f_date,
      date: this.periodoseleccionado,
      loc: lugares,
      org: finalorg,
      tags: finaltags,
      s_tags: finalshorttags
    };
    //TRAERE LA DATA
    this.service.getAll('administrativeMap?f_date=' + this.senddata.f_date + '&date=' + this.senddata.date + '&loc=' + this.senddata.loc + '&org=' + this.senddata.org + '&tags=' + this.senddata.tags + '&s_tags=' + this.senddata.s_tags).subscribe(data => {
      for (let ciudadodepartamento of data.filtros.loc) {
        if (ciudadodepartamento.parent_id == null) {
          this.departamentos.push(ciudadodepartamento);
        } else if (ciudadodepartamento.parent_id != null && ciudadodepartamento.parent_id != 0) {
          this.cities.push(ciudadodepartamento);
          this.citiesfilter.push(ciudadodepartamento);
        }
      }
      //Beneficiarios: 
      this.totalbeneficiarios = data.benef;
      //organizaciones:
      for (let organizacion of data.filtros.org) {
        if (organizacion.relation_id == 1) {  //1 para ejecutores
          this.ejecutores.push(organizacion);
        } else if (organizacion.relation_id == 2) {//2 para donantes
          this.donantes.push(organizacion);
        } else if (organizacion.relation_id == 3) {//3 para implementadores
          this.implementadores.push(organizacion);
        }
      }

      this.filtros = data.filtros;
      this.filtros.tags_list = this.groupBy(data.filtros.tags, 'parent_id');
      this.filtros.stags_list = this.groupBy(data.filtros.s_tags, 'parent_id');
      this.filtros.org_list = this.groupBy(data.filtros.org, 'relation_id');

      let all_projects = data.pa;
      this.projects = all_projects;
      const datamapa: any[] = [];
      this.presupuestototal = 0;
      for (let project of all_projects) {
        //total presupuesto
        if (project.presu) {
          this.presupuestototal += parseFloat(project.presu);
        }
        //PARA ESTADOS

        var hoy = new Date(),
          month = '' + (hoy.getMonth() + 1),
          day = '' + hoy.getDate(),
          year = hoy.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        var hoy2 = [year, month, day].join('-');
        if (project.date_end < hoy2) {
          this.estados[0]['cantidad'] = this.estados[0]['cantidad'] + 1;
        } else if (project.date_end > hoy2) {
          this.estados[1]['cantidad'] = this.estados[1]['cantidad'] + 1;
        }
        //TERMINA ESTADOS
        for (let divadmin of project.admins) {
          //  console.log("INDEX PARA DEPARTAMENTO");
          let indexadmin_id: any;
          let indexadmdiv: any;
          if (lugares.length > 0) {
            indexadmin_id = lugares.indexOf(divadmin.admin_id);
            indexadmdiv = lugares.indexOf(divadmin.admin_division.parent_id);
          } else {
            indexadmin_id = 1;
          }
          if (indexadmin_id != -1) {  /*SI EL DEPARTAMENTO ESTÁ EN LOS LUGARES
                  SELECCIONADOS*/
            //   console.log("PINTO DEPARTAMENTO");
            if (divadmin.admin_division != null) {
              if (divadmin.admin_division.y != null && divadmin.admin_division.x != null) {
                let newMarker = marker(
                  [divadmin.admin_division.y, divadmin.admin_division.x],
                  {
                    icon: icon({
                      iconSize: [25, 41],
                      iconAnchor: [13, 41],
                      iconUrl: 'assets/images/marker-icon.png',
                      shadowUrl: 'assets/images/marker-shadow.png'
                    }),
                    title: project.id

                  },
                ).on('click', () => {
                  this.service.getById('project', project.id).subscribe(item => {
                    let data = item.data;

                    this.proyectoseleccionado = data;
                    this.show_modal(data, 'mapa');
                  });
                });
                this.markers.push(newMarker);
                datamapa.push(newMarker);
              }
            }
          } else if (indexadmin_id == -1) {

            if (indexadmdiv != -1) {
              if (divadmin.admin_division != null) {
                if (divadmin.admin_division.y != null && divadmin.admin_division.x != null) {
                  let newMarker2 = marker(
                    [divadmin.admin_division.y, divadmin.admin_division.x],
                    {
                      icon: icon({
                        iconSize: [25, 41],
                        iconAnchor: [13, 41],
                        iconUrl: 'assets/images/marker-icon.png',
                        shadowUrl: 'assets/images/marker-shadow.png'
                      }),
                      title: project.id

                    },
                  ).on('click', () => {
                    this.service.getById('project', project.id).subscribe(item => {
                      let data = item.data;
                      this.proyectoseleccionado = data;
                      this.show_modal(data, 'mapa');
                    });
                  });
                  this.markers.push(newMarker2);
                  datamapa.push(newMarker2);
                }
              }
            }
          }
        }
      }
      this.markerClusterData = datamapa;
      this.spinnerService.hide();
    });
  }

  filtroPorEjecutor(ejecutor) {
    this.ejecutorseleccionado = ejecutor;
    this.enviarInfo();
  }

  filtroPorDonantes(donantes) {
    for (let donante of donantes) {
      this.donantesseleccionados = donante;
    }
    this.enviarInfo();
  }

  filtroPorImplementador(implementadores) {
    for (let implementador of implementadores) {
      this.implementadoresseleccionados = implementador;
    }
  }

  filtroPeriodo(a, vig) {
    this.lavigencia.f_date = vig.f_date;
    if (a == 0) {
      this.periodoseleccionado = null;
    } else {
      this.periodoseleccionado = parseInt(a);
    }
    this.enviarInfo();
  }

  filtroDepartamentos(departamentos) {
    let citiesupdate = [];
    this.cities = [];
    for (let departamento of departamentos) {
      this.options = {
        layers: [this.LAYER_OSM],
        zoom: 8,
        center: latLng(departamento.y, departamento.x)
      };
      const cities = this.citiesfilter.filter(city => city.parent_id == departamento);
      citiesupdate.push(cities);
    }
    for (let citfinarray of citiesupdate) {
      for (let cityfin of citfinarray) {
        this.cities.push(cityfin);
      }

    }
    this.enviarInfo();
  }

  filtroCiudades(ciudades) {
    if (ciudades.length > 0) {
      for (let c of ciudades) {
        this.options = {
          layers: [this.LAYER_OSM],
          zoom: 8,
          center: latLng(c.y, c.x)
        };
      }
      this.cityselected.push();
      this.checkcities = 1;
      this.enviarInfo();
    } else {
      this.checkcities = 0;
      this.enviarInfo();
    }
  }

  projectsduplicadospresupuesto(array) {
    let newarraypresupuesto = [];
    for (let elemento of array) {
      let index = this.projects.indexOf(elemento);
      if (index == -1) {
        this.presupuestototal = this.presupuestototal + elemento.cost;
      }
    }
  }

  projectsduplicados(array) {
    let newarray = [];
    for (let elemento of array) {
      let index = this.projects.indexOf(elemento);
      if (index == -1) {
        this.projects.push(elemento);
      }
    }
  }

  show_modal(data, origen: string) {
    this.spinnerService.show();
    if (origen == 'boton') {
      this.service.getById('project', data).subscribe(item => {
        let datainfo = item.data;
        this.proyectoseleccionado = datainfo;
        this.proyectoseleccionado.total_benef = 0;
        for (let p of this.proyectoseleccionado.beneficiaries) {
          this.proyectoseleccionado.total_benef += p.number;
        }
        document.getElementById('btn-show-modal').click();
        this.spinnerService.hide();
      });
    }else{
      this.spinnerService.hide();
    }
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
    this.isCollapsed = position == this.collapsedSelected && this.isCollapsed ? false : true;
    this.collapsedSelected = position;
  }

//FILTRO POR DEPARTAMENTO
  filtroPorDepartamento(departamento) {
    this.projects = [];
    this.markers = [];
    let valdepartamento = parseInt(departamento);
    let index2;
    index2 = this.departamentos.find((departa) => departa.id === valdepartamento);
    this.markers = [];
    if (index2 != -1) {
      this.actualubicacion = index2;
      this.presupuestototal = 0;
      let infoadmidiv: any;
      const data: any[] = [];
      this.service.getById('filtroProjectsByAdmin', this.actualubicacion.id).subscribe(admdivinfo => {
        infoadmidiv = admdivinfo;
        this.projects = admdivinfo.projects;
        this.totalprojects = this.projects.length;
        if (this.actualubicacion.x != null && this.actualubicacion.y != null) {
          this.options = {
            layers: [this.LAYER_OSM],
            zoom: 6,
            center: latLng(this.actualubicacion.y, this.actualubicacion.x)
          };
          let elid = this.actualubicacion.id;
          if (this.actualubicacion.parent_id == null) {
            if (elid == 1) {
              this.options = {
                layers: [this.LAYER_OSM],
                zoom: 6,
                center: latLng(this.actualubicacion.y, this.actualubicacion.x)
              };
              if (infoadmidiv.projects.length > 0) {
                let valsum: number = this.actualubicacion.y;
                for (let proj of infoadmidiv.projects) {
                  this.presupuestototal = this.presupuestototal + proj.project.cost;
                  let newMarker = marker(
                    [this.actualubicacion.y, this.actualubicacion.x],
                    {
                      icon: icon({
                        iconSize: [25, 41],
                        iconAnchor: [13, 41],
                        iconUrl: 'assets/images/marker-icon.png',
                        shadowUrl: 'assets/images/marker-shadow.png'
                      })
                    }
                  ).on('click', () => {
                    this.service.getAll('administrativeMap?f_date=' + this.senddata.f_date + '&date=' + this.senddata.date + '&loc=' + this.senddata.loc + '&org=' + this.senddata.org + '&org=' + proj.project_id).subscribe(data => {
                      console.log(data);
                      console.log(data.pa.length);
                    });
                  });
                  this.markers.push(newMarker);
                  data.push(newMarker);
                }
                this.markerClusterData = data;
              }
            } else {
              this.options = {
                layers: [this.LAYER_OSM],
                zoom: 8,
                center: latLng(this.actualubicacion.y, this.actualubicacion.x)
              };
              if (infoadmidiv.projects.length > 0) {
                let valsum: number = this.actualubicacion.x;
                for (let proj of infoadmidiv.projects) {
                  this.presupuestototal = this.presupuestototal + proj.project.cost;
                  // if(proj == admdiv.projects[0]){
                  let newMarker = marker(
                    [this.actualubicacion.y, this.actualubicacion.x],
                    {
                      icon: icon({
                        iconSize: [25, 41],
                        iconAnchor: [13, 41],
                        iconUrl: 'assets/images/marker-icon.png',
                        shadowUrl: 'assets/images/marker-shadow.png'
                      })
                    }
                  ).on('click', () => {
                    //alert(proj.project_id);
                    this.service.getById('project', proj.project_id).subscribe(item => {
                      let data = item.data;
                      this.proyectoseleccionado = data;
                      this.show_modal(data, 'mapa');
                    });
                  });
                  this.markers.push(newMarker);
                  data.push(newMarker);
                }
                this.markerClusterData = data;
              } else {
                console.log('NO SE DIBUJAN MARKERS');
              }
            }
          } else if (this.actualubicacion.parent_id != null) {
            this.options = {
              layers: [
                tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'}),
              ],
              zoom: 10
              ,
              center: latLng(this.actualubicacion.y, this.actualubicacion.x)
            };

            if (infoadmidiv.projects.length > 0) {
              let valsum: number = this.actualubicacion.y;
              for (let proj of infoadmidiv.projects) {
                this.presupuestototal = this.presupuestototal + proj.project.cost;
                // if(proj == admdiv.projects[0]){
                let newMarker = marker(
                  [this.actualubicacion.y, this.actualubicacion.x],
                  {
                    icon: icon({
                      iconSize: [25, 41],
                      iconAnchor: [13, 41],
                      iconUrl: 'assets/images/marker-icon.png',
                      shadowUrl: 'assets/images/marker-shadow.png'
                    })
                  }
                ).on('click', () => {
                  //alert(proj.project_id);
                  this.service.getById('project', proj.project_id).subscribe(item => {
                    let data = item.data;
                    this.proyectoseleccionado = data;
                    this.show_modal(data, 'mapa');
                  });
                });
                this.markers.push(newMarker);
                data.push(newMarker);
              }
              this.markerClusterData = data;
            }
          }
        }
      });
    }
  }

//FILTRO POR CIUDAD
  filtroPorCiudad(city) {
    this.projects = [];
    this.markers = [];
    let valcit = parseInt(city);
    let index2;
    index2 = this.cities.find((cit) => cit.id === valcit);
    this.markers = [];
    if (index2 != -1) {
      this.actualubicacion = index2;
      this.presupuestototal = 0;
      let infoadmidiv: any;
      const data: any[] = [];
      this.service.getById('filtroProjectsByAdmin', this.actualubicacion.id).subscribe(admdivinfo => {
        infoadmidiv = admdivinfo;
        this.projects = admdivinfo.projects;
        this.totalprojects = this.projects.length;
        if (this.actualubicacion.y != null && this.actualubicacion.x != null) {
          this.options = {
            layers: [this.LAYER_OSM],
            zoom: 6,
            center: latLng(this.actualubicacion.y, this.actualubicacion.x)
          };
          let elid = this.actualubicacion.id;
          if (this.actualubicacion.parent_id == null) {
            if (elid == 1) {
              this.options = {
                layers: [this.LAYER_OSM],
                zoom: 6,
                center: latLng(this.actualubicacion.y, this.actualubicacion.x)
              };
              if (infoadmidiv.projects.length > 0) {
                let valsum: number = this.actualubicacion.x;
                for (let proj of infoadmidiv.projects) {
                  this.presupuestototal = this.presupuestototal + proj.project.cost;
                  let newMarker = marker(
                    [this.actualubicacion.y, this.actualubicacion.x],
                    {
                      icon: icon({
                        iconSize: [25, 41],
                        iconAnchor: [13, 41],
                        iconUrl: 'assets/images/marker-icon.png',
                        shadowUrl: 'assets/images/marker-shadow.png'
                      })
                    }
                  ).on('click', () => {
                    this.service.getById('project', proj.project_id).subscribe(item => {
                      let data = item.data;
                      this.proyectoseleccionado = data;
                      this.show_modal(data, 'mapa');
                    });
                  });
                  this.markers.push(newMarker);
                  data.push(newMarker);
                }
                this.markerClusterData = data;
              }
            } else {
              this.options = {
                layers: [this.LAYER_OSM],
                zoom: 8,
                center: latLng(this.actualubicacion.y, this.actualubicacion.x)
              };
              if (infoadmidiv.projects.length > 0) {
                let valsum: number = this.actualubicacion.x;
                for (let proj of infoadmidiv.projects) {
                  this.presupuestototal = this.presupuestototal + proj.project.cost;
                  // if(proj == admdiv.projects[0]){
                  let newMarker = marker(
                    [this.actualubicacion.y, this.actualubicacion.x],
                    {
                      icon: icon({
                        iconSize: [25, 41],
                        iconAnchor: [13, 41],
                        iconUrl: 'assets/images/marker-icon.png',
                        shadowUrl: 'assets/images/marker-shadow.png'
                      })
                    }
                  ).on('click', () => {
                    this.service.getById('project', proj.project_id).subscribe(item => {
                      let data = item.data;
                      this.proyectoseleccionado = data;
                      this.show_modal(data, 'mapa');
                    });
                  });
                  this.markers.push(newMarker);
                  data.push(newMarker);
                }
                this.markerClusterData = data;
              } else {
                console.log('NO SE DIBUJAN MARKERS');
              }
            }
          } else if (this.actualubicacion.parent_id != null) {
            this.options = {
              layers: [
                tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'}),
              ],
              zoom: 10,
              center: latLng(this.actualubicacion.y, this.actualubicacion.x)
            };

            if (infoadmidiv.projects.length > 0) {
              let valsum: number = this.actualubicacion.x;
              for (let proj of infoadmidiv.projects) {
                this.presupuestototal = this.presupuestototal + proj.project.cost;
                // if(proj == admdiv.projects[0]){
                let newMarker = marker(
                  [this.actualubicacion.y, this.actualubicacion.x],
                  {
                    icon: icon({
                      iconSize: [25, 41],
                      iconAnchor: [13, 41],
                      iconUrl: 'assets/images/marker-icon.png',
                      shadowUrl: 'assets/images/marker-shadow.png'
                    })
                  }
                ).on('click', () => {
                  this.service.getById('project', proj.project_id).subscribe(item => {
                    let data = item.data;
                    this.proyectoseleccionado = data;
                    this.show_modal(data, 'mapa');
                  });
                });
                this.markers.push(newMarker);
                data.push(newMarker);
              }
              this.markerClusterData = data;
            }
          }
        }
      });
    }
  }

  actualizarDatos() {
    for (let proj of this.projects) {
      this.presupuestototal = this.presupuestototal + proj.cost;
    }
  }

  filtroPorFecha() {
    this.markers = [];
    const dataCluster: any[] = [];
    let $info = new Date();
    let $filter = 'dateFrom';
    this.service.getByIdMap('ProjectsByFilterMap', $info, $filter).subscribe(items => {

      this.projects = items;
      if (this.projects > 0) {
        this.options = {
          layers: [this.LAYER_OSM],
          zoom: 6,
          center: latLng(4.624335, -74.063644)
        };
      }
      for (let project of this.projects) {
        for (let divadmin of project.admins) {
          if (divadmin.admin_division != null) {
            if (divadmin.admin_division.lat != null && divadmin.admin_division.lng != null) {
              let newMarker = marker(
                [divadmin.admin_division.lat, divadmin.admin_division.lng],
                {
                  icon: icon({
                    iconSize: [25, 41],
                    iconAnchor: [13, 41],
                    iconUrl: 'assets/images/marker-icon.png',
                    shadowUrl: 'assets/images/marker-shadow.png'
                  })
                }
              ).on('click', () => {
                this.service.getById('project', project.id).subscribe(item => {
                  let data = item.data;
                  this.proyectoseleccionado = data;
                  this.show_modal(data, 'mapa');
                });
              });
              this.markers.push(newMarker);
              dataCluster.push(newMarker);
            }
          }
        }
      }
      this.markerClusterData = dataCluster;
    });
  }
}
