import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { Service } from '../../../services/service.module';
import { Project } from '../../../models/project'
import Swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-forms',
  templateUrl: './project.component.html',
})
export class ProjectComponent implements OnInit{
  item: Project;
  isCollapsed: boolean = true;
  organizations: any;
  step: number;
  regions:any;

  amazonasCheck = false;
  antioquiaCheck = false;
  entity = "project";

  collapsedSelected: number;
  total:any;
  hombresTotal:any;
  mujeresTotal:any;
  mujer05:number;
  mujer617:number;
  mujer1864:number;
  mujer65:number;
  hombre05:number;
  hombre617:number;
  hombre1864:number;
  hombre65:number;
  //segundo card
  _total:any;
  _hombresTotal:any;
  _mujeresTotal:any;
  _mujer05:number;
  _mujer617:number;
  _mujer1864:number;
  _mujer65:number;
  _hombre05:number;
  _hombre617:number;
  _hombre1864:number;
  _hombre65:number;
  count = 0;

  constructor(private http: Http, private service: Service, private router: Router,
              private route: ActivatedRoute ) {
    this.item = new Project();
    /*this.route.params.subscribe( params => {
        this.id = params['id'];
        if ( this.id !== 'nuevo' ) {
          this.service.getById( this.entity_api, this.id ).subscribe( item => this.item = item.data ); }
    });*/
    this.collapsedSelected = 1;
    this.step = 1;
    this.mujeresTotal= ''
    this.hombresTotal= ''
    this.total=''
    this._mujeresTotal= ''
    this._hombresTotal= ''
    this._total=''
    this.count = 0;
  }

  ngOnInit() {
    this.service.getAll("organizations").subscribe(data => this.organizations = data);
    this.service.getRequest("getAllRegions").subscribe(data => this.regions = data);
  }

  addP(){
    this.item.budget.push({value: ''});
  }

  removeP(){
    if(this.item.budget.length > 1)
      this.item.budget.pop();
  }

  addD(){
    this.item.donors.push({id: '', value: ''});
  }

  removeD(){
    if(this.item.donors.length > 1)
      this.item.donors.pop();
  }

  showMpos(dpto){
    dpto.show = dpto.show ? !dpto.show : true;
  }

  checkAll(element, childrens, value){
    let data = element[childrens];
    for(let se of data)
      se.selected = value;
  }

  checkMain(_this, parent, childrens, value){
    _this.selected = value;
    let checkMain = true;
    for(let c of parent[childrens])
      if(!c.select){
        checkMain = false;
        break;
      }
    parent.selected = checkMain;
  }

  getItemsSelected(parents, childrens){
    let items = [];
    for(let p of parents){
      for(let c of p[childrens])
        if(c.selected)
          items.push(c.id)
    }
    return items;
  }

  step1(){
    if(this.item.national)
      this.item.location = [0]
    else
      this.item.location = this.getItemsSelected(this.regions, 'childrens');

    this.service.saveOrUpdate(this.entity, this.item).subscribe(data => {
      console.log(data);
    });
  }




  checkAll2(checked){
      $('.check2').prop('checked',checked);
  }

  unCheckAll2(){
    $('.checkall2').prop('checked',false);
  }

  addItem(){
    let html = '<div class="col-md-6 donantesadd' + this.count + '"><div class="form-group">';
    html += '<select class="form-control"><option>Donante</option><option>Asociación Nacional de Ayuda Solidaria</option>';
    html += '<option>Apoyo A Victimas de la Violencia Socio Política Pro Recuperación Emocional</option>';
    html += '<option>Centro Cristiano para la Justicia, La Paz y La Acción No Violenta</option></select>';
    html += '</div></div><div class="col-md-6 donantesadd' + (this.count++) + '"><div class="form-group">';
    html += '<input type="text" class="form-control" placeholder="Aportes U$"></div></div>';
    $('.donantes').append(html);
  }

  removeItem(){
    $('.donantesadd' + (this.count - 1)).remove();
    this.count--;
  }

  updateNacional(value){
    this.item.national = value == "1" ? true : false;
  }

  mujerValue(){
    this.mujeresTotal = (this.mujer05 | 0) + (this.mujer617 | 0) + (this.mujer1864 | 0) + (this.mujer65 | 0)
    this.total = (this.hombresTotal | 0) + (this.mujeresTotal | 0)
  }

  hombreValue(){
    this.hombresTotal = (this.hombre05 | 0) + (this.hombre617 | 0) + (this.hombre1864 | 0) + (this.hombre65 | 0)
    this.total = (this.hombresTotal | 0) + (this.mujeresTotal | 0)
  }

  _mujerValue(){
    this._mujeresTotal = (this._mujer05 | 0) + (this._mujer617 | 0) + (this._mujer1864 | 0) + (this._mujer65 | 0)
    this._total = (this._hombresTotal | 0) + (this._mujeresTotal | 0)
  }

  _hombreValue(){
    this._hombresTotal = (this._hombre05 | 0) + (this._hombre617 | 0) + (this._hombre1864 | 0) + (this._hombre65 | 0)
    this._total = (this._hombresTotal | 0) + (this._mujeresTotal | 0)
  }

  changeStatusCollapse(position){
    if(position <= this.step){
      this.isCollapsed = position == this.collapsedSelected && this.isCollapsed ? false : true;
      this.collapsedSelected = position;
    }
  }

  save() {
    this.service.saveOrUpdate("", this.item).subscribe(data => {
      if (data) {
        Swal({
          position: 'top-end',
          type: 'success',
          title: 'Guardado exitoso',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/admin/all-projects']);
      } else {
        Swal({
          position: 'top-end',
          type: 'error',
          title: 'Error al guardar',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }
}
