import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsignadoService {
url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  add(data:any){
    return this.httpClient.post(this.url+
      "/equipoAsignado/add",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  update(data:any){
    return this.httpClient.patch(this.url+
      "/equipoAsignado/update",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }


  get(){
    return this.httpClient.get(this.url+"/equipoAsignado/get");
  }

  getUsersByArea(id:any){
    return this.httpClient.get(`${this.url}/equipoAsignado/getById/${id}`);
  }

  delete(asignadoId:any){
    return this.httpClient.delete(this.url+
      "/equipoAsignado/delete/"+asignadoId,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      })
  }
}
