import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {GetRobotsResponse} from "./types/GetRobotsResponse";
import {GetApplicationsResponse} from "./types/GetApplicationsResponse";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `http://${environment.apiHost}:${environment.apiPort}`

  constructor(private http: HttpClient) { }

  getRobots(){
    const path = "pyicub"
    return this.http.get<GetRobotsResponse>(`${this.baseUrl}/${path}`);
  }

  getApplications(robotName:string){
    const path = `pyicub/${robotName}`;
    return this.http.get<GetApplicationsResponse>(`${this.baseUrl}/${path}`)
  }


}
