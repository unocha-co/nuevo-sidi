import {AfterContentInit, Component, OnInit} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Service } from '../../../services/service.module';
import { Project } from '../../../models/project';
import * as globals from '../../../globals';
import { navItems } from '../../../_nav';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html'
})
export class AllProjectsComponent implements AfterContentInit {
  public navItems = navItems;
  data: any[];
  item: Project[];
  dataTable: any;
  title = 'Proyecto'; // Titulo para contenedor de la tabla
  // Columnas del datatable
  titles = [
    { data: 'name', title: 'Nombre'},
    { data: 'date_start', title: 'Fecha de inicio'},
    { data: 'date_end', title: 'Fecha de terminación'},
    { data: 'cost', title: 'Cósto'},
    { data: null,
      render: function ( data, type, row ) {
        return `<button class="btn btn-primary btn-square" type="button" id="btn-edit-p" data-elemnt-obj="${data.id}"><i class="fa fa-edit"></i></button>
                <button class="btn btn-danger btn-square" type="button" id="btn-delete" data-elemnt-obj="${data.id}"><i class="fa fa-trash-o">`;
      }, title: 'Acciones'}
  ]; 
  entity = 'Proyectos'; // Nombre de la entidad
  entity_api = 'allprojects'; // Ruta del api
  constructor(private http: Http, private chRef: ChangeDetectorRef, private service: Service, private router: Router ) {
    console.log(window.location.pathname);
  }

  ngAfterContentInit() {
    $(document).on('click', '#btn-edit-p', ($event) => {
      const id = ($event.currentTarget.dataset.elemntObj);
      this.router.navigate(['/admin/proyectos', id]);
    });
    $(document).on('click', '#btn-delete', ($event) => {
      const id = ($event.currentTarget.dataset.elemntObj);
      this.delete(id);
      this.dataTable.ajax.reload();
    });
  }
  ngOnInit() {
    this.getData();
  }

  getData(refresh: boolean = false) {
    this.service.getAll(this.entity_api).subscribe(data => {
      this.data = data;
    });
    this.chRef.detectChanges();
    const table: any = $('.table1');
    this.dataTable = table.DataTable({
      'processing': true,
      'serverSide': true,
      'ajax': {
        'url': globals.api + '/list-allprojects',
        'type': 'GET',
        'beforeSend': function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem("id_token"));
        }
      },
      'columns': this.titles,
    });
  }
  delete(id) {
    Swal({
      title: 'Estas seguro de eliminar este elemento?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.service.delete(this.entity_api, id).subscribe(data => {
          Swal(
            (data.status == 1 ? 'Confirmación!' : 'Error'),
            (data.status == 1 ? 'El elemento ha sido eliminado.' : 'Error al eliminar'),
            (data.status == 1 ? 'success' : 'error')
          );
        });
      }
    });
  }
}
