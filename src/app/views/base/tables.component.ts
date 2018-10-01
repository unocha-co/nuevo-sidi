import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { ChangeDetectorRef } from "@angular/core";

@Component({
  templateUrl: 'tables.component.html'
})
export class TablesComponent {

  clients: any[];
  dataTable: any;

  constructor(private http: HttpClient, private chRef: ChangeDetectorRef) { }

  ngOnInit(){
    this.http.get('http://localhost:8000/api/administrative')
      .subscribe((data: any[]) => {
        this.clients = data;
        this.chRef.detectChanges();
        const table: any = $('table');
        this.dataTable = table.DataTable();
      });
  }

}
