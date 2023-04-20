import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  url = environment.apiUrl;
  constructor(private httpClient:HttpClient) { }

  add(data:any){
    return this.httpClient.post(this.url+
      "/type/add",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  update(data:any){
    return this.httpClient.patch(this.url+
      "/type/update",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }


  getType(){
    return this.httpClient.get(this.url+"/type/get");
  }

  delete(typeId:any){
    return this.httpClient.delete(this.url+
      "/type/delete/"+typeId,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      })
  }
  
}
