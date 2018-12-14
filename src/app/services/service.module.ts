import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Http, Headers,Response,ResponseContentType  } from '@angular/http';
import { map } from 'rxjs/operators';
import * as globals from '../globals';

@Injectable()

export class Service {

  routes:any;

  constructor(private http:Http) { }

  public getAllMap(entity) {

    const url = globals.api + '/' + entity;

  /*return this.http.get(url, {headers:this.getHeaders()}).map((res: Response) => res)
      .catch(this.handleError);*/

     /* return this.http.get(url,{headers:this.getHeaders(),responseType: ResponseContentType.Blob})
      .map(response=>response.blob())
      .catch(error=>{return Observable.throw(error)})*/
      return this.http.get(url, {headers:this.getHeaders()}).map((res: any) => res)
      .catch(this.handleError);
}

private handleError (error: any) {
    return Observable.throw(error);
  }


  getAll(entity) {
    const url = globals.api + '/' + entity;
    return this.http.get(url, { headers: this.getHeaders() }).pipe(map((response: any) => response.json()));
  }

  getById(entity, id) {
    const url = globals.api + '/' + entity + '/' + id;
    return this.http.get(url, { headers: this.getHeaders() }).pipe(map((response: any) => response.json()));
  }

  getByIdMap(entity, info,filter) {
    const url = globals.api + '/' + entity + '/' + info + '/' + filter;
    return this.http.get(url, { headers: this.getHeaders() }).pipe(map((response: any) => response.json()));
  }

  saveOrUpdate(entity, data) {
    const url = globals.api + '/' + entity;
    if (data.id == null) {
      return this.http.post( url, JSON.stringify(data), { headers: this.getHeaders() }  )
      .pipe(map((response: any) => response.json()));
    } else {
      return this.http.put( url + '/' + data.id, JSON.stringify(data), { headers: this.getHeaders() }  )
      .pipe(map((response: any) => response.json()));
    }
  }

  postRequest(entity, data) {
    return new Promise((resolve, reject) => {
      const url = globals.api + '/' + entity;
      this.http.post( url, JSON.stringify(data), { headers: this.getHeaders() })
      .subscribe(res => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
    });
  }

  getRequest(entity, id?: any) {
    let url = globals.api + '/' + entity;
    if(id != null){
      url = globals.api + '/' + entity+ '/' + id;
    }
    return this.http.get(url, { headers: this.getHeaders() }).pipe(map((response: any) => response.json()));
  }

  delete(entity, id) {
    const url = globals.api + '/' + entity;
    return this.http.delete(url + '/' + id).pipe(map((response: any) => response.json()));
  }

  private getHeader() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization',  'Bearer ' + localStorage.getItem('id_token'));
    return headers;
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization',  'Bearer ' + localStorage.getItem('id_token'));
    return headers;
  }

}
