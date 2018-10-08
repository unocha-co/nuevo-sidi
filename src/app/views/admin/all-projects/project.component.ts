import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { Service } from '../../../services/service.module';
import { Project } from '../../../models/project'
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-forms',
  templateUrl: './project.component.html',
})
export class ProjectComponent implements OnInit{
  @BlockUI() blockUI: NgBlockUI;
  item: Project;
  isCollapsed: boolean = true;
  organizations: any;
  step: number;
  regions:any;
  contacts:any;
  hrps:any;
  tags:any;
  tag_active = {id:'', name:'', childrens: []};
  entity = "project";
  form: FormGroup;
  submitted = false;
  collapsedSelected: number;  
  count = 0;

  constructor(private http: Http, private service: Service, private router: Router,
              private route: ActivatedRoute, public cdr: ChangeDetectorRef, private formBuilder: FormBuilder) {
    this.item = new Project();
    this.form = this.formBuilder.group({
        name: ['', Validators.required],
        hrp: ['', Validators.required],
        contactId: ['', [Validators.required, Validators.email]]
    });
    this.route.params.subscribe( params => {
        let id = params['id'];
        if (id) {
          this.blockUI.start('Cargando información...');
          this.service.getById(this.entity, id).subscribe( item => {
            this.step = 3;
            this.collapsedSelected = 1; 
            let data = item.data;
            this.item.id = data.id;
            this.item.code = data.code;
            this.item.cost = data.cost;
            this.item.name = data.name;
            this.item.hrp = data.hrp;
            this.item.contact = data.contact;
            this.item.date_start = data.date_start;
            this.item.date_end = data.date_end;
            this.item.organization = data.organization;
            this.item.description = data.description;
            this.item.interagency = data.interagency == 1 ? true : false;
            this.service.getRequest("getAllRegions").subscribe(res => {
              this.regions = res;
              for(let r of this.regions){
                let childrens = r['childrens'];
                for(let c of childrens){
                  for(let s of data.location){
                    if(s.admin_id == c.id)
                      c.selected = true;
                  }
                }
                this.checkMain2(r, 'childrens');
              }
            });
            this.service.getRequest("project_tags").subscribe(ptags => {
              for(let t of ptags){
                this.item.tags[t.id] = []
                this.tag_active = {id:'', name:'', childrens: []};
                this.tag_active.id = t.id;
                this.tag_active.name = t.name;
                this.recursive_childrens(t);
                this.tags.push(this.tag_active);
                for(let ta of this.tag_active.childrens){
                  for(let ts of data.tags)
                    if(ta.id == ts.tag_id)
                      this.item.tags[t.id].push(ta.id);
                }
              }
            });
            if(data.implementers.length > 0){
              this.item.implementers = [];
              for(let d of data.implementers)
                this.item.implementers.push(d.organization_id);
            }
            if(data.budget.length > 0){
              this.item.budget = [];
              for(let d of data.budget)
                this.item.budget.push({id:d.budget_id, value:d.budget});
            }
            if(data.donors.length > 0){
              this.item.donors = [];
              for(let d of data.donors)
                this.item.donors.push({id:d.organization_id, value:d.value});
            }
            if(data.beneficiaries_organizations.length > 0){
              this.item.beneficiaries.organizations = [];
              for(let d of data.beneficiaries_organizations)
                this.item.beneficiaries.organizations.push(d.organization_id)
            }
            if(data.beneficiaries.length > 0){
              for(let b of data.beneficiaries){
                //Poblacionales
                if(b.group_id == null && b.gender == null && b.age == null && b.type == '1')
                  this.item.beneficiaries.poblacionales.total = b.number;
                else if(b.group_id == null && b.gender == 'm' && b.age == null && b.type == '1')
                  this.item.beneficiaries.poblacionales.gender.m.total = b.number;
                else if(b.group_id == null && b.gender == 'm' && b.age == '1' && b.type == '1')
                  this.item.beneficiaries.poblacionales.gender.m.age1 = b.number;
                else if(b.group_id == null && b.gender == 'm' && b.age == '2' && b.type == '1')
                  this.item.beneficiaries.poblacionales.gender.m.age2 = b.number;
                else if(b.group_id == null && b.gender == 'm' && b.age == '3' && b.type == '1')
                  this.item.beneficiaries.poblacionales.gender.m.age3 = b.number;
                else if(b.group_id == null && b.gender == 'm' && b.age == '4' && b.type == '1')
                  this.item.beneficiaries.poblacionales.gender.m.age4 = b.number;
                else if(b.group_id == null && b.gender == 'h' && b.age == null && b.type == '1')
                  this.item.beneficiaries.poblacionales.gender.h.total = b.number;
                else if(b.group_id == null && b.gender == 'h' && b.age == '1' && b.type == '1')
                  this.item.beneficiaries.poblacionales.gender.h.age1 = b.number;
                else if(b.group_id == null && b.gender == 'h' && b.age == '2' && b.type == '1')
                  this.item.beneficiaries.poblacionales.gender.h.age2 = b.number;
                else if(b.group_id == null && b.gender == 'h' && b.age == '3' && b.type == '1')
                  this.item.beneficiaries.poblacionales.gender.h.age3 = b.number;
                else if(b.group_id == null && b.gender == 'h' && b.age == '4' && b.type == '1')
                  this.item.beneficiaries.poblacionales.gender.h.age4 = b.number;
                
                //Indirectos
                if(b.group_id == null && b.gender == null && b.age == null && b.type == '2')
                  this.item.beneficiaries.indirectos.total = b.number;
                else if(b.group_id == null && b.gender == 'm' && b.age == null && b.type == '2')
                  this.item.beneficiaries.indirectos.gender.m.total = b.number;
                else if(b.group_id == null && b.gender == 'm' && b.age == '1' && b.type == '2')
                  this.item.beneficiaries.indirectos.gender.m.age1 = b.number;
                else if(b.group_id == null && b.gender == 'm' && b.age == '2' && b.type == '2')
                  this.item.beneficiaries.indirectos.gender.m.age2 = b.number;
                else if(b.group_id == null && b.gender == 'm' && b.age == '3' && b.type == '2')
                  this.item.beneficiaries.indirectos.gender.m.age3 = b.number;
                else if(b.group_id == null && b.gender == 'm' && b.age == '4' && b.type == '2')
                  this.item.beneficiaries.indirectos.gender.m.age4 = b.number;
                else if(b.group_id == null && b.gender == 'h' && b.age == null && b.type == '2')
                  this.item.beneficiaries.indirectos.gender.h.total = b.number;
                else if(b.group_id == null && b.gender == 'h' && b.age == '1' && b.type == '2')
                  this.item.beneficiaries.indirectos.gender.h.age1 = b.number;
                else if(b.group_id == null && b.gender == 'h' && b.age == '2' && b.type == '2')
                  this.item.beneficiaries.indirectos.gender.h.age2 = b.number;
                else if(b.group_id == null && b.gender == 'h' && b.age == '3' && b.type == '2')
                  this.item.beneficiaries.indirectos.gender.h.age3 = b.number;
                else if(b.group_id == null && b.gender == 'h' && b.age == '4' && b.type == '2')
                  this.item.beneficiaries.indirectos.gender.h.age4 = b.number;
              }
            }
            if(data.location.length == 1 && data.location[0].admin_id == 0)
              this.item.national == "1";
            else
              this.item.national = "0";
            this.blockUI.stop();
          }); 
        }else{
          this.service.getRequest("getAllRegions").subscribe(data => {
            this.regions = data;
          });
        }
    });
    this.collapsedSelected = 1;
    this.step = 1;
    this.count = 0;
  }

