import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  static GET<T>(Url: string): Promise<T> {
    return fetch(environment.api + Url).then(response => response.json());
  }

  static POST<T>(Url: string, Data: any): Promise<T> {
    return fetch(environment.api + Url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Data)
    }).then(response => response.json());
  }

  static PUT<T>(Url: string, Data: any): Promise<T> {
    return fetch(environment.api + Url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Data)
    }).then(response => response.json());
  }
}
