import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  signup(data: any) {
    return this.httpClient.post(this.url +
      "/user/signup/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  add(data: any) {
    return this.httpClient.post(this.url +
      "/user/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  forgotPassword(data: any) {
    return this.httpClient.post(this.url +
      "/user/forgotpassword/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  login(data: any) {
    return this.httpClient.post(this.url +
      "/user/login/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  checkToken() {
    return this.httpClient.get(this.url + "/user/checkToken");
  }

  changePassword(data: any) {
    return this.httpClient.post(this.url +
      "/user/changePassword", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  getUsers(){
    return this.httpClient.get(this.url+"/user/get");
  }

  delete(userId:any){
    return this.httpClient.delete(this.url+
    "/user/delete/"+userId,{
      headers: new HttpHeaders().set('Content-Type',"application/json")
    })
  }

  updateStatus(data:any){
    return this.httpClient.patch(this.url+
      "/user/updateStatus/",data,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      })
  }

  update(data:any){
    return this.httpClient.patch(this.url+
      "/user/update",data,{
        headers: new HttpHeaders().set('Content-Type',"application/json")
      })
  }


}
