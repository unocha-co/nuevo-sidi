import {AfterContentInit, Component, OnInit} from '@angular/core';
import { Http } from '@angular/http';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Service } from '../../../services/service.module';
import { userProfile } from '../../../models/user-profiles';
import * as globals from '../../../globals';

@Component({
  selector: 'app-user-profiles',
  templateUrl: './user-profiles.component.html'
})
export class UserProfilesComponent implements AfterContentInit {
  data: any[];
  item: userProfile;
  dataTable: any;
  title = 'Perfiles de usuario';
  titles = [
    { data: 'name', title: 'Nombre'},
    { data: null,
      render: function ( data, type, row ) {
        return `<button class="btn btn-primary btn-square" type="button" id="btn-edit" data-elemnt-obj="${data.id}"><i class="fa fa-edit"></i></button>
                <button class="btn btn-danger btn-square" type="button" id="btn-delete" data-elemnt-obj="${data.id}"><i class="fa fa-trash-o">`;
      }, title: 'Acciones'}
  ]; // Columnas del datatable
  entity = 'Perfiles de usuario';
  entity_api = 'userprofiles'; // Ruta del api
  modal;

   constructor(private http: Http, private chRef: ChangeDetectorRef, private service: Service) {
    this.item = new userProfile();
  }

  ngAfterContentInit() {
    $(document).on('click', '#btn-edit', ($event) => {
      const id = ($event.currentTarget.dataset.elemntObj);
      this.service.getById(this.entity_api, id ).subscribe (data => this.show_modal(data.data));
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
    const table: any = $('.table7');
    this.dataTable = table.DataTable({
      'processing': true,
      'serverSide': true,
      'ajax': {
        'url': globals.api + '/list-userprofiles',
        'type': 'GET',
        'beforeSend': function (request) {
            request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem("id_token"));
        }
      },
      'columns': this.titles,
    });
  }

  saveOrUpdate() {
    this.service.saveOrUpdate(this.entity_api, this.item).subscribe(data => {
      if (data) {
        Swal({
          position: 'top-end',
          type: 'success',
          title: 'Guardado exitoso',
          showConfirmButton: false,
          timer: 1500
        });
        this.item = new userProfile();
        this.data = null;
        document.getElementById('close-modal').click();
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

  show_modal(item) {
    this.item = item.id == null ? new userProfile() : item;
    document.getElementById('btn-show-modal').click();
  }
}
