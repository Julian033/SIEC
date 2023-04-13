import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  url = 'http://localhost:8080';


  constructor(private httpClient:HttpClient) { }

  add(data:any){
    return this.httpClient.post(this.url+
      "/area/add",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  update(data:any){
    return this.httpClient.patch(this.url+
      "/area/update",data,{
      headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }


  getArea(){
    return this.httpClient.get(this.url+"/area/get");
  }
  
  delete(areaId:any){
    return this.httpClient.delete(this.url+
      "/area/delete/"+areaId,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      })
  }
}