  ngOnInit() {
    this.tags = [];
    this.service.getAll("organizations").subscribe(data => this.organizations = data);
    this.service.getRequest("contacts").subscribe(data => this.contacts = data);
    this.service.getRequest("hrp").subscribe(data => this.hrps = data);
  }

   recursive_childrens($item){
    if($item.childrens.length > 0){
      for(let $c of $item.childrens)
        $c = this.recursive_childrens($c);
    }else
      this.tag_active.childrens.push({id:$item.id, name:$item.name})
    return $item;
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

  checkMain2(parent, childrens){
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

  step1(form){
    if (!form.valid) {
      Object.keys(form.controls).forEach(field => { // {1}
        const control = form.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });  // {3}
      });
      return false;
    }
    if(this.item.national)
      this.item.location = [0]
    else
      this.item.location = this.getItemsSelected(this.regions, 'childrens');
    this.blockUI.start('');
    this.service.saveOrUpdate(this.entity, this.item).subscribe(data => {
      this.blockUI.stop();
      if(data.status){
        this.item.id = data.data.id;
        this.step = 2;
        this.collapsedSelected = 2;
        this.isCollapsed = true;
        Swal({
          position: 'top-end',
          type: 'success',
          title: 'Guardado exitoso',
          showConfirmButton: false,
          timer: 1500
        });
      }else{
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

  step2(){
    this.blockUI.start('');
    this.service.saveOrUpdate("project_tags_rel", {project_id: this.item.id, tags: this.item.tags}).subscribe(data => {
      this.blockUI.stop();
      if(data.status){
        this.step = 3;
        this.collapsedSelected = 3;
        this.isCollapsed = true;
        Swal({
          position: 'top-end',
          type: 'success',
          title: 'Guardado exitoso',
          showConfirmButton: false,
          timer: 1500
        });
      }else{
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

  step3(redirect = false) {
    this.blockUI.start('');
    this.service.postRequest("step3/" + this.item.id, this.item.beneficiaries).then(data => {
      this.blockUI.stop();
      if (data) {
        Swal({
          position: 'top-end',
          type: 'success',
          title: 'Guardado exitoso',
          showConfirmButton: false,
          timer: 1500
        });
        if(redirect)
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

  updateNacional(value){
    this.item.national = value;
  }

  mujerValue(total = false){
    if(total)
      this.item.beneficiaries.poblacionales.total = (this.item.beneficiaries.poblacionales.gender.h.total | 0) + (this.item.beneficiaries.poblacionales.gender.m.total | 0)
    else{
      this.item.beneficiaries.poblacionales.gender.m.total = (this.item.beneficiaries.poblacionales.gender.m.age1 | 0) + (this.item.beneficiaries.poblacionales.gender.m.age2 | 0) + (this.item.beneficiaries.poblacionales.gender.m.age3 | 0) + (this.item.beneficiaries.poblacionales.gender.m.age4 | 0)
      this.item.beneficiaries.poblacionales.total = (this.item.beneficiaries.poblacionales.gender.h.total | 0) + (this.item.beneficiaries.poblacionales.gender.m.total | 0)
    }
  }

  hombreValue(total = false){
    if(total)
    this.item.beneficiaries.poblacionales.total = (this.item.beneficiaries.poblacionales.gender.h.total | 0) + (this.item.beneficiaries.poblacionales.gender.m.total | 0)
    else{
      this.item.beneficiaries.poblacionales.gender.h.total = (this.item.beneficiaries.poblacionales.gender.h.age1 | 0) + (this.item.beneficiaries.poblacionales.gender.h.age2 | 0) + (this.item.beneficiaries.poblacionales.gender.h.age3 | 0) + (this.item.beneficiaries.poblacionales.gender.h.age4 | 0)
      this.item.beneficiaries.poblacionales.total = (this.item.beneficiaries.poblacionales.gender.h.total | 0) + (this.item.beneficiaries.poblacionales.gender.m.total | 0)
    }
  }

  _mujerValue(total = false){
    if(total)
    this.item.beneficiaries.indirectos.total = (this.item.beneficiaries.indirectos.gender.h.total | 0) + (this.item.beneficiaries.indirectos.gender.m.total | 0)
    else{
      this.item.beneficiaries.indirectos.gender.m.total = (this.item.beneficiaries.indirectos.gender.m.age1 | 0) + (this.item.beneficiaries.indirectos.gender.m.age2 | 0) + (this.item.beneficiaries.indirectos.gender.m.age3 | 0) + (this.item.beneficiaries.indirectos.gender.m.age4 | 0)
      this.item.beneficiaries.indirectos.total = (this.item.beneficiaries.indirectos.gender.h.total | 0) + (this.item.beneficiaries.indirectos.gender.m.total | 0)
    }
  }

  _hombreValue(total = false){
    if(total)
    this.item.beneficiaries.indirectos.total = (this.item.beneficiaries.indirectos.gender.h.total | 0) + (this.item.beneficiaries.indirectos.gender.m.total | 0)
    else{
      this.item.beneficiaries.indirectos.gender.h.total = (this.item.beneficiaries.indirectos.gender.h.age1 | 0) + (this.item.beneficiaries.indirectos.gender.h.age2 | 0) + (this.item.beneficiaries.indirectos.gender.h.age3 | 0) + (this.item.beneficiaries.indirectos.gender.h.age4 | 0)
      this.item.beneficiaries.indirectos.total = (this.item.beneficiaries.indirectos.gender.h.total | 0) + (this.item.beneficiaries.indirectos.gender.m.total | 0)
    }
  }

  changeStatusCollapse(position){
    if(position <= this.step){
      this.isCollapsed = position == this.collapsedSelected && this.isCollapsed ? false : true;
      this.collapsedSelected = position;
    }
  }

}
