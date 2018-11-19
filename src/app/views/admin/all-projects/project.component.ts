import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {Service} from '../../../services/service.module';
import {Project} from '../../../models/project';
import {Organizations} from '../../../models/organizations';
import {Contacts} from '../../../models/contacts';
import {Contact} from '../../../models/contact-groups';

import {Types} from '../../../models/organization-types';

import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BlockUI, NgBlockUI} from 'ng-block-ui';

@Component({
  selector: 'app-forms',
  templateUrl: './project.component.html',
})
export class ProjectComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  item: Project;
  type: Types;
  contactsgroups: Contact;
  organizationitem: Organizations;
  newcontact: Contacts;
  dataorganizationnew: any[];
  ejecutora = 'ejecutora';
  implementadora = 'implementadora';
  donante = 'donante';
  valaddorganization: number;

  isCollapsed: boolean = true;
  organizations: any = [];
  project_benef: any;
  step: number;
  regions: any;
  contacts: any;
  tags: any;
  shorttags1: any;
  shorttags2: any;
  shorttags3: any;
  shorttags4: any;
  tagschildrenscluster: any;
  mainClusterTag: any;
  tag_active = {id: '', name: '', childrens: [], tab: '', type: 1};
  entity = 'project';
  entityneworganization = 'organization';
  entity_api = 'organizations';
  entity_contacts = 'contacts';

  form: FormGroup;
  submitted = false;
  collapsedSelected: number;
  count = 0;

  constructor(private http: Http, private service: Service, private router: Router,
              private route: ActivatedRoute,
              public cdr: ChangeDetectorRef,
              private formBuilder: FormBuilder
  ) {
    this.item = new Project();
    this.organizationitem = new Organizations();
    this.newcontact = new Contacts();
    this.form = this.formBuilder.group({
      code: ['', Validators.required],
      span: ['', Validators.required], //duracion meses
      date_start: ['', Validators.required],
      date_end: ['', Validators.required],
      organization: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      contact: ['', Validators.required],
      implementers: ['', Validators.required]
    });
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.blockUI.start('Cargando información...');

        this.service.getAll('types').subscribe(data => {
          this.type = data;
        });

        this.service.getAll('contact').subscribe(data => {
          this.contactsgroups = data;
        });

        this.service.getById(this.entity, id).subscribe(item => {
          this.step = 4;
          this.collapsedSelected = 1;
          let data = item.data;
          this.item.id = data.id;
          this.item.code = data.code;
          this.item.span = data.span;
          this.item.name = data.name;
          this.item.hrp = data.hrp;
          this.item.contact = data.contact;
          this.item.date_start = data.date_start;
          this.item.date_end = data.date_end;
          this.item.organization = data.organization;
          this.item.description = data.description;
          this.item.documents = data.documents;
          this.item.interagency = data.interagency == 1 ? true : false;
          this.service.getRequest('getAllRegions', null).subscribe(res => {
            this.regions = res;
            for (let r of this.regions) {
              let childrens = r['childrens'];
              for (let c of childrens) {
                for (let s of data.location) {
                  if (s.admin_id == c.id)
                    c.selected = true;
                }
              }
              this.checkMain2(r, 'childrens');
            }
          });

          this.service.getRequest('project_short_tags', this.item.id).subscribe(pshorttags => {
            pshorttags.forEach((t, i) => {
              switch (t.tab) {
                case 1:
                  this.item.shorttags1[t.id] = [];
                  this.tag_active = {id: '', name: '', childrens: [], tab: '', type: 1};
                  this.tag_active.id = t.id;
                  this.tag_active.name = t.name;
                  this.tag_active.type = t.type;
                  this.recursive_childrens(t);
                  this.shorttags1.push(this.tag_active);
                  for (let ta of this.tag_active.childrens) {
                    for (let ts of data.shorttags) {
                      if (ta.id == ts.tag_id) {
                        if (t.type == 2) {
                          this.item.shorttags1[t.id].push(ta.id);
                        } else {
                          this.item.shorttags1[t.id] = ta.id;
                        }
                      }
                    }
                  }
                  break;
                case 2:
                  this.item.shorttags2[t.id] = [];
                  this.tag_active = {id: '', name: '', childrens: [], tab: '', type: 1};
                  this.tag_active.id = t.id;
                  this.tag_active.name = t.name;
                  this.tag_active.type = t.type;
                  this.recursive_childrens(t);
                  this.shorttags2.push(this.tag_active);
                  for (let ta of this.tag_active.childrens) {
                    for (let ts of data.shorttags)
                      if (ta.id == ts.tag_id) {
                        if (t.type == 2) {
                          this.item.shorttags2[t.id].push(ta.id);
                        } else {
                          this.item.shorttags2[t.id] = ta.id;
                        }
                      }
                  }
                  break;
                case 3:
                  this.item.shorttags3[t.id] = [];
                  this.tag_active = {id: '', name: '', childrens: [], tab: '', type: 1}; //anterior
                  this.tag_active.id = t.id;
                  this.tag_active.name = t.name;
                  this.tag_active.type = t.type;
                  this.recursive_childrens(t);
                  this.shorttags3.push(this.tag_active);
                  for (let ta of this.tag_active.childrens) {
                    for (let ts of data.shorttags)
                      if (ta.id == ts.tag_id) {
                        if (t.type == 2) {
                          this.item.shorttags3[t.id].push(ta.id);
                        } else {
                          this.item.shorttags3[t.id] = ta.id;
                        }
                      }
                  }
                  break;
                case 4:
                  this.item.shorttags4[t.id] = [];
                  this.tag_active = {id: '', name: '', childrens: [], tab: '', type: 1}; //anterior
                  this.tag_active.id = t.id;
                  this.tag_active.name = t.name;
                  this.tag_active.type = t.type;
                  this.recursive_childrens(t);
                  this.shorttags4.push(this.tag_active);
                  for (let ta of this.tag_active.childrens) {
                    for (let ts of data.shorttags)
                      if (ta.id == ts.tag_id) {
                        if (t.type == 2) {
                          this.item.shorttags4[t.id].push(ta.id);
                        } else {
                          this.item.shorttags4[t.id] = ta.id;
                        }
                      }
                  }
                  break;
              }
            });
          });

          this.service.getRequest('project_tags', this.item.id).subscribe(ptags => {
            ptags.forEach((t, i) => {
              if (t.id == 2) {
                this.tagschildrenscluster = t.childrens;
                for (let child of this.tagschildrenscluster) {
                  if (child.projectprojecttags.length > 0) {
                    child.selected = true;
                    if (child.projectprojecttags[0].main == 1) {
                      this.mainClusterTag = child.id;
                    }
                    child.budget = child.projectprojecttags[0].budget;
                  } else {
                    child.selected = false;
                    child.budget = 0;
                  }
                }
              } else {
                this.item.tags[t.id] = [];
                this.tag_active = {id: '', name: '', childrens: [], tab: '', type: 1}; //anterior
                this.tag_active.id = t.id;
                this.tag_active.name = t.name;
                this.recursive_childrens(t);
                this.tags.push(this.tag_active);
                for (let ta of this.tag_active.childrens) {
                  for (let ts of data.tags)
                    if (ta.id == ts.tag_id) {
                      this.item.tags[t.id].push(ta.id);
                    }
                }
              }
            });
          });

          if (data.implementers.length > 0) {
            this.item.implementers = [];
            for (let d of data.implementers)
              this.item.implementers.push(d.organization_id);
          }
          if (data.budget.length > 0) {
            this.item.budget = [];
            for (let d of data.budget)
              this.item.budget.push({id: d.budget_id, value: d.budget});
          }
          if (data.donors.length > 0) {
            this.item.donors = [];
            for (let d of data.donors)
              this.item.donors.push({id: d.organization_id, value: d.value});
          }
          if (data.beneficiaries_organizations.length > 0) {
            this.item.beneficiaries.organizations = [];
            for (let d of data.beneficiaries_organizations)
              this.item.beneficiaries.organizations.push(d.organization_id);
          }
          this.item.beneficiaries.poblacionales.benef = {};
          this.service.getRequest('project_beneficiaries_groups', null).subscribe(data => {
            this.project_benef = data;
          });
          if (data.beneficiaries.length > 0) {
            for (let b of data.beneficiaries) {
              //Poblacionales
              if (b.group_id != null) {
                this.item.beneficiaries.poblacionales.benef[b.group_id] = b.number;
              }
              else if (b.group_id == null && b.gender == null && b.age == null && b.type == '1')
                this.item.beneficiaries.poblacionales.total = b.number;
              else if (b.group_id == null && b.gender == 'm' && b.age == null && b.type == '1')
                this.item.beneficiaries.poblacionales.gender.m.total = b.number;
              else if (b.group_id == null && b.gender == 'm' && b.age == '1' && b.type == '1')
                this.item.beneficiaries.poblacionales.gender.m.age1 = b.number;
              else if (b.group_id == null && b.gender == 'm' && b.age == '2' && b.type == '1')
                this.item.beneficiaries.poblacionales.gender.m.age2 = b.number;
              else if (b.group_id == null && b.gender == 'm' && b.age == '3' && b.type == '1')
                this.item.beneficiaries.poblacionales.gender.m.age3 = b.number;
              else if (b.group_id == null && b.gender == 'm' && b.age == '4' && b.type == '1')
                this.item.beneficiaries.poblacionales.gender.m.age4 = b.number;
              else if (b.group_id == null && b.gender == 'h' && b.age == null && b.type == '1')
                this.item.beneficiaries.poblacionales.gender.h.total = b.number;
              else if (b.group_id == null && b.gender == 'h' && b.age == '1' && b.type == '1')
                this.item.beneficiaries.poblacionales.gender.h.age1 = b.number;
              else if (b.group_id == null && b.gender == 'h' && b.age == '2' && b.type == '1')
                this.item.beneficiaries.poblacionales.gender.h.age2 = b.number;
              else if (b.group_id == null && b.gender == 'h' && b.age == '3' && b.type == '1')
                this.item.beneficiaries.poblacionales.gender.h.age3 = b.number;
              else if (b.group_id == null && b.gender == 'h' && b.age == '4' && b.type == '1')
                this.item.beneficiaries.poblacionales.gender.h.age4 = b.number;
              //Indirectos
              else if (b.group_id == null && b.gender == null && b.age == null && b.type == '2')
                this.item.beneficiaries.indirectos.total = b.number;
              else if (b.group_id == null && b.gender == 'm' && b.age == null && b.type == '2')
                this.item.beneficiaries.indirectos.gender.m.total = b.number;
              else if (b.group_id == null && b.gender == 'm' && b.age == '1' && b.type == '2')
                this.item.beneficiaries.indirectos.gender.m.age1 = b.number;
              else if (b.group_id == null && b.gender == 'm' && b.age == '2' && b.type == '2')
                this.item.beneficiaries.indirectos.gender.m.age2 = b.number;
              else if (b.group_id == null && b.gender == 'm' && b.age == '3' && b.type == '2')
                this.item.beneficiaries.indirectos.gender.m.age3 = b.number;
              else if (b.group_id == null && b.gender == 'm' && b.age == '4' && b.type == '2')
                this.item.beneficiaries.indirectos.gender.m.age4 = b.number;
              else if (b.group_id == null && b.gender == 'h' && b.age == null && b.type == '2')
                this.item.beneficiaries.indirectos.gender.h.total = b.number;
              else if (b.group_id == null && b.gender == 'h' && b.age == '1' && b.type == '2')
                this.item.beneficiaries.indirectos.gender.h.age1 = b.number;
              else if (b.group_id == null && b.gender == 'h' && b.age == '2' && b.type == '2')
                this.item.beneficiaries.indirectos.gender.h.age2 = b.number;
              else if (b.group_id == null && b.gender == 'h' && b.age == '3' && b.type == '2')
                this.item.beneficiaries.indirectos.gender.h.age3 = b.number;
              else if (b.group_id == null && b.gender == 'h' && b.age == '4' && b.type == '2')
                this.item.beneficiaries.indirectos.gender.h.age4 = b.number;
            }
            console.log(this.item.beneficiaries.poblacionales.benef);
          }
          this.item.national = (data.location.length == 1 && data.location[0].admin_id == 0) ? '1' : '0';
          this.blockUI.stop();
        });
      } else {
        this.service.getAll('types').subscribe(data => {
          this.type = data;
        });
        this.service.getRequest('getAllRegions', null).subscribe(data => {
          this.regions = data;
        });
        this.service.getRequest('project_tags').subscribe(ptags => {
          ptags.forEach((t, i) => {
            if (t.id == 2) {
              this.tagschildrenscluster = t.childrens;
              for (let child of this.tagschildrenscluster) {
                child.selected = false;
                child.budget = 0;
              }
            } else {
              this.item.tags[t.id] = [];
              this.tag_active = {id: '', name: '', childrens: [], tab: '', type: 1}; //anterior
              this.tag_active.id = t.id;
              this.tag_active.name = t.name;
              this.recursive_childrens(t);
              this.tags.push(this.tag_active);
            }
          });
        });
        this.service.getRequest('project_short_tags').subscribe(pshorttags => {
          pshorttags.forEach((t, i) => {
            switch (t.tab) {
              case 1:
                this.item.shorttags1[t.id] = [];
                this.tag_active = {id: '', name: '', childrens: [], tab: '', type: 1};
                this.tag_active.id = t.id;
                this.tag_active.name = t.name;
                this.tag_active.type = t.type;
                this.recursive_childrens(t);
                this.shorttags1.push(this.tag_active);
                break;
              case 2:
                this.item.shorttags2[t.id] = [];
                this.tag_active = {id: '', name: '', childrens: [], tab: '', type: 1};
                this.tag_active.id = t.id;
                this.tag_active.name = t.name;
                this.tag_active.type = t.type;
                this.recursive_childrens(t);
                this.shorttags2.push(this.tag_active);
                break;
              case 3:
                this.item.shorttags3[t.id] = [];
                this.tag_active = {id: '', name: '', childrens: [], tab: '', type: 1}; //anterior
                this.tag_active.id = t.id;
                this.tag_active.name = t.name;
                this.tag_active.type = t.type;
                this.recursive_childrens(t);
                this.shorttags3.push(this.tag_active);
                break;
              case 4:
                this.item.shorttags4[t.id] = [];
                this.tag_active = {id: '', name: '', childrens: [], tab: '', type: 1}; //anterior
                this.tag_active.id = t.id;
                this.tag_active.name = t.name;
                this.tag_active.type = t.type;
                this.recursive_childrens(t);
                this.shorttags4.push(this.tag_active);
                break;
            }
          });
        });
      }
    });
    this.collapsedSelected = 1;
    this.step = 1;
    this.count = 0;
  }

  ngOnInit() {
    this.tags = [];
    this.shorttags1 = [];
    this.shorttags2 = [];
    this.shorttags3 = [];
    this.shorttags4 = [];
    this.service.getAll('organizations').subscribe(data => this.organizations = data);
    this.service.getRequest('contacts', null).subscribe(data => this.contacts = data);
  }

  recursive_childrens($item) {
    if ($item.childrens.length > 0) {
      for (let $c of $item.childrens)
        $c = this.recursive_childrens($c);
    } else
      this.tag_active.childrens.push({id: $item.id, name: $item.name});
    return $item;
  }


  addP() {
    let valdatestart = new Date(this.item.date_start);
    let valdateend = new Date(this.item.date_end);
    let difyear = this.diff_years(valdatestart, valdateend) + 1;
    let size = this.item.budget.length;
    let newsize = size - 1;
    if (newsize <= difyear) {
      this.item.budget.push({value: ''});
    }
  }

  diff_years(dt2, dt1) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60 * 24);
    return Math.abs(Math.round(diff / 365.25));
  }

  removeP() {
    if (this.item.budget.length > 2)
      this.item.budget.pop();
  }

  addD() {
    this.item.donors.push({id: '', value: ''});
  }

  removeD() {
    if (this.item.donors.length > 1)
      this.item.donors.pop();
  }

  showMpos(dpto) {
    dpto.show = dpto.show ? !dpto.show : true;
  }

  checkAll(element, childrens, value) {
    let data = element[childrens];
    for (let se of data)
      se.selected = value;
  }

  checkMain(_this, parent, childrens, value) {
    _this.selected = value;
    let checkMain = true;
    for (let c of parent[childrens])
      if (!c.select) {
        checkMain = false;
        break;
      }
    parent.selected = checkMain;
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

  getItemsSelected(parents, childrens) {
    let items = [];
    for (let p of parents) {
      for (let c of p[childrens])
        if (c.selected)
          items.push(c.id);
    }
    return items;
  }

  saveShortTags() {
    this.service.saveOrUpdate('project_short_tags_rel', {
      project_id: this.item.id,
      shorttags1: this.item.shorttags1,
      shorttags2: this.item.shorttags2,
      shorttags3: this.item.shorttags3,
      shorttags4: this.item.shorttags4,
    }).subscribe(data => {
    });
  }

  step1(form) {
    if (!form.valid) {
      Object.keys(form.controls).forEach(field => { // {1}
        const control = form.get(field);            // {2}
        control.markAsTouched({onlySelf: true});  // {3}
      });
      Swal({
        position: 'top-end',
        type: 'error',
        title: 'Complete los campos requeridos',
        showConfirmButton: false,
        timer: 1500
      });
      return false;
    }
    if (this.item.national == '1')
      this.item.location = [0];
    else
      this.item.location = this.getItemsSelected(this.regions, 'childrens');
    this.blockUI.start('');
    this.service.saveOrUpdate(this.entity, this.item).subscribe(data => {
      this.blockUI.stop();
      if (data.status) {
        this.item.id = data.data.id;
        this.step = 2;
        this.collapsedSelected = 2;
        this.isCollapsed = true;
        this.saveShortTags();
        Swal({
          position: 'top-end',
          type: 'success',
          title: 'Guardado exitoso',
          showConfirmButton: false,
          timer: 1500
        });
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

  savePresu() {
    this.blockUI.start('');
    this.service.saveOrUpdate(this.entity, this.item).subscribe(data => {
      this.saveShortTags();
      this.blockUI.stop();
      if (data.status) {
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

  saveClasif() {
    this.blockUI.start('');
    this.service.saveOrUpdate('project_tags_rel', {
      project_id: this.item.id,
      tags: this.item.tags,
      mainClusterTag: this.mainClusterTag,
      clusterTags: this.tagschildrenscluster
    }).subscribe(data => {
      this.saveShortTags();
      this.blockUI.stop();
      if (data.status) {
        this.step = 4;
        this.collapsedSelected = 4;
        this.isCollapsed = true;
        Swal({
          position: 'top-end',
          type: 'success',
          title: 'Guardado exitoso',
          showConfirmButton: false,
          timer: 1500
        });
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

  saveBenef(redirect = false) {
    this.blockUI.start('');
    this.service.postRequest('step3/' + this.item.id, this.item.beneficiaries).then(data => {
      this.saveShortTags();
      this.blockUI.stop();
      if (data) {
        this.step = 4;
        this.collapsedSelected = 4;
        this.isCollapsed = true;
        Swal({
          position: 'top-end',
          type: 'success',
          title: 'Guardado exitoso',
          showConfirmButton: false,
          timer: 1500
        });
        if (redirect)
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

  updateNacional(value) {
    this.item.national = value;
  }

  mujerValue(total = false) {
    if (total)
      this.item.beneficiaries.poblacionales.total = (this.item.beneficiaries.poblacionales.gender.h.total | 0) + (this.item.beneficiaries.poblacionales.gender.m.total | 0);
    else {
      this.item.beneficiaries.poblacionales.gender.m.total = (this.item.beneficiaries.poblacionales.gender.m.age1 | 0) + (this.item.beneficiaries.poblacionales.gender.m.age2 | 0) + (this.item.beneficiaries.poblacionales.gender.m.age3 | 0) + (this.item.beneficiaries.poblacionales.gender.m.age4 | 0);
      this.item.beneficiaries.poblacionales.total = (this.item.beneficiaries.poblacionales.gender.h.total | 0) + (this.item.beneficiaries.poblacionales.gender.m.total | 0);
    }
  }

  hombreValue(total = false) {
    if (total)
      this.item.beneficiaries.poblacionales.total = (this.item.beneficiaries.poblacionales.gender.h.total | 0) + (this.item.beneficiaries.poblacionales.gender.m.total | 0);
    else {
      this.item.beneficiaries.poblacionales.gender.h.total = (this.item.beneficiaries.poblacionales.gender.h.age1 | 0) + (this.item.beneficiaries.poblacionales.gender.h.age2 | 0) + (this.item.beneficiaries.poblacionales.gender.h.age3 | 0) + (this.item.beneficiaries.poblacionales.gender.h.age4 | 0);
      this.item.beneficiaries.poblacionales.total = (this.item.beneficiaries.poblacionales.gender.h.total | 0) + (this.item.beneficiaries.poblacionales.gender.m.total | 0);
    }
  }

  _mujerValue(total = false) {
    if (total)
      this.item.beneficiaries.indirectos.total = (this.item.beneficiaries.indirectos.gender.h.total | 0) + (this.item.beneficiaries.indirectos.gender.m.total | 0);
    else {
      this.item.beneficiaries.indirectos.gender.m.total = (this.item.beneficiaries.indirectos.gender.m.age1 | 0) + (this.item.beneficiaries.indirectos.gender.m.age2 | 0) + (this.item.beneficiaries.indirectos.gender.m.age3 | 0) + (this.item.beneficiaries.indirectos.gender.m.age4 | 0);
      this.item.beneficiaries.indirectos.total = (this.item.beneficiaries.indirectos.gender.h.total | 0) + (this.item.beneficiaries.indirectos.gender.m.total | 0);
    }
  }

  _hombreValue(total = false) {
    if (total)
      this.item.beneficiaries.indirectos.total = (this.item.beneficiaries.indirectos.gender.h.total | 0) + (this.item.beneficiaries.indirectos.gender.m.total | 0);
    else {
      this.item.beneficiaries.indirectos.gender.h.total = (this.item.beneficiaries.indirectos.gender.h.age1 | 0) + (this.item.beneficiaries.indirectos.gender.h.age2 | 0) + (this.item.beneficiaries.indirectos.gender.h.age3 | 0) + (this.item.beneficiaries.indirectos.gender.h.age4 | 0);
      this.item.beneficiaries.indirectos.total = (this.item.beneficiaries.indirectos.gender.h.total | 0) + (this.item.beneficiaries.indirectos.gender.m.total | 0);
    }
  }

  changeStatusCollapse(position) {
    if (position <= this.step) {
      this.isCollapsed = position == this.collapsedSelected && this.isCollapsed ? false : true;
      this.collapsedSelected = position;
    }
  }


  //MODAL

  show_modal(value) {
    this.valaddorganization = value;
    document.getElementById('btn-show-modal').click();
  }

  saveOrUpdate() {
    let finddata: any;
    this.service.saveOrUpdate(this.entity_api, this.organizationitem).subscribe(data => {
      if (data) {
        finddata = data;
        Swal({
          position: 'top-end',
          type: 'success',
          title: 'Guardado exitoso',
          showConfirmButton: false,
          timer: 1500
        });
        this.organizationitem = data.data.id;
        document.getElementById('close-modal').click();
        this.syncorganizations(this.valaddorganization);
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

  syncorganizations(tipoorganization) {
    this.blockUI.start('');
    if (tipoorganization == 1 || tipoorganization == 2 || tipoorganization == 3 || tipoorganization == 5) {
      this.service.getAll('organizations').subscribe((organizations) => {
        this.organizations = organizations;
        let index = this.organizations.find(org => org.id === this.organizationitem);
        if (tipoorganization == 1) {
          this.item.organization = index.id;
          this.organizationitem = new Organizations();
        } else if (tipoorganization == 2) {
          this.item.implementers.push(index.id);
          this.organizationitem = new Organizations();
        } else if (tipoorganization == 3) {
          this.organizationitem = new Organizations();
        } else if (tipoorganization == 5) {
          this.item.beneficiaries.organizations.push(index.id);
          this.organizationitem = new Organizations();
        }
        this.blockUI.stop();
      });
    } else if (tipoorganization == 4) {
      let tipocontacto = tipoorganization;
      this.service.getAll('contacts').subscribe((contacts) => {
        this.contacts = contacts;
        let indexcontact = this.contacts.find(cont => cont.id === this.newcontact);
        if (tipocontacto == 4) {
          this.item.contact = indexcontact.id;
          this.newcontact = new Contacts();
        }
        this.blockUI.stop();
      });
    }
  }

  show_modalContact(value) {
    this.valaddorganization = value;
    document.getElementById('btn-show-modalContact').click();
  }

  saveContact() {
    this.service.saveOrUpdate(this.entity_contacts, this.newcontact).subscribe(data => {
      if (data) {
        Swal({
          position: 'top-end',
          type: 'success',
          title: 'Guardado exitoso',
          showConfirmButton: false,
          timer: 1500
        });
        this.newcontact = data.data.id;
        document.getElementById('close-modalContact').click();
        this.syncorganizations(this.valaddorganization);
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
