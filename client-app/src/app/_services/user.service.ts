import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = "https://localhost:5001/api/";


  constructor(private http: HttpClient) { }

  getUser(id: string) {

    return this.http.get<User>(this.baseUrl + `users/${id}`)
  }


  addNewUser(user: User) {

    return this.http.post<User>(this.baseUrl + 'users/registration', user);

  }

  updateUser(user: User) {

    return this.http.put<User>(this.baseUrl + "users", user);
  }

}
