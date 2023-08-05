import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/User';
import { BehaviorSubject, map } from 'rxjs';
import { NewPassord } from '../_models/NewPassword';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = "https://localhost:5001/api/";

  usersList = new BehaviorSubject<User[]>([])
  usersList$ = this.usersList.asObservable()

  constructor(private http: HttpClient) { }

  getUsers() {

    return this.http.get<User[]>(this.baseUrl + 'users').subscribe({

      next: (users) => {

        this.usersList.next(users);
      }
    });

  }

  //Reset password made by admin
  resetPassword(newPassord: NewPassord) {

    return this.http.put<User>(this.baseUrl + 'users/resetPassword', newPassord);

  }


}
