import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  url = 'siec-production.up.railway.app';

  constructor(private httpClient:HttpClient) { }

  add(data:any){
    return this.httpClient.post(this.url+"/equipo/add",data,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  update(data:any){
    return this.httpClient.patch(this.url+
      "/equipo/update",data,{
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  getEquipment(){
    return this.httpClient.get(this.url+"/equipo/get");
  }

  updateStatus(data:any){
    return this.httpClient.patch(this.url+
      "/equipo/updateStatus/",data,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      })
  }

  delete(equipoId:any){
    return this.httpClient.delete(this.url+
    "/equipo/delete/"+equipoId,{
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  





}
