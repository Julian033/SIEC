import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url = 'http://localhost:8080';
  constructor(private httpClient:HttpClient) { }


  getDetails(){
    return this.httpClient.get(this.url + "/dashboard/details/");
  }
}
