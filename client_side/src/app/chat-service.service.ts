import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})

export class ChatServiceService {
  url= 'http://localhost:3000/users'
  urls ='http://localhost:3000/chat'
  constructor(private http:HttpClient) { }

  add(data: any) : Observable<any>{
    console.log("data from the service component",data)
    return  this.http.post(`${this.url}`,data);
   
  }
  addchat(data:any): Observable<any>{
    console.log("data from the service component addchat",data)
    return  this.http.post(`${this.urls}`,data);
   
  }
  get() : Observable<any>{
    return this.http.get(`${this.url}`);

  }
  getOne(id): Observable<any>{
    console.log("name--",id)
    return this.http.get(`${this.url}/${id}`);

  }
}
