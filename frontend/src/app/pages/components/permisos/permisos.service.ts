import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConfig } from 'src/app/appConfig';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  apiUrl = appConfig.apiUrl;
  constructor(private http: HttpClient) 
  { }

}
