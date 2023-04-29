import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoftwareService {
  url =environment.apiUrl;



  constructor(private httpClient:HttpClient ) { }

  getSoftware(){
    return this.httpClient.get(this.url+"/equipo/getSoftware");
  }

  updateSoftware(data:any){
    return this.httpClient.patch(this.url+
      "/equipo/updateSoftware",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }
}
